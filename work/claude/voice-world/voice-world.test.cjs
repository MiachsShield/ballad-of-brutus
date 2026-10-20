// node work/claude/voice-world/voice-world.test.cjs
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/voice-world.js','utf8');
assert(!/["`$]/.test(src.replace(/\/\*[\s\S]*?\*\//,'')) && !/[\\]/.test(src.replace(/\/\*[\s\S]*?\*\//,'')),'embed-safe characters only');
const ctx={S:{guilds:{g:{name:'Ember Hall'}},agents:[{id:1,name:'Ana',alive:true},{id:2,name:'Bo',alive:true,epithet:'the Loud'},{id:3,name:'Cy',alive:false}]},
 dispatchCard:e=>'['+e.title+'|'+e.body+']'};
vm.createContext(ctx);vm.runInContext(src,ctx);
const card=(body,kind,id=5)=>vm.runInContext('dispatchCard('+JSON.stringify({id,kind,body,title:'T',actors:[{id:1,name:'Ana'}]})+')',ctx);
let r=card('Ana is released from Ember Hall.','major');
assert(/I can't believe Ana was kicked out of Ember Hall!/.test(r),r);
assert(/Bo, the Loud|Bo - /.test(r)&&/Ana is released/.test(r),'speaker is a bystander and facts kept: '+r);
assert(!/Ana\|/.test(r.split('|')[0]),'speaker is not the subject');
assert(/never forgets/.test(card('x','revenge')));
assert(/A bounty on Ana/.test(card('A bounty goes up on Ana','drama')));
assert(/Ana is gone/.test(card('Ana died in the dark','death')));
assert(/It is about Ana/.test(card('Something unclassifiable about Ana','drama')));
assert.equal(card('x','drama',5),card('x','drama',5),'stable per card id');
ctx.S.agents=[{id:1,name:'Ana',alive:true}];
assert(/^\[T\|/.test(card('Ana is released','major')),'no bystander: original card unchanged');
ctx.S.agents=[{id:1,name:'Ana',alive:true},{id:2,name:'Bo',alive:true}];
assert(/favourite/.test(card('Public standing changed from 0 to 18.','reputation')));
assert(/name out loud/.test(card('Public standing changed from 14 to 0.','reputation')));
ctx.S.agents=[{id:1,name:'Ana',alive:true},{id:2,name:'Bo',alive:true}];
assert(/numbers are in/.test(vm.runInContext('dispatchCard({id:2,kind:"drama",body:"Among people Brutus hasnt dealt with: 11 died",actors:[]})',ctx)));
for(const b of ['Ana died','Ana is released','x','A bounty on Ana','Ana walked out','Public standing changed from 1 to 5.'])assert(!/[A-Z]{4,}/.test(card(b,'drama').split('|')[0].replace(/\[|T/,'')),'no shouting: '+card(b,'drama'));
console.log('voice-world: all pass');
