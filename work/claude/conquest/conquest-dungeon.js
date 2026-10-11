// Conquest — dungeon side. The warden room gets a boss chest that opens only once the warden
// is down. The expedition result reports wardenSlain and bossChestLooted (additive fields).
// Chest contents are today's chest supplies; what a boss chest should hold is still open.
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
 if(bc&&!was&&bc.opened){runStats.bossChestLooted=true;logMsg("The warden's hoard is yours. This place will be quiet for a while.","good");}
};
const cqOnDowned=onDowned;
onDowned=function(c,silent){
 const was=!!c.downed;cqOnDowned(c,silent);
 if(!was&&c.downed&&c.side==='enemy'&&c.kind==='boss'){runStats.wardenSlain=true;logMsg("The warden is down. Its hoard is unguarded.","good");}
};
