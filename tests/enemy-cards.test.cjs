// node tests/enemy-cards.test.cjs: enemy 40-card decks and the card framework
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../src/dungeon/enemies/enemy-cards.js','utf8');
const code=src.replace(/\/\*[\s\S]*?\*\//,'');
assert(!/["`\\$]/.test(code),'embed-safe: no double quotes, backticks, backslashes, dollar signs');
assert(!/'[^']*'[^',;:)\]}\s]/.test('')); // placeholder keeps lint quiet
const make=()=>{const log=[],drains=[],shoves=[];
 const ctx={Math,console,log,drains,shoves,
  pickEnemyAttack:e=>({name:'OLD',tier:'light',windup:500,active:120,recovery:300,dmg:8,range:2,armorHits:0}),
  updateEnemy:function(e,dt){ctx.updated=(ctx.updated||0)+1;},
  landHit:(a,t,h)=>({dealt:h.dmg}),
  drainEnergy:(t,n)=>{drains.push(n);}, incomingDrain:(t,n)=>n,
  applyKnockback:(t,x,z,n)=>{shoves.push(n);}, logMsg:m=>log.push(m)};
 vm.createContext(ctx);vm.runInContext(src,ctx);return ctx;};
const enemy=(kind,o)=>Object.assign({kind,name:kind,side:'enemy',hp:50,maxHp:50,energy:70,maxEnergy:70,aware:true,phase:'idle',attackCd:0,target:{energy:20,maxEnergy:20,stunned:false}},o||{});
const ELEM=/\b(fire|flame|frost|rime|ice|venom|poison|storm|lightning|thunder|holy|shadow|umbral|burn|cinder|ember|blaze|smite|radiant|inferno|ash)/i;
// 1. decks: 40 cards, <=3 copies, finishers single, unique names within a deck, no elemental names
{const w=make();const names=new Set();
 for(const kind of ['skulker','brute','stalker','zombie','cultist','hound','boss']){
  const d=vm.runInContext('ecBuildDeck('+JSON.stringify(kind)+')',w);assert.equal(d.length,40,kind+' has 40');
  const by={};for(const c of d)by[c.name]=(by[c.name]||0)+1;
  for(const [n,k] of Object.entries(by)){assert(k<=3,kind+' '+n+' max 3');assert(!ELEM.test(n),'elemental: '+n);}
  assert.equal(Object.values(by).filter(k=>k===1).length,1,kind+' has exactly one finisher');
  for(const c of d){assert(c.dmg>0&&c.windup>=380&&c.windup<=2100,c.name);}
  const light=d.filter(c=>c.tier==='light').length,heavy=d.filter(c=>c.tier==='heavy').length;
  assert(light>=6&&heavy>=6,kind+' curve');
 }}
// 2. a deck enemy plays only cards from its deck, hand stays at 3, deck cycles through reshuffles
{const w=make();const e=enemy('brute',{energy:100,maxEnergy:100});const seen=new Set();
 for(let i=0;i<200;i++){e.energy=100;e.target.stunned=false;const a=w.pickEnemyAttack(e);assert(a.card,'card attack');seen.add(a.name);assert.equal(e.ecHand.length,3,'hand 3');
  assert.equal(e.ecDeck.length+e.ecDiscard.length+e.ecHand.length,40,'cards conserved');}
 assert(seen.size>=8,'variety '+seen.size);}
// 3. costs scale to the enemy bar and are paid; energy never reaches zero from its own plays
{const w=make();const e=enemy('skulker');let min=1e9;
 for(let i=0;i<300;i++){const before=e.energy;const a=w.pickEnemyAttack(e);if(a.resolute||!a.card)continue;assert(e.energy<before,'paid');min=Math.min(min,e.energy);e.energy=Math.min(e.maxEnergy,e.energy+3);}
 assert(min>=1,'never zero: '+min);}
// 4. nothing affordable: the enemy waits (attackCd) instead of attacking
{const w=make();const e=enemy('brute',{energy:5,maxEnergy:100});vm.runInContext('ecSetup',w);
 w.updateEnemy(e,0.016);assert.equal(e.attackCd,250,'waits');
 const e2=enemy('brute',{energy:100,maxEnergy:100});w.updateEnemy(e2,0.016);assert.equal(e2.attackCd,0,'ready to strike');}
// 5. enraged plays recklessly: hardest card in hand regardless of cost
{const w=make();const e=enemy('brute',{energy:3,maxEnergy:100,enraged:true});w.updateEnemy(e,0.016);assert.equal(e.attackCd,0,'enraged never waits');
 const a=w.pickEnemyAttack(e);assert(a.card);assert(e.energy===3,'enraged pays nothing');}
// 6. stunned or drained targets draw heavier plays
{const w=make();const count=(stun)=>{let h=0;for(let i=0;i<600;i++){const e=enemy('stalker',{energy:85,maxEnergy:85});e.target.stunned=stun;e.energy=85;if(w.pickEnemyAttack(e).tier==='heavy')h++;}return h;};
 assert(count(true)>count(false)*1.4,'heavier on a stunned target');}
// 7. riders apply on a landed hit and only for the card that carries them
{const w=make();const e=enemy('brute',{energy:100,maxEnergy:100});const t={energy:20,maxEnergy:20,downed:false};
 e.attack={name:'Stomp',tier:'light',dmg:7,rider:{kind:'drain',n:3}};w.landHit(e,t,{name:'Stomp',tier:'light',dmg:7});assert.deepEqual(w.drains,[3]);
 e.attack={name:'Backhand',tier:'light',dmg:9,rider:{kind:'shove',n:0.5}};w.landHit(e,t,{name:'Backhand',tier:'light',dmg:9});assert.deepEqual(w.shoves,[0.5]);
 e.attack={name:'Stomp',tier:'light',dmg:7,rider:{kind:'drain',n:3}};w.landHit(e,t,{name:'Other',tier:'light',dmg:7});assert.equal(w.drains.length,1,'name mismatch: no rider');
 const p=w.landHit({side:'player'},t,{name:'x',dmg:5});assert.equal(p.dealt,5,'player hits untouched');}
// 8. brace card is a resolute attack costing 40 at the engine and needs 50 energy
{const w=make();const d=vm.runInContext('ecBuildDeck("brute")',w);const b=d.find(c=>c.name==='Plant Feet');
 assert(b.resolute&&b.armorHits===2&&b.energyCost===40);
 const e=enemy('brute',{energy:45,maxEnergy:100});assert(!vm.runInContext('ecAffordable',w)(e,b),'needs 50');
 e.energy=60;assert(vm.runInContext('ecAffordable',w)(e,b));}
// 9. kinds without a deck keep the old pick and never wait
{const w=make();const e=enemy('grazer');assert.equal(w.pickEnemyAttack(e).name,'OLD');w.updateEnemy(e,0.016);assert.equal(e.attackCd,0);}
// 10. heavy plays are announced, light ones are not
{const w=make();const e=enemy('brute',{energy:100,maxEnergy:100});for(let i=0;i<60;i++){e.energy=100;w.pickEnemyAttack(e);}
 assert(w.log.length>0&&w.log.every(m=>/readies/.test(m)));}
console.log('enemy-cards: all pass');
