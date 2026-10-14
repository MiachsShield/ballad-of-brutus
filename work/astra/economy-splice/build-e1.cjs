// Reproducible standalone E1 candidate: PR #34's S1 composition with the E1
// economy adapter appended to the world part. Same pinned baseline, same keys.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..'),s1=path.join(root,'work/astra/overworld-splice-1');
const input=process.argv[2]||path.join(root,'builds/brutus-1_0_a0mk-kavi-balanced2.html');
const output=process.argv[3]||path.join(root,'builds/CURRENT-brutus-astra-e1-standalone.html');
const read=p=>fs.readFileSync(p,'utf8');
const baseline=read(input);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
if(hash(baseline)!=='eeeeeae0fd4cf32428e40c6d045f851311674c1affef800e5f09abe4bb283cdb')throw Error('Baseline hash mismatch');
const result=require(path.join(s1,'compose-s1.js'))(baseline,{
  core:read(path.join(root,'work/claude/overworld-2026-09-18/adventurers.js')),
  bridge:read(path.join(s1,'ow-bridge.js')),
  world:read(path.join(s1,'world-integration.js'))+'\n'+read(path.join(__dirname,'economy-integration.js'))+'\n'+read(path.join(root,'work/claude/no-elements/no-elements-world.js'))+'\n'+read(path.join(root,'work/claude/guild-contracts/contracts-world.js'))+'\n'+read(path.join(root,'work/claude/conquest/conquest-world.js'))+'\n'+read(path.join(root,'work/claude/conquest/boss-loot-world.js'))+'\n'+read(path.join(root,'work/claude/playtest-fixes/deck-world.js'))+'\n'+read(path.join(root,'work/claude/dungeon-ranks/ranks-world.js'))+'\n'+read(path.join(root,'work/claude/dungeon-ranks/xp-world.js')),
  dungeon:read(path.join(s1,'dungeon-integration.js'))+'\n'+read(path.join(root,'work/claude/no-elements/no-elements-dungeon.js'))+'\n'+read(path.join(root,'work/claude/dungeon-ranks/rank-dungeon.js'))+'\n'+read(path.join(root,'work/claude/guild-contracts/contracts-dungeon.js'))+'\n'+read(path.join(root,'work/claude/conquest/conquest-dungeon.js'))+'\n'+read(path.join(root,'work/claude/sprite-weapon/weapon2d-dungeon.js'))+'\n'+read(path.join(root,'work/claude/playtest-fixes/deck-dungeon.js'))+'\n'+read(path.join(root,'work/claude/playtest-fixes/spine-dungeon.js'))+'\n'+read(path.join(root,'work/claude/dungeon-ranks/card-face-fix-dungeon.js'))+'\n'+read(path.join(root,'work/claude/dungeon-ranks/checkpoint-dungeon.js'))});
fs.writeFileSync(output,result);
console.log(JSON.stringify({output,bytes:Buffer.byteLength(result),sha256:hash(result)}));
