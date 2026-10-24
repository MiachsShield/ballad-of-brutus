/* One deck choice, on the Deploy screen (Muse playtest 2026-10-12: "deck chosen twice").
   The Deploy screen used to list both decks as previews and the dungeon then asked again.
   Now the Deploy screen is where you pick: two buttons, last pick remembered (Warrior to start).
   The pick rides to the dungeon on Brutus's loadout (loadout.deck), and the dungeon skips its own prompt. */
const DK_DECKS=['Warrior','Priest'];
function dkDeck(){return DK_DECKS.includes(S.deckChoice)?S.deckChoice:'Warrior';}
const dkBaseLoadout=derivedLoadout;
derivedLoadout=function(whoId){const l=dkBaseLoadout.apply(this,arguments);if(l&&(whoId==null||whoId==='brutus'))l.deck=dkDeck();return l;};
function dkPatchDeploy(){
 if(!S.showDeploy)return;const body=$('deployBody');if(!body)return;
 const card=[...body.querySelectorAll('.statCard')].find(c=>/Choose your deck/.test(c.querySelector('.name')?.textContent||''));if(!card)return;
 card.querySelector('.name').textContent='Deck';
 const row=document.createElement('div');row.className='dk-row';row.style.cssText='display:flex;gap:6px;margin-bottom:6px';
 const blurb={Warrior:'pressure & disruption',Priest:'healing & protection'};
 for(const d of DK_DECKS){const b=document.createElement('button');b.dataset.dkDeck=d;b.type='button';b.style.flex='1';
  if(d===dkDeck()){b.className='primary';b.setAttribute('aria-pressed','true');}else b.setAttribute('aria-pressed','false');
  b.innerHTML=`${d}<br><span style="font-size:10px;opacity:.75">${blurb[d]}</span>`;row.appendChild(b);}
 card.querySelector('.name').after(row);
 // keep only the chosen deck's card list, still collapsible
 card.querySelectorAll('details').forEach(det=>{const s=det.querySelector('summary');if(!s)return;if(!s.textContent.startsWith(dkDeck()))det.remove();else s.textContent=`${dkDeck()} card list · 40 cards + equipment`;});
}
const dkRenderBase=render;
render=function(){const r=dkRenderBase.apply(this,arguments);dkPatchDeploy();return r;};
(function(){const body=$('deployBody');if(!body)return;body.addEventListener('click',ev=>{const b=ev.target.closest('[data-dk-deck]');if(!b)return;S.deckChoice=b.dataset.dkDeck;render();});})();
