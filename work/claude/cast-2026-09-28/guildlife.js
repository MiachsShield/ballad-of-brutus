/* Guild-to-guild and guild-to-person events. Robert, 2026-09-28 picks:
 *   guild-guild : turf war · joint expedition · broken alliance · truce ·
 *                 merger · debt between guilds · blacklist
 *   guild-person: patronage · bounty · protection racket · expulsion · promotion
 * Alliances and feuds are live state now (they start from market.js GUILDS
 * and change here); every change stays mutual.
 * Guild "money" is renown — guilds don't carry coin in this sim.
 */
(function (root) {
  'use strict';
  var RP = typeof require === 'function' ? require('./ripple.js') : root.OW_RIPPLE;

  function list(s) { return Object.keys(s.guilds).map(function (k) { return s.guilds[k]; }).filter(function (g) { return g.alive; }); }
  function people(s) { return Object.keys(s.roster).map(function (k) { return s.roster[k]; }).filter(function (p) { return p.alive; }); }
  function inGuild(s, gid) { return people(s).filter(function (p) { return p.m.guild === gid; }); }
  function has(p, t) { return p.traits.indexOf(t) !== -1; }
  function rm(arr, x) { var i = arr.indexOf(x); if (i !== -1) arr.splice(i, 1); }
  function setRel(a, b, rel) {                           // 'ally' | 'feud' | null — always mutual
    rm(a.allies, b.id); rm(b.allies, a.id); rm(a.feuds, b.id); rm(b.feuds, a.id);
    if (rel === 'ally') { a.allies.push(b.id); b.allies.push(a.id); }
    if (rel === 'feud') { a.feuds.push(b.id); b.feuds.push(a.id); }
  }
  function key(a, b) { return [a.id, b.id].sort().join('|'); }
  function headline(s, p, kind, text) {
    s.news.push({ visit: s.visit, id: p ? p.id : null, named: p ? !!p.sheet : false, kind: kind, text: text });
    s.events = s.events || {}; s.events[kind] = (s.events[kind] || 0) + 1;
  }
  function clamp(x) { return Math.max(0, Math.min(100, x)); }

  function run(s, cap) {
    var r = s.rand, G = s.guilds, gs = list(s);
    s.allyStrain = s.allyStrain || {}; s.guildDebts = s.guildDebts || []; s.bounties = s.bounties || {};

    // ---- who moved this visit (poach, walkout, homesick...) — defections feed alliances & blacklists
    people(s).forEach(function (p) {
      var m = p.m; m.history = m.history || [];
      if (m.guild && m.history.indexOf(m.guild) === -1) m.history.push(m.guild);
      var from = m.prevGuild && G[m.prevGuild], to = m.guild && G[m.guild];
      if (!from || !to || from === to || !from.alive || !to.alive) return;
      if (from.allies.indexOf(to.id) !== -1) {                                        // an ally took one of ours
        var k = key(from, to); s.allyStrain[k] = (s.allyStrain[k] || 0) + 1;
        if (s.allyStrain[k] >= 2 || r() < 0.3) {
          setRel(from, to, 'feud'); delete s.allyStrain[k];
          headline(s, p, 'alliance-broken', from.name + ' breaks with ' + to.name + ' over ' + p.name + '. Old friends, new enemies');
        }
      } else if (from.feuds.indexOf(to.id) !== -1 && !from.blacklist.includes(to.id) && r() < 0.3) {
        from.blacklist.push(to.id);
        headline(s, p, 'blacklist', from.name + ' will no longer take anyone who has worn ' + to.name + "'s colors");
      }
      if (m.expelledFrom === from.id) m.expelledFrom = null;
      if (m.expelledFrom && to.feuds.indexOf(m.expelledFrom) !== -1 && !m.secretsSold) {  // exile sells secrets
        m.secretsSold = true; to.renown = clamp(to.renown + 3); G[m.expelledFrom].renown = clamp(G[m.expelledFrom].renown - 3);
        headline(s, p, 'exile-secrets', p.name + ' brings everything they know about ' + G[m.expelledFrom].name + ' to ' + to.name);
      }
    });

    // ---- guild to guild
    for (var i = 0; i < gs.length; i++) for (var j = i + 1; j < gs.length; j++) {
      var a = gs[i], b = gs[j], k = key(a, b);
      var feud = a.feuds.indexOf(b.id) !== -1, ally = a.allies.indexOf(b.id) !== -1;
      if (feud) {
        var da = inGuild(s, a.id).map(function (p) { return p.m.lastDepth; }), db = inGuild(s, b.id).map(function (p) { return p.m.lastDepth; });
        var clash = da.some(function (d) { return d && db.indexOf(d) !== -1; });
        if (clash && r() < 0.3) {                                                      // turf war
          a.renown = clamp(a.renown - 3); b.renown = clamp(b.renown - 3); a.bleed = (a.bleed || 0) + 1; b.bleed = (b.bleed || 0) + 1;
          var big = a.renown > b.renown + 15 ? a : (b.renown > a.renown + 15 ? b : null);
          headline(s, null, 'turf', a.name + ' and ' + b.name + ' fight over the same floor' + (big ? '. ' + (big === a ? b : a).name + ' backs down' : '. Nobody wins'));
          continue;
        }
        if ((a.bleed || 0) >= 2 && (b.bleed || 0) >= 2 && r() < 0.25) {             // truce
          setRel(a, b, null); a.bleed = 0; b.bleed = 0;
          headline(s, null, 'truce', a.name + ' and ' + b.name + ' call a truce. Nobody expects it to last');
          continue;
        }
      }
      if (ally && r() < 0.05) {                                                       // joint expedition
        var crew = inGuild(s, a.id).concat(inGuild(s, b.id));
        if (!crew.length) continue;
        if (r() < 0.75) {
          a.renown = clamp(a.renown + 4); b.renown = clamp(b.renown + 4);
          crew.forEach(function (p) { p.m.fortune += 10; });
          headline(s, null, 'joint', a.name + ' and ' + b.name + ' clear a floor together and split the spoils');
        } else {
          a.renown = clamp(a.renown - 3); b.renown = clamp(b.renown - 3);
          s.allyStrain[k] = (s.allyStrain[k] || 0) + 1;
          headline(s, null, 'joint', 'A joint run by ' + a.name + ' and ' + b.name + ' goes wrong. Each blames the other');
          if (s.allyStrain[k] >= 2) { setRel(a, b, 'feud'); delete s.allyStrain[k]; headline(s, null, 'alliance-broken', a.name + ' and ' + b.name + ' are finished as allies'); }
        }
      }
    }

    // merger: a guild about to collapse is absorbed by a strong ally
    gs.forEach(function (g) {
      if (!g.alive || g.renown >= 15) return;
      var host = g.allies.map(function (id) { return G[id]; }).filter(function (h) { return h && h.alive && h.renown >= 30; })[0];
      if (!host || r() >= 0.35) return;
      inGuild(s, g.id).forEach(function (p) { p.m.guild = host.id; p.m.heldSince = null; });
      host.cap = (host.cap || 2) + 2; host.charters = (host.charters || [host.region]).concat(g.charters || [g.region]);
      host.renown = clamp(host.renown + Math.round(g.renown / 2));
      g.alive = false; g.mergedInto = host.id;
      gs.forEach(function (o) { if (o !== g) { rm(o.allies, g.id); rm(o.feuds, g.id); } });
      headline(s, null, 'merger', g.name + ' folds into ' + host.name + '. ' + host.name + ' now holds ' + (host.charters.join(' and ')));
    });

    // debt between guilds: the gold-poachers lend renown, then call it in
    gs.filter(function (g) { return g.poaches === 'gold' && g.alive; }).forEach(function (lender) {
      var borrower = gs.filter(function (g) { return g.alive && g !== lender && g.renown < 30 && lender.feuds.indexOf(g.id) === -1 &&
        !s.guildDebts.some(function (d) { return d.to === g.id; }); })[0];
      if (borrower && r() < 0.08) {
        borrower.renown = clamp(borrower.renown + 8);
        s.guildDebts.push({ from: lender.id, to: borrower.id, due: s.visit + 3 });
        headline(s, null, 'guild-debt', lender.name + ' bails out ' + borrower.name + '. It is not a gift');
      }
    });
    s.guildDebts = s.guildDebts.filter(function (d) {
      if (s.visit < d.due) return true;
      var L = G[d.from], B = G[d.to];
      if (!L || !B || !L.alive || !B.alive) return false;
      if (B.renown >= 25) { B.renown = clamp(B.renown - 10); headline(s, null, 'guild-debt', B.name + ' pays ' + L.name + ' back in full'); return false; }
      var star = inGuild(s, B.id).sort(function (x, y) { return y.m.fame - x.m.fame; })[0];
      if (star && cap(L.id)) {
        star.m.guild = L.id; star.m.heldSince = null;
        headline(s, star, 'guild-debt', B.name + " can't pay " + L.name + ". " + star.name + ' is handed over to settle it');
      } else { setRel(L, B, 'feud'); headline(s, null, 'guild-debt', B.name + ' defaults on ' + L.name + '. That will be remembered'); }
      return false;
    });

    // ---- guild to person
    var ppl = people(s);
    gs.forEach(function (g) {
      if (!g.alive) return;
      // patronage: fund a promising free agent for first refusal
      var prospect = ppl.filter(function (p) { return !p.m.guild && !p.m.patron && p.m.fame >= 20 && p.tier >= 2 &&
        !(p.m.history || []).some(function (h) { return g.blacklist.indexOf(h) !== -1; }); })
        .sort(function (x, y) { return y.m.fame - x.m.fame; })[0];
      if (prospect && cap(g.id) && r() < 0.04) {
        prospect.m.patron = g.id; prospect.m.patronSince = s.visit;
        headline(s, prospect, 'patronage', g.name + " starts paying for " + prospect.name + "'s runs. First refusal, of course");
      }
      // protection racket: evil guilds lean on free agents
      if (g.leaning === 'evil' && r() < 0.07) {
        var marks = ppl.filter(function (p) { return !p.m.guild && !p.m.patron; }), mark = marks[Math.floor(r() * marks.length)];
        if (mark && !mark.m.guild) {
          if (mark.m.fortune >= 15) { mark.m.fortune -= 15; g.renown = clamp(g.renown + 1); headline(s, mark, 'racket', mark.name + ' pays ' + g.name + ' to be left alone'); }
          else {
            mark.m.hurt = true; mark.m.fortune = 0;
            s.ledger.write(mark.id, 'guild:' + g.id, 'shook-me-down', 0, -3, null);
            RP.spread(s, mark, 'guild:' + g.id, 'shook-me-down', 0, -3, null);
            headline(s, mark, 'racket', mark.name + " couldn't pay " + g.name + '. They had an accident');
          }
        }
      }
      // expulsion: good and in-between guilds throw out a misfit who won't settle
      if (g.leaning !== 'evil') {
        var bad = inGuild(s, g.id).filter(function (p) { return (p.m.strain || 0) >= 2; })[0];
        if (bad && r() < 0.3) {
          bad.m.guild = null; bad.m.expelledFrom = g.id; bad.m.freeFor = 0; bad.m.heldSince = null; bad.m.strain = 0;
          s.ledger.write(bad.id, 'guild:' + g.id, 'threw-me-out', 0, -3, null);
          headline(s, bad, 'expelled', g.name + ' throws ' + bad.name + ' out in front of everyone');
        }
      }
      // promotion: a proven star who fits becomes an officer
      inGuild(s, g.id).forEach(function (p) {
        var m = p.m;
        if (!m.officer && !g.promotedAt && m.fame >= 75 && (m.fit || 0) >= 0.3 && m.cliqueSince != null && s.visit - m.cliqueSince >= 3 && r() < 0.15) {
          g.promotedAt = s.visit;                                         // one new officer per guild per season
          m.officer = g.id;
          headline(s, p, 'promotion', p.name + ' is made an officer of ' + g.name);
        }
        if (m.officer && m.officer !== m.guild) m.officer = null;
      });
    });
    ppl.forEach(function (p) {                                          // patronage lapses
      if (p.m.patron && (p.m.guild || s.visit - p.m.patronSince > 4 || !G[p.m.patron].alive)) p.m.patron = null;
      else if (p.m.patron) p.m.fortune += 5;
    });

    // bounties: rats who got caught and stars poached from evil guilds
    s.news.filter(function (n) { return n.visit === s.visit && n.id && (n.kind === 'rat' || n.kind === 'poached'); }).forEach(function (n) {
      var p = s.roster[n.id]; if (!p || !p.alive) return;
      var victim = G[p.m.prevGuild];
      if (!victim || !victim.alive || victim.leaning !== 'evil' || s.bounties[p.id]) return;
      if (n.kind === 'poached' && p.m.guild === victim.id) return;
      s.bounties[p.id] = { by: victim.id, until: s.visit + 5 };
      headline(s, p, 'bounty', victim.name + ' puts a price on ' + p.name + "'s head");
    });
    Object.keys(s.bounties).forEach(function (pid) {
      var b = s.bounties[pid], t = s.roster[pid];
      if (!t || !t.alive || s.visit > b.until) { delete s.bounties[pid]; return; }
      var hunter = people(s).filter(function (h) { return h !== t && h.m.guild !== t.m.guild && (has(h, 'greedy') || (G[h.m.guild] && G[h.m.guild].leaning === 'evil')) &&
        h.tier >= t.tier - 1 && RP.circle(s, t).every(function (c) { return c.who !== h; }); })[0];
      if (!hunter || r() >= 0.25) return;
      delete s.bounties[pid]; hunter.m.fortune += 30;
      s.ledger.write(t.id, hunter.id, 'hunted-me', 0, -5, null); RP.spread(s, t, hunter.id, 'hunted-me', 0, -5, null);
      RP.spread(s, t, 'guild:' + b.by, 'put-a-price-on', 0, -4, null);
      if (!t.m.guild && hunter.tier > t.tier) {
        t.alive = false; t.causeOfDeath = 'bounty (' + G[b.by].name + ')';
        headline(s, t, 'died', hunter.name + ' collects ' + G[b.by].name + "'s bounty on " + t.name + '. ' + t.name + ' is dead');
      } else {
        t.m.hurt = true; t.m.fame = Math.max(0, t.m.fame - 5);
        headline(s, t, 'bounty', hunter.name + ' catches ' + t.name + ' for ' + G[b.by].name + "'s bounty. They live, barely");
      }
    });
  }

  function blocked(s, p, g) {            // blacklist check for joining
    return (p.m.history || []).some(function (h) { return h !== g.id && g.blacklist.indexOf(h) !== -1; });
  }

  var API = { run: run, blocked: blocked, setRel: setRel };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_GUILDLIFE = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
