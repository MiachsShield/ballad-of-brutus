/* node acceptance.js — how often someone whose traits an evil guild dislikes
 * still ends up accepted (fit >= 0 after 3+ visits). Target: difficult, not impossible. */
var MK = require('./market.js'), CL = require('./cliques.js');
var tries = 0, accepted = 0, died = 0;
for (var i = 1; i <= 300; i++) {
  var s = MK.newMarket(i), seen = {};
  for (var v = 1; v <= 10; v++) {
    MK.visit(s);
    for (var id in s.roster) {
      var p = s.roster[id], g = p.m.guild && s.guilds[p.m.guild];
      if (!g || g.leaning !== 'evil') continue;
      if (!p.traits.some(function (t) { return g.loses.indexOf(t) !== -1; })) continue;
      var key = id + g.id;
      if (!seen[key]) { seen[key] = { since: v, ok: false }; tries++; }
      if (!seen[key].ok && v - seen[key].since >= 3 && p.m.fit >= 0) { seen[key].ok = true; accepted++; }
    }
  }
}
console.log('misfit-trait stints in evil guilds: ' + tries + ' | accepted within 3+ visits: ' + (100 * accepted / tries).toFixed(0) + '%');
