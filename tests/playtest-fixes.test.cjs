// node tests/playtest-fixes.test.cjs
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const src=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
// world: deck rides on Brutus's loadout only, defaults to Warrior, follows S.deckChoice
{const ctx={S:{},derivedLoadout:who=>({cards:[],who}),render:()=>{},$:()=>null,document:{}};vm.createContext(ctx);
 vm.runInContext(src('../src/world/items/deck-choice.js'),ctx);
 assert.equal(ctx.derivedLoadout().deck,'Warrior');
 ctx.S.deckChoice='Priest';assert.equal(ctx.derivedLoadout().deck,'Priest');assert.equal(ctx.derivedLoadout('brutus').deck,'Priest');
 assert.equal(ctx.derivedLoadout('m7').deck,undefined);
 ctx.S.deckChoice='Bard';assert.equal(ctx.derivedLoadout().deck,'Warrior');}
// dungeon: a sent deck is chosen and the prompt skipped; no deck → prompt stays; training untouched
function dungeon(){const c={trainingMode:false,cardSelectionPending:false,chosen:null,logs:[],
 applyEquipmentLoadout:()=>{},start:()=>{c.cardSelectionPending=true;},logMsg:m=>c.logs.push(m),
 chooseCardDiscipline:n=>{if(!c.cardSelectionPending)return false;c.chosen=n;c.cardSelectionPending=false;return true;}};
 vm.createContext(c);vm.runInContext(src('../src/dungeon/deck/deck-choice.js'),c);return c;}
{const c=dungeon();c.applyEquipmentLoadout({deck:'Priest'});c.start();assert.equal(c.chosen,'Priest');assert.equal(c.cardSelectionPending,false);}
{const c=dungeon();c.applyEquipmentLoadout({cards:[]});c.start();assert.equal(c.chosen,null);assert.equal(c.cardSelectionPending,true);}
{const c=dungeon();c.applyEquipmentLoadout(null);c.start();assert.equal(c.cardSelectionPending,true);}
{const c=dungeon();c.applyEquipmentLoadout({deck:'Warrior'});c.trainingMode=true;c.start();assert.equal(c.chosen,null);}
// spine: adjacency lists always lead with entrance→rest→stair; other arrays untouched
{const c={shuffle:a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;},drawMinimap:()=>{}};
 vm.createContext(c);vm.runInContext(src('../src/dungeon/run/straight-route.js'),c);
 for(let n=0;n<500;n++){const adj=[];for(let r=0;r<3;r++)for(let col=0;col<3;col++){const i=r*3+col;if(col<2)adj.push([i,i+1,'E']);if(r<2)adj.push([i,i+3,'S']);}
  c.shuffle(adj);assert.deepEqual(adj.slice(0,2).map(e=>e.slice(0,2)).sort(),[[3,4],[4,5]]);assert.equal(adj.length,12);}
 const plain=[1,2,3,4,5];c.shuffle(plain);assert.deepEqual([...plain].sort(),[1,2,3,4,5]);}
console.log('PASS: deck sent on Brutus\'s loadout only (Warrior default, last pick kept); dungeon uses it and skips its prompt, keeps the prompt without one, training untouched; every floor\'s spanning tree starts with entrance→rest→stair (500 floors), other shuffles untouched.');
