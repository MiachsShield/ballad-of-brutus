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
// one population: built from a host game's cast; the host reports deaths, hires, recruits, expeditions
const cast = [];
for (let i = 0; i < 240; i++) cast.push({ name: 'Person ' + i, level: (i * 7) % 45, guild: i % 6 === 0 ? null : i % 12, held: i < 2, lover: i === 10 ? 11 : null });
const gl = []; for (let i = 0; i < 12; i++) gl.push({ name: 'Guild ' + i });
const born = [];
S.hooks.name = () => 'Newcomer ' + born.length;
S.hooks.born = (hw, p) => born.push(p.id);
const h = S.fromCast(99, cast, gl, { gold: 250000, population: 240 });
assert.strictEqual(h.people.length, 240, 'one person per cast member');
assert.strictEqual(h.people[5].name, 'Person 5', 'cast names kept');
assert(h.people[0].held && h.people[0].guild == null, "Brutus's company is held, guildless");
assert.strictEqual(h.people[10].lover, 11, 'cast lovers kept');
const counts = {}; h.people.forEach(p => counts[p.rank] = (counts[p.rank] || 0) + 1);
assert(counts.S >= 3 && counts.A >= 10 && counts.D >= 100, 'ranks from level percentiles ' + JSON.stringify(counts));
const top = h.people.reduce((m, p, i) => cast[i].level > cast[m].level ? i : m, 0);
assert.strictEqual(h.people[top].rank, 'S', 'the highest level is S-rank');
for (let i = 0; i < 20; i++) S.step(h);
assert(born.length > 0, 'newcomers go through the host hooks');
assert(h.people[0].alive ? h.people[0].held && h.people[0].guild == null : true, 'held people stay off the market');
assert(!h.events.some(e => e && e.kind === 'coop'), 'host mode keeps no filler events');
// the host reports things
const victim = S.alive(h).find(p => !p.held && p.kin.length) || S.alive(h).find(p => !p.held);
const ke = S.kill(h, victim.id, victim.name + ' died in a test.', 'death');
assert(!victim.alive && h.events[ke].text.includes('died in a test'), 'host death is news');
const mover = S.alive(h).find(p => !p.held && p.guild != null);
S.setGuild(h, mover.id, null, mover.name + ' leaves.', 'walkout');
assert.strictEqual(mover.guild, null, 'host guild move');
S.setHeld(h, mover.id, true, mover.name + ' signs on with Brutus.');
assert(mover.held && h.events[h.events.length - 1].brutus, 'joining Brutus is news about Brutus');
const adopted = S.adopt(h, { name: 'Walk-in', level: 44, guild: 3 });
assert(adopted.alive && adopted.guild === 3 && 'ABS'.includes(adopted.rank), 'adopted by level floor: ' + adopted.rank);
const cat = S.news(h, 'The beast tide hits hard.', [victim.id], null, 'catastrophe', 2);
const v2 = S.alive(h).find(p => !p.held);
const kd = S.kill(h, v2.id, v2.name + ' died when the beast tide hit.', 'death', cat, .3);
assert.deepStrictEqual(S.chain(h, kd).map(e => e.kind).slice(-2), ['catastrophe', 'death'], 'a world-event death traces to the event');
// an expedition, and an opening someone else claims
const exp = S.outcome(h, { name: 'The Quiet House', rank: 3, objective: 'Reach the third floor', reward: 60000 }, false, true, [mover.id]);
assert(h.events[exp].brutus && h.events[exp].actors.includes(mover.id) && /dragged back up/.test(h.events[exp].text), 'expedition with the party is news');
const cl = S.claim(h, { name: 'The Quiet House', rank: 3, reward: 60000, tried: exp });
assert(cl != null && h.events[cl].because === exp && /Brutus came up without/.test(h.events[cl].text), 'a claim traces back to his attempt');
const won = S.outcome(h, { name: 'The Hollow Crown', rank: 2, objective: 'Defeat five enemies', reward: 35000 }, true, false, []);
assert(/job done/.test(h.events[won].text), 'a finished job is news');
// saves stay small and still load
const before = JSON.stringify(h).length; S.compact(h);
const after = JSON.stringify(h).length;
assert(after < before, 'compact shrinks the save');
const back = JSON.parse(JSON.stringify(h)); S.step(back);
assert.strictEqual(back.week, h.week + 1, 'a compacted save keeps running');
S.hooks.name = S.hooks.born = null;
console.log('personality-sim ok', { week: w.week, pop, strained: +strained.toFixed(3), events: w.events.length, stake: { paid: Math.round(stake.paid), left: stake.left } });
