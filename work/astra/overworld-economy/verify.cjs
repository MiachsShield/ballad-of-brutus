const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const {world,worldSha256}=require('./source.cjs')();
const html=fs.readFileSync(__dirname+'/brutus-pr34-overworld-economy.html','utf8');
assert(!html.includes('const DUNGEON_HTML='));assert(html.includes('id="delveBtn" disabled'));
const scripts=h=>[...h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
const original=scripts(world),delivered=scripts(html);assert.equal(original.length,2);assert.equal(delivered[0],original[0]);
const displayGuard="const economyRender=render;render=function(){economyRender();$('delveBtn').disabled=true;};\n";
assert.equal(delivered[1].replace(displayGuard,''),original[1],'Only dungeon button display guard may differ from PR34 world script');delivered.forEach(x=>new vm.Script(x));
assert.equal(crypto.createHash('sha256').update(world).digest('hex'),worldSha256);
const mock=()=>({style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},appendChild(){},remove(){},querySelectorAll(){return []},setAttribute(){},dataset:{},innerHTML:'',textContent:''});
let result=[];
for(let seed0=1;seed0<=10;seed0++){
 const els=new Map(),doc={body:mock(),createElement:mock,getElementById:id=>{if(!els.has(id))els.set(id,mock());return els.get(id)},querySelector:()=>mock(),querySelectorAll:()=>[],addEventListener(){}};
 let storage={},seed=seed0;const math=Object.create(Math);math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const win={document:doc,addEventListener(){},removeEventListener(){},parent:{postMessage(){}},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},crypto:{getRandomValues(a){a[0]=seed++;return a},randomUUID(){return 'test'}},requestAnimationFrame(){},setTimeout,clearTimeout,performance:{now:()=>0}};
 const ctx={window:win,document:doc,localStorage:win.localStorage,crypto:win.crypto,Math:math,console,setTimeout,clearTimeout,requestAnimationFrame:()=>0,performance:win.performance,Image:function(){},Audio:function(){},navigator:{},URL,Uint32Array,structuredClone,TextEncoder,TextDecoder};vm.createContext(ctx);vm.runInContext(delivered[0],ctx);
 const anchor='if(!initialSave||!loadLiving(initialSave))newRun();initialSave=null;';assert.equal(delivered[1].split(anchor).length,2);
 // Only display is suppressed in this harness. All actual world economy phases run.
 const instrument=`render=()=>{};window.__test={state:()=>S,end:()=>endTurn(),value:a=>valueOf(a),scarcity:c=>scarcityMult(c),supply:c=>supplyOf(c),save:()=>saveLiving(),load:x=>loadLiving(x)};${anchor}`;
 vm.runInContext(delivered[1].replace(anchor,instrument),ctx,{timeout:30000});
 const T=win.__test,initial=T.state(),initialId=new Map(initial.agents.map(a=>[a.id,a.affiliation])),prices=[],supply=[],trends=[],treasury=[],free=[],population=[],telegraphs=[];let auctionLots=0,missedGuildPayroll=0,playerMissedPayroll=0;
 for(let t=0;t<24;t++){
   const s=T.state();prices.push(s.agents.filter(a=>a.alive&&!a.affiliation).slice(0,3).map(a=>T.value(a)));supply.push(T.supply(s.event.wants));trends.push(s.event.wants);treasury.push(s.gold);free.push(s.agents.filter(a=>a.alive&&!a.affiliation).length);population.push(s.agents.filter(a=>a.alive).length);telegraphs.push(s.telegraphs.length);
   assert.equal(s.pendingDelve||false,false,'This harness never delves');
   T.end();assert.equal(T.state().turn,t+2,'Each End Turn should advance once');
   auctionLots+=(T.state().auctions||[]).reduce((n,a)=>n+a.lots.length,0);
   missedGuildPayroll+=Object.values(T.state().guilds).filter(g=>g.missedPayroll).length;
   playerMissedPayroll+=!!T.state().playerMissedPayroll;
 }
 const s=T.state(),initialSurvivors=s.agents.filter(a=>initialId.has(a.id)&&a.alive);
 const movedAlive=initialSurvivors.filter(a=>initialId.get(a.id)!==a.affiliation).length;
 const originalDeaths=initialId.size-initialSurvivors.length;
 assert(s.gold>=0,'Player treasury should not go negative');assert(s.agents.some(a=>a.name==='Ember'));assert(s.agents.some(a=>a.name==='Wren'));
 assert(s.guilds&&Object.values(s.guilds).length>10);
 result.push({seed:seed0,movedAlive,originalDeaths,telegraphed:telegraphs.reduce((a,b)=>a+b,0),auctionLots,missedGuildPayroll,playerMissedPayroll,startGold:treasury[0],endGold:s.gold,freeStart:free[0],freeEnd:free.at(-1),populationStart:population[0],populationEnd:population.at(-1),demandChanges:trends.slice(1).filter((x,i)=>x!==trends[i]).length,scarcitySpots:supply.filter(x=>x<=2).length,priceMin:Math.min(...prices.flat()),priceMax:Math.max(...prices.flat())});
 if(seed0===7){const saved=T.save();assert(T.load(saved));assert.equal(T.state().turn,25)}
}
const total=k=>result.reduce((sum,x)=>sum+x[k],0);assert(total('movedAlive')>0);assert(total('telegraphed')>0);assert(total('demandChanges')>0);assert(total('scarcitySpots')>0);
console.log(JSON.stringify({sourceWorldSha256:worldSha256,summary:{seeds:10,turns:240,survivingOriginalsWithNewAffiliation:total('movedAlive'),originalDeaths:total('originalDeaths'),telegraphExposure:total('telegraphed'),auctionLotsOfferedAcrossTurns:total('auctionLots'),missedGuildPayrollSpots:total('missedGuildPayroll'),playerMissedPayrollTurns:total('playerMissedPayroll'),demandChanges:total('demandChanges'),scarcityTurnSpots:total('scarcitySpots'),averageFinalGold:Math.round(total('endGold')/10)},seed7:result[6]},null,2));
