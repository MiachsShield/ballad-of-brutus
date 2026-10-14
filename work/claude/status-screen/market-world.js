/* Market screen for everyone outside your company (Robert, 2026-10-13: "Characters outside of
   dungeon get a screen focusing on aspects of sim and labor market. Need to know basis for the
   player"). Replaces the old "Face to face" profile body; its actions (interview, appraise,
   back publicly, expose a boast) are kept and still go through the same handlers.
   Need to know, concretely:
     shown     public record: level, class, region, signed with, fame, reputation, looks, public
               standing (celebrity), signature abilities, public ties (allies, rivals, confirmed
               lovers), market value, the price you should expect, what the market is paying for,
               whether you can hire them and why not, recent events
     earned    growth ceiling (Appraise), personality (after you've interviewed them), moves
               against them (only those your intel has revealed)
     rumour    what they're after (drives) as word on the street, with timing in words, no
               numbers; unhappiness at their guild only when it shows (loyalty 30 or less)
     hidden    exact loyalty and affection (shown as a word), fight numbers, gear, drive progress */
function mkKnowsPersonality(a){return !!(S.metPersonality&&S.metPersonality[a.id]);}
const mkInterviewBase=startInterview;
startInterview=function(id){const r=mkInterviewBase.apply(this,arguments);if(S.interview&&S.interview.targetId===id){S.metPersonality=S.metPersonality||{};S.metPersonality[id]=true;}return r;};
function mkTiming(p){return p<34?'early talk':p<67?'getting serious':'any turn now';}
function mkHire(a){const why=[];const mine=(S.roster||[]).filter(x=>x.alive).length;
 const g=a.affiliation&&Object.values(S.guilds||{}).find(x=>x.name===a.affiliation);
 if(!a.alive)return{ok:false,why:['Dead.']};
 if(a.joined)return{ok:false,why:['Already one of yours.'],mine:true};
 if(LEVEL_GATE_ENABLED&&a.lvl>S.brutus.lvl)why.push(`Lv ${a.lvl} is above Brutus (Lv ${S.brutus.lvl}). Nobody follows a leader they outrank.`);
 if(1+mine>=BRUTUS_ROSTER_SLOTS)why.push(`Your company is full (${BRUTUS_ROSTER_SLOTS} including Brutus).`);
 if(g&&(g.hostility||0)>=HOSTILITY_REFUSE)why.push(`${g.name} is too angry with you to let you near ${pron(a).o}.`);
 if(S.actions<=0)why.push('No actions left this turn.');
 if(S.interview||S.wageNeg)why.push('Finish the conversation you are in first.');
 return{ok:!why.length,why,g};}
function mkAsk(a){const fair=Math.max(20,Math.round(valueOf(a)*prestigeWageMult(a)*loyaltyDiscount(a)));
 const r=x=>Math.round(x/100)*100||Math.round(x);return [r(fair*1.15*0.85),r(fair*1.45)];}
function mkWord(a){const out=[];
 for(const d of (typeof drvEnsure==='function'?drvEnsure(a):[])){
  if(d.kind==='person'){const t=person(d.target);if(!t)continue;const where=drvCompanyOf(t);
   out.push(where==='Brutus'?{tone:'gold',title:`Wants to work beside ${t.name}, in your company`,why:`An offer would land well. ${cap(mkTiming(d.progress))}.`}
    :{tone:'gold',title:`Wants to join ${t.name} at ${where}`,why:`If it happens, ${pron(a).s} signs with ${where}. ${cap(mkTiming(d.progress))}.`});}
  if(d.kind==='class')out.push({tone:'gold',title:`Training toward ${d.target}`,why:`${cap(mkTiming(d.progress))}.${S.event&&S.event.wants===d.target?` The market is paying for ${d.target}s.`:''}`});
  if(d.kind==='gear')out.push({tone:'calm',title:`Hunting for a ${ITEM_RARITY[d.rarity].label.toLowerCase()} ${drvNoun(d.slot)}`,why:'Spends turns searching for it on delves.'});}
 const g=a.affiliation&&Object.values(S.guilds||{}).find(x=>x.name===a.affiliation);
 if(g&&(a.loyalty??60)<=30)out.push({tone:'risk',title:`Unhappy at ${g.name}`,why:g.missedPayroll?`${g.name} has been missing payroll.`:'It shows. Easier to poach than usual.'});
 for(const t of (S.telegraphs||[]).filter(t=>t.targetId===a.id&&t.revealed))out.push({tone:'risk',title:`${t.guildName}: ${t.kind}`,why:'Your intel says it comes next turn.'});
 return out;}
function mkWordHtml(items){if(!items.length)return `<p class="cs-empty">Nothing worth repeating. Gather intel to hear more.</p>`;
 return `<ol class="cs-next">${items.map(i=>`<li class="${i.tone}"><div class="cs-next-top"><b>${esc(i.title)}</b></div><p>${esc(i.why)}</p></li>`).join('')}</ol>`;}
function mkScreen(a){const h=mkHire(a),[lo,hi]=mkAsk(a),pn=prestigeNote(a),tier=celebTierIdx(a)>=1?CELEB_TIERS[celebTierIdx(a)]:null;
 const where=!a.alive?'Dead':a.joined?'Signed with you':a.affiliation?`Signed with ${a.affiliation}`:'Free agent';const gone=!a.alive;
 const hireBlock=`<section class="mk-hire">`
  +`<div class="mk-status">${esc(where)}</div>`
  +(h.mine||gone?'':`<div class="mk-price"><b>${lo===hi?fmtGold(lo):`${fmtGold(lo)}–${fmtGold(hi)}`}</b><span>Expected ask a turn</span></div>`)
  +(h.mine||gone?'':h.ok?`<p class="mk-ok">You can interview ${pron(a).o} now. One action, win or lose.</p>`:`<ul class="mk-no">${h.why.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>`)
  +(pn&&!h.mine&&!gone?`<p class="mk-warn">${esc(pn)}</p>`:'')
  +(gone?'':`<div class="cs-actions">${a.joined?'':btn('Interview','recruit',a.id,!h.ok)}${a.capKnown?'':btn('Appraise potential · 1 action','appraise',a.id,!a.alive||S.actions<=0)}`
  +`${btn('Back publicly · 6,000g','endorse',a.id,!a.alive||S.actions<=0||S.gold<6000)}${btn('Expose a boast · 1 action','expose',a.id,!a.alive||S.actions<=0)}</div>`)+`</section>`;
 const demand=S.event&&S.event.wants;
 const market=[stRow('Market value',fmtGold(valueOf(a)),demand===a.cls?`The market wants ${a.cls}s right now; that is in the price.`:''),
  stRow('Level',a.lvl,a.capKnown?(a.lvl>=a.cap?'At ceiling.':`Ceiling Lv ${a.cap}.`):'Ceiling unknown. Appraise to find out.'),
  stRow('Fame',Math.round(a.fame||0),tier?`${tier.grade}-class ${tier.name}.`:''),
  stRow('Reputation',`${(a.reputation||0)>0?'+':''}${a.reputation||0}`,''),
  stRow('Looks',`${a.attractiveness}/10`,'The market’s prejudice. It moves the price.'),
  stRow('Personality',mkKnowsPersonality(a)?esc(a.personality):'Unknown',mkKnowsPersonality(a)?(ST_PERSONA[a.personality]||''):'You read people in an interview.'),
  stRow('Feeling toward you',stWarmth(a.affection),'')].join('');
 const abil=(a.abilities&&a.abilities.length?a.abilities:[a.ability].filter(Boolean)).map(x=>`<li><b>${esc(x.name)}</b>${x.rarity&&x.rarity!=='common'?` <em>${esc(x.rarity)}</em>`:''}</li>`).join('');
 const events=(a.history||[]).slice(0,5).map(e=>`<li><small>Turn ${e.turn}</small><b>${esc(e.title)}</b><p>${esc(e.body)}</p></li>`).join('');
 return `<article class="mk">`
  +`<header class="mk-head"><div class="mk-art">${face(a,'large')}</div><div><h2 class="cs-name">${esc(a.name)}</h2><p class="cs-line">Lv ${a.lvl} ${esc(a.cls)} from ${esc(a.region)}${a.age?`, ${a.age}`:''}</p>`
  +`<p class="cs-epithet">${esc(a.epithet||jobTitle(a))}</p>${a.agenda?`<p class="mk-agenda">${esc(a.agenda)}</p>`:''}</div></header>`
  +hireBlock
  +(gone?'':`<div class="cs-blocks"><section class="cs-sec"><h2>On the market</h2><dl>${market}</dl>${abil?`<h3 class="cs-h3">Known for</h3><ul class="cs-abil">${abil}</ul>`:''}</section>`
  +`<section class="cs-sec"><h2>Word around</h2>${mkWordHtml(mkWord(a))}</section></div>`)
  +`<section class="cs-sec"><h2>Relationships</h2>${stWeb(a,false,true)}</section>`
  +`<section class="cs-sec"><h2>Recent events</h2>${events?`<ol class="mk-events">${events}</ol>`:'<p class="cs-empty">No shared history yet.</p>'}</section>`
  +`</article>`;}
const MK_CSS=`.mk{--rule:#879d9638;--bone:#eee9dc;--mist:#aab6b6;--gold:#dcb975;--verd:#8cc5a8;--emb:#e59986;--rose:#d9a0c0;color:var(--bone);font-variant-numeric:tabular-nums;max-width:1100px}
.mk-head{display:grid;grid-template-columns:200px 1fr;gap:28px;align-items:end;padding-bottom:22px}
.mk-art .portrait{width:200px;border:1px solid #dcb97566}.mk-agenda{margin:10px 0 0;max-width:62ch;line-height:1.55;color:#c6d2ce}
.mk-hire{border:1px solid #dcb97566;border-left:3px solid var(--gold);background:#172a33;padding:20px 24px;margin:4px 0 8px}
.mk-status{font-size:14px;color:var(--mist)}.mk-price{display:flex;align-items:baseline;gap:12px;margin:6px 0 10px}.mk-price b{font-size:30px;font-weight:400;color:var(--gold)}.mk-price span{color:var(--mist);font-size:13px}
.mk-ok{margin:0;color:var(--verd)}.mk-no{margin:0;padding-left:18px;color:var(--emb);line-height:1.6}.mk-warn{margin:8px 0 0;color:var(--warn,#dbba7d);font-size:13px}
.mk-events{list-style:none;margin:0;padding:0;display:grid;gap:14px}.mk-events small{display:block;color:var(--mist);font-size:11px}.mk-events b{font-weight:600}.mk-events p{margin:3px 0 0;color:var(--mist);font-size:13px;line-height:1.45;max-width:70ch}
@media(max-width:760px){.mk-head{grid-template-columns:110px 1fr}.mk-art .portrait{width:110px}}`;
(function(){const old=document.getElementById('mk-css');if(old)old.remove();const s=document.createElement('style');s.id='mk-css';s.textContent=MK_CSS;document.head.appendChild(s);})();
profile=function(a){if(!a)return '';return mkScreen(a);};
const mkPatchBase=render;
render=function(){const r=mkPatchBase.apply(this,arguments);try{if(screen==='profile'){const root=document.getElementById('living');const eb=root&&root.querySelector('.topbar .eyebrow'),h1=root&&root.querySelector('.topbar h1');if(eb)eb.textContent='On the market';if(h1)h1.textContent='What you know about them.';}}catch(e){}return r;};
