/* The visit bulletin. Robert, 2026-09-28: "Focus only on 3 of the most
 * significant developments. Group similar ones, like duels, feats, etc."
 *
 * Every headline belongs to a group. Within a visit, similar headlines are
 * folded into one story (the biggest one leads, the rest become "+N more").
 * Stories are ranked by significance and only the top 3 are shown. The full
 * log is still in state.news for anyone who wants to dig.
 *
 * Significance = how big the kind of event is, more if a named character is
 * involved, more again the more famous they are. Opportunities for the
 * player (a star walking out, a patron locking someone up) rank high on
 * purpose: the bulletin is there to make the player want to act.
 */
(function (root) {
  'use strict';
  var GROUPS = {
    'Deaths':            { kinds: ['died'] },
    'Power shifts':      { kinds: ['merger', 'collapse', 'alliance-broken', 'truce', 'guild-debt', 'blacklist'] },
    'Stars on the move': { kinds: ['window', 'poached', 'expelled', 'exile-secrets', 'misfit-walk', 'homesick', 'left', 'joined'] },
    'Feats':             { kinds: ['duel', 'haul', 'hero', 'promotion', 'mentor', 'saved', 'reconcile'] },
    'Bad blood':         { kinds: ['knife', 'bounty', 'abandoned', 'rat', 'sabotage', 'turf', 'racket', 'scapegoat', 'forbidden', 'rivalry', 'frozen'] },
    'Hearts':            { kinds: ['sparks', 'heartbreak', 'jealousy', 'clicked', 'apart'] },
    'Money':             { kinds: ['patronage', 'joint', 'debt', 'split', 'book', 'loan', 'repaid'] }
  };
  var WEIGHT = {
    died: 100, merger: 80, collapse: 80, window: 75, poached: 70, knife: 60, 'alliance-broken': 60, bounty: 55,
    promotion: 50, expelled: 45, 'exile-secrets': 45, rat: 45, duel: 45, truce: 45, 'guild-debt': 40, patronage: 40,
    abandoned: 40, reconcile: 40, sparks: 40, heartbreak: 40, blacklist: 35, turf: 35, hero: 35, saved: 35, 'misfit-walk': 35,
    mentor: 30, sabotage: 30, racket: 30, scapegoat: 30, forbidden: 30, homesick: 30,
    joint: 25, haul: 25, left: 25, debt: 25, jealousy: 25, defender: 25,
    rivalry: 20, frozen: 20, split: 20, book: 20, joined: 15, clicked: 15, apart: 15, shift: 15, hazing: 15, hurt: 15,
    loan: 10, repaid: 10, vanished: 10, bust: 5
  };
  var GROUP_OF = {};
  Object.keys(GROUPS).forEach(function (g) { GROUPS[g].kinds.forEach(function (k) { GROUP_OF[k] = g; }); });

  function significance(s, n) {
    var w = WEIGHT[n.kind] || 10;
    if (n.named) w += 20;
    var p = n.id && s && s.roster[n.id];
    if (p && p.m) w += Math.round(p.m.fame / 5);
    return w;
  }

  // Top `limit` stories for one visit's headlines.
  function bulletin(s, news, limit) {
    limit = limit || 3;
    var groups = {};
    news.forEach(function (n) {
      var g = GROUP_OF[n.kind] || 'Around town';
      var item = { text: n.text, w: significance(s, n), kind: n.kind };
      (groups[g] = groups[g] || []).push(item);
    });
    return Object.keys(groups).map(function (g) {
      var items = groups[g].sort(function (a, b) { return b.w - a.w; });
      return {
        group: g,
        lead: items[0].text,
        more: items.length - 1,
        weight: items[0].w + 5 * (items.length - 1) - (g === 'Around town' ? 60 : 0)  // busy groups rank up; small talk only fills gaps
      };
    }).sort(function (a, b) { return b.weight - a.weight; }).slice(0, limit);
  }

  function format(story) {
    return story.group + ': ' + story.lead + (story.more ? ' (+' + story.more + ' more)' : '');
  }

  var API = { bulletin: bulletin, format: format, GROUPS: GROUPS, WEIGHT: WEIGHT, significance: significance };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_BULLETIN = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
