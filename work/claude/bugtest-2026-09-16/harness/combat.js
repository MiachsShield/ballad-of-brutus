const { chromium } = require('playwright');const path=require('path');const fs=require('fs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||undefined,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const report=[];
 const diffs=process.argv[2]?process.argv[2].split(','):['playtest','normal'];
 for(const diff of diffs) for(let run=0;run<3;run++){
  const p=await b.newPage({viewport:{width:1400,height:900}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve('inst.html'));await p.waitForTimeout(2500);
  const w=p.frames().find(f=>f.url()==='about:srcdoc');
  await w.click('text=Choose an expedition');await p.waitForTimeout(700);
  (await w.$$('text=Take contract'))[run%3].click();await p.waitForTimeout(700);
  await w.click('text=Descend');await p.waitForTimeout(3500);
  const d=p.frames()[2];
  const cls=run%2?'Warrior':'Priest';
  await d.evaluate(([c,df])=>__T(`difficulty='${df}'; for(const e of enemies){ const k=ENEMY_KINDS[e.kind]; if(k){ e.maxHp=Math.round(k.hp*DIFFICULTY['${df}'].hp); e.hp=e.maxHp; } } chooseCardDiscipline('${c}');
    window.__allyFire=[]; window.__firstCardAt=null; window.__logs=[];
    new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){ window.__logs.push([Math.round(now()),n.textContent]); }}).observe(logEl,{childList:true});
    true`),[cls,diff]);
  // pick nearest predator, wake it next to Brutus in same sector
  const r={diff,run,cls,encounters:[]};
  for(let enc=0;enc<3;enc++){
   const setup=await d.evaluate(()=>__T(`(function(){
     const e=enemies.find(x=>!x.downed&&x.role!=='herbivore'&&ENEMY_KINDS[x.kind]&&ENEMY_KINDS[x.kind].role==='predator')||enemies.find(x=>!x.downed);
     if(!e) return null;
     for(const a of allies){ a.x=brutus.x+0.8; a.z=brutus.z+1.5; a.sectorId=brutus.sectorId; }
     e.sectorId=brutus.sectorId; e.x=brutus.x; e.z=brutus.z-4.5; e.aware=false;
     brutus.hp=brutus.maxHp; brutus.energy=20; encounter.opened=false;
     window.__enc={eid:e.id,kind:e.kind,hp:e.maxHp,t0:now(),logStart:__logs.length}; return window.__enc; })()`));
   if(!setup) break;
   // observe 6s without playing any card: do allies attack?
   await sleep(6000);
   const pre=await d.evaluate(()=>__T(`({logs:__logs.slice(__enc.logStart).map(x=>x[1]), eHp:(enemies.find(x=>x.id===__enc.eid)||{}).hp, aware:(enemies.find(x=>x.id===__enc.eid)||{}).aware, opened:encounter.opened, allyPhases:allies.map(a=>a.phase)})`));
   // now fight: press keys 1-4 cycling for up to 25s, basic attack via 'g' fallback
   let stunSeen=0, swShown=0, cardsPlayed=0; const t0=Date.now();
   while(Date.now()-t0<25000){
     const st=await d.evaluate(()=>__T(`(function(){const e=enemies.find(x=>x.id===__enc.eid);
       if(e&&!e.downed&&dist(brutus,e)>1.8){ brutus.yaw=Math.atan2(-(e.x-brutus.x),-(e.z-brutus.z)); }
       return {edown:!e||e.downed, bdown:brutus.downed, stunned:brutus.stunned, wind:!document.getElementById('windCard').hidden, busy:isBrutusBusy(), hand:hand.map(id=>CARDS[id]&&cardPlayable(CARDS[id]).ok)};})()`));
     if(st.edown||st.bdown) break;
     if(st.stunned) stunSeen++; if(st.wind){ swShown++; await p.keyboard.press('f'); }
     if(!st.busy){ const i=st.hand.findIndex(x=>x); if(i>=0){ await d.evaluate(i=>__T('playSlot('+i+')'),i); cardsPlayed++; } else { await p.keyboard.press('g'); } }
     await sleep(250);
   }
   const post=await d.evaluate(()=>__T(`({logs:__logs.slice(__enc.logStart).map(x=>x[1]), edown:(enemies.find(x=>x.id===__enc.eid)||{downed:true}).downed, bHp:brutus.hp, bMax:brutus.maxHp, t:Math.round(now()-__enc.t0), allies:allies.map(a=>[a.name,a.hp,a.downed])})`));
   r.encounters.push({setup,pre,stunSeen,swShown,cardsPlayed,post});
   process.stdout.write('E');
  }
  // forced Second Wind check
  const sw=await d.evaluate(()=>__T(`(function(){ brutus.windReadyAt=0; triggerStun(brutus); const vis0=windReady(); updateCardUI&&updateCardUI(); return {stunned:brutus.stunned, windReady:vis0}; })()`));
  await sleep(500);
  sw.cardVisible=await d.evaluate(()=>!document.getElementById('windCard').hidden);
  const hp0=await d.evaluate(()=>__T('brutus.hp'));
  await d.click('#windCard').catch(()=>{}); await sleep(400);
  sw.after=await d.evaluate(()=>__T(`({stunned:brutus.stunned, energy:brutus.energy, hp:brutus.hp, hidden:document.getElementById('windCard').hidden})`)); sw.hp0=hp0;
  // card face check
  sw.faces=await d.evaluate(()=>[...document.querySelectorAll('img')].map(i=>[i.getAttribute('src')&&i.getAttribute('src').slice(0,60), i.naturalWidth]).filter(x=>x[0]&&x[0].includes('card-faces')).slice(0,6));
  r.secondWind=sw; r.errs=errs;
  report.push(r); fs.writeFileSync('combat_'+diffs.join('_')+'.json',JSON.stringify(report,null,1));
  await p.close();
 }
 console.log('\ndone');await b.close();
})();
