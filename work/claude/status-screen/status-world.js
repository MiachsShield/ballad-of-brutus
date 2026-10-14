/* Status screen (Robert, 2026-10-13: "Clicking on character should give status screen. There.
   Also make a proper status screen." "There" = Brutus's XP bar lives on it).
   Clicking Brutus (sidebar) or any of his companions (sidebar, guild card, Inspect, people list)
   opens their status screen. Everyone else still opens the public profile ("A person of interest").
   The screen shows what is actually true in the dungeon:
   - Brutus: HP 100 + gear, Energy 20 + gear, ATK/DEF % from gear, chosen deck, gear-granted cards,
     on-hit/on-defense effects.
   - Companions: HP/Energy from class and level (the dungeon's formula: class base x
     (1 + 0.012 per level above 10)), their class attack, and what their abilities change.
     Companion gear is listed, but the dungeon does not apply it yet (flagged on the screen). */
const ST_ARCH={ // copy of the dungeon's ALLY_ARCHETYPES numbers (dungeon frame, "const ALLY_ARCHETYPES")
 Mage:{hp:60,energy:90,move:'Firebolt',tier:'medium',windup:1100,recovery:800,dmg:17,cost:12},
 Ranger:{hp:52,energy:80,move:'Arrow',tier:'light',windup:600,recovery:500,dmg:9,cost:6},
 Rogue:{hp:50,energy:75,move:'Thrown Knife',tier:'light',windup:450,recovery:420,dmg:11,cost:7},
 Priest:{hp:58,energy:95,move:'Smite',tier:'medium',windup:950,recovery:750,dmg:13,cost:10},
 Warrior:{hp:78,energy:85,move:'Javelin',tier:'medium',windup:800,recovery:650,dmg:15,cost:9},
 Knight:{hp:92,energy:80,move:'Shield Bash',tier:'heavy',windup:900,recovery:800,dmg:19,cost:11}};
const ST_PROFILE_LINES=[['atk','Attack','x'],['def','Defense','x'],['armor','Armor','+'],['control','Control','%'],['ambush','Ambush','x'],['sustain','Sustain','%'],
 ['blind','Blind','%'],['buff','Party buff','x'],['crit','Critical','+%'],['support','Support','+'],['aoe','Area','x'],['duelist','Duelist','x']];
const ST_NEUTRAL={atk:1,def:1,armor:0,control:0,ambush:1,sustain:0,blind:0,buff:1,crit:0,support:0,aoe:1,duelist:1};
function stIsCompanion(a){return !!a&&a.alive&&a.joined&&(S.roster||[]).some(m=>m.id===a.id);}
function stFmtProfile(P){return ST_PROFILE_LINES.filter(([k])=>Math.abs((P[k]||0)-ST_NEUTRAL[k])>1e-6).map(([k,l,kind])=>{const v=P[k];
 const t=kind==='x'?`×${v.toFixed(2)}`:kind==='%'?`${Math.round(v*100)}%`:kind==='+%'?`+${Math.round(v*100)}%`:`+${Math.round(v*10)/10}`;return `<div><small>${l}</small><b>${t}</b></div>`;}).join('');}
function stBar(lvl,exp,top){const capped=lvl>=top,need=expToNext(lvl),have=Math.round(exp||0),pct=capped?100:Math.max(0,Math.min(100,have/need*100));
 return `<div class="st-xp"><div class="st-xp-top"><span>${capped?'Not getting any stronger':`XP ${have} / ${need}`}</span><span>${capped?'':`${need-have} to Lv ${lvl+1}`}</span></div>`
  +`<div class="st-xp-track"><div style="width:${pct.toFixed(1)}%"></div></div></div>`;}
function stGear(whoId){const rack=equipRackOf(whoId)||{};
 return `<div class="st-gear">${ITEM_SLOTS.map(slot=>{const it=rack[slot]&&(S.inventory||[]).find(i=>i.id===rack[slot]);
  if(!it)return `<div class="st-slot empty"><small>${slot}</small><span>Empty</span></div>`;
  const R=ITEM_RARITY[it.rarity]||{color:'inherit',label:it.rarity};
  return `<div class="st-slot"><small>${slot} · ${esc(R.label)}</small><b style="color:${R.color}">${esc(it.name)}</b>`
   +`${itemStatLine(it)?`<span>${esc(itemStatLine(it))}</span>`:''}${it.proc?`<span class="st-proc">${esc(it.proc.desc)}</span>`:''}`
   +`${it.grantedCard?`<span class="st-card">Card: ${esc(it.grantedCard.name)}</span>`:''}</div>`;}).join('')}</div>`;}
function stAbilities(a){const list=a.abilities&&a.abilities.length?a.abilities:[a.ability].filter(Boolean);
 return list.map(x=>{const ab=abilityByName(x.name);return `<div class="st-ability"><b>${esc(x.name)}</b> <small>· ${esc(x.rarity)}</small>${ab&&ab.desc?`<p>${esc(ab.desc)}</p>`:''}</div>`;}).join('')||'<p class="muted">None yet.</p>';}
function stHead(portrait,name,sub,lvl,bar,chips){
 return `<section class="panel st-head"><div class="st-portrait">${portrait}</div><div class="st-id"><small class="eyebrow">STATUS</small><h2>${esc(name)}</h2><p class="st-sub">${sub}</p>`
  +`<div class="st-level"><span>LV</span><b>${lvl}</b></div>${bar}<div class="st-chips">${chips}</div></div></section>`;}

// Deck on Brutus's status screen. Between expeditions: the full deck for the chosen discipline
// plus gear cards. During a paused expedition: the live deck, with used cards (discard pile) greyed.
function stLiveDeck(){if(!S.pendingDelve)return null;try{const f=window.parent&&window.parent.document.getElementById('dungeon');
 const fn=f&&f.contentWindow&&f.contentWindow.brutusDeckState;return typeof fn==='function'?fn():null;}catch(e){return null;}}
function stCost(c){return c==null?'':Math.ceil(c*BALANCED_CARD_COST_SCALE);}
function stTile(name,tier,cost,state,from){const tag=state==='used'?'Used':state==='hand'?'In hand':'';
 return `<div class="st-cardtile ${state}" title="${esc(name)}${tag?' · '+tag:''}"><b>${esc(name)}</b><span>${esc(String(tier||'').toLowerCase())}${cost!==''?` · ${cost}⚡`:''}</span>${from?`<span class="st-from">${esc(from)}</span>`:''}${tag?`<em>${tag}</em>`:''}</div>`;}
function stDeckPanel(deckName,L){
 const live=stLiveDeck();let tiles=[],head='';
 if(live&&live.cards&&live.cards.length){
  const sorted=live.cards.slice().sort((a,b)=>a.name.localeCompare(b.name));
  for(const c of sorted){for(let i=0;i<c.hand;i++)tiles.push(stTile(c.name,c.tier,stCost(c.cost),'hand',c.fromItem));
   for(let i=0;i<c.draw;i++)tiles.push(stTile(c.name,c.tier,stCost(c.cost),'draw',c.fromItem));
   for(let i=0;i<c.used;i++)tiles.push(stTile(c.name,c.tier,stCost(c.cost),'used',c.fromItem));}
  head=`<p class="muted">Expedition in progress · ${esc(live.discipline)} · ${live.draw} in the draw pile · ${live.hand} in hand · <b>${live.used} used</b> (greyed). Used cards return when the draw pile runs out and the discard is shuffled back in, or at a rest area.</p>`;
 }else{
  const rows=BALANCED_DECK_PREVIEW.filter(c=>c.class===deckName&&c.deck_copies>0).sort((a,b)=>a.name.localeCompare(b.name));
  for(const c of rows)for(let i=0;i<c.deck_copies;i++)tiles.push(stTile(c.name,c.tier,stCost(c.cost),'draw'));
  for(const c of (L.cards||[]))for(let i=0;i<(c.tier==='support'?2:3);i++)tiles.push(stTile(c.name,c.tier,'', 'draw','from '+c.fromItem));
  head=`<p class="muted">${esc(deckName)} deck · ${tiles.length} cards${(L.cards||[]).length?' including gear cards':''}. Change it on the Deploy screen. During an expedition, open this screen from "View world" to see which cards are used.</p>`;
 }
 return `<section class="panel"><h3>Deck</h3>${head}<div class="st-deck">${tiles.join('')}</div></section>`;}
function stBrutus(){const b=S.brutus,L=derivedLoadout('brutus'),g=L.stats||{};const deck=(typeof dkDeck==='function'?dkDeck():'Warrior');
 const cards=(L.cards||[]).map(c=>`<span class="st-card">${esc(c.name)} <small>(${esc(c.tier)}, from ${esc(c.fromItem)})</small></span>`).join('');
 const procs=(L.procs||[]).map(p=>`<span class="st-proc">${esc(p.itemName)}: ${esc(p.desc)}</span>`).join('');
 return stHead(face({name:'Brutus',portrait:0},'large'),'Brutus','Leader of Brutus\'s Company · the claimant',b.lvl,stBar(b.lvl,b.exp,99),
   `<span class="st-chip">Leads every expedition</span><span class="st-chip">Looks ${b.attractiveness}/10</span><span class="st-chip">Best feat ${b.bestFeat||0}</span>`)
  +`<div class="profile-grid"><section class="panel"><h3>In the dungeon</h3><div class="value-grid">`
  +`<div><small>HP</small><b>${100+(g.hp||0)}</b><small>100 base${g.hp?` · ${g.hp>0?'+':''}${g.hp} gear`:''}</small></div>`
  +`<div><small>Energy</small><b>${20+(g.energy||0)}</b><small>20 base${g.energy?` · ${g.energy>0?'+':''}${g.energy} gear`:''}</small></div>`
  +`<div><small>Deck</small><b>${esc(deck)}</b><small>40 cards, chosen on Deploy</small></div>`
  +`<div><small>Attack</small><b>${g.atk?`${g.atk>0?'+':''}${g.atk}%`:'—'}</b><small>from gear</small></div>`
  +`<div><small>Defense</small><b>${g.def?`${g.def>0?'+':''}${g.def}%`:'—'}</b><small>from gear</small></div></div>`
  +`${cards?`<h3>Cards from gear</h3><div class="st-list">${cards}</div>`:''}${procs?`<h3>Gear effects</h3><div class="st-list">${procs}</div>`:''}</section>`
  +`<section class="panel"><h3>Equipment</h3>${stGear('brutus')}<div class="actions">${btn('Open equipment','equipment')}</div></section></div>`+stDeckPanel(deck,L);}
function stCompanion(a){const arch=ST_ARCH[a.cls]||ST_ARCH.Ranger,scale=1+Math.max(0,(a.lvl||10)-10)*0.012,P=abilityProfile(a);
 const top=xpCeiling(a);const prof=stFmtProfile(P);
 return stHead(face(a,'large'),a.name,`${esc(a.epithet||jobTitle(a))} · ${esc(a.cls)} · ${esc(a.region||'')}${a.age?` · ${a.age}`:''}`,a.lvl,stBar(a.lvl,a.exp,top),
   `<span class="st-chip">${a.active?'Active: goes on expeditions':'Benched'}</span><span class="st-chip">Ceiling ${a.capKnown?`Lv ${a.cap}`:'unknown'}</span><span class="st-chip">${esc(loyaltyLabel(a))}</span>`)
  +`<div class="profile-grid"><section class="panel"><h3>In the dungeon</h3><div class="value-grid">`
  +`<div><small>HP</small><b>${Math.round(arch.hp*scale)}</b><small>${esc(a.cls)} ${arch.hp} · level ×${scale.toFixed(2)}</small></div>`
  +`<div><small>Energy</small><b>${Math.round(arch.energy*scale)}</b><small>${esc(a.cls)} ${arch.energy} · level ×${scale.toFixed(2)}</small></div>`
  +`<div><small>Attack</small><b>${esc(arch.move)}</b><small>${arch.dmg} dmg · ${arch.tier} · ${arch.cost} energy</small></div></div>`
  +`<p class="muted" style="margin-top:10px">Wind-up ${arch.windup} ms · recovery ${arch.recovery} ms. 0 HP down there is permanent.</p>`
  +`${prof?`<h3>From abilities</h3><div class="value-grid">${prof}</div>`:''}</section>`
  +`<section class="panel"><h3>Abilities</h3>${stAbilities(a)}</section>`
  +`<section class="panel"><h3>Equipment</h3>${stGear(a.id)}<p class="muted">Companion gear is not applied in the dungeon yet; only Brutus's is.</p><div class="actions">${btn('Open equipment','equipment')}</div></section>`
  +`<section class="panel"><h3>Standing</h3><div class="value-grid"><div><small>Fame</small><b>${Math.round(a.fame||0)}</b></div><div><small>Reputation</small><b>${a.reputation||0}</b></div>`
  +`<div><small>Affection</small><b>${Math.round(a.affection||0)}</b></div><div><small>Wage</small><b>${a.wage!=null?fmtGold(a.wage):'—'}</b></div><div><small>Market value</small><b>${fmtGold(valueOf(a))}</b></div><div><small>Looks</small><b>${a.attractiveness}/10</b></div></div>`
  +`<div class="actions">${btn(a.active?'Bench':'Activate','active',a.id)}${btn('Public profile','st-public',a.id)}</div></section></div>`;}
const ST_CSS=`.st-head{display:flex;gap:28px;align-items:center}.st-portrait{width:190px;flex:0 0 190px}.st-id{flex:1;min-width:0}.st-id h2{font-size:38px;margin:4px 0}
.st-sub{color:#c6d2ce;margin:0 0 12px}.st-level{display:flex;align-items:baseline;gap:8px;margin-bottom:6px}.st-level span{font-size:12px;color:var(--dim);letter-spacing:.1em}.st-level b{font-size:34px;color:var(--gold)}
.st-xp{max-width:520px}.st-xp-top{display:flex;justify-content:space-between;font-size:12px;color:var(--dim);margin-bottom:4px}.st-xp-track{height:8px;background:rgba(0,0,0,.45);border:1px solid #879d9640;border-radius:4px;overflow:hidden}.st-xp-track div{height:100%;background:var(--gold)}
.st-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.st-chip{font-size:12px;border:1px solid #879d9650;padding:4px 9px;border-radius:999px;color:#c6d2ce}
.st-gear{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.st-slot{border:1px solid #879d9630;padding:10px;display:flex;flex-direction:column;gap:3px;min-width:0}.st-slot small{color:var(--dim);font-size:11px}.st-slot span{font-size:12px;color:#c6d2ce}.st-slot.empty span{color:var(--dim)}
.st-proc{color:var(--warn)!important}.st-card{color:#c08cf5!important}.st-list{display:flex;flex-direction:column;gap:5px;font-size:13px}.st-ability{margin-bottom:12px}.st-ability p{margin:4px 0 0;font-size:13px;color:#c6d2ce}
.st-head~.profile-grid .actions{margin-top:16px}.panel h3{margin:0 0 12px}.panel h3:not(:first-child){margin-top:18px}.value-grid b{font-size:20px}
.st-deck{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px;margin-top:10px}
.st-cardtile{position:relative;border:1px solid #879d9660;background:#1d3540;padding:8px 8px 7px;display:flex;flex-direction:column;gap:2px;min-height:58px}
.st-cardtile b{font-size:12px;line-height:1.25}.st-cardtile span{font-size:11px;color:var(--dim)}.st-cardtile .st-from{color:#c08cf5}
.st-cardtile em{font-style:normal;font-size:9px;letter-spacing:.08em;text-transform:uppercase;margin-top:auto;padding-top:3px}
.st-cardtile.hand{border-color:var(--gold)}.st-cardtile.hand em{color:var(--gold)}
.st-cardtile.used{opacity:.38;filter:grayscale(1);background:#121d23}.st-cardtile.used em{color:var(--text)}
@media(max-width:760px){.st-head{flex-direction:column;align-items:flex-start}.st-portrait{width:140px;flex-basis:auto}.st-gear{grid-template-columns:1fr}}`;
(function(){if(document.getElementById('st-css'))return;const s=document.createElement('style');s.id='st-css';s.textContent=ST_CSS;document.head.appendChild(s);})();
function stPatch(){const root=document.getElementById('living');if(!root)return;
 // Brutus in the sidebar becomes a button like his companions
 const lead=[...root.querySelectorAll('.sidebar .leader')].find(r=>!r.querySelector('[data-person]')&&!r.querySelector('[data-status]'));
 if(lead)lead.innerHTML=`<button class="identity" data-status="brutus">${lead.innerHTML.replace(/<div>/,'<span>').replace(/<\/div>(?![\s\S]*<\/div>)/,'</span>')}</button>`;
 if(screen!=='status')return;
 const a=selected==='brutus'?null:person(selected);
 if(selected!=='brutus'&&!stIsCompanion(a)){screen=a?'profile':'guild';return render();}
 const eb=root.querySelector('.topbar .eyebrow'),h1=root.querySelector('.topbar h1');
 if(eb)eb.textContent='STATUS';if(h1)h1.textContent=selected==='brutus'?'The man himself.':'One of yours.';
 root.querySelectorAll('nav [data-action="nav"]').forEach(b=>b.classList.toggle('selected',b.dataset.id==='guild'));
 const c=root.querySelector('.content');if(c)c.innerHTML=selected==='brutus'?stBrutus():stCompanion(a);
}
const stRenderBase=render;
render=function(){const r=stRenderBase.apply(this,arguments);try{stPatch();}catch(e){console.error(e);}return r;};
const stHandleBase=handleLiving;
handleLiving=function(e){
 const st=e.target.closest('[data-status]');if(st){selected='brutus';screen='status';render();return;}
 const p=e.target.closest('[data-person]');if(p){const a=person(+p.dataset.person);if(stIsCompanion(a)){selected=a.id;screen='status';render();return;}}
 const b=e.target.closest('[data-action]');
 if(b&&!b.disabled){const act=b.dataset.action;
  if(act==='st-public'){selected=+b.dataset.id;screen='profile';render();return;}
  if(act==='person'){const a=person(+b.dataset.id);if(stIsCompanion(a)){selected=a.id;screen='status';render();return;}}}
 return stHandleBase(e);
};
