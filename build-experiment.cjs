// Builds the separate playtest file: builds/EXPERIMENT-personality.html
//
//   node build-experiment.cjs
//
// The personality experiment swaps the whole overworld frame for a bulletin-first page
// driven by src/experiment/world-sim.js. Everything else (the shell, the training room,
// the dungeon frame and its patches) is the same as the main build, which this script
// never writes to. See docs/personality-experiment.md.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = __dirname;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');

const SIM = 'src/experiment/world-sim.js';
const PAGE = 'src/experiment/overworld.html';
const OUTPUT = 'builds/EXPERIMENT-personality.html';

function worldPage() {
  const page = read(PAGE);
  if (page.split('<script>/*SIM*/</script>').length !== 2) throw Error('Missing sim slot in ' + PAGE);
  return page.replace('<script>/*SIM*/</script>', () => '<script>' + read(SIM) + '</script>');
}

function build() {
  const full = require('./build.cjs').build();
  const a = full.indexOf('const WORLD_HTML='), b = full.indexOf(';\nconst DUNGEON_HTML=');
  if (a < 0 || b < a) throw Error('Unexpected build layout');
  const quote = s => JSON.stringify(s).replace(/<\/script/gi, '<\\/script');
  let head = full.slice(0, a), tail = full.slice(b);
  // Label the shell so nobody mistakes this file for the main build.
  const once = (s, from, to) => { if (s.split(from).length < 2) throw Error('Label anchor missing: ' + from); return s.split(from).join(to); };
  head = once(head, '<title>The Ballad of Brutus</title>', '<title>Brutus · Personality experiment</title>');
  head = once(head, '<span id="where">The living world</span>', '<span id="where">Personality experiment</span>');
  tail = once(tail, ":'The living world';", ":'Personality experiment';");
  return head + 'const WORLD_HTML=' + quote(worldPage()) + tail;
}

if (require.main === module) {
  const out = process.argv[2] || path.join(root, OUTPUT);
  const html = build();
  fs.writeFileSync(out, html);
  console.log(JSON.stringify({ output: path.relative(root, out), bytes: Buffer.byteLength(html), sha256: sha256(html) }));
}
module.exports = { build, worldPage, OUTPUT };
