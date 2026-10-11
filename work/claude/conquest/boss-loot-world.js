/* Boss loot (Robert, 2026-10-11): standard MMO boss-and-loot conventions, and
   "boss loot is always a cut above generic loot in that level". Granted when an expedition
   returns with the boss chest looted (which needs the warden dead).
   A cut above, concretely, for the same level context as the generic exit drop:
     - rarity: a generic roll at that level, raised one tier, and never below that level's
       usual (most likely) generic rarity;
     - stats: every positive stat strictly higher than the same slot, level and rarity
       would give (x1.15, at least +1);
     - always elemental (a proc), in the dungeon's tier-set element.
   Tier sets: each dungeon's warden drops one element, so farming it builds that 2pc bonus.
   Signature drop: one named item per dungeon, 15% per clear, +10% per miss (pity), drops once.
   First clear: the first conquest of each dungeon gives one extra boss drop.
   Lockout: the conquered/inert state is shown as a raid lockout (see conquest-world.js). */
const BL={statPremium:1.15,sigStatPremium:1.25,sigBase:0.15,sigStep:0.10};
const BL_TIERS=['common','fine','rare','enchanted','legendary'];
const BL_SETS={'The Gilded Sepulchre':'Holy','The Hollow Crown':'Shadow','The Thorn Cathedral':'Poison',
 'The Ashen Stair':'Fire','The Sunken Tribunal':'Frost','The Violet Fault':'Lightning','The Quiet House':'Shadow'};
const BL_SIGNATURES={'The Gilded Sepulchre':['Gilded Reliquary Ring','Accessory'],'The Hollow Crown':['The Hollow Crown','Helm'],
 'The Thorn Cathedral':['Thornwoven Vestments','Chest'],'The Ashen Stair':['Ashen Stair Greaves','Legs'],
 'The Sunken Tribunal':['Gavel of the Drowned Court','Weapon'],'The Violet Fault':['Faultlight Gauntlets','Hand'],
 'The Quiet House':['Key to the Quiet House','Accessory']};
function blState(){return S.bossLoot||(S.bossLoot={clears:{},misses:{},owned:{}});}
function blSetElement(name){
 if(BL_SETS[name])return BL_SETS[name];
 let h=0;for(const ch of String(name))h=(h*31+ch.charCodeAt(0))>>>0;return ELEMENTS[h%ELEMENTS.length];
}
function blBandMode(lvl){
 const L=resolveItemLevel(lvl),band=RARITY_BANDS.find(b=>L<=b.maxLvl)||RARITY_BANDS[RARITY_BANDS.length-1];
 return Object.entries(band.w).sort((a,b)=>b[1]-a[1])[0][0];
}
function blUp(r,n){return BL_TIERS[Math.min(BL_TIERS.length-1,BL_TIERS.indexOf(r)+(n==null?1:n))];}
function blBossRarity(lvl){
 const up=blUp(rollItemRarity(lvl)),mode=blBandMode(lvl);
 return BL_TIERS.indexOf(up)>=BL_TIERS.indexOf(mode)?up:mode;
}
function blForge(item,el,premium){
 for(const k of Object.keys(item.stats)){const v=item.stats[k];if(v>0)item.stats[k]=Math.max(v+1,Math.round(v*premium));}
 const offense=(item.slot==='Weapon'||item.slot==='Hand'||item.slot==='Accessory');
 item.element=el;item.name=`${ELEMENT_ADJ[el]} ${item.baseName}`;
 item.proc={kind:offense?'offense':'defense',element:el,...(offense?OFFENSE_PROCS[el]:DEFENSE_PROCS[el])};
 if(item.grantedCard)item.grantedCard=item.slot==='Weapon'?{...WEAPON_CARDS[el]}:{...ACCESSORY_CARDS[el]};
 return item;
}
function blBossDrop(lvl,el,dname){
 const it=blForge(generateItem(blBossRarity(lvl),lvl),el,BL.statPremium);
 it.bossDrop=dname;it.value=Math.round(it.value*1.5);return it;
}
function blSignature(lvl,el,dname,mainRarity){
 const [name,slot]=BL_SIGNATURES[dname]||[`${dname} Heirloom`,'Accessory'];
 const it=blForge(generateItem(blUp(mainRarity),lvl,slot),el,BL.sigStatPremium);
 if((slot==='Weapon'||slot==='Accessory')&&!it.grantedCard)it.grantedCard=slot==='Weapon'?{...WEAPON_CARDS[el]}:{...ACCESSORY_CARDS[el]};
 it.name=name;it.signature=dname;it.bossDrop=dname;it.value=Math.round(it.value*2.5);return it;
}
// Same level context as the generic exit drop (rollDungeonLoot), so "that level" is like for like.
function blLevel(r){return 12+(r.deepestFloor||0)*16+(r.brutesBroken||0)*7+(r.secretsFound||0)*4;}
function blSigChance(dname){return Math.min(1,BL.sigBase+BL.sigStep*(blState().misses[dname]||0));}
function blRoll(dname,r){
 const st=blState(),lvl=blLevel(r),el=blSetElement(dname),items=[];
 const first=!st.clears[dname];st.clears[dname]=(st.clears[dname]||0)+1;
 const main=blBossDrop(lvl,el,dname);items.push(main);
 if(first){const extra=blBossDrop(lvl,el,dname);extra.firstClear=true;items.push(extra);}
 let sig=null;
 if(!st.owned[dname]){
  if(Math.random()<blSigChance(dname)){sig=blSignature(lvl,el,dname,main.rarity);items.push(sig);st.owned[dname]=true;st.misses[dname]=0;}
  else st.misses[dname]=(st.misses[dname]||0)+1;
 }
 for(const it of items)S.inventory.push(it);
 return {items,first,sig,el,lvl};
}
const blBaseResult=applyDungeonResult;
applyDungeonResult=function(r){
 const c=S.pendingDelve?S.activeContract:null;
 blBaseResult(r);
 if(!c||!r||r.initializationFailed||campaignEnded()||!r.bossChestLooted)return;
 const out=blRoll(c.name,r);
 const desc=out.items.map(it=>`${it.name} (${ITEM_RARITY[it.rarity].label}${it.signature?', signature':it.firstClear?', first clear':''})`).join(', ');
 const owned=blState().owned[c.name];
 note([],`Boss loot: ${c.name}`,`From the warden's hoard: ${desc}. ${out.el} set.`,
  out.sig?`Signature drop: ${out.sig.name}`:owned?'Signature already claimed':`Signature chance next clear: ${Math.round(blSigChance(c.name)*100)}%`,'dungeon');
 if(S.expeditionReport)S.expeditionReport.body+=` Boss loot: ${desc}.`;
 render();saveLiving();
};
