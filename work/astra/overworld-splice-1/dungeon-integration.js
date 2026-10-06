// S1 dungeon encounter UI. Simulation stays in the world frame.
let owSession=0, owOpen=false, owKey=null, owHidden=false;
let owFinished=new Set();
const owTalk=document.createElement('button');
owTalk.id='owTalk';owTalk.textContent='Talk to adventurers';owTalk.hidden=true;
// Lives in the arena's empty bottom-left corner: clear of the minimap (top-right)
// and the Attack/Jump pads (bottom-right), and it scrolls with the arena on phones.
const owArena=document.getElementById?.('arena');
owTalk.style.cssText=owArena?'position:absolute;left:12px;bottom:12px;z-index:80;padding:12px':'position:fixed;left:18px;bottom:18px;z-index:80;padding:12px';
const owDialog=document.createElement('section');
owDialog.id='owMeeting';owDialog.hidden=true;
owDialog.setAttribute('role','dialog');owDialog.setAttribute('aria-label','Adventurer encounter');
owDialog.style.cssText='position:fixed;inset:20% 10% auto;z-index:200;background:#17171e;color:#eee;border:1px solid #c9a24b;padding:24px;max-height:65vh;overflow:auto';
(owArena||document.body).append(owTalk);document.body.append(owDialog);
document.addEventListener('keydown',e=>{
  if(!owOpen)return;
  if(e.key==='Escape'){e.preventDefault();owClose();}
  if(e.key!=='Tab'){e.stopImmediatePropagation();if(!owDialog.contains(e.target))e.preventDefault();}
},true);
for(const type of ['pointerdown','click'])document.addEventListener(type,e=>{
  if(owOpen&&!owDialog.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();}
},true);
function owSafe(){return dungeonInitialized&&!campaignDead&&!brutus.downed&&!cardSelectionPending&&!encounter.active&&!enemies.some(e=>!e.downed&&(e.sectorId===brutus.sectorId||(e.aware&&dist(brutus,e)<10)))&&sectorById(brutus.sectorId)?.kind!=='connector';}
function owRequest(verb){return window.parent.BOBOWRequest?.(window,{key:owKey,verb})||{error:'World unavailable'};}
function owClose(){owOpen=false;owDialog.hidden=true;dungeonPaused=owHidden||cardSelectionPending;sfx?.setPaused(dungeonPaused);clearInput();}
function owRefresh(){owKey=owSession+':'+brutus.sectorId;owTalk.hidden=owFinished.has(owKey)||owOpen||dungeonPaused||!owSafe();}
owTalk.onclick=()=>{
  if(!owSafe()||dungeonPaused)return;
  owKey=owSession+':'+brutus.sectorId;
  const reply=owRequest();
  if(reply.error){logMsg(reply.error,'warn');return;}
  if(reply.empty||reply.done){owFinished.add(owKey);owTalk.hidden=true;logMsg(reply.done?'You have already dealt with this party.':'No adventurers remain nearby.');return;}
  owOpen=true;dungeonPaused=true;sfx?.setPaused(true);clearInput();held.clear();
  owDialog.replaceChildren();
  const title=document.createElement('h2');title.textContent=reply.party.name;
  const goal=document.createElement('p');goal.textContent=reply.party.goal;
  owDialog.append(title,goal);
  for(const verb of ['aid','ignore','exploit','obstruct']){
    const b=document.createElement('button');b.textContent=verb[0].toUpperCase()+verb.slice(1);b.dataset.owVerb=verb;
    b.onclick=()=>{const r=owRequest(verb);if(r.error){logMsg(r.error,'warn');return;}if(r.result)logMsg(r.result.name+': '+r.result.note,'good');owFinished.add(owKey);owClose();};
    owDialog.append(b);
  }
  const close=document.createElement('button');close.textContent='Not yet';close.onclick=owClose;owDialog.append(close);
  owDialog.hidden=false;owTalk.hidden=true;close.focus();
};
const owPlaceBase=updatePlaceTag;
updatePlaceTag=function(){owPlaceBase();owRefresh();};
const owStartBase=start;
start=function(){owSession++;owFinished=new Set();owOpen=false;owHidden=false;owDialog.hidden=true;owStartBase();owRefresh();};
window.addEventListener('message',e=>{
  if(e.source!==window.parent)return;
  if(e.data?.type==='pauseDungeon'){owHidden=!!e.data.paused;if(owOpen){dungeonPaused=true;sfx?.setPaused(true);}}
  if(e.data?.type==='resumeDungeon'&&owOpen){dungeonPaused=true;sfx?.setPaused(true);}
});
