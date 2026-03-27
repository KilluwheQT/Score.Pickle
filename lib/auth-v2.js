import { database, ref, set, get, update, remove } from './firebase.js';

// Generate unique referee code
function generateRefereeCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// User registration with referee code
export async function signUp(email, password, name) {
  try {
    const userId = email.replace(/[@.]/g, '_');
    const refereeCode = generateRefereeCode();
    
    const userRef = ref(database, `users/${userId}`);
    const existingUser = await get(userRef);
    
    if (existingUser.exists()) {
      return { success: false, message: 'User already exists' };
    }

    const userData = {
      email,
      name,
      password, // In production, hash this
      status: 'pending',
      role: 'user',
      refereeCode,
      createdAt: Date.now(),
      lastLogin: null
    };

    await set(userRef, userData);
    
    return { 
      success: true, 
      message: 'Account created successfully. Please wait for admin approval.',
      user: userData
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'Failed to create account' };
  }
}

// User login with status check
export async function signIn(email, password) {
  try {
    const userId = email.replace(/[@.]/g, '_');
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      return { success: false, message: 'User not found' };
    }

    const user = snapshot.val();
    
    if (user.password !== password) {
      return { success: false, message: 'Invalid password' };
    }

    if (user.status === 'pending') {
      return { 
        success: false, 
        message: 'Your account is waiting for admin approval.',
        pending: true
      };
    }

    if (user.status === 'rejected') {
      return { 
        success: false, 
        message: 'Your account has been rejected. Please contact admin.',
        rejected: true
      };
    }

    // Update last login
    await update(userRef, { lastLogin: Date.now() });

    return { success: true, user };
  } catch (error) {
    console.error('Signin error:', error);
    return { success: false, message: 'Login failed' };
  }
}

// Get all users for admin
export async function getAllUsers() {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const users = [];
    snapshot.forEach((childSnapshot) => {
      users.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    return users;
  } catch (error) {
    console.error('Get users error:', error);
    return [];
  }
}

// Update user status
export async function updateUserStatus(userId, status) {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, { status });
    return { success: true };
  } catch (error) {
    console.error('Update user status error:', error);
    return { success: false };
  }
}

// Validate referee code
export async function validateRefereeCode(code) {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      return { valid: false };
    }

    let user = null;
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      if (userData.refereeCode === code && userData.status === 'approved') {
        user = {
          id: childSnapshot.key,
          ...userData
        };
      }
    });

    return { 
      valid: !!user, 
      user: user 
    };
  } catch (error) {
    console.error('Validate referee code error:', error);
    return { valid: false };
  }
}

// Create admin account
export async function createAdminAccount(email, password, name) {
  try {
    const userId = email.replace(/[@.]/g, '_');
    const refereeCode = generateRefereeCode();
    
    const userData = {
      email,
      name,
      password,
      status: 'approved',
      role: 'admin',
      refereeCode,
      createdAt: Date.now(),
      lastLogin: null
    };

    await set(ref(database, `users/${userId}`), userData);
    
    return { success: true, user: userData };
  } catch (error) {
    console.error('Create admin error:', error);
    return { success: false };
  }
}

// Session management
export function setUserSession(user) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pickleball_user', JSON.stringify(user));
  }
}

export function getUserSession() {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('pickleball_user');
    return session ? JSON.parse(session) : null;
  }
  return null;
}

export function clearUserSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pickleball_user');
  }
}

export function isAdmin(user) {
  return user?.role === 'admin';
}
