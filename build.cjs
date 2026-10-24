// Builds the one playable file: builds/CURRENT-brutus.html
//
//   node build.cjs
//
// How it works: the pinned baseline (src/baseline/brutus-baseline.html) holds two game
// frames, the overworld (world) and the dungeon. Every file under src/world and
// src/dungeon is a patch that wraps or replaces functions in its frame. They are
// appended in the order listed below, so a later patch wraps an earlier one.
// ORDER MATTERS: keep a new patch after any patch whose function it wraps.
// See docs/code-map.md for what each file does.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = __dirname;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');

const BASELINE = 'src/baseline/brutus-baseline.html';
const BASELINE_SHA256 = 'c2ed93809df7ed380f564a4ee00ad45e6516902b9fac54d05aebcb832c3a374a';
const OUTPUT = 'builds/CURRENT-brutus.html';

// Loaded first in the overworld frame, as plain libraries.
const WORLD_LIBRARIES = [
  'src/world/people/ow-core.js',          // dungeon NPC parties: headless state machine (window.OW)
  'src/world/people/ow-bridge.js',        // save/load and message layer around OW
];

// Overworld patches, in wrap order.
const WORLD_PATCHES = [
  'src/world/people/ow-world.js',         // runs OW each End Turn; dungeon meetings
  'src/world/chronicle/chronicle.js',     // one Chronicle card per event; strangers fold into "Elsewhere"
  'src/world/items/no-elements.js',       // items carry no elements
  'src/world/items/old-save-names.js',    // old saves: renamed cards and abilities
  'src/world/dungeon-board/contracts.js', // guild rights to dungeons; Access / Ally / Ally Access
  'src/world/dungeon-board/conquest.js',  // conquered dungeons lock out 2-5 turns; upkeep paused
  'src/world/dungeon-board/boss-loot.js', // boss loot a cut above generic
  'src/world/items/deck-choice.js',       // deck chosen once on Deploy
  'src/world/dungeon-board/ranks.js',     // dungeon rank 1-5
  'src/world/progression/xp.js',          // XP rules, companion XP bars
  'src/world/people/drives.js',           // gear / class / person drives move each turn
  'src/world/people/status-screen.js',    // status screen for Brutus and companions
  'src/world/people/market-screen.js',    // market screen for everyone else
  'src/world/people/voices.js',           // Chronicle cards open with a character's own line
];

// Dungeon patches, in wrap order.
const DUNGEON_PATCHES = [
  'src/dungeon/people/ow-meetings.js',    // meet NPC parties in the dungeon
  'src/dungeon/enemies/enemy-cards.js',   // enemies play 40-card decks
  'src/dungeon/items/no-elements.js',     // no element words in the log
  'src/dungeon/run/ranks.js',             // floors, traps and monsters by rank
  'src/dungeon/run/contracts.js',         // guest allies from guild contracts
  'src/dungeon/run/conquest.js',          // warden's boss chest
  'src/dungeon/visuals/fist-sprite.js',   // 2D fist viewmodel
  'src/dungeon/deck/deck-choice.js',      // use the deck picked on Deploy
  'src/dungeon/run/straight-route.js',    // a straight route down each floor
  'src/dungeon/visuals/card-face-fix.js', // card faces with no art hide cleanly
  'src/dungeon/run/checkpoints.js',       // checkpoints and resume
  'src/dungeon/deck/deck-state.js',       // deck state for the status screen
  'src/dungeon/enemies/spacing-and-training-reset.js', // monsters keep distance; training reset keeps deck
  'src/dungeon/movement/doom-turning.js', // turning ramps up while held
];

function build() {
  const baseline = read(BASELINE);
  if (sha256(baseline) !== BASELINE_SHA256) throw Error('Baseline hash mismatch: ' + BASELINE);
  const compose = require('./src/compose.js');
  const composed = compose(baseline, {
    core: read(WORLD_LIBRARIES[0]),
    bridge: read(WORLD_LIBRARIES[1]),
    world: WORLD_PATCHES.map(read).join('\n'),
    dungeon: DUNGEON_PATCHES.map(read).join('\n'),
  });
  // Last step: rename elemental card and ability names across the whole file.
  return require('./src/text/element-renames.js').applyNoElementNames(composed);
}

if (require.main === module) {
  const out = process.argv[2] || path.join(root, OUTPUT);
  const html = build();
  fs.writeFileSync(out, html);
  console.log(JSON.stringify({ output: path.relative(root, out), bytes: Buffer.byteLength(html), sha256: sha256(html) }));
}
module.exports = { build, BASELINE, OUTPUT, WORLD_LIBRARIES, WORLD_PATCHES, DUNGEON_PATCHES };
