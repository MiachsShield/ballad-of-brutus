// node tests/doom-turning.test.cjs
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'../src/dungeon/movement/doom-turning.js'),'utf8');
// no characters that break the composed (escaped, string-embedded) dungeon script
assert(!/[`\\$]/.test(src.replace(/\/\*[\s\S]*?\*\//,'')),'module must avoid backticks, backslashes and dollar signs');
assert(!/"/.test(src.replace(/\/\*[\s\S]*?\*\//,'')),'module must use single quotes only');
function make(base){const c={brutus:{turn:0,stunned:false,downed:false,facing:0},seen:[]};
 c.updateBrutus=base||function(dt){c.seen.push(c.brutus.turn);};
 vm.createContext(c);vm.runInContext(src,c);return c;}
const TURN=145,rate=c=>c.seen[c.seen.length-1]*TURN;
// a tap (a few frames) stays at 1x: fine aiming
{const c=make();c.brutus.turn=1;for(let i=0;i<4;i++)c.updateBrutus(1/60);assert(c.seen.every(v=>v===1),'tap stays 1x');assert.equal(c.brutus.turn,1,'input restored');}
// held: 1x through the delay, then smooth ramp, capped at 1.8x
{const c=make();c.brutus.turn=1;for(let i=0;i<90;i++)c.updateBrutus(1/60);
 assert.equal(c.seen[0],1);
 const mid=c.seen[Math.round((0.10+0.075)*60)];assert(mid>1.2&&mid<1.6,'mid-ramp '+mid);
 assert(Math.abs(c.seen[89]-1.8)<1e-9,'capped at 1.8x, got '+c.seen[89]);
 for(let i=1;i<c.seen.length;i++)assert(c.seen[i]>=c.seen[i-1],'ramp never dips');
 assert(Math.abs(rate(c)-261)<0.5,'261 deg/s at full');assert.equal(c.brutus.turn,1);}
// direction preserved; release resets; a half-tilted stick never ramps
{const c=make();c.brutus.turn=-1;for(let i=0;i<60;i++)c.updateBrutus(1/60);assert(c.seen[59]<-1.7);
 c.brutus.turn=0;c.updateBrutus(1/60);assert.equal(c.seen[60],0);
 c.brutus.turn=1;c.updateBrutus(1/60);assert.equal(c.seen[61],1,'release then re-press restarts at 1x');}
{const c=make();c.brutus.turn=0.5;for(let i=0;i<90;i++)c.updateBrutus(1/60);assert(c.seen.every(v=>v===0.5),'partial stick never ramps');}
// stunned or downed: no ramp, and turn untouched
{const c=make();c.brutus.turn=1;c.brutus.stunned=true;for(let i=0;i<90;i++)c.updateBrutus(1/60);assert(c.seen.every(v=>v===1));
 const d=make();d.brutus.turn=1;d.brutus.downed=true;for(let i=0;i<90;i++)d.updateBrutus(1/60);assert(d.seen.every(v=>v===1));}
// an error inside the base update still restores the input
{const c=make(function(){throw Error('boom');});c.brutus.turn=1;
 for(let i=0;i<60;i++){try{c.updateBrutus(1/60);}catch(e){}}assert.equal(c.brutus.turn,1);}
console.log('PASS: turn is 1x on a tap, ramps to 1.8x (145 -> 261 deg/s) after a 0.10 s hold over 0.15 s, resets on release, never ramps on a partial stick, stun or down; input always restored; module avoids characters that break the embedded script');
