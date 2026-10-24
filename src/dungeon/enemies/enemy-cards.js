/* Enemy cards (Robert, 2026-09-17, locked): EVERY enemy uses cards. 40-card enemy-only decks,
   same card grammar as Brutus (light / medium / heavy, energy cost, windup / active / recovery).
   There is no separate enemy ability system and no magic system: a Cultist's spells are cards.
   How it works in the dungeon:
     - each enemy with a deck shuffles it and holds a hand of 3
     - when it is ready to strike it plays the best-fitting AFFORDABLE card from its hand
       (target stunned or drained: heavier; itself hurt: quicker), pays the cost, draws a new one
     - cost is on Brutus's scale (light 2, medium 5, heavy 9, finisher +2) and scales to the
       enemy's own bar, so an enemy cannot spam heavy cards
     - an enemy that cannot afford anything waits a beat and regenerates
     - enraged enemies play recklessly: their hardest card in hand, whatever it costs
     - a card may carry one rider: drain N (energy off the target) or shove N (knockback)
   Kinds with no deck (Grazer) keep the old attack pick.
   Decks for Zombie, Cultist and Dire Hound are ready here but those kinds cannot spawn until
   their sprites exist (art lane). Cultist ranged play needs an approach rule that is not built.
   Source text must stay free of double quotes, backticks, backslashes, dollar signs and
   apostrophes. No elemental names anywhere. */
const EC_HAND=3, EC_TIER_COST={light:2,medium:5,heavy:9};
const EC_TIMING={light:{a:120,r:350},medium:{a:140,r:300},heavy:{a:180,r:450}};
// [name, tier, dmg, windup ms, range, copies, rider, text]
const EC_DECKS={
 skulker:[
  ['Gutter Jab','light',7,480,2.0,3,null,'A quick, mean jab.'],
  ['Slip and Stab','light',8,550,2.0,3,null,'In and out before you answer.'],
  ['Nick','light',6,420,2.0,3,null,'Barely a cut. Very fast.'],
  ['Skitter Cut','light',9,600,2.0,3,null,'Scuttles sideways, then cuts.'],
  ['Rake','light',7,520,2.0,3,'drain 2','Scratches at your footing.'],
  ['Low Slash','light',8,540,2.0,3,null,'Aimed at the knees.'],
  ['Cheap Shot','light',8,560,2.0,3,'drain 3','Takes the wind out of you.'],
  ['Opportunist','medium',14,800,2.0,3,null,'Waits for you to overreach.'],
  ['Double Time','medium',15,850,2.0,3,null,'Two steps and a stab.'],
  ['Lunging Thrust','medium',16,900,2.4,3,null,'Longer than it looks.'],
  ['Wild Swing','medium',14,820,2.0,3,'shove 0.6','All elbows.'],
  ['Pounce','heavy',22,1500,2.2,3,null,'Leaps, and it shows.'],
  ['Death Rattle','heavy',24,1400,2.2,3,null,'Everything it has, once.'],
  ['Last Gasp','heavy',28,1600,2.2,1,null,'Finisher. A desperate blow.']
 ],
 brute:[
  ['Club Tap','light',8,600,2.0,3,null,'Almost polite.'],
  ['Backhand','light',9,650,2.0,3,'shove 0.5','Swatted aside.'],
  ['Stomp','light',7,700,2.0,3,'drain 3','The floor shakes under you.'],
  ['Gut Punch','light',9,620,2.0,3,'drain 2','Knocks the breath out.'],
  ['Shoulder Check','medium',15,1000,2.0,3,'shove 1.0','Bulls through the line.'],
  ['Sweeping Blow','medium',16,1000,2.4,3,null,'A wide arc.'],
  ['Flurry of Fists','medium',14,900,2.0,3,null,'More than one fist.'],
  ['Cleaving Arc','medium',17,1050,2.5,3,null,'Reaches further than it should.'],
  ['Haymaker','heavy',22,1500,2.2,3,null,'Telegraphed. Hard.'],
  ['Overhead Smash','heavy',26,1700,2.2,3,null,'Straight down.'],
  ['Ground Pound','heavy',20,1400,2.2,3,'drain 4','Rattles everything loose.'],
  ['Skull Rattler','heavy',24,1550,2.2,3,'drain 5','Rings your head like a bell.'],
  ['Plant Feet','heavy',26,1300,2.2,3,'brace','Braced for two hits. Costs the Brute dearly.'],
  ['Bone Breaker','heavy',32,1900,2.2,1,null,'Finisher. Slow and final.']
 ],
 stalker:[
  ['Snap','light',7,480,2.0,3,null,'A snap of the jaw.'],
  ['Hamstring','light',8,520,2.0,3,'drain 2','Goes for the legs.'],
  ['Tail Bite','light',8,540,2.0,3,null,'Takes what is exposed.'],
  ['Rake and Retreat','light',9,600,2.0,3,null,'Hits, then gone.'],
  ['Lash','light',7,450,2.0,3,null,'Quick and thin.'],
  ['Steady Cut','medium',14,850,2.0,3,null,'No hurry. It never loses you.'],
  ['Pursuit Strike','medium',15,800,2.4,3,null,'Closes the gap mid-swing.'],
  ['Hunter Mark','medium',13,900,2.0,3,'drain 4','Picks a spot and keeps hitting it.'],
  ['Run Down','medium',16,950,2.0,3,'shove 0.8','Hits you from behind.'],
  ['Hard Charge','medium',17,1000,2.0,3,'shove 1.2','Drives you back.'],
  ['Throat Grab','heavy',22,1450,2.2,3,null,'Goes for the neck.'],
  ['Patient Blow','heavy',23,1500,2.2,3,null,'Waited a long time for this.'],
  ['Pin Down','heavy',20,1400,2.2,3,'drain 5','Pins and drains.'],
  ['Quarry End','heavy',30,1700,2.2,1,null,'Finisher. Done tracking.']
 ],
 zombie:[
  ['Grasp','light',8,800,2.0,3,null,'Cold fingers.'],
  ['Groan Slap','light',7,750,2.0,3,null,'More noise than force.'],
  ['Rotten Claw','light',9,850,2.0,3,null,'Rakes with what is left of the nails.'],
  ['Plague Breath','light',6,900,2.0,3,'drain 4','The smell alone takes your strength.'],
  ['Shamble Swing','medium',15,1200,2.0,3,null,'A slow, heavy arm.'],
  ['Clumsy Lunge','medium',16,1300,2.2,3,null,'Falls forward. Still hurts.'],
  ['Dead Weight','medium',17,1250,2.0,3,'shove 0.7','Leans into you.'],
  ['Gnaw','medium',14,1100,2.0,3,'drain 3','Latches on.'],
  ['Mob Rush','medium',15,1150,2.0,3,null,'Not alone for long.'],
  ['Crushing Hug','heavy',22,1800,2.0,3,null,'It means it.'],
  ['Boneless Slam','heavy',25,1900,2.2,3,null,'Everything at once.'],
  ['Relentless','heavy',24,1700,2.2,3,null,'It does not stop.'],
  ['Drag Down','heavy',21,1600,2.0,3,'drain 5','Pulls you to the floor.'],
  ['Final Moan','heavy',28,2000,2.2,1,null,'Finisher. A last, terrible effort.']
 ],
 cultist:[
  ['Hex Bolt','light',7,600,5.0,3,null,'A little curse, thrown.'],
  ['Ruin Dart','light',8,650,5.0,3,null,'Small and spiteful.'],
  ['Withering Touch','light',6,550,4.0,3,'drain 3','Saps your wind.'],
  ['Dagger Slip','light',8,500,2.0,3,null,'Not all of it is spells.'],
  ['Spite Lance','medium',15,1000,6.0,3,null,'A hard line of malice.'],
  ['Branded Sigil','medium',14,950,4.0,3,'drain 3','Marks you and drains you.'],
  ['Chain Hex','medium',13,900,5.0,3,null,'Jumps between the careless.'],
  ['Gloom Veil','medium',12,900,4.0,3,'drain 5','A weight settles on you.'],
  ['Dread Whisper','medium',11,850,5.0,3,'drain 6','Tells you what you fear.'],
  ['Rite Bolt','heavy',22,1500,6.0,3,null,'A prepared bolt. Slow, bright, dangerous.'],
  ['Calamity','heavy',26,1800,5.0,3,null,'Everything the cult owns.'],
  ['Sacrificial Blow','heavy',20,1400,2.0,3,null,'Costs the Cultist, costs you more.'],
  ['Mantle of Dread','heavy',18,1300,4.0,3,'drain 7','Fear made into weight.'],
  ['Rite of Ruin','heavy',32,2000,6.0,1,null,'Finisher. The whole ritual.']
 ],
 hound:[
  ['Snap','light',7,420,2.0,3,null,'Teeth together.'],
  ['Quick Bite','light',8,450,2.0,3,null,'Gone before you flinch.'],
  ['Worry','light',6,400,2.0,3,'drain 2','Never lets go of a sleeve.'],
  ['Nip and Dodge','light',8,480,2.0,3,null,'Bites, then circles.'],
  ['Flank Bite','light',9,500,2.0,3,null,'From the side.'],
  ['Pounce','medium',15,750,2.6,3,'shove 0.8','Hits you chest-first.'],
  ['Rending Bite','medium',16,800,2.0,3,null,'Does not let go.'],
  ['Savage Shake','medium',14,820,2.0,3,'drain 4','Shakes you like a rag.'],
  ['Run Down','medium',15,780,2.4,3,null,'Fast enough to catch anything.'],
  ['Howling Rush','medium',17,900,2.0,3,null,'The howl is part of it.'],
  ['Takedown','heavy',22,1300,2.2,3,'shove 1.2','Puts you on the ground.'],
  ['Throat Lunge','heavy',24,1400,2.5,3,null,'Straight for the neck.'],
  ['Pack Fury','heavy',21,1250,2.2,3,null,'It thinks it is a pack.'],
  ['Maul','heavy',30,1600,2.2,1,null,'Finisher. Everything it has.']
 ],
 boss:[
  ['Warden Rap','light',9,600,2.0,3,null,'A knock for attention.'],
  ['Overseer Lash','light',10,650,2.0,3,'drain 3','Keeps you moving.'],
  ['Contempt','light',10,600,2.0,3,null,'Barely looks at you.'],
  ['Cold Shoulder','medium',17,1000,2.0,3,'shove 1.0','Turns you out.'],
  ['Heel of the Law','medium',18,1050,2.0,3,null,'Stamped, not struck.'],
  ['Edict','medium',16,950,2.0,3,'drain 5','Your orders are changed.'],
  ['Order in Court','medium',18,1050,2.5,3,null,'The room is brought to order.'],
  ['Cross Examination','medium',17,1000,2.0,3,'drain 4','Every answer costs you.'],
  ['Sentence','heavy',26,1500,2.2,3,null,'Handed down.'],
  ['Gavel Fall','heavy',28,1600,2.2,3,null,'It is final.'],
  ['Hard Time','heavy',24,1450,2.2,3,'drain 6','Long and grinding.'],
  ['Lockdown','heavy',25,1500,2.2,3,'shove 1.0','No way out.'],
  ['Hold the Line','heavy',26,1300,2.2,3,'brace','Braced for two hits. Costs the Overseer dearly.'],
  ['Verdict','heavy',36,2000,2.2,1,null,'Finisher. There is no appeal.']
 ]
};
function ecRider(s){if(!s)return null;const p=String(s).split(' ');return p[0]==='brace'?{kind:'brace',n:0}:{kind:p[0],n:Number(p[1])||0};}
function ecCardFor(row){
 const tier=row[1], t=EC_TIMING[tier], copies=row[5], rider=ecRider(row[6]);
 const base=EC_TIER_COST[tier]+(copies===1?2:0);
 const card={name:row[0],tier:tier,dmg:row[2],windup:row[3],active:t.a,recovery:t.r,range:row[4],armorHits:0,cost:base,rider:rider,text:row[7],card:true};
 if(rider&&rider.kind==='brace'){card.resolute=true;card.armorHits=2;card.energyCost=40;}
 return card;
}
function ecBuildDeck(kind){
 const rows=EC_DECKS[kind]; if(!rows)return null;
 const out=[]; for(const row of rows){const c=ecCardFor(row);for(let i=0;i<row[5];i++)out.push(c);}
 return out;
}
function ecShuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;}
function ecDraw(e){
 if(!e.ecDeck.length){e.ecDeck=ecShuffle(e.ecDiscard.splice(0));}
 return e.ecDeck.length?e.ecDeck.pop():null;
}
function ecSetup(e){
 if(e.ecReady)return !!e.ecDeck;
 e.ecReady=true;
 const d=ecBuildDeck(e.kind); if(!d){e.ecDeck=null;return false;}
 e.ecDeck=ecShuffle(d); e.ecDiscard=[]; e.ecHand=[];
 for(let i=0;i<EC_HAND;i++){const c=ecDraw(e);if(c)e.ecHand.push(c);}
 return true;
}
function ecScaledCost(e,c){return c.resolute?c.energyCost+10:c.cost*(e.maxEnergy/20);}
function ecReserve(e){return e.maxEnergy*0.15;}
function ecAffordable(e,c){return c.resolute?e.energy>=c.energyCost+10:(e.energy-ecScaledCost(e,c))>=ecReserve(e);}
function ecWeight(e,c){
 let w=1; const tg=e.target;
 if(tg&&(tg.stunned||tg.downed))w*=c.tier==='heavy'?2.5:c.tier==='medium'?1.3:0.6;
 if(tg&&tg.maxEnergy&&tg.energy/tg.maxEnergy<0.3)w*=c.tier==='heavy'?1.5:1;
 if(e.maxHp&&e.hp/e.maxHp<0.5)w*=c.tier==='light'?1.5:c.tier==='heavy'?0.8:1;
 if(c.rider&&c.rider.kind==='drain'&&tg&&tg.energy/(tg.maxEnergy||1)>0.7)w*=1.3;
 return w;
}
function ecChoose(e){
 const hand=e.ecHand; if(!hand.length)return -1;
 if(e.enraged){let best=0;for(let i=1;i<hand.length;i++)if(hand[i].dmg>hand[best].dmg)best=i;return best;}
 const ok=[];let tot=0;
 for(let i=0;i<hand.length;i++){if(ecAffordable(e,hand[i])){const w=ecWeight(e,hand[i]);ok.push([i,w]);tot+=w;}}
 if(!ok.length)return -1;
 let r=Math.random()*tot; for(const o of ok){r-=o[1];if(r<=0)return o[0];}
 return ok[ok.length-1][0];
}
function ecCanPlay(e){
 if(!e.ecDeck)return true;
 if(e.enraged)return e.ecHand.length>0;
 return e.ecHand.some(c=>ecAffordable(e,c));
}
const ecPickBase=pickEnemyAttack;
pickEnemyAttack=function(e){
 try{
  if(e&&ecSetup(e)){
   const i=ecChoose(e);
   if(i>=0){
    const c=e.ecHand.splice(i,1)[0]; e.ecDiscard.push(c);
    const n=ecDraw(e); if(n)e.ecHand.push(n);
    if(!c.resolute&&!e.enraged){e.energy=Math.max(1,e.energy-ecScaledCost(e,c));}
    if(c.tier!=='light'&&typeof logMsg==='function')logMsg(e.name+' readies '+c.name+'.');
    return Object.assign({},c);
   }
  }
 }catch(err){}
 return ecPickBase.apply(this,arguments);
};
const ecUpdateEnemyBase=updateEnemy;
updateEnemy=function(e,dt){
 try{
  if(e&&!e.downed&&!e.stunned&&e.aware&&e.phase==='idle'&&e.attackCd<=0&&ecSetup(e)&&!ecCanPlay(e))e.attackCd=250;
 }catch(err){}
 return ecUpdateEnemyBase.apply(this,arguments);
};
const ecLandHitBase=landHit;
landHit=function(attacker,target,hit){
 const r=ecLandHitBase.apply(this,arguments);
 try{
  const a=attacker&&attacker.side==='enemy'?attacker.attack:null;
  if(r&&r.dealt>0&&a&&a.rider&&a.name===hit.name&&!target.downed){
   const rd=a.rider;
   if(rd.kind==='drain'&&rd.n>0)drainEnergy(target,incomingDrain(target,rd.n));
   else if(rd.kind==='shove'&&rd.n>0)applyKnockback(target,attacker.x,attacker.z,rd.n,false);
  }
 }catch(err){}
 return r;
};
