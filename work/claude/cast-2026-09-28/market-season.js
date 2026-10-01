/* node market-season.js         — one season (seed 7) as the player sees it: top 3 stories a visit
 * node market-season.js --full  — the same season, every headline
 * node market-season.js --soak  — 300 seeds: volatility, not deaths      */
var MK = require('./market.js'), C = require('./cast.js'), B = require('./bulletin.js');
var FULL = process.argv.indexOf('--full') !== -1;
var BMISS = 0, BSTORIES = 0, BVISITS = 0;
var VISITS = 10;

var CQ = { frozen: 0, walked: 0, scapegoat: 0, leftBehind: 0, murdered: 0 }, CQnamed = 0;
var EV = {}, RIP = 0, GG = 0;
var FREE = 0, KP = 0, KW = 0, KS = 0, KK = 0, KT = [], BLUE = 0;
function run(seed, verbose) {
  var s = MK.newMarket(seed);
  for (var v = 1; v <= VISITS; v++) {
    var news = MK.visit(s);
    var top = B.bulletin(s, news);
    BVISITS++; BSTORIES += top.length;
    if (news.some(function (n) { return n.named && n.kind === 'died'; }) && !top.some(function (t) { return t.group === 'Deaths'; })) BMISS++;
    C.CAST.forEach(function (a) { var p = s.roster[a.id]; if (p && !p.m.guild) FREE++; });
    if (v > 1) ['morrow', 'odile', 'hask'].forEach(function (id) {
      var p = s.roster[id]; s.seenFree = s.seenFree || {};
      if (p && !p.m.guild && !s.seenFree[id]) { s.seenFree[id] = true; s.blueFree = (s.blueFree || 0) + 1; }
    });
    if (verbose) {
      console.log('— visit ' + v + ' —');
      if (FULL) news.forEach(function (n) { console.log('  ' + (n.named ? '* ' : '  ') + n.text); });
      else top.forEach(function (t) { console.log('  ' + B.format(t)); });
    }
  }
  return s;
}

if (process.argv.indexOf('--soak') !== -1) {
  var N = 300, agg = { news: 0, namedNews: 0, deaths: 0, joins: 0, shifts: 0, collapses: 0, hauls: 0 };
  var surv = {}, guilded = {}, quiet = 0, bad = 0, freeSum = 0;
  C.CAST.forEach(function (a) { surv[a.id] = 0; guilded[a.id] = 0; });
  for (var i = 1; i <= N; i++) {
    var s = run(i, false);
    var K = s.koth || { poaches: 0, windows: 0, sabotage: 0, knives: 0, tenures: [] };
    KP += K.poaches; KW += K.windows; KS += K.sabotage; KK += K.knives; KT = KT.concat(K.tenures);
    BLUE += s.blueFree || 0;
    RIP += s.rippled || 0; GG += s.guildGrudges || 0;
    if (s.events) for (var e in s.events) EV[e] = (EV[e] || 0) + s.events[e];
    if (s.cliques) for (var q in CQ) CQ[q] += s.cliques[q];
    s.news.forEach(function (n) { if (n.named && n.kind === 'died' && /left on floor|found dead\. .* says it was/.test(n.text)) CQnamed++; });
    s.news.forEach(function (n) {
      agg.news++; if (n.named) agg.namedNews++;
      if (n.named && n.kind === 'died') agg.deaths++;
      if (n.kind === 'joined') agg.joins++;
      if (n.kind === 'shift') agg.shifts++;
      if (n.kind === 'collapse') agg.collapses++;
      if (n.kind === 'haul') agg.hauls++;
      if (n.kind === 'left') agg.lefts = (agg.lefts || 0) + 1;
    });
    for (var v = 1; v <= VISITS; v++) if (!s.news.some(function (n) { return n.visit === v; })) quiet++;
    C.CAST.forEach(function (a) {
      var p = s.roster[a.id];
      if (p) { surv[a.id]++; if (p.m.guild) guilded[a.id]++; }
    });
    for (var g in s.guilds) if (s.guilds[g].alive && MK.members(s, g) > MK.capOf(s, g)) bad++;
    for (var g2 in s.guilds) { var G2 = s.guilds[g2]; if (!G2.alive) continue; G2.allies.concat(G2.feuds).forEach(function (o) { var O = s.guilds[o]; if (!O || !O.alive) return; if ( (G2.allies.indexOf(o) !== -1 && O.allies.indexOf(g2) === -1) || (G2.feuds.indexOf(o) !== -1 && O.feuds.indexOf(g2) === -1)) bad++; }); }
    for (var id in s.roster) {
      var m = s.roster[id].m;
      if (m.desires.gold + m.desires.strongGuild + m.desires.friends !== 100) bad++;
      if (m.guild && !s.guilds[m.guild].alive) bad++;
    }
  }
  var per = function (x) { return (x / N).toFixed(1); };
  console.log('per season: headlines ' + per(agg.news) + ' (named ' + per(agg.namedNews) + ')' +
    ' | named deaths ' + per(agg.deaths) + ' | joins ' + per(agg.joins) +
    ' | desire shifts ' + per(agg.shifts) + ' | big hauls ' + per(agg.hauls) +
    ' | walkouts ' + per(agg.lefts || 0) + ' | guild collapses ' + per(agg.collapses));
  console.log('named free agents available per visit: ' + (FREE / (N * VISITS)).toFixed(1));
  console.log('quiet visits (no news): ' + (100 * quiet / (N * VISITS)).toFixed(1) + '%');
  console.log('named: survive% / in a guild at season end%');
  C.CAST.forEach(function (a) {
    console.log('  ' + (a.name + ' (t' + a.tier + ', ' + a.traits.join('/') + ')').padEnd(40) +
      (100 * surv[a.id] / N).toFixed(0).padStart(4) + '%' + (100 * guilded[a.id] / N).toFixed(0).padStart(6) + '%');
  });
  console.log('king of the hill (per season): poaches ' + per(KP) + ' | MVP walkouts (open windows) ' + per(KW) +
    ' | sabotage ' + per(KS) + ' | knife attempts ' + per(KK));
  var tg = {}; KT.forEach(function (t) { (tg[t.guild] = tg[t.guild] || []).push(t.visits); });
  console.log('avg MVP tenure by holder (visits, n):');
  MK.GUILDS.forEach(function (g) { var a = tg[g.id] || []; if (a.length) console.log('  ' + g.name.padEnd(28) +
    (a.reduce(function (x, y) { return x + y; }, 0) / a.length).toFixed(1) + '  (' + a.length + ')'); });
  console.log('blue chips ever unguilded after visit 1 (Morrow/Odile/Hask): ' + (100 * BLUE / (N * 3)).toFixed(0) + '%');
  console.log('cliques (per season): frozen out ' + per(CQ.frozen) + ' | misfit walkouts ' + per(CQ.walked) +
    ' | scapegoated ' + per(CQ.scapegoat) + ' | left behind ' + per(CQ.leftBehind) + ' | murdered ' + per(CQ.murdered) +
    ' | named clique deaths ' + per(CQnamed));
  console.log('person-to-person (per season): ' + Object.keys(EV).sort().map(function (e) { return e + ' ' + per(EV[e]); }).join(' | '));
  console.log('ripple (per season): secondhand rows ' + per(RIP) + ' | people blaming a guild for a death ' + per(GG));
  console.log('bulletin: avg stories shown per visit ' + (BSTORIES / BVISITS).toFixed(1) + ' | named deaths left off the bulletin ' + BMISS);
  if (BMISS) bad += BMISS;
  console.log('invariant failures: ' + bad);
  process.exit(bad ? 1 : 0);
} else run(7, true);
