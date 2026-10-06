// node check-townsfolk.js — the draft covers every sim trait and nation, and keeps Robert's rules.
var fs = require('fs'), NM = require('./names.js'), C = require('./cast.js'), MK = require('./market.js');
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
var why = doc.slice(doc.indexOf('## Why the humour works'), doc.indexOf('## Reference analysis'));
ok(why.length > 2000 && (why.match(/^\d\. \*\*/gm) || []).length === 9, 'the why section lists nine numbered principles');
ok((why.match(/\*Test:\*/g) || []).length === 9, 'every principle carries a one-line test');
ok(['Small cause, huge reaction', 'Sincere jerks', 'One flaw, always the same verb', 'Lovable underneath', 'A closed town with a long memory', 'Hypocrisy drives the gossip', 'behaviour and pretension, never who someone is', "obeys the world's own logic", 'A grounded eye'].every(function (k) { return why.indexOf(k) !== -1; }), 'all nine principles are named');
ok(/never a gag object/.test(why) && /never the\s+narrator's verdict/.test(why) && /no toilet or\s+perverted/.test(why), 'the why section keeps the locked rules (no gag want, no verdict, no crude humour)');
// the reference analysis
var ref = doc.slice(doc.indexOf('## Reference analysis'), doc.indexOf('## Chosen engines'));
ok(/South Park/.test(ref) && /Bikini Bottom/.test(ref) && /Springfield/.test(ref), 'the reference analysis covers all three crowds');
ok(/Borrow:/.test(ref) && /Leave:/.test(ref) && (ref.match(/\*Borrow:\*/g) || []).length === 3 && (ref.match(/\*Leave:\*/g) || []).length === 3, 'each crowd lists what to borrow and what to leave');
ok(['mob flips', 'Flawed institutions', 'reaction chorus', 'verbal tic', 'Reset, but with memory'].every(function (k) { return new RegExp(k, 'i').test(ref); }), 'the five shared engines are named');
ok(/nobody stays dead/.test(ref) && /Deaths stay real/.test(ref), 'the reset-versus-permanent-death caution is stated');
// chosen engines and the telephone rule
var tel = doc.slice(doc.indexOf('## Chosen engines'), doc.indexOf('## How the jobless get by'));
ok(/regular \+ reactionary crowd-like game of telephone/.test(tel), 'Robert\'s pick is quoted exactly');
ok(TRAITS.every(function (t) { return new RegExp('^\\| ' + t + ' \\|', 'm').test(tel); }), 'the telephone table bends a rumour for every trait');
ok(/true line and the town's version/.test(tel) && /nothing built/.test(tel), 'the player sees both versions, and the rule is marked unbuilt');
ok((tel.match(/^\d\. \*/gm) || []).length === 5, 'the worked example has five hops');
// across communities: a community is the adventurer's own circle
var comm = tel.slice(tel.indexOf('**Across communities'));
ok(/one action can become distorted across\s+communities/.test(comm), 'Robert\'s words on communities are quoted exactly');
ok(/the people the adv\.\s+fratnerizes with/.test(comm), 'Robert\'s definition of a community is quoted exactly');
ok(['Kin', 'Lovers and crushes', 'Friends', 'Guildmates and the clique', 'Rivals', 'The slums crowd'].every(function (r) { return new RegExp('^\\| ' + r + ' \\|', 'm').test(comm); }), 'every circle type has a lens');
ok((comm.match(/^- \*/gm) || []).length >= 6 && /Bramble/.test(comm), 'the worked example gives at least six circles\' versions of one action');
ok(/Proposal, nothing built/.test(comm) && /stake/.test(comm) && /ripple/.test(comm), 'the fork is marked unbuilt, with the stake-then-trait rule and the ripple graph');
ok(/must not preoccupy a lot of cognition/.test(comm) && /tbd/.test(comm), 'the low-cognitive-load constraint and the open player question are recorded');
// flawed institutions and the rumour lifespan
var inst = doc.slice(doc.indexOf('**Flawed institutions'), doc.indexOf('## How the jobless get by'));
ok(/Yes, guilds\s+and guards too/.test(doc), 'Robert\'s ruling on flawed institutions is quoted exactly');
ok(MK.GUILDS.every(function (g) { return new RegExp('^\\| ' + g.name + ' \\|', 'm').test(inst); }), 'every guild has a row in the institutions table');
ok(MK.GUILDS.every(function (g) {
  var row = (inst.match(new RegExp('^\\| ' + g.name + ' \\| ([^|]*)\\|', 'm')) || [])[1] || '';
  return (g.holds || []).every(function (t) { return row.indexOf(t) !== -1; });
}), 'each guild row lists the traits that guild actually holds in the sim');
ok(/watch/.test(inst) && /clerks/.test(inst) && /magistrate/.test(inst), 'the guard and the town offices are covered');
ok(/people move on fast/.test(doc) && /Rumours die fast/.test(doc), 'rumours die fast (Robert\'s words)');
ok(/With regulars, people die\.\s+Or they join a guild\. I guess that is when they are regulars\./.test(doc), 'Robert\'s words on regulars are quoted exactly');
ok(/not a formal mechanic/.test(doc) && /the guild is the filter/.test(doc) && /join a guild/.test(doc), 'regulars are not a formal mechanic: they are the ones who join a guild');
ok(!/1a2 a xv/.test(doc), 'the superseded unreadable fragment is gone');
// 2026-10-03 batch: breaks, resets, tics, nature, beauty
ok(/a squabble isn't worth a blood feud/.test(doc) && /never escalate into blood feuds/.test(doc), 'squabbles never become blood feuds (Robert\'s words)');
ok(/No, it's\s+other things too/.test(doc), 'a guild is not the only way to catch a break');
ok(/ask later/.test(doc) && /verbal tic/.test(doc), 'the verbal tic is parked as ask-later');
ok(/townsfolk aren't\s+different from adv\. nature wise/.test(doc), 'townsfolk share the adventurers\' nature (Robert\'s words)');
ok(/different people different preferences/.test(doc) && /no\s+island-wide standard/.test(doc), 'beauty is personal, with no island-wide standard');
// how the jobless get by
var jb = doc.slice(doc.indexOf('## How the jobless get by'), doc.indexOf('## Every townsperson has'));
ok(/cheap, talentless labor with essentially no value lost if anything were to happen\s+to them/.test(jb) && /caught doing something unscrupulous/.test(jb), 'the jobless are expendable cheap labour (Robert\'s words)');
ok(/nigh impossible alone; they would need people\s+in high places who care about them/.test(jb), 'escape needs a patron (Robert\'s words)');
ok(/porters/.test(jb) && /patsy/.test(jb) && /nothing built/.test(jb), 'the kinds of disposable work are listed, marked unbuilt');
ok(/principle 7/.test(jb) && /butt/.test(jb), 'the joke stays on the town, not the jobless');
ok(/Yes, a player-facing favor/.test(jb) && /1 and 2\. you are vouching for them/.test(jb), 'the player can be a patron, and it costs reputation and money or favours (Robert\'s words)');
ok(/ripple/.test(jb) && /single\s+favour choice/.test(jb), 'vouching rides the ripple ties and stays a single choice');
console.log(n - fails + '/' + n + ' townsfolk checks pass');
process.exit(fails ? 1 : 0);
