/* Personality experiment — one population (overworld patch, loaded last)
   Robert, 2026-10-25: "Build all facets" → "One population": keep the main overworld and every
   system in it, but its people and guilds ARE the personality sim's people (src/experiment/world-sim.js).
   Anyone you recruit, fight beside, back or read about is the same person.

   Who owns what
   - The sim owns life and death, rank, money, guild membership, feelings (one store: how anyone
     feels about Brutus is the sim's feel['B']; the game's `affection` is a view of it), lovers and
     feuds, crime, schemes, riots, coups, the labor market, arrivals.
   - The game keeps everything Brutus touches: class, level, abilities, items, interviews,
     recruiting, companions, contracts, dungeons, conquest, XP, the Chronicle, the campaign.
   - Each End Turn: the game's turn runs first; whatever it changed (a death, a hire, a recruit,
     a gift, guild money, Brutus's gold) is pulled into the sim as news; the sim runs one week;
     its results are pushed back into the game.
   - Switched off because the sim does them: the game's arrivals, delve deaths, romance/feud
     rolls (agentLifeTick keeps only levelling, feats and finds, for whoever the sim sent down),
     guild hiring, guild turnover, and payroll-driven quits (celebrityTick keeps fame, sponsor
     money for Brutus's own people, and gifts).
   Adds: a Bulletin screen (top three stories a week, with a bystander's line and a playtest-only
   trace), the week's bulletin on the World screen, "Word around town" + Back them on every
   profile, and Your stakes on the Bulletin screen. */
const PX = window.PXSim;
const PX_KEY = 'brutus-px-world-v1';
let PXW = null, pxSnap = null, pxN0 = 0, pxTurnLog = [], pxBabyAgent = null, pxDirty = false, pxCatastrophes = [];

// ---------------------------------------------------------------- mapping
// the game's five temperaments → the sim's eleven types (and back, for dialogue)
const PX_FROM_GAME = { Ambitious: ['Ambitious', 'Ambitious', 'Reckless'], Loyal: ['Loyal', 'Loyal', 'Kind', 'Masochist'], Mercenary: ['Greedy', 'Pragmatic'],
  Cautious: ['Cautious', 'Cautious', 'Pragmatic'], Proud: ['Proud', 'Demanding', 'Vengeful'] };
const PX_TO_GAME = { Ambitious: 'Ambitious', Reckless: 'Ambitious', Loyal: 'Loyal', Kind: 'Loyal', Masochist: 'Loyal', Greedy: 'Mercenary', Pragmatic: 'Mercenary',
  Cautious: 'Cautious', Proud: 'Proud', Demanding: 'Proud', Vengeful: 'Proud' };
function pxP(a) { return PXW && a && a.pxid != null ? PXW.people[a.pxid] : null; }
function pxA(p) { return p && p.aid != null ? person(p.aid) : null; }
function pxGuildByName(name) { return name ? PXW.guilds.find(g => g.name === name && !g.dead) : null; }
function pxAff(p) { return Math.max(0, Math.min(100, Math.round(50 + PX.feel(PXW, p, PX.BRUTUS) / 2))); }

// ---------------------------------------------------------------- build / save / load
function pxBuild() {
  const cast = S.agents.filter(a => a.alive), gl = Object.values(S.guilds);
  const idx = new Map(cast.map((a, i) => [a.id, i]));
  const spec = cast.map(a => {
    const gi = a.affiliation && a.affiliation !== 'Brutus' ? gl.findIndex(g => g.name === a.affiliation) : -1;
    const pool = PX_FROM_GAME[a.personality] || PX.TYPES;
    return { name: a.name, level: a.lvl, guild: gi >= 0 ? gi : null, held: a.affiliation === 'Brutus' || !!a.joined,
      type: pool[Math.floor(Math.random() * pool.length)], lover: a.lover != null && idx.has(a.lover) ? idx.get(a.lover) : null };
  });
  PX.hooks.name = PX.hooks.born = null;
  PXW = PX.fromCast(Math.floor(Math.random() * 2 ** 31), spec, gl.map(g => ({ name: g.name })), { gold: S.gold, population: 240 });
  PXW.guilds.forEach((g, i) => { g.sid = gl[i].id; });
  PXW.week = S.turn;   // the region's weeks are the game's turns
  cast.forEach((a, i) => {
    const p = PXW.people[i]; p.aid = a.id; a.pxid = i;
    PX.adj(PXW, p, PX.BRUTUS, ((a.affection == null ? 50 : a.affection) - 50) * 0.6);
  });
  pxHooks(); pxPush(true);
}
function pxHooks() {
  // newcomers the sim creates get a full game record (class, level, portrait rules) from makeAgent
  PX.hooks.name = () => { pxBabyAgent = makeAgent(); return pxBabyAgent.name; };
  PX.hooks.born = (w, p) => {
    const a = pxBabyAgent; pxBabyAgent = null; if (!a) return;
    a.affiliation = null; a.personality = PX_TO_GAME[p.type] || a.personality; a.pxid = p.id; p.aid = a.id;
    S.agents.push(a);
  };
  PX.hooks.guildName = () => {
    let name, n = 0;
    do { name = `${pick(NEW_GUILD_PREFIX)} ${pick(NEW_GUILD_CORE)}`.trim(); n++; }
    while (n < 40 && (Object.values(S.guilds).some(g => g.name === name) || PXW.guilds.some(g => g.name === name)));
    return name;
  };
  PX.hooks.guild = (w, g, founder) => {
    const id = 'g' + S.nextId++, a = pxA(founder), tend = pick(GUILD_TENDENCIES);
    S.guilds[id] = { id, name: g.name, tier: 'Chartered', home: a ? a.region : pick(REGIONS), roster: 1, hostility: 0, knowsBrutus: false, deaths: 0, lastDeathTurn: -99,
      reputation: 0, villainous: tend.villainous, tendency: tend.key, treasury: Math.round(g.treasury), reputationPenalty: 0, founded: S.turn };
    g.sid = id;
  };
}
function pxSave() { if (!PXW) return; pxDirty = false; PX.compact(PXW); try { localStorage.setItem(PX_KEY, JSON.stringify({ runId: S.runId, w: PXW })); } catch (e) { S.lastNotice = 'This browser could not save the region.'; } }
function pxLoad() {
  try { const d = JSON.parse(localStorage.getItem(PX_KEY) || 'null'); if (d && d.runId === S.runId && d.w) { PXW = d.w; pxHooks(); pxSnapshot(); return true; } } catch (e) {}
  return false;
}

// ---------------------------------------------------------------- game → sim (what the game changed this turn)
function pxSnapshot() {
  pxSnap = { gold: S.gold, agents: new Map(), guilds: new Map() };
  for (const a of S.agents) if (a.pxid != null) pxSnap.agents.set(a.id, { alive: a.alive, aff: a.affiliation || null, affection: a.affection });
  for (const g of Object.values(S.guilds)) pxSnap.guilds.set(g.id, g.treasury || 0);
}
const PX_DEATH_WORDS = /\b(dead|died|dies|killed|kills|grave|body|buried|murder|assassin|didn't come back|never came back|did not come back|fell|slain)/i;
const PX_MOVE_WORDS = /\b(joins|joined|signs|signed|hire|hired|leaves|left|walks|walked|poach|recruit|deserts|deserted|quits|quit|released|free agent)/i;
function pxWhy(a, words) { const t = pxTurnLog.find(x => x.includes(a.name) && words.test(x)); return t ? t.replace(/\s+/g, ' ').trim() : null; }
function pxPull() {
  if (!PXW || !pxSnap) return;
  // guilds the game founded or dissolved
  for (const g of Object.values(S.guilds)) if (!PXW.guilds.some(x => x.sid === g.id && !x.dead)) { const ng = PX.addGuild(PXW, g.name, Math.max(g.treasury || 0, 50000)); ng.sid = g.id; }
  for (const g of PXW.guilds) if (!g.dead && g.sid && !S.guilds[g.sid]) PX.dropGuild(PXW, g.id);
  // money that moved through the game's guild accounts (contracts, peace payments, rights)
  for (const g of PXW.guilds) { const sg = g.sid && S.guilds[g.sid]; if (sg && pxSnap.guilds.has(sg.id)) g.treasury += (sg.treasury || 0) - pxSnap.guilds.get(sg.id); }
  // the game's world events: one story for the disaster, each death traced to it
  for (const c of pxCatastrophes) {
    const dead = c.ids.map(person).filter(a => a && pxP(a) && pxP(a).alive);
    if (!dead.length) continue;
    const top = dead.slice().sort((x, y) => (pxP(y).fame || 0) - (pxP(x).fame || 0)).slice(0, 3);
    const e = PX.news(PXW, c.text ? c.text.replace(/^./, x => x.toUpperCase()) : `${c.name.replace(/^./, x => x.toUpperCase())} hit the region. ${dead.length} dead.`, top.map(a => a.pxid), null, 'catastrophe', 1.5 + dead.length / 6, { place: c.name });
    for (const a of dead) PX.kill(PXW, a.pxid, `${a.name} died when ${c.name} hit.`, 'death', e, 0.3);
  }
  pxCatastrophes = [];
  for (const a of S.agents) {
    let p = pxP(a);
    if (!p) {   // someone the game made on its own
      if (!a.alive) continue;
      const g = pxGuildByName(a.affiliation);
      p = PX.adopt(PXW, { name: a.name, level: a.lvl, guild: g ? g.id : null, held: a.affiliation === 'Brutus', type: pick(PX_FROM_GAME[a.personality] || PX.TYPES) });
      p.aid = a.id; a.pxid = p.id; continue;
    }
    const was = pxSnap.agents.get(a.id); if (!was) continue;
    if (was.alive && !a.alive && p.alive) { PX.kill(PXW, p.id, pxWhy(a, PX_DEATH_WORDS) || `${a.name} is dead.`, 'death'); continue; }
    if (!p.alive) continue;
    if ((a.affiliation || null) !== was.aff) {
      const to = a.affiliation || null, why = pxWhy(a, PX_MOVE_WORDS);
      if (to === 'Brutus') PX.setHeld(PXW, p.id, true, `${a.name} signs on with Brutus.`);
      else {
        if (was.aff === 'Brutus') PX.setHeld(PXW, p.id, false, `${a.name} leaves Brutus's company.`);
        const g = pxGuildByName(to);
        PX.setGuild(PXW, p.id, g ? g.id : null, was.aff === 'Brutus' ? null : (why || (g ? `${a.name} joins ${g.name}.` : `${a.name} is a free agent again.`)), g ? 'signing' : 'walkout');
      }
    }
    if (a.affection != null && was.affection != null && a.affection !== was.affection) PX.adj(PXW, p, PX.BRUTUS, (a.affection - was.affection) * 2);
  }
  // dungeon openings that closed without Brutus: someone of that rank claims them
  for (const d of S.dungeons || []) if (d.closed && !d.pxSeen) { d.pxSeen = true; if (d.expires < S.turn) PX.claim(PXW, { name: d.name, rank: d.rank || 2, reward: d.reward || 30000, tried: d.pxTried }); }
  PXW.brutus.gold = S.gold;
  pxTurnLog = [];
}

// ---------------------------------------------------------------- sim → game
function pxPush(quiet) {
  if (!PXW) return;
  if (!quiet && PXW.brutus.gold !== S.gold) { const d = Math.round(PXW.brutus.gold - S.gold); if (d) changeGold(d, 'Stakes'); }
  PXW.brutus.gold = S.gold;
  for (const g of PXW.guilds) {
    const sg = g.sid && S.guilds[g.sid];
    if (g.dead) { if (sg) delete S.guilds[g.sid]; continue; }
    if (sg) sg.treasury = Math.round(g.treasury);
  }
  const floor = PXW.lvlFloor || {};
  for (const p of PXW.people) {
    const a = pxA(p); if (!a) continue;
    if (!p.alive && a.alive) {
      a.alive = false; a.pxGone = p.slums ? 'slums' : 'dead'; releaseUnique(a);
      if (a.joined || a.affiliation === 'Brutus') leaveCrew(a);
      else if (!p.slums && typeof applyGuildDeathConsequence === 'function') applyGuildDeathConsequence(a);
      continue;
    }
    if (p.alive && !a.alive && p.slums === false && a.pxGone === 'slums') { a.alive = true; a.pxGone = null; }
    if (!p.alive) continue;
    if (!p.held && a.affiliation !== 'Brutus') { const g = p.guild == null ? null : PXW.guilds[p.guild]; a.affiliation = g && !g.dead ? g.name : null; }
    a.pxRank = p.rank;
    if (floor[p.rank] && a.lvl < floor[p.rank]) { a.lvl = floor[p.rank]; a.cap = Math.max(a.cap || 0, a.lvl); }
    const lv = p.lover != null ? PXW.people[p.lover] : null;
    a.lover = lv && lv.alive && lv.aid != null ? lv.aid : null;
    a.feuds = Object.keys(p.feel).filter(k => k !== PX.BRUTUS && p.feel[k] < -60 && PXW.people[k] && PXW.people[k].alive && PXW.people[k].aid != null)
      .sort((x, y) => p.feel[x] - p.feel[y]).slice(0, 3).map(k => PXW.people[k].aid);
    a.affection = pxAff(p);
  }
  for (const g of Object.values(S.guilds)) g.roster = S.agents.filter(a => a.alive && a.affiliation === g.name).length;
  pxSnapshot();
}

// ---------------------------------------------------------------- the game's own churn, switched off
const pxOldLife = agentLifeTick;
agentLifeTick = function () {
  if (!PXW) return pxOldLife();
  // the game's own arrivals this turn (fresh, unaffiliated): the sim does arrivals
  for (let i = S.agents.length - 1; i >= pxN0; i--) { const a = S.agents[i]; if (a && a.pxid == null && !a.affiliation && !a.known) S.agents.splice(i, 1); }
  // whoever the sim sent down last week grows like the game's delvers did: levels, feats, finds
  for (const a of S.agents) {
    const p = pxP(a);
    if (!a.alive || !p || p.delved !== PXW.week || a.joined) continue;
    if (a.lvl < a.cap) { a.lvl++; if (ABILITY_RANK_MIN_LEVEL.includes(a.lvl)) grantRankRolls(a); }
    if (Math.random() < 0.14) { const better = pick(FEATS.filter(f => f[1] > a.feat.value)); if (better) { a.feat = { text: better[0], value: better[1] }; addFame(a, 8 + better[1] * 0.3); } }
    if (Math.random() < 0.18) { const found = generateItem(rollItemRarity(a.lvl), a.lvl); a.bestFind = (!a.bestFind || found.value > a.bestFind.value) ? found : a.bestFind; }
  }
  if (typeof feudDuelTick === 'function') feudDuelTick(notableSet());   // feuds come from the sim now; grudges still settle themselves
};
const pxOldHiring = guildHiringTick; guildHiringTick = function () { if (!PXW) return pxOldHiring(); };
const pxOldTurnover = guildTurnoverTick; guildTurnoverTick = function () { if (!PXW) return pxOldTurnover(); };
const pxOldCeleb = celebrityTick;
celebrityTick = function () {
  if (!PXW) return pxOldCeleb();
  // keep fame, sponsor money for Brutus's own people and gifts; the sim keeps the guild books
  const keep = Object.values(S.guilds).map(g => [g, g.treasury]);
  for (const [g] of keep) g.treasury = 1e15;
  try { pxOldCeleb(); } finally { for (const [g, t] of keep) { g.treasury = t; g.missedPayroll = false; } }
};
const pxOldThreat = fireEventThreat;
fireEventThreat = function (ev) {
  if (!PXW) return pxOldThreat.apply(this, arguments);
  const before = new Set(S.agents.filter(a => a.alive).map(a => a.id)), n = pxTurnLog.length;
  const r = pxOldThreat.apply(this, arguments);
  const ids = S.agents.filter(a => before.has(a.id) && !a.alive).map(a => a.id);
  if (ids.length) {
    const text = pxTurnLog.slice(n).find(t => /hits hard/i.test(t)) || null, m = text && text.match(/\b(the [^.,;]*?) hits hard/i);
    pxCatastrophes.push({ name: m ? m[1].toLowerCase() : 'the ' + String(ev && ev.name || 'disaster').toLowerCase(), ids, text });
  }
  return r;
};
const pxOldLog = logMsg;
logMsg = function (text, cls) { pxTurnLog.push(String(text || '')); if (pxTurnLog.length > 400) pxTurnLog.shift(); return pxOldLog(text, cls); };

// ---------------------------------------------------------------- the turn
const pxOldEnd = endTurn;
endTurn = function () {
  if (!PXW) return pxOldEnd();
  const t0 = S.turn; pxN0 = S.agents.length;
  pxOldEnd();
  if (S.turn === t0) return;   // blocked (an expedition, an interview, a duel)
  pxPull();
  PX.step(PXW);
  pxPush(); pxDirty = true;
  render();
};
const pxOldResult = applyDungeonResult;
applyDungeonResult = function (r) {
  const c = S.pendingDelve ? S.activeContract : null, d = c && (S.dungeons || []).find(x => x.id === c.id);
  const wasOpen = d && !d.closed, crew = (S.expeditionParty || []).map(person).filter(a => a && a.alive);
  pxOldResult(r);
  if (!PXW || !c || !r || r.initializationFailed) return;
  const won = !!(d && wasOpen && d.closed && !r.brutusDowned), downed = !!r.brutusDowned;
  if (won && d) d.pxSeen = true;
  // the story first, with everyone who went down; then the dead, traced to it; then whatever else the game changed
  const e = PX.outcome(PXW, { name: c.name, rank: c.rank || (d && d.rank) || 2, objective: c.objective || 'the job', reward: c.reward || 0 }, won, downed,
    crew.map(a => a.pxid).filter(i => i != null));
  if (d && !won) d.pxTried = e;
  for (const a of crew) if (!a.alive && pxP(a) && pxP(a).alive) PX.kill(PXW, a.pxid, `${a.name} went down with Brutus into ${c.name} and did not come back.`, 'death', e);
  pxPull(); pxPush(); pxSave(); render();
};

// ---------------------------------------------------------------- run lifecycle and saving
const pxOldNew = newRun;
newRun = function () { PXW = null; pxOldNew(); pxBuild(); pxSave(); render(); };
const pxOldLoad = loadLiving;
loadLiving = function (raw) { const ok = pxOldLoad(raw); if (ok && !pxLoad()) { pxBuild(); pxSave(); } return ok; };
const pxOldSave = saveLiving;
saveLiving = function () { pxOldSave(); if (pxDirty && S.castReady && !S.pendingDelve) pxSave(); };

// ---------------------------------------------------------------- reading it: bulletin, voices, profiles
function pxName(id) { if (id === PX.BRUTUS) return 'Brutus'; const p = PXW.people[id]; return p ? p.name : 'someone'; }
function pxSpeaker(e) {
  const actors = e.actors.filter(a => a !== PX.BRUTUS);
  if (e.kind === 'expedition') {
    const pool = PX.alive(PXW).filter(p => p.feel[PX.BRUTUS] != null && e.actors.indexOf(p.id) < 0);
    return pool.sort((a, b) => e.won ? b.feel[PX.BRUTUS] - a.feel[PX.BRUTUS] : a.feel[PX.BRUTUS] - b.feel[PX.BRUTUS])[0] || null;
  }
  if (!actors.length) return null;
  const a = PXW.people[actors[0]]; let best = null, bv = -1;
  for (const p of PXW.people) {
    if (!p.alive || e.actors.indexOf(p.id) >= 0) continue;
    const v = (a.kin.indexOf(p.id) >= 0 ? 200 : 0) + (p.lover === a.id ? 150 : 0) + Math.abs(p.feel[a.id] || 0) + (p.guild != null && p.guild === a.guild ? 20 : 0);
    if (v > bv) { bv = v; best = p; }
  }
  return best;
}
function pxLine(e, sp) {
  const n = e.actors.map(pxName), A = n[0], B = n[1], k = e.kind;
  if (k === 'expedition') { const f = sp ? sp.feel[PX.BRUTUS] || 0 : 0;
    return e.won ? (f > 40 ? 'Told you. Told every one of you.' : "Fine. He did it. Doesn't mean I have to like him.")
      : e.downed ? (f < -30 ? "Carried out like a sack of turnips. Best thing I've seen all year." : "Rough one. He'll be back down there, you watch.") : 'Came back with nothing. Happens to everyone. Mostly to him.'; }
  if (e.brutus && k === 'devoted') return 'You backed me when nobody would. This is yours.';
  if (e.brutus && k === 'hostile') return `I hear ${A} has been selling stories about you. To anyone with a coin.`;
  const V = {
    walkout: `${A} finally walked out. I give it a week before they're begging somewhere else.`, poach: `Did you hear what ${B} got paid to switch? I'm in the wrong line of work.`,
    follow: `${A} went wherever ${B} went. Some people have no spine. Or too much heart.`, coup: `${A} runs the place now. ${B} didn't see it coming. Nobody ever does.`,
    succession: `${A} is in charge now. Let's see how long that lasts.`, purge: `${A} threw ${B} out the first chance they got. Saw that coming a mile off.`,
    collapse: 'Whole hall boarded up. I used to drink there.', founding: `${A} has a guild of their own now. Bold. Or stupid.`, exposed: "You haven't heard? Oh, you haven't heard.",
    accusation: `${A} says ${B} robbed them. ${B} says ${A} can go to the deep.`, murder: `They're still scrubbing the tavern floor. ${B}. Over nothing.`,
    riot: `I was there. ${A} stood on a barrel and the whole street just went.`, death: `${A} didn't come back up. Nobody's cleared their bunk yet.`,
    ruin: `Saw ${A} in the slums. Didn't say hello. Didn't know what to say.`, humiliation: `${A} made ${B} look like a fool in front of everyone. ${B} won't forget it.`,
    swindle: `Never do business with ${A}. Ask ${B}.`, revenge: `${A} got even with ${B}. Took long enough.`, scapegoat: `They threw ${A} out for it. ${A}? Please.`,
    defection: `${A} just upped and left. For the contracts, they say. Sure.`, stake: e.brutus ? `Brutus put money on ${n[n.length - 1]}. Brutus!` : `${A} put money on ${B}. Must know something we don't.`,
    snub: `${A} is still sore that someone else backed ${B} instead.`, assault: `${B}'s face. You should see ${B}'s face.`, rise: `${A}'s wearing a new rank badge and won't shut up about it.`,
    fall: `${A} got busted down a rank. Couldn't pay for their kit.`, heir: `New face in town. ${A}. Says they're kin to someone. Wouldn't say who.`,
    inherit: `${A} came into money. Funeral money. Doesn't look happy about it.`, devoted: `${A} would walk into fire for ${B}. I've seen it.`,
    hostile: `Whatever ${B} did to ${A}, ${A} is making them pay for it.`, haul: `${A} came up with a fortune. Drinks are on ${A}, apparently.`, crime: `They finally caught ${A}. About time.`,
    duel: 'Half the town bet on that duel. The other half bet wrong.', twist: `${A} was only supposed to charm ${B}. Now look at them.`, blackmail: `${B} looks like someone who's paying for silence.`,
    signing: e.brutus ? `${B} with Brutus. Didn't see that coming.` : `${A} signed with a new crew. Fresh coat, same smile.`, loyal: `${A} turned down a fortune to stay put. Fool or saint, I can't decide.`,
    switch: `${A} changed guilds for a better cut. Can't blame them.`, undercut: `${A} took ${B}'s contract right out from under them.`, crackdown: `${A} put ${B} in their place in front of everyone.`,
    betrayal: `${A} sold ${B} out. For money. Of course for money.`, report: `${A} went to the watch about ${B}. Before anything even happened.`, brawl: `${A} picked a fight with ${B} for fun. For fun!`,
    callout: `${A} told ${B || 'everyone'} exactly what everyone was thinking.`, odd: `${A} thanked ${B} for hitting them. I'm not making this up.`, return: `${A} crawled back out of the slums. Good for them.`,
    claim: `${A} walked out of ${e.place || 'that place'} like it was nothing. Next round's on ${A}.`,
    catastrophe: `I knew ${A}. Knew half of them, really. You don't get used to it.`
  };
  return V[k] || null;
}
function pxWho(id) { const p = id === PX.BRUTUS ? null : PXW.people[id], a = p && pxA(p); return a ? `<button class="px-name" data-person="${a.id}">${esc(a.name)}</button>` : `<b>${esc(pxName(id))}</b>`; }
function pxCard(e) {
  const sp = pxSpeaker(e), line = pxLine(e, sp), spA = sp && pxA(sp), tr = PX.chain(PXW, e.id);
  const trace = tr.length > 1 ? `<details class="px-trace"><summary>Trace this story (${tr.length} steps, playtest only)</summary><ol>${tr.map(x => `<li>Turn ${x.week}: ${esc(x.text)}</li>`).join('')}</ol></details>` : '';
  return `<article class="dispatch px-story${e.brutus ? ' px-you' : ''}">${line ? `<p class="px-quote">${spA ? `<button class="px-name" data-person="${spA.id}">${esc(spA.name)}</button>:` : 'Someone at the bar:'} “${esc(line)}”</p>` : ''}<p>${esc(e.text)}</p><div class="actors">${e.actors.filter(i => i !== PX.BRUTUS).slice(0, 3).map(pxWho).join(' ')}</div>${trace}</article>`;
}
function pxBulletinWeek(week, n) { return PX.bulletin(PXW, week, n || 3); }
function pxStakes() {
  const mine = PXW.stakes.filter(s => s.by === PX.BRUTUS);
  if (!mine.length) return '<p class="muted">You haven\'t backed anyone. Open anyone\'s profile and choose Back them.</p>';
  return `<table class="px-table"><thead><tr><th>Who</th><th>Paid</th><th>Back so far</th><th>Turns left</th><th>How they see you</th></tr></thead><tbody>${mine.slice().reverse().map(s => {
    const p = PXW.people[s.who], a = pxA(p);
    return `<tr><td>${a ? `<button class="px-name" data-person="${a.id}">${esc(p.name)}</button>` : esc(p.name)} <span class="muted">${p.rank}</span>${p.alive ? '' : ' <span class="pill">gone</span>'}</td><td>${fmtGold(s.amt)}</td><td>${fmtGold(s.paid)}</td><td>${s.left > 0 ? s.left : 'done'}</td><td>${p.alive ? PX.feelWord(PX.feel(PXW, p, PX.BRUTUS)) : ''}</td></tr>`;
  }).join('')}</tbody></table>`;
}
function pxBulletinScreen() {
  let h = `<section class="panel"><h2>Turn ${PXW.week}: what everyone is talking about</h2>${pxBulletinWeek(PXW.week).map(pxCard).join('') || '<p class="muted">A quiet week. Nobody has anything worth repeating.</p>'}</section>`;
  const mine = PXW.events.filter(e => e.week === PXW.week && e.brutus && !e.hidden && pxBulletinWeek(PXW.week).indexOf(e) < 0);
  if (mine.length) h += `<section class="panel"><h2>About you</h2>${mine.map(pxCard).join('')}</section>`;
  h += `<section class="panel"><h2>Your stakes</h2><p class="muted">You pay up front; they pay you a quarter of their hauls for 26 turns. How they come to feel about you decides the rest.</p>${pxStakes()}</section>`;
  h += `<section class="panel"><h2>Earlier</h2>${Array.from({ length: Math.min(8, Math.max(0, PXW.week - 1)) }, (_, i) => PXW.week - 1 - i).map(wk => `<details><summary>Turn ${wk}</summary>${pxBulletinWeek(wk).map(pxCard).join('') || '<p class="muted">Quiet.</p>'}</details>`).join('')}</section>`;
  const M = PXW.M;
  h += `<section class="panel"><details><summary>World numbers (playtest only)</summary><p class="muted">${PX.alive(PXW).length} people · ${PX.live(PXW).length} guilds · ${Math.round((PXW.series.strained.slice(-1)[0] || 0) * 100)}% scraping by or in debt</p><p class="muted">Deaths ${M.deaths} · to the slums ${M.dropouts} · newcomers ${M.arrivals} · crimes ${M.crimes} · murders ${M.murders} · riots ${M.riots} · coups ${M.coups} · schemes ${M.schemes} (exposed ${M.exposed}) · signings ${M.signings} · poached ${M.poaches} · walkouts ${M.walkouts} · guilds folded ${M.collapses} · founded ${M.foundings} · stakes ${M.stakes}</p></details></section>`;
  return h;
}
function pxProfilePanel(a) {
  const p = pxP(a); if (!p) return '';
  if (!p.alive) return `<section class="panel"><h2>What people say about them</h2><p>${p.slums ? 'Last seen in the slums.' : 'Dead.'}</p></section>`;
  const names = ks => ks.map(k => { const q = PXW.people[k], qa = pxA(q); return qa ? `<button class="px-name" data-person="${qa.id}">${esc(q.name)}</button>` : esc(q.name); }).join(', ');
  const live = k => k !== PX.BRUTUS && PXW.people[k] && PXW.people[k].alive;
  const close = new Set(p.kin.map(String).concat(p.lover != null ? [String(p.lover)] : []));
  const friends = Object.keys(p.feel).filter(k => live(k) && !close.has(k) && p.feel[k] > 40).sort((x, y) => p.feel[y] - p.feel[x]).slice(0, 3);
  const foes = Object.keys(p.feel).filter(k => live(k) && p.feel[k] < -40).sort((x, y) => p.feel[x] - p.feel[y]).slice(0, 3);
  const kin = p.kin.filter(live), lover = p.lover != null && live(p.lover) ? [p.lover] : [];
  const lately = PXW.events.filter(e => !e.hidden && e.kind !== 'coop' && e.actors.indexOf(p.id) >= 0).slice(-5).reverse();
  const backed = PXW.stakes.some(s => s.by === PX.BRUTUS && s.who === p.id && s.left > 0), price = PX.brutusStakeCost(p);
  const leads = p.guild != null && PXW.guilds[p.guild].leader === p.id;
  return `<section class="panel px-word"><h2>What people say about them</h2><p>${p.rank}-rank${leads ? ` · leads ${esc(PXW.guilds[p.guild].name)}` : ''} · ${PX.standing(p)}${p.jail ? ` · locked up for ${p.jail} more turns` : ''}${p.held ? ' · on your payroll' : ''}</p>
  <p><b>Close to:</b> ${[lover.length ? names(lover) + ' (lover)' : '', kin.length ? names(kin) + ' (kin)' : '', names(friends)].filter(Boolean).join(', ') || 'nobody in particular'}</p>
  <p><b>Can't stand:</b> ${foes.length ? names(foes) : 'nobody, yet'}</p>
  <p><b>How they see you:</b> ${PX.feelWord(PX.feel(PXW, p, PX.BRUTUS))}</p>
  <h3>Lately</h3>${lately.length ? `<ul>${lately.map(e => `<li>Turn ${e.week}: ${esc(e.text)}</li>`).join('')}</ul>` : '<p class="muted">Nothing anyone talks about.</p>'}
  ${p.held ? '' : backed ? '<p class="pill">You hold a stake</p>' : btn(`Back them · ${fmtGold(price)}`, 'pxback', a.id, S.gold < price, 'gold')}</section>`;
}
const pxOldProfile = profile;
profile = function (a) { const h = pxOldProfile(a); return PXW && a ? h + pxProfilePanel(a) : h; };
const pxOldRenderLiving = renderLiving;
renderLiving = function () {
  pxOldRenderLiving();
  const root = $('living'); if (!root || !PXW) return;
  const nav = root.querySelector('nav');
  if (nav && !nav.querySelector('[data-id="bulletin"]')) {
    const b = document.createElement('button'); b.dataset.action = 'nav'; b.dataset.id = 'bulletin'; b.className = screen === 'bulletin' ? 'selected' : '';
    b.innerHTML = 'Bulletin<span></span>';
    const after = nav.querySelector('[data-id="chronicle"]'); after ? after.after(b) : nav.appendChild(b);
  }
  const content = root.querySelector('.content'); if (!content) return;
  if (screen === 'bulletin') {
    const h1 = root.querySelector('.topbar h1'); if (h1) h1.textContent = 'What people are saying.';
    content.innerHTML = pxBulletinScreen();
  } else if (screen === 'world') {
    const top = pxBulletinWeek(PXW.week);
    if (top.length) content.insertAdjacentHTML('afterbegin', `<section class="panel px-this-week"><h2>This turn's bulletin</h2>${top.map(pxCard).join('')}<p>${btn('Read the bulletin', 'nav', 'bulletin')}</p></section>`);
  }
};
const pxOldHandle = handleLiving;
handleLiving = function (e) {
  const b = e.target.closest('[data-action="pxback"]');
  if (b && !b.disabled && PXW) {
    const a = person(b.dataset.id), p = pxP(a);
    if (p) {
      PXW.brutus.gold = S.gold;
      const r = PX.brutusBack(PXW, p.id);
      if (r.error) S.lastNotice = r.error;
      else { changeGold(-r.price, `Stake in ${a.name}`); PXW.brutus.gold = S.gold; S.lastNotice = `You bought a stake in ${a.name} for ${fmtGold(r.price)}.`; pxSnapshot(); pxSave(); }
      render();
    }
    return;
  }
  return pxOldHandle(e);
};
(function pxStyle() {
  const s = document.createElement('style');
  s.textContent = '.px-story{margin:0 0 12px}.px-story p{margin:4px 0}.px-quote{font:17px/1.4 Georgia,serif}.px-name{display:inline;padding:0;font:inherit;color:var(--gold,#d8b46a);background:none;border:0;cursor:pointer}' +
    '.px-you{border-left:3px solid var(--gold,#d8b46a)}.px-trace{margin-top:6px;font-size:12px;opacity:.85}.px-table{width:100%;border-collapse:collapse}.px-table th,.px-table td{text-align:left;padding:6px;border-bottom:1px solid #9d815640}';
  document.head.appendChild(s);
})();
