/* Overworld adventurer layer — headless core.
 *
 * Robert's rulings, 2026-09-18:
 *  - NPC adventurers are met INSIDE the dungeon, as DRPG-style events.
 *  - The player may help them, take advantage of them, or leave them.
 *  - Outcomes depend on whether they SURVIVE. Nobody records what you did
 *    to a party that never came back up.
 *  - The roster is culled between waves. A high level is no immunity.
 *  - An enemy can assassinate even a high-level character.
 *    "No MMA fighter can survive a knife."
 *  - A party states its goal up front when you meet it.
 *
 * Deliberately has NO contact with combat, cards, rendering or the dungeon
 * build. It is a pure state machine: feed it encounters and ticks, read the
 * surviving roster and the ledger back out.
 *
 * Works in node (module.exports) and in the browser build (window.OW).
 */
(function (root) {
  'use strict';

  /* ---------------------------------------------------------------- rng --
   * Seeded so a wave can be replayed exactly. mulberry32.
   */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(rand, list) { return list[Math.floor(rand() * list.length) % list.length]; }

  /* ------------------------------------------------------------- traits --
   * A trait does not change what happens. It changes how the adventurer
   * READS what happened. Same act, different sentiment.
   */
  var TRAITS = {
    proud:      { desc: 'Being helped costs them something.' },
    pragmatic:  { desc: 'Counts outcomes, not manners.' },
    vengeful:   { desc: 'Grievances do not fade.' },
    kind:       { desc: 'Extends credit before it is earned.' },
    greedy:     { desc: 'Values the haul over the hand that offered it.' },
    cautious:   { desc: 'Retreats early, remembers who pushed them on.' },
    reckless:   { desc: 'Presses deeper than they should.' }
  };
  var TRAIT_KEYS = Object.keys(TRAITS);

  /* -------------------------------------------------------------- goals --
   * Stated up front on meeting (Robert, 2026-09-18). The goal is what makes
   * interference directional: you can further it, take it, or end it.
   */
  var GOALS = [
    { id: 'relic',   says: 'We came for the reliquary on the fourth floor.' },
    { id: 'rescue',  says: "We're pulling out a brother who went down and didn't come back." },
    { id: 'debt',    says: "We owe the guild more than we have. We don't go up empty." },
    { id: 'bounty',  says: "There's a bounty on something down here. We mean to collect." },
    { id: 'escort',  says: "We're paid to walk this one down and back. That's all." },
    { id: 'map',     says: "We're charting the lower halls. Nothing more." }
  ];

  var NAMES = ['Serel', 'Oduin', 'Marta', 'Cabel', 'Ysolde', 'Pike', 'Halvard', 'Nen',
               'Brice', 'Tamsin', 'Roque', 'Wilda', 'Aleg', 'Corr', '8fold', 'Mirin'];

  /* --------------------------------------------------------------- make --
   * An adventurer party. `capableTo` is the depth they can actually handle;
   * `depth` is where they are. The gap between those two is the whole sim.
   */
  function makeParty(rand, id, opts) {
    opts = opts || {};
    var tier = opts.tier != null ? opts.tier : 1 + Math.floor(rand() * 5);
    var traits = [];
    while (traits.length < 2) {
      var t = pick(rand, TRAIT_KEYS);
      if (traits.indexOf(t) === -1) traits.push(t);
    }
    return {
      id: id,
      name: opts.name || pick(rand, NAMES),
      traits: traits,
      tier: tier,
      goal: opts.goal || pick(rand, GOALS),
      hp: 100,
      supplies: 100,
      depth: 1,
      capableTo: tier + 1,          // honest ceiling; pressing past it is how they die
      alive: true,
      retired: false,               // walked out under their own power this wave
      causeOfDeath: null,
      metBrutus: false,
      wavesSurvived: 0
    };
  }

  /* Two parties called Brice makes the roster unreadable, and the roster is
   * the whole point. Suffix a repeat rather than reroll forever. */
  function nameUniquely(state, p) {
    var base = p.name, n = 2;
    while (state.usedNames[p.name]) p.name = base + ' ' + n++;
    state.usedNames[p.name] = true;
    return p;
  }

  /* ------------------------------------------------------------- ledger --
   * Not a score. Rows about events, each with its own lifespan.
   * Asymmetric by construction: (from -> to) is its own row.
   * Two axes so "I'd trust her at my back and I can't stand her" is sayable.
   */
  function Ledger() { this.rows = []; this.now = 0; }

  Ledger.prototype.write = function (from, to, tag, respect, warmth, decay) {
    this.rows.push({
      from: from, to: to, tag: tag,
      respect: respect, warmth: warmth,
      bornAt: this.now,
      decay: decay == null ? null : decay   // null = never fades
    });
  };

  Ledger.prototype.tick = function (n) {
    this.now += (n || 1);
    var now = this.now;
    this.rows = this.rows.filter(function (r) {
      return r.decay === null || (now - r.bornAt) < r.decay;
    });
  };

  /* Live feeling of `from` about `to`, summed over surviving rows. */
  Ledger.prototype.feeling = function (from, to) {
    var respect = 0, warmth = 0, tags = [];
    for (var i = 0; i < this.rows.length; i++) {
      var r = this.rows[i];
      if (r.from === from && r.to === to) {
        respect += r.respect; warmth += r.warmth; tags.push(r.tag);
      }
    }
    return { respect: respect, warmth: warmth, tags: tags };
  };

  /* Drop every row written BY or ABOUT a party. Called when they die:
   * the dead neither remember nor are remembered by the ledger. This is
   * what keeps the graph bounded without a scheduled purge. */
  Ledger.prototype.forget = function (id) {
    this.rows = this.rows.filter(function (r) { return r.from !== id && r.to !== id; });
  };

  /* What each tag SOUNDS like when the party brings it up. Sentiment is only
   * real to the player if they can see the specific thing it came from — a
   * number they cannot inspect reads as the game cheating. */
  var TAG_TEXT = {
    'owed-my-life':   'You pulled us out on the fourth floor.',
    'pitied-me':      "We didn't ask for your charity.",
    'useful-to-me':   'You were useful to us, once.',
    'walked-past-us': 'You walked past us.',
    'robbed-us':      'You took what we had and left us down there.',
    'turned-us-back': 'You turned us back.'
  };

  /* ------------------------------------------------------------ salient --
   * The one event the player should be shown. Impact first, recency as the
   * tie-break: a permanent grudge outranks a fresh slight, but between two
   * comparable rows the newer one is what is on their mind.
   */
  Ledger.prototype.salient = function (from, to) {
    var best = null, bestScore = -1;
    for (var i = 0; i < this.rows.length; i++) {
      var r = this.rows[i];
      if (r.from !== from || r.to !== to) continue;
      var score = Math.abs(r.warmth) * 1.5 + Math.abs(r.respect);
      if (r.decay === null) score *= 1.5;          // it never faded; it matters
      if (score > bestScore || (score === bestScore && best && r.bornAt > best.bornAt)) {
        best = r; bestScore = score;
      }
    }
    if (!best) return null;
    return {
      tag: best.tag,
      says: TAG_TEXT[best.tag] || best.tag,
      permanent: best.decay === null,
      age: this.now - best.bornAt
    };
  };

  /* ------------------------------------------------------------- stance --
   * Sentiment the player can SEE, because it comes out in behaviour rather
   * than a meter. Warmth and respect are read as two independent axes, so
   * "I'd trust him at my back and I can't stand him" is a real stance.
   *
   * Deliberately NOT a ladder. There is no progression from hostile to
   * loyal to climb: a stance is just where the surviving rows currently
   * put them, and one event can move it in either direction.
   */
  function stance(state, partyId) {
    var L = state.ledger, B = 'brutus';
    var f = L.feeling(partyId, B);
    var warm = f.warmth, resp = f.respect;
    var WT = 2, RT = 2;                      // dead-band; below this they simply do not care
    var key, acts;

    if (Math.abs(warm) < WT && Math.abs(resp) < RT) {
      key = 'indifferent';
      acts = ['passes without stopping'];
    } else if (warm >= WT && resp >= RT) {
      key = 'loyal';
      acts = ['greets him first', 'shares what they found', 'will follow his lead'];
    } else if (warm >= WT) {
      key = 'fond';
      acts = ['glad to see him', 'talks freely', 'will not take his orders'];
    } else if (resp >= RT) {
      key = 'wary';
      acts = ['keeps their distance', 'answers straight', 'watches his hands'];
    } else if (warm <= -5) {
      key = 'hostile';
      acts = ['refuses to deal', 'warns other parties off him', 'may open first'];
    } else {
      key = 'cold';
      acts = ['gives him nothing', 'moves on quickly'];
    }

    return {
      key: key,
      warmth: warm,
      respect: resp,
      acts: acts,
      because: L.salient(partyId, B)       // the event to surface alongside it
    };
  }

  /* Player-facing one-liner: stance, then the reason for it. */
  function describeStance(state, partyId) {
    var p = state.roster[partyId];
    if (!p) return null;
    var s = stance(state, partyId);
    var line = p.name + ' — ' + s.key;
    if (s.because) line += '  "' + s.because.says + '"';
    return line;
  }

  /* ----------------------------------------------------------- encounter --
   * One meeting, one verb. The verb decides what happened; the TRAIT decides
   * what it meant. Rows are written on both sides — Brutus forms an opinion
   * too, which is what later makes an old survivor worth recognising.
   */
  var VERBS = ['aid', 'ignore', 'exploit', 'obstruct'];

  var PERMANENT = null;   // readability at the call sites
  var LONG = 400;
  var SHORT = 120;

  function encounter(state, partyId, verb) {
    var p = state.roster[partyId];
    if (!p || !p.alive) return null;
    var L = state.ledger, B = 'brutus';
    p.metBrutus = true;

    var has = function (t) { return p.traits.indexOf(t) !== -1; };
    var note;

    if (verb === 'aid') {
      p.hp = Math.min(100, p.hp + 25);
      p.supplies = Math.min(100, p.supplies + 15);
      if (has('proud'))       { L.write(partyId, B, 'pitied-me', 2, -1, LONG);  note = 'Takes the help stiffly.'; }
      else if (has('greedy')) { L.write(partyId, B, 'useful-to-me', 1, 1, SHORT); note = 'Takes it, eyes the haul.'; }
      else                    { L.write(partyId, B, 'owed-my-life', 2, 3, LONG);  note = 'Owes him, and says so.'; }
      L.write(B, partyId, 'spent-on-them', 0, 1, LONG);

    } else if (verb === 'ignore') {
      if (has('kind'))        { L.write(partyId, B, 'walked-past-us', 0, -1, SHORT); note = 'Assumes he had his reasons.'; }
      else if (has('vengeful')){ L.write(partyId, B, 'walked-past-us', 0, -2, PERMANENT); note = 'Marks it down.'; }
      else                    { L.write(partyId, B, 'walked-past-us', 0, -1, LONG); note = 'Notices, says nothing.'; }

    } else if (verb === 'exploit') {
      p.supplies = Math.max(0, p.supplies - 45);
      p.hp = Math.max(1, p.hp - 15);
      // The gamble: this row only ever matters if they climb back out.
      if (has('vengeful'))    { L.write(partyId, B, 'robbed-us', 1, -5, PERMANENT); note = 'Will come looking.'; }
      else if (has('pragmatic')){ L.write(partyId, B, 'robbed-us', 2, -3, LONG);    note = 'Prices him as a threat.'; }
      else                    { L.write(partyId, B, 'robbed-us', 1, -4, LONG);      note = 'Shaken, and bitter.'; }
      L.write(B, partyId, 'took-from-them', 0, -1, LONG);

    } else if (verb === 'obstruct') {
      // Turn them back. Cruel in the moment, and the single best way to
      // keep someone alive — which they will not thank him for.
      // We push their intent, not their skill: capableTo is untouched.
      p.depth = Math.max(1, p.depth - 1);
      p.goalDenied = true;
      if (has('reckless'))    { L.write(partyId, B, 'turned-us-back', -1, -3, LONG); note = 'Furious. Wanted the floor.'; }
      else if (has('cautious')){ L.write(partyId, B, 'turned-us-back', 1, 2, LONG);  note = 'Privately relieved.'; }
      else                    { L.write(partyId, B, 'turned-us-back', 0, -2, LONG);  note = 'Resents the loss of the run.'; }
      L.write(B, partyId, 'sent-them-up', 0, 0, SHORT);
    } else {
      throw new Error('unknown verb: ' + verb);
    }

    state.log.push({ t: L.now, party: partyId, name: p.name, verb: verb, note: note });
    return { party: p, note: note };
  }

  /* ---------------------------------------------------------------- sim --
   * They keep running after Brutus walks away. Nothing here is authored:
   * a party lives or dies on state vs depth vs capability.
   */
  function stepParty(rand, state, p) {
    if (!p.alive || p.retired) return;

    var strain = p.depth - p.capableTo;           // >0 means out of their depth
    var hurt = p.hp < 45, dry = p.supplies < 25;
    var reckless = p.traits.indexOf('reckless') !== -1;
    var cautious = p.traits.indexOf('cautious') !== -1;

    // Decide: press on, or turn back?
    var wantsOut = (hurt || dry || strain > 0);
    if (cautious) wantsOut = wantsOut || (p.hp < 65);
    if (reckless) wantsOut = wantsOut && (p.hp < 30);
    // A party that owes money does not go up empty, and that kills them.
    if (p.goal.id === 'debt' && p.supplies > 5 && p.hp > 20) wantsOut = false;

    if (wantsOut) {
      p.depth -= 1;
      if (p.depth <= 0) { p.retired = true; p.depth = 0; return; }
    } else {
      p.depth += 1;
    }

    // Attrition, then the roll. Risk is driven by how far past their
    // ceiling they are — not by a scripted outcome.
    p.supplies = Math.max(0, p.supplies - (6 + Math.floor(rand() * 8)));
    var over = Math.max(0, p.depth - p.capableTo);
    var risk = 0.04 + over * 0.17 + (p.supplies < 15 ? 0.10 : 0) + (p.hp < 35 ? 0.10 : 0);
    if (rand() < risk) {
      p.hp -= 25 + Math.floor(rand() * 40);
      if (p.hp <= 0) {
        p.alive = false;
        p.causeOfDeath = over > 0 ? 'went too deep' : 'bad floor';
        state.ledger.forget(p.id);
        state.log.push({ t: state.ledger.now, party: p.id, name: p.name,
                         verb: 'died', note: p.causeOfDeath + ' at depth ' + p.depth });
      }
    }
  }

  /* --------------------------------------------------- the knife (state) --
   * Not a damage check. If the blow lands while they are undefended, it is
   * lethal at any tier. Symmetric — pass Brutus in and it kills him too.
   */
  function assassinate(state, targetId, ctx) {
    ctx = ctx || {};
    var defended = !!ctx.defended;          // aware, armed, in company, in a window
    var p = state.roster[targetId];
    if (!p || !p.alive) return { killed: false, why: 'no target' };
    if (defended) return { killed: false, why: 'defended — the window did not open' };
    p.alive = false;
    p.causeOfDeath = 'assassinated' + (ctx.by ? ' by ' + ctx.by : '');
    state.ledger.forget(targetId);
    state.log.push({ t: state.ledger.now, party: targetId, name: p.name,
                     verb: 'assassinated', note: ctx.by || 'unknown hand' });
    return { killed: true, why: 'undefended' };
  }

  /* --------------------------------------------------------------- wave --
   * A wave is a run of ticks. Afterwards the roster is whatever survived —
   * the cull is the sim doing its job, not a scheduled purge.
   */
  function newState(seed, size) {
    var rand = rng(seed == null ? 1 : seed);
    var state = { rand: rand, roster: {}, ledger: new Ledger(), log: [], wave: 0,
                  usedNames: {} };
    for (var i = 0; i < (size || 8); i++) {
      var p = makeParty(rand, 'p' + i);
      nameUniquely(state, p);
      state.roster[p.id] = p;
    }
    return state;
  }

  function runWave(state, ticks) {
    state.wave += 1;
    ticks = ticks || 10;
    for (var t = 0; t < ticks; t++) {
      for (var id in state.roster) stepParty(state.rand, state, state.roster[id]);
      state.ledger.tick(1);
    }
    var survivors = [], lost = [];
    for (var k in state.roster) {
      var p = state.roster[k];
      if (p.alive) { p.wavesSurvived += 1; p.depth = 1; p.retired = false;
                     p.hp = Math.min(100, p.hp + 40); p.supplies = 100; survivors.push(p); }
      else lost.push(p);
    }
    // Cull: the dead leave the roster entirely.
    lost.forEach(function (p) { delete state.roster[p.id]; });
    return { survivors: survivors, lost: lost };
  }

  /* Refill the roster between waves with newcomers who know nothing. */
  function repopulate(state, upTo) {
    var n = Object.keys(state.roster).length, i = 0;
    while (n < upTo) {
      var p = makeParty(state.rand, 'w' + state.wave + '_' + (i++));
      nameUniquely(state, p);
      state.roster[p.id] = p; n++;
    }
  }

  var API = {
    rng: rng, TRAITS: TRAITS, GOALS: GOALS, VERBS: VERBS,
    Ledger: Ledger, makeParty: makeParty, nameUniquely: nameUniquely,
    newState: newState, encounter: encounter, stepParty: stepParty,
    stance: stance, describeStance: describeStance, TAG_TEXT: TAG_TEXT,
    runWave: runWave, repopulate: repopulate, assassinate: assassinate
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW = API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
