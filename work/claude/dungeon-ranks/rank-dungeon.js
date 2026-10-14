/* Dungeon rank 1-5 — dungeon side (Robert, 2026-10-13: "Dungeon complexity should scale with
   difficulty, mechanisms, monsters, and rewards"; difficulty = a rank per dungeon).
   The rank arrives on the contract (contract.rank). Rank 2 reproduces the old dungeon exactly.
   What a rank changes here:
     layout     floors (3/3/4/4/5)
     mechanisms trapped passages, trap pits and drop pits per floor, trap damage
     monsters   how many rooms are occupied, how often a second monster joins, which kinds
                (low ranks lean Skulker/Grazer, high ranks Brute/Stalker), monster HP and damage,
                warden HP
     rewards    chest odds (here); pay and loot level are world-side / via depth
   The generator below is the old buildLevel/buildFloor with those numbers pulled into RK. */
const RK={
 1:{floors:3,occupy:.55,extra:.20,hp:.80,dmg:.85,boss:.80,trapConn:.25,trapDmg:.80,trapPits:1,dropPits:1,chest:.45,mix:{skulker:4,grazer:3,brute:1,stalker:1}},
 2:{floors:3,occupy:.70,extra:.35,hp:1.00,dmg:1.00,boss:1.00,trapConn:.40,trapDmg:1.00,trapPits:1,dropPits:1,chest:.45,mix:{skulker:1,brute:1,stalker:1,grazer:1}},
 3:{floors:4,occupy:.75,extra:.45,hp:1.15,dmg:1.10,boss:1.25,trapConn:.50,trapDmg:1.15,trapPits:2,dropPits:1,chest:.55,mix:{skulker:2,brute:2,stalker:2,grazer:1}},
 4:{floors:4,occupy:.80,extra:.55,hp:1.30,dmg:1.20,boss:1.50,trapConn:.60,trapDmg:1.30,trapPits:2,dropPits:1,chest:.60,mix:{skulker:2,brute:3,stalker:3,grazer:1}},
 5:{floors:5,occupy:.85,extra:.65,hp:1.50,dmg:1.35,boss:1.80,trapConn:.70,trapDmg:1.45,trapPits:2,dropPits:2,chest:.65,mix:{skulker:1,brute:3,stalker:3}},
};
function rkRank(){const r=contract&&+contract.rank;return r>=1&&r<=5?Math.round(r):2;}
function rkP(){return RK[rkRank()];}
let rkFloorEntrances=[];   // sector id where Brutus arrives on each floor (floor 0: the spawn room)
function rkPickKind(P){const ent=Object.entries(P.mix);let t=ent.reduce((s,[,w])=>s+w,0)*Math.random();for(const [k,w] of ent){if((t-=w)<0)return k;}return ent[0][0];}
function rkEnemy(kindId,x,z,sectorId,P){const e=makeEnemy(kindId,x,z,sectorId);const m=kindId==='boss'?P.boss:P.hp;
 e.hp=e.maxHp=Math.max(1,Math.round(e.maxHp*m));e.rankDmg=P.dmg;return e;}
function rkBuildFloor(f,xOff,yOff,nextId,P,last){
 const rooms=[];
 for(let r=0;r<GRID;r++)for(let col=0;col<GRID;col++){
  const idx=r*GRID+col;let kind=FLOOR_PLAN[idx];
  if(f===last&&idx===8)kind="waypoint";
  if(f===last&&idx===STAIR_IDX)kind="boss";
  const cx=xOff+(col-1)*CELL,cz=(r-1)*CELL;
  const hw=(ROOM_MIN+Math.random()*(ROOM_MAX-ROOM_MIN))/2,hd=(ROOM_MIN+Math.random()*(ROOM_MAX-ROOM_MIN))/2;
  const s=makeSector(nextId++,kind,f,cx-hw,cz-hd,cx+hw,cz+hd,yOff+(kind==="platform"?3.4:0));
  sectors.push(s);rooms.push(s);
 }
 const adj=[];
 for(let r=0;r<GRID;r++)for(let col=0;col<GRID;col++){const i=r*GRID+col;
  if(col<GRID-1)adj.push([i,i+1,"E"]);if(r<GRID-1)adj.push([i,i+GRID,"S"]);}
 shuffle(adj);
 const parent=rooms.map((_,i)=>i);const find=x=>parent[x]===x?x:(parent[x]=find(parent[x]));
 const tree=[],extra=[];
 for(const e of adj){const ra=find(e[0]),rb=find(e[1]);if(ra!==rb){parent[ra]=rb;tree.push(e);}else extra.push(e);}
 for(const [i,j,d] of tree){const secret=rooms[i].kind==="secret"||rooms[j].kind==="secret";
  joinRects(rooms[i],rooms[j],d,nextId++,{secret,width:secret?1.8:undefined});}
 shuffle(extra);
 let ei=0;
 for(let k=0;k<2&&ei<extra.length;k++,ei++){const [i,j,d]=extra[ei];
  if(rooms[i].kind==="secret"||rooms[j].kind==="secret"){k--;continue;}
  joinRects(rooms[i],rooms[j],d,nextId++,{});}
 let trapPits=0,dropPits=0,descendPit=null;const wantDrop=f<last?P.dropPits:0;
 for(;ei<extra.length;ei++){const [i,j,d]=extra[ei];
  if(rooms[i].kind==="secret"||rooms[j].kind==="secret")continue;
  if(trapPits<P.trapPits){joinRects(rooms[i],rooms[j],d,nextId++,{kind:"pit",outcome:"trap"});trapPits++;continue;}
  if(dropPits<wantDrop){const p=joinRects(rooms[i],rooms[j],d,nextId++,{kind:"pit",outcome:"descend"});(descendPit||(descendPit=[])).push(p);dropPits++;continue;}
  break;}
 rooms.forEach((room,i)=>{if(i===ENTRANCE_IDX)return;
  if(room.kind==="secret"||room.kind==="rest"||room.kind==="waypoint"||room.kind==="boss")return;
  if(Math.random()>=P.occupy)return;
  const n=1+(Math.random()<P.extra+f*0.15?1:0);
  for(let k=0;k<n;k++){const kindId=f===0&&i===0&&k===0&&Math.random()<0.6?"skulker":rkPickKind(P);
   const p=jitterInSector(room);enemies.push(rkEnemy(kindId,p.x,p.z,room.id,P));}});
 const bossRoom=rooms.find(r=>r.kind==="boss");
 if(bossRoom){const p=bossRoom.centroid;enemies.push(rkEnemy("boss",p.x,p.z,bossRoom.id,P));}
 return{nextId,entranceId:rooms[ENTRANCE_IDX].id,stairOutId:rooms[STAIR_IDX].id,descendPits:descendPit||[]};
}
buildLevel=function(){
 sectors=[];traps=[];enemies=[];chests=[];let nextId=0;const floors=[];rkFloorEntrances=[];
 if(trainingMode){sectors.push(makeSector(0,"room",0,-9,-9,9,9,0));return;}
 const P=rkP(),N=P.floors;
 for(let f=0;f<N;f++){const r=rkBuildFloor(f,f*FLOOR_X_GAP,f*FLOOR_Y_STEP,nextId,P,N-1);nextId=r.nextId;floors.push(r);}
 for(let f=0;f<N-1;f++){const top=floors[f],bot=floors[f+1];
  joinRects(sectorById(top.stairOutId),sectorById(bot.entranceId),"E",nextId++,{stepped:true});
  for(const p of top.descendPits)p.descendTo=bot.entranceId;}
 rkFloorEntrances=floors.map((fl,f)=>f===0?sectors[0].id:fl.entranceId);
 for(const s of sectors){if(s.kind!=="connector"||s.stepped||Math.random()>=P.trapConn)continue;
  const p=s.centroid;traps.push({x:p.x,z:p.z,kind:Math.random()<0.5?"spikes":"dart",known:false,spent:false});}
 for(let f=0;f<N;f++){
  const candidates=sectors.filter(s=>s.floor===f&&s.kind==="room"&&s.id!==floors[f].entranceId);
  if(candidates.length&&Math.random()<P.chest){const room=candidates[Math.floor(Math.random()*candidates.length)];
   const p=jitterInSector(room);chests.push({x:p.x,z:p.z,sectorId:room.id,opened:false});}
 }
};
const rkPickAttack=pickEnemyAttack;
pickEnemyAttack=function(e){const a=rkPickAttack.apply(this,arguments);return a&&e&&e.rankDmg&&e.rankDmg!==1?{...a,dmg:Math.round(a.dmg*e.rankDmg)}:a;};
checkTrapTrigger=function(c,who){const t=traps.find(t=>!t.spent&&Math.hypot(t.x-c.x,t.z-c.z)<0.5);if(!t)return;t.spent=true;soundAt('trap_trigger',brutus);
 const dmg=Math.round((t.kind==="spikes"?14:9)*DIFFICULTY[difficulty].trap*(trainingMode?1:rkP().trapDmg));damage(c,dmg);
 logMsg(`${who} sets off the ${t.kind} — ${dmg}.`,"bad");flashAlert("trap!","bad");updatePartyUI();};
const RK_WORDS=['','One','Two','Three','Four','Five'];
const rkLog=logMsg;
logMsg=function(text,...rest){if(typeof text==='string'&&text.startsWith('Three floors:')&&!trainingMode)text=`Rank ${rkRank()} · ${RK_WORDS[rkP().floors]} floors:`+text.slice('Three floors:'.length);return rkLog.call(this,text,...rest);};
