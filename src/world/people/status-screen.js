/* Status screen (Robert, 2026-10-13).
   v1: "Clicking on character should give status screen. There. Also make a proper status screen."
   v2: "UI needs work... committing a lot of design sins. Stats... tailored to the type of game.
        Full frontal visual of the character similar to Wizardry Daphne (front art in due time).
        Current relationship web, and what they are most likely to do that will impact their
        life trajectory." Stats chosen: a Fight block and a Life block built from numbers the game
        already uses. Drives come from character-drives/drives-world.js.
   Who gets it: Brutus (sidebar) and his companions (sidebar, guild card, Inspect, People list).
   Everyone else keeps the public profile.
   Layout: one bold element, the character frame (full-body figure with gear sockets around it,
   Daphne-style); everything else is quiet type on the page: header, Fight, Life, What happens
   next, Relationships, Deck (Brutus).
   Front art: add the file as art/characters/full/<name>.png (e.g. ember.png, brutus.png) and its
   name to ST_FULL_ART below; it then replaces the placeholder figure. Until then a neutral
   mannequin stands in (no image is requested, so there are no missing-file errors). */
const ST_FULL_ART=new Set([]);
const ST_ARCH={ // copy of the dungeon's ALLY_ARCHETYPES numbers (dungeon frame, "const ALLY_ARCHETYPES")
 Mage:{hp:60,energy:90,move:'Firebolt',tier:'medium',windup:1100,recovery:800,dmg:17,cost:12},
 Ranger:{hp:52,energy:80,move:'Arrow',tier:'light',windup:600,recovery:500,dmg:9,cost:6},
 Rogue:{hp:50,energy:75,move:'Thrown Knife',tier:'light',windup:450,recovery:420,dmg:11,cost:7},
 Priest:{hp:58,energy:95,move:'Smite',tier:'medium',windup:950,recovery:750,dmg:13,cost:10},
 Warrior:{hp:78,energy:85,move:'Javelin',tier:'medium',windup:800,recovery:650,dmg:15,cost:9},
 Knight:{hp:92,energy:80,move:'Shield Bash',tier:'heavy',windup:900,recovery:800,dmg:19,cost:11}};
function stIsCompanion(a){return !!a&&a.alive&&a.joined&&(S.roster||[]).some(m=>m.id===a.id);}
function stPct(x){return Math.round(x*100);}
function stSec(ms){return (ms/1000).toFixed(ms%1000?1:0)+' s';}
function stSlug(n){return String(n||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function stRow(label,value,note){return `<div class="cs-row"><dt>${label}</dt><dd>${value}</dd>${note?`<p>${note}</p>`:''}</div>`;}
// What each ability modifier does in the dungeon, in plain words (same fields the dungeon reads)
function stAbilityLines(P){const L=[];
 if(P.atk>1.001)L.push(['Damage',`+${stPct(P.atk-1)}%`,'Every hit.']);
 if(P.def>1.001)L.push(['Damage taken',`−${stPct(1-1/P.def)}%`,'Every hit taken.']);
 if(P.armor>0)L.push(['Armour',`${Math.round(P.armor)} hit${Math.round(P.armor)===1?'':'s'}`,'Absorbed after each rest.']);
 if(P.control>0)L.push(['Interrupt',`${stPct(P.control)}%`,'Chance a hit breaks an enemy’s wind-up.']);
 if(P.ambush>1.001)L.push(['Ambush',`+${stPct(P.ambush-1)}%`,'Against enemies that haven’t noticed.']);
 if(P.duelist>1.001)L.push(['One on one',`+${stPct(P.duelist-1)}%`,'When only one enemy is near.']);
 if(P.aoe>1.001)L.push(['Splash',`${stPct(P.aoe-1)}%`,'Of each hit, to enemies beside the target.']);
 if(P.crit>0)L.push(['Critical',`+${stPct(P.crit)}%`,'Chance on each hit.']);
 if(P.blind>0)L.push(['Evasion',`${stPct(P.blind)}%`,'Of attacks on them miss.']);
 if(P.sustain>0)L.push(['Regeneration','Yes','Heals slowly while hurt.']);
 if(P.buff>1.001)L.push(['Rally',`+${stPct(P.buff-1)}%`,'Damage for allies fighting near them.']);
 return L;}
function stXp(lvl,exp,top){const capped=lvl>=top,need=expToNext(lvl),have=Math.round(exp||0),pct=capped?100:Math.max(0,Math.min(100,have/need*100));
 return `<div class="cs-xp" role="img" aria-label="${capped?'At growth ceiling':`${have} of ${need} experience to level ${lvl+1}`}"><div class="cs-xp-track"><i style="width:${pct.toFixed(1)}%"></i></div>`
  +`<span>${capped?'At ceiling. No more levels.':`${have} / ${need} XP to Lv ${lvl+1}`}</span></div>`;}
// ---- the character frame: figure + gear sockets
const ST_SOCKETS=[['Helm','l',11],['Accessory','r',22],['Chest','l',38],['Weapon','r',56],['Hand','l',64],['Legs','r',82]];
const ST_FIGURE=`<svg class="cs-mannequin" viewBox="0 0 200 320" aria-hidden="true"><defs><linearGradient id="csg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a4350"/><stop offset="1" stop-color="#16262e"/></linearGradient></defs>
<g fill="url(#csg)" stroke="#dcb975" stroke-opacity=".35" stroke-width="1.2" stroke-linejoin="round">
<ellipse cx="100" cy="42" rx="19" ry="23"/><path d="M92 63h16v14H92z"/><path d="M62 84Q100 72 138 84L144 168Q100 182 56 168Z"/>
<path d="M62 86Q46 118 44 166L38 206Q44 214 52 208L62 166Q66 130 74 110Z"/><path d="M138 86Q154 118 156 166L162 206Q156 214 148 208L138 166Q134 130 126 110Z"/>
<path d="M58 170Q100 184 142 170L136 228L128 308H108L102 216H98L92 308H72L64 228Z"/></g></svg>`;
function stFrame(key,whoId,label,want){const rack=equipRackOf(whoId)||{};
 const sockets=ST_SOCKETS.map(([slot,side,top])=>{const it=rack[slot]&&(S.inventory||[]).find(i=>i.id===rack[slot]);const R=it&&(ITEM_RARITY[it.rarity]||{});
  const tip=it?`${it.name}${itemStatLine(it)?`: ${itemStatLine(it)}`:''}${it.proc?`. ${it.proc.desc}`:''}${it.grantedCard?`. Grants ${it.grantedCard.name}.`:''}`:`${slot}: empty`;
  const w=want&&want.slot===slot;return `<div class="cs-socket ${side}${it?'':' empty'}${w?' wanted':''}" style="top:${top}%" title="${esc(tip)}${w?`. Wants ${ITEM_RARITY[want.rarity].label} or better.`:''}"><small>${slot}${w?` <em>wants ${ITEM_RARITY[want.rarity].label.toLowerCase()}+</em>`:''}</small>${it?`<b style="color:${R.color}">${esc(it.name)}</b>${itemStatLine(it)?`<span>${esc(itemStatLine(it))}</span>`:''}`:'<b>Empty</b>'}</div>`;}).join('');
 return `<figure class="cs-frame" aria-label="${esc(label)}, full figure and equipment"><div class="cs-figure">${ST_FIGURE}`
  +(ST_FULL_ART.has(key)?`<img class="cs-art" src="../art/characters/full/${key}.png" alt="" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='art/characters/full/${key}.png';}else{this.remove();}">`:'')
  +`</div>${sockets}</figure>`;}
// ---- what happens next (drives + the game's own thresholds)
function stNext(a){const out=[];const ds=typeof drvEnsure==='function'?drvEnsure(a):[];
 for(const d of ds){
  if(d.kind==='gear'){const label=`${ITEM_RARITY[d.rarity].label} or better`;
   if(stIsCompanion(a)){const waited=S.turn-d.since;out.push({w:waited>DRV.waitGrace?4:2,title:`Wants a ${label.toLowerCase()} ${drvNoun(d.slot)}`,why:`Equip one on ${pron(a).o} and ${pron(a).s}’ll be grateful (loyalty +8). ${waited>DRV.waitGrace?`${cap(pron(a).s)} has waited ${waited} turns and is starting to feel overlooked.`:`Waiting ${waited} turn${waited===1?'':'s'} so far.`}`,pct:Math.min(100,waited/DRV.waitGrace*100),eta:waited>DRV.waitGrace?'Overdue':`${DRV.waitGrace-waited} turns of patience left`,tone:waited>DRV.waitGrace?'risk':'gold'});}
   else{const c=drvFindChance(a,d);out.push({w:1,title:`Hunting for a ${label.toLowerCase()} ${drvNoun(d.slot)}`,why:`Searches on ${pron(a).p} own delves.`,pct:null,eta:`${Math.max(1,stPct(c))}% chance a turn`,tone:'gold'});}}
  if(d.kind==='class'){const eta=drvEtaTurns(a,d);out.push({w:3,title:`Retraining as a ${d.target}`,why:`${a.lvl<DRV.classMinLvl?`Starts once ${pron(a).s} reaches Lv ${DRV.classMinLvl}. `:''}${d.hot?`The market is paying for ${d.target}s right now. `:''}Keeps ${pron(a).p} abilities; new ones come from the ${d.target} list.`,pct:d.progress,eta:eta?`About ${eta} turn${eta===1?'':'s'}`:'Not yet',tone:'gold'});}
  if(d.kind==='person'){const t=person(d.target);if(!t)continue;const where=drvCompanyOf(t);const eta=drvEtaTurns(a,d);
   const why={lover:'They are lovers.',ally:'They are allies.',fame:`${t.name} is the name to be near in ${a.region}.`,brutus:`${cap(pron(a).s)} thinks well of your company.`}[d.why]||'';
   const leaving=stIsCompanion(a)&&where!=='Brutus';
   out.push({w:leaving?5:3,title:where==='Brutus'?`Wants to join your company, to work beside ${t.name}`:`${leaving?'Pulled toward':'Wants to join'} ${t.name} at ${where}`,
    why:`${why} ${leaving?`If this completes, ${pron(a).s} leaves you for ${where}. Loyalty slows it; recruiting ${t.name} settles it.`:''}`.trim(),pct:d.progress,eta:eta?`About ${eta} turn${eta===1?'':'s'}`:'',tone:leaving?'risk':'gold',person:t.id});}}
 if(stIsCompanion(a)&&(a.loyalty??60)<=30)out.push({w:6,title:'Could walk out',why:`Loyalty ${Math.round(a.loyalty??60)}. At ${LOYALTY_DESERTION_FLOOR} or below there is a ${stPct(LOYALTY_DESERTION_CHANCE)}% chance each turn ${pron(a).s} leaves. Unpaid wages drive it down.`,pct:null,eta:'',tone:'risk'});
 const top=xpCeiling(a),nextRank=ABILITY_RANK_MIN_LEVEL.find(l=>l>a.lvl);
 if(nextRank&&nextRank<=top)out.push({w:1,title:`New ability at Lv ${nextRank}`,why:`One more roll from the ${a.cls} list.`,pct:null,eta:`${nextRank-a.lvl} level${nextRank-a.lvl===1?'':'s'} away`,tone:'calm'});
 if(a.capKnown&&top-a.lvl<=5)out.push({w:2,title:top<=a.lvl?'Has stopped growing':`Stops growing at Lv ${top}`,why:'Appraised ceiling.',pct:null,eta:'',tone:'calm'});
 return out.sort((x,y)=>y.w-x.w);}
function stNextHtml(items,empty){if(!items.length)return `<p class="cs-empty">${empty}</p>`;
 return `<ol class="cs-next">${items.map(i=>`<li class="${i.tone}"><div class="cs-next-top"><b>${esc(i.title)}</b><span>${esc(i.eta||'')}</span></div>`
  +`${i.pct!=null?`<div class="cs-meter" role="img" aria-label="${Math.round(i.pct)}% along"><i style="width:${Math.max(2,Math.min(100,i.pct)).toFixed(0)}%"></i></div>`:''}<p>${esc(i.why)}</p></li>`).join('')}</ol>`;}
// ---- relationship web: real ties only (Brutus, lover, allies, rivals, drive targets, guild, strong opinions)
function stWarmth(v){v=Math.round(v||0);return v>=75?'Warm toward you':v>=55?'Friendly':v>=40?'Neutral':v>=25?'Cool':'Cold';}
function stWeb(a,isBrutus,pub){const nodes=[],seen=new Set();
 const addP=(p,kind,label,strength)=>{if(!p||seen.has('p'+p.id))return;seen.add('p'+p.id);nodes.push({type:'p',p,kind,label,strength});};
 const addG=(name,kind,label)=>{if(!name||seen.has('g'+name))return;seen.add('g'+name);nodes.push({type:'g',name,kind,label});};
 if(isBrutus){for(const m of (S.roster||[]).filter(x=>x.alive))addP(m,'mine',`Affection ${Math.round(m.affection||0)}`);
  const hos=Object.values(S.guilds||{}).filter(g=>g.hostility>0).sort((x,y)=>y.hostility-x.hostility).slice(0,4);for(const g of hos)addG(g.name,'grudge',`Angry (${g.hostility.toFixed(1)})`);
  const fans=(S.agents||[]).filter(p=>p.alive&&!p.joined&&(p.drives||[]).some(d=>d.kind==='person'&&person(d.target)&&drvCompanyOf(person(d.target))==='Brutus')).slice(0,3);for(const p of fans)addP(p,'want','Wants to join you');}
 else{nodes.push({type:'b',kind:'mine',label:pub?stWarmth(a.affection):`Affection ${Math.round(a.affection||0)}`});seen.add('b');
  if(pub&&a.affiliation&&a.affiliation!=='Brutus')addG(a.affiliation,'member','Signed with');
  if(a.lover)addP(person(a.lover),'lover','Lover');
  for(const d of a.drives||[])if(d.kind==='person')addP(person(d.target),'want',pub?'Word is: wants to join':drvCompanyOf(person(d.target)||{})==='Brutus'?'Wants to work beside':'Pulled toward');
  for(const l of a.links||[])addP(person(l.id),l.kind==='rival'?'rival':'ally',l.label||(l.kind==='rival'?'Rival':'Ally'));
  const mem=pub?[]:Object.entries(a.memory||{}).filter(([g,v])=>g!=='Brutus'&&Math.abs(v)>=15).sort((x,y)=>Math.abs(y[1])-Math.abs(x[1])).slice(0,3);
  for(const [g,v] of mem)addG(g,v>0?'fond':'grudge',v>0?`Likes them (+${v})`:`Grudge (${v})`);}
 const list=nodes.slice(0,10),n=list.length;if(!n)return `<p class="cs-empty">No ties yet.</p>`;
 const W=640,H=n<=2?190:360,cx=W/2,cy=H/2,rx=250,ry=n<=2?60:122;
 const pos=list.map((nd,i)=>{const t=(n<=2?Math.PI:-Math.PI/2)+i*2*Math.PI/n+(n===3?Math.PI/6:0);return{x:cx+rx*Math.cos(t),y:cy+ry*Math.sin(t)};});
 const edges=list.map((nd,i)=>{const p=pos[i];const mx=(cx+p.x)/2,my=(cy+p.y)/2;
  return `<line class="e ${nd.kind}" x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}"/><text class="el" x="${mx.toFixed(1)}" y="${(my-4).toFixed(1)}">${esc(nd.label)}</text>`;}).join('');
 const center=isBrutus?face({name:'Brutus',portrait:0},'tiny'):face(a,'tiny');
 const nodeHtml=list.map((nd,i)=>{const p=pos[i],st=`left:${(p.x/W*100).toFixed(2)}%;top:${(p.y/H*100).toFixed(2)}%`;
  if(nd.type==='g')return `<div class="cs-node g ${nd.kind}" style="${st}"><span class="cs-nm">${esc(nd.name)}</span></div>`;
  if(nd.type==='b')return `<button class="cs-node p mine" style="${st}" data-status="brutus">${face({name:'Brutus',portrait:0},'tiny')}<span class="cs-nm">Brutus</span></button>`;
  return `<button class="cs-node p ${nd.kind}" style="${st}" data-person="${nd.p.id}">${face(nd.p,'tiny')}<span class="cs-nm">${esc(nd.p.name)}</span></button>`;}).join('');
 return `<div class="cs-web" style="aspect-ratio:${W}/${H}"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${edges}</svg>`
  +`<div class="cs-node self" style="left:50%;top:50%">${center}<span class="cs-nm">${esc(isBrutus?'Brutus':a.name)}</span></div>${nodeHtml}</div>`
  +`<p class="cs-key">${[['ally','Ally'],['rival','Rival'],['lover','Lover'],['want','Wants to join'],['mine','Your company'],['grudge','Grudge']].map(([k,t])=>`<span><i class="${k}"></i>${t}</span>`).join('')}</p>`;}
// Deck on Brutus's status screen. Between expeditions: the full deck for the chosen discipline
// plus gear cards. During a paused expedition: the live deck, with used cards (discard pile) greyed.
function stLiveDeck(){if(!S.pendingDelve)return null;try{const f=window.parent&&window.parent.document.getElementById('dungeon');
 const fn=f&&f.contentWindow&&f.contentWindow.brutusDeckState;return typeof fn==='function'?fn():null;}catch(e){return null;}}
function stCost(c){return c==null?'':Math.ceil(c*BALANCED_CARD_COST_SCALE);}
function stArt(cls,id){if(!cls||!id)return '';const u=`art/card-faces/${String(cls).toLowerCase()}/${id}.jpg`;
 // the playable file sits in builds/, the art in the repo's art/: try ../art first, then art/, hide if neither exists
 return `<img class="st-face" src="../${u}" alt="" loading="lazy" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='${u}';}else{this.remove();}">`;}
function stArtFor(name){const r=BALANCED_DECK_PREVIEW.find(c=>c.name===name);return r?[r.class,r.id]:[null,null];}
function stTile(name,tier,cost,state,from,art){const tag=state==='used'?'Used':state==='hand'?'In hand':'';const [cls,id]=art||stArtFor(name);
 return `<div class="st-cardtile ${state}" title="${esc(name)}${tag?' · '+tag:''}">${stArt(cls,id)}<b>${esc(name)}</b><span>${esc(String(tier||'').toLowerCase())}${cost!==''?` · ${cost}⚡`:''}</span>${from?`<span class="st-from">${esc(from)}</span>`:''}${tag?`<em>${tag}</em>`:''}</div>`;}
function stDeckPanel(deckName,L){
 const live=stLiveDeck();let tiles=[],head='';
 if(live&&live.cards&&live.cards.length){
  const sorted=live.cards.slice().sort((a,b)=>a.name.localeCompare(b.name));
  for(const c of sorted){for(let i=0;i<c.hand;i++)tiles.push(stTile(c.name,c.tier,stCost(c.cost),'hand',c.fromItem,c.art?[c.cls,c.art]:null));
   for(let i=0;i<c.draw;i++)tiles.push(stTile(c.name,c.tier,stCost(c.cost),'draw',c.fromItem,c.art?[c.cls,c.art]:null));
   for(let i=0;i<c.used;i++)tiles.push(stTile(c.name,c.tier,stCost(c.cost),'used',c.fromItem,c.art?[c.cls,c.art]:null));}
  head=`<p class="cs-lede">Mid-expedition, ${esc(live.discipline)} deck: ${live.draw} left to draw, ${live.hand} in hand, <b>${live.used} used</b>. Used cards come back when the draw pile runs out, or at a rest area.</p>`;
 }else{
  const rows=BALANCED_DECK_PREVIEW.filter(c=>c.class===deckName&&c.deck_copies>0).sort((a,b)=>a.name.localeCompare(b.name));
  for(const c of rows)for(let i=0;i<c.deck_copies;i++)tiles.push(stTile(c.name,c.tier,stCost(c.cost),'draw'));
  for(const c of (L.cards||[]))for(let i=0;i<(c.tier==='support'?2:3);i++)tiles.push(stTile(c.name,c.tier,'', 'draw','from '+c.fromItem));
  head=`<p class="cs-lede">${esc(deckName)} deck, ${tiles.length} cards${(L.cards||[]).length?' including gear cards':''}. Pick the deck on the Deploy screen. Mid-expedition, open this screen from View world to see which cards are used.</p>`;
 }
 return `<section class="cs-sec cs-decksec"><h2>Deck</h2>${head}<div class="st-deck">${tiles.join('')}</div></section>`;}

function stBrutus(){const b=S.brutus,L=derivedLoadout('brutus'),g=L.stats||{};const deck=(typeof dkDeck==='function'?dkDeck():'Warrior');
 const deckSize=BALANCED_DECK_PREVIEW.filter(c=>c.class===deck&&c.deck_copies>0).reduce((n,c)=>n+c.deck_copies,0)+(L.cards||[]).reduce((n,c)=>n+(c.tier==='support'?2:3),0);
 const fight=[stRow('Health',100+(g.hp||0),g.hp?`100, ${g.hp>0?'+':''}${g.hp} from gear.`:'Zero is the end of the run.'),
  stRow('Energy',20+(g.energy||0),'Pays for cards. Refills as he fights.'),
  stRow('Deck',esc(deck),`${deckSize} cards${(L.cards||[]).length?`, ${(L.cards||[]).length} kinds from gear`:''}.`),
  stRow('Damage',g.atk?`${g.atk>0?'+':''}${g.atk}%`:'Base','From gear.'),
  stRow('Damage taken',g.def?`−${g.def}%`:'Base','From gear.')].join('')
  +(L.procs||[]).map(p=>stRow(esc(p.itemName),'Effect',esc(p.desc))).join('');
 const mine=(S.roster||[]).filter(x=>x.alive);
 const life=[stRow('Level',b.lvl,'No ceiling.'),stRow('Looks',`${b.attractiveness}/10`,'What the market sees first.'),
  stRow('Best feat',b.bestFeat||0,'Raises his price when it improves.'),stRow('Company',`${mine.length} companion${mine.length===1?'':'s'}`,`${S.party.length} going down with him.`),
  stRow('Treasury',fmtGold(S.gold||0),'')].join('');
 return stSheet({key:'brutus',whoId:'brutus',name:'Brutus',cameo:face({name:'Brutus',portrait:0},'large'),line:`Lv ${b.lvl}. Leads every expedition.`,epithet:'The claimant',
  xp:stXp(b.lvl,b.exp,99),fight,life,
  next:stNextHtml((S.roster||[]).filter(stIsCompanion).flatMap(m=>{const it=stNext(m).find(x=>x.tone!=='calm');return it?[{...it,title:`${m.name}: ${it.title.charAt(0).toLowerCase()+it.title.slice(1)}`}]:[];}).sort((x,y)=>y.w-x.w),'Nobody in the company is pulling in a new direction.'),
  web:stWeb(null,true),extra:stDeckPanel(deck,L),actions:btn('Open equipment','equipment')});}
function stCompanion(a){const arch=ST_ARCH[a.cls]||ST_ARCH.Ranger,scale=1+Math.max(0,(a.lvl||10)-10)*0.012,P=abilityProfile(a),top=xpCeiling(a);
 const hp=Math.round(arch.hp*scale),en=Math.round(arch.energy*scale);
 const fight=[stRow('Health',hp,`${a.cls} ${arch.hp}${scale>1.0001?`, +${stPct(scale-1)}% for level`:''}. Zero is permanent.`),
  stRow('Energy',en,`${Math.floor(en/arch.cost)} ${arch.move}${Math.floor(en/arch.cost)===1?'':'s'} from full.`),
  stRow(esc(arch.move),`${arch.dmg} dmg`,`${cap(arch.tier)} attack. ${stSec(arch.windup)} to wind up, ${stSec(arch.recovery)} to recover.`)].join('')
  +stAbilityLines(P).map(([l,v,n])=>stRow(l,v,n)).join('');
 const abil=(a.abilities&&a.abilities.length?a.abilities:[a.ability].filter(Boolean)).map(x=>{const ab=abilityByName(x.name);return `<li><b>${esc(x.name)}</b>${x.rarity&&x.rarity!=='common'?` <em>${esc(x.rarity)}</em>`:''}${ab&&ab.desc?`<span>${esc(ab.desc)}</span>`:''}</li>`;}).join('');
 const life=[stRow('Level',a.lvl,a.capKnown?(a.lvl>=top?'At ceiling.':`Ceiling Lv ${top}.`):'Ceiling unknown until appraised.'),
  stRow('Loyalty',Math.round(a.loyalty??60),`Unpaid wages lower it. At ${LOYALTY_DESERTION_FLOOR} or below they may walk out.`),
  stRow('Affection',Math.round(a.affection||0),'How they feel about Brutus.'),
  stRow('Fame',Math.round(a.fame||0),''),stRow('Reputation',`${(a.reputation||0)>0?'+':''}${a.reputation||0}`,''),
  stRow('Worth',fmtGold(valueOf(a)),a.wage!=null?`Paid ${fmtGold(a.wage)} a turn.`:'')].join('');
 return stSheet({key:stSlug(a.name),whoId:a.id,name:a.name,cameo:face(a,'large'),line:`Lv ${a.lvl} ${a.cls} from ${a.region}${a.age?`, ${a.age}`:''}`,epithet:a.epithet||jobTitle(a),
  xp:stXp(a.lvl,a.exp,top),fight:fight+(abil?`<h3 class="cs-h3">Abilities</h3><ul class="cs-abil">${abil}</ul>`:''),life,
  next:stNextHtml(stNext(a),'Nothing pulling at them right now.'),web:stWeb(a,false),
  want:(a.drives||[]).find(d=>d.kind==='gear'),extra:'',note:'Companion gear is shown but not yet applied in the dungeon.',actions:btn(a.active?'Bench':'Send on expeditions','active',a.id)+btn('Open equipment','equipment')+btn('Public profile','st-public',a.id)});}
function stSheet(o){return `<article class="cs">`
 +`<div class="cs-left">${stFrame(o.key,o.whoId,o.name,o.want)}${o.note?`<p class="cs-fine">${esc(o.note)}</p>`:''}<div class="cs-actions">${o.actions}</div></div>`
 +`<div class="cs-right"><header class="cs-head"><div class="cs-cameo">${o.cameo}</div><div><h2 class="cs-name">${esc(o.name)}</h2><p class="cs-line">${esc(o.line)}</p><p class="cs-epithet">${esc(o.epithet)}</p>${o.xp}</div></header>`
 +`<div class="cs-blocks"><section class="cs-sec"><h2>Fight</h2><dl>${o.fight}</dl></section><section class="cs-sec"><h2>Life</h2><dl>${o.life}</dl></section></div>`
 +`<section class="cs-sec"><h2>What happens next</h2>${o.next}</section>`
 +`<section class="cs-sec"><h2>Relationships</h2>${o.web}</section></div>`
 +`${o.extra?`<div class="cs-full">${o.extra}</div>`:''}</article>`;}
const ST_CSS=`
.cs{--ink:#101c24;--slate:#172a33;--rule:#879d9638;--bone:#eee9dc;--mist:#aab6b6;--gold:#dcb975;--verd:#8cc5a8;--emb:#e59986;--rose:#d9a0c0;
 display:grid;grid-template-columns:minmax(300px,380px) minmax(0,1fr);gap:44px;align-items:start;color:var(--bone);font-variant-numeric:tabular-nums}
.cs-left{position:sticky;top:18px}
.cs-frame{margin:0;position:relative;aspect-ratio:3/4;background:radial-gradient(120% 80% at 50% 30%,#21394400,#0c151b 85%),linear-gradient(#1b313b,#0f1a20);border:1px solid #dcb97566;box-shadow:inset 0 0 0 6px #0f1a20,inset 0 0 0 7px #dcb97533}
.cs-figure{position:absolute;inset:4% 20% 2%}
.cs-mannequin,.cs-art,.cs-leads{position:absolute;inset:0;width:100%;height:100%}
.cs-art{object-fit:contain;object-position:bottom center}
.cs-leads{overflow:visible}.cs-leads line{stroke:#dcb975;stroke-opacity:.35;stroke-width:.8;vector-effect:non-scaling-stroke}
.cs-socket{position:absolute;width:31%;padding:6px 8px;background:#0f1a20e6;border:1px solid #dcb97540;font-size:11px;line-height:1.3;transform:translateY(-50%)}
.cs-socket.l{left:3%}.cs-socket.r{right:3%}
.cs-socket small{display:block;color:var(--mist);font-size:10px}.cs-socket b{display:block;font-weight:600;font-size:12px}.cs-socket span{color:var(--mist)}
.cs-socket.empty{border-style:dashed;border-color:#879d9640}.cs-socket.wanted{border:1px solid var(--gold);border-style:solid}.cs-socket em{font-style:normal;color:var(--gold)}.cs-socket.empty b{color:#aab6b680;font-weight:400}
.cs-fine{font-size:12px;color:var(--mist);margin:10px 0 0}
.cs-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.cs-head{display:grid;grid-template-columns:84px 1fr;gap:20px;align-items:center;padding-bottom:22px;border-bottom:1px solid var(--rule)}
.cs-cameo .portrait{width:84px;height:84px;border:1px solid #dcb97566}
.cs-name{font-size:46px;line-height:1;margin:0;font-weight:400;letter-spacing:-.01em}
.cs-line{margin:8px 0 0;color:var(--bone);font-size:15px}.cs-epithet{margin:2px 0 12px;color:var(--mist);font-style:italic}
.cs-xp{display:flex;align-items:center;gap:12px;font-size:12px;color:var(--mist)}
.cs-xp-track{flex:1;max-width:360px;height:6px;background:#0b1419;border:1px solid var(--rule)}.cs-xp-track i{display:block;height:100%;background:var(--gold)}
.cs-blocks{display:grid;grid-template-columns:1fr 1fr;gap:36px}
.cs-sec{padding:22px 0 4px}.cs-sec+.cs-sec,.cs-blocks+.cs-sec{border-top:1px solid var(--rule)}
.cs-blocks .cs-sec{border-top:0}
.cs-sec h2{font-size:22px;font-weight:400;margin:0 0 12px}
.cs dl{margin:0}
.cs-row{display:grid;grid-template-columns:1fr auto;column-gap:16px;padding:7px 0;border-bottom:1px solid #879d961c}
.cs-row dt{color:var(--mist);font-size:13px}.cs-row dd{margin:0;font-size:17px;text-align:right;color:var(--bone)}
.cs-row p{grid-column:1/-1;margin:2px 0 0;font-size:12px;color:#aab6b6c0;line-height:1.4}
.cs-h3{font-size:14px;font-weight:600;margin:18px 0 8px;color:var(--bone)}.cs-abil{list-style:none;margin:0;padding:0;display:grid;gap:8px}.cs-abil b{font-weight:600}.cs-abil em{font-style:normal;color:#c5b6e7;font-size:12px;margin-left:4px}.cs-abil span{display:block;font-size:12px;color:var(--mist)}
.cs-next{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.cs-next li{padding-left:14px;border-left:2px solid var(--gold)}.cs-next li.risk{border-left-color:var(--emb)}.cs-next li.calm{border-left-color:#879d9666}
.cs-next-top{display:flex;justify-content:space-between;gap:12px;align-items:baseline}.cs-next-top b{font-weight:600;font-size:15px}.cs-next-top span{font-size:12px;color:var(--mist);white-space:nowrap}
.cs-next li.risk .cs-next-top span{color:var(--emb)}
.cs-next p{margin:4px 0 0;font-size:13px;color:var(--mist);line-height:1.45;max-width:62ch}
.cs-meter{height:4px;background:#0b1419;margin-top:6px;max-width:420px}.cs-meter i{display:block;height:100%;background:var(--gold)}.cs-next li.risk .cs-meter i{background:var(--emb)}
.cs-empty{color:var(--mist);font-size:14px;margin:0}
.cs-web{position:relative;aspect-ratio:640/340;margin:4px 0 0;max-width:760px}
.cs-web svg{position:absolute;inset:0;width:100%;height:100%}
.cs-web .e{stroke-width:1.5;vector-effect:non-scaling-stroke;stroke:#879d9670}
.cs-web .e.ally{stroke:var(--verd)}.cs-web .e.rival,.cs-web .e.grudge{stroke:var(--emb);stroke-dasharray:5 4}.cs-web .e.lover{stroke:var(--rose);stroke-width:2.5}
.cs-web .e.want{stroke:var(--gold);stroke-dasharray:2 4}.cs-web .e.mine{stroke:var(--gold)}.cs-web .e.fond{stroke:var(--verd);stroke-dasharray:5 4}
.cs-web .el{fill:var(--mist);font-size:11px;text-anchor:middle;paint-order:stroke;stroke:#101c24;stroke-width:4px}
.cs-node{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:0;padding:0;color:var(--bone);font:inherit;cursor:pointer}
.cs-nm{font-size:11px;white-space:nowrap;background:#101c24d9;padding:1px 5px}
.cs-node .portrait{width:42px;height:42px;border-radius:50%;border:2px solid #879d9680}
.cs-node.self{cursor:default}.cs-node.self .portrait{width:62px;height:62px;border-color:var(--gold)}
.cs-node.ally .portrait{border-color:var(--verd)}.cs-node.rival .portrait{border-color:var(--emb)}.cs-node.lover .portrait{border-color:var(--rose)}.cs-node.want .portrait,.cs-node.mine .portrait{border-color:var(--gold)}
.cs-node.g{cursor:default}.cs-node.g .cs-nm{border:1px solid #879d9660;padding:4px 8px;font-size:12px}.cs-node.g.grudge .cs-nm{border-color:var(--emb)}.cs-node.g.member .cs-nm{border-color:var(--gold)}.cs-web .e.member{stroke:#dcb97599}.cs-node.g.fond .cs-nm{border-color:var(--verd)}
.cs-node:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.cs-key{font-size:11px;color:var(--mist);display:flex;flex-wrap:wrap;gap:4px 16px;margin:8px 0 0}.cs-key span{white-space:nowrap}.cs-key i{display:inline-block;width:16px;height:0;border-top:2px solid;vertical-align:middle;margin-right:5px}
.cs-key .ally{border-color:var(--verd)}.cs-key .rival,.cs-key .grudge{border-color:var(--emb);border-top-style:dashed}.cs-key .lover{border-color:var(--rose)}.cs-key .want{border-color:var(--gold);border-top-style:dotted}.cs-key .mine{border-color:var(--gold)}
.cs-full{grid-column:1/-1}.cs-lede{font-size:13px;color:var(--mist);margin:0 0 4px;max-width:80ch}
.st-deck{display:grid;grid-template-columns:repeat(auto-fill,minmax(122px,1fr));gap:10px;margin-top:12px}
.st-face{display:block;width:calc(100% + 16px);margin:-8px -8px 6px;aspect-ratio:4/3;object-fit:cover;object-position:top center;background:#0e171c}
.st-cardtile{position:relative;border:1px solid #879d9650;background:#1a2f39;padding:8px 8px 7px;display:flex;flex-direction:column;gap:2px;min-height:58px}
.st-cardtile b{font-size:12px;line-height:1.25}.st-cardtile span{font-size:11px;color:var(--mist)}.st-cardtile .st-from{color:#c08cf5}
.st-cardtile em{font-style:normal;font-size:10px;margin-top:auto;padding-top:3px}
.st-cardtile.hand{border-color:var(--gold)}.st-cardtile.hand em{color:var(--gold)}
.st-cardtile.used{opacity:.38;filter:grayscale(1);background:#121d23}
@media(max-width:1100px){.cs{grid-template-columns:minmax(220px,300px) minmax(0,1fr);gap:28px}.cs-blocks{grid-template-columns:1fr;gap:0}.cs-socket{font-size:10px}.cs-socket b{font-size:11px}}
@media(max-width:760px){.cs{grid-template-columns:1fr}.cs-left{position:static;max-width:380px;order:2}.cs-right{order:1}.cs-full{order:3}}
@media(max-width:560px){.cs-name{font-size:34px}.cs-head{grid-template-columns:64px 1fr}.cs-cameo .portrait{width:64px;height:64px}.cs-web .el{display:none}}
@media(prefers-reduced-motion:reduce){.cs *{transition:none!important}}`;
(function(){const old=document.getElementById('st-css');if(old)old.remove();const s=document.createElement('style');s.id='st-css';s.textContent=ST_CSS;document.head.appendChild(s);})();
function stPatch(){const root=document.getElementById('living');if(!root)return;
 const lead=[...root.querySelectorAll('.sidebar .leader')].find(r=>!r.querySelector('[data-person]')&&!r.querySelector('[data-status]'));
 if(lead)lead.innerHTML=`<button class="identity" data-status="brutus">${lead.innerHTML.replace(/<div>/,'<span>').replace(/<\/div>(?![\s\S]*<\/div>)/,'</span>')}</button>`;
 if(screen!=='status')return;
 const a=selected==='brutus'?null:person(selected);
 if(selected!=='brutus'&&!stIsCompanion(a)){screen=a?'profile':'guild';return render();}
 const eb=root.querySelector('.topbar .eyebrow'),h1=root.querySelector('.topbar h1');
 if(eb)eb.textContent='Status';if(h1)h1.textContent=selected==='brutus'?'The man himself.':'One of yours.';
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
