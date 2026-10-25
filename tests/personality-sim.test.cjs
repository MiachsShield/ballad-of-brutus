// Personality experiment sim: a year runs stable, Brutus can back someone, saves round-trip.
const assert = require('assert');
const S = require('../src/experiment/world-sim.js');
const w = S.create(20261025);
const first = S.alive(w).length;
for (let i = 0; i < 4; i++) S.step(w);
const target = S.alive(w).find(p => p.rank === 'B');
const gold0 = w.brutus.gold, r = S.brutusBack(w, target.id);
assert(!r.error, 'brutusBack failed: ' + r.error);
assert(w.brutus.gold < gold0, 'stake costs gold');
assert(S.brutusBack(w, target.id).error, 'cannot back the same person twice');
for (let i = 0; i < 48; i++) S.step(w);
const pop = S.alive(w).length;
assert(pop > first * 0.8 && pop < first * 1.25, 'population band: ' + first + ' -> ' + pop);
const strained = w.series.strained.at(-1);
assert(strained > 0.03 && strained < 0.4, 'strained share ' + strained);
assert(S.live(w).length >= 3, 'some guilds stand');
for (const p of w.people) for (const k of ['purse', 'fame', 'hunger']) assert(Number.isFinite(p[k]), p.name + ' ' + k);
for (const g of w.guilds) assert(Number.isFinite(g.treasury), g.name + ' treasury');
for (let wk = 1; wk <= w.week; wk++) {
  const b = S.bulletin(w, wk, 3);
  assert(b.length > 0, 'bulletin empty in week ' + wk);
  for (const e of b) assert(!e.hidden && e.kind !== 'coop', 'secret or filler leaked into bulletin');
}
for (const e of w.events) assert(e.because == null || e.because < e.id, 'cause comes before effect');
const stake = w.stakes.find(s => s.by === S.BRUTUS);
assert(stake.left < 26, 'stake ticks down');
// save / load round trip keeps the world going identically
const copy = JSON.parse(JSON.stringify(w));
S.step(w); S.step(copy);
assert.strictEqual(JSON.stringify(w), JSON.stringify(copy), 'reloaded world diverged');
// same seed, same world
const a = S.create(7), b = S.create(7);
for (let i = 0; i < 10; i++) { S.step(a); S.step(b); }
assert.strictEqual(JSON.stringify(a), JSON.stringify(b), 'seeded runs differ');
console.log('personality-sim ok', { week: w.week, pop, strained: +strained.toFixed(3), events: w.events.length, stake: { paid: Math.round(stake.paid), left: stake.left } });
