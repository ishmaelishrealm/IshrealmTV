import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Clock, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { hasSupabaseConfig } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'guest'>('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signUp, signIn, continueAsGuest } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password, userName);
        alert('Sign up successful! Please check your email to verify your account.');
      } else if (mode === 'login') {
        await signIn(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
    onClose();
  };

  const formatTime = (minutes: number) => {
    return minutes === 90 ? '90 minutes' : `${minutes} minutes`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-black/90 border-pink-500/30 backdrop-blur-md p-6 md:p-8 space-y-6 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl text-white font-semibold">
            Welcome to ISHREALM TV
          </h2>
          <p className="text-white/60 text-sm">
            {mode === 'guest' && 'Choose how you want to continue'}
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
          </p>
        </div>

        {mode === 'guest' && (
          <div className="space-y-4">
            <Button
              onClick={handleGuestMode}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-6 h-auto"
            >
              <Clock className="w-5 h-5 mr-2" />
              Continue as Guest ({formatTime(90)} free)
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-black px-2 text-white/40">
                  or get unlimited access
                </span>
              </div>
            </div>

            <Button
              onClick={() => setMode('signup')}
              variant="outline"
              className="w-full border-2 border-green-500/50 hover:border-green-400 bg-green-500/10 hover:bg-green-500/20 text-white py-6 h-auto"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Free Account
            </Button>

            <Button
              onClick={() => setMode('login')}
              variant="ghost"
              className="w-full text-white/70 hover:text-white hover:bg-white/10"
            >
              Already have an account? Sign In
            </Button>
          </div>
        )}

        {(mode === 'login' || mode === 'signup') && !hasSupabaseConfig && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-yellow-400 font-medium text-sm">Supabase Not Configured</p>
                  <p className="text-yellow-400/70 text-xs mt-1">
                    Authentication requires Supabase environment variables. Please use Guest Mode or contact the administrator.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setMode('guest')}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-6 h-auto"
            >
              ← Back to Guest Mode
            </Button>
          </div>
        )}

        {(mode === 'login' || mode === 'signup') && hasSupabaseConfig && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-white/80">
                  Display Name
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="bg-black/30 border-white/20 text-white placeholder:text-white/40 pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/30 border-white/20 text-white placeholder:text-white/40 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-black/30 border-white/20 text-white placeholder:text-white/40 pl-10"
                />
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-white/40">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-green-600 hover:from-pink-500 hover:to-green-500 text-white py-6 h-auto"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>

            <Button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              variant="ghost"
              className="w-full text-white/70 hover:text-white hover:bg-white/10"
            >
              {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </Button>

            <Button
              type="button"
              onClick={() => setMode('guest')}
              variant="ghost"
              className="w-full text-white/50 hover:text-white/70 hover:bg-white/5"
            >
              ← Back to options
            </Button>
          </form>
        )}

        {mode === 'guest' && (
          <div className="pt-4 border-t border-white/10">
            <div className="space-y-2 text-xs text-white/50">
              <p>✓ No credit card required</p>
              <p>✓ Watch parties with friends</p>
              <p>✓ Real-time chat & sync</p>
              <p>✓ Upgrade anytime for unlimited access</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

