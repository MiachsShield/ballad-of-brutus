// node check-looks.js — LOOKS.md covers every nation, completely, and keeps Robert's rules.
var fs = require('fs'), NM = require('./names.js');
var doc = fs.readFileSync(__dirname + '/LOOKS.md', 'utf8'), fails = 0, n = 0;
function ok(c, m) { n++; if (!c) { fails++; console.log('FAIL', m); } }
var regions = Object.keys(NM.BASIS);
var SECTIONS = ['Face', 'Eyes and brows', 'Skin', 'Hair', 'Build and carriage', 'Hands and marks', 'Aging', 'Variation'];
function section(r) {
  var a = doc.indexOf('## ' + r), b = doc.indexOf('\n## ', a + 3);
  return a === -1 ? '' : doc.slice(a, b === -1 ? doc.length : b);
}
ok(regions.every(function (r) { return section(r).indexOf(NM.BASIS[r]) !== -1; }), 'every nation has a section naming its basis');
regions.forEach(function (r) {
  var s = section(r);
  ok(SECTIONS.every(function (k) { return s.indexOf('**' + k + ':**') !== -1; }), r + ' has all eight feature sections');
  ok(s.length > 1200, r + ' is elaborated (' + s.length + ' chars)');
});
ok(!/tupi|indigenous|african|amerindian|native american/i.test(section('Ayusti')), 'Ayusti is Japanese plus Brazilian only: no extra heritages');
ok(/half-and-half/i.test(section('Li Trice')) && /never half-and-half/i.test(doc), 'the "never half-and-half" rule is stated');
ok(/Pick three/.test(doc) && /Ranges, not types/.test(doc), 'usage rules are present');
ok(regions.every(function (r) { return doc.indexOf('| ' + r + ' |') !== -1; }), 'the art cheat-sheet lists every nation');
ok(!/slant|exotic|oriental/i.test(doc), 'no loaded descriptors');
console.log(n - fails + '/' + n + ' looks checks pass');
process.exit(fails ? 1 : 0);
