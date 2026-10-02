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
// Robert's locked rulings (world bible 4.6) must show up in the looks
function has(r, re) { return re.test(section(r)); }
ok(has('Marium', /brawny/i) && has('Marium', /bronze/i) && has('Marium', /Brutus/) && has('Marium', /exceptionally vigorous/i), 'Marium: brawny, bronze, Brutus exceptionally vigorous');
ok(has('Themelios', /divers|every (colour|complexion|build|face)/i) && has('Themelios', /appraising|pricing/i), 'Themelios: diverse, appraising');
ok(has('Reyjar', /porcelain/i) && has('Reyjar', /slender/i) && has('Reyjar', /sunken/i) && has('Reyjar', /white-blonde/i) && has('Reyjar', /jet black/i) && has('Reyjar', /high cheekbones/i) && has('Reyjar', /relatively tall/i), 'Reyjar: porcelain, white-blonde to black, high cheekbones, sunken eyes, slender, relatively tall');
ok(!/bronze|sun-bronzed/i.test(section('Reyjar')), 'Reyjar is not bronzed (an earlier draft was)');
ok(has('Li Trice', /petite to average/i) && has('Li Trice', /beauty marks/i) && has('Li Trice', /almond/i) && has('Li Trice', /red-brown/i) && has('Li Trice', /stockier/i) && has('Li Trice', /hip\s+and\s+thigh/i), 'Li Trice: petite to average, beauty marks, almond hair, red-brown eyes, stockier men, fuller women');
ok(has('Ayusti', /light tan/i) && has('Ayusti', /petite to average/i) && has('Ayusti', /cute/i) && has('Ayusti', /Japanese/i), 'Ayusti: light tan, petite to average, cute, Japanese-leaning face');
ok(has('Beloufi', /six to seven feet/i), 'Beloufi: six to seven feet');
ok(has('Edinius', /pale white/i) && has('Edinius', /tall/i) && has('Edinius', /Lithuanian/i) && has('Edinius', /light green/i), 'Edinius: pale white, tall, Lithuanian face and eyes, light green');
ok(/Height and build/.test(doc), 'the cheat-sheet carries a height column');
// the bible, when present, must hold all seven rulings word for word
var cands = [__dirname + '/../../../canon/world-bible-v3.md', __dirname + '/../canon/world-bible-v3.md', __dirname + '/canon/world-bible-v3.md'];
var bible = null; cands.forEach(function (c) { if (!bible && fs.existsSync(c)) bible = fs.readFileSync(c, 'utf8'); });
if (bible) {
  ['exceptionally vigorous', 'as likely to gossip about you negatively as inviting you for dinner', 'slight natural sunkeness in their eyes',
   'Beauty marks on face, arms legs', 'Face leands to be more Japanese esque', "They just don't care for the misery it will cause",
   'Lithuanian face shape and eyes'].forEach(function (q) { ok(bible.indexOf(q) !== -1, 'world bible 4.6 holds the ruling verbatim: "' + q + '"'); });
  ok(/Compiler's readings \(NOT canon/.test(bible) && /Proposed continuation \(zero canon/.test(bible), 'the bible keeps readings and continuation marked as not canon');
}
console.log(n - fails + '/' + n + ' looks checks pass');
process.exit(fails ? 1 : 0);
