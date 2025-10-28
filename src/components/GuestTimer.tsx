import { Clock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export function GuestTimer() {
  const { isGuest, guestSession, upgradeGuestAccount } = useAuth();

  if (!isGuest || !guestSession) return null;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const percentageRemaining = (guestSession.timeRemaining / (guestSession.expiresAt - guestSession.startTime)) * 100;
  const isLowTime = guestSession.timeRemaining < 5 * 60 * 1000; // Less than 5 minutes

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className={`bg-black/90 border-2 rounded-xl p-4 backdrop-blur-md shadow-lg space-y-3 ${
        isLowTime ? 'border-red-500/50 animate-pulse' : 'border-pink-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isLowTime ? 'bg-red-500/20 border-red-500/30' : 'bg-pink-500/20 border-pink-500/30'
          } border-2`}>
            <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-400' : 'text-pink-400'}`} />
          </div>
          
          <div>
            <p className="text-xs text-white/60">Guest Session</p>
            <p className={`text-lg font-semibold ${isLowTime ? 'text-red-400' : 'text-white'}`}>
              {formatTime(guestSession.timeRemaining)}
            </p>
          </div>
        </div>

        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              isLowTime ? 'bg-red-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'
            }`}
            style={{ width: `${percentageRemaining}%` }}
          />
        </div>

        {isLowTime && (
          <p className="text-xs text-red-400/80 animate-pulse">
            ⚠️ Session ending soon!
          </p>
        )}

        <Button
          onClick={upgradeGuestAccount}
          size="sm"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade for Unlimited
        </Button>
      </div>
    </div>
  );
}

