// node check-names.js — names stay period-appropriate and readable.
var MK = require('./market.js'), NM = require('./names.js'), C = require('./cast.js');
var fails = 0, n = 0;
function ok(c, m) { n++; if (!c) { fails++; console.log('FAIL', m); } }
ok(NM.POOL.length === new Set(NM.POOL).size, 'no duplicate names in the pool');
ok(NM.POOL.every(function (x) { return !NM.BLOCK.test(x) && /^[A-Z][a-z]+$/.test(x); }), 'pool: plain period names, no digits or modern words');
ok(C.CAST.every(function (a) { return !NM.BLOCK.test(a.name) && !NM.BLOCK.test(a.epithet); }), 'cast names and epithets pass the lint');
ok(Object.keys(MK.GUILDS).every(function (k) { return !NM.BLOCK.test(MK.GUILDS[k].name); }), 'guild names pass the lint');
// naming must not touch the sim's random stream
var s = MK.newMarket(9), calls = 0, real = s.rand; s.rand = function () { calls++; return real(); };
var before = calls; NM.rename(s, { id: 'w5_1', name: 'X', m: { region: 'Marium' } });
ok(calls === before, 'renaming never consumes the sim random stream');
// when every plain name is taken, fall back to region, then seniority
var s2 = MK.newMarket(9); s2.roster = {};
NM.POOL.forEach(function (nm, i) { s2.roster['t' + i] = { id: 't' + i, name: nm, alive: true }; });
var p = { id: 'new1', name: 'Marta 2', m: { region: 'Beloufi' } }; s2.roster.new1 = p;
NM.rename(s2, p);
ok(/ of Beloufi$/.test(p.name) && !/\d/.test(p.name), 'full pool: told apart by region (' + p.name + ')');
var q = { id: 'new1', name: 'x', m: { region: 'Beloufi' } };
s2.roster.dupe = { id: 'dupe', name: p.name, alive: true };
var q2 = { id: 'new1', name: 'x', m: { region: 'Beloufi' } }; s2.roster.new2 = q2; q2.id = 'new1';
NM.rename(s2, q2);
ok(!/\d/.test(q2.name), 'second clash falls back to seniority, never a numeral (' + q2.name + ')');
// a whole season: nobody shares a display name, nobody wears a numeral
var dup = 0, digit = 0, seen = {};
for (var i = 1; i <= 60; i++) {
  var m = MK.newMarket(i);
  for (var v = 1; v <= 10; v++) {
    MK.visit(m); var names = {};
    for (var id in m.roster) { var nm = m.roster[id].name; if (names[nm]) dup++; names[nm] = 1; if (/\d/.test(nm)) digit++; if (!m.roster[id].sheet) seen[nm.split(' ')[0]] = 1; }
  }
}
ok(dup === 0, 'no two people share a name in the same town (60 seasons)');
ok(digit === 0, 'no numerals in any name (60 seasons)');
ok(Object.keys(seen).every(function (nm) { return NM.POOL.indexOf(nm) !== -1; }), 'every newcomer is named from the pool');
console.log(n - fails + '/' + n + ' name checks pass');
process.exit(fails ? 1 : 0);
