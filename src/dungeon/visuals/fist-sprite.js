// First-person weapon as a flat 2D sprite (Robert, 2026-10-12: "keep at 2d sprites ... bodies must
// be extremely readable ... sprites can't be visually noisy"). Replaces the 3D primitive sword.
// Drawn in code as a placeholder that follows the readability rules (one solid silhouette, a thick
// outline, two or three flat values per material, no texture) until real art exists.
// Default is Brutus's wrapped fist: the binding visual guide says he is a fistfighter whose near fist
// "owns the frame". WEAPON2D_STYLE='sword' restores a sword drawn the same way.
const WEAPON2D_STYLE='fist';
function w2Canvas(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
function w2Shape(g,path,fill,line){g.beginPath();path(g);g.closePath();g.fillStyle=fill;g.fill();g.lineWidth=line||8;g.lineJoin='round';g.strokeStyle='#17120e';g.stroke();}
function w2RR(g,x,y,w,h,r){g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);}
function w2DrawFist(g){
 // Composition: forearm enters from the bottom-right corner on a diagonal; the fist sits upper-left,
 // knuckles leading toward the screen centre. Reads as "arm + fist" from the silhouette alone.
 w2Shape(g,p=>{p.moveTo(320,250);p.lineTo(320,320);p.lineTo(250,320);p.lineTo(150,210);p.lineTo(205,165);},'#4a2e1a');
 g.fillStyle='#6a4428';g.beginPath();g.moveTo(300,232);g.lineTo(310,246);g.lineTo(200,180);g.lineTo(194,172);g.closePath();g.fill();
 g.save();g.translate(128,138);g.rotate(-0.62);
 w2Shape(g,p=>w2RR(p,-78,-58,150,112,30),'#e6dccb');                 // wrapped fist block
 g.fillStyle='#b9ad98';for(const x of [-36,-2,32])g.fillRect(x,-50,9,96);   // wrap bands, flat
 for(let i=0;i<4;i++)w2Shape(g,p=>p.arc(-56+i*34,-58,18,Math.PI,0),'#e6dccb',7); // knuckles lead
 w2Shape(g,p=>w2RR(p,-70,8,104,36,16),'#c48a62',7);                    // thumb across the front
 g.fillStyle='#9a6446';g.fillRect(-62,30,88,7);
 g.restore();
}
function w2DrawSword(g){
 w2Shape(g,p=>{p.moveTo(118,8);p.lineTo(142,8);p.lineTo(150,300);p.lineTo(110,300);},'#cfc9bd');
 g.fillStyle='#8d8a84';g.fillRect(132,30,10,262);
 w2Shape(g,p=>w2RR(p,60,296,140,30,10),'#9a7a3a');
 w2Shape(g,p=>w2RR(p,112,322,36,110,10),'#4a2e1a');
 w2Shape(g,p=>p.arc(130,446,22,0,Math.PI*2),'#9a7a3a');
}
function w2Build(camera){
 const fist=WEAPON2D_STYLE!=='sword';
 const tex=fist?w2Canvas(320,320,w2DrawFist):w2Canvas(256,480,w2DrawSword);
 const h=fist?0.3:0.42,w=fist?h:h*256/480;
 const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:0.05,depthTest:false,depthWrite:false,color:0xe8dfd2,fog:false});
 const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);plane.renderOrder=999;
 const g=new THREE.Group();g.add(plane);g.userData.w2={fist};camera.add(g);return g;
}
buildWeaponView=function(camera){return w2Build(camera);};
// 2D motion only (slide, roll, scale), so the flat sprite never turns edge-on. Same signals and
// timings as the old pose: windup, swing by weight, guard, stun, walk bob.
poseWeapon=function(w,t){
 const fist=w.userData.w2?.fist,b=brutus;
 const base=fist?{x:0.13,y:-0.115,z:-0.42,r:0}:{x:0.17,y:-0.2,z:-0.45,r:-0.35};
 let x=0,y=0,r=0,s=1;
 if(Math.abs(b.thrust)>0.1){y+=Math.sin(t*0.012)*0.008;x+=Math.cos(t*0.006)*0.006;}
 if(b.commitCard&&b.phase==='windup'){
  if(b.commitCard.resolute){y-=0.02;r+=0.05;s*=1.04;}
  else if(fist){x+=0.04;y-=0.05;r+=0.2;s*=0.92;}
  else{x+=0.05;y+=0.06;r+=0.55;}
 }
 const dur=swingKind==='heavy'?320:swingKind==='medium'?240:170,amp=swingKind==='heavy'?1.25:swingKind==='medium'?1:0.8;
 const k=(t-swingT)/dur;
 if(k>=0&&k<1){const e=Math.sin(k*Math.PI)*amp;
  if(fist){x-=0.13*e;y+=0.07*e;r-=0.25*e;s*=1+0.3*e;}
  else{x-=0.3*e;y+=0.02*e;r-=1.1*e;}
 }
 if(b.guardUntil>t){if(fist){x-=0.08;y+=0.05;r-=0.4;s*=1.05;}else{x-=0.12;y+=0.06;r-=1.2;}}
 if(b.stunned){y-=0.22;r+=0.5;}
 w.position.set(base.x+x,base.y+y,base.z);w.rotation.set(0,0,base.r+r);w.scale.setScalar(s);
};
