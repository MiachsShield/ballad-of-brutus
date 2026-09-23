const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {world,worldSha256}=require('./source.cjs')();
// The full overworld UI and game script are PR #34's; only the dungeon launch
// control is disabled in this separate, overworld-only demonstration.
if(!world.includes('<button id="delveBtn">Delve a dungeon</button>'))throw Error('Dungeon control changed upstream');
let html=world.replace('<button id="delveBtn">Delve a dungeon</button>', '<button id="delveBtn" disabled title="Overworld-only economy study">Delve disabled in economy study</button>');
const anchor='if(!initialSave||!loadLiving(initialSave))newRun();initialSave=null;';
if(html.split(anchor).length!==2)throw Error('World boot anchor changed upstream');
html=html.replace(anchor,`const economyRender=render;render=function(){economyRender();$('delveBtn').disabled=true;};\n${anchor}`);
html=html.replace('<div id="stage">','<div id="stage"><div role="note" style="padding:10px;border:1px solid #c9a24b;color:#eee5d8;border-radius:8px">PR #34 overworld economy · dungeon launch disabled. End turns to watch guild payroll, auctions, roster changes, rival moves and market demand.</div>');
html=html.replace('<head>','<head><base href="../../../">');
const out=path.join(__dirname,'brutus-pr34-overworld-economy.html');fs.writeFileSync(out,html);
console.log(JSON.stringify({out,bytes:Buffer.byteLength(html),sourceWorldSha256:worldSha256,sha256:crypto.createHash('sha256').update(html).digest('hex')}));
