/* Headless harness for the overworld adventurer layer.
 *
 *   node sim.js            — one readable run
 *   node sim.js --soak     — 300 seeds, aggregate + invariant checks
 *
 * The point of this harness is to answer one question before any of this
 * touches the build: do grievances actually ACCUMULATE into a roster worth
 * having, or does everyone just die anonymously?
 */
var OW = require('./adventurers.js');

function feelingLine(L, from, to) {
  var f = L.feeling(from, to);
  if (!f.tags.length) return null;
  return '    ' + from + ' -> ' + to +
         '  respect ' + (f.respect >= 0 ? '+' : '') + f.respect +
         '  warmth ' + (f.warmth >= 0 ? '+' : '') + f.warmth +
         '   [' + f.tags.join(', ') + ']';
}

function oneRun(seed, verbose) {
  var s = OW.newState(seed, 8);
  var ids = Object.keys(s.roster);

  // Meet four of them, one of each verb, so every path is exercised.
  var verbs = OW.VERBS;
  ids.slice(0, 4).forEach(function (id, i) {
    var p = s.roster[id];
    if (verbose) {
      console.log('  meet ' + p.name + ' (tier ' + p.tier + ', ' + p.traits.join('/') + ')');
      console.log('    "' + p.goal.says + '"');
    }
    var r = OW.encounter(s, id, verbs[i]);
    if (verbose) console.log('    -> ' + verbs[i] + ': ' + r.note + '\n');
  });

  var w1 = OW.runWave(s, 10);

  // Snapshot now: the knife and wave 2 will prune rows out from under us.
  var carried = [];
  w1.survivors.forEach(function (p) {
    var a = feelingLine(s.ledger, p.id, 'brutus');
    var b = feelingLine(s.ledger, 'brutus', p.id);
    if (a) carried.push(a + '   (' + p.name + ', ' + p.traits.join('/') + ')');
    if (b) carried.push(b);
  });

  // A knife finds the highest-tier survivor while they are not braced.
  // Tier is irrelevant to the outcome — that is the point of the check.
  var target = w1.survivors.slice().sort(function (a, b) { return b.tier - a.tier; })[0];
  var knife = target
    ? OW.assassinate(s, target.id, { by: 'a knife in the dark', defended: false })
    : { killed: false, why: 'nobody came back up' };
  if (target) knife.target = target;

  OW.repopulate(s, 8);
  var w2 = OW.runWave(s, 10);

  return { state: s, w1: w1, w2: w2, knife: knife, carried: carried, met: ids.slice(0, 4) };
}

function verbose() {
  console.log('=== one wave, seed 7 ===\n');
  var r = oneRun(7, true);

  console.log('  wave 1: ' + r.w1.survivors.length + ' up, ' + r.w1.lost.length + ' lost');
  r.w1.lost.forEach(function (p) {
    console.log('    x ' + p.name + ' — ' + p.causeOfDeath +
                (p.metBrutus ? '  (Brutus had met them)' : ''));
  });

  console.log('\n  what the survivors carry (end of wave 1):');
  if (r.carried.length) r.carried.forEach(function (l) { console.log(l); });
  else console.log('    nothing — everyone he met died down there.');

  console.log('\n  the knife: ' + (r.knife.killed ? 'killed' : 'failed') + ' — ' + r.knife.why +
              (r.knife.target ? '  (' + r.knife.target.name + ', tier ' + r.knife.target.tier + ')' : ''));
  var living = Object.keys(r.state.roster)[0];
  var braced = OW.assassinate(r.state, living, { defended: true });
  console.log('  the same knife, braced: ' + (braced.killed ? 'killed' : 'failed') + ' — ' + braced.why);

  console.log('\n  meeting them again — what Brutus can SEE:');
  var shown = 0;
  r.w2.survivors.forEach(function (p) {
    if (!p.metBrutus) return;
    var st = OW.stance(r.state, p.id);
    if (st.key === 'indifferent' && !st.because) return;
    console.log('    ' + p.name + ' — ' + st.key +
                (st.because ? '  "' + st.because.says + '"' : ''));
    console.log('      ' + st.acts.join('; ') +
                (st.because && st.because.permanent ? '   (has not let it go)' : ''));
    shown++;
  });
  if (!shown) console.log('    nobody he met is still down there.');

  console.log('\n  wave 2: ' + r.w2.survivors.length + ' up, ' + r.w2.lost.length + ' lost');
  var veterans = r.w2.survivors.filter(function (p) { return p.wavesSurvived > 1; });
  console.log('  veterans of both waves: ' +
    (veterans.length ? veterans.map(function (p) { return p.name + ' (' + p.wavesSurvived + ')'; }).join(', ')
                     : 'none'));
}

function soak(n) {
  var died = 0, total = 0, remembered = 0, metAndLived = 0, permanentRows = 0;
  var legibleStance = 0, hasReason = 0;
  var rosterSizes = [];
  for (var seed = 1; seed <= n; seed++) {
    var r = oneRun(seed, false);
    total += r.w1.survivors.length + r.w1.lost.length;
    died += r.w1.lost.length;
    r.w1.survivors.forEach(function (p) {
      if (p.metBrutus) {
        metAndLived++;
        if (r.state.ledger.feeling(p.id, 'brutus').tags.length) remembered++;
      }
    });
    r.w1.survivors.forEach(function (p) {
      if (!p.metBrutus) return;
      var st = OW.stance(r.state, p.id);
      if (st.key !== 'indifferent') legibleStance++;
      if (st.because) hasReason++;
    });
    permanentRows += r.state.ledger.rows.filter(function (x) { return x.decay === null; }).length;
    rosterSizes.push(Object.keys(r.state.roster).length);
  }
  var avgRoster = rosterSizes.reduce(function (a, b) { return a + b; }, 0) / rosterSizes.length;
  console.log('=== soak: ' + n + ' seeds ===');
  console.log('  wave-1 mortality      : ' + (100 * died / total).toFixed(1) + '%');
  console.log('  met Brutus and lived  : ' + metAndLived);
  console.log('  ...still carrying a row: ' + remembered +
              ' (' + (metAndLived ? (100 * remembered / metAndLived).toFixed(0) : 0) + '%)');
  console.log('  permanent rows alive  : ' + permanentRows);
  console.log('  avg roster after 2 waves: ' + avgRoster.toFixed(1));
  console.log('  survivors with a stance : ' + legibleStance +
              ' (' + (metAndLived ? (100 * legibleStance / metAndLived).toFixed(0) : 0) + '% of those he met)');
  console.log('  ...with a named reason  : ' + hasReason);

  // Invariants the design depends on.
  var fail = [];
  if (died === 0) fail.push('nobody ever dies — the cull does not bite');
  if (died === total) fail.push('everybody always dies — no roster can form');
  if (remembered === 0) fail.push('no survivor carries a sentiment — the ledger is inert');
  if (avgRoster > 40) fail.push('roster unbounded — the cull is not pruning');
  console.log(fail.length ? '\n  FAIL: ' + fail.join('; ') : '\n  ok: all invariants hold');
  return fail.length;
}

if (process.argv.indexOf('--soak') !== -1) process.exit(soak(300) ? 1 : 0);
verbose();
