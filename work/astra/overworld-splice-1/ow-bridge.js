'use strict';

/*
 * Ballad of Brutus — deterministic overworld bridge.
 *
 * This adapter owns the integration contract around window.OW. It never
 * forks or edits the simulation module: state is reconstructed by replaying
 * the exact caller operations from the original seed, which restores the
 * seeded RNG position without serializing a closure.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(null);
  else root.BOBOWBridge = factory(root.OW);
})(typeof globalThis !== 'undefined' ? globalThis : this, function createBridgeFactory(OW) {
  'use strict';

  var VERSION = 1;
  var ACTIONS = {
    encounter: true,
    advanceWave: true,
    repopulate: true,
    assassinate: true,
    vendettaStrike: true,
    devotionAct: true,
    exposeWarning: true,
    attachmentDemand: true
  };

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function assertOW(api) {
    if (!api || typeof api.newState !== 'function' ||
        typeof api.encounter !== 'function' ||
        typeof api.advanceWave !== 'function') {
      throw new Error('BOBOWBridge requires the current window.OW API');
    }
  }

  function createBridge(options) {
    options = options || {};
    var api = options.OW || OW;
    assertOW(api);
    var storage = options.storage || null;
    var storageKey = options.storageKey || 'bob-ow-s1';
    var seed = options.seed == null ? 1 : options.seed;
    var rosterSize = options.rosterSize || 8;
    var state = null;
    var operations = [];
    var messageResults = {};

    function runOperation(op) {
      var args = op.args || {};
      if (op.kind === 'encounter') return api.encounter(state, args.partyId, args.verb);
      if (op.kind === 'advanceWave') return api.advanceWave(state, args.ticks, args.options || {});
      if (op.kind === 'repopulate') return api.repopulate(state, args.upTo);
      if (typeof api[op.kind] === 'function') return api[op.kind](state, args.partyId, args.context || {});
      throw new Error('Unknown OW operation: ' + op.kind);
    }

    function rebuild() {
      state = api.newState(seed, rosterSize);
      operations.forEach(runOperation);
      return state;
    }

    function record(kind, args) {
      if (!state) startNewRun(seed, rosterSize);
      var op = { kind: kind, args: clone(args || {}) };
      var result = runOperation(op);
      operations.push(op);
      return result;
    }

    function payload() {
      return {
        schema: VERSION,
        seed: seed,
        rosterSize: rosterSize,
        operations: clone(operations),
        messageResults: clone(messageResults)
      };
    }

    function importPayload(saved) {
      if (!saved || saved.schema !== VERSION) throw new Error('Unsupported OW save schema');
      seed = saved.seed;
      rosterSize = saved.rosterSize;
      operations = clone(saved.operations || []);
      messageResults = clone(saved.messageResults || {});
      rebuild();
      return snapshot();
    }

    function startNewRun(nextSeed, nextRosterSize) {
      seed = nextSeed == null ? 1 : nextSeed;
      rosterSize = nextRosterSize || 8;
      operations = [];
      messageResults = {};
      state = api.newState(seed, rosterSize);
      return snapshot();
    }

    function snapshot() {
      if (!state) startNewRun(seed, rosterSize);
      return {
        wave: state.wave,
        roster: clone(state.roster),
        ledger: clone(state.ledger.rows),
        ledgerNow: state.ledger.now,
        log: clone(state.log),
        heat: clone(state.heat)
      };
    }

    function save() {
      var saved = payload();
      if (storage && typeof storage.setItem === 'function') storage.setItem(storageKey, JSON.stringify(saved));
      return clone(saved);
    }

    function load() {
      if (!storage || typeof storage.getItem !== 'function') throw new Error('No save storage configured');
      var raw = storage.getItem(storageKey);
      if (!raw) return null;
      return importPayload(JSON.parse(raw));
    }

    function saveInto(gameSave) {
      var out = clone(gameSave || {});
      out.owBridge = payload();
      return out;
    }

    function loadFrom(gameSave) {
      if (!gameSave || !gameSave.owBridge) throw new Error('Game save has no owBridge payload');
      return importPayload(gameSave.owBridge);
    }

    function dispatch(kind, args) {
      if (!ACTIONS[kind]) throw new Error('Unsupported OW message: ' + kind);
      var result = record(kind, args);
      return clone(result);
    }

    function applyMessage(message) {
      if (!message || message.id == null || !message.action) throw new Error('OW message needs id and action');
      var id = String(message.id);
      if (Object.prototype.hasOwnProperty.call(messageResults, id)) {
        return { duplicate: true, result: clone(messageResults[id]) };
      }
      var result = dispatch(message.action, message.args || {});
      messageResults[id] = clone(result);
      return { duplicate: false, result: clone(result) };
    }

    function endTurn(ticks, options) {
      return dispatch('advanceWave', { ticks: ticks || 10, options: options || {} });
    }

    return {
      version: VERSION,
      OW: api,
      startNewRun: startNewRun,
      snapshot: snapshot,
      save: save,
      load: load,
      saveInto: saveInto,
      loadFrom: loadFrom,
      applyMessage: applyMessage,
      encounter: function (partyId, verb) { return dispatch('encounter', { partyId: partyId, verb: verb }); },
      endTurn: endTurn,
      repopulate: function (upTo) { return dispatch('repopulate', { upTo: upTo }); },
      talkAvailable: function (context) {
        context = context || {};
        return !!context.roomCleared && !context.inCombat;
      },
      get operations() { return clone(operations); }
    };
  }

  return { version: VERSION, create: createBridge };
});
