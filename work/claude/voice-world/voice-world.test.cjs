// node work/claude/voice-world/voice-world.test.cjs
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/voice-world.js','utf8');
assert(!/["`$]/.test(src.replace(/\/\*[\s\S]*?\*\//,'')) && !/[\\]/.test(src.replace(/\/\*[\s\S]*?\*\//,'')),'embed-safe characters only');
const ctx={S:{guilds:{g:{name:'Ember Hall'}},agents:[{id:1,name:'Ana',alive:true},{id:2,name:'Bo',alive:true,epithet:'the Loud'},{id:3,name:'Cy',alive:false}]},
 dispatchCard:e=>'['+e.title+'|'+e.body+']'};
vm.createContext(ctx);vm.runInContext(src,ctx);
const card=(body,kind,id=5)=>vm.runInContext('dispatchCard('+JSON.stringify({id,kind,body,title:'T',actors:[{id:1,name:'Ana'}]})+')',ctx);
let r=card('Ana is released from Ember Hall.','major');
assert(/I CAN'T BELIEVE ANA WAS KICKED OUT OF EMBER HALL!!/.test(r),r);
assert(/Bo, the Loud|Bo - /.test(r)&&/Ana is released/.test(r),'speaker is a bystander and facts kept: '+r);
assert(!/Ana\|/.test(r.split('|')[0]),'speaker is not the subject');
assert(/NEVER FORGETS/.test(card('x','revenge')));
assert(/BOUNTY/.test(card('A bounty goes up on Ana','drama')));
assert(/IS GONE/.test(card('Ana died in the dark','death')));
assert(/IT IS ABOUT ANA/.test(card('Something unclassifiable about Ana','drama')));
assert.equal(card('x','drama',5),card('x','drama',5),'stable per card id');
ctx.S.agents=[{id:1,name:'Ana',alive:true}];
assert(/^\[T\|/.test(card('Ana is released','major')),'no bystander: original card unchanged');
ctx.S.agents=[{id:1,name:'Ana',alive:true},{id:2,name:'Bo',alive:true}];
assert(/FAVOURITE/.test(card('Public standing changed from 0 to 18.','reputation')));
assert(/NAME OUT LOUD/.test(card('Public standing changed from 14 to 0.','reputation')));
ctx.S.agents=[{id:1,name:'Ana',alive:true},{id:2,name:'Bo',alive:true}];
assert(/NUMBERS ARE IN/.test(vm.runInContext('dispatchCard({id:2,kind:"drama",body:"Among people Brutus hasnt dealt with: 11 died",actors:[]})',ctx)));
console.log('voice-world: all pass');
