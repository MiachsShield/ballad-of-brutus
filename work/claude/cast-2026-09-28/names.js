/* Names. Robert, 2026-09-28/10-01: period-appropriate names whose inspiration
 * follows each nation's phenotype basis (from his world bible, as relayed in
 * the 2026-10-01 table). The fame/epithet "celebrity" layer stays.
 *
 *   Marium    Roman             Themelios  Grecian
 *   Reyjar    Norse-Spanish     Li Trice   French-Chinese
 *   Ayusti    Japanese-Brazilian Beloufi   Americana-Irish
 *   Edinius   English-Lithuanian
 *
 * Rules:
 *   - a person's name draws on their home nation's two cultures; mixed-basis
 *     nations blend them the way real mixed communities do (a given name from
 *     one side, a surname from the other)
 *   - pre-modern roots only: no nicknames or diminutives as given names, no
 *     numerals, no gamer tags, no modern trade or institution words
 *   - a name should say where its bearer is from, so no name sits in two
 *     regions' pools
 *   - a repeat in the same town is told apart by seniority ("the Younger"),
 *     never "Marta 2"
 * Newcomers are named from their region's pool. Picks hash the market seed and
 * the person's id, so naming never touches the sim's random stream.
 * Names are ASCII so any UI font can show them. Ember and Wren are the
 * build's existing ally cast and keep their names.
 */
(function (root) {
  'use strict';
  var BASIS = {
    'Marium': 'Roman', 'Themelios': 'Grecian', 'Reyjar': 'Norse-Spanish', 'Li Trice': 'French-Chinese',
    'Ayusti': 'Japanese-Brazilian', 'Beloufi': 'Americana-Irish', 'Edinius': 'English-Lithuanian'
  };
  var POOLS = {
    'Marium':    ['Lucan', 'Aurelia', 'Cassian', 'Livia', 'Marcellus', 'Valeria', 'Quintus', 'Sabina', 'Decimus', 'Flavia', 'Rufus', 'Cornelia', 'Octavia', 'Severus'],
    'Themelios': ['Theron', 'Eudora', 'Callista', 'Demetra', 'Alexios', 'Zoe', 'Leandros', 'Kosmas', 'Ioanna', 'Stavros', 'Melina', 'Dorothea', 'Argyros', 'Xenia'],
    'Reyjar':    ['Halvard', 'Sigrun', 'Torvald', 'Ragna', 'Eirik', 'Gudrun', 'Ottar', 'Marta', 'Alonso', 'Leonor', 'Rodrigo', 'Beltran', 'Ximena', 'Sancho', 'Inigo'],
    'Li Trice':  ['Aimery', 'Mahaut', 'Guilhem', 'Berenger', 'Clemence', 'Hugues', 'Isaut', 'Brice', 'Meilin', 'Lanying', 'Wenzhao', 'Jinhai', 'Ruolan', 'Shuyi', 'Yingtai'],
    'Ayusti':    ['Haru', 'Ume', 'Kiku', 'Tomoe', 'Iori', 'Takeo', 'Saburo', 'Aoi', 'Tiago', 'Caetano', 'Luzia', 'Lourenco', 'Beatriz', 'Iara', 'Roque'],
    'Beloufi':   ['Cormac', 'Niall', 'Aoife', 'Orla', 'Brigid', 'Fionn', 'Maeve', 'Silas', 'Amos', 'Eben', 'Hepzibah', 'Prudence', 'Josiah', 'Gideon'],
    'Edinius':   ['Oswin', 'Wulfric', 'Godric', 'Hilda', 'Aldith', 'Cenred', 'Alfreda', 'Tamsin', 'Wilda', 'Vytas', 'Jurgis', 'Rasa', 'Daiva', 'Milda', 'Gedas', 'Aldona']
  };
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
    var region = p.m && p.m.region, pool = POOLS[region];
    if (!pool) { pool = POOLS.Marium; }                              // unknown region: still a period name
    var start = hash(String(s.nameSalt || '') + ':' + p.id) % pool.length, name = null;
    for (var k = 0; k < pool.length && !name; k++) {
      var cand = pool[(start + k) % pool.length];
      if (!taken(s, cand, p)) name = cand;
    }
    if (!name) {                                                   // every name in the region is in use
      var base = pool[start];
      for (var j = 0; j < SENIORITY.length && (!name || taken(s, name, p)); j++) name = base + ' ' + SENIORITY[j];
    }
    p.name = name; p.renamed = true;
    return name;
  }

  var ALL = []; Object.keys(POOLS).forEach(function (r) { ALL = ALL.concat(POOLS[r]); });
  var API = { BASIS: BASIS, POOLS: POOLS, POOL: ALL, BLOCK: BLOCK, rename: rename };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_NAMES = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
