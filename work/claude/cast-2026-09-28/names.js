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
 *   - a person's name draws on their home nation's two cultures, MELDED, not
 *     stacked: a mixed nation is one people with its own naming system (see
 *     NATIONS.md), never one culture's name wearing the other's surname
 *   - where the two traditions already rhyme (a shared name, a shared meaning)
 *     the system grows from that: convergence given names, doubled house names
 *   - pre-modern roots only: no nicknames or diminutives as given names, no
 *     numerals, no gamer tags, no modern trade or institution words
 *   - a name should say where its bearer is from, so no name sits in two
 *     regions' pools
 *   - a repeat in the same town is told apart by seniority ("the Younger"),
 *     never "Marta 2"
 * Newcomers are named from their region's pool (150+ names each). Picks hash the market seed and
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
  // Newcomer given names, 150+ per nation, grouped by origin (names-data.js;
  // NAMES.md is the browsable list). Mixed nations carry a `meld` group of
  // names that belong to the blended people, not just two lists side by side.
  var DATA = (typeof require === 'function' ? require('./names-data.js') : root.OW_NAMES_DATA).DATA;
  var POOLS = {};
  Object.keys(DATA).forEach(function (r) {
    POOLS[r] = [];
    Object.keys(DATA[r]).forEach(function (g) { POOLS[r] = POOLS[r].concat(DATA[r][g]); });
  });
  // Family and house names, per nation (data for named characters; NATIONS.md
  // explains each system: Roman nomina, Greek -ides, Iberian -ez patronymics,
  // Li Trice trade-houses, Ayusti doubled place-names, Irish-frontier names,
  // English stems with Lithuanian -aitis/-aite).
  var HOUSES = {
    'Marium':    ['Aurelius', 'Cornelius', 'Fabius', 'Claudius', 'Domitius', 'Flavius', 'Livius', 'Septimius'],
    'Themelios': ['Kleonides', 'Demetrides', 'Theodorides', 'Philippides', 'Aristides', 'Alexides'],
    'Reyjar':    ['Halvardez', 'Torvaldez', 'Eirikez', 'Ottarez', 'Sigurdez', 'Ragnez', 'Gudmundez'],
    'Li Trice':  ['Laque', 'Soie', 'Encre', 'Jonque', 'Sel', 'Papier', 'Lanterne'],
    'Ayusti':    ['Kawario', 'Moriselva', 'Yamaserra', 'Ishipedra', 'Umimar', 'Hoshiestrela'],
    'Beloufi':   ['Calloway', 'Tolliver', "O'Dell", 'Brannock', 'McTierney', 'Harkness', 'Gallagher', 'Quill'],
    'Edinius':   ['Godricaitis', 'Wulfaitis', 'Oswinaitis', 'Aldraitis', 'Edmundaitis', 'Harraitis']
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
  var API = { BASIS: BASIS, DATA: DATA, POOLS: POOLS, HOUSES: HOUSES, POOL: ALL, BLOCK: BLOCK, rename: rename };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_NAMES = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
