const { chromium } = require('playwright');const path=require('path');const fs=require('fs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function boot(b){
 const p=await b.newPage({viewport:{width:1400,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve('inst.html'));await p.waitForTimeout(2500);
 const w=p.frames().find(f=>f.url()==='about:srcdoc');
 await w.click('text=Choose an expedition');await p.waitForTimeout(800);
 (await w.$$('text=Take contract'))[0].click();await p.waitForTimeout(800);
 await w.click('text=Descend');await p.waitForTimeout(3500);
 return {p,d:p.frames()[2],errs};
}
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||undefined,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const out=[];
 for(const cls of ['Priest','Warrior']){
  const {p,d,errs}=await boot(b);
  await d.evaluate(c=>__T(`chooseCardDiscipline('${c}');
    window.__freeze=setInterval(()=>{ for(const a of allies){a.attackCd=99999;} for(const e of enemies){e.attackCd=99999;} },50);`),cls);
  const ids=await d.evaluate(c=>__T(`APPROVED_CARDS.filter(r=>r.class==='${c}'&&r.dmg>0).map(r=>r.id)`),cls);
  for(const id of ids){
   const pre=await d.evaluate(id=>__T(`(function(){
     let e=enemies.find(x=>x.kind==='skulker')||enemies[0];
     for(const o of enemies){ if(o!==e){o.x=brutus.x+300;o.z=brutus.z+300;o.aware=false;o.sectorId=-5;} }
     if(e.downed){e.downed=false;e.phase='idle';e.attack=null;e._killLogged=false;}
     delete e.cardState; e.stunned=false; e.maxHp=500; e.hp=500; e.energy=e.maxEnergy; e.speed=0; e.phase='idle'; e.attack=null;
     e.sectorId=brutus.sectorId; e.x=brutus.x; e.z=brutus.z-1.4; e.aware=true;
     brutus.hp=brutus.maxHp; brutus.energy=20; brutus.commitCard=null; brutus.phase='idle'; brutus.stunned=false; brutus.recoveringUntil=0; brutus.lunging=false; delete brutus.cardState;
     hand[0]='${id}';
     const card=CARDS['${id}']; const pl=cardPlayable(card);
     const r={name:card.name,ok:pl.ok,why:pl.why||'',cost:balancedCost(card,pl.target),listed:card.dmg,startup:card.startup,recovery:card.recovery,e0:e.hp,eid:e.id,t0:now()};
     r.played=pl.ok?playSlot(0):false; r.enAfter=brutus.energy; return r;})()`),id);
   let hitAt=null;
   for(let t=0;t<30;t++){ await sleep(100); const h=await d.evaluate(eid=>__T("(function(){const e=enemies.find(x=>x.id==="+JSON.stringify(eid)+");return [e.hp,now(),brutus.phase];})()"),pre.eid); if(h[0]<pre.e0&&hitAt===null){hitAt=Math.round(h[1]-pre.t0);} pre.last=h; }
   pre.dealt=pre.e0-pre.last[0]; pre.hitMs=hitAt; out.push({cls,id,...pre});
   process.stdout.write('.');
  }
  out.push({cls,errs});
  await p.close();
 }
 fs.writeFileSync('clean.json',JSON.stringify(out,null,1));console.log('done');await b.close();
})();
