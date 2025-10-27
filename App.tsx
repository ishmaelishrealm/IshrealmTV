import { useState } from "react";
import { Navbar } from "./src/components/Navbar";
import { HomePage } from "./src/components/HomePage";
import { CreateRoom } from "./src/components/CreateRoom";
import { JoinRoom } from "./src/components/JoinRoom";
import { WatchParty } from "./src/components/WatchParty";
import { YouTubeDownloader } from "./src/components/YouTubeDownloader";

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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Blurred cinema background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-md scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0cmUlMjBjaW5lbWF8ZW58MXx8fHwxNzYxNTMwMDkxfDA&ixlib=rb-4.1.0&q=80&w=1080')`
          }}
        />
        {/* Gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-pink-950/30" />
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
      
      {/* Subtle animated accent elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}