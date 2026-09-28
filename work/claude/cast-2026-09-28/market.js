/* Labor market — one visit at a time. Robert, 2026-09-28:
 *   "Deaths are not a target. Volatility of the market and people making
 *    choices." Named deaths depend on tier and traits, the player's choices
 *    to a lesser extent.
 *
 * Each visit every adventurer makes ONE visible choice, driven by their
 * dominant desire, fortune and traits. Outcomes mostly move FORTUNE and
 * FAME; desires shift with fortunes; guilds recruit, rise and collapse.
 * Death happens when someone chooses a floor past their tier — so a broke
 * tier-2 is in danger and a tier-5 mostly isn't. Guild members are
 * protected; free agents are not.
 *
 * Builds on castState.seedFromCast (named cast + ledger ties). Does NOT use
 * advanceWave's mortality and does NOT touch adventurers.js or builds/.
 */
(function (root) {
  'use strict';
  var req = typeof require === 'function';
  var OW = req ? require('../overworld-2026-09-18/adventurers.js') : root.OW;
  var CS = req ? require('./castState.js') : root.OW_CAST_STATE;

  // 7 rival guilds, one per region (Robert, 2026-09-28: "one guild for every
  // region", all 7 in the playtest). bar = fame needed to be accepted.
  // leaning / likes / allies / feuds are data for king-of-the-hill (not built).
  var GUILDS = [
    { id: 'iron',    name: 'The Iron Oath',          region: 'Reyjar',    leaning: 'between', renown: 75, bar: 55,
      holds: ['proud', 'pragmatic'], loses: ['reckless', 'kind'],  poaches: 'stage',    allies: ['gilt'],            feuds: ['mud', 'crown'] },
    { id: 'lantern', name: 'Lantern Company',        region: 'Marium',    leaning: 'good',    renown: 55, bar: 35,
      holds: ['kind', 'cautious'],    loses: ['greedy', 'proud'],  poaches: 'friends',  allies: ['mud'],             feuds: ['gilt'] },
    { id: 'mud',     name: 'Muddy Boots',            region: 'Beloufi',   leaning: 'good',    renown: 20, bar: 0,
      holds: ['reckless', 'kind'],    loses: ['greedy', 'cautious'], poaches: 'none',   allies: ['lantern'],         feuds: ['iron'] },
    { id: 'pim',     name: "Saint Pim's Rescue Brigade", region: 'Ayusti', leaning: 'good',   renown: 35, bar: 10,
      holds: ['kind', 'reckless'],    loses: ['cautious', 'greedy'], poaches: 'friends', allies: ['gilt'],           feuds: ['candle'] },
    { id: 'gilt',    name: 'Gilt Hand',              region: 'Li Trice',  leaning: 'evil',    renown: 50, bar: 30,
      holds: ['greedy'],              loses: ['vengeful', 'kind'], poaches: 'gold',     allies: ['iron', 'pim'],     feuds: ['lantern'] },
    { id: 'candle',  name: 'The Black Candle',       region: 'Edinius',   leaning: 'evil',    renown: 40, bar: 20,
      holds: ['vengeful', 'cautious'], loses: ['proud'],           poaches: 'sabotage', allies: ['crown'],           feuds: ['pim'] },
    { id: 'crown',   name: 'The Hollow Crown',       region: 'Themelios', leaning: 'evil',    renown: 60, bar: 45,
      holds: ['proud'],               loses: ['kind', 'reckless'], poaches: 'stage',    allies: ['candle'],          feuds: ['iron'] }
  ];
  var TOWN = 10, FREE_AGENT_LIMIT = 6, GUILD_CAP = 2;

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function dominant(d) { return Object.keys(d).sort(function (x, y) { return d[y] - d[x]; })[0]; }
  function has(p, t) { return p.traits.indexOf(t) !== -1; }
  function norm(d) {
    var s = d.gold + d.strongGuild + d.friends, k = 100 / s;
    d.gold = Math.round(d.gold * k); d.strongGuild = Math.round(d.strongGuild * k);
    d.friends = 100 - d.gold - d.strongGuild;
  }

  // Market fields for anyone in the roster (named from sheet, newcomers rolled).
  function ensure(s, p) {
    if (p.m) return p.m;
    var sh = p.sheet, r = s.rand;
    var g = 20 + Math.floor(r() * 60), sg = Math.floor(r() * (100 - g));
    p.m = {
      fortune: sh ? sh.fortune : 10 + Math.floor(r() * 40),
      fame:    sh ? sh.fame    : 5 + p.tier * 8 + Math.floor(r() * 10),
      desires: sh ? { gold: sh.desires.gold, strongGuild: sh.desires.strongGuild, friends: sh.desires.friends }
                  : { gold: g, strongGuild: sg, friends: 100 - g - sg },
      guild: null, freeFor: 0, hurt: false, named: !!sh
    };
    p.m.dom = dominant(p.m.desires);
    return p.m;
  }

  function friendsOf(s, id) {
    return s.ledger.rows.filter(function (r) { return r.from === id && r.tag === 'old-ties' && s.roster[r.to]; })
                        .map(function (r) { return s.roster[r.to]; });
  }

  function members(s, gid) {
    var n = 0; for (var id in s.roster) if (s.roster[id].m && s.roster[id].m.guild === gid) n++; return n;
  }

  function newMarket(seed) {
    var s = CS.seedFromCast(seed);
    s.guilds = {};
    GUILDS.forEach(function (g) { var c = JSON.parse(JSON.stringify(g)); c.alive = true; s.guilds[g.id] = c; });
    s.visit = 0; s.news = [];
    for (var id in s.roster) ensure(s, s.roster[id]);
    return s;
  }

  function headline(s, p, kind, text) {
    s.news.push({ visit: s.visit, id: p ? p.id : null, named: p ? !!p.sheet : false, kind: kind, text: text });
  }

  // ------------------------------------------------------------ choice --
  function choose(s, p) {
    var m = p.m, fr = friendsOf(s, p.id);
    if (m.hurt) return { act: 'lay-low' };
    if (m.guild) {
      var g0 = s.guilds[m.guild];
      if (m.dom === 'gold' && m.fortune < 15 && g0.renown < 50) return { act: 'leave', why: 'not paying' };
      if (m.dom === 'strongGuild' && g0.renown < 30) return { act: 'leave', why: 'going nowhere' };
    }
    if (m.dom === 'friends' && fr.length) {
      var f = fr[0];
      if (f.m.guild && f.m.guild !== m.guild) return { act: 'join', guild: f.m.guild, why: 'follow ' + f.name };
      if (f.m.lastDepth) return { act: 'delve', depth: f.m.lastDepth, why: 'with ' + f.name };
    }
    if (!m.guild && (m.dom === 'strongGuild' || m.freeFor >= 3)) {
      var best = bestGuild(s, p);
      if (best) return { act: 'join', guild: best.id };
      return { act: 'delve', depth: p.tier + 1, why: 'chasing a name' };   // get noticed first
    }
    if (has(p, 'cautious') && m.fortune > 40) return { act: 'lay-low' };
    var depth = p.tier;
    if (m.fortune < 15) depth = Math.max(depth, 3);        // desperation ignores tier
    if (has(p, 'reckless')) depth += 1;
    if (has(p, 'cautious')) depth = Math.max(1, depth - 1);
    if (has(p, 'greedy') && m.dom === 'gold') depth += 1;
    return { act: 'delve', depth: depth };
  }

  function bestGuild(s, p) {
    var m = p.m, d = m.desires, best = null, bestScore = -1;
    for (var k in s.guilds) {
      var g = s.guilds[k];
      if (!g.alive || m.fame < g.bar || g.id === m.guild || members(s, g.id) >= GUILD_CAP) continue;
      var friendsIn = friendsOf(s, p.id).some(function (f) { return f.m.guild === g.id; }) ? 1 : 0;
      var score = d.strongGuild * g.renown / 100 + d.friends * friendsIn + d.gold * g.renown / 200;
      if (score > bestScore) { best = g; bestScore = score; }
    }
    return best;
  }

  // ----------------------------------------------------------- resolve --
  function resolve(s, p, c) {
    var m = p.m, r = s.rand;
    m.hurt = false; m.lastDepth = null;
    if (c.act === 'lay-low') { m.fortune = Math.max(0, m.fortune - 5); return; }
    if (c.act === 'leave') {
      headline(s, p, 'left', p.name + ' walks out of ' + s.guilds[m.guild].name + ' (' + c.why + ')');
      m.guild = null; m.freeFor = 0; return;
    }
    if (c.act === 'join') {
      var g = s.guilds[c.guild];
      if (g && g.alive && m.fame >= g.bar && members(s, g.id) < GUILD_CAP) {
        m.guild = g.id; m.freeFor = 0;
        headline(s, p, 'joined', p.name + ' joins ' + g.name + (c.why ? ' (' + c.why + ')' : ''));
      }
      return;
    }
    // delve
    var over = Math.max(0, c.depth - p.tier);
    m.lastDepth = c.depth;
    var protect = m.guild ? 0.5 : 1;
    var disaster = (0.01 + 0.05 * over * over) * protect;
    var roll = r();
    if (roll < disaster) {
      if (over >= 2 || (over >= 1 && !m.guild && r() < 0.5)) {
        p.alive = false; p.causeOfDeath = 'floor ' + c.depth + ' at tier ' + p.tier;
        headline(s, p, 'died', p.name + ' does not come back from floor ' + c.depth);
      } else {
        m.hurt = true; m.fortune = Math.max(0, m.fortune - 15); m.fame = Math.max(0, m.fame - 5);
        headline(s, p, 'hurt', p.name + ' is carried out of floor ' + c.depth);
      }
      return;
    }
    var success = 0.75 - 0.15 * over;
    if (r() < success) {
      var haul = Math.round(c.depth * (8 + r() * 14));
      m.fortune += haul; m.fame = clamp(m.fame + c.depth * 2 + (over ? 4 : 0), 0, 100);
      if ((over >= 1 && haul >= 40) || haul >= 80) headline(s, p, 'haul', p.name + ' hauls ' + haul + ' coins off floor ' + c.depth);
      if (m.guild) s.guilds[m.guild].renown = clamp(s.guilds[m.guild].renown + c.depth, 0, 100);
    } else {
      m.fortune = Math.max(0, m.fortune - 10); m.fame = Math.max(0, m.fame - 2);
      if (r() < 0.25) headline(s, p, 'bust', p.name + ' comes back empty-handed');
    }
  }

  // ----------------------------------------------------- desire drift --
  function drift(s, p) {
    var m = p.m, d = m.desires, before = m.dom;
    if (m.fortune < 15) d.gold += 10;
    if (m.fortune > 120) { d.gold = Math.max(5, d.gold - 10); d.strongGuild += 10; }
    if (m.lostFriend) { d.friends = Math.max(5, d.friends - 20); d.strongGuild += 20; m.lostFriend = false; }
    norm(d); m.dom = dominant(d);
    if (m.dom !== before && m.named) headline(s, p, 'shift', p.name + ' now wants ' + m.dom + ' most (was ' + before + ')');
  }

  // ------------------------------------------------------------- visit --
  function visit(s) {
    s.visit += 1;
    var ids = Object.keys(s.roster);
    ids.forEach(function (id) { var p = s.roster[id]; ensure(s, p); resolve(s, p, choose(s, p)); });

    ids.forEach(function (id) {
      var p = s.roster[id];
      if (p.alive) return;
      friendsOf(s, id).forEach(function (f) { f.m.lostFriend = true; });
      if (p.m.guild) s.guilds[p.m.guild].renown = clamp(s.guilds[p.m.guild].renown - (p.sheet ? 8 : 4), 0, 100);
      s.ledger.forget(id); delete s.roster[id];
    });

    for (var id in s.roster) {
      var p = s.roster[id];
      drift(s, p);
      if (!p.m.guild) {
        p.m.freeFor += 1;
        if (!p.sheet && p.m.freeFor > FREE_AGENT_LIMIT) {            // unprotected too long
          headline(s, p, 'vanished', p.name + ' has not been seen in days');
          delete s.roster[id];
        }
      }
    }

    for (var k in s.guilds) {                                          // guilds rise and fall
      var g = s.guilds[k];
      if (!g.alive) continue;
      g.renown = clamp(g.renown - 3, 0, 100);
      if (g.renown < 10) {
        g.alive = false;
        headline(s, null, 'collapse', g.name + ' collapses');
        for (var id2 in s.roster) if (s.roster[id2].m.guild === g.id) s.roster[id2].m.guild = null;
      }
    }

    var before = Object.keys(s.roster).length;
    OW.repopulate(s, TOWN);                                           // unnamed newcomers
    for (var id3 in s.roster) ensure(s, s.roster[id3]);
    return s.news.filter(function (n) { return n.visit === s.visit; });
  }

  var API = { GUILDS: GUILDS, members: members, newMarket: newMarket, visit: visit, choose: choose, bestGuild: bestGuild };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_MARKET = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
