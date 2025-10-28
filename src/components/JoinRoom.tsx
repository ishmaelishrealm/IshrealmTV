import { useState } from "react";
import { ArrowLeft, LogIn, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Room } from "../App";
import { useAuth } from "../contexts/AuthContext";
import { getRoom, joinRoom as joinRoomStorage } from "../lib/roomStorage";

interface JoinRoomProps {
  onJoinRoom: (room: Room) => void;
  onBack: () => void;
}

export function JoinRoom({ onJoinRoom, onBack }: JoinRoomProps) {
  const { isGuest, guestSession } = useAuth();
  const [roomCode, setRoomCode] = useState("");
  const [userName, setUserName] = useState("");

  // Check if guest session is valid
  const isGuestSessionValid = !isGuest || (guestSession && guestSession.timeRemaining > 0);

  const handleJoin = () => {
    if (!roomCode || !userName) return;

    // STRICT: Block if guest session expired
    if (isGuest && (!guestSession || guestSession.timeRemaining === 0)) {
      alert('Your guest session has expired! Please sign up for unlimited access.');
      return;
    }

    // Fetch real room data from storage
    const storedRoom = getRoom(roomCode);
    
    if (!storedRoom) {
      alert(`Room ${roomCode} not found. Please check the room code and try again.`);
      return;
    }

    // Join the room
    joinRoomStorage(roomCode, userName);

    // Create Room object for the app
    const room: Room = {
      id: storedRoom.id,
      platform: storedRoom.platform,
      url: storedRoom.url,
      hostName: storedRoom.hostName,
      isHost: false,
      localFile: storedRoom.localFile,
    };

    onJoinRoom(room);
  };

  const formatRoomCode = (value: string) => {
    // Remove non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    
    // Add hyphen after ISH if it exists
    if (cleaned.startsWith("ISH") && cleaned.length > 3) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 9)}`;
    }
    
    return cleaned;
  };

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 md:py-20">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white/60 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Guest Session Expired Warning */}
        {!isGuestSessionValid && (
          <Card className="mb-6 bg-red-500/10 border-red-500/50 backdrop-blur-sm p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold text-sm md:text-base">Guest Session Expired</h3>
                <p className="text-red-400/80 text-xs md:text-sm mt-1">
                  Your 90-minute guest session has ended. Please sign up for unlimited access to join rooms!
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="bg-black/40 border-pink-500/20 backdrop-blur-md p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl text-white">Join Watch Party</h2>
            <p className="text-white/60 text-sm md:text-base">Enter the room code to join your friends</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomCode" className="text-white/80">
              Room Code
            </Label>
            <Input
              id="roomCode"
              type="text"
              placeholder="ISH-123456"
              value={roomCode}
              onChange={(e) => setRoomCode(formatRoomCode(e.target.value))}
              maxLength={10}
              className="bg-black/30 border-white/20 text-white placeholder:text-white/40 text-center text-lg md:text-xl tracking-wider h-12 md:h-14"
            />
            <p className="text-xs text-white/40">
              Format: ISH-XXXXXX
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName" className="text-white/80">
              Your Name
            </Label>
            <Input
              id="userName"
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-black/30 border-white/20 text-white placeholder:text-white/40 h-12 md:h-auto"
            />
          </div>

          <Button
            onClick={handleJoin}
            disabled={!roomCode || !userName || roomCode.length < 10 || !isGuestSessionValid}
            className="w-full bg-gradient-to-r from-pink-600 to-green-600 hover:from-pink-500 hover:to-green-500 text-white py-5 md:py-6 h-auto disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <LogIn className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            {!isGuestSessionValid ? 'Guest Session Expired - Sign Up Required' : 'Join Room'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-black px-2 text-white/40">
                Quick Join
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 text-sm">Recent Rooms</Label>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setRoomCode("ISH-123456");
                }}
                className="w-full p-3 md:p-4 rounded-lg bg-black/30 border border-white/10 hover:bg-pink-500/10 hover:border-pink-500/20 transition-all text-left touch-manipulation"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm md:text-base">ISH-123456</span>
                  <span className="text-xs text-white/40">Demo Room</span>
                </div>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}