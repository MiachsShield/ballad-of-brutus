/* Card faces (Muse playtest 2026-10-12, Robert rolled into the dungeon batch 2026-10-13):
   the portrait-card rule `#handRow .card .face` set `display:block !important`, which beat the
   inline display:none the build uses to hide a face that has no art, so missing faces showed as
   broken-image icons. Drop !important from `display` only; the sizing rules keep theirs. */
(function(){for(const sh of document.styleSheets){let rules;try{rules=sh.cssRules;}catch(e){continue;}
 for(const r of rules){if(r.selectorText==='#handRow .card .face'&&r.style.getPropertyPriority('display')==='important'){
  r.style.setProperty('display',r.style.getPropertyValue('display'),'');}}}})();
