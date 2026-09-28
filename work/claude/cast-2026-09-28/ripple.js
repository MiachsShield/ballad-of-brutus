/* Ripple — Robert, 2026-09-28: "With kin, to hurt or help one is to do the
 * same to the other. Friends/lovers/guildmates to a similar/lesser extent."
 *
 * When something is done TO a person (help or harm, by a person or a
 * guild), everyone close to them takes it personally, scaled by closeness:
 *   kin 100% (mentor/student too)   lovers 75%   friends 50%   guildmates 25% (35% in a tight clique)
 * One weight per person — the strongest relationship wins, never stacked.
 *
 * Deaths ripple too: if a guild left someone behind, murdered them, or is
 * suspected of the knife, their circle holds that guild responsible.
 * Guild grudges live in the ledger as rows toward 'guild:<id>'; they keep
 * people from joining that guild and sour fit inside it.
 *
 * Robert, 2026-09-28: when a person is hurt by a clique, their friends
 * hate both the clique and the guild. blameClique() writes both: rows
 * toward the guild and toward each clique member. The clique never grudges
 * itself, and someone in the guild only by membership does not turn on
 * their own guild on the victim's behalf; real friends inside still do.
 *
 * Ready for Brutus (not in the loop yet): rob one twin, both hate him.
 */
(function (root) {
  'use strict';
  var W = { kin: 1, lovers: 0.75, friends: 0.5, guild: 0.25, tightGuild: 0.35 };

  function isKin(s, a, b) {
    function k(x, y) { return x.sheet && x.sheet.ties.some(function (t) { return t.with === y.id && /twin|sibling|brother|sister|parent|child|cousin/.test(t.kind); }); }
    return !!(k(a, b) || k(b, a));
  }
  function hasRow(s, a, b, tags) {
    return s.ledger.rows.some(function (r) { return r.from === a.id && r.to === b.id && tags.indexOf(r.tag) !== -1; });
  }

  // Everyone close to `p`, with the weight of their strongest tie.
  function circle(s, p) {
    var out = [];
    for (var id in s.roster) {
      var q = s.roster[id];
      if (q === p || !q.alive) continue;
      var w = 0;
      if (isKin(s, p, q)) w = W.kin;
      else if (hasRow(s, q, p, ['mentor', 'mentee'])) w = W.kin;                // a mentor takes it like family
      else if (hasRow(s, q, p, ['lovers'])) w = W.lovers;
      else if (hasRow(s, q, p, ['friends', 'old-ties'])) w = W.friends;
      else if (p.m && q.m && p.m.guild && p.m.guild === q.m.guild) w = (q.m.fit || 0) > 0.4 ? W.tightGuild : W.guild;
      if (w) out.push({ who: q, w: w });
    }
    return out;
  }

  // Something with (respect, warmth) was done to `target` by `actorId`.
  // `actorId` is a person id or 'guild:<id>'. The target's own row is the
  // caller's job; this writes the circle's secondhand rows.
  function spread(s, target, actorId, tag, respect, warmth, decay, exclude) {
    var n = 0;
    circle(s, target).forEach(function (c) {
      if (c.who.id === actorId) return;                       // you don't grudge yourself
      if (exclude && exclude.indexOf(c.who.id) !== -1) return;
      if (c.w <= W.tightGuild && c.who.m && actorId === 'guild:' + c.who.m.guild) return;  // membership alone isn't loyalty to the victim
      var rs = respect * c.w, wm = warmth * c.w;
      if (Math.abs(rs) < 0.5 && Math.abs(wm) < 0.5) return;   // too faint to register
      s.ledger.write(c.who.id, actorId, tag + (c.w === 1 ? '' : '-secondhand'), rs, wm, decay);
      n++;
    });
    s.rippled = (s.rippled || 0) + n;
    return n;
  }

  // Before the dead are forgotten: their circle blames whoever did it.
  function onDeath(s, p) {
    var cause = p.causeOfDeath || '', gname = null, tag = null;
    for (var k in s.guilds) if (cause.indexOf(s.guilds[k].name) !== -1) gname = k;
    if (/^left behind/.test(cause)) tag = 'left-our-own';
    else if (/^murdered/.test(cause)) tag = 'murdered-our-own';
    else if (/^knifed/.test(cause)) tag = 'knifed-our-own';
    if (!gname || !tag) return 0;                               // the dungeon took them; nobody to blame
    if (p.cliqueBlamed) return 0;                               // clique + guild already blamed in cliques.js
    var n = spread(s, p, 'guild:' + gname, tag, 0, -6, null);
    s.guildGrudges = (s.guildGrudges || 0) + n;
    return n;
  }

  // A clique hurt `victim` inside guild `gid`. Severity is how bad it was.
  // The victim (if alive) and their circle hate the guild AND the clique.
  function blameClique(s, victim, gid, clique, tag, severity) {
    var ids = clique.map(function (q) { return q.id; }), n = 0;
    var targets = ['guild:' + gid].concat(ids);
    targets.forEach(function (t) {
      if (victim.alive) s.ledger.write(victim.id, t, tag, 0, -severity, null);
      n += spread(s, victim, t, tag, 0, -severity, null, ids);
    });
    s.cliqueBlame = (s.cliqueBlame || 0) + n;
    return n;
  }

  // How someone feels about a guild (sum of their rows toward it).
  function guildFeeling(s, p, gid) {
    var w = 0;
    s.ledger.rows.forEach(function (r) { if (r.from === p.id && r.to === 'guild:' + gid) w += r.warmth; });
    return w;
  }

  var API = { W: W, circle: circle, spread: spread, onDeath: onDeath, blameClique: blameClique, guildFeeling: guildFeeling, isKin: isKin };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_RIPPLE = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
