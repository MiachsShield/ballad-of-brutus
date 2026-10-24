/* Checkpoints, resume on re-entry, and the trip home after the boss — dungeon side
   (Robert, 2026-10-13: "Ensure that the dungeons have checkpoints to return and to resume from
   re-entry akin to most dungeons in games. After beating the boss and getting loot, automatic
   teleportation to town as the dungeon closes." Re-entry keeps map, chests and kills.)

   Checkpoints: the spawn room, each floor's arrival room, every rest area and every waypoint.
   Touching one makes it the resume point. The Waypoints button lists all reached checkpoints
   for fast travel (it used to list waypoints and the entrance only).

   Re-entry: the same dungeon is rebuilt from a stored seed. Visited rooms (the map), opened
   chests, spent and spotted traps, killed monsters and found hidden chambers carry over, and
   the party starts at the last checkpoint. The state travels out on the expedition result
   (result.delveState), is kept by the world on that dungeon, and comes back on the contract
   (contract.delve). The world drops it when the dungeon closes, is conquered, or Brutus falls.

   Contract progress counts across entries (result.delveState.progress). Hidden chambers count
   once per chamber, not once per walk-in (old farming bug).

   Boss: once the warden is down and its chest is looted, the dungeon closes and the party is
   carried back to town a few seconds later (result.autoReturned).

   Every entry also turns Brutus to face the way on (the doorway toward the stairs, or the boss),
   instead of whatever direction he spawned in. */
const CK_RETURN_MS=3500;
let ck=null,ckSession=0;
function ckRng(seed){let a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function ckIsCheckpoint(s){return !!s&&(s.kind==='rest'||s.kind==='waypoint'||rkFloorEntrances.includes(s.id));}
function ckLabel(id){const s=sectorById(id);if(!s)return'';
 const what=s.id===rkFloorEntrances[0]?'entrance':s.kind==='rest'?'rest area':s.kind==='waypoint'?'waypoint':'arrival';
 return `${floorLabel(s.floor)} ${what}`;}
function ckZero(){return{kills:0,secretsFound:0,brutesBroken:0,deepestFloor:0};}
function ckSnapshot(){if(!ck)return null;const b=ck.base;
 return{v:1,seed:ck.seed,rank:ck.rank,checkpoint:ck.checkpoint,checkpointLabel:ckLabel(ck.checkpoint),
  visited:[...visitedSectors],dead:[...ck.dead],chests:chests.map((c,i)=>c.opened?i:-1).filter(i=>i>=0),
  traps:traps.map((t,i)=>t.spent||t.known?[i,t.known?1:0,t.spent?1:0]:null).filter(Boolean),
  secrets:[...ck.secrets],checkpoints:[...ck.reached],
  progress:{kills:b.kills+(runStats.kills||0),secretsFound:ck.secrets.size,brutesBroken:b.brutesBroken+(runStats.brutesBroken||0),
   deepestFloor:Math.max(b.deepestFloor,runStats.deepestFloor||0)}};}
// 1. Seeded build + restore. Outermost buildLevel, so every earlier part (warden chest, rare
//    monster) is rebuilt identically from the same seed.
const ckBuildBase=buildLevel;
buildLevel=function(){
 if(trainingMode){ck=null;return ckBuildBase.apply(this,arguments);}
 const st=contract&&contract.delve&&contract.delve.v===1?contract.delve:null;
 const seed=st?st.seed>>>0:(Math.floor(Math.random()*4294967295)>>>0);
 const R=Math.random;Math.random=ckRng(seed);
 try{ckBuildBase.apply(this,arguments);}finally{Math.random=R;}
 enemies.forEach((e,i)=>e._ix=i);
 ck={seed,rank:typeof rkRank==='function'?rkRank():null,resumed:!!st,dead:new Set(st?st.dead:[]),secrets:new Set(st?st.secrets:[]),
  reached:new Set(st?st.checkpoints||[]:[]),checkpoint:st&&sectorById(st.checkpoint)?st.checkpoint:sectors[0].id,
  resumeAt:st&&sectorById(st.checkpoint)?st.checkpoint:sectors[0].id,   // the spawn tick inside start() touches the entrance; keep the real target
  base:Object.assign(ckZero(),st&&st.progress||{}),announced:new Set(st?st.checkpoints||[]:[])};
 if(!st)return;
 const bossDead=enemies.some(e=>e.kind==='boss'&&ck.dead.has(e._ix));
 enemies=enemies.filter(e=>!ck.dead.has(e._ix));
 for(const i of st.chests||[])if(chests[i])chests[i].opened=true;
 for(const [i,known,spent] of st.traps||[])if(traps[i]){traps[i].known=!!known;traps[i].spent=!!spent;}
 for(const id of st.visited||[])if(sectorById(id))visitedSectors.add(id);
 if(bossDead)ck.bossDead=true;
};
// 2. Kills are remembered by build index (pit kills go through onDowned too).
const ckDownedBase=onDowned;
onDowned=function(c){const was=!!(c&&c.downed);const r=ckDownedBase.apply(this,arguments);
 if(ck&&c&&!was&&c.downed&&c.side==='enemy'&&c._ix!=null)ck.dead.add(c._ix);return r;};
// 3. Arrival: place the party at the checkpoint, face the way on, expose live state on runStats.
function ckOnward(from){const last=Math.max(...sectors.map(s=>s.floor));const here=sectorById(from);if(!here)return null;
 const goal=here.floor===last?sectors.find(s=>s.kind==='boss'):sectors.find(s=>s.kind==='connector'&&s.stepped&&s.floor===here.floor&&s.links.some(l=>sectorById(l.to)?.floor!==here.floor));
 if(!goal)return null;const path=sectorPath(from,goal.id);return path&&path.length>1?sectorById(path[1]):null;}
function ckFaceOnward(){const nxt=ckOnward(brutus.sectorId);if(nxt)faceToward(brutus,nxt.centroid);}
function ckPlaceAt(id){const s=sectorById(id);if(!s)return;const c=s.centroid;
 brutus.x=c.x;brutus.z=c.z;brutus.sectorId=s.id;brutus.y=heightAt(s,c.x,c.z);brutus.safeX=c.x;brutus.safeZ=c.z;brutus.safeSectorId=s.id;trail=[{x:c.x,z:c.z}];
 for(const a of allies){a.x=c.x+(Math.random()-0.5)*1.4;a.z=c.z+(Math.random()-0.5)*1.4;a.sectorId=s.id;a.y=heightAt(s,a.x,a.z);a.path=null;}}
const ckStartBase=start;
start=function(){
 ckSession++;const r=ckStartBase.apply(this,arguments);
 if(trainingMode||!ck||!brutus)return r;
 Object.defineProperty(runStats,'secretsFound',{get(){return ck?[...ck.secrets].filter(id=>!ck.secretsBefore.has(id)).length:0;},set(){},enumerable:true,configurable:true});
 ck.secretsBefore=new Set(ck.secrets);
 Object.defineProperty(runStats,'delveState',{get:ckSnapshot,enumerable:true,configurable:true});
 if(ck.bossDead)runStats.wardenSlain=true;
 ck.checkpoint=ck.resumeAt;
 if(ck.resumed&&ck.resumeAt!==sectors[0].id){ckPlaceAt(ck.resumeAt);updatePlaceTag();}
 ckFaceOnward();
 if(ck.resumed)logMsg(`Back at the ${ckLabel(ck.checkpoint)}. The map, opened chests and fallen monsters are as you left them.`,'good');
 return r;
};
// 4. Checkpoints and hidden chambers, checked on the place-tag tick.
const ckPlaceBase=updatePlaceTag;
updatePlaceTag=function(){const r=ckPlaceBase.apply(this,arguments);
 if(!ck||trainingMode||!brutus)return r;const s=sectorById(brutus.sectorId);if(!s)return r;
 if(s.kind==='secret')ck.secrets.add(s.id);
 if(ckIsCheckpoint(s)&&!brutus.downed){ck.checkpoint=s.id;ck.reached.add(s.id);
  if(!ck.announced.has(s.id)){ck.announced.add(s.id);if(s.id!==sectors[0].id||ck.resumed)logMsg(`Checkpoint: ${ckLabel(s.id)}. If you leave, you come back here.`,'good');}}
 const info=document.getElementById('contract-hud');
 if(info&&contract&&contract.kind){const p=ckSnapshot().progress;
  const prog=contract.kind==='hunt'?`${p.kills}/5 defeated`:contract.kind==='relic'?`${p.secretsFound}/1 chamber found`:contract.kind==='depth'?`Floor ${p.deepestFloor+1}/3`:`${p.brutesBroken}/1 stance broken`;
  info.textContent=`${contract.name} · Rank ${ck.rank||2} · ${prog}`;}
 return r;};
// 5. Waypoints list = every checkpoint reached (fast travel); runs after the old handler.
function ckRenderStops(){if(!ck||trainingMode)return;const list=$("overlayList");if(!list)return;list.innerHTML="";
 const stops=sectors.filter(s=>ck.reached.has(s.id)||(s.id===sectors[0].id));
 for(const s of stops){const b=document.createElement("button");b.className="overlayItem";
  b.textContent=`${ckLabel(s.id)}${s.id===ck.checkpoint?' · resume point':''}`;
  b.addEventListener("click",()=>{fastTravelTo(s.id);ckFaceOnward();});list.appendChild(b);}
 $("overlayTitle").textContent="Checkpoints";}
$("waypointBtn")?.addEventListener("click",ckRenderStops);
// 6. Boss beaten and hoard looted: the dungeon closes and the party is carried home.
const ckChestBase=chestPressed;
chestPressed=function(){const was=!!runStats.bossChestLooted;const r=ckChestBase.apply(this,arguments);
 if(!was&&runStats.bossChestLooted&&!trainingMode){const mine=ckSession;runStats.autoReturned=true;
  logMsg('The dungeon shudders and begins to close. The party is carried back to town…','good');flashAlert('THE DUNGEON CLOSES','good');
  setTimeout(()=>{if(mine!==ckSession||campaignDead||!brutus||brutus.downed)return;exitToMap();},CK_RETURN_MS);}
 return r;};
