/* Dungeon rank and checkpoints — world side (Robert, 2026-10-13).
   Rank: every dungeon that opens rolls a rank 1-5 (even odds), shown on its card. Pay scales
   with rank; the dungeon side scales floors, traps and pits, monsters and chests (rank-dungeon.js).
   Loot level already rises with depth, so ranks with more floors drop higher-level loot.
   Dungeons from older saves have no rank and play as rank 2, which is the old dungeon.
   Checkpoints: the dungeon's saved state (result.delveState) is kept on the dungeon and sent back
   on the next contract, so re-entry resumes at the last checkpoint. Dropped when the dungeon
   closes (contract fulfilled or expired), is conquered, or Brutus falls.
   Contract progress counts across entries. */
const RK_PAY={1:0.7,2:1,3:1.35,4:1.7,5:2.2},RK_FLOORS={1:3,2:3,3:4,4:4,5:5};
const RK_BLURB={1:'Small and lightly guarded.',2:'A standard delve.',3:'Deeper, more traps, tougher monsters.',4:'Deep, well trapped, heavily guarded.',5:'Five floors. Everything down there wants you dead.'};
function rkRankOf(d){return d&&d.rank>=1&&d.rank<=5?d.rank:2;}
const rkSpawnBase=spawnDungeon;
spawnDungeon=function(){const before=S.dungeonSeq||0;const r=rkSpawnBase.apply(this,arguments);
 if((S.dungeonSeq||0)>before){const d=S.dungeons.find(x=>x.id===S.dungeonSeq);
  if(d&&d.rank==null){d.rank=1+Math.floor(Math.random()*5);d.reward=Math.round(d.reward*RK_PAY[d.rank]/1000)*1000;}}
 return r;};
const rkCardBase=dungeonCard;
dungeonCard=function(d){let html=rkCardBase(d);const k=rkRankOf(d);
 const pips='●'.repeat(k)+'○'.repeat(5-k);
 let extra=`<p class="rk-rank" style="margin:4px 0;color:var(--gold)"><b>Rank ${k}</b> <span aria-hidden="true">${pips}</span> · ${RK_FLOORS[k]} floors · ${RK_BLURB[k]}</p>`;
 if(d.delve&&!d.closed&&d.delve.checkpointLabel)extra+=`<p class="rk-ck muted" style="margin:2px 0">Checkpoint saved: ${esc(d.delve.checkpointLabel)}. You resume there.</p>`;
 return html.replace('<div class="objective">',extra+'<div class="objective">');};
const rkResultBase=applyDungeonResult;
applyDungeonResult=function(r){
 const c=S.pendingDelve?S.activeContract:null,d=c&&(S.dungeons||[]).find(x=>x.id===c.id);
 const P=r&&r.delveState&&r.delveState.progress;
 // progress across entries: if the contract is only complete counting earlier entries, credit it now
 if(c&&P&&!r.initializationFailed&&!contractSucceeded(c,r)){const all={...r,...P,brutusDowned:r.brutusDowned};
  if(contractSucceeded(c,all)){const f=c.kind==='hunt'?'kills':c.kind==='relic'?'secretsFound':c.kind==='depth'?'deepestFloor':'brutesBroken';r={...r,[f]:P[f]};}}
 rkResultBase(r);
 if(!d||!r||r.initializationFailed)return;
 if(d.closed||r.brutusDowned||(r.wardenSlain&&r.bossChestLooted))delete d.delve;
 else if(r.delveState)d.delve=r.delveState;
 if(r.autoReturned&&S.expeditionReport)S.expeditionReport.body+=' The dungeon closed behind the party and carried them back to town.';
 else if(d.delve&&S.expeditionReport)S.expeditionReport.body+=` Checkpoint saved at the ${d.delve.checkpointLabel}.`;
 render();saveLiving();
};
