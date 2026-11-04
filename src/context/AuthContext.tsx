import { onAuthStateChanged, signOut as fbSignOut, User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DOMAIN_ERROR, isAllowedEmail } from '@/lib/domain';
import { auth, db } from '@/lib/firebase';

export type Role = 'admin' | 'user';

type AuthValue = {
  user: User | null;
  role: Role | null;
  loading: boolean;
  authError: string;
  clearError: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      if (!isAllowedEmail(u.email)) {
        await fbSignOut(auth);
        setAuthError(DOMAIN_ERROR);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, 'users', u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role === 'admin' ? 'admin' : 'user');
        } else {
          await setDoc(ref, {
            email: u.email,
            name: u.displayName ?? '',
            photoURL: u.photoURL ?? '',
            role: 'user',
            createdAt: serverTimestamp(),
          });
          setRole('user');
        }
      } catch {
        setRole('user');
      }
      setAuthError('');
      setUser(u);
      setLoading(false);
    });
  }, []);

  const value: AuthValue = {
    user,
    role,
    loading,
    authError,
    clearError: () => setAuthError(''),
    signOut: () => fbSignOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}