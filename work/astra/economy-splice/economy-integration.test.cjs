// Adapter contract test with small doubles. The browser playtest (DONE.md) is
// the real-engine check; this pins the three rules so they can't regress silently.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={Math,JSON,Set,Map,console};vm.createContext(ctx);
vm.runInContext(`
let S={turn:5,castReady:true,dispatches:[],agents:[{id:1,name:'Brankar'},{id:2,name:'Keskar'}],auctions:[],guilds:{},roster:[],gold:100,actions:1};
let captured=0,rendered=0,booked=0;
function note(actors,title,body,effect,kind='drama'){S.dispatchSeq=(S.dispatchSeq||0)+1;S.dispatches.unshift({id:S.dispatchSeq,turn:S.turn,actors:actors.map(a=>({id:a.id,name:a.name})),title,body,effect,kind});}
function captureDispatch(text,cls){captured++;const actors=S.agents.filter(a=>text.includes(a.name));if(actors.length)note(actors,'Word gets around',text,'','major');}
function appearanceId(a){return a.id}
function auctionTick(){}
function render(){rendered++}
function bookAppearance(){booked++}
function visit(){} function gift(){} function startInterview(){} function bidOnLot(){}
let turnEvents=()=>{};function endTurn(){S.turn++;turnEvents();}
function logMsg(t,c){captureDispatch(t,c)}
function fmtGold(n){return n+' g'} function marketability(){return 1} function celebTierIdx(){return 1}
const COLLAB_FEE_PER_MKT=1;
const document={getElementById:()=>null,querySelectorAll:()=>[]};
`,ctx);
vm.runInContext(fs.readFileSync(__dirname+'/economy-integration.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
// departure first, flavour second (missed-payroll desertion order)
run("note([S.agents[0]],'Brankar leaves Bright Harbor Co..',\"wasn't paid, and left\",'Available to recruit','departure');captureDispatch('Brankar walks out on Bright Harbor Co.. Nobody stopped him.','warn')");
assert.equal(run('S.dispatches.length'),1);
assert.equal(run('S.dispatches[0].title'),'Brankar leaves Bright Harbor Co.');
assert.match(run('S.dispatches[0].body'),/walks out/);
// flavour first, departure second (affection quit order)
run("captureDispatch('Keskar walks out on Stonewatch Company. Guilds fail people too.','warn');note([S.agents[1]],'Keskar leaves Stonewatch Company.',\"couldn't hold onto them\",'Available to recruit','departure')");
assert.equal(run('S.dispatches.length'),2);
assert.equal(run('S.dispatches[0].kind'),'departure');
assert.equal(run('S.dispatches[0].title'),'Keskar leaves Stonewatch Company.');
// unrelated news still becomes its own card
run("captureDispatch('Brankar and Keskar appear together.','news')");assert.equal(run('S.dispatches.length'),3);
// a departure on a later turn is a new event
run("S.turn=6;note([S.agents[0]],'Brankar leaves Ninefold Compact.','x','y','departure')");assert.equal(run('S.dispatches.length'),4);
// auctions: one identity = one live lot; earliest listing stands; empty sales go
run(`S.auctions=[{id:9,guildName:'B',turn:6,lots:[{kind:'person',agentId:7,name:'Ruemira',price:106},{kind:'item',item:{id:3},name:'Helm',price:5}]},
  {id:8,guildName:'B',turn:5,lots:[{kind:'person',agentId:7,name:'Ruemira',price:100}]},
  {id:10,guildName:'A',turn:6,lots:[{kind:'item',item:{id:3},name:'Helm',price:6}]}];auctionTick()`);
assert.deepEqual(run('JSON.parse(JSON.stringify(S.auctions.map(a=>[a.id,a.lots.map(l=>l.price)])))'),[[8,[100]],[9,[5]]]);
// sold lots are history, never dropped
run(`S.auctions=[{id:1,guildName:'A',turn:5,lots:[{kind:'person',agentId:4,name:'X',price:1,sold:true},{kind:'person',agentId:5,name:'Y',price:1}]}];auctionTick()`);
assert.equal(run('S.auctions[0].lots.length'),2);
// booking: slandered names get a message, not a silent no-op
run("S.roster=[{id:50,name:'Ember',alive:true}];S.agents.push({id:60,name:'Calsha',alive:true,slanderedUntil:9});captured=0;bookAppearance(50,60)");
assert.equal(run('booked'),0);assert.equal(run('captured'),1);
run("S.agents[2].slanderedUntil=0;bookAppearance(50,60)");assert.equal(run('booked'),1);
// deaths: flavour first, then the structural card; the killer joins the card
run("S.turn=7;S.agents.push({id:3,name:'Tala'},{id:4,name:'Orso'});const n0=S.dispatches.length;captureDispatch('Orso killed Tala over a feud that never cooled off.','bad');note([S.agents.find(a=>a.id===3)],'Tala has died.','Death recorded.','Deceased','death');globalThis.dn=S.dispatches.length-n0");
assert.equal(run('dn'),1);assert.equal(run("S.dispatches[0].kind"),'death');assert.equal(run("S.dispatches[0].actors.length"),2);
// reputation hit after a departure folds into the departure card
run("note([S.agents[1]],'Keskar leaves Iron Oath.','x','Available to recruit','departure');const n1=S.dispatches.length;note([S.agents[1]],\"Keskar's reputation shifts.\",'Public standing changed from 0 to -18.','Major reputation change','reputation');globalThis.rn=S.dispatches.length-n1");
assert.equal(run('rn'),0);assert.match(run('S.dispatches[0].effect'),/standing 0 → -18/);
// a guild "poaching" its own member moved nobody: no card
run("globalThis.pn=S.dispatches.length;note([S.agents[1]],'Keskar is poached.','Jade Accord pulls the contract away from Jade Accord.','Guild changed','major');captureDispatch('Jade Accord pulls Keskar away from Jade Accord.','')");
assert.equal(run('S.dispatches.length-pn'),0);
// pacing: strangers' cards leave the Chronicle and become one Elsewhere card; known people stay
run(`S.agents.push({id:20,name:'Vesk'},{id:21,name:'Lira',castKey:'Lira'},{id:22,name:'Pell'});S.roster=[];
 turnEvents=()=>{note([S.agents.find(a=>a.id===20)],'Vesk leaves Tankard & Blade.','x','y','departure');note([S.agents.find(a=>a.id===22)],'Pell has died.','x','y','death');note([S.agents.find(a=>a.id===21)],'Lira leaves Iron Oath.','x','y','departure');};endTurn()`);
const shown=run("JSON.stringify(S.dispatches.filter(x=>x.turn===S.turn&&x.kind!=='routine').map(x=>x.title))");
assert.deepEqual(JSON.parse(shown).sort(),['Elsewhere on the Continent','Lira leaves Iron Oath.']);
assert.match(run("S.dispatches.find(x=>x.title==='Elsewhere on the Continent').body"),/1 walked out, 1 died/);
// once Brutus has dealt with someone, their story stays in full
run(`S.e1Met=[20];turnEvents=()=>note([S.agents.find(a=>a.id===20)],'Vesk leaves Red Hand.','x','y','departure');endTurn()`);
assert.equal(run("S.dispatches.filter(x=>x.turn===S.turn&&x.kind!=='routine').length"),1);
console.log('PASS: one card per death/poach/departure incl. reputation, self-poach dropped, strangers folded into Elsewhere, known people kept, one departure card per exit (both orders), no double full stop, one live lot per identity, sold lots kept, no silent booking failure.');
