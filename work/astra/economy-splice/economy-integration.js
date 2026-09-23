// E1: economy mechanics in the established PR #34 world.
// The guild economy (payroll, missed-payroll departures, debt auctions of people
// and gear, poaching, free-agent market, class-demand shifts) is the accepted
// build's own world tick; S1 already runs it with dungeons live. This adapter
// only fixes how it reaches the player. No new gold sources or sinks, no new
// people, guilds or currencies, no save keys. Claude's module is untouched.

// E1.3 — Chronicle: one card per departure. releaseToMarket() writes a
// "departure" card and the same exit is also logged as flavour ("X walks out on
// Y"), which captureDispatch() turns into a second card. Whichever comes second
// folds into the first: departure title, the more specific line as the body.
const e1ExitLine=/walks out|packs quietly|\bleaves\b|out from under|works for them now|poach/i;
const e1Captured=new Set(['Word gets around','A price was paid','Someone comes out ahead','Guild business']);
const e1Title=t=>String(t).replace(/\.\.+$/,'.');
function e1CardFor(id,test){
  return (S.dispatches||[]).find(x=>x.turn===S.turn&&x.actors?.some(a=>a.id===id)&&test(x));
}
const e1NoteBase=note;
note=function(actors,title,body,effect,kind='drama'){
  const solo=(actors||[]).filter(Boolean);
  if(kind==='departure'&&solo.length===1){
    const flavour=e1CardFor(solo[0].id,x=>e1Captured.has(x.title)&&e1ExitLine.test(x.body||''));
    if(flavour){
      flavour.title=e1Title(title);flavour.effect=effect||flavour.effect;flavour.kind='departure';
      return;
    }
    return e1NoteBase(actors,e1Title(title),body,effect,kind);
  }
  return e1NoteBase(actors,title,body,effect,kind);
};
const e1CaptureBase=captureDispatch;
captureDispatch=function(text,cls){
  if(S?.castReady&&cls!=='digest'&&cls!=='turnmark'&&e1ExitLine.test(text)){
    const named=S.agents.filter(a=>text.includes(a.name));
    for(const a of named){
      const card=e1CardFor(a.id,x=>x.kind==='departure');
      if(!card)continue;
      card.body=text;
      for(const other of named)if(!card.actors.some(x=>x.id===other.id))
        card.actors.push({id:other.id,name:other.name,portrait:appearanceId(other),epithet:other.epithet,cls:other.cls});
      return;
    }
  }
  return e1CaptureBase(text,cls);
};

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
  return e1BookBase(mineId,partnerId);
};

const e1RenderBase=render;
render=function(){const r=e1RenderBase.apply(this,arguments);e1PatchAuctionCard();e1PatchBooking();return r;};
