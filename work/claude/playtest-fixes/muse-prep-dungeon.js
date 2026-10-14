/* Muse playtest 2026-10-12 leftovers (Robert, 2026-10-13: fix before the next playtest).
   1. Enemies in the camera: monsters could walk (or be shoved by the crowd) right up to Brutus,
      so a Brute or the Overseer filled the whole view. Each monster now keeps a personal-space
      distance from Brutus that grows with its size; if it is closer, it is eased back out, along
      the floor and respecting walls. All standoffs stay inside Brutus's melee reach (2.2) and the
      monsters' own attack reach, so nothing about who can hit whom changes.
   2. Training room Reset asked for the deck again and left the view black until you chose.
      Reset now keeps the deck you were using. */
const MP_STANDOFF={skulker:1.7,grazer:1.6,stalker:1.75,brute:1.8,boss:1.8};  // monsters stop advancing at 1.8 on their own; above that they would jitter
const mpUpdateEnemyBase=updateEnemy;
updateEnemy=function(e,dt){const r=mpUpdateEnemyBase.apply(this,arguments);
 try{if(!e||e.downed||e.airborne||!brutus||brutus.downed||e.sectorId==null)return r;
  const min=MP_STANDOFF[e.kind]||1.4,dx=e.x-brutus.x,dz=e.z-brutus.z,d=Math.hypot(dx,dz);
  if(d>0.0001&&d<min){const push=Math.min(min-d,6*dt);tryMove(e,dx/d*push,dz/d*push,{});}
  else if(d<=0.0001){tryMove(e,Math.sin(brutus.facing)*0.05,-Math.cos(brutus.facing)*0.05,{});}
 }catch(err){}
 return r;};
const mpTrainResetBase=trainReset;
trainReset=function(){const keep=cardDiscipline;const r=mpTrainResetBase.apply(this,arguments);
 if(cardSelectionPending&&['Warrior','Priest'].includes(keep))chooseCardDiscipline(keep);return r;};
