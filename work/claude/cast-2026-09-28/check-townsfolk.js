// node check-townsfolk.js — the draft covers every sim trait and nation, and keeps Robert's rules.
var fs = require('fs'), NM = require('./names.js'), C = require('./cast.js');
var doc = fs.readFileSync(__dirname + '/TOWNSFOLK.md', 'utf8'), fails = 0, n = 0;
function ok(c, m) { n++; if (!c) { fails++; console.log('FAIL', m); } }
var TRAITS = ['cautious', 'greedy', 'kind', 'pragmatic', 'proud', 'reckless', 'vengeful'];
var used = {}; C.CAST.forEach(function (a) { a.traits.forEach(function (t) { used[t] = 1; }); });
ok(JSON.stringify(Object.keys(used).sort()) === JSON.stringify(TRAITS), 'the seven traits match what the cast actually uses');
ok(TRAITS.every(function (t) { return new RegExp('^\\| ' + t + ' \\|', 'm').test(doc); }), 'every trait has a row in the type table');
ok(Object.keys(NM.BASIS).every(function (r) { return new RegExp('^\\| ' + r + ' \\|', 'm').test(doc); }), 'every nation has a tint');
ok(/respect, belonging, security, love, revenge, escape/.test(doc) && /never an object or a gag/.test(doc), 'the core want is a human desire, never a gag (no burger)');
ok(/short goal/i.test(doc) && /mid goal/i.test(doc) && /long goal/i.test(doc), 'short, mid and long goals are specified');
ok(/No toilet humour/.test(doc) && /perverted/.test(doc) && /immersion/.test(doc), 'the humour limits are stated');
ok(/slums/.test(doc) && /disdain/.test(doc) && /beautiful and young/.test(doc) && /fast and garbled/.test(doc), 'slums, disdain, beautiful-and-young grief and garbled rumours are recorded');
ok(/generics who survive/.test(doc), 'recurring faces are the surviving generics');
ok(/never the narrator's verdict/.test(doc), 'the town\'s shallowness is framed as the joke, not a verdict');
ok(/zero canon/i.test(doc) && /nothing is built/i.test(doc), 'marked zero canon and unbuilt');
ok(!/burger|toilet joke|fart|poop/i.test(doc.replace(/burger\)/, '').replace(/cannot be a burger/, '')), 'no gag fixations or crude humour in the doc');
// the "why" section: nine principles, each with a test
var why = doc.slice(doc.indexOf('## Why the humour works'), doc.indexOf('## Every townsperson has'));
ok(why.length > 2000 && (why.match(/^\d\. \*\*/gm) || []).length === 9, 'the why section lists nine numbered principles');
ok((why.match(/\*Test:\*/g) || []).length === 9, 'every principle carries a one-line test');
ok(['Small cause, huge reaction', 'Sincere jerks', 'One flaw, always the same verb', 'Lovable underneath', 'A closed town with a long memory', 'Hypocrisy drives the gossip', 'behaviour and pretension, never who someone is', "obeys the world's own logic", 'A grounded eye'].every(function (k) { return why.indexOf(k) !== -1; }), 'all nine principles are named');
ok(/never a gag object/.test(why) && /never the\s+narrator's verdict/.test(why) && /no toilet or\s+perverted/.test(why), 'the why section keeps the locked rules (no gag want, no verdict, no crude humour)');
console.log(n - fails + '/' + n + ' townsfolk checks pass');
process.exit(fails ? 1 : 0);
