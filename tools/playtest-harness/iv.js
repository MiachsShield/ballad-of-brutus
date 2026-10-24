const { chromium } = require('playwright');const path=require('path');
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||undefined,args:['--use-gl=swiftshader']});
 const p=await b.newPage({viewport:{width:1400,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 await p.goto('file://'+path.resolve('build.html'));await p.waitForTimeout(2500);
 const w=p.frames().find(f=>f.url()==='about:srcdoc');
 const vis=async sel=>{for(const x of await w.$$(sel)) if(await x.isVisible()) return x; return null;};
 const endDis=async()=>{const e=await vis('button:has-text("End turn")');return e?await e.isDisabled():'none';};
 await w.click('text=People');await p.waitForTimeout(800);
 // Nessa Rook card: click its Recruit
 const recs=await w.$$('button:has-text("Recruit")'); let r=null;
 for(const x of recs){ const t=await x.evaluate(n=>n.closest('div')?.parentElement?.innerText||''); if(/Nessa Rook/.test(t)){r=x;break;} }
 r=r||recs[0]; await r.click(); await p.waitForTimeout(900);
 let body=await w.evaluate(()=>document.body.innerText);
 console.log('after recruit click:', (body.match(/question \d+ of \d+/)||['no-q'])[0], 'abandon?', /Abandon interview/.test(body), 'endTurnDisabled', await endDis());
 let guard=0; for(let i=0;i<14;i++){
   body=await w.evaluate(()=>document.body.innerText);
   const q=body.match(/question (\d+) of (\d+)/); if(!q){ console.log('interview closed'); break;}
   const ans=await w.$$eval('button',bs=>bs.filter(x=>x.offsetParent&&!x.disabled).map(x=>x.textContent.trim()));
   const ab=ans.indexOf('Abandon interview');
   const cand=ans.slice(Math.max(0,ab-4),ab).filter(t=>t.length>12);
   const cont=await vis('button:has-text("Continue")'); if(cont){ await cont.click(); await p.waitForTimeout(700); i--; if(++guard>30) break; continue; }
   console.log('Q',q[1],'/',q[2],'answers:',cand.length);
   if(!cand.length){ console.log('NO ANSWERS AVAILABLE — stall at', q[0]); await p.screenshot({path:'iv-stall.png'}); break; }
   await w.click(`button:has-text("${cand[cand.length-1].slice(0,25).replace(/"/g,'\\"')}")`); await p.waitForTimeout(700);
 }
 console.log('end state endTurnDisabled', await endDis());
 const ab=await vis('button:has-text("Abandon interview")'); if(ab){await ab.click();await p.waitForTimeout(600); console.log('after abandon endTurnDisabled', await endDis());}
 console.log(errs.join('\n'));await b.close();
})();
