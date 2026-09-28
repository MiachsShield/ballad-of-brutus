/* Cliques — if you don't fit in. Robert, 2026-09-28: fitting in is judged
 * by the guild's clique, and not fitting in can go "up to murder".
 *
 * Fit = the guild's taste for your traits (holds/loses) + how much you
 * share with the people actually in it (traits, dominant desire) + friends
 * inside. A misfit builds STRAIN each visit; fitting in bleeds it off.
 *
 * Ladder (by strain):
 *   1 frozen out   — smaller cuts, less fame
 *   2 restless     — shaken (easier to poach in koth.js), may walk;
 *                    evil guilds rarely let a misfit go (that's the trap)
 *   3 scapegoated  — takes the blame when the guild has a bad visit
 *   4 left behind  — abandoned on a floor. Evil guilds and the Iron Oath
 *                    (it lets a member die before it breaks the oath);
 *                    good guilds never
 *   5 murdered     — evil guilds only
 * A tight clique is a fortress: high fit adds hold in koth via m.fit.
 */
(function (root) {
  'use strict';
  function has(p, t) { return p.traits.indexOf(t) !== -1; }
  function mates(s, p) {
    var out = []; for (var id in s.roster) { var q = s.roster[id]; if (q !== p && q.alive && q.m.guild === p.m.guild) out.push(q); } return out;
  }
  function friendsIn(s, p) {
    return s.ledger.rows.some(function (r) {
      return r.from === p.id && r.tag === 'old-ties' && s.roster[r.to] && s.roster[r.to].m.guild === p.m.guild;
    });
  }

  function fit(s, p, gid) {
    var g = s.guilds[gid || p.m.guild], f = 0, saved = p.m.guild;
    p.traits.forEach(function (t) { if (g.holds.indexOf(t) !== -1) f += 0.3; if (g.loses.indexOf(t) !== -1) f -= 0.3; });
    p.m.guild = g.id;
    var ms = mates(s, p);
    ms.forEach(function (q) {
      var shared = p.traits.filter(function (t) { return has(q, t); }).length;
      f += (shared * 0.15 + (q.m.dom === p.m.dom ? 0.1 : -0.05)) / ms.length;
    });
    if (friendsIn(s, p)) f += 0.3;
    p.m.guild = saved;
    return f;
  }

  function headline(s, p, kind, text) {
    s.news.push({ visit: s.visit, id: p ? p.id : null, named: p ? !!p.sheet : false, kind: kind, text: text });
  }

  function run(s, capOf) {
    s.cliques = s.cliques || { frozen: 0, walked: 0, scapegoat: 0, leftBehind: 0, murdered: 0 };
    var C = s.cliques, r = s.rand;
    Object.keys(s.roster).forEach(function (id) {
      var p = s.roster[id];
      if (!p || !p.alive) return;
      var m = p.m;
      if (!m.guild) { m.strain = 0; m.fit = null; return; }
      var g = s.guilds[m.guild];
      m.fit = fit(s, p);
      if (m.fit >= 0) { m.strain = Math.max(0, (m.strain || 0) - 1); return; }
      m.strain = (m.strain || 0) + 1;
      var st = m.strain;

      if (st >= 1) {                                                     // frozen out
        m.fortune = Math.max(0, m.fortune - 8); m.fame = Math.max(0, m.fame - 3);
        m.frozenAt = m.frozenAt || {};
        if (!m.frozenAt[g.id]) { m.frozenAt[g.id] = true; C.frozen++; headline(s, p, 'frozen', p.name + " isn't getting the good floors at " + g.name + ' anymore'); }
      }
      if (st >= 2) {                                                     // restless
        m.shaken = Math.max(m.shaken || 0, 0.2);
        // evil guilds don't let you walk easily: misfits there get trapped
        if (r() < (g.leaning === 'evil' ? 0.08 : 0.25)) {
          var best = null, bestFit = 0;
          for (var k in s.guilds) {
            var o = s.guilds[k];
            if (!o.alive || o.id === g.id || m.fame < o.bar || !capOf(o.id)) continue;
            var f2 = fit(s, p, o.id); if (f2 > bestFit) { best = o; bestFit = f2; }
          }
          C.walked++;
          headline(s, p, 'misfit-walk', p.name + " can't stand " + g.name + ' anymore' + (best ? ' and finds their people at ' + best.name : '. Open to offers'));
          m.guild = best ? best.id : null; m.freeFor = 0; m.strain = 0; m.heldSince = null;
          return;
        }
      }
      if (st >= 3 && g.renownDelta < 0) {                                // scapegoated
        m.fame = Math.max(0, m.fame - 8); C.scapegoat++;
        headline(s, p, 'scapegoat', g.name + ' blames ' + p.name + ' for a bad week');
      }
      var cruel = g.leaning === 'evil' || g.id === 'iron';
      if (st >= 4 && cruel && m.lastDepth && r() < 0.15) {              // left behind
        p.alive = false; p.causeOfDeath = 'left behind by ' + g.name; C.leftBehind++;
        headline(s, p, 'died', p.name + ' was left on floor ' + m.lastDepth + '. ' + g.name + ' came back without them');
        return;
      }
      if (st >= 5 && g.leaning === 'evil' && r() < 0.12) {              // murder
        p.alive = false; p.causeOfDeath = 'murdered by ' + g.name; C.murdered++;
        headline(s, p, 'died', p.name + ' is found dead. ' + g.name + ' says it was a bad floor. Nobody believes them');
      }
    });
  }

  var API = { run: run, fit: fit };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_CLIQUES = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
