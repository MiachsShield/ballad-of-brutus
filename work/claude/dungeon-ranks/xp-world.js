/* Expedition XP rebalance (Robert, 2026-10-13: "Xp to be adjusted on already established systems
   to avoid over-grinding. Let's keep lv gain reasonable").
   Replaces the old Brutus XP rule (kills 22, floor 45, stance 30, chamber 25; x3 whenever the
   "foe level" 8 + 14/floor + 6/stance beat his level, which it almost always did) with:
   1. Monster level comes from the dungeon: 10 + 8 x rank + 4 x deepest floor (rank 2, floor 3 = 34).
   2. Above his level: x1.5 (was x3). 10+ levels below him: x0.5. 20+ below: x0.2.
   3. Floor XP only for floors new in that dungeon; resuming deep does not pay depth again.
   4. A dungeon already conquered pays less each time: x1, x0.75, x0.5 (floor).
   5. At most one level per expedition, for Brutus and companions. XP past that carries over
      up to half of the next level.
   Kills, stances and chambers keep their base values; checkpoints already stop them repeating. */
const XP={punchUp:1.5,below10:0.5,below20:0.2,repeatStep:0.25,repeatFloor:0.5,carryCap:0.5};
function xpFoeLevel(rank,deep){return 10+8*rank+4*Math.max(0,deep||0);}
function xpGap(foe,lvl){return foe>lvl?XP.punchUp:foe<lvl-20?XP.below20:foe<lvl-10?XP.below10:1;}
function xpPlanFor(r,d){
 const rank=d&&d.rank>=1&&d.rank<=5?d.rank:2;
 const before=d&&d.delve&&d.delve.progress?Math.max(0,d.delve.progress.deepestFloor||0):0;
 const newFloors=Math.max(0,(r.deepestFloor||0)-before);
 const base=(r.kills||0)*22+newFloors*45+(r.brutesBroken||0)*30+(r.secretsFound||0)*25;
 const foe=xpFoeLevel(rank,r.deepestFloor),gap=xpGap(foe,S.brutus.lvl);
 const repeat=Math.max(XP.repeatFloor,1-XP.repeatStep*((d&&d.conquered)||0));
 return{amount:Math.round(base*gap*repeat),base,gap,repeat,foe,newFloors};
}
function xpCapOne(who,lvl0){ // who: {lvl,exp}; never more than one level above lvl0
 if(who.lvl>lvl0+1){who.lvl=lvl0+1;who.exp=Number.MAX_SAFE_INTEGER;}   // overflowed: keep the max carry
 if(who.lvl>lvl0)who.exp=Math.min(who.exp||0,Math.floor(expToNext(who.lvl)*XP.carryCap));
}
let xpPlan=null;
const xpGrantBase=grantExp;
grantExp=function(amount,note){
 if(!xpPlan)return xpGrantBase.apply(this,arguments);
 const p=xpPlan;xpPlan=null;if(p.amount<=0)return;
 const b=S.brutus,lvl0=b.lvl;b.exp+=p.amount;
 while(b.lvl<99&&b.exp>=expToNext(b.lvl)){b.exp-=expToNext(b.lvl);b.lvl++;}
 xpCapOne(b,lvl0);
 const why=p.gap>1?' That was above his weight.':p.gap<1?' Easy work for him now; it teaches less.':'';
 const rep=p.repeat<1?' Ground he has already conquered.':'';
 logMsg(`Brutus: +${p.amount} XP.${why}${rep}`,'good');
 if(b.lvl>lvl0)logMsg(`Brutus reaches Lv${b.lvl}.`,'good');
};
const xpResultBase=applyDungeonResult;
applyDungeonResult=function(r){
 const c=S.pendingDelve?S.activeContract:null,d=c&&(S.dungeons||[]).find(x=>x.id===c.id);
 if(!S.pendingDelve||!r||r.initializationFailed)return xpResultBase.apply(this,arguments);
 const party=(S.party||[]).filter(m=>m.alive).map(m=>({m,lvl0:m.lvl}));
 xpPlan=xpPlanFor(r,d);const plan=xpPlan;
 try{xpResultBase.apply(this,arguments);}finally{xpPlan=null;}
 for(const {m,lvl0} of party)if(m.alive)xpCapOne(m,lvl0);
 if(S.expeditionReport&&!r.brutusDowned&&plan.amount>0)S.expeditionReport.body+=` Brutus +${plan.amount} XP.`;
 render();saveLiving();
};
