/* Character drives (Robert, 2026-10-13: "what they are most likely to do that will impact their
   life trajectory. Joining up with a certain someone, seeking certain types of gear, wanting to
   be a certain class"; asked to add them as real drives).
   Every living character carries up to three drives. They move each world turn and, when they
   complete, change the character through the game's existing systems:
     gear    wants a slot at a rarity or better ("a Rare weapon").
             Free agents and guild members search for it on their own (one roll a turn, in that
             slot, at their level); a find becomes their best find. Brutus's companions wait for
             you: equipping them with it fulfils it (loyalty +8, affection +6); left waiting more
             than 6 turns, their affection slips by 1 a turn.
     class   wants to retrain as another class (a neighbouring class, or the class the market is
             paying for). Builds while they are Lv 10+; on completion their class changes, they
             keep their abilities, and later ability rolls come from the new class.
     person  wants to work beside someone who is in a different company (an ally, a lover, a
             famous name from home, or one of Brutus's people). On completion they leave their
             guild (or Brutus) and sign where that person is. A companion's loyalty slows the pull;
             recruiting the person they want resolves it in Brutus's favour (loyalty +10).
   Personality sets the odds: Ambitious and Proud want classes, Mercenary wants better gear,
   Loyal follows allies and lovers, Cautious wants armour. Numbers are playtest values (DRV). */
const DRV={gearChance:.8,classChance:{Ambitious:.25,Proud:.2,Mercenary:.1,Cautious:.05,Loyal:.08},personChance:.55,
 classMinLvl:10,classStep:[2,6],personStep:[3,9],retryAfter:5,waitGrace:6,searchChance:{Mercenary:.35,default:.25}};
const DRV_RANK=['common','fine','rare','enchanted','legendary'];
const DRV_SLOTS={Mage:['Accessory','Weapon'],Priest:['Accessory','Chest'],Warrior:['Weapon','Chest'],Ranger:['Weapon','Hand'],Rogue:['Hand','Weapon'],Knight:['Chest','Helm','Legs']};
const DRV_ARMOUR=['Helm','Chest','Legs','Hand'];
const DRV_NOUN={Helm:'helm',Weapon:'weapon',Hand:'pair of gloves',Chest:'chestpiece',Legs:'set of leg guards',Accessory:'accessory'};
function drvNoun(slot){return DRV_NOUN[slot]||String(slot).toLowerCase();}
const DRV_NEXT={Warrior:['Knight','Rogue'],Knight:['Warrior','Priest'],Ranger:['Rogue','Warrior'],Rogue:['Ranger','Warrior'],Mage:['Priest','Rogue'],Priest:['Mage','Knight']};
function drvR(a,b){return a+Math.floor(Math.random()*(b-a+1));}
function drvWantedRarity(a){const base=a.lvl<20?1:a.lvl<45?2:a.lvl<70?3:4;return DRV_RANK[Math.min(4,base+(a.personality==='Mercenary'?1:0))];}
function drvMine(a){return !!a&&a.alive&&(a.joined||a.affiliation==='Brutus');}
function drvCompanyOf(p){return drvMine(p)?'Brutus':p.affiliation||null;}
function drvRollGear(a){const slots=a.personality==='Cautious'?DRV_ARMOUR:(DRV_SLOTS[a.cls]||ITEM_SLOTS);
 return{kind:'gear',slot:slots[Math.floor(Math.random()*slots.length)],rarity:drvWantedRarity(a),since:S.turn,progress:0};}
function drvRollClass(a){const opts=[...(DRV_NEXT[a.cls]||[])];const hot=S.event&&S.event.wants;
 if(hot&&hot!==a.cls&&(a.personality==='Ambitious'||a.personality==='Mercenary'))opts.push(hot,hot);
 const t=opts.filter(c=>c!==a.cls);if(!t.length)return null;return{kind:'class',target:t[Math.floor(Math.random()*t.length)],since:S.turn,progress:0,hot:t.includes(hot)&&hot};}
function drvPersonCandidates(a){const mine=drvCompanyOf(a),out=[];
 const add=(p,why,w)=>{if(p&&p.alive&&p.id!==a.id&&drvCompanyOf(p)&&drvCompanyOf(p)!==mine)out.push({p,why,w});};
 if(a.lover)add(person(a.lover),'lover',a.personality==='Loyal'?6:4);
 for(const l of a.links||[])if(l.kind==='ally')add(person(l.id),'ally',a.personality==='Loyal'?4:2);
 if(a.personality==='Ambitious'||a.personality==='Proud'){const famous=S.agents.filter(p=>p.alive&&p.region===a.region&&(p.fame||0)>=40).sort((x,y)=>(y.fame||0)-(x.fame||0)).slice(0,3);for(const p of famous)add(p,'fame',1.5);}
 for(const p of S.roster||[])if(!drvMine(a)&&(a.memory&&a.memory.Brutus||0)>10)add(p,'brutus',1);
 return out;}
function drvRollPerson(a){const c=drvPersonCandidates(a);if(!c.length)return null;let t=c.reduce((s,x)=>s+x.w,0)*Math.random();
 for(const x of c){if((t-=x.w)<0)return{kind:'person',target:x.p.id,why:x.why,since:S.turn,progress:0};}return null;}
function drvEnsure(a){if(!a||!a.alive)return[];a.drives=a.drives||[];a.drivesRetry=a.drivesRetry||{};
 const has=k=>a.drives.some(d=>d.kind===k),ok=k=>(a.drivesRetry[k]||0)<=S.turn;
 if(!has('gear')&&ok('gear')){if(Math.random()<DRV.gearChance)a.drives.push(drvRollGear(a));else a.drivesRetry.gear=S.turn+DRV.retryAfter;}
 if(!has('class')&&ok('class')){const d=Math.random()<(DRV.classChance[a.personality]||.15)?drvRollClass(a):null;if(d)a.drives.push(d);else a.drivesRetry.class=S.turn+DRV.retryAfter;}
 if(!has('person')&&ok('person')){const d=Math.random()<DRV.personChance?drvRollPerson(a):null;if(d)a.drives.push(d);else a.drivesRetry.person=S.turn+DRV.retryAfter;}
 return a.drives;}
function drvDone(a,d,retry){a.drives=a.drives.filter(x=>x!==d);a.drivesRetry[d.kind]=S.turn+(retry==null?DRV.retryAfter:retry);}
function drvTell(a,title,body,effect,kind,force){if(force||drvMine(a)||a.portrait!=null)note([a],title,body,effect,kind||'drama');else logAbout(a,'drive',`${a.name}: ${title}`,'',3);}
function drvRarityAtLeast(r,want){return DRV_RANK.indexOf(r)>=DRV_RANK.indexOf(want);}
function drvGearTick(a,d){
 if(drvMine(a)){const rack=equipRackOf(a.id)||{},it=rack[d.slot]&&(S.inventory||[]).find(i=>i.id===rack[d.slot]);
  if(it&&drvRarityAtLeast(it.rarity,d.rarity)){a.loyalty=Math.min(100,(a.loyalty??60)+8);a.affection=Math.min(100,(a.affection||50)+6);
   drvTell(a,`${a.name} got the ${drvNoun(d.slot)} ${pron(a).s} wanted.`,`You equipped ${it.name}.`,'Loyalty +8 · Affection +6','loyalty');drvDone(a,d);return;}
  const waited=S.turn-d.since;d.progress=Math.min(99,Math.round(waited/DRV.waitGrace*100));
  if(waited>DRV.waitGrace)a.affection=Math.max(0,(a.affection||50)-1);return;}
 const p=DRV.searchChance[a.personality]||DRV.searchChance.default;d.tries=(d.tries||0)+1;
 if(Math.random()<p){const it=generateItem(rollItemRarity(a.lvl),a.lvl,d.slot);
  if(drvRarityAtLeast(it.rarity,d.rarity)){a.bestFind=(!a.bestFind||it.value>a.bestFind.value)?it:a.bestFind;addFame(a,3);
   drvTell(a,`${a.name} found the ${drvNoun(d.slot)} ${pron(a).s} was after.`,`A ${ITEM_RARITY[it.rarity].label} ${it.name}, after ${d.tries} turn${d.tries===1?'':'s'} of looking.`,'Fame +3','drama');drvDone(a,d);}}}
function drvClassTick(a,d){if(a.cls===d.target){drvDone(a,d);return;}if(a.lvl<DRV.classMinLvl)return;
 const amb=(a.personality==='Ambitious'||a.personality==='Proud')?1.3:1;d.progress=Math.min(100,d.progress+Math.round(drvR(...DRV.classStep)*amb));
 if(d.progress>=100){const from=a.cls;a.cls=d.target;drvTell(a,`${a.name} retrains as a ${a.cls}.`,`Years as a ${from}, and now this. ${cap(pron(a).s)} keeps what ${pron(a).s} learned.`,`${from} → ${a.cls}`,drvMine(a)?'loyalty':'drama');drvDone(a,d,DRV.retryAfter*3);}}
function drvPersonTick(a,d){const t=person(d.target);
 if(!t||!t.alive){drvDone(a,d);return;}
 const theirs=drvCompanyOf(t),mine=drvCompanyOf(a);
 if(!theirs){drvDone(a,d);return;}
 if(theirs===mine){if(mine==='Brutus'){a.loyalty=Math.min(100,(a.loyalty??60)+10);drvTell(a,`${a.name} is glad ${t.name} is with you.`,`${cap(pron(a).s)} wanted to work beside ${t.name}, and now does.`,'Loyalty +10','loyalty');}drvDone(a,d);return;}
 const pull=drvMine(a)?Math.max(.1,1-(a.loyalty??60)/120):1;d.progress=Math.min(100,d.progress+Math.max(1,Math.round(drvR(...DRV.personStep)*pull)));
 if(d.progress<100)return;
 if(theirs==='Brutus'){a.memory=a.memory||{};remember(a,'Brutus',15,`wants to work beside ${t.name}`);a.affection=Math.min(100,(a.affection||50)+15);
  drvTell(a,`${a.name} wants in with your company.`,`${cap(pron(a).s)} wants to work beside ${t.name}.`,'Opinion of you +15 · Affection +15','drama',true);drvDone(a,d,DRV.retryAfter*2);return;}
 if(guildRosterSize(theirs)>=MAX_GUILD_ROSTER){d.progress=90;return;}
 if(mine)releaseToMarket(a,mine==='Brutus'?'Brutus':mine,-4,`left to work beside ${t.name}`);
 a.affiliation=theirs;a.joined=false;
 drvTell(a,`${a.name} signs with ${theirs}.`,`${cap(pron(a).s)} wanted to work beside ${t.name}.`,mine?`Left ${mine==='Brutus'?'your company':mine}`:'Signed',mine==='Brutus'?'departure':'drama');drvDone(a,d,DRV.retryAfter*2);}
function drvTick(){for(const a of S.agents||[]){if(!a.alive)continue;drvEnsure(a);
 for(const d of [...a.drives]){if(!a.alive)break;if(d.kind==='gear')drvGearTick(a,d);else if(d.kind==='class')drvClassTick(a,d);else drvPersonTick(a,d);}}}
// Odds for the status screen: chance a free agent finds the gear in one turn's search
function drvFindChance(a,d){const p=DRV.searchChance[a.personality]||DRV.searchChance.default;
 const lvl=resolveItemLevel(a.lvl),band=RARITY_BANDS.find(b=>lvl<=b.maxLvl)||RARITY_BANDS[RARITY_BANDS.length-1];
 const ent=Object.entries(band.w).filter(([,v])=>v>0),tot=ent.reduce((x,[,v])=>x+v,0);
 return p*ent.filter(([k])=>drvRarityAtLeast(k,d.rarity)).reduce((x,[,v])=>x+v,0)/tot;}
function drvEtaTurns(a,d){if(d.kind==='class'){if(a.lvl<DRV.classMinLvl)return null;const amb=(a.personality==='Ambitious'||a.personality==='Proud')?1.3:1;return Math.ceil((100-d.progress)/(4*amb));}
 if(d.kind==='person'){const pull=drvMine(a)?Math.max(.1,1-(a.loyalty??60)/120):1;return Math.ceil((100-d.progress)/Math.max(1,6*pull));}return null;}
const drvEndBase=endTurn;
endTurn=function(){const before=S.turn;const r=drvEndBase.apply(this,arguments);if(S.turn!==before){try{drvTick();}catch(e){console.error(e);}render();saveLiving();}return r;};
