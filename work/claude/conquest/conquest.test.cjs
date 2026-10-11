// Sandbox tests for conquest-world.js and conquest-dungeon.js. Run: node work/claude/conquest/conquest.test.cjs
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const read=n=>fs.readFileSync(__dirname+'/'+n,'utf8');
// ---- world ----
const w={Math,JSON,Object,Array,String};vm.createContext(w);
vm.runInContext(`
let S,notes=[],charged=0,lastBase=null,ended=false;
function playerUpkeepTick(){charged++;S.gold-=1000;S.playerPayroll={bill:1000};S.playerMissedPayroll=true;}
function campaignEnded(){return ended;} function note(...a){notes.push(a);} function render(){} function saveLiving(){}
function dungeonCard(d){return '<article><footer><b>'+d.reward+'</b><button data-action="dungeon">Take contract</button></footer></article>';}
function handleLiving(e){lastBase='base';}
function confirmDelve(){lastBase='confirmed';}
function applyDungeonResult(r){const d=S.dungeons.find(x=>x.id===S.activeContract.id);if(r.won)d.closed=true;S.pendingDelve=false;S.activeContract=null;S.expeditionReport={body:'Back.'};}
`,w);
vm.runInContext(read('conquest-world.js'),w);
const run=s=>vm.runInContext(s,w);
run(`S={turn:4,gold:5000,playerMissedPayroll:true,dungeons:[{id:1,name:'Crown',reward:26000,closed:false,expires:6}],pendingDelve:false,activeContract:null}`);
run('playerUpkeepTick()');assert.equal(run('charged'),0);assert.equal(run('S.gold'),5000);assert.equal(run('S.playerMissedPayroll'),false);
// only the warden: not conquered; a won contract still closes as before
run('S.pendingDelve=true;S.activeContract={id:1};applyDungeonResult({won:true,wardenSlain:true})');
assert.equal(run('S.dungeons[0].closed'),true);assert.equal(run('cqInert(S.dungeons[0])'),false);
// warden + chest: conquered, stays on board, inert through turn 7, expiry moved past it
run('S.dungeons[0].closed=false;S.pendingDelve=true;S.activeContract={id:1};applyDungeonResult({won:true,wardenSlain:true,bossChestLooted:true})');
assert.equal(run('S.dungeons[0].closed'),false);assert.equal(run('S.dungeons[0].inertUntil'),7);assert.equal(run('S.dungeons[0].expires'),11);
assert.equal(run('cqInert(S.dungeons[0])'),true);assert(/locked out until turn 8/.test(run('S.expeditionReport.body')));
assert(/Locked out/.test(run('dungeonCard(S.dungeons[0])'))&&!/Take contract/.test(run('dungeonCard(S.dungeons[0])')));
for(const act of ['dungeon','boast','gc-access','gc-both']){run(`lastBase=null;handleLiving({target:{closest:()=>({dataset:{action:'${act}',id:'1'},disabled:false})}})`);assert.equal(run('lastBase'),null,act);}
run('lastBase=null;S.activeContract={id:1};confirmDelve()');assert.equal(run('lastBase'),null);assert.equal(run('S.activeContract'),null);
// refused while inert; reopens after
run('S.turn=7');assert.equal(run('cqInert(S.dungeons[0])'),true);
run('S.turn=8');assert.equal(run('cqInert(S.dungeons[0])'),false);assert(/Take contract/.test(run('dungeonCard(S.dungeons[0])')));
run(`lastBase=null;handleLiving({target:{closest:()=>({dataset:{action:'dungeon',id:'1'},disabled:false})}})`);assert.equal(run('lastBase'),'base');
// failed init and campaign end change nothing
run('S.dungeons[0].inertUntil=0;S.pendingDelve=true;S.activeContract={id:1};applyDungeonResult({initializationFailed:true,wardenSlain:true,bossChestLooted:true})');
assert.equal(run('cqInert(S.dungeons[0])'),false);
// ---- dungeon ----
const d={Math};vm.createContext(d);
vm.runInContext(`
let trainingMode=false,sectors,chests,enemies,brutus,runStats,logs=[];const CHEST_RANGE=1.8;
function buildLevel(){sectors=[{id:0,kind:'room',rect:{x0:0,z0:0,x1:10,z1:10},centroid:{x:5,z:5}},{id:9,kind:'boss',rect:{x0:20,z0:0,x1:30,z1:10},centroid:{x:25,z:5}}];chests=[{x:5,z:5,sectorId:0,opened:false}];enemies=[{kind:'boss',side:'enemy',downed:false}];}
function nearestChest(){return null;}
function chestPressed(){const c=nearestChest();if(!c)return;c.opened=true;}
function onDowned(c){c.downed=true;}
function logMsg(m){logs.push(m);}
`,d);
vm.runInContext(read('conquest-dungeon.js'),d);
const dr=s=>vm.runInContext(s,d);
dr('runStats={};buildLevel();brutus={x:27.6,z:5}');
assert.equal(dr('chests.filter(c=>c.boss).length'),1);assert.equal(dr('chests.find(c=>c.boss).sectorId'),9);
assert.equal(dr('nearestChest()'),undefined);                  // guarded while the warden lives
dr('chestPressed()');assert.equal(dr('!!runStats.bossChestLooted'),false);
dr('onDowned(enemies[0])');assert.equal(dr('runStats.wardenSlain'),true);
assert.equal(dr('nearestChest().boss'),true);dr('chestPressed()');assert.equal(dr('runStats.bossChestLooted'),true);
dr('trainingMode=true;buildLevel()');assert.equal(dr('chests.some(c=>c.boss)'),false);
console.log('PASS: upkeep paused (no charge, no missed payroll); warden alone does not conquer; warden + chest makes the dungeon inert for 3 turns on the board; card, take, access, deploy all blocked while inert; reopens after; refunds ignored; boss chest placed in the warden room, guarded until the warden falls, flags reported; none in training.');
