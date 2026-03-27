import { database, ref, set, get, update, remove, onValue } from './firebase.js';

// Generate unique court ID
function generateCourtId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Create new court
export async function createCourt(courtName, createdBy) {
  try {
    const courtId = generateCourtId();
    const courtData = {
      id: courtId,
      name: courtName,
      status: 'active',
      createdBy,
      createdAt: Date.now(),
      currentMatch: null,
      matchHistory: []
    };

    await set(ref(database, `courts/${courtId}`), courtData);
    
    return { success: true, court: courtData };
  } catch (error) {
    console.error('Create court error:', error);
    return { success: false, message: 'Failed to create court' };
  }
}

// Get all courts
export async function getAllCourts() {
  try {
    const courtsRef = ref(database, 'courts');
    const snapshot = await get(courtsRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const courts = [];
    snapshot.forEach((childSnapshot) => {
      courts.push({
        ...childSnapshot.val()
      });
    });

    return courts;
  } catch (error) {
    console.error('Get courts error:', error);
    return [];
  }
}

// Subscribe to real-time court updates
export function subscribeToCourts(callback) {
  const courtsRef = ref(database, 'courts');
  
  const unsubscribe = onValue(courtsRef, (snapshot) => {
    const courts = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        courts.push({
          ...childSnapshot.val()
        });
      });
    }
    callback(courts);
  });

  return unsubscribe;
}

// Create new match for a court
export async function createMatch(courtId, teamA, teamB, refereeCode) {
  try {
    const matchId = generateCourtId();
    const matchData = {
      id: matchId,
      courtId,
      teamA: {
        name: teamA,
        score: 0,
        serving: true
      },
      teamB: {
        name: teamB,
        score: 0,
        serving: false
      },
      refereeCode,
      status: 'active',
      startTime: Date.now(),
      endTime: null,
      winner: null,
      gameHistory: []
    };

    // Update court with current match
    await update(ref(database, `courts/${courtId}`), {
      currentMatch: matchData
    });

    // Store match in matches collection
    await set(ref(database, `matches/${matchId}`), matchData);
    
    return { success: true, match: matchData };
  } catch (error) {
    console.error('Create match error:', error);
    return { success: false, message: 'Failed to create match' };
  }
}

// Subscribe to real-time match updates
export function subscribeToMatch(matchId, callback) {
  const matchRef = ref(database, `matches/${matchId}`);
  
  const unsubscribe = onValue(matchRef, (snapshot) => {
    const match = snapshot.val();
    callback(match);
  });

  return unsubscribe;
}

// Update match score
export async function updateMatchScore(matchId, refereeCode, team) {
  try {
    // Validate referee code
    const { valid, user } = await validateRefereeCode(refereeCode);
    if (!valid) {
      return { success: false, message: 'Invalid referee code' };
    }

    const matchRef = ref(database, `matches/${matchId}`);
    const snapshot = await get(matchRef);
    
    if (!snapshot.exists()) {
      return { success: false, message: 'Match not found' };
    }

    const match = snapshot.val();
    
    // Check if referee code matches
    if (match.refereeCode !== refereeCode) {
      return { success: false, message: 'Invalid referee code for this match' };
    }

    // Check if team is serving
    const servingTeam = match.teamA.serving ? 'teamA' : 'teamB';
    if (servingTeam !== team) {
      return { success: false, message: 'Only serving team can score' };
    }

    // Update score
    const updatedMatch = { ...match };
    updatedMatch[team].score += 1;
    
    // Add to game history
    updatedMatch.gameHistory.push({
      team,
      score: updatedMatch[team].score,
      timestamp: Date.now(),
      refereeCode
    });

    // Check for winner (first to 11, win by 2)
    const teamAScore = updatedMatch.teamA.score;
    const teamBScore = updatedMatch.teamB.score;
    
    if (teamAScore >= 11 || teamBScore >= 11) {
      const scoreDiff = Math.abs(teamAScore - teamBScore);
      if (scoreDiff >= 2) {
        updatedMatch.winner = teamAScore > teamBScore ? 'A' : 'B';
        updatedMatch.status = 'completed';
        updatedMatch.endTime = Date.now();
      }
    }

    // Switch serving team if point was scored
    if (updatedMatch.status === 'active') {
      updatedMatch.teamA.serving = !updatedMatch.teamA.serving;
      updatedMatch.teamB.serving = !updatedMatch.teamB.serving;
    }

    await update(matchRef, updatedMatch);

    // Update court with match data
    await update(ref(database, `courts/${match.courtId}`), {
      currentMatch: updatedMatch
    });

    return { success: true, match: updatedMatch };
  } catch (error) {
    console.error('Update score error:', error);
    return { success: false, message: 'Failed to update score' };
  }
}

// Undo last score
export async function undoLastScore(matchId, refereeCode) {
  try {
    const { valid } = await validateRefereeCode(refereeCode);
    if (!valid) {
      return { success: false, message: 'Invalid referee code' };
    }

    const matchRef = ref(database, `matches/${matchId}`);
    const snapshot = await get(matchRef);
    
    if (!snapshot.exists()) {
      return { success: false, message: 'Match not found' };
    }

    const match = snapshot.val();
    
    if (match.refereeCode !== refereeCode) {
      return { success: false, message: 'Invalid referee code for this match' };
    }

    if (match.gameHistory.length === 0) {
      return { success: false, message: 'No scores to undo' };
    }

    // Remove last score from history
    const gameHistory = [...match.gameHistory];
    const lastScore = gameHistory.pop();

    // Recalculate scores
    const updatedMatch = { ...match };
    updatedMatch.teamA.score = 0;
    updatedMatch.teamB.score = 0;
    updatedMatch.teamA.serving = true;
    updatedMatch.teamB.serving = false;
    updatedMatch.gameHistory = gameHistory;
    updatedMatch.status = 'active';
    updatedMatch.winner = null;
    updatedMatch.endTime = null;

    // Recalculate from history
    gameHistory.forEach((score) => {
      updatedMatch[score.team].score = score.score;
      updatedMatch.teamA.serving = !updatedMatch.teamA.serving;
      updatedMatch.teamB.serving = !updatedMatch.teamB.serving;
    });

    await update(matchRef, updatedMatch);

    // Update court with match data
    await update(ref(database, `courts/${match.courtId}`), {
      currentMatch: updatedMatch
    });

    return { success: true, match: updatedMatch };
  } catch (error) {
    console.error('Undo score error:', error);
    return { success: false, message: 'Failed to undo score' };
  }
}

// Reset match
export async function resetMatch(matchId, refereeCode) {
  try {
    const { valid } = await validateRefereeCode(refereeCode);
    if (!valid) {
      return { success: false, message: 'Invalid referee code' };
    }

    const matchRef = ref(database, `matches/${matchId}`);
    const snapshot = await get(matchRef);
    
    if (!snapshot.exists()) {
      return { success: false, message: 'Match not found' };
    }

    const match = snapshot.val();
    
    if (match.refereeCode !== refereeCode) {
      return { success: false, message: 'Invalid referee code for this match' };
    }

    const resetMatch = {
      ...match,
      teamA: {
        ...match.teamA,
        score: 0,
        serving: true
      },
      teamB: {
        ...match.teamB,
        score: 0,
        serving: false
      },
      status: 'active',
      winner: null,
      endTime: null,
      gameHistory: []
    };

    await update(matchRef, resetMatch);

    // Update court with match data
    await update(ref(database, `courts/${match.courtId}`), {
      currentMatch: resetMatch
    });

    return { success: true, match: resetMatch };
  } catch (error) {
    console.error('Reset match error:', error);
    return { success: false, message: 'Failed to reset match' };
  }
}

// Get match history for a court
export async function getMatchHistory(courtId) {
  try {
    const courtRef = ref(database, `courts/${courtId}`);
    const snapshot = await get(courtRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const court = snapshot.val();
    return court.matchHistory || [];
  } catch (error) {
    console.error('Get match history error:', error);
    return [];
  }
}
