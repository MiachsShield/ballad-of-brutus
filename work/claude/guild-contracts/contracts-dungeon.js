// Guild contracts — dungeon side. Guests named in the contract fight beside Brutus for this
// expedition only, on top of the two companions. Same combatant model as companions.
const gcInitParty=initParty;
initParty=function(){
 gcInitParty();
 const guests=(contract&&Array.isArray(contract.guests))?contract.guests.slice(0,2):[];
 if(!guests.length)return;
 const e=sectors[0],c=e.centroid;
 guests.forEach((m,k)=>{
  const i=allies.length,arch=ALLY_ARCHETYPES[m.cls]||ALLY_ARCHETYPES.Ranger;
  const lvlScale=1+Math.max(0,(m.lvl||10)-10)*0.012;
  const hp=Math.round(arch.hp*lvlScale),en=Math.round(arch.energy*lvlScale);
  allies.push(makeCombatant({
   id:m.id,side:'ally',name:m.name,glyph:arch.glyph,cls:m.cls,figKind:arch.fig,
   x:c.x+(k===0?-2.0:2.0),z:c.z+2.0,sectorId:e.id,
   hp,maxHp:hp,energy:en,maxEnergy:en,speed:ALLY_SPEED*arch.speedMult,
   mode:'follow',path:null,pathAge:0,slot:i,lvl:m.lvl||10,portrait:m.portrait,guest:true,guestGuild:m.guild||'',
   prof:Object.assign({atk:1,def:1,armor:0,control:0,ambush:1,sustain:0,blind:0,buff:1,crit:0,support:0,aoe:1,duelist:1},m.profile||{}),
   armorLeft:Math.round((m.profile&&m.profile.armor)||0),abilityRegen:0,
   ranged:Object.assign({},arch.ranged,{dmg:Math.round(arch.ranged.dmg*lvlScale)}),
  }));
 });
 logMsg(`${guests.map(g=>g.name).join(' and ')} ${guests.length>1?'join':'joins'} under contract${guests[0].guild?' from '+guests[0].guild:''}.`,'good');
};
const gcPartyCards=buildPartyCards;
buildPartyCards=function(){
 gcPartyCards();
 for(const a of allies){if(!a.guest)continue;const nm=$('m_'+a.id)?.querySelector('.nm');if(nm&&!nm.dataset.gc){nm.dataset.gc='1';nm.textContent+=' · guest';}}
};
// Guests trail behind the two companions in corridors. The default trail gap grows with slot
// (2 per slot), which put a fourth companion past the regroup distance (7.2) and made them flip
// between follow and regroup, announcing "falls back to you" each time.
const gcFormation=formationTarget;
formationTarget=function(a){
 if(a&&a.guest){const cs=sectorById(brutus.sectorId);if(cs&&cs.kind==="connector")return trailPointBehind(FOLLOW_GAP*2+(a.slot-1));}
 return gcFormation(a);
};
