/* Headless harness for the overworld adventurer layer.
 *
 *   node sim.js            — one readable run
 *   node sim.js --soak     — 300 seeds, aggregate + invariant checks
 *   node sim.js --campaign — one readable multi-wave campaign, seed 7
 *   node sim.js --escalate — 300 seeds x 7 waves, escalation aggregate
 *
 * The point of this harness is to answer one question before any of this
 * touches the build: do grievances actually ACCUMULATE into a roster worth
 * having, or does everyone just die anonymously? The campaign/escalate modes
 * ask the follow-on question: does sustained sentiment actually reach a
 * flashpoint, does the world spin on its own between visits (gossip,
 * rivalry), and how often — for real, not asserted.
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

/* --------------------------------------------------------------- campaign --
 * Multi-wave harness for the escalation layer. oneRun() above meets four
 * parties once and never again — heat can never build on that pattern.
 * A campaign instead meets a FRACTION of the living roster every wave —
 * known parties first, so a party once met keeps getting met (sustained,
 * consistent behaviour is the only thing heat responds to) — with a verb
 * that never changes once assigned, cycling evenly so all four flashpoint
 * axes get a fair shot. The parties left unmet each wave are exactly the
 * gossip target pool: meeting everyone every wave (tried first, see
 * ESCALATION.md) leaves nobody left to gossip TO.
 */
function runCampaign(seed, waves, opts) {
  opts = opts || {};
  var rosterSize = opts.rosterSize || 8;
  var meetFraction = opts.meetFraction != null ? opts.meetFraction : 0.6;
  var s = OW.newState(seed, rosterSize);
  var verbs = OW.VERBS;
  var policy = {}, nextVerb = 0;
  var stats = {
    seed: seed, waves: waves,
    metCount: 0,
    flashpointsByType: { vendetta: 0, devotion: 0, exposeWarning: 0, attachment: 0 },
    firedByType: { vendetta: 0, devotion: 0, exposeWarning: 0, attachment: 0 },
    firstFlashpointWave: [],   // one entry per PARTY, the wave of their first-ever prime
    everFlashpoint: 0,
    gossipTainted: [],         // opinion existed BEFORE the first real encounter
    gossipPasses: 0,
    clashes: 0,
    clashDeaths: 0,
    totalDeaths: 0,
    totalEverSeen: 0
  };
  var seenIds = {}, everPrimed = {};

  for (var w = 1; w <= waves; w++) {
    var aliveIds = Object.keys(s.roster).filter(function (id) { return s.roster[id].alive; });
    // Known ids (already have a policy — Brutus has dealt with them before)
    // sort first, so a party once met keeps being met; newcomers fill the
    // rest of the quota, and whoever doesn't fit stays unmet this wave.
    aliveIds.sort(function (a, b) { return (policy[a] ? 0 : 1) - (policy[b] ? 0 : 1); });
    var numToMeet = Math.max(1, Math.round(aliveIds.length * meetFraction));
    var toMeet = aliveIds.slice(0, numToMeet);

    toMeet.forEach(function (id) {
      var p = s.roster[id];
      if (!seenIds[id]) { seenIds[id] = true; stats.totalEverSeen++; }
      if (!policy[id]) policy[id] = verbs[nextVerb++ % verbs.length];
      if (!p.metBrutus && p.gossipTaint) {
        stats.gossipTainted.push({ name: p.name, wave: w, respect: p.gossipTaint.respect,
                                    warmth: p.gossipTaint.warmth, from: p.gossipTaint.fromName });
      }
      OW.encounter(s, id, policy[id]);
      stats.metCount++;
    });
    // Newcomers nobody got to this wave still count toward "ever seen" —
    // they exist, they just have not crossed paths with him yet.
    aliveIds.forEach(function (id) { if (!seenIds[id]) { seenIds[id] = true; stats.totalEverSeen++; } });

    var res = OW.advanceWave(s, 10, opts);
    stats.totalDeaths += res.lost.length;
    res.clashes.forEach(function (c) { stats.clashes++; stats.clashDeaths += c.dead.length; });
    stats.gossipPasses += res.gossip.length;

    res.primed.forEach(function (fp) {
      stats.flashpointsByType[fp.type]++;
      if (!everPrimed[fp.id]) { everPrimed[fp.id] = true; stats.everFlashpoint++; stats.firstFlashpointWave.push(w); }
      // Resolve it now, alternating context so both branches of every
      // resolver actually get exercised across a big seed sample.
      var ctx = campaignCtx(fp.type, w);
      var result = resolveFlashpoint(fp.type, s, fp.id, ctx);
      if (result && result.fired) stats.firedByType[fp.type]++;
    });

    OW.repopulate(s, rosterSize);
  }
  return stats;
}

/* Alternate the ctx by wave parity — this is the sim standing in for a
 * player who sometimes braces for the knife and sometimes does not. */
function campaignCtx(type, w) {
  var alt = (w % 2 === 0);
  if (type === 'vendetta') return { defended: alt, lethal: alt };
  if (type === 'devotion') return { danger: alt };
  if (type === 'attachment') return { granted: alt };
  return {};
}

function resolveFlashpoint(type, s, id, ctx) {
  if (type === 'vendetta') return OW.vendettaStrike(s, id, ctx);
  if (type === 'devotion') return OW.devotionAct(s, id, ctx);
  if (type === 'exposeWarning') return OW.exposeWarning(s, id, ctx);
  if (type === 'attachment') return OW.attachmentDemand(s, id, ctx);
  return null;
}

function campaignVerbose(seed, waves) {
  console.log('=== campaign, seed ' + seed + ', ' + waves + ' waves ===\n');
  var stats = runCampaign(seed, waves);
  console.log('  parties ever in the roster : ' + stats.totalEverSeen);
  console.log('  encounters run              : ' + stats.metCount);
  console.log('  total deaths                : ' + stats.totalDeaths +
              '  (of which ' + stats.clashDeaths + ' from rivalry clashes)');
  console.log('  rivalry clashes             : ' + stats.clashes);
  console.log('  gossip passes landed        : ' + stats.gossipPasses);
  console.log('  gossip-tainted first meets  : ' + stats.gossipTainted.length);
  stats.gossipTainted.slice(0, 5).forEach(function (g) {
    console.log('    ' + g.name + ' had heard of him from ' + g.from + ' before wave ' + g.wave +
                ' (resp ' + g.respect.toFixed(1) + ', warm ' + g.warmth.toFixed(1) + ')');
  });
  console.log('  flashpoints primed by type:');
  Object.keys(stats.flashpointsByType).forEach(function (t) {
    console.log('    ' + t + ': ' + stats.flashpointsByType[t] + ' primed, ' +
                stats.firedByType[t] + ' resolved');
  });
  console.log('  any flashpoint at all       : ' + stats.everFlashpoint);
}

/* --------------------------------------------------------------- escalate --
 * The aggregate campaign report: many seeds, several waves each. This is
 * what answers the brief's actual question — reachable but earned, or
 * never fires, or fires on everyone? Read the printed numbers, not this
 * comment, for the real answer; see ESCALATION.md for the write-up.
 */
function escalate(n, waves) {
  n = n || 300; waves = waves || 7;
  var totals = {
    flashpointsByType: { vendetta: 0, devotion: 0, exposeWarning: 0, attachment: 0 },
    everFlashpoint: 0, totalEverSeen: 0, totalDeaths: 0,
    clashes: 0, clashDeaths: 0, gossipPasses: 0, gossipTainted: 0,
    firstWaveHist: {}
  };
  for (var seed = 1; seed <= n; seed++) {
    var s = runCampaign(seed, waves);
    Object.keys(s.flashpointsByType).forEach(function (t) { totals.flashpointsByType[t] += s.flashpointsByType[t]; });
    totals.everFlashpoint += s.everFlashpoint;
    totals.totalEverSeen += s.totalEverSeen;
    totals.totalDeaths += s.totalDeaths;
    totals.clashes += s.clashes;
    totals.clashDeaths += s.clashDeaths;
    totals.gossipPasses += s.gossipPasses;
    totals.gossipTainted += s.gossipTainted.length;
    s.firstFlashpointWave.forEach(function (w) { totals.firstWaveHist[w] = (totals.firstWaveHist[w] || 0) + 1; });
  }
  var pct = function (a, b) { return b ? (100 * a / b).toFixed(2) : '0.00'; };

  console.log('=== escalate: ' + n + ' seeds x ' + waves + ' waves ===\n');
  console.log('  parties ever seen           : ' + totals.totalEverSeen);
  console.log('  total deaths                : ' + totals.totalDeaths +
              '  (rivalry: ' + totals.clashDeaths + ', ' + pct(totals.clashDeaths, totals.totalDeaths) + '% of all deaths)');
  console.log('  rivalry clashes              : ' + totals.clashes);
  console.log('  gossip passes                : ' + totals.gossipPasses);
  console.log('  gossip-tainted first meets   : ' + totals.gossipTainted +
              '  (' + pct(totals.gossipTainted, totals.totalEverSeen) + '% of everyone ever seen)');

  console.log('\n  flashpoints primed by type (of ' + totals.totalEverSeen + ' parties ever seen):');
  Object.keys(totals.flashpointsByType).forEach(function (t) {
    var c = totals.flashpointsByType[t];
    console.log('    ' + t + ': ' + c + '  (' + pct(c, totals.totalEverSeen) + '%)');
  });
  console.log('  any flashpoint at all         : ' + totals.everFlashpoint +
              '  (' + pct(totals.everFlashpoint, totals.totalEverSeen) + '% of parties ever seen)');

  console.log('\n  first-prime wave distribution (count of primes landing on that wave):');
  var waveKeys = Object.keys(totals.firstWaveHist).map(Number).sort(function (a, b) { return a - b; });
  waveKeys.forEach(function (w) {
    console.log('    wave ' + w + ': ' + totals.firstWaveHist[w]);
  });
  return totals;
}

if (process.argv.indexOf('--soak') !== -1) process.exit(soak(300) ? 1 : 0);
if (process.argv.indexOf('--escalate') !== -1) { escalate(300, 7); process.exit(0); }
if (process.argv.indexOf('--campaign') !== -1) { campaignVerbose(7, 8); process.exit(0); }
verbose();
