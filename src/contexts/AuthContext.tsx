import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface GuestSession {
  id: string;
  startTime: number;
  expiresAt: number;
  timeRemaining: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  guestSession: GuestSession | null;
  signUp: (email: string, password: string, userName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  upgradeGuestAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_SESSION_KEY = 'ishrealm_guest_session';
const GUEST_SESSION_MINUTES = parseInt(import.meta.env.VITE_GUEST_SESSION_MINUTES || '90');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);

  // Initialize guest session timer
  useEffect(() => {
    if (!isGuest || !guestSession) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeRemaining = Math.max(0, guestSession.expiresAt - now);
      
      if (timeRemaining === 0) {
        handleGuestSessionExpired();
      } else {
        setGuestSession(prev => prev ? { ...prev, timeRemaining } : null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isGuest, guestSession]);

  // Load guest session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem(GUEST_SESSION_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        const now = Date.now();
        
        if (parsed.expiresAt > now) {
          setIsGuest(true);
          setGuestSession({
            ...parsed,
            timeRemaining: parsed.expiresAt - now
          });
        } else {
          localStorage.removeItem(GUEST_SESSION_KEY);
        }
      } catch (error) {
        console.error('Failed to parse guest session:', error);
        localStorage.removeItem(GUEST_SESSION_KEY);
      }
    }
  }, []);

  // Check active Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Clear guest session if user logs in
      if (session) {
        setIsGuest(false);
        setGuestSession(null);
        localStorage.removeItem(GUEST_SESSION_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_name: userName,
          role: 'user'
        }
      }
    });

    if (error) throw error;
    
    // Create user profile
    if (data.user) {
      await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            user_name: userName,
            email: email,
            role: 'user'
          }
        ]);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setUser(null);
    setSession(null);
  };

  const continueAsGuest = () => {
    const now = Date.now();
    const expiresAt = now + (GUEST_SESSION_MINUTES * 60 * 1000);
    const guestId = `guest_${Math.random().toString(36).substring(2, 11)}`;
    
    const newGuestSession: GuestSession = {
      id: guestId,
      startTime: now,
      expiresAt,
      timeRemaining: expiresAt - now
    };

    setIsGuest(true);
    setGuestSession(newGuestSession);
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(newGuestSession));
  };

  const upgradeGuestAccount = () => {
    // This will trigger the signup modal
    setIsGuest(false);
    setGuestSession(null);
    localStorage.removeItem(GUEST_SESSION_KEY);
  };

  const handleGuestSessionExpired = () => {
    setIsGuest(false);
    setGuestSession(null);
    localStorage.removeItem(GUEST_SESSION_KEY);
    alert('Your guest session has expired. Please sign up for unlimited access!');
  };

  const value = {
    user,
    session,
    loading,
    isGuest,
    guestSession,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
    upgradeGuestAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

