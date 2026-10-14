// node work/claude/dungeon-ranks/xp.test.cjs — expedition XP rebalance
const fs=require('fs'),vm=require('vm'),assert=require('assert');
function expToNext(l){if(l<20)return Math.round(60*Math.pow(1.14,l));if(l<45)return Math.round(700*Math.pow(1.075,l-20));return Math.round(4200*Math.pow(1.045,l-45));}
function world(lvl,old){const ctx={S:{brutus:{lvl,exp:0},party:[],dungeons:[],pendingDelve:true,activeContract:null,expeditionReport:{body:''}},expToNext,logs:[],
 logMsg(t){ctx.logs.push(t);},render(){},saveLiving(){},Math,
 grantExp(a){const b=ctx.S.brutus;b.exp+=a;while(b.exp>=expToNext(b.lvl)){b.exp-=expToNext(b.lvl);b.lvl++;}},
 // the old rule, as in the baseline: x3 when "foe level" 8+14/floor+6/stance beats Brutus
 applyDungeonResult(r){ctx.S.pendingDelve=false;for(const m of ctx.S.party){m.exp+=r.kills*12;while(m.exp>=expToNext(m.lvl)){m.exp-=expToNext(m.lvl);m.lvl++;}}
  if(r.brutusDowned)return;const foe=8+(r.deepestFloor||0)*14+(r.brutesBroken||0)*6;
  const base=(r.kills||0)*22+(r.deepestFloor||0)*45+(r.brutesBroken||0)*30+(r.secretsFound||0)*25;if(base>0)ctx.grantExp(base*(foe>ctx.S.brutus.lvl?3:1));}};
 vm.createContext(ctx);if(!old)vm.runInContext(fs.readFileSync(__dirname+'/xp-world.js','utf8'),ctx);return ctx;}
function run(w,d,r){w.S.dungeons=[d];w.S.activeContract={...d};w.S.pendingDelve=true;w.applyDungeonResult(r);return w.S.brutus;}
const clear={1:{kills:10,deepestFloor:2,brutesBroken:2,secretsFound:1},2:{kills:15,deepestFloor:2,brutesBroken:4,secretsFound:1},
 3:{kills:23,deepestFloor:3,brutesBroken:7,secretsFound:1},4:{kills:26,deepestFloor:3,brutesBroken:9,secretsFound:1},5:{kills:37,deepestFloor:4,brutesBroken:16,secretsFound:1}};
const lv=b=>b.lvl+b.exp/expToNext(b.lvl);
const rows=[];
for(const L of [22,30,40])for(const k of [1,2,3,4,5]){const o=run(world(L,true),{id:1,rank:k},clear[k]),n=run(world(L),{id:1,rank:k},clear[k]);
 rows.push(`Lv${L} rank ${k}: old +${(lv(o)-L).toFixed(2)} lv, new +${(lv(n)-L).toFixed(2)} lv`);
 assert(lv(n)-L<=1.5+1e-9,'never more than one level plus half');assert(lv(n)<=lv(o));}
// 1. depth is not paid again when resuming deep
{const w=world(22);const d={id:1,rank:2,delve:{progress:{deepestFloor:2}}};run(w,d,{kills:0,deepestFloor:2});assert.equal(w.S.brutus.exp,0);assert.equal(w.S.brutus.lvl,22);}
// 2. outgrown dungeons teach less: rank 1 (foe 26-34) at Lv50 pays x0.2
{const w=world(50);run(w,{id:1,rank:1},{kills:10});assert.equal(w.S.brutus.exp,Math.round(10*22*0.2));}
// 3. repeat conquests pay less, floor at half
{for(const [c,m] of [[0,1.5],[1,1.5*0.75],[2,1.5*0.5],[5,1.5*0.5]]){const w=world(22);run(w,{id:1,rank:2,conquered:c},{kills:1});assert.equal(w.S.brutus.exp,Math.round(22*m));}}
// 4. companions capped at one level per expedition
{const w=world(22);w.S.party=[{alive:true,lvl:5,exp:0}];run(w,{id:1,rank:2},{kills:40});const m=w.S.party[0];
 assert.equal(m.lvl,6);assert(m.exp<=Math.floor(expToNext(6)*0.5));}
// 5. Brutus down: no Brutus XP; refunds untouched
{const w=world(22);run(w,{id:1,rank:2},{kills:5,brutusDowned:true});assert.equal(w.S.brutus.exp,0);}
console.log(rows.join('\n'));
console.log('PASS: full clears never exceed one level (+ half carried) and never beat the old rule; resumed depth not re-paid; outgrown dungeons x0.2; repeat conquests x0.75/x0.5; companions capped at one level; Brutus down pays nothing.');
