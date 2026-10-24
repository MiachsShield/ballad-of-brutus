/* Doom-style turning (Robert, 2026-10-19: fighting a strafing enemy must not be frustrating because
   of the controls; "make it akin to Doom").
   Playtest round 4 (Muse): the clunkiest minute-to-minute thing was re-acquiring a moving enemy,
   turn then strafe then turn again, while it wound up a heavy. Cause in the code: Brutus turned at one
   fixed 145 deg/s, which is Doom's SLOW turn. At the 1.7 standoff a monster sidestepping or
   re-routing sweeps the view faster than that, so you could not keep it in front of you.
   Doom's turning has two speeds: a tap is a fine slow nudge for aiming, and holding the key ramps to
   about twice that. This does the same: a full-deflection turn held past a short delay ramps
   smoothly from 1x to 1.8x (145 -> 261 deg/s). Released, it drops straight back to 1x.
   Only Brutus's turn RATE changes. Facing stays manual and persistent, nothing aims for you, and
   walking, strafing, cards, targeting and every enemy and ally are untouched.
   Walls: already slide (tryMove falls back to each axis, and every sector edge is axis-aligned), so no
   change there. */
const DM_TURN_DELAY=0.10, DM_TURN_RAMP=0.15, DM_TURN_BONUS=0.8;  // seconds held before the ramp starts, seconds to full, extra speed at full (0.8 = 1.8x)
const dmUpdateBrutusBase=updateBrutus;
updateBrutus=function(dt){
 const b=brutus; let t=0, scaled=false;
 try{
  if(b&&!b.downed){
   t=b.turn||0;
   const held=Math.abs(t)>0.85&&!b.stunned;
   b.turnHold=held?(b.turnHold||0)+dt:0;
   if(held){const ramp=Math.min(1,Math.max(0,(b.turnHold-DM_TURN_DELAY)/DM_TURN_RAMP));
    if(ramp>0){b.turn=t*(1+DM_TURN_BONUS*ramp);scaled=true;}}
  }
 }catch(err){}
 try{return dmUpdateBrutusBase.apply(this,arguments);}
 finally{if(scaled)b.turn=t;}
};
