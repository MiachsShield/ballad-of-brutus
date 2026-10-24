/* Dungeon half of the single deck choice: if the overworld sent a deck on the loadout, use it
   and skip "What does Brutus bring into the dark?". Without one (standalone dungeon, old saves),
   the prompt still appears as before. Training is untouched. */
let dkPendingDeck=null;
const dkBaseApplyLoadout=applyEquipmentLoadout;
applyEquipmentLoadout=function(loadout){dkPendingDeck=loadout&&['Warrior','Priest'].includes(loadout.deck)?loadout.deck:null;return dkBaseApplyLoadout.apply(this,arguments);};
const dkStartBase=start;
start=function(){const r=dkStartBase.apply(this,arguments);if(!trainingMode&&dkPendingDeck&&cardSelectionPending&&chooseCardDiscipline(dkPendingDeck))logMsg(`${dkPendingDeck} deck in hand.`);return r;};
