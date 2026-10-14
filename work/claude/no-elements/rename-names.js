/* No elements, names too (Muse playtest 2026-10-12: elemental card names survived #43; Robert
   2026-10-13: "Automatically choose appropriate names"). Cards and abilities whose names read as
   one of the old six elements (fire, lightning, frost, poison, holy/sun, shadow) are renamed.
   Applied to the composed build as text: every quoted occurrence of the old name (data and the
   logic that keys on it) becomes the new one, so behaviour is unchanged. Card ids, and so card
   art, are untouched. Effects keep working; only the words change.
   Saves: abilities stored under an old name are renamed on load (renameNoElementSave in the world). */
const NO_ELEMENT_NAMES={
 // cards: old -> new
 'BlazeWhirl':'Whirling Censer','Radiant Cleave':'Consecrated Cleave','Radiant Glare':'Blinding Glare','Sun-Blind':'Dazzle',
 'Rime Shell':'Bracing Shell','Toxic Cloud':'Choking Dust','Frostbite Slash':'Hamstring Slash','Venom Strike':'Bleeding Strike',
 'Thunderclap':'Earsplitter','Umbral Reaper':'Reaping Blow',
 // abilities
 'Radiant glare':'Glaring halo','Sun-blind':'Dazzling vestments','Pillar of fire':'Pillar of smoke','Storm-eye':'Patient eye',
 'Firebolt':'Force bolt','Spark':'First opening','Frost touch':'Numbing touch','Static field':'Warding field','Void-prick':'Needle-prick',
 'Chain lightning':'Ricochet bolt','Ice shards':'Glass shards','Frost lattice':'Binding lattice','Firestorm':'Rolling barrage','Sear':'Pinpoint',
 'Star-fire':'Starfall','Sun-Sworn Pyre':'The Last Sermon','Storm of shafts':'Volley of shafts','Shadow-quiver':'Hidden quiver',
 'Poisoned edge':'Serrated edge','Shadow-mask':'False shape','Venom':'Numbing draught','Shadow-armor':'Slipping armor',
 "Widow's poison":"Widow's kiss",'Shadow Without a Body':'The Body That Isn’t','Thunder-lance':'Breaking lance','Sunbreak helm':'Mirror helm',
 'Dagger-storm':'Dagger-flurry',
 // gear-granted support card
 'Cinder Ward':'Brace Ward'};
const NO_ELEMENT_TEXT={ // descriptions / effect text, matched as whole quoted strings
 'A hot opening':'An early opening','Arcs between targets':'Bounces between targets','Freezes a limb solid':'Locks a limb in place',
 'Freezes an opponent out of their turn':'Locks an opponent out of their turn','Heat that has no upper bound':'Force with no upper bound',
 'Burns through anything, anyone':'Cuts through anything, anyone','Bleeds them slowly while healing themselves':'Bleeds them slowly while healing themselves',
 'Gain 10 Guard and Chill adjacent enemies (Slow, 2 turns).':'Gain 10 Guard and Slow adjacent enemies (2 turns).',
 'Create a poison cloud (3 tiles): enemies inside take 4 at the start of their turn, 3 turns.':'Raise a choking cloud (3 tiles): enemies inside take 4 at the start of their turn, 3 turns.',
 'Deal 13 damage and Chill the target.':'Deal 13 damage and Slow the target.',
 'Deal 6 damage and Poison the target (3/turn, 3 turns).':'Deal 6 damage and Bleed the target (3/turn, 3 turns).',
 'Summons a brief fire tornado. Heavy, wide, and it lingers.':'A spinning sweep of the censer. Heavy, wide, and it lingers.',
 'A crack of thunder that drains far more energy than it should.':'A crack loud enough to drain far more energy than it should.',
 'Cold enough to slow the arm underneath the armor.':'Cuts deep enough to slow the arm underneath the armor.',
 'A brief flame ward — reduces the next hit taken by 30%.':'A brief ward — reduces the next hit taken by 30%.',
 'A shell of ice — absorbs the next hit like a Resolute stance.':'A braced shell — absorbs the next hit like a Resolute stance.',
 'Poisons the nearest threat over a few seconds.':'Chokes the nearest threat over a few seconds.'};
function applyNoElementNames(html,report){
 const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const one=(src,from,to)=>{let n=0;const re=new RegExp('(\\\\?["\'`])'+esc(from)+'(\\\\?["\'`])','g');
  const out=src.replace(re,(m,a,b)=>{n++;return a+to+b;});if(report)report[from]=n;return out;};
 for(const [k,v] of Object.entries(NO_ELEMENT_NAMES))html=one(html,k,v);
 for(const [k,v] of Object.entries(NO_ELEMENT_TEXT))html=one(html,k,v);
 return html;}
if(typeof module!=='undefined')module.exports={NO_ELEMENT_NAMES,NO_ELEMENT_TEXT,applyNoElementNames};
