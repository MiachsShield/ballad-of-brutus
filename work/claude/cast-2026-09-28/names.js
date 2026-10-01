/* Names. Robert, 2026-09-28: "Although I do have this 'celebrity' system,
 * let's get away from anachronistic names."
 *
 * Reading: the fame/epithet layer stays (a star can be "the Ox"), but the
 * names underneath should sit in a pre-modern world. Rules used here:
 *   - given names with pre-modern roots (Norse, Latin/Greek, Slavic, Old
 *     French/Occitan, Insular Celtic, North African), no nation lore implied
 *   - no nicknames or diminutives as given names, no numerals, no gamer tags
 *   - no modern trade or institution words in names or epithets
 *   - duplicates are told apart the way the period did it: by home region
 *     ("Marta of Beloufi"), then by seniority ("the Younger"), never "Marta 2"
 * Newcomers are named from this pool. Picks come from a hash of the market's
 * seed and the person's id, so naming never touches the sim's random stream.
 * Ember and Wren are the build's existing ally cast and are left as they are.
 */
(function (root) {
  'use strict';
  var POOL = [
    'Serel', 'Oduin', 'Marta', 'Cabel', 'Ysolde', 'Halvard', 'Brice', 'Tamsin', 'Roque', 'Wilda', 'Mirin', 'Aleg',
    'Sigrun', 'Torvald', 'Ragna', 'Eirik', 'Gudrun', 'Wulfric', 'Godric', 'Hilde', 'Ottar', 'Ingrith',
    'Cassian', 'Aurelia', 'Lucan', 'Callista', 'Theron', 'Livia', 'Marcellus', 'Eudora',
    'Radomir', 'Jarmila', 'Stanimir', 'Vesna', 'Bogdan',
    'Berenger', 'Aimery', 'Mahaut', 'Guilhem',
    'Idris', 'Zahra', 'Tariq', 'Samira',
    'Cadoc', 'Teilo'
  ];
  var SENIORITY = ['the Younger', 'the Elder', 'the Third'];
  // Lint: things that must never show up in a name or epithet.
  var BLOCK = /\d|tibby|bookmaker|freelance|brigade|\bmvp\b|\bceo\b|\bokay\b/i;

  function hash(str) {                                            // FNV-1a
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h;
  }
  function taken(s, name, self) {
    for (var id in s.roster) if (s.roster[id] !== self && s.roster[id].name === name) return true;
    return false;
  }

  // Rename an unnamed newcomer (called once, when the market first sees them).
  function rename(s, p) {
    if (p.sheet || p.renamed) return p.name;
    var start = hash(String(s.nameSalt || '') + ':' + p.id) % POOL.length, name = null;   // salt = the market's seed, so seasons differ
    for (var k = 0; k < POOL.length && !name; k++) {
      var cand = POOL[(start + k) % POOL.length];
      if (!taken(s, cand, p)) name = cand;
    }
    if (!name) {                                                   // every plain name is in use: tell them apart
      var base = POOL[start], region = p.m && p.m.region;
      name = region ? base + ' of ' + region : base;
      for (var j = 0; taken(s, name, p) && j < SENIORITY.length; j++) name = base + ' of ' + region + ' ' + SENIORITY[j];
    }
    p.name = name; p.renamed = true;
    return name;
  }

  var API = { POOL: POOL, BLOCK: BLOCK, rename: rename };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_NAMES = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
