// Sandbox tests for conquest-world.js and conquest-dungeon.js. Run: node work/claude/conquest/conquest.test.cjs
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const read=n=>fs.readFileSync(__dirname+'/'+n,'utf8');
// ---- world ----
const w={Math,JSON,Object,Array,String};vm.createContext(w);
vm.runInContext(`
let S,notes=[],charged=0,lastBase=null,ended=false;
function playerUpkeepTick(){charged++;S.gold-=1000;S.playerPayroll={bill:1000};S.playerMissedPayroll=true;}
function campaignEnded(){return ended;} function note(...a){notes.push(a);} function render(){} function saveLiving(){}
function dungeonCard(d){return '<article><div class="objective">o</div><footer><b>'+d.reward+'</b><button data-action="dungeon">Take contract</button></footer></article>';}
function handleLiving(e){lastBase='base';}
function confirmDelve(){lastBase={confirmed:S.activeContract};}
function applyDungeonResult(r){const d=S.dungeons.find(x=>x.id===S.activeContract.id);if(r.won)d.closed=true;S.pendingDelve=false;S.activeContract=null;S.expeditionReport={body:'Back.'};}
function ret(r){S.pendingDelve=true;S.activeContract={id:1};applyDungeonResult(r);}
`,w);
vm.runInContext(read('conquest-world.js'),w);
const run=s=>vm.runInContext(s,w);
const fresh=()=>run(`S={turn:4,gold:5000,playerMissedPayroll:true,dungeons:[{id:1,name:'Crown',reward:26000,closed:false,expires:6}],pendingDelve:false,activeContract:null};notes=[]`);
fresh();
run('playerUpkeepTick()');assert.equal(run('charged'),0);assert.equal(run('S.gold'),5000);assert.equal(run('S.playerMissedPayroll'),false);
// warden alone: no conquest; won contract closes as before
run('ret({won:true,wardenSlain:true})');assert.equal(run('S.dungeons[0].closed'),true);assert.equal(run('cqInert(S.dungeons[0])'),false);
// lockout is a random 2-5 turns
const seen=new Set();
for(let i=0;i<300;i++){fresh();run('ret({won:true,wardenSlain:true,bossChestLooted:true})');const t=run('S.dungeons[0].inertUntil-S.turn');seen.add(t);
 assert(t>=2&&t<=5,'lockout '+t);assert.equal(run('S.dungeons[0].expires'),run('S.dungeons[0].inertUntil+4'));assert.equal(run('S.dungeons[0].closed'),false);}
assert.deepEqual([...seen].sort(),[2,3,4,5]);
// lockout blocks card, take, access, deploy; reopens after
fresh();run('ret({won:true,wardenSlain:true,bossChestLooted:true})');const until=run('S.dungeons[0].inertUntil');
assert(/Locked out/.test(run('dungeonCard(S.dungeons[0])'))&&!/Take contract/.test(run('dungeonCard(S.dungeons[0])')));
for(const act of ['dungeon','boast','gc-access','gc-both']){run(`lastBase=null;handleLiving({target:{closest:()=>({dataset:{action:'${act}',id:'1'},disabled:false})}})`);assert.equal(run('lastBase'),null,act);}
run('lastBase=null;S.activeContract={id:1};confirmDelve()');assert.equal(run('lastBase'),null);
run(`S.turn=${until+1}`);assert.equal(run('cqInert(S.dungeons[0])'),false);assert(/Take contract/.test(run('dungeonCard(S.dungeons[0])')));
// anger: third looting skips the lockout, opens at once, marks a rare monster
fresh();run('ret({won:true,wardenSlain:true,bossChestLooted:true});S.turn+=9;ret({won:true,wardenSlain:true,bossChestLooted:true});S.turn+=9');
assert.equal(run('S.dungeons[0].angry'),undefined);
run('ret({won:true,wardenSlain:true,bossChestLooted:true})');
assert.equal(run('S.dungeons[0].angry'),true);assert.equal(run('cqInert(S.dungeons[0])'),false);assert.equal(run('S.dungeons[0].closed'),false);
assert(run('S.dungeons[0].irregular')>=0&&run('S.dungeons[0].irregular')<3);assert(/is angry/.test(run('notes.map(n=>n[1]).join("|")')));
assert(/Angry/.test(run('dungeonCard(S.dungeons[0])'))&&/Take contract/.test(run('dungeonCard(S.dungeons[0])')));
run('S.activeContract={id:1};confirmDelve()');assert.equal(run('lastBase.confirmed.angry'),true);
// still angry: another conquest without killing it keeps skipping the lockout
run('ret({won:true,wardenSlain:true,bossChestLooted:true})');assert.equal(run('cqInert(S.dungeons[0])'),false);assert.equal(run('S.dungeons[0].angry'),true);
// killing the rare monster calms it and resets the count; next conquest locks out again
run('ret({irregularSlain:true})');assert.equal(run('S.dungeons[0].angry'),false);assert.equal(run('S.cqLooted.Crown'),0);
run('ret({won:true,wardenSlain:true,bossChestLooted:true})');assert.equal(run('cqInert(S.dungeons[0])'),true);
// refunds change nothing
fresh();run('ret({initializationFailed:true,wardenSlain:true,bossChestLooted:true})');assert.equal(run('cqInert(S.dungeons[0])'),false);assert.equal(run('S.cqLooted?.Crown||0'),0);
// ---- dungeon ----
const d={Math};vm.createContext(d);
vm.runInContext(`
let trainingMode=false,sectors,chests,enemies,brutus,runStats,logs=[],contract=null;const CHEST_RANGE=1.8;
function buildLevel(){sectors=[{id:0,floor:0,kind:'room',rect:{x0:0,z0:0,x1:10,z1:10},centroid:{x:5,z:5}},{id:4,floor:1,kind:'room',rect:{x0:40,z0:0,x1:50,z1:10},centroid:{x:45,z:5}},{id:9,floor:2,kind:'boss',rect:{x0:80,z0:0,x1:90,z1:10},centroid:{x:85,z:5}}];chests=[{x:5,z:5,sectorId:0,opened:false}];enemies=[{kind:'boss',side:'enemy',downed:false}];}
function jitterInSector(s){return {x:s.centroid.x,z:s.centroid.z};}
function makeEnemy(kind,x,z,sectorId){return {kind,side:'enemy',x,z,sectorId,hp:52,maxHp:52,downed:false,name:kind};}
function pickEnemyAttack(e){return {name:'heavy',dmg:20};}
function nearestChest(){return null;}
function chestPressed(){const c=nearestChest();if(!c)return;c.opened=true;}
function onDowned(c){c.downed=true;}
function logMsg(m){logs.push(m);}
`,d);
vm.runInContext(read('conquest-dungeon.js'),d);
const dr=s=>vm.runInContext(s,d);
dr('runStats={};buildLevel();brutus={x:87.6,z:5}');
assert.equal(dr('chests.filter(c=>c.boss).length'),1);assert.equal(dr('chests.find(c=>c.boss).sectorId'),9);
assert.equal(dr('nearestChest()'),undefined);dr('chestPressed()');assert.equal(dr('!!runStats.bossChestLooted'),false);
dr('onDowned(enemies[0])');assert.equal(dr('runStats.wardenSlain'),true);
assert.equal(dr('nearestChest().boss'),true);dr('chestPressed()');assert.equal(dr('runStats.bossChestLooted'),true);
assert.equal(dr('enemies.some(e=>e.irregular)'),false);           // not angry: no rare monster
dr("contract={angry:true,irregular:0};runStats={};buildLevel()");
const rare=JSON.parse(dr('JSON.stringify(enemies.find(e=>e.irregular))'));
assert(rare&&rare.name==='Gravemaw (rare)'&&rare.kind==='brute'&&rare.sectorId===4&&rare.maxHp===156);
assert.equal(dr('pickEnemyAttack(enemies.find(e=>e.irregular)).dmg'),28);assert.equal(dr('pickEnemyAttack(enemies[0]).dmg'),20);
dr('onDowned(enemies.find(e=>e.irregular))');assert.equal(dr('runStats.irregularSlain'),true);
dr('trainingMode=true;contract={angry:true,irregular:1};buildLevel()');assert.equal(dr('chests.some(c=>c.boss)||enemies.some(e=>e.irregular)'),false);
console.log('PASS: upkeep paused; warden alone does not conquer; lockout random 2-5 turns (all four seen), blocks card/take/access/deploy, reopens; third looting makes the dungeon angry: no lockout, rare monster, card line, contract carries it; stays angry until the rare is killed, then calms and locks out again; refunds ignored; boss chest guarded until the warden falls; rare monster spawned on floor 2 at x3 HP and x1.4 damage, reports irregularSlain; nothing in training.');
