// S1: one world-owned simulation; old saves migrate on first access.
let owBridge = null, owOwner = null;
function ensureOW() {
  if (owOwner !== S) {
    owOwner = S;
    owBridge = BOBOWBridge.create({OW, seed: 1});
    if (S.owBridge) owBridge.loadFrom(S);
    else owBridge.startNewRun(Math.floor(Math.random()*4294967296), 8);
  }
  S.owBridge = owBridge.save();
  return owBridge;
}
const owSaveBase = saveLiving;
saveLiving = function(){ensureOW(); return owSaveBase();};
const owTurnBase = endTurn;
endTurn = function(){
  const before = S.turn;
  owTurnBase();
  if(S.turn === before) return;
  const bridge = ensureOW(), result = bridge.endTurn(10);
  bridge.repopulate(8);
  S.owMeetings = {};
  S.owBridge = bridge.save();
  for(const p of result.lost) if(p.metBrutus)
    note([],p.name+' did not return.',p.causeOfDeath,'Dungeon party lost','death');
  render();saveLiving();
};
window.BOBOWWorld = {
  request(m){
    if(!S.pendingDelve || campaignEnded()) return {error:'No active expedition'};
    if(!m || typeof m.key!=='string' || m.key.length>160) return {error:'Invalid meeting'};
    const bridge=ensureOW();
    const meetings=S.owMeetings||(S.owMeetings={});
    let meeting=meetings[m.key];
    if(!meeting){
      const used=new Set(Object.values(meetings).map(x=>x.partyId));
      const p=Object.values(bridge.snapshot().roster).find(p=>p.alive&&!used.has(p.id));
      if(!p)return {empty:true};
      meeting=meetings[m.key]={partyId:p.id,result:null};
    }
    if(meeting.result)return {done:true,result:meeting.result};
    const p=bridge.snapshot().roster[meeting.partyId];
    if(!p||!p.alive)return {empty:true};
    if(m.verb){
      if(!OW.VERBS.includes(m.verb))return {error:'Invalid choice'};
      const result=bridge.applyMessage({id:'meeting:'+S.runId+':'+m.key,action:'encounter',args:{partyId:p.id,verb:m.verb}}).result;
      meeting.result={name:p.name,verb:m.verb,note:result.note};
      S.owBridge=bridge.save();
      note([],p.name+' — '+m.verb,p.goal.says+' '+result.note,'They must survive to carry this memory.','major');
      return {done:true,result:meeting.result};
    }
    return {party:{id:p.id,name:p.name,goal:p.goal.says}};
  }
};
