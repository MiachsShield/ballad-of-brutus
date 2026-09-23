const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {world,worldSha256}=require('./source.cjs')();
// The full overworld UI and game script are PR #34's; only the dungeon launch
// control is disabled in this separate, overworld-only demonstration.
if(!world.includes('<button id="delveBtn">Delve a dungeon</button>'))throw Error('Dungeon control changed upstream');
let html=world;
const anchor='if(!initialSave||!loadLiving(initialSave))newRun();initialSave=null;';
if(html.split(anchor).length!==2)throw Error('World boot anchor changed upstream');
const adapter=fs.readFileSync(path.join(__dirname,'world-only-adapter.js'),'utf8');
html=html.replace(anchor,adapter+'\n'+anchor);
// Standalone study saves never read or overwrite the accepted game's save.
if(!html.includes("'brutus-living-v1'"))throw Error('Save key changed upstream');
html=html.replaceAll('brutus-living-v1','brutus-economy-pr34-v1')
  .replaceAll('brutus-ended:','brutus-economy-pr34-ended:');
html=html.replace('<head>','<head><style>[hidden]{display:none!important}</style>');
const out=path.join(__dirname,'brutus-pr34-overworld-economy.html');fs.writeFileSync(out,html);
console.log(JSON.stringify({out,bytes:Buffer.byteLength(html),sourceWorldSha256:worldSha256,sha256:crypto.createHash('sha256').update(html).digest('hex')}));
