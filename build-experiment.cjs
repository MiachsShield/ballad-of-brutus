// Builds the separate playtest file: builds/EXPERIMENT-personality.html
//
//   node build-experiment.cjs
//
// The personality experiment is the main build with one population: every overworld patch from
// build.cjs, then the personality sim (src/experiment/world-sim.js) and the patch that makes the
// game's people and guilds the sim's people (src/experiment/one-population.js). The shell is
// labelled "Personality experiment". The main build, builds/CURRENT-brutus.html, is never written.
// See docs/personality-experiment.md.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = __dirname;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');
const main = require('./build.cjs');

const EXPERIMENT_PATCHES = [
  'src/experiment/world-sim.js',        // the personality sim (window.PXSim)
  'src/experiment/one-population.js',   // the game's cast and guilds are the sim's; bulletin, stakes
];
const OUTPUT = 'builds/EXPERIMENT-personality.html';

function build() {
  const baseline = read(main.BASELINE);
  const composed = require('./src/compose.js')(baseline, {
    core: read(main.WORLD_LIBRARIES[0]),
    bridge: read(main.WORLD_LIBRARIES[1]),
    world: main.WORLD_PATCHES.concat(EXPERIMENT_PATCHES).map(read).join('\n'),
    dungeon: main.DUNGEON_PATCHES.map(read).join('\n'),
  });
  let html = require('./src/text/element-renames.js').applyNoElementNames(composed);
  // Label the shell so nobody mistakes this file for the main build.
  const label = (from, to) => { if (html.split(from).length !== 2) throw Error('Label anchor not unique: ' + from); html = html.replace(from, to); };
  label('<title>The Ballad of Brutus</title>', '<title>Brutus · Personality experiment</title>');
  label('<b>THE BALLAD OF BRUTUS</b>', '<b>THE BALLAD OF BRUTUS</b><span class="px-tag" style="color:#101b22;background:#e0b25a;padding:3px 7px;font:600 11px system-ui;letter-spacing:.1em">PERSONALITY EXPERIMENT</span>');
  return html;
}

if (require.main === module) {
  const out = process.argv[2] || path.join(root, OUTPUT);
  const html = build();
  fs.writeFileSync(out, html);
  console.log(JSON.stringify({ output: path.relative(root, out), bytes: Buffer.byteLength(html), sha256: sha256(html) }));
}
module.exports = { build, EXPERIMENT_PATCHES, OUTPUT };
