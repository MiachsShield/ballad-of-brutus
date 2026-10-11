// Tests no-elements-world.js and no-elements-dungeon.js against the REAL loot code from the baseline.
// Run: node work/claude/no-elements/no-elements.test.cjs
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const base=fs.readFileSync(path.join(__dirname,'../../../builds/brutus-1_0_a0mk-kavi-balanced2.html'),'utf8').split('\n');
const start=base.findIndex(l=>l.startsWith('const ITEM_SLOTS')),end=base.findIndex(l=>l.includes('// ---- equip/unequip'));
const lootSrc=base.slice(start,end).join('\n').replace(/\\`/g,'`').replace(/\\\$\{/g,'${');
const ctx={Math,Object,Array,JSON,String};vm.createContext(ctx);
vm.runInContext(`function pick(a){return a[Math.floor(Math.random()*a.length)];}function rnd(a,b){return a+Math.random()*(b-a);}
function derivedLoadout(){return {stats:{},procs:[],cards:[],setElements:['Fire','Shadow']};}`,ctx);
vm.runInContext(lootSrc,ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'no-elements-world.js'),'utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
const items=JSON.parse(run(`JSON.stringify(Array.from({length:3000},(_,i)=>generateItem(['rare','enchanted','legendary'][i%3],20+(i%80))))`));
const elemWords=/\b(Flame|Storm|Rime|Venom|Sun|Shade|fire|flame|lightning|frost|venom|radiant|holy|shadow)\b/i;
let procs=0,cards=0;
for(const it of items){
 assert.equal(it.element,undefined,'element tag left on '+it.name);
 assert.equal(it.name,it.baseName,'name not plain: '+it.name);
 if(it.proc){procs++;assert(it.proc.element,'proc lost its internal key');if(it.proc.kind==='offense')assert(!elemWords.test(it.proc.desc),it.proc.desc);}
 if(it.grantedCard)cards++;
}
assert(procs>500&&cards>300,'effects and cards still roll: procs '+procs+' cards '+cards);
assert.deepEqual(JSON.parse(run('JSON.stringify(derivedLoadout().setElements)')),[]);
// dungeon log line
const d={};vm.createContext(d);vm.runInContext(`let logs=[];function logMsg(m,c){logs.push(m);}`,d);
vm.runInContext(fs.readFileSync(path.join(__dirname,'no-elements-dungeon.js'),'utf8'),d);
vm.runInContext(`logMsg('Steel Mace triggers — fire damage for 8 (+4 to Brutus).','res');logMsg('Brute goes down.')`,d);
assert.deepEqual(JSON.parse(vm.runInContext('JSON.stringify(logs)',d)),['Steel Mace triggers for 8 (+4 to Brutus).','Brute goes down.']);
console.log('PASS: 3000 generated items: no element tags, plain base names, offense effects described without element words, effects and cards still roll; element set bonuses off; dungeon proc line neutral.');
