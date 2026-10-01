/* Labor-market playtest cast — 10 authored adventurers.
 *
 * Robert's rulings, 2026-09-28 (this session):
 *  - Recruitment is INVESTING, not upkeep: favors, gifts, dungeon rescues,
 *    funding their runs. No wages.
 *  - Temporary join (guest run, lasts until THEY decide) -> permanent join
 *    is the payoff. Either side can ask. Permanent members don't leave
 *    easily; dismissing one costs renown and earns a grudge.
 *  - Desires are grounded, "like real people": gold, a strong guild, or a
 *    guild with their friends. A mix with one dominant. Partly visible.
 *    Desires shift with their fortunes.
 *  - Known classes only. Tone exaggerated in BOTH directions.
 *  - A pair or two of pre-existing ties.
 *
 * DATA ONLY. Nothing here is wired into sim.js, the dungeon, or builds/.
 * Attaches as window.OW_CAST in the browser, module.exports in node.
 *
 * Combat numbers are SCALES against Brutus's baseline (1.0 = Brutus), not
 * absolute values, so they can't drift from the build's real HP/energy.
 * Everything numeric is first-pass and meant to be argued with.
 *
 * Names (Robert, 2026-09-28: no anachronistic names; epithets are the
 * "celebrity" layer and stay): see names.js for the rules. ids are stable
 * code keys and do NOT track display names (id 'pell' is now Perrin Dao, id
 * 'morrow' is Nikandros, id 'tibby' is Mabel Quill). Ember and Wren are the
 * build's existing ally cast and keep their names.
 */
(function (root) {
  'use strict';

  // Known classes in the current build / cast. Barbarian is planned, not in.
  var CLASSES = ['Warrior', 'Priest', 'Mage', 'Archer'];

  // Ally AI archetypes. ranged-back = stays behind Brutus and fires
  // (Ember/Wren ruling). charger = the reckless type planned for later.
  var ARCHETYPES = ['frontline', 'ranged-back', 'support', 'charger'];

  // The seven canon regions (= nations). Home region affects clique fit
  // (Robert, 2026-09-28) and drives the name palette (names.js BASIS: Marium
  // Roman, Themelios Grecian, Reyjar Norse-Spanish, Li Trice French-Chinese,
  // Ayusti Japanese-Brazilian, Beloufi Americana-Irish, Edinius
  // English-Lithuanian). Which region each character comes from is my
  // placeholder; pairs share a home. `look` is a one-line ART SUGGESTION
  // for Robert to veto; Ember and Wren have none because the build's art
  // defines them.
  var REGIONS = ['Reyjar', 'Ayusti', 'Themelios', 'Marium', 'Li Trice', 'Edinius', 'Beloufi'];

  var CAST = [
    {
      id: 'ember', name: 'Ember', epithet: 'Current ally cast',
      region: 'Edinius',
      class: 'Mage', archetype: 'ranged-back', tier: 2, tone: 'comic',
      combat: { hpScale: 0.75, energyScale: 1.1 },
      traits: ['reckless', 'kind'],
      desires: { gold: 20, strongGuild: 20, friends: 60 }, dominant: 'friends',
      fame: 30, fortune: 40,
      favorsToJoin: 3,
      leavesGuestRunIf: ['wren-leaves', 'party-abandons-someone'],
      shiftsWhen: 'If Wren dies or joins elsewhere, friends collapses and she drifts toward whoever Wren went with, or toward gold to get out of town.',
      ties: [{ with: 'wren', kind: 'old party mates' }],
      pitch: 'Canon voice lines in the build win over anything written here.',
      bio: 'Placeholder sheet: Ember keeps her existing personality and voice from the build. Market stats only. She and Wren come as a pair in practice, since courting one pulls the other.'
    },
    {
      id: 'wren', name: 'Wren', epithet: 'Current ally cast',
      region: 'Edinius',
      class: 'Archer', archetype: 'ranged-back', tier: 2, tone: 'comic',
      combat: { hpScale: 0.8, energyScale: 1.0 },
      traits: ['cautious', 'pragmatic'],
      desires: { gold: 35, strongGuild: 25, friends: 40 }, dominant: 'friends',
      fame: 30, fortune: 55,
      favorsToJoin: 4,
      leavesGuestRunIf: ['ember-leaves', 'sent-deeper-than-capable'],
      shiftsWhen: 'A near-death run pushes strongGuild up. She wants walls around Ember more than she wants money.',
      ties: [{ with: 'ember', kind: 'old party mates' }],
      pitch: 'Canon voice lines in the build win over anything written here.',
      bio: 'Placeholder sheet: Wren keeps her existing personality and voice from the build. Market stats only. The harder sell of the pair, and the one who decides whether they both stay.'
    },
    {
      id: 'dagny', name: 'Dagny Holm', epithet: '"The Ox"',
      region: 'Reyjar',
      look: 'Tall and broad, thick braids the color of old oak, weathered olive-tan skin and deep laugh lines; a ladle hung at the belt like a sidearm.',
      class: 'Warrior', archetype: 'frontline', tier: 3, tone: 'comic',
      combat: { hpScale: 1.4, energyScale: 0.8 },
      traits: ['kind', 'reckless'],
      desires: { gold: 10, strongGuild: 15, friends: 75 }, dominant: 'friends',
      fame: 45, fortune: 15,
      favorsToJoin: 2,
      leavesGuestRunIf: ['no-food-in-camp'],
      shiftsWhen: 'Broke often, never cares. Only a betrayal of someone she likes moves her off friends.',
      ties: [],
      pitch: 'You look hungry. I look hungry. We should be hungry together.',
      bio: 'Enormous, cheerful, and constantly eating. She once carried a wounded rival guild\'s entire party out of the third floor because "they looked sad," then billed nobody. Easiest person in town to recruit and the worst at keeping money. Takes Brutus\'s insults as affection, which is sometimes correct.'
    },
    {
      id: 'odile', name: 'Sister Odile Lin', epithet: 'The Unforgiving Hand',
      region: 'Li Trice',
      look: 'Narrow and upright, black hair streaked grey under a plain white coif; a scarred hand that never shakes; a habit with no ornament at all.',
      class: 'Priest', archetype: 'support', tier: 4, tone: 'grim',
      combat: { hpScale: 0.9, energyScale: 1.3 },
      traits: ['proud', 'vengeful'],
      desires: { gold: 5, strongGuild: 80, friends: 15 }, dominant: 'strongGuild',
      fame: 70, fortune: 60,
      favorsToJoin: 6,
      leavesGuestRunIf: ['brutus-flees-a-fight', 'party-exploits-a-party'],
      shiftsWhen: 'Only renown moves her. If Brutus\'s guild makes the news, she comes to him; charity from a nobody insults her.',
      ties: [],
      pitch: 'I heal those who have earned it. Have you?',
      bio: 'A field priest who decides mid-battle who deserves mending, and says so out loud. She has let people die over manners. Brilliant, feared, and completely unbuyable with gifts. The long bet of the cast: hard to land, and once she joins, the most loyal person in the game, because she only swears to the worthy.'
    },
    {
      id: 'pell', name: 'Perrin Dao', epithet: 'The Early Leaver',
      region: 'Li Trice',
      look: 'Wiry and quick, always half-turned toward the exit; sharp features, restless eyes; a pack that is never fully unpacked and a worn lucky coin on a cord.',
      class: 'Archer', archetype: 'ranged-back', tier: 2, tone: 'comic',
      combat: { hpScale: 0.7, energyScale: 1.1 },
      traits: ['greedy', 'cautious'],
      desires: { gold: 85, strongGuild: 10, friends: 5 }, dominant: 'gold',
      fame: 20, fortune: 5,
      favorsToJoin: 2,
      leavesGuestRunIf: ['better-offer', 'run-looks-unprofitable'],
      shiftsWhen: 'Once rich, gold drops and strongGuild spikes. He wants protection for the money.',
      ties: [],
      pitch: 'I\'m worth every coin. Ask anyone. Actually, don\'t ask anyone.',
      bio: 'A decent shot and a magnificent coward who has survived four party wipes by leaving early, every time. He sells loot before the fight is over. Cheap to hire, easy to lose to a better bid, and a strong penny-stock bet: if he ever gets rich, he becomes loyal to whoever protects the pile.'
    },
    {
      id: 'ines', name: 'Ines Sakai', epithet: 'Elder Twin',
      region: 'Ayusti',
      look: 'Slight and composed, black hair cut blunt at the jaw, ink-stained fingers; a narrow ledger of her brother\'s enemies in her coat pocket.',
      class: 'Mage', archetype: 'ranged-back', tier: 3, tone: 'grim',
      combat: { hpScale: 0.8, energyScale: 1.2 },
      traits: ['pragmatic', 'vengeful'],
      desires: { gold: 30, strongGuild: 20, friends: 50 }, dominant: 'friends',
      fame: 40, fortune: 35,
      favorsToJoin: 4,
      leavesGuestRunIf: ['ivo-endangered-by-brutus'],
      shiftsWhen: 'If Ivo dies on Brutus\'s watch, she becomes permanently hostile. If he dies elsewhere, she comes to Brutus for revenge.',
      ties: [{ with: 'ivo', kind: 'twin' }],
      pitch: 'Whatever you offer my brother, offer to me first.',
      bio: 'The cold half of the Sakai twins. She has spent her life cleaning up after Ivo and keeps a written list of everyone who has endangered him. She negotiates for both of them. Winning her means winning Ivo, and failing him means making an enemy who never forgets.'
    },
    {
      id: 'ivo', name: 'Ivo Sakai', epithet: 'Younger Twin',
      region: 'Ayusti',
      look: 'His sister\'s face with a full head of unruly hair and a wide grin; a sword slightly too big for him, the scabbard held together with string.',
      class: 'Warrior', archetype: 'charger', tier: 2, tone: 'comic',
      combat: { hpScale: 1.1, energyScale: 1.0 },
      traits: ['reckless', 'kind'],
      desires: { gold: 20, strongGuild: 30, friends: 50 }, dominant: 'friends',
      fame: 35, fortune: 20,
      favorsToJoin: 2,
      leavesGuestRunIf: ['ines-says-so'],
      shiftsWhen: 'Wants to be famous more than he admits. A headline pushes strongGuild up and makes him harder for Ines to steer.',
      ties: [{ with: 'ines', kind: 'twin' }],
      pitch: 'Is that a big monster? Can I hit it? Ines, can I hit it?',
      bio: 'A golden retriever with a sword. He charges first and plans never. Adores Brutus instantly because Brutus is also terrible at thinking ahead. Easy to court and impossible to recruit without his sister signing off. He is the one who gets both twins killed if nobody reins him in.'
    },
    {
      id: 'morrow', name: 'Nikandros', epithet: 'The Gravedigger',
      region: 'Themelios',
      look: 'Heavy-shouldered, grey at the temples far too young, close dark beard; a gravedigger\'s shovel strapped beside the sword; stands very still.',
      class: 'Warrior', archetype: 'frontline', tier: 5, tone: 'grim',
      combat: { hpScale: 1.6, energyScale: 0.9 },
      traits: ['cautious', 'proud'],
      desires: { gold: 15, strongGuild: 75, friends: 10 }, dominant: 'strongGuild',
      fame: 85, fortune: 70,
      favorsToJoin: 7,
      leavesGuestRunIf: ['reckless-order', 'guild-renown-falls'],
      shiftsWhen: 'Only moves toward friends if someone survives a run alongside him that he expected to die. It has happened once.',
      ties: [],
      pitch: 'Three guilds. I buried all of them. Why would yours be different?',
      bio: 'The strongest adventurer in town and the only survivor of three guild wipes. He refuses to learn names anymore. Every guild wants him and none can keep him. The blue-chip stock: expensive, slow to move, and the headline of the season if Brutus lands him. Also the proof that level is no protection from a knife, if a rival decides he is worth killing.'
    },
    {
      id: 'tibby', name: 'Mabel Quill', epithet: 'Chaplain and Keeper of the Book',
      region: 'Beloufi',
      look: 'Round-faced, ruddy and freckled, red curls escaping a plain cap; a thick ledger in a satchel over her vestments; always mid-laugh.',
      class: 'Priest', archetype: 'support', tier: 2, tone: 'comic',
      combat: { hpScale: 0.85, energyScale: 1.2 },
      traits: ['greedy', 'kind'],
      desires: { gold: 60, strongGuild: 10, friends: 30 }, dominant: 'gold',
      fame: 25, fortune: 0,
      favorsToJoin: 3,
      leavesGuestRunIf: ['debt-called-in'],
      shiftsWhen: 'Deep in debt all season. Paying it off flips her dominant to friends overnight.',
      ties: [],
      pitch: 'Blessings are free. Odds on you surviving the fourth floor are three to one.',
      bio: 'A cheerful priest who runs the town\'s betting book on which adventurers die next. She heals everyone and bets against half of them. She owes money to at least two guilds. Knows every rumor in town because gamblers talk, which makes her the best intel source in the cast and a liability if her creditors come looking.'
    },
    {
      id: 'hask', name: 'Hask', epithet: 'The Survivor Nobody Wanted',
      region: 'Reyjar',
      look: 'Gaunt and tall, frost-white at the temples, hollows under his eyes; robes frayed at the hem from the lower floors; an iron door-key on a cord he never removes.',
      class: 'Mage', archetype: 'ranged-back', tier: 4, tone: 'grim',
      combat: { hpScale: 0.7, energyScale: 1.4 },
      traits: ['vengeful', 'pragmatic'],
      desires: { gold: 40, strongGuild: 50, friends: 10 }, dominant: 'strongGuild',
      fame: 55, fortune: 30,
      favorsToJoin: 5,
      leavesGuestRunIf: ['brutus-allies-with-his-old-guild'],
      shiftsWhen: 'Wants a guild strong enough to take revenge on the one that left him to die. Once he gets it, desires drift to gold.',
      ties: [],
      pitch: 'My last guild sealed the door with me on the wrong side. Tell me yours wouldn\'t.',
      bio: 'A powerful mage whose former guild abandoned him on a lower floor. He walked out alone three weeks later and has not smiled since. Joins whoever will help him hurt them. Strong, bitter, and a walking diplomatic incident: recruiting him means inheriting his war.'
    }
  ];

  function byId(id) {
    for (var i = 0; i < CAST.length; i++) if (CAST[i].id === id) return CAST[i];
    return null;
  }

  var API = { CLASSES: CLASSES, ARCHETYPES: ARCHETYPES, REGIONS: REGIONS, CAST: CAST, byId: byId };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_CAST = API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
