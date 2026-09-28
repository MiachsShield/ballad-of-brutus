/* node market-season.js         — one readable season (seed 7): the news
 * node market-season.js --soak  — 300 seeds: volatility, not deaths      */
var MK = require('./market.js'), C = require('./cast.js');
var VISITS = 10;

var FREE = 0;
function run(seed, verbose) {
  var s = MK.newMarket(seed);
  for (var v = 1; v <= VISITS; v++) {
    var news = MK.visit(s);
    C.CAST.forEach(function (a) { var p = s.roster[a.id]; if (p && !p.m.guild) FREE++; });
    if (verbose) {
      console.log('— visit ' + v + ' —');
      news.forEach(function (n) { console.log('  ' + (n.named ? '* ' : '  ') + n.text); });
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
    for (var g in s.guilds) if (MK.members(s, g) > 2) bad++;
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
  console.log('invariant failures: ' + bad);
  process.exit(bad ? 1 : 0);
} else run(7, true);
