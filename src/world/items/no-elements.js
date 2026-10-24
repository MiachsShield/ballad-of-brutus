/* No elements (Robert, 2026-10-11: "No elements, let's not convolute player need-to-know info").
   Elements stop being something the player has to track:
   - items are named by their base name (no "Flame"/"Storm"/... prefix) and carry no element tag;
   - on-hit and on-defense effects keep working but are described in plain terms;
   - element set bonuses (2 matching pieces) are off; boss sets will replace them.
   Granted cards are unchanged: a card is a card. The element key stays inside the proc only,
   because combat code uses it to pick which effect fires. */
const NE_OFFENSE_DESC={
 Fire:'18% chance on attack: 8 bonus damage.',Lightning:'15% chance on attack: 10 bonus damage.',
 Frost:'18% chance on attack: 5 bonus damage, and 6 extra energy drained.',Poison:'20% chance on attack: 4 damage now, 3 more a moment later.',
 Holy:'16% chance on attack: 6 bonus damage, and 4 HP back to Brutus.',Shadow:'14% chance on attack: 12 bonus damage.'};
function neScrub(item){
 if(!item)return item;
 if(item.element){item.name=item.baseName||item.name;delete item.element;}
 if(item.proc&&item.proc.kind==='offense'&&NE_OFFENSE_DESC[item.proc.element])item.proc.desc=NE_OFFENSE_DESC[item.proc.element];
 return item;
}
const neBaseGenerate=generateItem;
generateItem=function(rarity,lvlOrBias,forceSlot){return neScrub(neBaseGenerate(rarity,lvlOrBias,forceSlot));};
const neBaseLoadout=derivedLoadout;
derivedLoadout=function(whoId){const l=neBaseLoadout(whoId);if(l)l.setElements=[];return l;};
