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
   Kills, stances and chambers keep their base values; checkpoints already stop them repeating.
   Companions (Robert, 2026-10-13: "proper xp bars and not set, flat amounts") earn by the same
   rule, measured against their own level, instead of a flat 12 per kill; they stop at their
   growth ceiling. XP is always a whole number. Companions show an XP bar on their guild card,
   in the sidebar and on their profile. */
const XP={punchUp:1.5,below10:0.5,below20:0.2,repeatStep:0.25,repeatFloor:0.5,carryCap:0.5};
function xpFoeLevel(rank,deep){return 10+8*rank+4*Math.max(0,deep||0);}
function xpGap(foe,lvl){return foe>lvl?XP.punchUp:foe<lvl-20?XP.below20:foe<lvl-10?XP.below10:1;}
function xpPlanFor(r,d,lvl){
 const rank=d&&d.rank>=1&&d.rank<=5?d.rank:2;
 const before=d&&d.delve&&d.delve.progress?Math.max(0,d.delve.progress.deepestFloor||0):0;
 const newFloors=Math.max(0,(r.deepestFloor||0)-before);
 const base=(r.kills||0)*22+newFloors*45+(r.brutesBroken||0)*30+(r.secretsFound||0)*25;
 const foe=xpFoeLevel(rank,r.deepestFloor),gap=xpGap(foe,lvl==null?S.brutus.lvl:lvl);
 const repeat=Math.max(XP.repeatFloor,1-XP.repeatStep*((d&&d.conquered)||0));
 return{amount:Math.round(base*gap*repeat),base,gap,repeat,foe,newFloors};
}
function xpCapOne(who,lvl0){ // who: {lvl,exp}; never more than one level above lvl0
 if(who.lvl>lvl0+1){who.lvl=lvl0+1;who.exp=Number.MAX_SAFE_INTEGER;}   // overflowed: keep the max carry
 if(who.lvl>lvl0)who.exp=Math.min(who.exp||0,Math.floor(expToNext(who.lvl)*XP.carryCap));
 who.exp=Math.max(0,Math.round(who.exp||0));
}
function xpCeiling(m){return Math.min(99,m.cap||99);}
function xpGiveCompanion(m,amount){ // whole numbers, one level max, stops at the growth ceiling
 const lvl0=m.lvl,top=xpCeiling(m);amount=Math.max(0,Math.round(amount));
 if(m.lvl>=top){m.exp=0;return{amount:0,ups:0};}
 m.exp=Math.round(m.exp||0)+amount;
 while(m.lvl<top&&m.exp>=expToNext(m.lvl)){m.exp-=expToNext(m.lvl);m.lvl++;}
 xpCapOne(m,lvl0);if(m.lvl>=top)m.exp=0;
 return{amount,ups:m.lvl-lvl0};
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
 const party=(S.party||[]).filter(m=>m.alive).map(m=>({m,lvl0:m.lvl,exp0:Math.round(m.exp||0),plan:xpPlanFor(r,d,m.lvl)}));
 xpPlan=xpPlanFor(r,d);const plan=xpPlan;
 // the old flat companion XP still runs inside; its level-up lines are muted and its result undone below
 const names=new Set(party.map(p=>p.m.name)),logBase=logMsg;
 logMsg=function(t){if(typeof t==='string'){const m=/^(.*) reaches Lv\d+\.$/.exec(t);if(m&&names.has(m[1]))return;}return logBase.apply(this,arguments);};
 try{xpResultBase.apply(this,arguments);}finally{xpPlan=null;logMsg=logBase;}
 const lines=[];
 for(const p of party){const m=p.m;m.lvl=p.lvl0;m.exp=p.exp0;if(!m.alive)continue;
  const g=r.brutusDowned?{amount:0,ups:0}:xpGiveCompanion(m,p.plan.amount);
  if(g.amount>0)lines.push(`${m.name} +${g.amount} XP`);
  if(g.ups)logMsg(`${m.name} reaches Lv${m.lvl}.`,'good');
  const row=S.expeditionReport&&(S.expeditionReport.people||[]).find(x=>x.id===m.id);if(row)row.lvl=m.lvl;}
 if(S.expeditionReport&&!r.brutusDowned){const all=[...(plan.amount>0?[`Brutus +${plan.amount} XP`]:[]),...lines];if(all.length)S.expeditionReport.body+=` ${all.join(' · ')}.`;}
 render();saveLiving();
};
// Whole numbers in old saves too.
function xpWhole(){if(!S||!S.brutus)return;S.brutus.exp=Math.max(0,Math.round(S.brutus.exp||0));for(const a of S.agents||[])if(a.exp!=null)a.exp=Math.max(0,Math.round(a.exp));}
const xpLoadBase=loadLiving;
loadLiving=function(){const ok=xpLoadBase.apply(this,arguments);if(ok)xpWhole();return ok;};
// XP bars for companions: guild cards, sidebar, profile.
function xpBar(m,compact){
 const top=xpCeiling(m),capped=m.lvl>=top,need=expToNext(m.lvl),have=Math.round(m.exp||0);
 const pct=capped?100:Math.max(0,Math.min(100,have/need*100));
 const label=capped?`Lv ${m.lvl} · not getting any stronger`:`${compact?'Lv '+m.lvl+' · ':''}XP ${have} / ${need}`;
 return `<div class="xp-bar" data-xp-for="${m.id}" style="margin:${compact?'2px 0 0':'6px 0'};font-size:${compact?10:11}px;color:var(--dim)" title="${capped?'At growth ceiling':`${need-have} XP to Lv ${m.lvl+1}`}">`
  +`<div>${label}</div><div style="height:4px;background:rgba(0,0,0,.45);border-radius:2px;overflow:hidden;margin-top:2px"><div style="height:100%;width:${pct.toFixed(1)}%;background:var(--gold)"></div></div></div>`;
}
function xpPatchBars(){const root=document.getElementById('living');if(!root)return;
 const mine=new Map((S.roster||[]).filter(a=>a.alive&&a.joined).map(a=>[String(a.id),a]));
 root.querySelectorAll('.person-card').forEach(card=>{const id=card.querySelector('[data-person]')?.dataset.person,a=mine.get(String(id));
  if(a&&!card.querySelector('.xp-bar'))card.querySelector('.metrics')?.insertAdjacentHTML('afterend',xpBar(a,false));});
 root.querySelectorAll('.sidebar .leader').forEach(row=>{const id=row.querySelector('[data-person]')?.dataset.person,a=mine.get(String(id));
  if(a&&!row.querySelector('.xp-bar'))(row.querySelector('.identity > span:last-child')||row).insertAdjacentHTML('beforeend',xpBar(a,true));});
 const pg=root.querySelector('.profile-grid');const pid=pg&&pg.querySelector('[data-action="appraise"]')?.dataset.id,pa=pid&&mine.get(String(pid));
 if(pa&&!pg.querySelector('.xp-bar'))pg.querySelector('.value-grid')?.insertAdjacentHTML('afterend',xpBar(pa,false));
}
const xpRenderBase=render;
render=function(){const r=xpRenderBase.apply(this,arguments);try{xpPatchBars();}catch(e){}return r;};
