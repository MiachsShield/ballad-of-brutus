// node check-names.js — names stay period-appropriate and readable.
var MK = require('./market.js'), NM = require('./names.js'), C = require('./cast.js');
var fails = 0, n = 0;
function ok(c, m) { n++; if (!c) { fails++; console.log('FAIL', m); } }
var regions = Object.keys(NM.BASIS), fs = require('fs');
ok(regions.length === 7 && regions.every(function (r) { return NM.POOLS[r] && NM.POOLS[r].length >= 12; }), 'seven regions, each with a pool of 12+ names');
ok(regions.every(function (r) { return NM.HOUSES[r] && NM.HOUSES[r].length >= 6 && NM.HOUSES[r].every(function (h) { return /^[A-Za-z']+$/.test(h) && !NM.BLOCK.test(h); }); }), 'each region has 6+ house names, plain ASCII');
var allHouses = []; regions.forEach(function (r) { allHouses = allHouses.concat(NM.HOUSES[r]); });
ok(allHouses.length === new Set(allHouses).size, 'no house name sits in two regions');
var doc = fs.readFileSync(__dirname + '/NATIONS.md', 'utf8');
ok(regions.every(function (r) { return doc.indexOf('## ' + r) !== -1 && doc.indexOf(NM.BASIS[r].replace('-', '-')) !== -1; }), 'NATIONS.md covers every region and its basis');
ok(allHouses.every(function (h) { return doc.indexOf(h) !== -1; }), 'every house name in names.js appears in NATIONS.md (data and doc agree)');
ok(C.CAST.every(function (a) {
  var t = a.name.replace(/^Sister /, '').split(' ');
  return t.length === 1 || NM.HOUSES[a.region].indexOf(t[t.length - 1]) !== -1;
}), 'every cast surname comes from the home region\'s house names');
ok(NM.POOL.length === new Set(NM.POOL).size, 'no name sits in two regions (a name says where you are from)');
ok(NM.POOL.every(function (x) { return !NM.BLOCK.test(x) && /^[A-Z][a-z]+$/.test(x); }), 'pool: plain ASCII period names, no digits or modern words');
ok(JSON.stringify(regions.sort()) === JSON.stringify(C.REGIONS.slice().sort()), 'names.js and cast.js agree on the seven regions');
ok(C.CAST.every(function (a) { return NM.BASIS[a.region]; }), 'every cast member has a home region with a basis');
var poolClash = C.CAST.filter(function (a) { return NM.POOL.indexOf(a.name.split(' ')[0]) !== -1 || NM.POOL.indexOf(a.name) !== -1; });
ok(poolClash.length === 0, 'no newcomer pool name collides with a named character (' + poolClash.map(function (a) { return a.name; }).join(',') + ')');
ok(C.CAST.filter(function (a) { return a.id !== 'ember' && a.id !== 'wren'; }).every(function (a) { return a.look && a.look.length > 40 && a.look.length < 220; }), 'every authored character has a one-line look');
ok(C.CAST.every(function (a) { return !NM.BLOCK.test(a.name) && !NM.BLOCK.test(a.epithet); }), 'cast names and epithets pass the lint');
ok(Object.keys(MK.GUILDS).every(function (k) { return !NM.BLOCK.test(MK.GUILDS[k].name); }), 'guild names pass the lint');
// naming must not touch the sim's random stream
var s = MK.newMarket(9), calls = 0, real = s.rand; s.rand = function () { calls++; return real(); };
var before = calls; NM.rename(s, { id: 'w5_1', name: 'X', m: { region: 'Marium' } });
ok(calls === before, 'renaming never consumes the sim random stream');
// a newcomer is named from their own region's pool
var okRegion = true;
regions.forEach(function (r) {
  var t = MK.newMarket(3); t.roster = {};
  var p = { id: 'w9_0', name: 'X', m: { region: r } }; t.roster.w9_0 = p; NM.rename(t, p);
  if (NM.POOLS[r].indexOf(p.name) === -1) okRegion = false;
});
ok(okRegion, 'newcomers are named from their region\'s pool');
// when every name in a region is taken, fall back to seniority, never a numeral
var s2 = MK.newMarket(9); s2.roster = {};
NM.POOLS.Beloufi.forEach(function (nm, i) { s2.roster['t' + i] = { id: 't' + i, name: nm, alive: true }; });
var p1 = { id: 'new1', name: 'Marta 2', m: { region: 'Beloufi' } }; s2.roster.new1 = p1; NM.rename(s2, p1);
ok(/ (the Younger|the Elder|the Third)$/.test(p1.name) && !/\d/.test(p1.name), 'full region: told apart by seniority (' + p1.name + ')');
var p2 = { id: 'new2', name: 'x', m: { region: 'Beloufi' } }; s2.roster.new2 = p2; s2.roster.new1.name = p1.name; NM.rename(s2, p2);
ok(!/\d/.test(p2.name) && p2.name !== p1.name, 'second clash gets a different seniority, never a numeral (' + p2.name + ')');
// a whole season: nobody shares a display name, nobody wears a numeral
var dup = 0, digit = 0, wrongRegion = 0, plain = {};
for (var i = 1; i <= 60; i++) {
  var m = MK.newMarket(i);
  for (var v = 1; v <= 10; v++) {
    MK.visit(m); var names = {};
    for (var id in m.roster) {
      var q = m.roster[id], nm = q.name; if (names[nm]) dup++; names[nm] = 1; if (/\d/.test(nm)) digit++;
      if (!q.sheet) { var first = nm.split(' ')[0]; plain[first] = 1; if (NM.POOLS[q.m.region].indexOf(first) === -1) wrongRegion++; }
    }
  }
}
ok(dup === 0, 'no two people share a name in the same town (60 seasons)');
ok(digit === 0, 'no numerals in any name (60 seasons)');
ok(wrongRegion === 0, 'every newcomer\'s name matches their home region (60 seasons)');
console.log(n - fails + '/' + n + ' name checks pass');
process.exit(fails ? 1 : 0);
