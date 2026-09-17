import json, collections
import os, re
HERE=os.path.dirname(os.path.abspath(__file__))
BUILD=os.path.join(HERE,'..','..','..','builds','brutus-1_0_a0mk-kavi-fixed.html')
_src=open(BUILD,encoding='utf-8').read()
live={r['id']:r for r in json.loads(re.search(r'const APPROVED_CARDS=(\[.*?\]);\n',_src,flags=re.S).group(1))}

# ---- per-card decisions: copies (0 = pool only), category, frames, exposure, signature, changes ----
# category: offense | defense | heal | buff | debuff | finisher
P='priest_'; W='warrior_'
D = {
 # PRIEST ------------------------------------------------------------
 P+'quick_strike':      dict(copies=3, cat='offense'),
 P+'surge':             dict(copies=2, cat='offense'),
 P+'rigor':             dict(copies=2, cat='offense', frames=(180,260)),
 P+'cleave':            dict(copies=2, cat='offense'),
 P+'smite_priest':      dict(copies=3, cat='offense', frames=(380,560)),
 P+'blazewhirl':        dict(copies=2, cat='offense', frames=(420,620), exp=1.4),
 P+'heavy_blow':        dict(copies=1, cat='offense'),
 P+'radiant_cleave':    dict(copies=0, cat='offense'),
 P+'excommunication':   dict(copies=1, cat='finisher', sig=True, frames=(1000,1150), exp=1.8,
                             set=dict(cost=10, dmg=26, effect="Deal 26 damage (36 to Demon or Undead). The target is Deafened (-2 attack) for 2 turns."),
                             why="Was cost 8 / 16 dmg with a no-heal rider that does nothing (no enemy heals). Priest had no real finisher; this is it."),
 P+'bulwark_slam':      dict(copies=1, cat='defense', sig=True, frames=(900,800), exp=1.5,
                             set=dict(effect="Resolute: the windup shrugs off 2 hits. Deal 30 damage and gain 10 Guard.", resolute=True, armorHits=2),
                             why="Required 4+ living allies; dives carry 2, so it could never be played. Now the Priest copy of Brutus's own Bulwark Slam."),
 P+'candle_prayer':     dict(copies=3, cat='heal', frames=(150,230)),
 P+'weak_cure':         dict(copies=2, cat='heal', frames=(150,220),
                             set=dict(effect="Heal 6. Mercy Strike."),
                             why="Was out-of-combat only: 4 dead copies in a combat deck. Now playable in combat, and turns into damage when nobody needs healing."),
 P+'mending_light':     dict(copies=2, cat='heal', frames=(260,320), set=dict(effect="Heal an ally for 10. Mercy Strike.")),
 P+'field_mending':     dict(copies=1, cat='heal', frames=(220,300), set=dict(effect="Heal all allies for 4. Mercy Strike (hits every enemy in the room).")),
 P+'second_breath':     dict(copies=0, cat='heal', set=dict(effect="Heal 8. If you are below 25% HP, Heal 14 instead. Mercy Strike.")),
 P+'last_rite':         dict(copies=1, cat='heal', sig=True, frames=(200,350)),
 P+'absolution':        dict(copies=0, cat='heal', set=dict(cost=5, effect="Remove all debuffs from allies and Heal all allies 8. Mercy Strike."), why="Cost 6 for cleanse + 6 was the worst rate in the pool."),
 P+'consecrated_ground':dict(copies=0, cat='heal'),
 P+'warding_word':      dict(copies=2, cat='defense'),
 P+'warding_chant':     dict(copies=1, cat='defense', set=dict(effect="All allies gain +4 Guard."),
                             why="'Repeatable' meant it never left the hand: 3 Guard to everyone every ~0.3s. Removed; +1 Guard to compensate."),
 P+'vanish_step':       dict(copies=1, cat='defense'),
 P+'anthem_of_the_unbroken': dict(copies=1, cat='defense', sig=True, frames=(800,900), exp=1.6,
                             set=dict(effect="For 2 turns, any ally who would fall stays at 1 HP instead. All allies gain +6 Guard."),
                             why="Revived a fallen ally — contradicts Robert's 2026-09-15 ruling (0 HP is dead, no revive path) and Kavi's K6. Same fantasy, delivered before the fall."),
 P+'rite_of_the_held_wound': dict(copies=0, cat='defense'),
 P+'choir_of_iron':     dict(copies=0, cat='defense', frames=(700,900)),
 P+'sanctuary_step':    dict(copies=0, cat='defense', note="Needs a floor click mid-fight; stays out of the default deck until placement works from the keyboard."),
 P+'blessing':          dict(copies=2, cat='buff'),
 P+'benediction':       dict(copies=1, cat='buff', frames=(250,300)),
 P+'steady_hands':      dict(copies=0, cat='buff'),
 P+'sacrament_of_nerve':dict(copies=0, cat='buff'),
 P+'alms_taker_s_ear':  dict(copies=0, cat='buff'),
 P+'hymn_of_vigor':     dict(copies=0, cat='buff', set=dict(cost=2, energy=8, effect="You gain 8 energy. Companions gain 20 energy."),
                             why="+3 energy is 0.3s of regen for Brutus and 3% of a companion's bar. Scaled to each bar."),
 P+'dust_in_the_eyes':  dict(copies=2, cat='debuff'),
 P+'radiant_glare':     dict(copies=1, cat='debuff', frames=(420,600), exp=1.4),
 P+'sun_blind':         dict(copies=1, cat='debuff', frames=(700,900), exp=1.6,
                             set=dict(tier='Heavy', cost=7),
                             why="Blinding the whole room for 8s at cost 5 made Radiant Glare pointless. Priced as the premium blind."),
 P+'binding_psalm':     dict(copies=1, cat='debuff'),
 P+'paralytic_rite':    dict(copies=1, cat='debuff', frames=(300,400)),
 P+'confessor_s_leverage': dict(copies=0, cat='debuff'),
 P+'vow_of_silence':    dict(copies=0, cat='debuff', note="No enemy in the dungeon is a caster yet, so it can never find a target."),
 # WARRIOR -----------------------------------------------------------
 W+'reckless_charge':   dict(copies=3, cat='offense', frames=(200,280)),
 W+'shoulder_check':    dict(copies=2, cat='offense'),
 W+'guard_break':       dict(copies=2, cat='offense',
                             set=dict(effect="Deal 6 damage. Destroy 8 Guard, and break an active Resolute brace."),
                             why="Enemies never have Guard, so the rider did nothing. Brutes BRACE — this is now the Warrior's cheap answer to it."),
 W+'crushing_helm':     dict(copies=2, cat='offense'),
 W+'sprinting_cut':     dict(copies=1, cat='offense',
                             set=dict(effect="Deal 8 damage. +4 damage if Brutus had to lunge to reach the target."),
                             why="'May be played after moving' is always true in real time. Rewarded the lunge instead."),
 W+'riposte_cut':       dict(copies=2, cat='offense'),
 W+'executioner_s_tempo': dict(copies=2, cat='offense'),
 W+'ground_slam':       dict(copies=2, cat='offense', frames=(420,620), exp=1.4),
 W+'breaker_chain':     dict(copies=1, cat='offense', frames=(400,600)),
 W+'throw_the_axe':     dict(copies=2, cat='offense', frames=(400,500)),
 W+'skullcracker':      dict(copies=2, cat='offense'),
 W+'great_cleave':      dict(copies=1, cat='offense', frames=(700,950)),
 W+'last_man':          dict(copies=1, cat='offense'),
 W+'killing_shout':     dict(copies=1, cat='offense', frames=(750,950)),
 W+'umbral_reaper':     dict(copies=1, cat='finisher', sig=True, frames=(1000,1150), exp=1.8,
                             set=dict(cost=12, dmg=32),
                             why="24 for 10 was barely above Killing Shout (22 for 9). The signature should be recognisably the biggest swing in the deck."),
 W+'line_breaker':      dict(copies=0, cat='offense'),
 W+'dual_hew':          dict(copies=0, cat='offense'),
 W+'shield_tear':       dict(copies=0, cat='offense', note="Reduces enemy Guard generation; enemies don't generate Guard yet."),
 W+'pommel_tap':        dict(copies=2, cat='debuff'),
 W+'kick_the_knee':     dict(copies=1, cat='debuff'),
 W+'sweeping_leg':      dict(copies=1, cat='debuff'),
 W+'feint_high':        dict(copies=1, cat='debuff'),
 W+'venom_strike':      dict(copies=1, cat='debuff'),
 W+'thunderclap':       dict(copies=1, cat='debuff', frames=(450,650), exp=1.4),
 W+'frostbite_slash':   dict(copies=0, cat='debuff'),
 W+'toxic_cloud':       dict(copies=0, cat='debuff'),
 W+'iron_jaw':          dict(copies=2, cat='defense'),
 W+'no_retreat':        dict(copies=1, cat='defense'),
 W+'rime_shell':        dict(copies=1, cat='defense'),
 W+'challenge':         dict(copies=1, cat='defense'),
 W+'war_cry':           dict(copies=1, cat='buff'),
 W+'battle_breath':     dict(copies=1, cat='buff'),
 W+'rally_banner':      dict(copies=1, cat='buff'),
 W+'frenzy_step':       dict(copies=0, cat='buff'),
 W+'warlord_s_due':     dict(copies=0, cat='buff'),
}
MERCY = {P+'weak_cure',P+'mending_light',P+'field_mending',P+'second_breath',P+'absolution'}
TIER_FR = {'Light':(150,250),'Medium':(350,550),'Heavy':(650,900),'Support':(100,180)}
TIER_EXP= {'Light':1.2,'Medium':1.3,'Heavy':1.6,'Support':1.1}

missing=set(live)-set(D); extra=set(D)-set(live)
assert not missing and not extra, (missing, extra)
out=[]; changes=[]
for rid,row in live.items():
    d=D[rid]; new=dict(row)
    for k,v in d.get('set',{}).items(): new[k]=v
    new['deck_copies']=d['copies']
    new['category']=d['cat']
    new['signature']=bool(d.get('sig'))
    fr=d.get('frames') or TIER_FR[new['tier']]
    new['startup'],new['recovery']=fr
    new['exposure']=d.get('exp') or TIER_EXP[new['tier']]
    if rid in MERCY: new['mercyStrike']=True
    if d.get('note'): new['note']=d['note']
    out.append(new)
    diff={k:(row.get(k),new.get(k)) for k in ('tier','cost','dmg','energy','effect') if row.get(k)!=new.get(k)}
    if diff: changes.append((new['class'],new['name'],diff,d.get('why','')))
# ---- checks ----
for cls in ('Priest','Warrior'):
    rows=[r for r in out if r['class']==cls]
    tot=sum(r['deck_copies'] for r in rows)
    assert tot==40,(cls,tot); assert max(r['deck_copies'] for r in rows)<=3
    comp=collections.Counter(); 
    for r in rows: comp[r['category']]+=r['deck_copies']
    sigs=[r['name'] for r in rows if r['signature']]
    assert all(r['deck_copies']==1 for r in rows if r['signature'])
    print(cls,'deck',tot,'unique in deck',sum(1 for r in rows if r['deck_copies']),'pool-only',sum(1 for r in rows if not r['deck_copies']),dict(comp),'signatures',sigs)
    dmgcards=sum(r['deck_copies'] for r in rows if r['dmg']>0 or r.get('mercyStrike'))
    print('  cards that can deal damage (incl. Mercy Strike):',dmgcards)
json.dump(out,open(os.path.join(HERE,'approved-cards-balanced.json'),'w'),indent=1,ensure_ascii=False)
print(len(changes),'rows changed')
