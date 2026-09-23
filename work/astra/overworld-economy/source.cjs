// Always compose PR #34's exact S1 world from its accepted baseline and adapters.
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..');
function source(){
 const baseline=fs.readFileSync(path.join(root,'builds/brutus-1_0_a0mk-kavi-balanced2.html'),'utf8');
 if(crypto.createHash('sha256').update(baseline).digest('hex')!=='e9ff9c1052b7af3544985d7b38ef681f639f3e82921d43b9386506aa5d0df1f0')throw Error('Accepted overworld baseline changed');
 const dir=path.join(root,'work/astra/overworld-splice-1');
 const core=fs.readFileSync(path.join(root,'work/claude/overworld-2026-09-18/adventurers.js'),'utf8');
 const built=require(path.join(dir,'compose-s1.js'))(baseline,{core,bridge:fs.readFileSync(path.join(dir,'ow-bridge.js'),'utf8'),world:fs.readFileSync(path.join(dir,'world-integration.js'),'utf8'),dungeon:fs.readFileSync(path.join(dir,'dungeon-integration.js'),'utf8')});
 const scripts=built.slice(built.indexOf('const WORLD_HTML='),built.indexOf("const world=document.getElementById('world')"));
 const frame=vm.runInNewContext(scripts+';({world:WORLD_HTML})');
 return {world:frame.world,baselineSha256:crypto.createHash('sha256').update(baseline).digest('hex'),worldSha256:crypto.createHash('sha256').update(frame.world).digest('hex')};
}
module.exports=source;
