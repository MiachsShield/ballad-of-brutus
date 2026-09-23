// E1: economy mechanics in the established PR #34 world.
// The guild economy (payroll, missed-payroll departures, debt auctions of people
// and gear, poaching, free-agent market, class-demand shifts) is the accepted
// build's own world tick; S1 already runs it with dungeons live. This adapter
// only fixes how it reaches the player. No new gold sources or sinks, no new
// people, guilds or currencies, no save keys. Claude's module is untouched.

// E1.3 — Chronicle: one card per event, and only the events that matter to
// Brutus in full. The world tick writes a structural card for each departure,
// death and poaching, the same moment again as a flavour line ("X walks out on
// Y", "X is dead…", "Z pulls X away…") that captureDispatch() turns into a
// second card, and often a third for the reputation hit that follows. All of
// it folds into one card per person per event, in either order.
const e1Flavour={
  death:/\bdied\b|\bdead\b|\bkill|didn.t come back|doesn.t survive|assassinat/i,
  poach:/pulls .+ away from|contested contract|picks .+ over|works for them now|out from under/i,
  departure:/walks out|packs quietly|\bleaves\b|doesn.t work for free|out from under/i};
const e1Captured=new Set(['Word gets around','A price was paid','Someone comes out ahead','Guild business']);
const e1Title=t=>String(t).replace(/\.\.+$/,'.');
function e1EventKind(kind,title){
  if(kind==='death')return 'death';
  if(kind==='departure')return 'departure';
  if(/ is poached\.$/.test(title))return 'poach';
  return null;
}
function e1FlavourKind(text){for(const k of ['death','poach','departure'])if(e1Flavour[k].test(text))return k;return null;}
function e1SameGuildPoach(text){const m=String(text).match(/^(.+?) (?:pulls .+? away from|wins the contested contract away from|pulls the contract away from) (.+?)\.?$/);return !!m&&m[1]===m[2];}
function e1Find(id,test){return (S.dispatches||[]).find(x=>x.turn===S.turn&&x.actors?.some(a=>a.id===id)&&test(x));}
function e1Drop(card){
  S.dispatches=S.dispatches.filter(x=>x!==card);
  for(const a of S.agents)if(a.history?.includes(card))a.history=a.history.filter(x=>x!==card);
}
function e1Absorb(card,id){             // fold a same-turn reputation card into the event card
  const rep=e1Find(id,x=>x.kind==='reputation'&&x!==card);
  if(!rep)return;
  const m=rep.body.match(/from (-?\d+) to (-?\d+)/);
  if(m)card.effect=[card.effect,`standing ${m[1]} → ${m[2]}`].filter(Boolean).join(' · ');
  e1Drop(rep);
}
const e1NoteBase=note;
note=function(actors,title,body,effect,kind='drama'){
  const solo=(actors||[]).filter(Boolean);
  const ev=e1EventKind(kind,title);
  if(ev==='poach'&&e1SameGuildPoach(body))return;        // "Jade Accord pulls … away from Jade Accord": nothing moved
  if(ev&&solo.length===1){
    const id=solo[0].id;
    const flavour=e1Find(id,x=>!x.e1Event&&e1Captured.has(x.title)&&e1FlavourKind(x.body||'')===ev);
    if(flavour){
      Object.assign(flavour,{title:e1Title(title),effect:effect||flavour.effect,kind,e1Event:ev});
      e1Absorb(flavour,id);return;
    }
    e1NoteBase(actors,e1Title(title),body,effect,kind);
    S.dispatches[0].e1Event=ev;e1Absorb(S.dispatches[0],id);return;
  }
  if(kind==='reputation'&&solo.length===1){
    const card=e1Find(solo[0].id,x=>x.e1Event);
    const m=String(body).match(/from (-?\d+) to (-?\d+)/);
    if(card&&m){card.effect=[card.effect,`standing ${m[1]} → ${m[2]}`].filter(Boolean).join(' · ');return;}
  }
  return e1NoteBase(actors,title,body,effect,kind);
};
const e1CaptureBase=captureDispatch;
captureDispatch=function(text,cls){
  if(S?.castReady&&cls!=='digest'&&cls!=='turnmark'){
    if(e1SameGuildPoach(text))return;
    const ev=e1FlavourKind(text);
    if(ev){
      const named=S.agents.filter(a=>text.includes(a.name));
      for(const a of named){
        const card=e1Find(a.id,x=>x.e1Event===ev);
        if(!card)continue;
        card.body=text;
        for(const other of named)if(!card.actors.some(x=>x.id===other.id))
          card.actors.push({id:other.id,name:other.name,portrait:appearanceId(other),epithet:other.epithet,cls:other.cls});
        return;
      }
    }
  }
  return e1CaptureBase(text,cls);
};

// Pacing (design doc: one prominent thing at a time; everything else resolves in
// the background and surfaces only when consequential). At the end of each turn
// the Chronicle keeps, in full, every card touching someone Brutus has dealt with:
// his company past and present, the named cast, anyone he has visited, gifted,
// interviewed, bought or staged, anyone holding a memory of him, and anything
// naming him. Strangers' churn becomes one "Elsewhere" card with counts. Their
// cards stay in their own People histories; nothing is deleted from the world.
function e1Met(){return (S.e1Met=S.e1Met||[]);}
function e1Meet(id){if(id!=null&&!e1Met().includes(id))e1Met().push(id);}
function e1Known(id){
  const a=S.agents.find(x=>x.id===id);
  if(!a)return true;                                   // not a world agent: don't hide it
  return !!(a.castKey||a.core||a.joined||S.roster.some(x=>x.id===id)||e1Met().includes(id)||
    (a.memory&&'Brutus' in a.memory)||(a.grudges||0)>0);
}
const e1Mentions=x=>/\bBrutus\b|\byou\b|\byour\b/i.test((x.title||'')+' '+(x.body||''));
function e1Quiet(fromSeq){
  const counts={};
  for(const x of S.dispatches||[]){
    if(x.id<=fromSeq||!x.actors?.length||x.kind==='routine')continue;
    if(x.actors.some(a=>e1Known(a.id))||e1Mentions(x)||x.kind==='revenge'||x.kind==='dungeon')continue;
    const k=x.e1Event||(x.kind==='reputation'?'reputation':'other');
    counts[k]=(counts[k]||0)+1;
    x.e1Kind=x.kind;x.kind='routine';
  }
  const n=(k,one,many)=>counts[k]?`${counts[k]} ${counts[k]>1?many:one}`:'';
  const parts=[n('departure','walked out','walked out'),n('death','died','died'),n('poach','changed guilds','changed guilds'),n('other','other stories','other stories')].filter(Boolean);
  if(!parts.length)return;
  e1NoteBase([],'Elsewhere on the Continent',`Among people Brutus hasn't dealt with: ${parts.join(', ')}. Names are in People and the Guild market.`,'','major');
  // headlines first: the summary sits under this turn's own stories
  const card=S.dispatches.shift(),at=S.dispatches.findIndex(x=>x.turn<card.turn);
  S.dispatches.splice(at<0?S.dispatches.length:at,0,card);
}
for(const [get,set] of [[()=>visit,f=>visit=f],[()=>gift,f=>gift=f],[()=>startInterview,f=>startInterview=f]]){
  const base=get();set(function(id){e1Meet(id);return base.apply(this,arguments);});
}
{
  const base=bidOnLot;
  bidOnLot=function(auctionId,lotIdx){
    const lot=(S.auctions||[]).find(x=>x.id===auctionId)?.lots[lotIdx];
    if(lot?.kind==='person')e1Meet(lot.agentId);
    return base.apply(this,arguments);
  };
}
{
  const base=endTurn;
  endTurn=function(){
    for(const m of S.roster||[])e1Meet(m.id);
    const seq=S.dispatchSeq||0,r=base.apply(this,arguments);
    if((S.dispatchSeq||0)>seq){e1Quiet(seq);render();}
    return r;
  };
}

// E1.4 — Auction integrity. A guild under its runway floor can open a sale on
// consecutive turns while the last one is still live (lots last two turns), so
// the same person or item was listed twice. One identity = one live lot: the
// earlier listing stands, later duplicates are dropped, empty sales removed.
// Sales from one guild sit together; the purse shows once for the whole card.
const e1LotKey=l=>l.kind==='person'?'p:'+l.agentId:'i:'+(l.item?.id??l.name);
function e1DedupeAuctions(){
  const seen=new Set();
  const live=(S.auctions||[]).slice().sort((a,b)=>a.turn-b.turn||a.id-b.id);
  for(const auc of live){
    auc.lots=auc.lots.filter(l=>{if(l.sold)return true;const k=e1LotKey(l);if(seen.has(k))return false;seen.add(k);return true;});
  }
  S.auctions=live.filter(a=>a.lots.some(l=>!l.sold))
    .sort((a,b)=>a.guildName.localeCompare(b.guildName)||a.turn-b.turn);
}
const e1AuctionBase=auctionTick;
auctionTick=function(){e1AuctionBase();e1DedupeAuctions();};

function e1PatchAuctionCard(){
  const body=document.getElementById('auctionBody');
  if(!body||!body.children.length)return;
  let lastGuild=null;
  for(const el of [...body.children]){
    const purse=el.querySelector?.('span[style*="float:right"]');
    if(!purse)continue;                       // lot rows have no float span
    purse.remove();
    const guild=el.textContent.trim();
    if(guild===lastGuild)el.remove();else lastGuild=guild;
  }
  if(!body.querySelector('[data-e1-purse]')){
    const p=document.createElement('div');p.dataset.e1Purse='';
    p.style.cssText='font-size:12px;color:var(--gold);margin:2px 0 6px';
    p.textContent='Your purse: '+fmtGold(S.gold||0);
    body.prepend(p);
  }
}

// E1.5 — "Book with Ember (143k g)". The control stages one of Brutus's own
// celebrities beside a rival guild's name: the fee goes to that guild, both gain
// fame, it costs an action, and nobody changes guild. The old label read like
// hiring Ember. Relabel, explain, and disable (with the reason) when the click
// could not do anything — hostile guild, a slandered name, short purse.
function e1BookingState(mine,partner){
  const og=Object.values(S.guilds).find(g=>g.name===partner.affiliation);
  const fee=og?Math.round(marketability(partner)*COLLAB_FEE_PER_MKT):0;
  let blocked='';
  if(S.actions<=0)blocked='No actions left this turn.';
  else if(og&&(og.hostility||0)>=3)blocked=`${og.name} won't share a stage with your people.`;
  else if((mine.slanderedUntil||0)>S.turn||(partner.slanderedUntil||0)>S.turn)blocked='A slandered name — nobody will stage them until it blows over.';
  else if((S.gold||0)<fee)blocked=`You have ${fmtGold(S.gold||0)}.`;
  return {og,fee,blocked};
}
function e1PatchBooking(){
  for(const card of document.querySelectorAll('#agents .adv')){
    const b=[...card.querySelectorAll('button')].find(x=>/^Book with /.test(x.textContent));
    if(!b)continue;
    const name=card.querySelector('.advName')?.firstChild?.textContent.trim();
    const guild=(card.querySelector('.advMeta')?.textContent.match(/signed with (.+?)(?: · |$)/)||[])[1];
    const matches=S.agents.filter(a=>a.alive&&a.name===name&&a.affiliation===guild);
    const mine=S.roster.filter(m=>m.alive&&celebTierIdx(m)>=1).sort((x,y)=>marketability(y)-marketability(x))[0];
    if(matches.length!==1||!mine){b.remove();continue;}   // can't tell who it books: don't offer it
    const partner=matches[0],st=e1BookingState(mine,partner);
    b.textContent=`Stage ${mine.name} with ${partner.name} · ${fmtGold(st.fee)}`;
    b.title=`Joint appearance, not a signing. Pay ${partner.affiliation} ${fmtGold(st.fee)} to put ${partner.name} on stage beside ${mine.name}. `+
      `Both gain fame (more if they click); ${partner.name} stays with ${partner.affiliation}. Uses 1 action.`+(st.blocked?' — '+st.blocked:'');
    b.disabled=!!st.blocked;b.style.opacity=st.blocked?'.4':'';
    b.onclick=()=>bookAppearance(mine.id,partner.id);
  }
}
// The one silent failure left in bookAppearance: doCollab() refuses slandered
// names without a word. Say so instead of eating the click.
const e1BookBase=bookAppearance;
bookAppearance=function(mineId,partnerId){
  const mine=S.roster.find(x=>x.id===mineId),partner=S.agents.find(x=>x.id===partnerId);
  if(mine&&partner&&((mine.slanderedUntil||0)>S.turn||(partner.slanderedUntil||0)>S.turn)){
    logMsg(`Nobody will stage ${partner.name} beside ${mine.name} while a slander is fresh.`,'bad');render();return;
  }
  e1Meet(partnerId);
  return e1BookBase(mineId,partnerId);
};

const e1RenderBase=render;
render=function(){const r=e1RenderBase.apply(this,arguments);e1PatchAuctionCard();e1PatchBooking();return r;};
