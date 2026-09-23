// Adapter contract test with small doubles. The browser playtest (DONE.md) is
// the real-engine check; this pins the three rules so they can't regress silently.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={Math,JSON,Set,Map,console};vm.createContext(ctx);
vm.runInContext(`
let S={turn:5,castReady:true,dispatches:[],agents:[{id:1,name:'Brankar'},{id:2,name:'Keskar'}],auctions:[],guilds:{},roster:[],gold:100,actions:1};
let captured=0,rendered=0,booked=0;
function note(actors,title,body,effect,kind='drama'){S.dispatches.unshift({turn:S.turn,actors:actors.map(a=>({id:a.id,name:a.name})),title,body,effect,kind});}
function captureDispatch(text,cls){captured++;const actors=S.agents.filter(a=>text.includes(a.name));if(actors.length)note(actors,'Word gets around',text,'','major');}
function appearanceId(a){return a.id}
function auctionTick(){}
function render(){rendered++}
function bookAppearance(){booked++}
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
console.log('PASS: one departure card per exit (both orders), no double full stop, one live lot per identity, sold lots kept, no silent booking failure.');
