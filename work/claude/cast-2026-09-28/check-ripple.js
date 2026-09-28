// node check-ripple.js — the ripple weights do what Robert ruled.
var MK = require('./market.js'), RP = require('./ripple.js');
var fails = 0, n = 0;
function ok(c, m) { n++; if (!c) { fails++; console.log('FAIL', m); } }
function near(a, b) { return Math.abs(a - b) < 1e-9; }
var s = MK.newMarket(1), R = s.roster;
// set up: Ines/Ivo kin (sheet), Dagny lover of Ivo, Pell friend of Ivo, Tibby guildmate of Ivo
s.ledger.write('dagny', 'ivo', 'lovers', 1, 4, null); s.ledger.write('ivo', 'dagny', 'lovers', 1, 4, null);
s.ledger.write('pell', 'ivo', 'friends', 1, 2, null); s.ledger.write('ivo', 'pell', 'friends', 1, 2, null);
['ivo', 'tibby', 'ines', 'dagny', 'pell', 'morrow'].forEach(function (id) { R[id].m.guild = null; R[id].m.fit = 0; });
R.ivo.m.guild = 'mud'; R.tibby.m.guild = 'mud';
var w = {}; RP.circle(s, R.ivo).forEach(function (c) { w[c.who.id] = c.w; });
ok(near(w.ines, 1), 'kin 100% (' + w.ines + ')');
ok(near(w.dagny, 0.75), 'lovers 75% (' + w.dagny + ')');
ok(near(w.pell, 0.5), 'friends 50% (' + w.pell + ')');
ok(near(w.tibby, 0.25), 'guildmates 25% (' + w.tibby + ')');
ok(!w.morrow, 'strangers untouched');
R.tibby.m.fit = 0.5; w = {}; RP.circle(s, R.ivo).forEach(function (c) { w[c.who.id] = c.w; });
ok(near(w.tibby, 0.35), 'tight clique 35% (' + w.tibby + ')');
R.pell.m.guild = 'mud'; w = {}; RP.circle(s, R.ivo).forEach(function (c) { w[c.who.id] = c.w; });
ok(near(w.pell, 0.5), 'strongest tie wins, not stacked (' + w.pell + ')');
ok(RP.isKin(s, R.ivo, R.ines) && RP.isKin(s, R.ines, R.ivo), 'kin is symmetric');
// harm one twin: both hate the actor equally
var before = s.ledger.rows.length;
RP.spread(s, R.ivo, 'morrow', 'grudge', 0, -4, null);
var f = s.ledger.feeling('ines', 'morrow');
ok(f.warmth === -4, 'hurt Ivo = hurt Ines (' + f.warmth + ')');
ok(s.ledger.feeling('morrow', 'morrow').tags.length === 0, 'actor never grudges self');
// death by a guild: circle blames the guild and will not join it
R.ivo.causeOfDeath = 'left behind by The Hollow Crown';
RP.onDeath(s, R.ivo);
ok(RP.guildFeeling(s, R.ines, 'crown') === -6, 'kin blames the guild fully');
R.ines.m.fame = 90;
var best = MK.bestGuild(s, R.ines);
ok(!best || best.id !== 'crown', 'will not join the guild that left their twin');
console.log(n - fails + '/' + n + ' ripple checks pass');
process.exit(fails ? 1 : 0);
