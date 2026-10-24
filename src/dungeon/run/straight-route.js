/* Boss pacing (Muse playtest 2026-10-12: "never found the boss — 15 minutes across 4 entries").
   Each floor is a 3x3 grid joined by a random spanning tree, so the route from the entrance
   (west middle) to the stair room (east middle) could wind through most of the floor.
   Playtest default: the middle row is always joined — entrance → rest area → stair room — so the
   way down is a straight walk east on every floor and the boss is reachable in a few minutes.
   The rest of the floor (chests, hidden chamber, platform, loops, pits) is still random.
   Set SPINE_ON=false to go back to the old layout. */
const SPINE_ON=true;
const SPINE_EDGES=[[3,4],[4,5]];
const spShuffleBase=shuffle;
shuffle=function(a){const r=spShuffleBase.apply(this,arguments);
 if(SPINE_ON&&Array.isArray(r)&&r.length&&r.every(e=>Array.isArray(e)&&e.length===3&&(e[2]==='E'||e[2]==='S'))){
  const isSpine=e=>SPINE_EDGES.some(([i,j])=>e[0]===i&&e[1]===j);
  const spine=r.filter(isSpine);if(spine.length){const rest=r.filter(e=>!isSpine(e));r.length=0;r.push(...spine,...rest);}}
 return r;};
// The stairway down is drawn bright on the minimap once you can see it (same visibility rule as
// any passage: one end visited), with a ▼ on it, so "where's the way down" has a visible answer.
const spDrawMinimapBase=drawMinimap;
drawMinimap=function(){const r=spDrawMinimapBase.apply(this,arguments);
 try{if(!brutus||!sectors)return r;const here=sectorById(brutus.sectorId);if(!here)return r;
  const scale=4.2,cx=mm.width/2,cy=mm.height/2,ca=Math.cos(-brutus.facing),sa=Math.sin(-brutus.facing);
  const ts=(x,z)=>{const dx=(x-brutus.x)*scale,dz=(z-brutus.z)*scale;return{sx:cx+(dx*ca-dz*sa),sy:cy+(dx*sa+dz*ca)};};
  for(const s of sectors){if(s.kind!=='connector'||!s.stepped||s.floor!==here.floor)continue;
   const ends=s.links.map(l=>sectorById(l.to)).filter(Boolean);if(!ends.some(e=>e.floor!==s.floor))continue; // inter-floor stair only
   if(!s.links.some(l=>visitedSectors.has(l.to)))continue;
   mmx.fillStyle='#e8c46acc';mmx.beginPath();s.poly.forEach((p,i)=>{const t=ts(p.x,p.z);i?mmx.lineTo(t.sx,t.sy):mmx.moveTo(t.sx,t.sy);});mmx.closePath();mmx.fill();
   const c=ts(s.centroid.x,s.centroid.z);mmx.fillStyle='#fff';mmx.font='bold 11px sans-serif';mmx.textAlign='center';mmx.textBaseline='middle';mmx.fillText('▼',c.sx,c.sy);}
 }catch(e){}
 return r;};
