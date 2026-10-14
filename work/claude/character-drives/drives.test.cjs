// node work/claude/character-drives/drives.test.cjs — character drives (gear, class, person)
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const RAR={common:{label:'Common'},fine:{label:'Fine'},rare:{label:'Rare'},enchanted:{label:'Enchanted'},legendary:{label:'Legendary'}};
function world(){let seq=0;const ctx={Math,console,S:{turn:1,agents:[],roster:[],inventory:[],guilds:{a:{name:'Guild A'},b:{name:'Guild B'}},event:{wants:'Priest'}},
 ITEM_SLOTS:['Helm','Weapon','Hand','Chest','Legs','Accessory'],ITEM_RARITY:RAR,MAX_GUILD_ROSTER:30,
 RARITY_BANDS:[{maxLvl:99,w:{common:40,fine:30,rare:20,enchanted:8,legendary:2}}],resolveItemLevel:l=>l,
 rollItemRarity:()=>'rare',generateItem:(r,l,slot)=>({id:'it'+(++seq),rarity:r,slot,name:'Thing',value:{common:1,fine:2,rare:3,enchanted:4,legendary:5}[r]}),
 racks:{},equipRackOf:id=>ctx.racks[id]||{},notes:[],note:(ac,t)=>ctx.notes.push(t),logAbout:()=>{},
 remember:(a,g,d)=>{a.memory=a.memory||{};a.memory[g]=(a.memory[g]||0)+d;},
 released:[],releaseToMarket:(a,from)=>{ctx.released.push([a.name,from]);a.affiliation=null;a.joined=false;ctx.S.roster=ctx.S.roster.filter(x=>x!==a);},
 addFame:(a,n)=>{a.fame=(a.fame||0)+n;},guildRosterSize:()=>5,pron:a=>a.gender==='Female'?{s:'she',o:'her',p:'her'}:{s:'he',o:'him',p:'his'},cap:s=>s[0].toUpperCase()+s.slice(1),
 person:id=>ctx.S.agents.find(a=>a.id===Number(id)),render(){},saveLiving(){},endTurn(){ctx.S.turn++;}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/drives-world.js','utf8'),ctx);return ctx;}
let id=0;const mk=(w,o)=>{const a=Object.assign({id:++id,name:'P'+id,alive:true,lvl:20,cls:'Mage',region:'R',personality:'Loyal',gender:'Female',affection:50,loyalty:60,links:[]},o);w.S.agents.push(a);if(a.joined){a.affiliation='Brutus';w.S.roster.push(a);}return a;};
const run=(w,code)=>vm.runInContext(code,w);
// 1. personality sets the odds: Ambitious want classes far more often than Cautious
{const w=world();let amb=0,cau=0;for(let i=0;i<600;i++){const a=mk(w,{personality:'Ambitious'}),c=mk(w,{personality:'Cautious'});w.drvEnsure(a);w.drvEnsure(c);
 if(a.drives.some(d=>d.kind==='class'))amb++;if(c.drives.some(d=>d.kind==='class'))cau++;}
 assert(amb>cau*2.5,`ambitious ${amb} vs cautious ${cau}`);
 const c=mk(w,{personality:'Cautious'});for(let i=0;i<50;i++){c.drives=[];c.drivesRetry={};w.drvEnsure(c);const g=c.drives.find(d=>d.kind==='gear');if(g)assert(['Helm','Chest','Legs','Hand'].includes(g.slot));}}
// 2. companion gear: equipping it fulfils (loyalty +8); waiting past the grace costs affection
{const w=world();const a=mk(w,{joined:true});a.drives=[{kind:'gear',slot:'Weapon',rarity:'fine',since:1,progress:0}];a.drivesRetry={gear:99,class:99,person:99};
 for(let t=0;t<8;t++){w.endTurn();run(w,'drvTick()');}assert(a.affection<50,'patience runs out');
 w.S.inventory.push({id:'x',rarity:'rare',name:'Good Staff'});w.racks[a.id]={Weapon:'x'};const before=a.loyalty;run(w,'drvTick()');
 assert.equal(a.loyalty,before+8);assert(!a.drives.some(d=>d.kind==='gear'));assert(w.notes.some(t=>/got the weapon/.test(t)));}
// 3. class: nothing below Lv 10, then completes and changes class
{const w=world();const a=mk(w,{lvl:5,personality:'Ambitious',portrait:3});a.drives=[{kind:'class',target:'Priest',since:1,progress:0}];a.drivesRetry={gear:999,class:999,person:999};
 for(let t=0;t<20;t++)run(w,'drvTick()');assert.equal(a.drives[0].progress,0);a.lvl=12;
 for(let t=0;t<40&&a.cls!=='Priest';t++)run(w,'drvTick()');assert.equal(a.cls,'Priest');assert(w.notes.some(t=>/retrains as a Priest/.test(t)));}
// 4. person: a free agent signs where the person they want is
{const w=world();const t=mk(w,{affiliation:'Guild B'}),a=mk(w,{affiliation:null});a.drives=[{kind:'person',target:t.id,why:'ally',since:1,progress:0}];a.drivesRetry={gear:999,class:999,person:999};
 for(let i=0;i<60&&a.affiliation!=='Guild B';i++)run(w,'drvTick()');assert.equal(a.affiliation,'Guild B');}
// 5. a companion pulled away leaves you; high loyalty slows it a lot
{const turns=loy=>{const w=world();const t=mk(w,{affiliation:'Guild A'}),a=mk(w,{joined:true,loyalty:loy});a.drives=[{kind:'person',target:t.id,why:'lover',since:1,progress:0}];a.drivesRetry={gear:999,class:999,person:999};
  let n=0;while(a.affiliation!=='Guild A'&&n<400){run(w,'drvTick()');n++;}assert(w.released.some(r=>r[1]==='Brutus'));return n;};
 let lo=0,hi=0;for(let i=0;i<20;i++){lo+=turns(10);hi+=turns(100);}assert(hi>lo*2,`loyal ${hi} vs disloyal ${lo}`);}
// 6. recruit the person they want: resolved in Brutus's favour
{const w=world();const t=mk(w,{affiliation:'Guild A'}),a=mk(w,{joined:true});a.drives=[{kind:'person',target:t.id,why:'ally',since:1,progress:40}];a.drivesRetry={gear:999,class:999,person:999};
 t.joined=true;t.affiliation='Brutus';w.S.roster.push(t);const before=a.loyalty;run(w,'drvTick()');assert.equal(a.loyalty,before+10);assert(!a.drives.length);}
// 7. a free agent wanting one of yours ends up wanting in with your company
{const w=world();const t=mk(w,{joined:true}),a=mk(w,{affiliation:null});a.drives=[{kind:'person',target:t.id,why:'brutus',since:1,progress:99}];a.drivesRetry={gear:999,class:999,person:999};
 run(w,'drvTick()');assert(a.memory.Brutus>=15&&a.affection>=65);assert(w.notes.some(x=>/wants in with your company/.test(x)));}
// 8. free agents search for their gear themselves
{const w=world();const a=mk(w,{affiliation:'Guild A',personality:'Mercenary'});a.drives=[{kind:'gear',slot:'Helm',rarity:'rare',since:1,progress:0}];a.drivesRetry={gear:999,class:999,person:999};
 for(let i=0;i<80&&a.drives.length;i++)run(w,'drvTick()');assert(!a.drives.length&&a.bestFind&&a.bestFind.slot==='Helm');
 const p=w.drvFindChance(mk(w,{personality:'Mercenary'}),{rarity:'rare'});assert(Math.abs(p-0.35*0.30)<1e-9);}
console.log('PASS: personality odds (Ambitious class drives ≫ Cautious; Cautious wants armour); companion gear fulfilled by equipping (+8 loyalty), waiting costs affection; class change only from Lv 10, then completes; free agents sign with the person they want; companions pulled away leave, loyalty slows it; recruiting the person resolves it (+10); wanting one of yours raises opinion of Brutus; free agents find their own gear; find odds exact.');
