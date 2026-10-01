/* Person-to-person events. Robert, 2026-09-28: five groups in the playtest
 * (Brutus-involved events wait until Brutus is in the loop):
 *   friendship & rivalry, clique & guild drama, money & debt,
 *   romance & attachment, regions & roots.
 * Everything fires from sim state; nothing is scripted to a person.
 * Bonds live in the ledger: 'old-ties' (authored), 'friends', 'lovers'
 * count as bonds for following, fit and poaching; 'grudge' and 'owes'
 * are remembered. Siblings/twins never become lovers.
 * Authored backstory (e.g. an old-country grudge) is writing, not sim.
 */
(function (root) {
  'use strict';
  var RP = typeof require === 'function' ? require('./ripple.js') : root.OW_RIPPLE;
  var BOND = ['old-ties', 'friends', 'lovers'];
  var LONG = 400;
  // Ember and Wren are the build's existing ally cast; their relationships
  // are Robert's to write, so the sim never starts a romance for them.
  var NO_SIM_ROMANCE = ['ember', 'wren'];

  function has(p, t) { return p.traits.indexOf(t) !== -1; }
  function bonded(s, a, b, tags) {
    tags = tags || BOND;
    return s.ledger.rows.some(function (r) { return r.from === a.id && r.to === b.id && tags.indexOf(r.tag) !== -1; });
  }
  function bond(s, a, b, tag, respect, warmth) {
    s.ledger.write(a.id, b.id, tag, respect, warmth, null);
    s.ledger.write(b.id, a.id, tag, respect, warmth, null);
  }
  function unbond(s, a, b, tag) {
    s.ledger.rows = s.ledger.rows.filter(function (r) {
      return !(r.tag === tag && ((r.from === a.id && r.to === b.id) || (r.from === b.id && r.to === a.id)));
    });
  }
  function kin(a, b) {
    return !!(a.sheet && a.sheet.ties.some(function (t) { return t.with === b.id && /twin|sibling|brother|sister/.test(t.kind); }));
  }
  function norm(d) {
    var s = d.gold + d.strongGuild + d.friends, k = 100 / s;
    d.gold = Math.round(d.gold * k); d.strongGuild = Math.round(d.strongGuild * k); d.friends = 100 - d.gold - d.strongGuild;
  }
  function headline(s, p, kind, text) {
    s.news.push({ visit: s.visit, id: p ? p.id : null, named: p ? !!p.sheet : false, kind: kind, text: text });
    s.events[kind] = (s.events[kind] || 0) + 1;
  }
  function pairs(list) {
    var out = []; for (var i = 0; i < list.length; i++) for (var j = i + 1; j < list.length; j++) out.push([list[i], list[j]]); return out;
  }

  function run(s, capOf) {
    s.events = s.events || {};
    var r = s.rand, G = s.guilds;
    var all = Object.keys(s.roster).map(function (k) { return s.roster[k]; }).filter(function (p) { return p.alive; });
    var once = {};                                    // one event per person per visit keeps the news readable
    function free(p) { return !once[p.id]; }
    function mark() { for (var i = 0; i < arguments.length; i++) once[arguments[i].id] = true; }

    pairs(all).forEach(function (pr) {
      var a = pr[0], b = pr[1];
      if (!free(a) || !free(b)) return;
      var sameFloor = a.m.lastDepth && a.m.lastDepth === b.m.lastDepth;
      var sameGuild = a.m.guild && a.m.guild === b.m.guild;
      var friends = bonded(s, a, b), lovers = bonded(s, a, b, ['lovers']);

      // ---------------------------------------------- friendship & rivalry
      if (sameFloor && (a.m.hurt !== b.m.hurt) && r() < 0.3) {                         // saved my life
        var saver = a.m.hurt ? b : a, saved = a.m.hurt ? a : b;
        s.ledger.write(saved.id, saver.id, 'owes', 2, 3, null);
        RP.spread(s, saved, saver.id, 'owes', 2, 3, null);                     // save one twin, both owe you
        if (!friends) bond(s, a, b, 'friends', 1, 2);
        saved.m.hurt = false;
        headline(s, saved, 'saved', saver.name + ' drags ' + saved.name + ' off floor ' + saver.m.lastDepth + '. ' + saved.name + ' owes them now');
        return mark(a, b);
      }
      if (sameFloor && !friends && !sameGuild && r() < 0.08 &&
          (a.traits.some(function (t) { return has(b, t); }) || a.m.dom === b.m.dom)) {    // clicked instantly
        bond(s, a, b, 'friends', 1, 2);
        headline(s, a, 'clicked', a.name + ' and ' + b.name + ' shared floor ' + a.m.lastDepth + ' and came up friends');
        return mark(a, b);
      }
      if (sameFloor && a.m.hauled && b.m.hauled && !friends && r() < 0.12) {              // stole my kill
        var star = a.m.fame >= b.m.fame ? a : b, robbed = star === a ? b : a;
        robbed.m.fame = Math.max(0, robbed.m.fame - 3);
        s.ledger.write(robbed.id, star.id, 'grudge', 0, -3, LONG);
        RP.spread(s, robbed, star.id, 'grudge', 0, -3, LONG);
        headline(s, robbed, 'rivalry', robbed.name + ' says ' + star.name + ' stole the kill on floor ' + a.m.lastDepth);
        return mark(a, b);
      }
      if (friends && !lovers && a.m.dom !== b.m.dom && r() < 0.04 && !kin(a, b)) {       // grew apart
        unbond(s, a, b, 'friends');
        if (!bonded(s, a, b)) { headline(s, a, 'apart', a.name + ' and ' + b.name + " don't really talk anymore"); return mark(a, b); }
      }

      // ------------------------------------------------ romance & attachment
      if (friends && !lovers && !kin(a, b) && NO_SIM_ROMANCE.indexOf(a.id) === -1 && NO_SIM_ROMANCE.indexOf(b.id) === -1) { // sparks
        var ga = a.m.guild && G[a.m.guild], gb = b.m.guild && G[b.m.guild];
        var across = ga && gb && ga.leaning !== gb.leaning && (ga.leaning === 'evil' || gb.leaning === 'evil');
        if (r() < (across ? 0.02 : 0.04)) {                                             // across the line: harder, not barred
          bond(s, a, b, 'lovers', 1, 4);
          [a, b].forEach(function (p) { p.m.desires.friends += 10; norm(p.m.desires); });
          headline(s, a, 'sparks', a.name + ' and ' + b.name + ' are seeing each other' + (across ? '. Neither guild is happy about it' : ''));
          return mark(a, b);
        }
      }
      if (lovers && (r() < 0.04 || (a.m.guild !== b.m.guild && r() < 0.1))) {            // heartbreak
        unbond(s, a, b, 'lovers');
        [a, b].forEach(function (p) { p.m.desires.friends = Math.max(5, p.m.desires.friends - 20); p.m.desires.strongGuild += 10; p.m.desires.gold += 10; norm(p.m.desires); });
        s.ledger.write(a.id, b.id, 'grudge', 0, -2, LONG); s.ledger.write(b.id, a.id, 'grudge', 0, -2, LONG);
        headline(s, a, 'heartbreak', a.name + ' and ' + b.name + ' are done. It was not quiet');
        return mark(a, b);
      }

      // ------------------------------------------------------ money & debt
      if (friends && !a.m.loan && !b.m.loan) {                                             // loan between friends
        var rich = a.m.fortune > b.m.fortune ? a : b, poor = rich === a ? b : a;
        if (rich.m.fortune > 80 && poor.m.fortune < 10 && r() < 0.4) {
          rich.m.fortune -= 25; poor.m.fortune += 25;
          poor.m.loan = { to: rich.id, amount: 25, since: s.visit };
          s.ledger.write(poor.id, rich.id, 'lent-me', 1, 2, LONG);
          RP.spread(s, poor, rich.id, 'lent-me', 1, 2, LONG);
          headline(s, poor, 'loan', rich.name + ' lends ' + poor.name + ' 25 coins. "Pay me back when you can"');
          return mark(a, b);
        }
      }
      if (sameGuild && sameFloor && (a.m.hauled || b.m.hauled) && r() < 0.25) {         // split the haul
        var earner = a.m.hauled ? a : b, mate = earner === a ? b : a;
        if (has(earner, 'greedy')) {
          s.ledger.write(mate.id, earner.id, 'grudge', 0, -2, LONG);
          RP.spread(s, mate, earner.id, 'grudge', 0, -2, LONG);
          headline(s, mate, 'split', earner.name + ' keeps the whole haul. ' + mate.name + ' noticed');
        } else if (has(earner, 'kind')) {
          var share = Math.round(earner.m.hauled / 3); earner.m.fortune -= share; mate.m.fortune += share;
          s.ledger.write(mate.id, earner.id, 'shared-haul', 1, 2, LONG);
          RP.spread(s, mate, earner.id, 'shared-haul', 1, 2, LONG);
          headline(s, mate, 'split', earner.name + ' splits the haul with ' + mate.name + ' without being asked');
        } else return;
        return mark(a, b);
      }

      // ---------------------------------------------- clique & guild drama
      var feuding = a.m.guild && b.m.guild && G[a.m.guild].feuds.indexOf(b.m.guild) !== -1;
      if (friends && feuding && r() < 0.08) {                                              // forbidden friendship
        a.m.strain = (a.m.strain || 0) + 1; b.m.strain = (b.m.strain || 0) + 1;
        headline(s, a, 'forbidden', a.name + ' (' + G[a.m.guild].name + ') and ' + b.name + ' (' + G[b.m.guild].name + ') are caught drinking together');
        return mark(a, b);
      }
    });

    all.forEach(function (p) {
      if (!free(p) || !p.alive) return;
      var m = p.m, g = m.guild && G[m.guild];

      // debt comes due
      if (m.loan) {
        var lender = s.roster[m.loan.to];
        if (!lender) { m.loan = null; }
        else if (m.fortune > 40) {
          m.fortune -= m.loan.amount; lender.m.fortune += m.loan.amount; m.loan = null;
          s.ledger.write(lender.id, p.id, 'paid-back', 1, 1, LONG);
          headline(s, p, 'repaid', p.name + ' pays ' + lender.name + ' back'); return mark(p);
        } else if (s.visit - m.loan.since >= 4) {
          unbond(s, p, lender, 'friends');
          s.ledger.write(lender.id, p.id, 'grudge', 0, -3, LONG); m.loan = null;
          RP.spread(s, lender, p.id, 'grudge', 0, -3, LONG);
          headline(s, lender, 'debt', lender.name + ' is done waiting on ' + p.name + "'s debt"); return mark(p);
        }
      }
      if (!g) return;                                   // the rest are guild events
      var ms = all.filter(function (q) { return q !== p && q.m.guild === g.id; });

      // hazing: the new one gets tested
      if (m.cliqueSince === s.visit && ms.length && !m.hazedAt && r() < 0.3) {
        m.hazedAt = s.visit;
        if (r() < 0.5 + (m.fame - 40) / 100) { m.fitBonus = 0.1; headline(s, p, 'hazing', g.name + ' sends ' + p.name + ' down alone as a test. They come back. They are in'); }
        else { m.strain = (m.strain || 0) + 1; headline(s, p, 'hazing', g.name + ' tests ' + p.name + '. It goes badly'); }
        return mark(p);
      }
      // the defender: a well-liked kind member stands up for a misfit
      if ((m.strain || 0) >= 2) {
        var def = ms.filter(function (q) { return free(q) && has(q, 'kind') && (q.m.fit || 0) > 0.3; })[0];
        if (def && r() < 0.4) {
          m.strain = 1;
          if (r() < 0.4) def.m.strain = (def.m.strain || 0) + 1;
          headline(s, p, 'defender', def.name + ' stands up for ' + p.name + ' at ' + g.name); return mark(p, def);
        }
      }
      // the rat: an unhappy greedy or vengeful member sells the guild out
      if ((m.fit || 0) < 0 && (has(p, 'greedy') || has(p, 'vengeful')) && g.feuds.length && r() < 0.1) {
        var buyer = G[g.feuds[Math.floor(r() * g.feuds.length)]];
        if (buyer && buyer.alive) {
          buyer.renown = Math.min(100, buyer.renown + 3); g.renown = Math.max(0, g.renown - 3); m.fortune += 15;
          if (r() < 0.3) { m.strain = (m.strain || 0) + 2; headline(s, p, 'rat', p.name + ' was caught selling ' + g.name + "'s plans to " + buyer.name); }
          else headline(s, null, 'rat', buyer.name + ' knows exactly where ' + g.name + ' is delving next. Someone talked');
          return mark(p);
        }
      }
      // regions & roots
      if (m.region && m.region !== g.region && (m.fit || 0) < 0.2 && r() < 0.08) {         // homesick
        var home = Object.keys(G).map(function (k) { return G[k]; }).filter(function (h) { return h.alive && h.region === m.region; })[0];
        if (home && m.fame >= home.bar && capOf(home.id)) {
          headline(s, p, 'homesick', p.name + ' leaves ' + g.name + ' for ' + home.name + '. They missed ' + m.region);
          m.guild = home.id; m.heldSince = null; m.strain = 0; return mark(p);
        }
      }
      if (m.region === g.region && m.hauled >= 60 && !m.heroOf) {                         // hometown hero
        m.heroOf = m.region; m.fame = Math.min(100, m.fame + 3);
        headline(s, p, 'hero', m.region + ' has a new favorite: ' + p.name + ' of ' + g.name); return mark(p);
      }
    });
  }

  // After deaths are known: the chaplain's book (id 'tibby').
  function afterDeaths(s, dead) {
    var t = s.roster.tibby;
    if (!t || !t.alive) return;
    dead.forEach(function (p) {
      if (p.id === 'tibby' || !p.sheet) return;
      t.m.fortune += 15;
      headline(s, t, 'book', t.name + ' quietly pays out on ' + p.name + '. Nobody buys her a drink');
    });
  }

  var API = { run: run, afterDeaths: afterDeaths, BOND: BOND };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_EVENTS = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
