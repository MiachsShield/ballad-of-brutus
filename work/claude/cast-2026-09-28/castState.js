/* Wires the authored cast (cast.js) into the overworld sim (adventurers.js).
 *
 * seedFromCast(seed) returns a normal OW state whose roster is the ten
 * authored adventurers instead of random parties. Everything downstream
 * (encounter, advanceWave, gossip, rivalry, knife) works unchanged.
 *
 *  - name, traits, tier come from the sheet; capableTo stays tier + 1.
 *  - goal is still rolled by the sim (sheets don't author goals yet).
 *  - p.sheet carries the full authored sheet for UI / later systems.
 *  - Pre-existing ties are written as permanent ledger rows both ways
 *    ('old-ties': respect +2, warmth +3). Death drops them, as the sim
 *    already does for every row.
 *
 * Does NOT touch adventurers.js, sim.js, the dungeon, or builds/.
 */
(function (root) {
  'use strict';
  var OW = (typeof require === 'function') ? require('../overworld-2026-09-18/adventurers.js') : root.OW;
  var C  = (typeof require === 'function') ? require('./cast.js') : root.OW_CAST;

  function seedFromCast(seed) {
    // newState treats size 0 as the default 8, so clear its random parties.
    var s = OW.newState(seed == null ? 1 : seed, 1);
    s.roster = {}; s.usedNames = {};
    C.CAST.forEach(function (sheet) {
      var p = OW.makeParty(s.rand, sheet.id, { name: sheet.name, tier: sheet.tier });
      p.traits = sheet.traits.slice();
      p.sheet = sheet;
      OW.nameUniquely(s, p);
      s.roster[p.id] = p;
    });
    C.CAST.forEach(function (sheet) {
      sheet.ties.forEach(function (t) {
        if (s.roster[t.with]) s.ledger.write(sheet.id, t.with, 'old-ties', 2, 3, null);
      });
    });
    return s;
  }

  var API = { seedFromCast: seedFromCast };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_CAST_STATE = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
