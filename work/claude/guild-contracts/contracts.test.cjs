// Unit test for contracts-world.js in a sandbox, same pattern as the S1 integration test.
// Run: node work/claude/guild-contracts/contracts.test.cjs
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={Math,Set,Map,String,Object,Array,JSON,console};vm.createContext(ctx);
vm.runInContext(`
let S, notes=[], gold=[], deaths=[], rendered=0, saved=0, wars={}, ended=false, lastBase={};
function guildRosterSize(name){return S.agents.filter(a=>a.alive&&a.affiliation===name&&!a.joined).length;}
function eligibleGuild(name){if(!name)return true;const g=Object.values(S.guilds).find(x=>x.name===name);return g&&(g.hostility||0)<1&&(g.reputation||0)>-20;}
function campaign(){return {wars};} function campaignEnded(){return ended;}
function person(id){return S.agents.find(a=>a.id===id);} function appearanceId(a){return a.id%16;}
function abilityProfile(){return {atk:1};} function changeGold(n,why){S.gold+=n;gold.push([n,why]);}
function note(...a){notes.push(a);} function esc(s){return String(s);} function fmtGold(n){return n+'g';}
function btn(text,action,id,disabled,cls){return '<button data-action="'+action+'" data-id="'+id+'"'+(disabled?' disabled':'')+'>'+text+'</button>';}
function render(){rendered++;} function saveLiving(){saved++;}
function releaseUnique(){} function applyGuildDeathConsequence(a){deaths.push(a.name);}
function remember(a,who,n){a.mem=(a.mem||0)+n;}
let seq=0;function spawnDungeon(initial){const t=THEMES[seq++%THEMES.length];S.dungeons.push({...t,id:seq,closed:false});}
function dungeonCard(d){return '<article><div class="objective">'+d.objective+'</div><footer><b>'+d.reward+'</b><button data-action="dungeon" data-id="'+d.id+'">Take contract</button><button data-action="boast" data-id="'+d.id+'">Public boast</button></footer></article>';}
function handleLiving(e){lastBase=e;}
function confirmDelve(){lastBase={confirmed:S.activeContract};S.pendingDelve=true;}
function applyDungeonResult(r){S.pendingDelve=false;S.activeContract=null;S.expeditionReport={turn:1,gold:0,body:'Back.',people:[]};}
const THEMES=[{name:'Sepulchre',region:'Li Trice',objective:'o',reward:38000},{name:'Crown',region:'Marium',objective:'o',reward:26000},{name:'Empty',region:'Nowhere',objective:'o',reward:30000}];
`,ctx);
vm.runInContext(fs.readFileSync(__dirname+'/contracts-world.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
function fresh(){run(`{
 seq=0;notes=[];gold=[];deaths=[];wars={};ended=false;
 S={gold:200000,brutus:{lvl:20},dungeons:[],pendingDelve:false,activeContract:null,
  guilds:{a:{id:'a',name:'Silk Hand',home:'Li Trice',hostility:0,reputation:5},
          b:{id:'b',name:'Small Lantern',home:'Li Trice',hostility:0,reputation:0},
          c:{id:'c',name:'Mint Guard',home:'Marium',hostility:0,reputation:0}},
  agents:[]};
 let id=1;const add=(aff,lvl,extra)=>S.agents.push(Object.assign({id:id++,name:'P'+id,affiliation:aff,lvl,alive:true,joined:false,cls:'Ranger',gender:'f',ability:{name:'x',rarity:'common'},affection:40},extra||{}));
 for(let i=0;i<6;i++)add('Silk Hand',12+i);add('Small Lantern',15);add('Mint Guard',18);add('Mint Guard',40);
 add('Silk Hand',35);add('Silk Hand',19,{joined:true});add('Silk Hand',19,{alive:false});
}`);}
// 1. Region logic: every opened dungeon's holder is a guild homed in that region.
for(let trial=0;trial<200;trial++){fresh();run('spawnDungeon(true);spawnDungeon(true);spawnDungeon(true)');
 const r=JSON.parse(run('JSON.stringify(S.dungeons.map(d=>({region:d.region,home:S.guilds[d.gcOwnerId]?.home??null,state:gcRights(d).state})))'));
 assert.equal(r[0].home,'Li Trice');assert.equal(r[1].home,'Marium');assert.equal(r[2].home,null);
 assert.equal(r[0].state,'locked');assert.equal(r[1].state,'locked');assert.equal(r[2].state,'open');}
// weighting: the bigger Li Trice guild (6 free members vs 1) should hold most Sepulchres
fresh();let big=0;for(let i=0;i<400;i++){run('S.dungeons=[];seq=0;spawnDungeon(true)');if(run('S.dungeons[0].gcOwnerId')==='a')big++;}
assert(big>280&&big<400,'weighted by roster, got '+big+'/400');
// holder deleted -> region's largest guild takes over; absorbed -> Brutus's rights
fresh();run("spawnDungeon(true);S.dungeons[0].gcOwnerId='b';delete S.guilds.b");
assert.equal(run('gcOwner(S.dungeons[0]).id'),'a');
run("S.guilds.a.playerHeld=true");assert.equal(run('gcRights(S.dungeons[0]).state'),'held');
// 2. Affiliation logic: guests come only from the signing guild, alive, unjoined, within level reach, max 2.
fresh();run('spawnDungeon(true)');
const pool=JSON.parse(run("JSON.stringify(gcGuestPool(S.guilds.a).map(a=>({aff:a.affiliation,lvl:a.lvl,joined:a.joined,alive:a.alive})))"));
assert.equal(pool.length,2);for(const p of pool){assert.equal(p.aff,'Silk Hand');assert(p.alive&&!p.joined&&p.lvl<=30);}
assert.deepEqual(pool.map(p=>p.lvl),[17,16]);   // Lv35 is out of reach; joined and dead members excluded
// 3. Dealing: hostility or war -> no deal and no buttons.
fresh();run('spawnDungeon(true)');assert.equal(run('gcWillDeal(S.guilds.a)'),true);
run('S.guilds.a.hostility=2');assert.equal(run('gcWillDeal(S.guilds.a)'),false);
assert(!/gc-access/.test(run('dungeonCard(S.dungeons[0])')));
run("S.guilds.a.hostility=0;wars.a={active:true}");assert.equal(run('gcWillDeal(S.guilds.a)'),false);
// 4. Locked card hides Take contract; handler blocks it.
fresh();run("spawnDungeon(true);S.dungeons[0].gcOwnerId='a'");
let html=run('dungeonCard(S.dungeons[0])');assert(/gc-access/.test(html)&&/gc-both/.test(html)&&!/Take contract/.test(html));
run("lastBase={};handleLiving({target:{closest:()=>({dataset:{action:'dungeon',id:String(S.dungeons[0].id)},disabled:false})}})");
assert.deepEqual(JSON.parse(run('JSON.stringify(lastBase)')),{});assert(/holds the rights/.test(run('S.lastNotice')));
// 5. Buy Ally Access: pays 40% of reward to the guild, grants access, books 2 guests from it.
run("handleLiving({target:{closest:()=>({dataset:{action:'gc-both',id:String(S.dungeons[0].id)},disabled:false})}})");
assert.equal(run('S.gold'),200000-15200);assert.equal(run('S.guilds.a.treasury'),15200);
assert.equal(run('S.dungeons[0].gcAccess'),true);assert.equal(run('S.dungeons[0].gcGuests.length'),2);
html=run('dungeonCard(S.dungeons[0])');assert(/Take contract/.test(html)&&/Guests:/.test(html));
// 6. Confirm attaches guest specs to the contract sent to the dungeon.
run('S.activeContract={...S.dungeons[0]};confirmDelve()');
const sent=JSON.parse(run('JSON.stringify(lastBase.confirmed.guests)'));assert.equal(sent.length,2);assert(sent.every(g=>g.guild==='Silk Hand'&&g.cls&&g.profile));
// 7. Refunded expedition keeps the contract.
run('applyDungeonResult({initializationFailed:true})');assert.equal(run('S.dungeons[0].gcAccess'),true);
// 8. Real result: one guest dies (permadeath + guild consequence), the other is remembered; rights consumed.
run('S.activeContract={...S.dungeons[0],guests:lastBase.confirmed.guests};S.pendingDelve=true');
const g0=sent[0].id,g1=sent[1].id;
run(`applyDungeonResult({kills:3,partyDowned:[{id:${g0},name:'x'}]})`);
assert.equal(run(`person(${g0}).alive`),false);assert.deepEqual(JSON.parse(run('JSON.stringify(deaths)')),[sent[0].name]);
assert.equal(run(`person(${g1}).alive`),true);assert.equal(run(`person(${g1}).mem`),8);
assert.equal(run('S.dungeons[0].gcAccess'),false);assert.equal(run('S.dungeons[0].gcGuests'),null);
assert.equal(run('gcRights(S.dungeons[0]).state'),'locked');
// report: fee counted in the treasury change, signer named, guests listed with their fate
assert.equal(run('S.expeditionReport.gold'),-15200);assert(/15200g paid to Silk Hand/.test(run('S.expeditionReport.body')));
assert.deepEqual(JSON.parse(run('JSON.stringify(S.expeditionReport.people.map(p=>[p.name.endsWith(" · guest"),p.alive]))')),[[true,false],[true,true]]);
assert.equal(run('S.dungeons[0].gcPaid'),0);
// 9. Locked contract cannot be confirmed even if it was picked before rights changed.
fresh();run("spawnDungeon(true);S.dungeons[0].gcOwnerId='a';S.activeContract={...S.dungeons[0]};lastBase={};confirmDelve()");
assert.deepEqual(JSON.parse(run('JSON.stringify(lastBase)')),{});assert.equal(run('S.activeContract'),null);
// 10. Held dungeon: Take contract stays, Ally offered from the friendliest dealing guild.
fresh();run("spawnDungeon(true);S.dungeons[0].gcOwnerId='a';S.guilds.a.playerHeld=true");
html=run('dungeonCard(S.dungeons[0])');assert(/Take contract/.test(html)&&/gc-ally/.test(html)&&/Your rights/.test(html));
run("handleLiving({target:{closest:()=>({dataset:{action:'gc-ally',id:String(S.dungeons[0].id)},disabled:false})}})");
assert.equal(run('S.dungeons[0].gcGuests.length'),run('gcGuestPool(S.guilds[S.dungeons[0].gcGuestGuildId]).length'));
assert.notEqual(run('S.dungeons[0].gcGuestGuildId'),'a');assert.equal(run('S.dungeons[0].gcAccess'),undefined);
// 11. Name ending in a period is not doubled.
fresh();run("S.guilds.a.name='Harbor Co.';S.agents.forEach(a=>{if(a.affiliation==='Silk Hand')a.affiliation='Harbor Co.'});spawnDungeon(true);S.dungeons[0].gcOwnerId='a'");
assert(/Rights held by Harbor Co\.(?!\.)/.test(run('dungeonCard(S.dungeons[0])')));
console.log('PASS: region holder by home region (weighted, reassigned, absorbed, unclaimed), affiliation-only guests within reach, no deals when hostile or at war, locked card and handler, Ally Access purchase, guest specs sent, refund keeps contract, guest death and survival, report fee and guests, rights consumed, locked confirm blocked, held dungeon Ally, name punctuation.');
