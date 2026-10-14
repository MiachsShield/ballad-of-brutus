/* Deck state for the overworld status screen (Robert, 2026-10-13: "I should see the deck, and
   used up cards greyed out"). The world reads this through the shell while an expedition is
   paused ("View world"); nothing is sent, no message types added. "Used" = in the discard pile;
   when the draw pile runs dry the discard is shuffled back in, and the cards come back. */
window.brutusDeckState=function(){
 try{
  if(trainingMode||!dungeonInitialized||!brutus||cardSelectionPending)return null;
  const rows=new Map();
  const row=id=>{const c=CARDS[id]||{};const k=c.name||id;if(!rows.has(k))rows.set(k,{name:k,tier:c.tier||'',cost:c.cost!=null?c.cost:null,fromItem:c.fromItem||null,draw:0,hand:0,used:0});return rows.get(k);};
  for(const id of deck)row(id).draw++;
  for(const id of hand)if(id)row(id).hand++;
  for(const id of (bonusCards||[]))row(id).hand++;
  for(const id of discard)row(id).used++;
  return{discipline:cardDiscipline,cards:[...rows.values()],draw:deck.length,hand:hand.filter(Boolean).length+(bonusCards||[]).length,used:discard.length};
 }catch(e){return null;}
};
