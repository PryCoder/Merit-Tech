const crypto = require('crypto');

// In-memory data store (MVP)
// NOTE: This resets on server restart. Swap with a DB adapter later.

const store = {
  companies: new Map(),
  assessments: new Map(),
  candidates: new Map(),
  sessions: new Map(),
  userCandidates: new Map(),
  pipelineStages: new Map(),
};

function newId() {
  return crypto.randomUUID();
}

function resetStore() {
  for (const m of Object.values(store)) m.clear();
}

module.exports = { store, newId, resetStore };
