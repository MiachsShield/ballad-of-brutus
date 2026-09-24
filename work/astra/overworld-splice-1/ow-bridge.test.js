'use strict';

const assert = require('assert');
const OW = require(process.env.BOB_OW_MODULE || '../../claude/overworld-2026-09-18/adventurers.js');
const bridgeApi = require('./ow-bridge.js');

function makeStorage() {
  const data = new Map();
  return {
    getItem: key => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, value)
  };
}

function partyIds(snapshot) { return Object.keys(snapshot.roster); }

(function run() {
  const storage = makeStorage();
  const bridge = bridgeApi.create({ OW, seed: 17, rosterSize: 8, storage });
  assert.strictEqual(bridge.talkAvailable({ roomCleared: true, inCombat: false }), true);
  assert.strictEqual(bridge.talkAvailable({ roomCleared: true, inCombat: true }), false);
  assert.strictEqual(bridge.talkAvailable({ roomCleared: false, inCombat: false }), false);

  let before = bridge.snapshot();
  const first = partyIds(before)[0];
  const firstMessage = bridge.applyMessage({ id: 'talk-1', action: 'encounter', args: { partyId: first, verb: 'aid' } });
  assert.strictEqual(firstMessage.duplicate, false);
  const rowsAfterFirst = bridge.snapshot().ledger.length;
  const duplicate = bridge.applyMessage({ id: 'talk-1', action: 'encounter', args: { partyId: first, verb: 'exploit' } });
  assert.strictEqual(duplicate.duplicate, true);
  assert.strictEqual(bridge.snapshot().ledger.length, rowsAfterFirst);

  const savedGame = bridge.saveInto({ treasury: 123, chronicle: ['talk-1'] });
  const restored = bridgeApi.create({ OW, storage: makeStorage() });
  restored.loadFrom(savedGame);
  assert.deepStrictEqual(restored.snapshot(), bridge.snapshot());
  assert.deepStrictEqual(restored.operations, bridge.operations);

  let gossipPasses = 0;
  let rivalClashes = 0;
  let flashpoints = 0;
  for (let turn = 0; turn < 700; turn += 1) {
    const snap = bridge.snapshot();
    const ids = partyIds(snap);
    ids.forEach((id, index) => {
      const verbs = ['aid', 'ignore', 'exploit', 'obstruct'];
      if ((index + turn) % 2 === 0) bridge.encounter(id, verbs[index % verbs.length]);
    });
    const wave = bridge.endTurn(3);
    gossipPasses += (wave.gossip || []).length;
    rivalClashes += (wave.clashes || []).length;
    flashpoints += (wave.primed || []).length;
    bridge.repopulate(8);
  }

  const finalState = bridge.snapshot();
  assert.strictEqual(finalState.wave, 700);
  assert.ok(finalState.roster && typeof finalState.roster === 'object');
  assert.ok(finalState.ledger && Array.isArray(finalState.ledger));
  assert.ok(bridge.operations.length > 700);
  const persisted = bridge.save();
  const finalRestored = bridgeApi.create({ OW, storage });
  finalRestored.load();
  assert.deepStrictEqual(finalRestored.snapshot(), finalState);
  assert.deepStrictEqual(finalRestored.operations, bridge.operations);

  console.log(JSON.stringify({
    ok: true,
    turns: finalState.wave,
    roster: Object.keys(finalState.roster).length,
    ledgerRows: finalState.ledger.length,
    gossipPasses,
    rivalClashes,
    flashpoints,
    savedOperations: persisted.operations.length
  }, null, 2));
})();
