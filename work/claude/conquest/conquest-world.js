/* Conquest and upkeep — world side (Robert, 2026-10-11, playtest).
   1. Upkeep paused: Brutus's per-turn roster upkeep is not charged while UPKEEP_PAUSED is true.
      The original charge is kept, so resuming is one flag.
   2. Lockout: an expedition that returns with the warden slain AND the boss chest looted
      conquers the dungeon. It stays on the board, locked out for a random 2-5 turns (Robert),
      takes no contracts, access or guests, then reopens with a fresh four-turn window.
   3. Angry dungeons (Robert: "unique/rare monsters — dungeon angry at being looted x times"):
      each conquest of a dungeon counts as a looting. On the CQ_ANGER_AFTER-th looting (3,
      placeholder for x) the lockout does not happen: it auto-refreshes, the dungeon reopens at
      once and a rare monster moves in (spawned dungeon-side). While it is angry, further
      conquests also skip the lockout. Killing the rare monster calms it and resets the count.
   Inert dungeons still count toward the four-dungeon board. */
const UPKEEP_PAUSED=true;
const CQ_LOCKOUT_MIN=2,CQ_LOCKOUT_MAX=5,CQ_ANGER_AFTER=3,CQ_IRREGULAR_KINDS=3;
const cqBaseUpkeep=playerUpkeepTick;
playerUpkeepTick=function(){
 if(UPKEEP_PAUSED){S.playerPayroll=null;S.playerMissedPayroll=false;return;}
 return cqBaseUpkeep();
};
function cqLockoutTurns(){return CQ_LOCKOUT_MIN+Math.floor(Math.random()*(CQ_LOCKOUT_MAX-CQ_LOCKOUT_MIN+1));}
function cqLooted(){return S.cqLooted||(S.cqLooted={});}
function cqInert(d){return !!d&&!d.closed&&(d.inertUntil||0)>=S.turn;}
const cqBaseResult=applyDungeonResult;
applyDungeonResult=function(r){
 const c=S.pendingDelve?S.activeContract:null,d=c&&(S.dungeons||[]).find(x=>x.id===c.id);
 cqBaseResult(r);
 if(!d||!r||r.initializationFailed||campaignEnded())return;
 const L=cqLooted();let changed=false;
 if(r.irregularSlain&&d.angry){
  d.angry=false;d.irregular=null;L[d.name]=0;changed=true;
  note([],`${d.name} calms down.`,'The rare monster is dead. The dungeon goes back to its usual temper.','Anger reset','dungeon');
  if(S.expeditionReport)S.expeditionReport.body+=` The rare monster is dead; ${d.name} calms down.`;
 }
 if(r.wardenSlain&&r.bossChestLooted){
  changed=true;d.closed=false;d.conquered=(d.conquered||0)+1;L[d.name]=(L[d.name]||0)+1;
  if(!d.angry&&L[d.name]>=CQ_ANGER_AFTER){d.angry=true;d.irregular=Math.floor(Math.random()*CQ_IRREGULAR_KINDS);
   note([],`${d.name} is angry.`,'Looted once too often. The lockout breaks: something rare has moved in.','Lockout refreshed · rare monster inside','dungeon');}
  if(d.angry){
   d.inertUntil=0;d.expires=Math.max(d.expires||0,S.turn+4);
   if(S.expeditionReport)S.expeditionReport.body+=` ${d.name} is angry: no lockout, and something rare is inside.`;
  }else{
   const t=cqLockoutTurns();d.inertUntil=S.turn+t;d.expires=d.inertUntil+4;
   note([],`${d.name}: locked out.`,'The warden is dead and its hoard is empty. Nothing stirs down there until the lockout resets.',
    `Lockout ${t} turns · resets turn ${d.inertUntil+1}`,'dungeon');
   if(S.expeditionReport)S.expeditionReport.body+=` ${d.name} is locked out until turn ${d.inertUntil+1}.`;
  }
 }
 if(changed){render();saveLiving();}
};
const cqBaseCard=dungeonCard;
dungeonCard=function(d){
 let html=cqBaseCard(d);
 if(cqInert(d))html=html.replace(/<footer>[\s\S]*?<\/footer>/,
  `<footer><b>Locked out</b><span class="muted"> Conquered. Lockout resets turn ${d.inertUntil+1}.</span></footer>`);
 else if(d.angry)html=html.replace('<div class="objective">','<p class="gc-rights"><b>Angry: looted too often. Something rare has moved in.</b></p><div class="objective">');
 return html;
};
const cqBaseHandle=handleLiving;
handleLiving=function(e){
 const b=e.target.closest('[data-action]');const act=b&&!b.disabled?b.dataset.action:'';
 if(act==='dungeon'||act==='boast'||act.startsWith('gc-')){
  const d=(S.dungeons||[]).find(x=>x.id===+b.dataset.id);
  if(cqInert(d)){S.lastNotice=`${d.name} is locked out until turn ${d.inertUntil+1}.`;render();return;}
 }
 return cqBaseHandle(e);
};
const cqBaseConfirm=confirmDelve;
confirmDelve=function(){
 const c=S.activeContract,d=c&&(S.dungeons||[]).find(x=>x.id===c.id);
 if(cqInert(d)){S.showDeploy=false;S.activeContract=null;S.lastNotice=`${d.name} is locked out until turn ${d.inertUntil+1}.`;render();return;}
 if(c&&d){c.angry=!!d.angry;c.irregular=d.irregular;}
 return cqBaseConfirm();
};
