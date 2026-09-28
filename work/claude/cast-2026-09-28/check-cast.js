// Sanity checks for cast.js against the sim's trait table.
var OW = require('../overworld-2026-09-18/adventurers.js'), C = require('./cast.js');
var fails = 0, n = 0;
function ok(cond, msg) { n++; if (!cond) { fails++; console.log('FAIL', msg); } }
ok(C.CAST.length === 10, 'ten adventurers');
var ids = {};
C.CAST.forEach(function (a) {
  ok(!ids[a.id], a.id + ' unique'); ids[a.id] = true;
  ok(C.CLASSES.indexOf(a.class) !== -1, a.id + ' known class');
  ok(C.ARCHETYPES.indexOf(a.archetype) !== -1, a.id + ' archetype');
  ok(a.traits.length === 2 && a.traits.every(function (t) { return OW.TRAITS[t]; }), a.id + ' traits valid in sim');
  var d = a.desires, sum = d.gold + d.strongGuild + d.friends;
  ok(sum === 100, a.id + ' desires sum 100 (' + sum + ')');
  var top = Object.keys(d).sort(function (x, y) { return d[y] - d[x]; })[0];
  ok(top === a.dominant, a.id + ' dominant matches');
  ok(d[top] < 100, a.id + ' is a mix');
  ok(a.tier >= 1 && a.tier <= 5, a.id + ' tier range');
  ok(a.tone === 'comic' || a.tone === 'grim', a.id + ' tone');
  a.ties.forEach(function (t) {
    var o = C.byId(t.with);
    ok(o && o.ties.some(function (b) { return b.with === a.id; }), a.id + ' tie reciprocal with ' + t.with);
  });
});
var pairs = C.CAST.filter(function (a) { return a.ties.length; }).length / 2;
ok(pairs >= 1 && pairs <= 2, 'a pair or two (' + pairs + ')');
var tones = C.CAST.map(function (a) { return a.tone; });
ok(tones.indexOf('comic') !== -1 && tones.indexOf('grim') !== -1, 'exaggerated both ways');
console.log(n - fails + '/' + n + ' checks pass');
process.exit(fails ? 1 : 0);
