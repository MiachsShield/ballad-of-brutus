/* Pure composition shared by launcher and standalone builder. */
(function(root){
 function compose(baseline,parts){
  const begin=baseline.indexOf('const WORLD_HTML=');
  const end=baseline.indexOf("const world=document.getElementById('world')");
  if(begin<0||end<begin)throw Error('Unsupported baseline');
  const frames=Function(baseline.slice(begin,end)+';return {world:WORLD_HTML,dungeon:DUNGEON_HTML};')();
  function insert(s,anchor,code){if(s.split(anchor).length!==2)throw Error('Nonunique anchor: '+anchor);return s.replace(anchor,code+'\n'+anchor);}
  let world=insert(frames.world,'<script>','<script>'+parts.core+'\n'+parts.bridge+'</script>');
  world=insert(world,'if(!initialSave||!loadLiving(initialSave))newRun();initialSave=null;',parts.world);
  const dungeon=insert(frames.dungeon,'if(window.parent===window)start(); requestAnimationFrame(frame);',parts.dungeon);
  const quote=s=>JSON.stringify(s).replace(/<\/script/gi,'<\\/script');
  let shell=insert(baseline.slice(end),'world.srcdoc=WORLD_HTML;',`window.BOBOWRequest=(source,message)=>{
   if(source!==dungeon.contentWindow||!live||!ready)return {error:'Inactive dungeon'};
   return world.contentWindow.BOBOWWorld.request(message);
  };`);
  return baseline.slice(0,begin)+'const WORLD_HTML='+quote(world)+';\nconst DUNGEON_HTML='+quote(dungeon)+';\n'+shell;
 }
 if(typeof module!=='undefined')module.exports=compose;else root.composeS1=compose;
})(typeof globalThis!=='undefined'?globalThis:this);
