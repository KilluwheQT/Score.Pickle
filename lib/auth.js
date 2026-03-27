import { database, ref, set, get, update, remove } from './firebase.js';

const DEFAULT_ADMIN = {
  email: process.env.NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL || 'admin@pickleball.local',
  password: process.env.NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD || 'Admin@123',
  name: process.env.NEXT_PUBLIC_DEFAULT_ADMIN_NAME || 'System Admin'
};

async function ensureDefaultAdminAccount() {
  try {
    const userId = DEFAULT_ADMIN.email.replace(/\./g, '_').replace(/@/g, '_at_');
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return;
    }

    await set(userRef, {
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      password: DEFAULT_ADMIN.password,
      status: 'approved',
      role: 'admin',
      createdAt: Date.now(),
      lastLogin: null
    });
  } catch (error) {
    console.error('Ensure default admin error:', error);
  }
}

// User authentication functions
export async function signUp(email, password, name) {
  try {
    // Create user in Firebase Authentication would be handled here
    // For now, we'll store in database with "pending" status
    
    const userId = email.replace(/\./g, '_').replace(/@/g, '_at_');
    const userRef = ref(database, `users/${userId}`);
    
    const userData = {
      email,
      name,
      password, // In production, this should be hashed
      status: 'pending', // pending, approved, rejected
      role: 'user', // user, admin
      createdAt: Date.now(),
      lastLogin: null
    };
    
    await set(userRef, userData);
    return { success: true, message: 'Account created. Waiting for admin approval.' };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, message: 'Failed to create account' };
  }
}

export async function signIn(email, password) {
  try {
    await ensureDefaultAdminAccount();

    const userId = email.replace(/\./g, '_').replace(/@/g, '_at_');
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      return { success: false, message: 'User not found' };
    }
    
    const userData = snapshot.val();
    
    // Check password (in production, use proper password hashing)
    if (userData.password !== password) {
      return { success: false, message: 'Invalid password' };
    }
    
    // Check if approved
    if (userData.status !== 'approved') {
      return { success: false, message: 'Account not approved yet' };
    }
    
    // Update last login
    await update(userRef, { lastLogin: Date.now() });
    
    return { 
      success: true, 
      user: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        id: userId
      }
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, message: 'Failed to sign in' };
  }
}

export async function getAllUsers() {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const users = snapshot.val();
    return Object.keys(users).map(userId => ({
      id: userId,
      ...users[userId]
    }));
  } catch (error) {
    console.error('Get users error:', error);
    return [];
  }
}

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

export async function deleteUser(userId) {
  try {
    const userRef = ref(database, `users/${userId}`);
    await remove(userRef);
    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false };
  }
}

// Session management (client-side)
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

// Admin functions
export async function createAdminAccount(email, password, name) {
  try {
    const userId = email.replace(/\./g, '_').replace(/@/g, '_at_');
    const userRef = ref(database, `users/${userId}`);
    
    const userData = {
      email,
      name,
      password,
      status: 'approved',
      role: 'admin',
      createdAt: Date.now(),
      lastLogin: null
    };
    
    await set(userRef, userData);
    return { success: true, message: 'Admin account created successfully' };
  } catch (error) {
    console.error('Create admin error:', error);
    return { success: false, message: 'Failed to create admin account' };
  }
}

export function isAdmin(user) {
  return user && user.role === 'admin';
}
