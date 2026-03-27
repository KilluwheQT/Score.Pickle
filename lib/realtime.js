import { database, ref, onValue, set, push } from './firebase.js';

// Generate a unique match ID
export function generateMatchId() {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

// Create a new match
export async function createMatch(matchData) {
  const matchId = generateMatchId();
  const matchRef = ref(database, `matches/${matchId}`);
  await set(matchRef, {
    ...matchData,
    id: matchId,
    createdAt: Date.now(),
    status: 'active'
  });
  return matchId;
}

// Listen for real-time updates to a match
export function subscribeToMatch(matchId, callback) {
  const matchRef = ref(database, `matches/${matchId}`);
  return onValue(matchRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
}

// Update match score
export async function updateMatchScore(matchId, scoreData) {
  const matchRef = ref(database, `matches/${matchId}`);
  await set(matchRef, scoreData);
}

// Update match status (complete, reset, etc.)
export async function updateMatchStatus(matchId, status, additionalData = {}) {
  const matchRef = ref(database, `matches/${matchId}`);
  await set(matchRef, {
    status,
    ...additionalData,
    updatedAt: Date.now()
  });
}

// Save completed match to history
export async function saveToHistory(matchData) {
  const historyRef = ref(database, `history`);
  const newHistoryRef = push(historyRef);
  await set(newHistoryRef, {
    ...matchData,
    completedAt: Date.now()
  });
}

// Get match history
export function subscribeToHistory(callback) {
  const historyRef = ref(database, `history`);
  return onValue(historyRef, (snapshot) => {
    const data = snapshot.val();
    const history = data ? Object.values(data).reverse() : [];
    callback(history);
  });
}
