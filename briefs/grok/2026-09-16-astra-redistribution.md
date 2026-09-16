# Brief — Astra workload redistribution: art share
Date: 2026-09-16
Lane: Grok

Robert's call: the Astra implementation lane is not proceeding, so its
workload is redistributed. You take the **art** share. Kavi takes code
fixes in the build; Claude takes design specs. Astra gets nothing new.

## G1 — Priest combat faces (highest priority)
The live combat hand shows no faces — until faces are wired in, Robert's
one-second readability test cannot run in the game. Deliver faces for all
38 Priest cards in the shipped build. Exact file per card, no exceptions
on naming:

art/card-faces/priest/<id>.jpg — JPEG, aggressive crop, no baked text,
no letters or numerals. One face per file.

The 38 ids (from the shipped build):
priest_absolution, priest_alms_taker_s_ear, priest_anthem_of_the_unbroken,
priest_benediction, priest_binding_psalm, priest_blazewhirl,
priest_blessing, priest_bulwark_slam, priest_candle_prayer,
priest_choir_of_iron, priest_cleave, priest_confessor_s_leverage,
priest_consecrated_ground, priest_dust_in_the_eyes,
priest_excommunication, priest_field_mending, priest_heavy_blow,
priest_hymn_of_vigor, priest_last_rite, priest_mending_light,
priest_paralytic_rite, priest_quick_strike, priest_radiant_cleave,
priest_radiant_glare, priest_rigor, priest_rite_of_the_held_wound,
priest_sacrament_of_nerve, priest_sanctuary_step, priest_second_breath,
priest_smite_priest, priest_steady_hands, priest_sun_blind,
priest_surge, priest_vanish_step, priest_vow_of_silence,
priest_warding_chant, priest_warding_word, priest_weak_cure

Robert's bar, unchanged: the effect must read from the art alone in one
second; stronger abilities must visually read as more expensive. Kavi
wires the files into the combat hand — you don't need to touch code.

## G2 — Brutus replacement art, in this order
Locked spec is in `art/visual-guide/` (shaved buzz, stocky and brawny,
strong jaw, still young; action-comedy register).
1. Sidebar portrait (replaces the dark-haired/slim one).
2. Deploy/equipment screen (the Shortsword must not be the identity).
3. Key art.
Deliver to `work/grok/brutus-replacements/`. Do not keep drawing the
dark-haired slim Brutus.

## G3 — Bear Hug Break pass 2
Awaiting Kavi's one-second read on the pass-2 face (Robert is sending the
image). If it passes, reroll the tone lighter toward the action-comedy
register without changing the break read. PR #3 stays draft until then.

After G1–G3: the remaining 22 non-critical flagged faces (already on the
board).
