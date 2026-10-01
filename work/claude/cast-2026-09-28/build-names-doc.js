/* node build-names-doc.js  — regenerates NAMES.md from names-data.js.
 * check-names.js fails if NAMES.md is out of date. */
var fs = require('fs'), NM = require('./names.js');
var out = ['# Given names, by nation', '',
  'Generated from `names-data.js` by `node build-names-doc.js`. Do not edit by hand.',
  'Newcomers are named from these pools (150+ per nation). Groups say where a name comes from;',
  'a `meld` group is names that belong to the blended people. See `NATIONS.md` for the logic,',
  'and `names.js` for house (family) names. Ember, Wren and the nine authored characters are not in the pools.', ''];
var total = 0;
Object.keys(NM.DATA).forEach(function (r) {
  var n = NM.POOLS[r].length; total += n;
  out.push('## ' + r + ' — ' + NM.BASIS[r] + ' (' + n + ' names)', '');
  Object.keys(NM.DATA[r]).forEach(function (g) {
    out.push('**' + g + '** (' + NM.DATA[r][g].length + ')', '', NM.DATA[r][g].join(', '), '');
  });
});
out.push('---', '', total + ' names across ' + Object.keys(NM.DATA).length + ' nations.', '');
fs.writeFileSync(__dirname + '/NAMES.md', out.join('\n'));
console.log('NAMES.md: ' + total + ' names');
