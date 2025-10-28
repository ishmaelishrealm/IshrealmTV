import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { CreateRoom } from "./components/CreateRoom";
import { JoinRoom } from "./components/JoinRoom";
import { WatchParty } from "./components/WatchParty";
import { YouTubeDownloader } from "./components/YouTubeDownloader";
import { AuthModal } from "./components/AuthModal";
import { GuestTimer } from "./components/GuestTimer";
import { useAuth } from "./contexts/AuthContext";

export type View = "home" | "create" | "join" | "watch" | "downloader";

export interface Room {
  id: string;
  platform: "youtube" | "twitch" | "hosted" | "local";
  url: string;
  hostName: string;
  isHost: boolean;
  localFile?: File;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, isGuest, loading } = useAuth();

  // Show auth modal on first visit if not logged in
  useEffect(() => {
    if (!loading && !user && !isGuest) {
      setShowAuthModal(true);
    }
  }, [loading, user, isGuest]);

  const handleCreateRoom = (room: Room) => {
    setCurrentRoom(room);
    setCurrentView("watch");
  };

  const handleJoinRoom = (room: Room) => {
    setCurrentRoom(room);
    setCurrentView("watch");
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setCurrentView("home");
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60">Loading ISHREALM TV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cinematic movie theater background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 blur-sm scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')`
          }}
        />
        {/* Romantic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/90 to-pink-950/80" />
        {/* Soft vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black" />
      </div>

      <div className="relative z-10">
        <Navbar 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          inRoom={currentView === "watch"}
          onLeaveRoom={handleLeaveRoom}
        />
        
        {currentView === "home" && (
          <HomePage setCurrentView={setCurrentView} />
        )}
        
        {currentView === "create" && (
          <CreateRoom 
            onCreateRoom={handleCreateRoom}
            onBack={() => setCurrentView("home")}
          />
        )}
        
        {currentView === "join" && (
          <JoinRoom 
            onJoinRoom={handleJoinRoom}
            onBack={() => setCurrentView("home")}
          />
        )}
        
        {currentView === "watch" && currentRoom && (
          <WatchParty 
            room={currentRoom}
            onLeaveRoom={handleLeaveRoom}
          />
        )}
        
        {currentView === "downloader" && (
          <YouTubeDownloader 
            onBack={() => setCurrentView("home")}
          />
        )}
      </div>
      
      {/* Cinematic lighting effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Guest Timer */}
      <GuestTimer />
    </div>
  );
}