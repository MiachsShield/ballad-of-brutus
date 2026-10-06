const fs=require('fs'),vm=require('vm'),assert=require('assert');
const OW=require(process.env.BOB_OW_MODULE||'../../claude/overworld-2026-09-18/adventurers.js');
const BOBOWBridge=require('./ow-bridge.js');
const read=n=>fs.readFileSync(__dirname+'/'+n,'utf8');
const ctx={OW,BOBOWBridge,window:{},Math,Set};vm.createContext(ctx);
vm.runInContext(`let S={turn:1,runId:'test',pendingDelve:false}, blocked=false, saved=null,notes=[];
function saveLiving(){saved=JSON.stringify(S);}
function endTurn(){if(!blocked&&!S.pendingDelve){S.turn++;saveLiving();}}
function campaignEnded(){return false;}function render(){}function note(...a){notes.push(a);}`,ctx);
vm.runInContext(read('world-integration.js'),ctx);
const run=s=>vm.runInContext(s,ctx);
run('saveLiving()');assert.equal(run('ensureOW().snapshot().wave'),0);
run('endTurn()');assert.equal(run('ensureOW().snapshot().wave'),1);
run('blocked=true;endTurn()');assert.equal(run('ensureOW().snapshot().wave'),1);
run('blocked=false;S.pendingDelve=true;endTurn()');assert.equal(run('ensureOW().snapshot().wave'),1);
for(const [i,verb] of ['aid','ignore','exploit','obstruct'].entries()){
 ctx.m={key:'1:'+i};const first=run('window.BOBOWWorld.request(m)');assert(first.party);
 const rows=run('ensureOW().snapshot().ledger.length');run('window.BOBOWWorld.request(m)');assert.equal(run('ensureOW().snapshot().ledger.length'),rows);
 ctx.m.verb=verb;const chosen=run('window.BOBOWWorld.request(m)');assert(chosen.done);
 assert.equal(chosen.result.verb,verb);const n=run('ensureOW().operations.length');run('window.BOBOWWorld.request(m)');assert.equal(run('ensureOW().operations.length'),n);
}
run('S.pendingDelve=false;saveLiving()');const snapshot=run('JSON.stringify(ensureOW().snapshot())');
run('S=JSON.parse(saved)');assert.equal(run('JSON.stringify(ensureOW().snapshot())'),snapshot);
run("S={turn:1,runId:'new'};saveLiving()");assert.equal(run('ensureOW().snapshot().wave'),0);
assert.equal(run('ensureOW().operations.length'),0);
// Compile the exact generated shell and both embedded frame scripts.
const candidate=fs.readFileSync(process.argv[2]||__dirname+'/candidate.html','utf8');
const outer=candidate.slice(candidate.indexOf('<script>')+8,candidate.lastIndexOf('</script>'));
new vm.Script(outer);const end=outer.indexOf("const world=document.getElementById('world')");
const frames={};vm.runInNewContext(outer.slice(0,end)+';this.w=WORLD_HTML;this.d=DUNGEON_HTML;',frames);
for(const html of [frames.w,frames.d])for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(match[1]);
// Dungeon UI contract with a tiny DOM test double; not a visual playtest.
class Element{constructor(){this.children=[];this.style={};this.dataset={};}setAttribute(){}append(...c){this.children.push(...c);}replaceChildren(){this.children=[];}focus(){}}
const events=[],d={document:{createElement:()=>new Element(),body:new Element(),addEventListener(){}},window:{parent:{}},held:new Set(),sfx:{setPaused(){}},clearInput(){},logMsg(){}};
d.window.addEventListener=(type,f)=>events.push(f);d.window.parent.BOBOWRequest=()=>({party:{name:'Test party',goal:'Rescue a friend'}});
vm.createContext(d);vm.runInContext(`let dungeonInitialized=true,campaignDead=false,brutus={downed:false,sectorId:1},cardSelectionPending=false,encounter={active:false},enemies=[],dungeonPaused=false;
function sectorById(){return {kind:'room'};}function dist(){return 2;}function updatePlaceTag(){}function start(){}`,d);
vm.runInContext(read('dungeon-integration.js'),d);const dr=s=>vm.runInContext(s,d);
dr('owRefresh();owTalk.onclick()');assert.equal(dr('owOpen&&dungeonPaused'),true);assert.equal(dr('owDialog.children.filter(b=>b.dataset.owVerb).length'),4);
dr('dungeonPaused=false');for(const f of events)f({source:d.window.parent,data:{type:'pauseDungeon',paused:false}});assert.equal(dr('dungeonPaused'),true);
dr('owClose()');assert.equal(dr('dungeonPaused'),false);
dr('encounter.active=true;owRefresh()');assert.equal(dr('owTalk.hidden'),true);
console.log('PASS: world tick/gates, four verbs, close without effect, duplicates, save/load, New Run, exact-build syntax, dungeon pause/Talk gating.');
