// node check-bulletin.js — the bulletin shows at most 3 grouped stories.
var MK = require('./market.js'), B = require('./bulletin.js');
var fails = 0, n = 0;
function ok(c, m) { n++; if (!c) { fails++; console.log('FAIL', m); } }
var s = MK.newMarket(1);
var news = [
  { kind: 'haul', text: 'A hauls 50', named: false }, { kind: 'haul', text: 'B hauls 90', named: true },
  { kind: 'duel', text: 'C beats D', named: true }, { kind: 'died', text: 'E dies', named: true },
  { kind: 'clicked', text: 'F and G friends', named: false }, { kind: 'turf', text: 'H and I fight', named: false },
  { kind: 'merger', text: 'J folds into K', named: false }
];
var top = B.bulletin(s, news);
ok(top.length === 3, 'exactly 3 stories');
ok(top[0].group === 'Deaths', 'a named death leads');
var feats = top.filter(function (t) { return t.group === 'Feats'; })[0];
ok(feats && feats.more === 2, 'duels and hauls fold into one Feats story (+2 more)');
ok(feats && feats.lead === 'C beats D', 'the biggest feat leads the story');
ok(top.every(function (t) { return t.group !== 'Hearts'; }), 'small stories drop off');
ok(B.bulletin(s, []).length === 0, 'a quiet week shows nothing');
var t2 = B.bulletin(s, [{ kind: 'shift', text: 'X wants gold now', named: true }, { kind: 'clicked', text: 'Y and Z friends', named: false }]);
ok(t2[0].group === 'Hearts' && t2[1].group === 'Around town', 'small talk only fills gaps');
var allKinds = []; Object.keys(B.GROUPS).forEach(function (g) { allKinds = allKinds.concat(B.GROUPS[g].kinds); });
ok(allKinds.length === new Set(allKinds).size, 'every kind is in one group only');
console.log(n - fails + '/' + n + ' bulletin checks pass');
process.exit(fails ? 1 : 0);
