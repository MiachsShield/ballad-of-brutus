// node work/claude/dungeon-ranks/ranks.test.cjs — world side of ranks + checkpoints (dungeon side is browser-tested)
const fs=require('fs'),vm=require('vm'),assert=require('assert');
function world(){const ctx={S:{dungeons:[],dungeonSeq:0,pendingDelve:false,activeContract:null,expeditionReport:null},
 esc:s=>String(s),render(){},saveLiving(){},Math,
 spawnDungeon(){ctx.S.dungeonSeq++;ctx.S.dungeons.push({id:ctx.S.dungeonSeq,name:'D'+ctx.S.dungeonSeq,kind:'hunt',reward:30000,closed:false});},
 dungeonCard:d=>'<article><div class="objective">o</div></article>',
 contractSucceeded:(d,r)=>!!d&&!r.brutusDowned&&(d.kind==='hunt'?(r.kills||0)>=5:d.kind==='relic'?(r.secretsFound||0)>=1:d.kind==='depth'?(r.deepestFloor||0)>=2:(r.brutesBroken||0)>=1),
 seen:[],
 applyDungeonResult(r){ctx.seen.push(r);const d=ctx.S.activeContract;if(ctx.contractSucceeded(d,r)){ctx.S.dungeons.find(x=>x.id===d.id).closed=true;}
  ctx.S.expeditionReport={body:'B.'};ctx.S.pendingDelve=false;ctx.S.activeContract=null;}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/ranks-world.js','utf8'),ctx);return ctx;}
// ranks: all five seen, pay scaled, card shows rank and floors; old saves read as rank 2
{const w=world();const seen=new Set();for(let i=0;i<300;i++){w.spawnDungeon();const d=w.S.dungeons.at(-1);seen.add(d.rank);
  assert.equal(d.reward,Math.round(30000*vm.runInContext("RK_PAY",w)[d.rank]/1000)*1000);}
 assert.deepEqual([...seen].sort(),[1,2,3,4,5]);
 const d=w.S.dungeons.find(x=>x.rank===5);assert(/Rank 5/.test(w.dungeonCard(d))&&/5 floors/.test(w.dungeonCard(d)));
 assert(/Rank 2/.test(w.dungeonCard({id:9,name:'old'})));}
function delve(w,d,r){w.S.pendingDelve=true;w.S.activeContract={...d};w.applyDungeonResult(r);}
const st=(over)=>Object.assign({v:1,seed:7,checkpoint:4,checkpointLabel:'B1F rest area',dead:[0],progress:{kills:3,secretsFound:0,brutesBroken:0,deepestFloor:0}},over);
// state kept between entries, shown on the card, travels on the next contract
{const w=world();w.spawnDungeon();const d=w.S.dungeons[0];
 delve(w,d,{kills:3,delveState:st()});assert.equal(d.delve.checkpoint,4);assert(/Checkpoint saved: B1F rest area/.test(w.dungeonCard(d)));
 assert(/Checkpoint saved at the B1F rest area/.test(w.S.expeditionReport.body));
 // progress across entries: 3 earlier + 2 now = 5 → contract credited, dungeon closes, state dropped
 delve(w,d,{kills:2,delveState:st({progress:{kills:5,secretsFound:0,brutesBroken:0,deepestFloor:0}})});
 assert.equal(w.seen.at(-1).kills,5);assert.equal(d.closed,true);assert.equal(d.delve,undefined);}
// conquest and Brutus falling drop the state; a refund keeps it
{const w=world();w.spawnDungeon();const d=w.S.dungeons[0];
 delve(w,d,{kills:1,delveState:st()});delve(w,d,{initializationFailed:true});assert(d.delve);
 delve(w,d,{kills:0,wardenSlain:true,bossChestLooted:true,autoReturned:true,delveState:st()});assert.equal(d.delve,undefined);
 assert(/carried them back to town/.test(w.S.expeditionReport.body));
 delve(w,d,{kills:1,delveState:st()});delve(w,d,{brutusDowned:true,delveState:st()});assert.equal(d.delve,undefined);}
// no credit unless the total really completes it
{const w=world();w.spawnDungeon();const d=w.S.dungeons[0];delve(w,d,{kills:1,delveState:st({progress:{kills:4}})});assert.equal(w.seen.at(-1).kills,1);assert(!d.closed);}
console.log('PASS: ranks 1-5 rolled on open with pay scaled, card shows rank and floors, old dungeons rank 2; checkpoint state kept, shown, dropped on close/conquest/Brutus down, kept on refund; contract progress counts across entries only when the total completes it; auto-return noted in the report.');
