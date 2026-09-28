/* King of the hill — how long a guild keeps a coveted MVP.
 *
 * Robert, 2026-09-28: holding power depends on the guild (renown, how it
 * treats members, its personality). Rivals poach by gold, a bigger stage,
 * through the MVP's friends, or sabotage; a rare knife for a star they
 * can't pry loose. What an MVP wants beyond the basics comes from their
 * personality (traits). NPC guilds only — Brutus's permanent members can be
 * targeted but never taken (not simulated here: Brutus isn't in the loop).
 *
 * Runs inside market.visit() after everyone's choices. Reads the GUILDS
 * data (holds / loses / poaches / allies / feuds) from market.js.
 */
(function (root) {
  'use strict';
  var MVP_FAME = 60;           // coveted threshold
  var KNIFE_AFTER = 2;         // failed poaches before an evil rival considers it
  var KNIFE_CHANCE = 0.12;

  function has(p, t) { return p.traits.indexOf(t) !== -1; }
  function inGuild(s, gid) {
    var out = []; for (var id in s.roster) if (s.roster[id].m.guild === gid) out.push(s.roster[id]); return out;
  }
  function friendsOf(s, id) {
    return s.ledger.rows.filter(function (r) { return r.from === id && r.tag === 'old-ties' && s.roster[r.to]; })
                        .map(function (r) { return s.roster[r.to]; });
  }

  // How firmly the holder keeps this MVP. ~0.2 shaky, ~0.6 solid.
  function holdScore(s, p) {
    var m = p.m, g = s.guilds[m.guild], mates = inGuild(s, g.id).filter(function (q) { return q !== p; });
    var h = 0.25 + g.renown / 200;                                        // strength
    p.traits.forEach(function (t) {                                        // treatment + guild personality
      if (g.holds.indexOf(t) !== -1) h += 0.15;
      if (g.loses.indexOf(t) !== -1) h -= 0.15;
    });
    // personality needs
    if (has(p, 'proud') && mates.some(function (q) { return q.m.fame > m.fame; })) h -= 0.2;     // top billing
    if (has(p, 'kind') && mates.some(function (q) { return q.tier < p.tier; })) h += 0.1;        // being needed
    if (has(p, 'pragmatic') && g.renownDelta < 0) h -= 0.15;                                      // winning
    if (has(p, 'reckless') && g.leaning !== 'good' && g.id === 'iron') h -= 0.1;                  // rules bore them
    if (friendsOf(s, p.id).some(function (f) { return f.m.guild === g.id; })) h += 0.2;           // friends here
    if (m.dom === 'strongGuild') h += (g.renown - 50) / 200;
    return h;
  }

  function pull(s, p, rival, method) {
    var m = p.m, holder = s.guilds[m.guild];
    if (method === 'gold')    return rival.renown / 300 + (has(p, 'greedy') ? 0.3 : 0) + (m.dom === 'gold' ? 0.2 : 0);
    if (method === 'stage')   return (rival.renown - holder.renown) / 100 + (has(p, 'proud') ? 0.2 : 0) + (m.dom === 'strongGuild' ? 0.2 : 0);
    if (method === 'friends') {
      var f = friendsOf(s, p.id).some(function (q) { return q.m.guild === rival.id; });
      return f ? 0.45 + (m.dom === 'friends' ? 0.3 : 0) : 0;
    }
    if (method === 'none')    return s.rand() < 0.03 ? 1 : 0;            // Muddy Boots upset
    return 0;
  }

  function headline(s, p, kind, text) {
    s.news.push({ visit: s.visit, id: p ? p.id : null, named: p ? !!p.sheet : false, kind: kind, text: text });
  }

  function run(s, capOf) {
    s.koth = s.koth || { tenures: [], windows: 0, knives: 0, poaches: 0, sabotage: 0, hostility: {} };
    var K = s.koth, r = s.rand;
    for (var gid in s.guilds) {                                            // track trend for pragmatic MVPs
      var g0 = s.guilds[gid];
      g0.renownDelta = g0.renown - (g0.lastRenown == null ? g0.renown : g0.lastRenown);
      g0.lastRenown = g0.renown;
    }
    Object.keys(s.roster).forEach(function (id) {
      var p = s.roster[id];
      if (!p || !p.alive) return;
      var m = p.m;
      if (!m.guild || m.fame < MVP_FAME) return;
      if (m.heldSince == null || m.heldBy !== m.guild) { m.heldSince = s.visit; m.heldBy = m.guild; m.failedOn = {}; }
      if (s.visit - m.heldSince < 1) return;                              // settling-in grace: one visit
      var holder = s.guilds[m.guild], hold = holdScore(s, p);
      var rivals = Object.keys(s.guilds).map(function (k) { return s.guilds[k]; }).filter(function (g) {
        return g.alive && g.id !== holder.id && holder.allies.indexOf(g.id) === -1 && m.fame >= g.bar;
      });
      var won = null, how = null;
      rivals.forEach(function (g) {
        if (won) return;
        var feud = holder.feuds.indexOf(g.id) !== -1;
        var tryChance = 0.35 + (m.fame - MVP_FAME) / 100 + (feud ? 0.25 : 0);
        if (r() >= tryChance) return;
        if (g.poaches === 'sabotage') {                                    // weaken the holder instead
          if (r() > 0.35) return;                                           // they pick their moments
          holder.renown = Math.max(0, holder.renown - 6); K.sabotage++;
          if (has(p, 'cautious')) m.shaken = (m.shaken || 0) + 0.15;
          headline(s, p, 'sabotage', holder.name + "'s run goes wrong. Nobody can prove who did it");
        } else if (capOf(g.id)) {
          var pl = pull(s, p, g, g.poaches) + (r() - 0.5) * 0.3;
          if (pl > hold - (m.shaken || 0)) { won = g; how = g.poaches; }
          else m.failedOn[g.id] = (m.failedOn[g.id] || 0) + 1;
        }
        // the rare knife: an evil rival that keeps failing
        if (!won && g.leaning === 'evil' && (m.failedOn[g.id] || 0) >= KNIFE_AFTER && r() < KNIFE_CHANCE) {
          K.knives++;
          if (holder.renown >= 50) {
            headline(s, p, 'knife', 'Someone went for ' + p.name + ' in the dark. ' + holder.name + ' was ready');
          } else {
            p.alive = false; p.causeOfDeath = 'knifed (' + g.name + ')';
            headline(s, p, 'died', p.name + ' is found dead. Everyone suspects ' + g.name);
            won = 'dead';
          }
        }
      });
      if (won === 'dead') { K.tenures.push({ guild: holder.id, visits: s.visit - m.heldSince }); return; }
      if (won) {
        K.tenures.push({ guild: holder.id, visits: s.visit - m.heldSince });
        K.poaches++;
        m.guild = won.id; m.heldSince = s.visit; m.heldBy = won.id; m.failedOn = {}; m.shaken = 0;
        var label = { gold: 'a bigger purse', stage: 'a bigger stage', friends: 'old friends', none: 'nobody knows why' }[how];
        headline(s, p, 'poached', p.name + ' leaves ' + holder.name + ' for ' + won.name + ' (' + label + ')');
        for (var k2 in s.guilds) if (k2 !== won.id) K.hostility[k2 + '>' + won.id] = (K.hostility[k2 + '>' + won.id] || 0) + 1;
        return;
      }
      // Nobody won, but a miserable star walks: the window Brutus needs.
      if (hold - (m.shaken || 0) < 0.25 && r() < 0.5) {
        K.tenures.push({ guild: holder.id, visits: s.visit - m.heldSince });
        K.windows++;
        headline(s, p, 'window', p.name + ' walks out of ' + holder.name + '. Open to offers');
        m.guild = null; m.freeFor = 0; m.heldSince = null; m.shaken = 0;
      }
    });
  }

  var API = { run: run, holdScore: holdScore, MVP_FAME: MVP_FAME };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_KOTH = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
