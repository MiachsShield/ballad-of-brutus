/* Guild contracts — world side (Robert, 2026-10-11, playtest defaults).
   Rights: every guild except Brutus's holds the rights to the dungeons in its home region
   (region logic). A dungeon's rights holder is fixed when it opens, weighted by roster size among
   that region's guilds; if that guild is gone, the region's largest guild takes over. A dungeon
   whose holder Brutus has absorbed (playerHeld), or in a region with no guild, is his to enter.
   ACCESS: buy one expedition into a dungeon you hold no rights to.
   ALLY: up to two of a guild's own members join one expedition as guests, outside the
   two-companion limit (affiliation logic: guests always belong to the guild that signs).
   ALLY ACCESS: both, from the rights holder.
   A guild deals only on good terms (the existing eligibleGuild rule) and never during a war. */
const GC={accessRate:0.25,allyRate:0.20,bothRate:0.40,maxGuests:2,levelReach:10};
function gcRound(n){return Math.max(100,Math.round(n/100)*100);}
function gcPrice(d,kind){return gcRound((d.reward||0)*(kind==='access'?GC.accessRate:kind==='ally'?GC.allyRate:GC.bothRate));}
function gcRegionGuilds(region){return Object.values(S.guilds||{}).filter(g=>g&&g.home===region);}
function gcBySize(list){return list.slice().sort((a,b)=>guildRosterSize(b.name)-guildRosterSize(a.name));}
function gcWeighted(list){
 const w=list.map(g=>Math.max(1,guildRosterSize(g.name)));let t=w.reduce((a,b)=>a+b,0)*Math.random();
 for(let i=0;i<list.length;i++){t-=w[i];if(t<=0)return list[i];}return list[list.length-1];
}
function gcOwner(d){
 let g=d.gcOwnerId!=null?S.guilds?.[d.gcOwnerId]:null;
 if(!g||g.home!==d.region){const c=gcRegionGuilds(d.region);g=c.length?gcBySize(c)[0]:null;d.gcOwnerId=g?g.id:null;}
 return g;
}
function gcRights(d){
 const g=gcOwner(d);
 if(!g)return{state:'open',guild:null};
 if(g.playerHeld)return{state:'held',guild:g};
 if(d.gcAccess)return{state:'licensed',guild:g};
 return{state:'locked',guild:g};
}
function gcAtWar(g){return !!(g&&campaign().wars?.[g.id]?.active);}
function gcWillDeal(g){return !!g&&!g.playerHeld&&eligibleGuild(g.name)&&!gcAtWar(g);}
function gcGuestPool(g){
 if(!g)return[];
 return S.agents.filter(a=>a.alive&&!a.joined&&a.affiliation===g.name&&a.lvl<=S.brutus.lvl+GC.levelReach)
  .sort((x,y)=>y.lvl-x.lvl).slice(0,GC.maxGuests);
}
function gcAllyGuild(){
 return Object.values(S.guilds||{}).filter(g=>gcWillDeal(g)&&gcGuestPool(g).length)
  .sort((a,b)=>(b.reputation||0)-(a.reputation||0)||guildRosterSize(b.name)-guildRosterSize(a.name))[0]||null;
}
function gcGuestSpecs(d){
 return (d.gcGuests||[]).map(id=>person(id)).filter(a=>a&&a.alive&&!a.joined).slice(0,GC.maxGuests).map(m=>({
  id:m.id,name:m.name,cls:m.cls,lvl:m.lvl,gender:m.gender,portrait:appearanceId(m),
  ability:{name:m.ability.name,rarity:m.ability.rarity},profile:abilityProfile(m),guild:m.affiliation||''}));
}
function gcBuy(d,kind){
 if(S.pendingDelve||campaignEnded()||d.closed)return;
 const r=gcRights(d);
 const g=kind==='ally'?gcAllyGuild():r.guild;
 if(kind==='ally'){if(r.state==='locked'||!g)return;}
 else if(r.state!=='locked'||!gcWillDeal(g))return;
 const guests=kind==='access'?[]:gcGuestPool(g);
 if(kind!=='access'&&!guests.length){S.lastNotice=`${g.name} has nobody free to send.`;return;}
 const cost=gcPrice(d,kind);
 if(S.gold<cost){S.lastNotice=`${g.name} wants ${fmtGold(cost)} for that.`;return;}
 changeGold(-cost,`${g.name}: ${kind==='both'?'ally access':kind} for ${d.name}`);
 g.treasury=(g.treasury||0)+cost;
 if(kind!=='ally')d.gcAccess=true;
 if(guests.length){d.gcGuests=guests.map(a=>a.id);d.gcGuestGuildId=g.id;}
 const what=kind==='access'?'one expedition':kind==='ally'?`${guests.length} guest${guests.length>1?'s':''}`:`one expedition and ${guests.length} guest${guests.length>1?'s':''}`;
 note(guests,`${g.name} signs with Brutus.`,
  `${d.name}: ${what}.${guests.length?` ${guests.map(a=>a.name).join(' and ')} will go down with him.`:''} The contract ends when he comes back up.`,
  `${fmtGold(cost)} paid to ${g.name}`,'dungeon');
}
const gcBaseSpawn=spawnDungeon;
spawnDungeon=function(initial){
 const before=(S.dungeons||[]).length;gcBaseSpawn(initial);
 if((S.dungeons||[]).length>before){const d=S.dungeons[S.dungeons.length-1];const c=gcRegionGuilds(d.region);d.gcOwnerId=c.length?gcWeighted(c).id:null;}
};
const gcBaseCard=dungeonCard;
dungeonCard=function(d){
 let html=gcBaseCard(d);
 const r=gcRights(d),g=r.guild;
 const guests=(d.gcGuests||[]).map(id=>person(id)).filter(a=>a&&a.alive).map(a=>esc(a.name));
 let line;
 if(r.state==='open')line='Unclaimed: no guild holds rights here.';
 else if(r.state==='held')line=`Your rights: ${esc(g.name)} answers to Brutus.`;
 else if(r.state==='licensed')line=`Access bought from ${esc(g.name)} for one expedition.`;
 else line=`Rights held by ${esc(g.name)}${/\.$/.test(g.name)?'':'.'}`+(gcWillDeal(g)?'':gcAtWar(g)?' At war with Brutus: no deals.':' Not on good terms with Brutus: no deals.');
 if(guests.length)line+=` Guests: ${guests.join(', ')}.`;
 html=html.replace('<div class="objective">',`<p class="gc-rights"><b>${line}</b></p><div class="objective">`);
 const busy=S.pendingDelve||campaignEnded();
 if(r.state==='locked'){
  let buttons='';
  if(gcWillDeal(g)){
   const pool=gcGuestPool(g),pa=gcPrice(d,'access'),pb=gcPrice(d,'both');
   buttons=btn('Access · '+fmtGold(pa),'gc-access',d.id,busy||S.gold<pa,'gold')
    +(pool.length?btn(`Ally Access · ${pool.length} guest${pool.length>1?'s':''} · `+fmtGold(pb),'gc-both',d.id,busy||S.gold<pb):'');
  }
  html=html.replace(/<footer>[\s\S]*?<\/footer>/,`<footer><b>${fmtGold(d.reward)}</b>${buttons}</footer>`);
 }else if((r.state==='open'||r.state==='held')&&!(d.gcGuests||[]).length){
  const ag=gcAllyGuild();
  if(ag){const pal=gcPrice(d,'ally');html=html.replace('</footer>',btn(`Ally · ${gcGuestPool(ag).length} from ${esc(ag.name)} · `+fmtGold(pal),'gc-ally',d.id,busy||S.gold<pal)+'</footer>');}
 }
 return html;
};
const gcBaseHandle=handleLiving;
handleLiving=function(e){
 const b=e.target.closest('[data-action]');const act=b&&!b.disabled?b.dataset.action:'';
 if(act.startsWith('gc-')){const d=(S.dungeons||[]).find(x=>x.id===+b.dataset.id);if(d){S.lastNotice='';gcBuy(d,act.slice(3));render();saveLiving();}return;}
 if(act==='dungeon'||act==='boast'){const d=(S.dungeons||[]).find(x=>x.id===+b.dataset.id);const r=d&&gcRights(d);
  if(r&&r.state==='locked'){S.lastNotice=`${r.guild.name} holds the rights to ${d.name}. Buy access first.`;render();return;}}
 return gcBaseHandle(e);
};
const gcBaseConfirm=confirmDelve;
confirmDelve=function(){
 const c=S.activeContract,d=c&&(S.dungeons||[]).find(x=>x.id===c.id);
 if(d){
  if(gcRights(d).state==='locked'){S.showDeploy=false;S.activeContract=null;S.lastNotice=`${gcOwner(d).name} holds the rights to ${d.name}.`;render();return;}
  c.guests=gcGuestSpecs(d);
 }
 return gcBaseConfirm();
};
const gcBaseResult=applyDungeonResult;
applyDungeonResult=function(r){
 const c=S.pendingDelve?S.activeContract:null,d=c&&(S.dungeons||[]).find(x=>x.id===c.id),guests=(c&&c.guests)||[];
 gcBaseResult(r);
 if(!c||!r||r.initializationFailed||campaignEnded())return;   // a refunded expedition keeps its contract
 if(d){d.gcAccess=false;d.gcGuests=null;d.gcGuestGuildId=null;}
 const downed=new Set((r.partyDowned||[]).map(x=>String(x&&typeof x==='object'?x.id:x)));
 for(const s of guests){
  const a=person(s.id);if(!a||!a.alive)continue;
  if(downed.has(String(s.id))){
   a.alive=false;releaseUnique(a);applyGuildDeathConsequence(a);
   note([a],`${a.name} did not come back.`,`${a.name} went down with Brutus under contract from ${a.affiliation||'nowhere'} and died there. The guild will remember whose contract it was.`,'Guest lost','death');
  }else{
   remember(a,'Brutus',8,'came back from a contracted expedition with Brutus');
   a.affection=Math.min(100,(a.affection||0)+5);
  }
 }
 render();saveLiving();
};
