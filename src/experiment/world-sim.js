/* Personality experiment: the overworld as a weekly simulation (Robert, 2026-10-23..25).
 *
 * One region, about 240 people and 10 guilds. Each week:
 *   economy   ranks D-S, purses, living costs, dues, dungeon hauls, deaths, promotions and falls
 *   hungers   each of the 11 personality types has one hunger that grows every week and is fed by
 *             dealing with someone: cooperation if the predisposition toward them is Drawn/Flock,
 *             conflict if Wary/Hates/Rival
 *   stakes    A/S adventurers (and Brutus) buy stakes in lower ranks for 25% of hauls over 26 weeks;
 *             how the backed person feels about the backer decides gifts or betrayal
 *   crime     big-city rates; chronic offenders; most crime unsolved; wrong suspects
 *   intrigue  secrets (honey traps, affairs, moles, rigged duels, skimmed hauls) that leak and blow up
 *   guilds    leaders set dues and behaviour; coups; successions; purges
 *   riots     when a third of the region is broke
 *   labor     walkouts, signings, poaching, free agents falling to the slums, guilds folding and founding
 *   refill    the slums first, then newcomers and heirs
 * Every deed is an event with a `because` link to the event that caused it.
 * Design: Claude doc "Brutus Financial System Design". Model tuned in Python first (same numbers).
 * Works in node (module.exports) and the browser (window.PXSim). State is plain JSON (save/load).
 */
(function (root) {
  'use strict';

  var RANKS = 'DCBAS';
  // delve chance, mean haul, sigma, living, wear/delve, injury chance, injury cost, protection, death/delve, sponsor own share
  var P = {
    D: [.45, 1500, .7, 340, 290, .16, 770, 0, .012, 0],
    C: [.45, 7000, .7, 1530, 1220, .16, 3300, 0, .009, 200],
    B: [.45, 30000, .8, 4100, 4700, .16, 13000, 1600, .007, 1500],
    A: [.40, 110000, .8, 14000, 10000, .15, 33000, 4900, .004, 20000],
    S: [.35, 400000, .9, 39000, 24000, .14, 87000, 17000, .003, 120000]
  };
  var PROMO = { D: [.05, 10], C: [.02, 12], B: [.008, 12], A: [.003, 12] };
  var TYPES = ['Proud', 'Ambitious', 'Loyal', 'Greedy', 'Pragmatic', 'Cautious', 'Reckless', 'Kind', 'Vengeful', 'Demanding', 'Masochist'];
  var MATRIX = [
    'R F D W H W F W F H D', 'F R F W F H W D W F F', 'D F F H W F W F W D F', 'W F H R F W F D H W F',
    'H F F F F F D W H F W', 'W H F W F F D F W H W', 'F W F F H D F W F W F', 'W F F W W F F F D H W',
    'F W F H H W F D F W W', 'H F D W F H W H W R D', 'F F W F W H F H F D R'];
  var PRED = {};
  MATRIX.forEach(function (line, i) { line.split(' ').forEach(function (c, j) { PRED[TYPES[i] + '>' + TYPES[j]] = c; }); });
  var START = { D: 40, F: 20, R: -15, W: -15, H: -40 };
  var DUES = { Greedy: .32, Demanding: .25, Ambitious: .22, Proud: .2, Pragmatic: .2, Vengeful: .2, Reckless: .18, Masochist: .25, Loyal: .15, Cautious: .15, Kind: .1 };
  var PROP = { Greedy: [2.5, 1], Vengeful: [1, 2.5], Reckless: [1.5, 1.8], Proud: [.8, 1.6], Demanding: [1, 1.4], Masochist: [1, 1.3], Pragmatic: [1.2, .6], Ambitious: [1.1, .9], Loyal: [.6, .8], Cautious: [.4, .4], Kind: [.25, .3] };
  var CLEAR = { theft: .12, burglary: .13, fraud: .23, robbery: .23, assault: .41, murder: .52 };
  var SIZE = { Ambitious: 28, Greedy: 28, Proud: 24, Demanding: 22, Pragmatic: 22, Reckless: 20, Vengeful: 20, Masochist: 18, Loyal: 16, Cautious: 15, Kind: 18 };
  var POACHER = { Ambitious: .5, Greedy: .5, Pragmatic: .4, Proud: .35, Demanding: .3, Vengeful: .3, Reckless: .25, Masochist: .2, Cautious: .1, Kind: .05, Loyal: 0 };
  var SYL1 = ['Ves', 'Mab', 'Iv', 'Al', 'Hask', 'Ren', 'Tor', 'Sel', 'Dar', 'Ny', 'Cal', 'Orr', 'Bel', 'Kes', 'Lio', 'Wren', 'Fen', 'Ula', 'Pim', 'Rho', 'Sab', 'Teo', 'Yar', 'Zel', 'Bram', 'Ines', 'Odo', 'Quill', 'Ash', 'Gil'];
  var SYL2 = ['na', 'el', 'o', 'ric', 'ine', 'as', 'eth', 'ora', 'is', 'and', 'ette', 'ius', 'ka', 'mir', 'wyn', 'ez', 'ard', 'ille', 'ot', 'umbe'];
  var GUILD_NAMES = ['the Ironhall', 'the Black Candle', 'Hearth & Hammer', 'the Gilded Ledger', 'the Quiet Tally', 'Wolfsguard', 'Tidebound Circle', 'the Long Watch', 'Bright Harbor', 'the Iron Oath'];
  var NEW_GUILDS = ['the Crimson Purse', 'Saltgate Company', 'the Last Lantern', 'Ashwell & Sons', 'the Pale Banner', 'the Copper Crown', 'Ninefold Compact', 'the Fair Exchange', 'Sable Coast Company', 'the Rising Chorus'];
  var NEG = {};
  ('crime accusation assault murder swindle humiliation undercut revenge crackdown betrayal report brawl callout exposed blackmail ' +
   'scapegoat walkout purge coup riot snub fall ruin defection hostile inherit heir duel twist switch odd conflict').split(' ').forEach(function (k) { NEG[k] = 1; });
  var BRUTUS = 'B';            // Brutus takes part as a backer only
  var BRUTUS_TYPE = 'Proud';   // a crass, discarded, arrogant noble: others read him as they read the Proud

  // ---------------------------------------------------------------- rng (mulberry32, state kept in the world)
  function R(w) {
    var a = (w.rng = (w.rng + 0x6D2B79F5) | 0);
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function uni(w, a, b) { return a + (b - a) * R(w); }
  function randint(w, a, b) { return a + Math.floor(R(w) * (b - a + 1)); }
  function choice(w, xs) { return xs[Math.floor(R(w) * xs.length) % xs.length]; }
  function weighted(w, xs, ws) { var t = 0, i; for (i = 0; i < ws.length; i++) t += ws[i]; var r = R(w) * t; for (i = 0; i < xs.length; i++) { r -= ws[i]; if (r < 0) return xs[i]; } return xs[xs.length - 1]; }
  function sample(w, xs, k) { var a = xs.slice(), out = []; while (out.length < k && a.length) out.push(a.splice(Math.floor(R(w) * a.length), 1)[0]); return out; }
  function lognorm(w, mu, sigma) { var u1 = Math.max(1e-12, R(w)), u2 = R(w); return Math.exp(mu + sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)); }
  function maxBy(xs, f) { var b = null, bv = -Infinity; xs.forEach(function (x) { var v = f(x); if (v > bv) { bv = v; b = x; } }); return b; }
  function minBy(xs, f) { return maxBy(xs, function (x) { return -f(x); }); }
  function ri(r) { return RANKS.indexOf(r); }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

  function cost(p) { var r = P[p.rank]; return r[3] + r[7]; }
  function value(p) { return (ri(p.rank) + 1) * (ri(p.rank) + 1) * 10 + p.fame; }

  // ---------------------------------------------------------------- world
  function create(seed, opts) {
    opts = opts || {};
    var w = { v: 1, seed: seed >>> 0, rng: seed >>> 0, week: 0, n0: opts.population || 240, people: [], guilds: [], events: [], secrets: [], stakes: [],
      used: {}, cool: 0, brutus: { gold: opts.gold == null ? 250000 : opts.gold, rep: 0 },
      M: { deaths: 0, dropouts: 0, arrivals: 0, riots: 0, coups: 0, crimes: 0, murders: 0, schemes: 0, exposed: 0, stakes: 0, devoted: 0, hostile: 0, snubs: 0, promos: 0, demos: 0,
        signings: 0, poaches: 0, walkouts: 0, collapses: 0, foundings: 0, to_slums: 0 },
      series: { pop: [], strained: [], guilds: [], free: [] } };
    var i;
    for (i = 0; i < w.n0; i++) { var r = weighted(w, RANKS.split(''), [50, 28, 14, 6, 2]); person(w, r, P[r][3] * uni(w, 2, 10)); }
    GUILD_NAMES.forEach(function (n, gi) { w.guilds.push({ id: gi, name: n, leader: null, treasury: uni(w, 5e4, 6e5), dead: false }); });
    w.people.forEach(function (p) { if (R(w) < .8) p.guild = Math.floor(R(w) * w.guilds.length); });
    w.guilds.forEach(function (g) { var mem = w.people.filter(function (p) { return p.guild === g.id; }); if (mem.length) g.leader = maxBy(mem, function (p) { return ri(p.rank) * 10 + p.fame; }).id; });
    for (i = 0; i < 40; i++) { var ab = sample(w, w.people, 2); addKin(ab[0], ab[1]); }
    for (i = 0; i < 30; i++) {
      var c = sample(w, w.people, 2), a = c[0], b = c[1];
      if (a.lover == null && b.lover == null && a.kin.indexOf(b.id) < 0) { a.lover = b.id; b.lover = a.id; adj(w, a, b, 50); adj(w, b, a, 50); }
    }
    return w;
  }
  function addKin(a, b) { if (a.kin.indexOf(b.id) < 0) a.kin.push(b.id); if (b.kin.indexOf(a.id) < 0) b.kin.push(a.id); }

  function name(w) {
    for (var k = 0; k < 200; k++) { var n = choice(w, SYL1) + choice(w, SYL2); if (!w.used[n]) { w.used[n] = 1; return n; } }
    var m = choice(w, SYL1) + choice(w, SYL2) + ' ' + choice(w, ['the Younger', 'the Second', 'of the Docks', 'Halfhand']); w.used[m] = 1; return m;
  }
  function person(w, rank, purse, type, why) {
    var p = { id: w.people.length, name: name(w), type: type || choice(w, TYPES), rank: rank, purse: purse == null ? P[rank][3] * uni(w, 2, 8) : purse,
      guild: null, alive: true, slums: false, jail: 0, broke: 0, fame: { D: 2, C: 8, B: 25, A: 60, S: 120 }[rank] * uni(w, .5, 1.5), rep: 0,
      feel: {}, kin: [], lover: null, hunger: uni(w, 0, 40), crimes: 0, bent: lognorm(w, 0, 1.1), last: why == null ? null : why, hit: 0, grudge: {},
      spare: 0, unguilded: 0, born: w.week };
    w.people.push(p);
    return p;
  }
  function typeOf(w, id) { return id === BRUTUS ? BRUTUS_TYPE : w.people[id].type; }
  function feel(w, a, bid) {
    if (typeof bid === 'object') bid = bid.id;
    if (a.feel[bid] == null) a.feel[bid] = START[PRED[a.type + '>' + typeOf(w, bid)]] + uni(w, -10, 10);
    return a.feel[bid];
  }
  function adj(w, a, b, d) { var id = typeof b === 'object' ? b.id : b; a.feel[id] = Math.max(-100, Math.min(100, feel(w, a, id) + d)); }
  function alive(w) { return w.people.filter(function (p) { return p.alive; }); }
  function live(w) { return w.guilds.filter(function (g) { return !g.dead; }); }
  function gname(w, g) { return g == null ? 'no guild' : w.guilds[g].name; }
  function leader(w, g) { if (g == null) return null; var id = w.guilds[g].leader; return id == null ? null : w.people[id]; }

  function ev(w, text, actors, because, kind, weight, extra) {
    actors = actors.filter(function (a) { return a; });
    var e = { id: w.events.length, week: w.week, text: text, actors: actors.map(function (a) { return a.id; }), because: because == null ? null : because,
      kind: kind || 'deed', weight: weight == null ? 1 : weight, fame: actors.reduce(function (s, a) { return s + (a.fame || 0); }, 0) };
    if (extra) for (var k in extra) e[k] = extra[k];
    w.events.push(e);
    actors.forEach(function (a) { if (a.id !== BRUTUS) a.last = e.id; });
    return e.id;
  }
  function why(w, p) {
    if (p.last == null) return null;
    var e = w.events[p.last];
    return (w.week - e.week <= 3 && NEG[e.kind]) ? p.last : null;
  }

  function ripple(w, victim, actor, amount, because) {
    alive(w).forEach(function (q) {
      if (q === victim || q === actor) return;
      var wgt = victim.kin.indexOf(q.id) >= 0 ? 1 : q.lover === victim.id ? .75 : feel(w, q, victim) > 40 ? .5 : (q.guild != null && q.guild === victim.guild) ? .25 : 0;
      if (wgt) {
        adj(w, q, actor, -amount * wgt);
        if (q.hunger > 60 && feel(w, q, actor) < -50 && R(w) < .15 * wgt) q.grudge[actor.id] = because;
      }
    });
  }
  function inherit(w, dead, because) {
    var heirs = dead.kin.map(function (i) { return w.people[i]; }).filter(function (p) { return p.alive; });
    var killer = w.events[because].actors.filter(function (a) { return a !== dead.id && a !== BRUTUS; }).map(function (a) { return w.people[a]; })[0];
    if (heirs.length) {
      var h = heirs[0]; h.purse += Math.max(0, dead.purse);
      if (killer) { h.grudge[killer.id] = because; adj(w, h, killer, -60); }
      ev(w, h.name + ' inherits what ' + dead.name + ' left behind' + (killer ? ', and a reason to hate ' + killer.name + '.' : '.'), [h], because, 'inherit', .6);
    } else if (dead.guild != null) w.guilds[dead.guild].treasury += Math.max(0, dead.purse);
    if (dead.guild != null && w.guilds[dead.guild].leader === dead.id) w.guilds[dead.guild].leader = null;
    if (R(w) < .3) {
      var n = person(w, 'D', P.D[3] * 2, choice(w, ['Vengeful', 'Vengeful', 'Loyal', 'Proud']), because);
      addKin(n, dead);
      if (killer) n.grudge[killer.id] = because;
      ev(w, n.name + ', ' + dead.name + "'s kin, arrives in town and signs up.", [n], because, 'heir', .7);
    }
  }
  function secret(w, schemer, target, kind, text, because, third) {
    w.secrets.push({ schemer: schemer.id, target: target.id, kind: kind, text: text, age: 0, out: false, because: because == null ? null : because, third: third == null ? null : third });
  }

  // ---------------------------------------------------------------- one week
  function step(w) {
    w.week++;
    var A = alive(w), M = w.M;
    // economy
    var shock = R(w) < 1 / 6 ? uni(w, 1.2, 1.5) : 1;
    if (shock > 1) ev(w, 'Prices jump ' + Math.round((shock - 1) * 100) + '% across the region this week.', [], null, 'world', .5);
    live(w).forEach(function (g) {
      var hall = A.filter(function (p) { return p.guild === g.id; }).reduce(function (s, p) { return s + cost(p); }, 0) * .35;
      g.treasury -= hall; g.treasury -= Math.max(0, g.treasury - hall * 12) * .10;
    });
    A.forEach(function (p) {
      if (!p.alive) return;
      if (p.jail > 0) { p.jail--; return; }
      var r = P[p.rank], c = cost(p) * (p.guild != null ? 1 : 1.25) * shock, inc = r[9];
      if (R(w) < r[0]) {
        if (R(w) < r[8]) {
          p.alive = false; M.deaths++;
          var e = ev(w, p.name + ' went down into a ' + p.rank + '-rank dungeon and did not come back.', [p], p.purse < cost(p) * 2 ? why(w, p) : null, 'death', 1 + ri(p.rank));
          inherit(w, p, e); return;
        }
        var h = lognorm(w, Math.log(r[1]) - r[2] * r[2] / 2, r[2]);
        if (p.guild != null) { var L = leader(w, p.guild), d = L ? DUES[L.type] : .2; w.guilds[p.guild].treasury += h * d; h *= 1 - d; }
        w.stakes.forEach(function (s) {
          if (s.who === p.id && s.left > 0) {
            var cut = h * .25; h -= cut; s.paid += cut;
            if (s.by === BRUTUS) w.brutus.gold += cut; else w.people[s.by].purse += cut;
          }
        });
        inc += h; c += r[4];
        if (h > cost(p) * 15 && R(w) < .5) { p.fame += 5; ev(w, p.name + ' hauled up a fortune: ' + fmt(h) + ' gold.', [p], null, 'haul', .8 + ri(p.rank) * .3, { gold: Math.round(h) }); }
        if (R(w) < r[5]) c += r[6];
      }
      p.purse += inc - c;
      p.purse -= Math.max(0, p.purse - cost(p) * 8) * .05;
      if (p.rank === 'A' || p.rank === 'S') { var spare = Math.max(0, p.purse - cost(p) * 8) * .6; p.purse -= spare; p.spare = spare * .5; } else p.spare = 0;
      p.broke = p.purse < 0 ? p.broke + 1 : 0;
      if (p.broke >= 2 && p.rank !== 'D') {
        p.rank = RANKS[ri(p.rank) - 1]; p.broke = 0; M.demos++;
        ev(w, p.name + ' could not keep up their gear and is busted down to ' + p.rank + '-rank.', [p], why(w, p), 'fall', .9);
      } else if (p.rank !== 'S') {
        var pr = PROMO[p.rank], nxt = RANKS[ri(p.rank) + 1];
        if (p.purse > pr[1] * (P[nxt][3] + P[nxt][7]) && R(w) < pr[0] * (p.guild != null ? 1.5 : .5)) {
          p.rank = nxt; p.fame += 10; M.promos++;
          ev(w, p.name + ' is promoted to ' + p.rank + '-rank.', [p], null, 'rise', .6 + ri(p.rank) * .3);
        }
      }
      if (p.purse < -6 * cost(p)) {
        p.alive = false; p.slums = true; M.dropouts++;
        if (p.guild != null && w.guilds[p.guild].leader === p.id) w.guilds[p.guild].leader = null;
        ev(w, p.name + ' is ruined and drops out to the slums.', [p], why(w, p), 'ruin', .7);
      }
      p.hunger = Math.min(100, p.hunger + uni(w, 4, 9));
      p.fame *= .99; p.rep *= .97;
    });

    // hungers: cooperation or conflict
    A = alive(w);
    A.forEach(function (p) {
      if (!p.alive || p.jail || p.hunger < 55 || R(w) > .12) return;
      var others = A.filter(function (q) { return q !== p && q.alive; }), pool, t = p.type;
      if (!others.length) return;
      if (t === 'Proud') pool = others.filter(function (q) { return q.guild === p.guild || q.rank === p.rank; }).sort(function (a, b) { return b.fame - a.fame; }).slice(0, 3);
      else if (t === 'Ambitious') { pool = others.filter(function (q) { return ri(q.rank) === ri(p.rank) + 1; }); if (!pool.length) pool = others; }
      else if (t === 'Loyal') { pool = others.filter(function (q) { return q.guild != null && q.guild === p.guild; }); if (!pool.length) pool = others; }
      else if (t === 'Greedy') pool = others.slice().sort(function (a, b) { return b.purse - a.purse; }).slice(0, 5);
      else if (t === 'Pragmatic') pool = live(w).filter(function (g) { return g.leader != null && g.id !== p.guild; }).map(function (g) { return leader(w, g.id); });
      else if (t === 'Cautious') pool = others.slice().sort(function (a, b) { return feel(w, a, p) - feel(w, b, p); }).slice(0, 3);
      else if (t === 'Kind') { pool = others.filter(function (q) { return q.purse < cost(q) * 2; }); if (!pool.length) pool = others; }
      else if (t === 'Vengeful') { pool = Object.keys(p.grudge).filter(function (i) { return i !== BRUTUS && w.people[i] && w.people[i].alive; }).map(function (i) { return w.people[i]; }); if (!pool.length) pool = others.slice().sort(function (a, b) { return feel(w, p, a) - feel(w, p, b); }).slice(0, 3); }
      else if (t === 'Demanding') { pool = others.filter(function (q) { return q.guild === p.guild && ri(q.rank) < ri(p.rank); }); if (!pool.length) pool = others; }
      else pool = sample(w, others, Math.min(5, others.length));
      pool = pool.filter(function (q) { return q && q.alive; });
      if (!pool.length) return;
      var q = choice(w, pool), cause = p.grudge[q.id] != null ? p.grudge[q.id] : why(w, p);
      p.hunger *= .35;
      deed(w, p, q, feel(w, p, q) >= 0, cause);
    });

    // stakes: A/S adventurers back lower ranks
    A = alive(w);
    A.filter(function (x) { return x.spare > 0 && R(w) < .25; }).forEach(function (p) {
      var cands = A.filter(function (q) { return ri(q.rank) < ri(p.rank) && q !== p; });
      if (!cands.length) return;
      var q = maxBy(sample(w, cands, Math.min(12, cands.length)), function (q) { return feel(w, p, q) + q.fame * .3 + uni(w, 0, 30); });
      var amt = p.spare * 4; p.purse -= Math.min(p.purse, amt * .5);
      buyStake(w, p, q, amt);
    });
    // stakes pay back in kind every 4 weeks, by how the backed person feels about the backer
    w.stakes.forEach(function (s) {
      if (s.left <= 0) return;
      s.left--;
      var q = w.people[s.who], sp = s.by === BRUTUS ? null : w.people[s.by];
      if (!q.alive || (sp && !sp.alive)) { s.left = 0; return; }
      var f = feel(w, q, s.by), name_ = sp ? sp.name : 'Brutus';
      if (s.left % 4 === 0) {
        if (f > 75 && R(w) < .25) {
          M.devoted++; var gift = Math.max(0, q.purse) * .3; q.purse -= gift;
          if (sp) sp.purse += gift; else w.brutus.gold += gift;
          ev(w, q.name + ' sends ' + name_ + ' the pick of their haul, unasked: ' + fmt(gift) + ' gold. "You backed me when nobody would."', [q, sp || { id: BRUTUS, name: 'Brutus', fame: 0 }], s.e, 'devoted', 1.2, { brutus: !sp, gold: Math.round(gift) });
        } else if (f < -60 && R(w) < .25) {
          M.hostile++;
          if (sp) sp.rep -= 10; else w.brutus.rep -= 10;
          var he = ev(w, q.name + ', bitter about ' + name_ + "'s stake, sells their secrets to the highest bidder.", [q, sp || { id: BRUTUS, name: 'Brutus', fame: 0 }], s.e, 'hostile', 1.2, { brutus: !sp });
          if (!sp) s.left = 0;   // stops paying Brutus
        }
      }
    });

    crime(w);
    intrigue(w);
    w.secrets.forEach(function (s) {
      if (s.out) return;
      s.age++;
      var sch = w.people[s.schemer], care = sch.type === 'Reckless' ? 2 : sch.type === 'Cautious' ? .4 : 1;
      if (R(w) < .03 * Math.sqrt(s.age) * care) { s.out = true; M.exposed++; expose(w, s, sch, w.people[s.target]); }
    });
    leadership(w);
    riots(w);
    refill(w);
    labor(w);

    A = alive(w);
    w.series.pop.push(A.length);
    w.series.guilds.push(live(w).length);
    w.series.free.push(A.filter(function (p) { return p.guild == null; }).length);
    w.series.strained.push(A.filter(function (p) { return p.purse < cost(p) * 2; }).length / Math.max(1, A.length));
    return w;
  }

  function buyStake(w, by, q, amt) {
    var M = w.M, isB = by.id === BRUTUS;
    q.purse += amt; M.stakes++;
    var pleased = feel(w, q, by.id) > 10 || q.type === 'Greedy' || (q.type === 'Proud' && (isB ? 60 : by.fame) > q.fame * 2) || (q.type === 'Masochist' && (isB || by.type === 'Demanding' || by.type === 'Proud'));
    var insulted = feel(w, q, by.id) < -30 || q.type === 'Demanding' || (q.type === 'Masochist' && !isB && by.type === 'Kind');
    adj(w, q, by.id, pleased ? 25 : insulted ? -25 : 5);
    var e = ev(w, (isB ? 'Brutus' : by.name + ' (' + by.rank + ')') + ' buys a stake in ' + q.name + ' (' + q.rank + '). ' + (pleased ? "They're thrilled." : insulted ? 'They take it as an insult.' : 'Fair enough.'),
      [isB ? null : by, q], null, 'stake', isB ? 1.5 : .7, { brutus: isB });
    w.stakes.push({ by: isB ? BRUTUS : by.id, who: q.id, left: 26, paid: 0, amt: amt, e: e, week: w.week });
    alive(w).filter(function (x) { return x.rank === q.rank && x !== q && feel(w, x, by.id) > 20 && 'RH'.indexOf(PRED[x.type + '>' + q.type]) >= 0; }).some(function (r) {
      if (R(w) < (isB ? .25 : .05)) {
        adj(w, r, by.id, -20); adj(w, r, q, -25); r.grudge[q.id] = e; M.snubs++;
        ev(w, r.name + ' wanted ' + (isB ? "Brutus's" : by.name + "'s") + ' backing and watched ' + q.name + " get it instead. They won't forget it.", [r, q], e, 'snub', isB ? 1.2 : .8, { brutus: isB });
        return true;
      }
      return false;
    });
    return e;
  }

  // Brutus backs someone: the one player choice in this experiment
  function brutusStakeCost(p) { return Math.round(cost(p) * 10); }
  function brutusBack(w, id) {
    var q = w.people[id];
    if (!q || !q.alive) return { error: 'They are not around any more.' };
    if (w.stakes.some(function (s) { return s.by === BRUTUS && s.who === id && s.left > 0; })) return { error: 'You already hold a stake in ' + q.name + '.' };
    var price = brutusStakeCost(q);
    if (w.brutus.gold < price) return { error: 'A stake in ' + q.name + ' costs ' + fmt(price) + ' gold. You have ' + fmt(w.brutus.gold) + '.' };
    w.brutus.gold -= price;
    var e = buyStake(w, { id: BRUTUS, name: 'Brutus', fame: 60 }, q, price);
    return { ok: true, event: e, price: price };
  }

  function deed(w, p, q, coop, cause) {
    var t = p.type, e;
    if (coop) {
      adj(w, p, q, 10); adj(w, q, p, 10);
      var lines = {
        Proud: p.name + ' shares a stage with ' + q.name + '; both look magnificent and say so.',
        Ambitious: p.name + ' attaches themself to ' + q.name + ', one rank up, and learns fast.',
        Loyal: p.name + ' covers for ' + q.name + ' when the guild comes asking.',
        Greedy: p.name + ' and ' + q.name + ' split a very profitable delve.',
        Pragmatic: p.name + ' cuts a quiet deal with ' + q.name + ' of ' + gname(w, q.guild) + '.',
        Cautious: p.name + ' pays ' + q.name + ' for protection. Money well spent.',
        Reckless: p.name + ' drags ' + q.name + ' into a delve two ranks too deep. They come back laughing.',
        Kind: p.name + ' lends ' + q.name + ' rent money, no questions asked.',
        Vengeful: p.name + ' and ' + q.name + ' discover a shared enemy over drinks.',
        Demanding: p.name + ' takes ' + q.name + ' under their wing and works them half to death. ' + q.name + ' improves.',
        Masochist: p.name + ' begs ' + q.name + ' for the hardest job going, and gets it.' };
      if (t === 'Kind') { var amt = Math.min(Math.max(0, p.purse) * .2, cost(q) * 3); p.purse -= amt; q.purse += amt; }
      if (t === 'Greedy') { p.purse += cost(p) * 2; q.purse += cost(q) * 2; }
      if (t === 'Pragmatic' && q.guild != null && R(w) < .3 && p.guild !== q.guild && w.guilds[p.guild == null ? q.guild : p.guild].leader !== p.id) {
        var old = p.guild; p.guild = q.guild;
        ev(w, p.name + ' walks out on ' + gname(w, old) + ' for a better deal at ' + gname(w, q.guild) + '.', [p], cause, 'switch', .8);
      }
      ev(w, lines[t], [p, q], cause, 'coop', .3);
      return;
    }
    adj(w, q, p, -20); adj(w, p, q, -5);
    if (t === 'Greedy') { var take = Math.min(Math.max(0, q.purse) * .2, cost(q) * 4); q.purse -= take; p.purse += take * .6; e = ev(w, p.name + ' swindles ' + q.name + ' out of ' + fmt(take) + ' gold.', [p, q], cause, 'swindle', .6 + q.fame / 150); }
    else if (t === 'Proud') { q.rep -= 8; p.fame += 3; e = ev(w, p.name + ' humiliates ' + q.name + ' in public for daring to outshine them.', [p, q], cause, 'humiliation', .6 + q.fame / 100); }
    else if (t === 'Ambitious') { q.fame *= .8; p.fame += 6; e = ev(w, p.name + ' undercuts ' + q.name + ' and takes their spot on the next big contract.', [p, q], cause, 'undercut', .7); }
    else if (t === 'Vengeful') { q.purse -= cost(q) * 3; q.rep -= 10; e = ev(w, p.name + ' settles the score with ' + q.name + ', and makes sure everyone hears about it.', [p, q], cause, 'revenge', 1.1); }
    else if (t === 'Demanding') { q.rep -= 5; e = ev(w, p.name + ' crushes ' + q.name + "'s little rebellion in front of the whole guild.", [p, q], cause, 'crackdown', .8); }
    else if (t === 'Pragmatic') e = ev(w, p.name + ' sells ' + q.name + ' out to a rival for a better price.', [p, q], cause, 'betrayal', .9);
    else if (t === 'Cautious') { q.rep -= 5; e = ev(w, p.name + ' reports ' + q.name + ' to the watch before ' + q.name + ' can be trouble.', [p, q], cause, 'report', .5); }
    else if (t === 'Reckless') { q.purse -= cost(q); e = ev(w, p.name + ' picks a fight with ' + q.name + ' for fun.', [p, q], cause, 'brawl', .5); }
    else if (t === 'Kind') { q.rep -= 5; e = ev(w, p.name + ' publicly calls out ' + q.name + ' for how they treat people.', [p, q], cause, 'callout', .6); }
    else if (t === 'Masochist') { p.purse -= cost(p); e = ev(w, p.name + ' provokes ' + q.name + ' until ' + q.name + ' hits them. ' + p.name + ' thanks them.', [p, q], cause, 'odd', .7); }
    else e = ev(w, p.name + ' turns on ' + q.name + '.', [p, q], cause, 'conflict', .6);
    q.grudge[p.id] = e;
    ripple(w, q, p, 8, e);
  }

  function crime(w) {
    var A = alive(w), M = w.M;
    var strained = A.filter(function (p) { return p.purse < cost(p) * 2; }).length / Math.max(1, A.length);
    A.forEach(function (p) {
      if (!p.alive || p.jail) return;
      var run = p.purse / Math.max(1, cost(p)), strain = run < 0 ? 4 : run < 2 ? 2.5 : run < 8 ? 1 : .5;
      var young = p.rank === 'D' ? 1.6 : 1, rec = p.crimes ? 4 : 1, pp = PROP[p.type][0], pv = PROP[p.type][1], e;
      if (R(w) < .0035 * p.bent * strain * young * rec * pp * (1 + 2 * strained)) {
        var kind = weighted(w, ['theft', 'burglary', 'fraud', 'robbery'], [55, 20, 15, 10]);
        var pool = A.filter(function (q) { return q !== p && q.alive && q.purse > 0; });
        if (pool.length) {
          var v = weighted(w, pool, pool.map(function (q) { return Math.sqrt(Math.max(1, q.purse)) * (q.guild == null ? 2 : 1) * (q.hit ? 3 : 1); }));
          var take = Math.min(v.purse, cost(v) * uni(w, 1, 5) * (kind === 'burglary' ? 3 : 1));
          v.purse -= take; p.purse += take * .4; p.crimes++; v.hit = 4; M.crimes++;
          adj(w, v, p, -30);
          if (R(w) < CLEAR[kind]) {
            p.jail = randint(w, 4, 12); p.rep -= 15;
            e = ev(w, p.name + ' is caught for ' + kind + ' against ' + v.name + ' and locked up.', [p, v], why(w, p), 'crime', .6 + v.fame / 100);
            ripple(w, v, p, 15, e);
          } else {
            var sus = A.filter(function (q) { return q !== v && q !== p && q.alive && feel(w, v, q) < -30; });
            if (sus.length && R(w) < .3) {
              var s = choice(w, sus); adj(w, v, s, -30); adj(w, s, v, -30);
              e = ev(w, v.name + ' was robbed and is sure ' + s.name + ' did it. ' + s.name + ' is not amused.', [v, s], v.grudge[s.id], 'accusation', .9, { truth: p.id });
              s.grudge[v.id] = e;
            }
          }
        }
      }
      if (R(w) < .00152 * p.bent * strain * young * rec * pv) {
        var pool2 = A.filter(function (q) { return q !== p && q.alive && (q.guild === p.guild || q.rank === p.rank); });
        if (!pool2.length) return;
        var vv = minBy(sample(w, pool2, Math.min(6, pool2.length)), function (q) { return feel(w, p, q); });
        p.crimes++; M.crimes++;
        var c = p.grudge[vv.id] != null ? p.grudge[vv.id] : why(w, p);
        if (R(w) < .013) {
          vv.alive = false; M.murders++; M.deaths++;
          e = ev(w, p.name + ' killed ' + vv.name + ' in a tavern brawl that started over nothing.', [p, vv], c, 'murder', 3);
          ripple(w, vv, p, 50, e); inherit(w, vv, e);
          if (R(w) < CLEAR.murder) { p.jail = randint(w, 12, 26); p.rep -= 40; }
        } else {
          vv.purse -= cost(vv) * uni(w, .5, 2); adj(w, vv, p, -40);
          e = ev(w, p.name + ' beat ' + vv.name + ' senseless in a brawl.', [p, vv], c, 'assault', .5 + (vv.fame + p.fame) / 200);
          ripple(w, vv, p, 10, e); vv.grudge[p.id] = e;
        }
      }
    });
    A.forEach(function (p) { p.hit = Math.max(0, p.hit - 1); });
  }

  function intrigue(w) {
    var A = alive(w), M = w.M;
    if (!A.length) return;
    var roll = R(w);
    live(w).forEach(function (g) {
      var L = leader(w, g.id);
      if (!L || ['Greedy', 'Pragmatic', 'Ambitious'].indexOf(L.type) < 0 || R(w) > .05) return;
      var stars = A.filter(function (q) { return q.guild != null && q.guild !== g.id && ri(q.rank) >= 2; });
      var mem = A.filter(function (q) { return q.guild === g.id && q !== L; });
      if (!stars.length || !mem.length) return;
      var star = maxBy(stars, function (q) { return q.fame; }), bait = choice(w, mem);
      M.schemes++;
      var e = ev(w, L.name + ' of ' + g.name + ' sends ' + bait.name + ' to charm ' + star.name + '. Nobody is supposed to know.', [L, bait, star], L.grudge[star.id], 'scheme', .4, { hidden: true });
      if (R(w) < .5 && w.guilds[star.guild].leader !== star.id) {
        var old = star.guild; star.guild = g.id;
        ev(w, star.name + ' leaves ' + gname(w, old) + ' for ' + g.name + ". They say it's for the contracts.", [star], e, 'defection', 1.5);
      }
      if (feel(w, bait, star) > 20 && R(w) < .3) { adj(w, bait, star, 40); adj(w, bait, L, -40); ev(w, bait.name + ' has actually fallen for ' + star.name + '.', [bait, star], e, 'twist', 1.2); }
      secret(w, bait, star, 'honeytrap', star.name + ' was seduced on ' + L.name + "'s orders", e);
    });
    sample(w, A, Math.min(40, A.length)).forEach(function (p) {
      if (p.lover == null || R(w) > .05) return;
      var cands = A.filter(function (q) { return q !== p && q.id !== p.lover && p.kin.indexOf(q.id) < 0 && PRED[p.type + '>' + q.type] === 'D'; });
      if (!cands.length) return;
      var q = choice(w, cands); M.schemes++;
      var e = ev(w, p.name + ' and ' + q.name + ' keep "running into each other".', [p, q], null, 'scheme', .3, { hidden: true });
      secret(w, p, w.people[p.lover], 'affair', p.name + ' has been seeing ' + q.name + ' behind ' + w.people[p.lover].name + "'s back", e, q.id);
    });
    if (roll < .07) {
      var mol = A.filter(function (q) { return q.type === 'Ambitious' && q.guild != null && w.guilds[q.guild].leader !== q.id; });
      var rivals = live(w);
      if (mol.length && rivals.length > 1) {
        var m = choice(w, mol), rival = choice(w, rivals.filter(function (g) { return g.id !== m.guild; })); M.schemes++;
        var e = ev(w, m.name + ' starts passing ' + gname(w, m.guild) + "'s dungeon plans to " + rival.name + '.', [m], why(w, m), 'scheme', .3, { hidden: true });
        w.guilds[m.guild].treasury *= .9;
        var mem = A.filter(function (q) { return q.guild === m.guild && q !== m && w.guilds[m.guild].leader !== q.id; });
        if (mem.length) {
          var L = leader(w, m.guild);
          var fall = minBy(mem, function (q) { return (L ? feel(w, L, q) : 0) + (q.type !== 'Loyal' ? 40 : 0); });
          var g0 = m.guild; fall.guild = null;
          var e2 = ev(w, gname(w, g0) + ' keeps losing boss chests and blames ' + fall.name + ', who is thrown out.', [fall], e, 'scapegoat', 1.4, { truth: m.id });
          mem.filter(function (q) { return q !== fall && feel(w, q, fall) > 30; }).slice(0, 3).forEach(function (f) {
            f.guild = null;
            ev(w, f.name + ' walks out with ' + fall.name + '. "If they can do it to ' + fall.name + ', they can do it to me."', [f, fall], e2, 'walkout', .9);
          });
          secret(w, m, fall, 'mole', m.name + ' was the mole all along, and ' + fall.name + ' took the blame', e2);
        }
      }
    }
    if (roll > .97) {
      var pr = A.filter(function (q) { return q.type === 'Proud' && ri(q.rank) >= 1; });
      if (pr.length) {
        var c = choice(w, pr), os = A.filter(function (q) { return q.rank === c.rank && q !== c; });
        if (os.length) {
          var o = choice(w, os); M.schemes++; c.fame += 10;
          var ed = ev(w, c.name + ' beats ' + o.name + ' in a public duel. Half the town had money on it.', [c, o], null, 'duel', 1);
          secret(w, c, o, 'rigged', c.name + ' paid ' + o.name + ' to lose the duel', ed);
        }
      }
    }
    if (R(w) < .05) {
      var gr = A.filter(function (q) { return q.type === 'Greedy' && q.guild != null; });
      if (gr.length) {
        var s = choice(w, gr), mates = A.filter(function (q) { return q.guild === s.guild && q !== s; });
        if (mates.length) { var v = choice(w, mates); M.schemes++; s.purse += cost(s) * 6; secret(w, s, v, 'skim', s.name + ' pocketed part of the haul they shared with ' + v.name, null); }
      }
    }
  }

  function expose(w, s, sch, t) {
    var e;
    if (s.kind === 'affair') {
      var third = w.people[s.third];
      e = ev(w, "It's out: " + s.text + '. The whole town knows by supper.', [sch, t, third], s.because, 'exposed', 2.2);
      adj(w, t, sch, -80); adj(w, t, third, -70); t.grudge[sch.id] = e; t.grudge[third.id] = e;
      if (sch.lover === t.id) { sch.lover = null; t.lover = null; }
      sch.rep -= 15; ripple(w, t, sch, 30, e);
      if (R(w) < .3) ev(w, t.name + ' challenges ' + third.name + ' to a duel in the square.', [t, third], e, 'duel', 1.6);
    } else if (s.kind === 'honeytrap') {
      e = ev(w, "It's out: " + s.text + '.', [sch, t], s.because, 'exposed', 2);
      t.rep -= 20; t.fame *= .8; adj(w, t, sch, -70); t.grudge[sch.id] = e; ripple(w, t, sch, 25, e);
    } else if (s.kind === 'mole') {
      e = ev(w, "It's out: " + s.text + '. A bounty goes up on ' + sch.name + '.', [sch, t], s.because, 'exposed', 2.5);
      sch.rep -= 40; if (sch.guild != null && w.guilds[sch.guild].leader !== sch.id) sch.guild = null; adj(w, t, sch, -80); t.grudge[sch.id] = e; ripple(w, t, sch, 30, e);
    } else if (s.kind === 'rigged') {
      e = ev(w, "It's out: " + s.text + '. The bettors want their money back, with interest.', [sch, t], s.because, 'exposed', 2);
      sch.rep -= 30; t.rep -= 20; sch.fame *= .6;
    } else if (s.kind === 'skim') {
      e = ev(w, "It's out: " + s.text + '. The party splits on the spot.', [sch, t], s.because, 'exposed', 1.3);
      adj(w, t, sch, -60); t.grudge[sch.id] = e; sch.rep -= 15; ripple(w, t, sch, 20, e);
    } else {
      e = ev(w, "It's out: " + s.text + '.', [sch, t], s.because, 'exposed', 1.5);
      adj(w, t, sch, -60); t.grudge[sch.id] = e;
    }
    w.people.filter(function (x) { return x.alive && (x.type === 'Vengeful' || x.type === 'Greedy') && (x.feel[sch.id] || 0) < -30; }).slice(0, 2).forEach(function (q) {
      sch.purse -= cost(sch) * 2;
      ev(w, q.name + ' sees their chance and squeezes ' + sch.name + ' for silence money.', [q, sch], e, 'blackmail', .9);
    });
  }

  function shake(w, g, nw, e, mem) {
    mem.filter(function (m) { return m !== nw && PRED[nw.type + '>' + m.type] === 'H' && feel(w, nw, m) < -30; }).slice(0, 3).forEach(function (m) {
      m.guild = null; adj(w, m, nw, -40); m.grudge[nw.id] = e;
      ev(w, nw.name + ' clears ' + m.name + ' out of ' + g.name + '. They never got along.', [nw, m], e, 'purge', 1);
    });
  }

  function leadership(w) {
    var M = w.M;
    live(w).forEach(function (g) {
      var mem = alive(w).filter(function (p) { return p.guild === g.id; });
      var L = g.leader == null ? null : w.people[g.leader];
      if (!L || !L.alive || L.guild !== g.id) {
        if (mem.length) {
          var nw = maxBy(mem, function (p) { return ri(p.rank) * 10 + p.fame; }); g.leader = nw.id;
          var c = (L && L.last != null && ['death', 'murder', 'ruin'].indexOf(w.events[L.last].kind) >= 0) ? L.last : null;
          var e = ev(w, nw.name + ' takes over ' + g.name + '.', [nw], c, 'succession', 1.5);
          shake(w, g, nw, e, mem);
        } else g.leader = null;
        return;
      }
      mem.some(function (c) {
        if (c === L || ['Demanding', 'Ambitious', 'Vengeful', 'Proud'].indexOf(c.type) < 0) return false;
        if (feel(w, c, L) < -30 && c.fame > L.fame * .4 && R(w) < .08) {
          var backers = mem.filter(function (m) { return feel(w, m, c) > feel(w, m, L); }).length;
          if (backers > mem.length / 2) {
            g.leader = c.id; M.coups++;
            var e = ev(w, 'Coup in ' + g.name + ': ' + c.name + ' throws out ' + L.name + ', with ' + backers + ' of ' + mem.length + ' members behind them.', [c, L], c.grudge[L.id] != null ? c.grudge[L.id] : why(w, c), 'coup', 2.5);
            L.guild = null; adj(w, L, c, -60); L.grudge[c.id] = e;
            shake(w, g, c, e, mem);
          }
          return true;
        }
        return false;
      });
    });
  }

  function riots(w) {
    var A = alive(w), M = w.M;
    var pool = A.filter(function (p) { return p.purse < cost(p) * 2; }).concat(w.people.filter(function (p) { return p.slums; }));
    var share = pool.length / Math.max(1, A.length), gs = live(w);
    if (share > .30 && w.cool <= 0 && gs.length && R(w) < (share - .30) * 2.5) {
      w.cool = 4; M.riots++;
      var g = maxBy(gs, function (g) { return g.treasury; }); g.treasury -= g.treasury * uni(w, .15, .35);
      var celeb = maxBy(A, function (p) { return p.fame; });
      if (celeb.type !== 'Kind') { celeb.purse *= .75; celeb.rep -= 15; }
      var leaders = pool.filter(function (p) { return p.alive && (p.type === 'Demanding' || p.type === 'Vengeful'); });
      var ring = leaders.length ? choice(w, leaders) : choice(w, pool);
      ring.fame += 15;
      ev(w, 'Riot: the broke sack ' + g.name + "'s hall and drag " + celeb.name + ' into the street. ' + ring.name + ', a nobody yesterday, led them.', [ring, celeb], null, 'riot', 3, { guild: g.id });
    }
    w.cool--;
  }

  function refill(w) {
    var A = alive(w), need = Math.max(0, (w.n0 - A.length) * .25) + uni(w, 0, 2);
    for (var i = 0; i < Math.floor(need); i++) {
      var back = w.people.filter(function (p) { return p.slums && p.purse > 0; })[0];
      if (back) {
        back.slums = false; back.alive = true; back.rank = 'D'; back.guild = null; back.broke = 0;
        ev(w, back.name + ' climbs out of the slums and signs up again.', [back], back.last != null && w.events[back.last].kind === 'ruin' ? back.last : null, 'return', .3);
      } else { person(w, 'D', P.D[3] * uni(w, .5, 3)); w.M.arrivals++; }
    }
    w.people.forEach(function (p) { if (p.slums) p.purse += 60; });
  }

  function prestige(w, g, A) { return A.filter(function (p) { return p.guild === g.id; }).reduce(function (s, p) { return s + value(p); }, 0) / 100; }
  function utility(w, p, g, A) {
    var L = leader(w, g.id);
    if (!L) return -999;
    var t = p.type, friends = A.filter(function (q) { return q.guild === g.id && q !== p && feel(w, p, q) > 30; }).length;
    var u = feel(w, p, L) * .6 - DUES[L.type] * (t === 'Greedy' || t === 'Pragmatic' ? 180 : 90) + friends * (t === 'Loyal' || t === 'Kind' ? 14 : 6);
    u += prestige(w, g, A) * (t === 'Proud' || t === 'Ambitious' ? 2 : .8);
    if (g.treasury < 0) u -= 25;
    if (t === 'Masochist' && L.type === 'Demanding') u += 25;
    if (t === 'Cautious' && (L.type === 'Reckless' || L.type === 'Vengeful')) u -= 20;
    return u;
  }

  function labor(w) {
    var A = alive(w), M = w.M, gs = live(w);
    A.forEach(function (p) {
      if (p.guild == null || p.jail) return;
      var L = leader(w, p.guild);
      if (L === p) return;
      if (utility(w, p, w.guilds[p.guild], A) < -30 && R(w) < .08) {
        M.walkouts++; var old = p.guild; p.guild = null; p.unguilded = 0;
        if (L) { adj(w, p, L, -15); if (p.grudge[L.id] == null) p.grudge[L.id] = p.last; }
        ev(w, p.name + ' walks out of ' + gname(w, old) + '.', [p, L], L ? p.grudge[L.id] : why(w, p), 'walkout', .7 + value(p) / 300);
      }
    });
    gs.forEach(function (g) {
      var L = leader(w, g.id);
      if (!L) return;
      var mem = A.filter(function (p) { return p.guild === g.id; }), room = SIZE[L.type] - mem.length;
      var hall = mem.reduce(function (s, p) { return s + cost(p); }, 0) * .35 + 1;
      if (g.treasury < hall * 3) return;
      A.filter(function (p) { return p.guild == null && !p.jail && p.alive; }).sort(function (a, b) { return value(b) - value(a); }).slice(0, Math.max(0, Math.min(room, 5))).forEach(function (p) {
        if (ri(p.rank) > ri(L.rank) + 1) return;
        var u = utility(w, p, g, A), best = Math.max.apply(null, gs.filter(function (h) { return h !== g; }).map(function (h) { return utility(w, p, h, A); }).concat([-60]));
        if (u > -60 && u >= best - 15 && R(w) < .6) {
          var fee = cost(p) * 2; g.treasury -= fee; p.purse += fee; p.guild = g.id; M.signings++;
          if (value(p) > 120) ev(w, g.name + ' signs ' + p.name + ' (' + p.rank + ').', [p, L], null, 'signing', .5 + value(p) / 300);
        }
      });
      if (room > -3 && R(w) < POACHER[L.type] * .3) {
        var targets = A.filter(function (p) { return p.guild != null && p.guild !== g.id && ri(p.rank) >= 1 && leader(w, p.guild) !== p; });
        if (targets.length) {
          var p = maxBy(sample(w, targets, Math.min(15, targets.length)), function (p) { return value(p) + feel(w, L, p); });
          var offer = cost(p) * uni(w, 4, 10);
          var uNew = utility(w, p, g, A) + offer / cost(p) * (p.type === 'Greedy' || p.type === 'Pragmatic' ? 4 : 2);
          var uOld = utility(w, p, w.guilds[p.guild], A) + (p.type === 'Loyal' ? 30 : 10);
          var old = p.guild, oldL = leader(w, old);
          if (uNew > uOld && g.treasury > offer) {
            g.treasury -= offer; p.purse += offer; p.guild = g.id; M.poaches++;
            var e = ev(w, g.name + ' pries ' + p.name + ' (' + p.rank + ') away from ' + gname(w, old) + ' with ' + fmt(offer) + ' gold.', [L, p, oldL], oldL ? L.grudge[oldL.id] : null, 'poach', 1 + value(p) / 200);
            if (oldL) {
              adj(w, oldL, L, -30); oldL.grudge[L.id] = e;
              A.filter(function (q) { return q.guild === old && feel(w, q, p) > 40 && q !== oldL; }).slice(0, 2).forEach(function (q) {
                if (R(w) < .25 && ['Loyal', 'Kind', 'Reckless'].indexOf(q.type) >= 0) { q.guild = g.id; M.poaches++; ev(w, q.name + ' follows ' + p.name + ' to ' + g.name + '.', [q, p], e, 'follow', .7); }
              });
            }
          } else if (oldL && R(w) < .3) {
            adj(w, p, oldL, 10);
            ev(w, p.name + ' turns down ' + g.name + "'s money and stays with " + gname(w, old) + '.', [p, L], null, 'loyal', .4);
          }
        }
      }
    });
    A.forEach(function (p) {
      if (p.guild != null || p.jail || !p.alive || R(w) > .35) return;
      var opts = [];
      gs.forEach(function (g) {
        var L = leader(w, g.id);
        if (!L || ri(p.rank) > ri(L.rank) + 1) return;
        if (A.filter(function (q) { return q.guild === g.id; }).length < SIZE[L.type] + 2) opts.push([utility(w, p, g, A), g]);
      });
      if (opts.length) { var b = maxBy(opts, function (o) { return o[0]; }); if (b[0] > -70) { p.guild = b[1].id; M.signings++; } }
    });
    A.forEach(function (p) {
      if (!p.alive) return;
      if (p.guild == null) {
        p.unguilded++;
        if (p.unguilded > 8 && p.purse < cost(p) * 2 && R(w) < .15) {
          p.alive = false; p.slums = true; M.to_slums++; M.dropouts++;
          ev(w, p.name + ' has no guild, no roof and no money, and drops out of sight.', [p], why(w, p), 'ruin', .4);
        }
      } else p.unguilded = 0;
    });
    A = alive(w);
    gs.forEach(function (g) {
      var mem = A.filter(function (p) { return p.guild === g.id; });
      var hall = mem.reduce(function (s, p) { return s + cost(p); }, 0) * .35 + 1;
      if (mem.length < 3 || g.treasury < -hall * 6) {
        g.dead = true; M.collapses++;
        var L = leader(w, g.id);
        mem.forEach(function (p) { p.guild = null; p.unguilded = 0; });
        var lw = w.events.slice(-200).filter(function (e) { return ['walkout', 'poach', 'coup', 'riot', 'exposed'].indexOf(e.kind) >= 0 && e.actors.some(function (a) { return a !== BRUTUS && w.people[a].guild == null; }); });
        ev(w, g.name + ' folds. Its hall is boarded up and its ' + mem.length + ' members are on the street.', L ? [L] : [], lw.length ? lw[lw.length - 1].id : null, 'collapse', 2.5, { guild: g.id });
        g.leader = null;
      }
    });
    A.some(function (p) {
      if (!(p.rank === 'A' || p.rank === 'S') || ['Ambitious', 'Proud', 'Demanding', 'Vengeful'].indexOf(p.type) < 0 || p.purse <= cost(p) * 9 || R(w) >= .015) return false;
      if (p.guild != null && w.guilds[p.guild].leader === p.id) return false;
      var names = NEW_GUILDS.filter(function (n) { return !w.guilds.some(function (g) { return g.name === n; }); });
      if (!names.length) return true;
      var old = p.guild, oL = leader(w, old);
      var g = { id: w.guilds.length, name: names[0], leader: p.id, treasury: p.purse * .6, dead: false };
      p.purse *= .4; w.guilds.push(g); p.guild = g.id; M.foundings++;
      var e = ev(w, p.name + ' raises a new banner: ' + g.name + '.', [p], oL ? p.grudge[oL.id] : null, 'founding', 2, { guild: g.id });
      A.filter(function (q) { return q.guild === old && q !== p && feel(w, q, p) > 40 && (!oL || q !== oL); }).slice(0, 4).forEach(function (q) {
        q.guild = g.id; ev(w, q.name + ' leaves ' + gname(w, old) + ' to join ' + p.name + '.', [q, p], e, 'follow', .6);
      });
      return false;
    });
  }

  // ---------------------------------------------------------------- reading the world
  function chainDepth(w, id) { var d = 0, seen = {}; while (id != null && !seen[id]) { seen[id] = 1; d++; id = w.events[id].because; } return d; }
  function chain(w, id) { var out = [], seen = {}; while (id != null && !seen[id]) { seen[id] = 1; out.unshift(w.events[id]); id = w.events[id].because; } return out; }
  // the bulletin: the week's biggest public stories; schemes that are still secret never appear
  function bulletin(w, week, n) {
    var evs = w.events.filter(function (e) { return e.week === week && e.kind !== 'coop' && e.kind !== 'world' && !e.hidden; });
    evs.forEach(function (e) { e.score = e.weight * (1 + e.fame / 100) * (1 + .4 * (chainDepth(w, e.id) - 1)) * (e.brutus ? 3 : 1); });
    return evs.sort(function (a, b) { return b.score - a.score; }).slice(0, n || 3);
  }
  // words, never numbers, for how someone is doing and how they feel about Brutus
  function standing(p) { var r = p.purse / cost(p); return r < 0 ? 'in debt' : r < 2 ? 'scraping by' : r < 8 ? 'getting by' : r < 20 ? 'comfortable' : 'flush'; }
  function feelWord(f) { return f > 75 ? 'devoted' : f > 40 ? 'warm' : f > 10 ? 'fair' : f > -30 ? 'cool' : f > -60 ? 'resentful' : 'hostile'; }

  var API = { create: create, step: step, brutusBack: brutusBack, brutusStakeCost: brutusStakeCost, bulletin: bulletin, chain: chain, chainDepth: chainDepth,
    alive: alive, live: live, leader: leader, gname: gname, cost: cost, feel: feel, standing: standing, feelWord: feelWord, RANKS: RANKS, TYPES: TYPES, PRED: PRED, BRUTUS: BRUTUS };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.PXSim = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
