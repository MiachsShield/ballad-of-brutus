"""Personality experiment: headless playtest of the one-population build (Claude, 2026-10-25).
Plays builds/EXPERIMENT-personality.html in Chromium and checks that the game and the personality
sim are one population: recruiting, gifts, releasing, a real expedition with the party, a stake
bought from a profile, game/sim agreement on who is alive and where, reload, new run. Then soaks
52 turns and prints the region's numbers.
usage: python3 tools/playtest-harness/personality-experiment.py [build] [soak turns]
Writes a test copy with one hook (window.__W evaluates inside the overworld) to a temp folder;
the build itself is never modified. Exits 1 on any FAIL or page error."""
import sys, os, tempfile, time
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
BUILD = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', '..', 'builds', 'EXPERIMENT-personality.html')
SOAK = int(sys.argv[2]) if len(sys.argv) > 2 else 52
s = open(BUILD, encoding='utf-8').read()
anchor = 'if(!initialSave||!loadLiving(initialSave))newRun();initialSave=null;'
assert s.count(anchor) == 1, 'overworld anchor not found once'
INST = os.path.join(tempfile.mkdtemp(), 'px-inst.html')
open(INST, 'w', encoding='utf-8').write(s.replace(anchor, 'window.__W=function(s){return eval(s)};' + anchor))
fails = []
def ok(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
errs=[]
def ok(c,m): print(('PASS ' if c else 'FAIL ')+m)
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':1400,'height':900}); pg=ctx.new_page()
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+INST);pg.wait_for_timeout(3000)
    wf=lambda: [f for f in pg.frames if f.url=='about:srcdoc'][0]
    E=lambda s: wf().evaluate("s=>{const r=window.__W(s);return typeof r==='string'?r:JSON.stringify(r)}",s)
    ok(E("PXW.week===S.turn")=='true','region week matches game turn')
    # 1 recruit a free agent through the game's own sink
    rid=E("String(S.agents.find(a=>a.alive&&!a.affiliation&&!a.joined&&a.lvl<=S.brutus.lvl).id)")
    E(f"finalizeJoin(person({rid}),500)")
    ok(E(f"person({rid}).affiliation")=='Brutus','recruit joins in the game')
    E("endTurn()")
    ok(E(f"PXW.people[person({rid}).pxid].held")=='true','recruit is held in the sim')
    ok('signs on with Brutus' in E(f"PXW.events.filter(e=>e.actors.includes(person({rid}).pxid)).map(e=>e.text).join('|')"),'recruiting is news')
    # 2 a gift moves the one feelings store
    gid=E("String(S.agents.find(a=>a.alive&&a.affiliation&&a.affiliation!=='Brutus').id)")
    f0=float(E(f"PX.feel(PXW,PXW.people[person({gid}).pxid],'B')"))
    E(f"S.actions=2;gift({gid})"); E("endTurn()")
    f1=float(E(f"PX.feel(PXW,PXW.people[person({gid}).pxid],'B')"))
    ok(f1>f0+10 or E(f"person({gid}).alive")=='false', f'gift raises sim feeling {f0:.0f}->{f1:.0f}')
    ok(E(f"person({gid}).affection")==E(f"String(Math.round(Math.max(0,Math.min(100,50+PX.feel(PXW,PXW.people[person({gid}).pxid],'B')/2))))"),'affection is a view of the sim feeling')
    # 3 release the recruit
    E(f"S.confirmRelease={rid};releaseFromGuild({rid})"); E("endTurn()")
    ok(E(f"person({rid}).affiliation")!='Brutus' and E(f"PXW.people[person({rid}).pxid].held")=='false','released recruit leaves the company in both')
    # 4 a real expedition with the party
    E("S.actions=2"); W=pg.frame_locator('#world')
    did=E("String(S.dungeons.filter(d=>!d.closed)[0]?.id||'')")
    if not did:
        for i in range(3): E("endTurn()")
        did=E("String(S.dungeons.filter(d=>!d.closed)[0]?.id||'')")
    party=E("JSON.stringify(S.party.map(a=>a.name))")
    print(E(f"const d=S.dungeons.find(d=>d.id=={did});gcBuy(d,'access');S.activeContract={{...d}};confirmDelve();JSON.stringify([S.pendingDelve,S.lastNotice])"))
    for i in range(60):
        pg.wait_for_timeout(500)
        if pg.locator('#where').inner_text()=='Expedition in progress': break
    ok(pg.locator('#where').inner_text()=='Expedition in progress','real dungeon opens with party '+party)
    pg.wait_for_timeout(2000)
    pg.frame_locator('#dungeon').locator('#exitBtn').click(force=True)
    for i in range(20):
        pg.wait_for_timeout(500)
        if pg.locator('#where').inner_text()=='The living world': break
    pg.wait_for_timeout(500)
    ex=E("PXW.events.filter(e=>e.kind==='expedition').map(e=>e.text).join('|')")
    ok('came back from' in ex,'expedition is news: '+ex[:120])
    # 5 stake through the profile button
    sid=E("String(S.agents.find(a=>a.alive&&a.affiliation&&a.affiliation!=='Brutus'&&PX.brutusStakeCost(PXW.people[a.pxid])<S.gold).id)")
    g0=int(float(E("S.gold"))); E(f"selected={sid};screen='profile';render()")
    W.locator('[data-action="pxback"]').click(); pg.wait_for_timeout(300)
    ok(int(float(E("S.gold")))<g0 and E("PXW.stakes.filter(s=>s.by==='B').length")=='1','stake bought from profile, gold spent in game')
    for i in range(10): E("endTurn()")
    ok(E("PXW.stakes.find(s=>s.by==='B').left")=='16','stake ticks with turns')
    # 6 consistency
    ok(E("S.agents.filter(a=>a.alive&&a.pxid!=null&&!PXW.people[a.pxid].alive).length")=='0','no one alive in game but dead in sim')
    ok(E("S.agents.filter(a=>!a.alive&&a.pxid!=null&&PXW.people[a.pxid].alive).length")=='0','no one dead in game but alive in sim')
    ok(E("S.agents.filter(a=>a.alive&&a.pxid!=null).filter(a=>{const p=PXW.people[a.pxid];const g=p.guild==null?null:PXW.guilds[p.guild].name;return !p.held&&a.affiliation!==g}).length")=='0','guild membership agrees')
    ok(E("Object.keys(S.guilds).length===PX.live(PXW).length")=='true','same guilds standing')
    # 7 reload keeps the region
    wk=E("PXW.week"); ev=E("PXW.events.length"); E("saveLiving()")
    pg.reload(); pg.wait_for_timeout(3500)
    ok(E("PXW.week")==wk and E("PXW.events.length")==ev,'reload keeps the region ('+wk+')')
    E("endTurn()"); ok(E("PXW.week")==str(int(wk)+1),'and it keeps going')
    print('size MB',E("(localStorage.getItem('brutus-px-world-v1').length/1e6).toFixed(2)"), E("(localStorage.getItem('brutus-living-v1').length/1e6).toFixed(2)"))
    # 8 new run rebuilds
    E("newRun()"); ok(E("PXW.week===S.turn && PX.alive(PXW).length>200")=='true','new run builds a new region')
    # soak
    t = time.time()
    for i in range(SOAK): E("endTurn()")
    print('soak: %d turns, %.2f s/turn' % (SOAK, (time.time() - t) / max(1, SOAK)))
    print('region:', E("PX.alive(PXW).length+' people, '+PX.live(PXW).length+' guilds, '+Math.round(PXW.series.strained.slice(-1)[0]*100)+'% scraping by'"))
    print('totals:', E("JSON.stringify(PXW.M)"))
    ok(E("S.agents.filter(a=>a.alive&&a.pxid!=null&&!PXW.people[a.pxid].alive).length")=='0','after the soak: still one population')
    ok(int(E("PX.alive(PXW).length")) > 150, 'after the soak: the region is still populated')
    print('save MB:', E("(localStorage.getItem('brutus-px-world-v1')||'').length/1e6"))
    b.close()
print('page errors:', len(errs)); [print('  ', e[:200]) for e in errs[:5]]
sys.exit(1 if fails or errs else 0)
