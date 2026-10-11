/* Conquest and upkeep — world side (Robert, 2026-10-11, playtest).
   1. Upkeep paused: Brutus's per-turn roster upkeep is not charged while UPKEEP_PAUSED is true.
      The original charge is kept, so resuming is one flag.
   2. Conquered dungeons (shown as a raid lockout): when an expedition reports the warden slain AND the boss chest looted,
      the dungeon stays on the board but is inert for CQ_INERT_TURNS turns (Robert: "x turns, tbd";
      3 is a placeholder). While inert it takes no contracts, access or guests. It then reopens
      with a fresh four-turn window. Inert dungeons still count toward the four-dungeon board. */
const UPKEEP_PAUSED=true;
const CQ_INERT_TURNS=3;
const cqBaseUpkeep=playerUpkeepTick;
playerUpkeepTick=function(){
 if(UPKEEP_PAUSED){S.playerPayroll=null;S.playerMissedPayroll=false;return;}
 return cqBaseUpkeep();
};
function cqInert(d){return !!d&&!d.closed&&(d.inertUntil||0)>=S.turn;}
const cqBaseResult=applyDungeonResult;
applyDungeonResult=function(r){
 const c=S.pendingDelve?S.activeContract:null,d=c&&(S.dungeons||[]).find(x=>x.id===c.id);
 cqBaseResult(r);
 if(!d||!r||r.initializationFailed||campaignEnded())return;
 if(r.wardenSlain&&r.bossChestLooted){
  d.closed=false;d.conquered=(d.conquered||0)+1;d.inertUntil=S.turn+CQ_INERT_TURNS;d.expires=d.inertUntil+4;
  note([],`${d.name}: locked out.`,`The warden is dead and its hoard is empty. Nothing stirs down there until the lockout resets.`,
   `Lockout · resets turn ${d.inertUntil+1}`,'dungeon');
  if(S.expeditionReport)S.expeditionReport.body+=` ${d.name} is locked out until turn ${d.inertUntil+1}.`;
  render();saveLiving();
 }
};
const cqBaseCard=dungeonCard;
dungeonCard=function(d){
 let html=cqBaseCard(d);
 if(cqInert(d))html=html.replace(/<footer>[\s\S]*?<\/footer>/,
  `<footer><b>Locked out</b><span class="muted"> Conquered. Lockout resets turn ${d.inertUntil+1}.</span></footer>`);
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
 return cqBaseConfirm();
};
