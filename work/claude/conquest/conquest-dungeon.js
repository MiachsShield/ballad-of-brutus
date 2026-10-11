// Conquest — dungeon side. The warden room gets a boss chest that opens only once the warden
// is down. The expedition result reports wardenSlain and bossChestLooted (additive fields).
// The chest heals like any chest; the boss loot itself is granted world-side on return (boss-loot-world.js).
const cqBuildLevel=buildLevel;
buildLevel=function(){
 cqBuildLevel();
 if(trainingMode)return;
 const room=sectors.find(s=>s.kind==='boss');if(!room)return;
 const r=room.rect,c=room.centroid;
 chests.push({x:Math.min(r.x1-1.3,c.x+2.6),z:c.z,sectorId:room.id,opened:false,boss:true});
};
function cqWardenAlive(){return enemies.some(e=>e.kind==='boss'&&!e.downed);}
nearestChest=function(){
 const guarded=cqWardenAlive();
 return chests.find(c=>!c.opened&&!(c.boss&&guarded)&&Math.hypot(c.x-brutus.x,c.z-brutus.z)<CHEST_RANGE);
};
const cqChestPressed=chestPressed;
chestPressed=function(){
 const bc=chests.find(c=>c.boss),was=!!(bc&&bc.opened);
 cqChestPressed();
 if(bc&&!was&&bc.opened){runStats.bossChestLooted=true;logMsg("The warden's hoard is yours. Boss loot is counted when you return.","good");}
};
const cqOnDowned=onDowned;
onDowned=function(c,silent){
 const was=!!c.downed;cqOnDowned(c,silent);
 if(!was&&c.downed&&c.side==='enemy'&&c.kind==='boss'){runStats.wardenSlain=true;logMsg("The warden is down. Its hoard is unguarded.","good");}
};
// Angry dungeon: a rare ("irregular") monster prowls the second floor. It is a named, much
// tougher variant of an existing enemy; killing it reports irregularSlain, which calms the dungeon.
const CQ_IRREGULARS=[
 {kind:'brute',name:'Gravemaw',hp:3.0,dmg:1.4},
 {kind:'stalker',name:'The Pale Hunter',hp:3.0,dmg:1.35},
 {kind:'skulker',name:'Old Ratchet',hp:4.0,dmg:1.5},
];
const cqBuildLevelAngry=buildLevel;
buildLevel=function(){
 cqBuildLevelAngry();
 if(trainingMode||!contract||!contract.angry)return;
 const spec=CQ_IRREGULARS[(contract.irregular>=0&&contract.irregular<CQ_IRREGULARS.length)?contract.irregular:0];
 const rooms=sectors.filter(s=>s.floor===1&&s.kind==='room');
 const room=rooms.length?rooms[Math.floor(Math.random()*rooms.length)]:sectors.find(s=>s.kind==='room');if(!room)return;
 const p=jitterInSector(room),e=makeEnemy(spec.kind,p.x,p.z,room.id);
 e.name=spec.name+' (rare)';e.irregular=true;e.dmgScale=spec.dmg;e.hp=e.maxHp=Math.round(e.maxHp*spec.hp);
 enemies.push(e);
 logMsg(`Something rare prowls the second floor: ${spec.name}.`,'warn');
};
const cqPickAttack=pickEnemyAttack;
pickEnemyAttack=function(e){const a=cqPickAttack(e);return e&&e.irregular?{...a,dmg:Math.round(a.dmg*(e.dmgScale||1))}:a;};
const cqOnDownedRare=onDowned;
onDowned=function(c,silent){
 const was=!!c.downed;cqOnDownedRare(c,silent);
 if(!was&&c.downed&&c.irregular){runStats.irregularSlain=true;logMsg(`${c.name.replace(' (rare)','')} is dead. The dungeon's temper breaks.`,'good');}
};
