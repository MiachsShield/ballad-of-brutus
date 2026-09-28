// node check-guildlife.js — guild-guild / guild-person rules hold.
var MK = require('./market.js'), GL = require('./guildlife.js'), RP = require('./ripple.js');
var fails = 0, n = 0;
function ok(c, m) { n++; if (!c) { fails++; console.log('FAIL', m); } }
var s = MK.newMarket(3), G = s.guilds, R = s.roster;
for (var id in R) { R[id].m.guild = null; R[id].m.fame = 90; R[id].m.history = []; }
// relations stay mutual
GL.setRel(G.iron, G.gilt, 'feud');
ok(G.iron.feuds.indexOf('gilt') !== -1 && G.gilt.feuds.indexOf('iron') !== -1, 'feud is mutual');
ok(G.iron.allies.indexOf('gilt') === -1 && G.gilt.allies.indexOf('iron') === -1, 'feud replaces alliance on both sides');
GL.setRel(G.iron, G.gilt, null);
ok(G.iron.feuds.indexOf('gilt') === -1 && G.gilt.feuds.indexOf('iron') === -1, 'truce clears both sides');
// blacklist blocks joining
G.lantern.blacklist.push('gilt'); R.pell.m.history = ['gilt'];
ok(GL.blocked(s, R.pell, G.lantern), 'blacklisted history blocks joining');
var b = MK.bestGuild(s, R.pell); ok(!b || b.id !== 'lantern', 'bestGuild respects the blacklist');
// patron gets first refusal
R.dagny.m.patron = 'mud';
var b2 = MK.bestGuild(s, R.dagny); ok(b2 && b2.id === 'mud', 'patron gets first refusal (' + (b2 && b2.id) + ')');
// merger: members move, cap and charters grow, relations cleaned up
var s2 = MK.newMarket(4), H = s2.guilds;
for (var id2 in s2.roster) s2.roster[id2].m.guild = null;
s2.roster.dagny.m.guild = 'mud'; H.mud.renown = 5; H.lantern.renown = 60;
s2.rand = function () { return 0.01; };
s2.visit = 1; GL.run(s2, function () { return true; });
ok(!H.mud.alive && H.mud.mergedInto === 'lantern', 'failing guild merges into its ally');
ok(s2.roster.dagny.m.guild === 'lantern', 'members move with it');
ok(H.lantern.cap === 4 && H.lantern.charters.indexOf('Beloufi') !== -1, 'host gains cap and the region charter');
ok(Object.keys(H).every(function (k) { return H[k].allies.indexOf('mud') === -1 || !H[k].alive; }), 'nobody allied to a dead guild');
// mentor counts as kin in ripple
var s3 = MK.newMarket(5), Q = s3.roster;
s3.ledger.write('ivo', 'morrow', 'mentor', 2, 2, null); s3.ledger.write('morrow', 'ivo', 'mentee', 1, 2, null);
var w = {}; RP.circle(s3, Q.ivo).forEach(function (c) { w[c.who.id] = c.w; });
ok(w.morrow === 1, 'mentor takes harm to a student like kin');
console.log(n - fails + '/' + n + ' guild-life checks pass');
process.exit(fails ? 1 : 0);
