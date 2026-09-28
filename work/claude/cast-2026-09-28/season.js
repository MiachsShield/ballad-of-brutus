/* One labor-market season on the authored cast.
 *   node season.js          — one readable season, seed 7
 *   node season.js --soak   — 300 seeds, survival per adventurer
 * Season = 10 town visits = 10 waves (playtest spec), no repopulation.
 */
var OW = require('../overworld-2026-09-18/adventurers.js');
var CS = require('./castState.js'), C = require('./cast.js');
var VISITS = 10;

function season(seed, verbose) {
  var s = CS.seedFromCast(seed), aliveAt = [];
  for (var v = 1; v <= VISITS; v++) {
    var r = OW.advanceWave(s, 10);
    if (verbose) {
      var names = function (l) { return l.map(function (p) { return p.name; }).join(', ') || '-'; };
      console.log('visit ' + v + ': lost ' + names(r.lost) +
        (r.clashes.length ? ' | clashes ' + r.clashes.length : '') +
        ' | alive ' + Object.keys(s.roster).length);
    }
    aliveAt.push(Object.keys(s.roster).length);
  }
  return { state: s, aliveAt: aliveAt };
}

if (process.argv.indexOf('--soak') !== -1) {
  var N = 300, surv = {}, curve = new Array(VISITS).fill(0), bad = 0;
  C.CAST.forEach(function (a) { surv[a.id] = 0; });
  for (var i = 1; i <= N; i++) {
    var r = season(i, false);
    Object.keys(r.state.roster).forEach(function (id) { surv[id]++; });
    r.aliveAt.forEach(function (n, k) { curve[k] += n; });
    // invariant: ties never outlive a dead partner
    r.state.ledger.rows.forEach(function (row) {
      if (row.tag === 'old-ties' && (!r.state.roster[row.from] || !r.state.roster[row.to])) bad++;
    });
  }
  console.log('avg alive after visit: ' + curve.map(function (c) { return (c / N).toFixed(1); }).join(' '));
  console.log('season survival by adventurer (tier):');
  C.CAST.forEach(function (a) {
    console.log('  ' + (a.name + ' (' + a.tier + ')').padEnd(26) + (100 * surv[a.id] / N).toFixed(0) + '%');
  });
  console.log('stale tie rows: ' + bad);
  process.exit(bad ? 1 : 0);
} else {
  season(7, true);
}
