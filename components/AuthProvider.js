'use client';

import { AuthProvider } from '../contexts/AuthContext.js';

export default function AuthProviderWrapper({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
