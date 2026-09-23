// Reproducible standalone E1 candidate: PR #34's S1 composition with the E1
// economy adapter appended to the world part. Same pinned baseline, same keys.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..'),s1=path.join(root,'work/astra/overworld-splice-1');
const input=process.argv[2]||path.join(root,'builds/brutus-1_0_a0mk-kavi-balanced2.html');
const output=process.argv[3]||path.join(root,'builds/brutus-astra-e1-standalone.html');
const read=p=>fs.readFileSync(p,'utf8');
const baseline=read(input);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
if(hash(baseline)!=='e9ff9c1052b7af3544985d7b38ef681f639f3e82921d43b9386506aa5d0df1f0')throw Error('Baseline hash mismatch');
const result=require(path.join(s1,'compose-s1.js'))(baseline,{
  core:read(path.join(root,'work/claude/overworld-2026-09-18/adventurers.js')),
  bridge:read(path.join(s1,'ow-bridge.js')),
  world:read(path.join(s1,'world-integration.js'))+'\n'+read(path.join(__dirname,'economy-integration.js')),
  dungeon:read(path.join(s1,'dungeon-integration.js'))});
fs.writeFileSync(output,result);
console.log(JSON.stringify({output,bytes:Buffer.byteLength(result),sha256:hash(result)}));
