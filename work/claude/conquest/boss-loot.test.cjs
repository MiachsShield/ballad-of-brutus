// Tests boss-loot-world.js against the game's REAL loot code (lines extracted from the pinned
// baseline: ITEM_SLOTS .. generateItem). Run: node work/claude/conquest/boss-loot.test.cjs
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const base=fs.readFileSync(path.join(__dirname,'../../../builds/brutus-1_0_a0mk-kavi-balanced2.html'),'utf8').split('\n');
const start=base.findIndex(l=>l.startsWith('const ITEM_SLOTS')),end=base.findIndex(l=>l.includes('// ---- equip/unequip'));
assert(start>0&&end>start,'loot block not found');
const lootSrc=base.slice(start,end).join('\n').replace(/\\`/g,'`').replace(/\\\$\{/g,'${');
const ctx={Math,Object,Array,JSON,String,console};vm.createContext(ctx);
vm.runInContext(`function pick(a){return a[Math.floor(Math.random()*a.length)];}function rnd(a,b){return a+Math.random()*(b-a);}`,ctx);
vm.runInContext(lootSrc,ctx);
vm.runInContext(`let S={inventory:[]},notes=[],ended=false;function campaignEnded(){return ended;}function note(...a){notes.push(a);}
function render(){}function saveLiving(){}function applyDungeonResult(r){S.pendingDelve=false;S.activeContract=null;S.expeditionReport={body:'Back.'};}
function derivedLoadout(){return {setElements:['Fire']};}`,ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../no-elements/no-elements-world.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'boss-loot-world.js'),'utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
const T=['common','fine','rare','enchanted','legendary'];
// 1. A cut above, at every level 1..99: boss rarity never below the level's usual generic rarity,
//    and the boss distribution sits strictly above the generic one.
for(let lvl=1;lvl<=99;lvl++){
 const res=JSON.parse(run(`(()=>{const g=[],b=[];for(let i=0;i<400;i++){g.push(rollItemRarity(${lvl}));b.push(blBossRarity(${lvl}));}return JSON.stringify({g,b,mode:blBandMode(${lvl})});})()`));
 const mi=T.indexOf(res.mode),gm=res.g.reduce((s,r)=>s+T.indexOf(r),0)/400,bm=res.b.reduce((s,r)=>s+T.indexOf(r),0)/400;
 assert(res.b.every(r=>T.indexOf(r)>=mi),`lvl ${lvl}: boss below usual generic rarity ${res.mode}`);
 if(res.mode!=='legendary')assert(bm>gm,`lvl ${lvl}: boss mean ${bm} not above generic ${gm}`);
}
// 2. Stats beat the same slot/level/rarity; no elements; named after the dungeon's set.
for(const lvl of [5,20,40,55,70,85,99])for(let i=0;i<60;i++){
 const o=JSON.parse(run(`(()=>{const b=blBossDrop(${lvl},'The Ashen Stair');const g=generateItem(b.rarity,${lvl},b.slot);return JSON.stringify({b,g});})()`));
 for(const [k,v] of Object.entries(o.g.stats))if(v>0)assert(o.b.stats[k]>v,`lvl ${lvl} ${o.b.slot} ${k}: ${o.b.stats[k]} !> ${v}`);
 assert.equal(o.b.element,undefined);assert(o.b.name.startsWith('Ashen '));assert.equal(o.b.bossSet,'Ashen');assert.equal(o.b.bossDrop,'The Ashen Stair');
 assert(!/Flame|Storm|Rime|Venom|Sun |Shade/.test(o.b.name),o.b.name);
}
// 3. Set names per dungeon; unknown names fall back to their first word.
assert.equal(run("blSetName('The Hollow Crown')"),'Crowned');assert.equal(run("blSetName('The Glass Pit')"),'Glass');
// 4. Drops: a random 1-5 per clear, plus one on the first clear.
run("S.inventory=[];S.bossLoot=null");
const counts=new Set();
let o=JSON.parse(run("JSON.stringify(blRoll('The Hollow Crown',{deepestFloor:2}))"));
assert(o.first);assert.equal(o.items.filter(i=>!i.signature).length,o.rolled+1);assert.equal(o.items.filter(i=>i.firstClear).length,1);
for(let i=0;i<200;i++){o=JSON.parse(run("JSON.stringify(blRoll('The Hollow Crown',{deepestFloor:2}))"));assert(!o.first);
 const n=o.items.filter(i=>!i.signature).length;assert(n>=1&&n<=5,'drops '+n);assert.equal(n,o.rolled);counts.add(n);}
assert.deepEqual([...counts].sort(),[1,2,3,4,5]);
// 5. Signature: pity guarantees it; one tier up from the first drop; named; once only; no element.
run("S.bossLoot={clears:{'The Sunken Tribunal':5},misses:{'The Sunken Tribunal':9},owned:{}}");
assert.equal(run("blSigChance('The Sunken Tribunal')"),1);
o=JSON.parse(run("JSON.stringify(blRoll('The Sunken Tribunal',{deepestFloor:2,brutesBroken:1}))"));
assert(o.sig&&o.sig.name==='Gavel of the Drowned Court'&&o.sig.slot==='Weapon'&&o.sig.grantedCard&&o.sig.element===undefined);
assert.equal(T.indexOf(o.sig.rarity),Math.min(4,T.indexOf(o.items[0].rarity)+1));
for(let i=0;i<30;i++)assert.equal(JSON.parse(run("JSON.stringify(blRoll('The Sunken Tribunal',{deepestFloor:2}))")).sig,null);
run("S.bossLoot={clears:{},misses:{},owned:{}}");const keep=run("Math.random");
run("Math.random=()=>0.999");run("blRoll('The Quiet House',{deepestFloor:2});blRoll('The Quiet House',{deepestFloor:2})");
assert.equal(run("S.bossLoot.misses['The Quiet House']"),2);assert(Math.abs(run("blSigChance('The Quiet House')")-0.35)<1e-9);
// 6. Wiring: only with the chest looted; items land in the inventory; note and report line.
run("Math.random=(()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647;})()");
run("S={inventory:[],pendingDelve:true,activeContract:{name:'The Thorn Cathedral'}};notes=[];applyDungeonResult({deepestFloor:2,wardenSlain:true})");
assert.equal(run('S.inventory.length'),0);
run("S.pendingDelve=true;S.activeContract={name:'The Thorn Cathedral'};applyDungeonResult({deepestFloor:2,wardenSlain:true,bossChestLooted:true})");
assert(run('S.inventory.length')>=2);assert(run("S.inventory.every(i=>i.bossSet==='Thorn'&&!i.element)"));
assert(/Boss loot:/.test(run('S.expeditionReport.body')));assert(/Boss loot: The Thorn Cathedral/.test(run('notes[0][1]')));
run("S.pendingDelve=true;S.activeContract={name:'The Thorn Cathedral'};S.inventory=[];applyDungeonResult({initializationFailed:true,bossChestLooted:true})");
assert.equal(run('S.inventory.length'),0);
console.log('PASS: boss rarity never below the usual generic rarity and above generic on average at every level 1-99; boss stats beat same slot/level/rarity generic; no elements, named by dungeon set; 1-5 drops (all counts seen) plus a first-clear extra; signature pity (15% +10%/miss, guaranteed, once only, one tier up, named); granted only with the chest looted; refunds grant nothing.');
