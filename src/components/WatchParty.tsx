import { useState, useEffect } from "react";
import { Copy, Users, Crown, Check, UserX, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Room } from "../App";
import { VideoPlayer } from "./VideoPlayer";
import { ChatBox } from "./ChatBox";
import { RoomControls } from "./RoomControls";
import { useAuth } from "../contexts/AuthContext";
import { 
  updateVideoState as updateVideoStateStorage, 
  getParticipants,
  subscribeToRoom,
  leaveRoom as leaveRoomStorage,
  kickParticipant as kickParticipantStorage
} from "../lib/roomStorage";

interface WatchPartyProps {
  room: Room;
  onLeaveRoom: () => void;
}

export interface VideoState {
  playing: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
}

export function WatchParty({ room, onLeaveRoom }: WatchPartyProps) {
  const { isGuest, guestSession } = useAuth();
  const [videoState, setVideoState] = useState<VideoState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    playbackSpeed: 1,
  });
  const [copied, setCopied] = useState(false);
  const [participants, setParticipants] = useState<Array<{
    id: string;
    name: string;
    isHost: boolean;
  }>>([]);
  const [showGuestWarning, setShowGuestWarning] = useState(false);

  // Handle video state changes (host only)
  const handleVideoStateChange = (newState: VideoState) => {
    setVideoState(newState);
    
    // Only host can update video state
    if (room.isHost) {
      updateVideoStateStorage(room.id, newState);
    }
  };

  const handleKickParticipant = (participantId: string, participantName: string) => {
    if (!room.isHost) return;
    
    kickParticipantStorage(room.id, participantName);
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  };

  // Clean up when leaving
  const handleLeave = () => {
    const userName = room.isHost ? room.hostName : 'Guest';
    leaveRoomStorage(room.id, userName);
    onLeaveRoom();
  };

  // Guest session expiry check - STRICT ENFORCEMENT
  useEffect(() => {
    if (!isGuest || !guestSession) return;

    // Show warning when 5 minutes remaining
    if (guestSession.timeRemaining <= 5 * 60 * 1000 && guestSession.timeRemaining > 0) {
      setShowGuestWarning(true);
    }

    // Force kick when session expires
    if (guestSession.timeRemaining === 0) {
      alert('Your 90-minute guest session has expired. Please sign up for unlimited access!');
      onLeaveRoom();
    }
  }, [isGuest, guestSession, onLeaveRoom]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Subscribe to room changes for real-time sync
  useEffect(() => {
    const unsubscribe = subscribeToRoom(room.id, (updatedRoom) => {
      if (!updatedRoom) {
        // Room was deleted
        handleLeave();
        return;
      }

      // Update participants
      const participantList = updatedRoom.participants.map(p => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
      }));
      setParticipants(participantList);

      // Sync video state (guests only - host controls it)
      if (!room.isHost && updatedRoom.videoState) {
        setVideoState({
          playing: updatedRoom.videoState.playing,
          currentTime: updatedRoom.videoState.currentTime,
          duration: updatedRoom.videoState.duration,
          playbackSpeed: updatedRoom.videoState.playbackSpeed,
        });
      }
    });

    // Load initial participants
    const initialParticipants = getParticipants(room.id);
    setParticipants(initialParticipants.map(p => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
    })));

    return () => {
      unsubscribe();
    };
  }, [room.id, room.isHost]);

  return (
    <div className="relative z-10 min-h-[calc(100vh-73px)] p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Guest Session Warning - 5 Minutes Remaining */}
        {showGuestWarning && isGuest && guestSession && (
          <Card className="mb-3 md:mb-4 bg-yellow-500/10 border-yellow-500/50 backdrop-blur-sm p-3 md:p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-yellow-400 font-semibold text-sm md:text-base">Guest Session Expiring Soon!</h3>
                <p className="text-yellow-400/80 text-xs md:text-sm mt-1">
                  You have {Math.ceil(guestSession.timeRemaining / 60000)} minutes left. 
                  Sign up now for unlimited access and to save your progress!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Room Header - Mobile Optimized */}
        <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full sm:w-auto">
            <Card className="bg-black/40 border-pink-500/20 backdrop-blur-sm px-3 md:px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-xs md:text-sm">Room:</span>
                <span className="text-pink-300 tracking-wider text-xs md:text-base">{room.id}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyRoomCode}
                  className="h-6 w-6 p-0 hover:bg-white/10"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </Card>

            <Card className="bg-black/40 border-green-500/20 backdrop-blur-sm px-3 md:px-4 py-2">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 md:w-4 md:h-4 text-green-300" />
                <span className="text-white text-xs md:text-sm">{participants.length} watching</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content - Stack on Mobile, Side-by-side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-3 md:gap-4">
          {/* Video Section */}
          <div className="space-y-3 md:space-y-4">
            <VideoPlayer
              room={room}
              videoState={videoState}
              onStateChange={handleVideoStateChange}
              isHost={room.isHost}
            />

            {room.isHost && (
              <RoomControls videoState={videoState} onStateChange={handleVideoStateChange} />
            )}

            {/* Participants - Hide on mobile, show on desktop */}
            <Card className="hidden lg:block bg-black/40 border-pink-500/20 backdrop-blur-sm p-4">
              <h3 className="text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants ({participants.length})
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-green-400 flex items-center justify-center text-white text-sm">
                      {participant.name[0]}
                    </div>
                    <span className="text-white flex-1">{participant.name}</span>
                    {participant.isHost ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded text-xs text-yellow-300">
                        <Crown className="w-3 h-3" />
                        Host
                      </div>
                    ) : room.isHost ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleKickParticipant(participant.id, participant.name)}
                        className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-300"
                        title={`Kick ${participant.name}`}
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Section - Full height on mobile */}
          <div className="lg:sticky lg:top-4 lg:self-start h-[400px] lg:h-auto">
            <ChatBox roomId={room.id} />
          </div>

          {/* Participants on Mobile - Below chat */}
          <Card className="lg:hidden bg-black/40 border-pink-500/20 backdrop-blur-sm p-4">
            <h3 className="text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Participants ({participants.length})
            </h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-green-400 flex items-center justify-center text-white text-sm">
                    {participant.name[0]}
                  </div>
                  <span className="text-white flex-1 text-sm">{participant.name}</span>
                  {participant.isHost ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded text-xs text-yellow-300">
                      <Crown className="w-3 h-3" />
                      Host
                    </div>
                  ) : room.isHost ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleKickParticipant(participant.id, participant.name)}
                      className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-300"
                      title={`Kick ${participant.name}`}
                    >
                      <UserX className="w-4 h-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}