// Executed only in the extracted PR #34 world. No production source is changed.
expeditionFocus=function(){
  const wanted=S.event.wants;
  const shortages=Object.values(S.guilds).filter(g=>g.treasury<guildUpkeep(g.name)*3).length;
  return `<section class="panel" role="status"><small class="eyebrow">OVERWORLD ECONOMY STUDY</small>
    <h2>Guilds move while you decide.</h2>
    <p>Turn ${S.turn} · ${fmtGold(S.gold)} in your treasury · market wants ${esc(wanted)}s.</p>
    <p>${supplyOf(wanted)} qualified free ${esc(wanted)}s · ${shortages} guilds under three turns of payroll.</p>
    <p>Use the people, guild, auction and Chronicle screens. End turn to see payroll, bids and allegiances change. Dungeon launch is unavailable in this study.</p></section>`;
};
const economyOnlySelector='#delveBtn,#deployConfirmBtn,[data-action="dungeon"],[data-action="boast"],[data-action="nav"][data-id="dungeons"]';
function lockDungeonControls(){
  for(const button of document.querySelectorAll(economyOnlySelector)){
    button.disabled=true;button.hidden=true;
  }
}
const economyOnlyRender=render;
render=function(){economyOnlyRender();lockDungeonControls();};
// Capture before legacy onclick and the living-shell handler, including keyboard clicks.
document.addEventListener('click',event=>{
  if(event.target.closest(economyOnlySelector)){
    event.preventDefault();event.stopImmediatePropagation();
  }
},true);
