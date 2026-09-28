/* More person-to-person events. Robert, 2026-09-28 picks:
 *   mentor · abandoned with the haul · duel of pride · jealousy · reconciliation
 * Runs before events.js each visit (reconciliation needs the hurt flag
 * before a rescue clears it). Everything fires from sim state.
 * Mentor/mentee is kin-weight in ripple.js: a mentor takes a student's
 * death like family.
 */
(function (root) {
  'use strict';
  var RP = typeof require === 'function' ? require('./ripple.js') : root.OW_RIPPLE;
  var BOND = ['old-ties', 'friends', 'lovers'];

  function has(p, t) { return p.traits.indexOf(t) !== -1; }
  function rows(s, a, b, tags) { return s.ledger.rows.some(function (r) { return r.from === a.id && r.to === b.id && tags.indexOf(r.tag) !== -1; }); }
  function warmth(s, a, b) { return s.ledger.feeling(a.id, b.id).warmth; }
  function drop(s, a, b, pred) {
    s.ledger.rows = s.ledger.rows.filter(function (r) {
      var pair = (r.from === a.id && r.to === b.id) || (r.from === b.id && r.to === a.id);
      return !(pair && pred(r));
    });
  }
  function headline(s, p, kind, text) {
    s.news.push({ visit: s.visit, id: p ? p.id : null, named: p ? !!p.sheet : false, kind: kind, text: text });
    s.events = s.events || {}; s.events[kind] = (s.events[kind] || 0) + 1;
  }

  function run(s) {
    var r = s.rand;
    var all = Object.keys(s.roster).map(function (k) { return s.roster[k]; }).filter(function (p) { return p.alive; });
    var once = {};
    function free(p) { return !once[p.id]; }
    function mark() { for (var i = 0; i < arguments.length; i++) once[arguments[i].id] = true; }

    // mentors teach: a steady fame boost, and after long enough the student steps up a tier
    all.forEach(function (st) {
      var m = st.m; if (!m.mentor) return;
      var mentor = s.roster[m.mentor];
      if (!mentor || !mentor.alive) { m.mentor = null; return; }
      m.fame = Math.min(100, m.fame + 1);
      if (s.visit - m.mentorSince >= 4 && st.tier < mentor.tier - 1 && !m.graduated && r() < 0.3) {
        st.tier += 1; m.graduated = true;
        headline(s, st, 'mentor', st.name + ' has outgrown the easy floors. ' + mentor.name + ' taught them well');
      }
    });

    for (var i = 0; i < all.length; i++) for (var j = i + 1; j < all.length; j++) {
      var a = all[i], b = all[j];
      if (!free(a) || !free(b)) continue;
      var sameFloor = a.m.lastDepth && a.m.lastDepth === b.m.lastDepth;
      var close = rows(s, a, b, BOND) || (a.m.guild && a.m.guild === b.m.guild);

      // reconciliation: enemies stuck on the same bad floor, one saves the other
      if (sameFloor && (a.m.hurt !== b.m.hurt) && warmth(s, a, b) <= -2 && warmth(s, b, a) <= -2 && r() < 0.4) {
        var saver = a.m.hurt ? b : a, saved = saver === a ? b : a;
        drop(s, a, b, function (row) { return row.warmth < 0; });
        s.ledger.write(a.id, b.id, 'friends', 1, 2, null); s.ledger.write(b.id, a.id, 'friends', 1, 2, null);
        saved.m.hurt = false;
        headline(s, saver, 'reconcile', saver.name + ' hated ' + saved.name + ', and carried them off floor ' + saver.m.lastDepth + ' anyway. They are square now');
        mark(a, b); continue;
      }
      // abandoned with the haul: a greedy partner runs off with both cuts
      if (sameFloor && close && (a.m.hauled >= 50 || b.m.hauled >= 50)) {
        var thief = has(a, 'greedy') && a.m.hauled ? a : (has(b, 'greedy') && b.m.hauled ? b : null);
        if (thief && r() < 0.15) {
          var mark2 = thief === a ? b : a, take = Math.min(mark2.m.fortune, mark2.m.hauled || 20);
          mark2.m.fortune -= take; thief.m.fortune += take;
          drop(s, a, b, function (row) { return row.tag === 'friends'; });
          s.ledger.write(mark2.id, thief.id, 'ran-off-with-it', 0, -5, null);
          RP.spread(s, mark2, thief.id, 'ran-off-with-it', 0, -5, null);
          headline(s, mark2, 'abandoned', thief.name + ' ran off with ' + mark2.name + "'s cut from floor " + mark2.m.lastDepth);
          mark(a, b); continue;
        }
      }
      // duel of pride: two proud people who can't stand each other (or can't share a floor) settle it in public
      if (has(a, 'proud') && has(b, 'proud') && (warmth(s, a, b) <= -2 || warmth(s, b, a) <= -2 || (sameFloor && Math.abs(a.m.fame - b.m.fame) <= 15)) && r() < 0.15) {
        var sa = a.tier * 10 + a.m.fame * 0.3 + r() * 20, sb = b.tier * 10 + b.m.fame * 0.3 + r() * 20;
        var win = sa >= sb ? a : b, lose = win === a ? b : a;
        win.m.fame = Math.min(100, win.m.fame + 4); lose.m.fame = Math.max(0, lose.m.fame - 8);
        s.ledger.write(lose.id, win.id, 'rival', 1, -3, null);
        headline(s, lose, 'duel', win.name + ' beats ' + lose.name + ' in front of half the town. ' + lose.name + ' will not forget it');
        mark(a, b); continue;
      }
      // mentor: a strong, generous veteran takes a beginner under their wing
      if (close && !a.m.mentor && !b.m.mentor && !a.m.mentee && !b.m.mentee) {
        var vet = a.tier >= 4 ? a : (b.tier >= 4 ? b : null), kid = vet === a ? b : a;
        if (vet && kid.tier <= 2 && !has(vet, 'proud') && (has(vet, 'kind') || has(vet, 'pragmatic')) && r() < 0.1) {
          kid.m.mentor = vet.id; kid.m.mentorSince = s.visit; vet.m.mentee = kid.id;
          s.ledger.write(kid.id, vet.id, 'mentor', 2, 2, null); s.ledger.write(vet.id, kid.id, 'mentee', 1, 2, null);
          headline(s, kid, 'mentor', vet.name + ' takes ' + kid.name + ' under their wing');
          mark(a, b); continue;
        }
      }
    }

    // jealousy: a lover gets close to someone new
    all.forEach(function (a) {
      if (!free(a)) return;
      s.ledger.rows.filter(function (r0) { return r0.from === a.id && r0.tag === 'lovers' && s.roster[r0.to]; }).forEach(function (r0) {
        var b = s.roster[r0.to]; if (!free(b) || !free(a)) return;
        var rival = s.ledger.rows.filter(function (x) { return x.from === b.id && x.tag === 'friends' && x.to !== a.id && s.roster[x.to]; })[0];
        if (!rival || r() >= 0.04) return;
        var c = s.roster[rival.to];
        if (r() < 0.5) headline(s, a, 'jealousy', a.name + " doesn't like how much time " + b.name + ' spends with ' + c.name + '. It blows over');
        else {
          drop(s, a, b, function (row) { return row.tag === 'lovers'; });
          s.ledger.write(a.id, c.id, 'grudge', 0, -3, null);
          headline(s, a, 'jealousy', a.name + ' and ' + b.name + ' split over ' + c.name + '. Everyone saw it coming');
        }
        mark(a, b);
      });
    });
  }

  var API = { run: run };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_PEOPLE = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
