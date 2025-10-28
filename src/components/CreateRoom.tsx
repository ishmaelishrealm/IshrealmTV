import { useState } from "react";
import { Youtube, Twitch, Upload, ArrowLeft, Copy, Check, FileVideo, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Room } from "../App";
import { useAuth } from "../contexts/AuthContext";
import { createRoom as storeRoom } from "../lib/roomStorage";

interface CreateRoomProps {
  onCreateRoom: (room: Room) => void;
  onBack: () => void;
}

type Platform = "youtube" | "twitch" | "hosted" | "local";

export function CreateRoom({ onCreateRoom, onBack }: CreateRoomProps) {
  const { isGuest, guestSession } = useAuth();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [url, setUrl] = useState("");
  const [hostName, setHostName] = useState("");
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(null);

  // Check if guest session is valid
  const isGuestSessionValid = !isGuest || (guestSession && guestSession.timeRemaining > 0);

  const generateRoomCode = () => {
    return `ISH-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setLocalFile(file);
      // Create a temporary URL for the local file
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);
    }
  };

  const handleCreate = () => {
    if (!platform || !url || !hostName) return;
    
    // STRICT: Block if guest session expired
    if (isGuest && (!guestSession || guestSession.timeRemaining === 0)) {
      alert('Your guest session has expired! Please sign up for unlimited access.');
      return;
    }
    
    const code = generateRoomCode();
    setRoomCode(code);
  };

  const handleJoinCreatedRoom = () => {
    if (!roomCode || !platform || !url) return;
    
    const room: Room = {
      id: roomCode,
      platform,
      url,
      hostName,
      isHost: true,
      localFile: localFile || undefined,
    };
    
    // Store room data for other participants to join
    storeRoom(room);
    
    onCreateRoom(room);
  };

  const copyToClipboard = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (roomCode) {
    return (
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-20">
        <div className="max-w-md mx-auto">
          <Card className="bg-black/40 border-pink-500/20 backdrop-blur-md p-6 md:p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                <Check className="w-6 h-6 md:w-8 md:h-8 text-green-300" />
              </div>
              
              <h2 className="text-xl md:text-2xl text-white">Room Created!</h2>
              
              <div className="space-y-2">
                <p className="text-white/60 text-sm">Share this code with your friends</p>
                
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/30 border border-white/20 rounded-lg px-3 md:px-4 py-3 text-center">
                    <span className="text-lg md:text-2xl tracking-wider text-pink-300">{roomCode}</span>
                  </div>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="border-white/20 hover:border-pink-400/40 bg-white/5 hover:bg-pink-500/10 h-auto"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
                
                <p className="text-xs text-white/40 break-all">
                  or share: {window.location.origin}/join/{roomCode}
                </p>
              </div>
            </div>

            <Button
              onClick={handleJoinCreatedRoom}
              className="w-full bg-gradient-to-r from-pink-600 to-green-600 hover:from-pink-500 hover:to-green-500 text-white py-5 md:py-6 h-auto"
            >
              Enter Watch Party
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 md:py-20">
      <div className="max-w-2xl mx-auto">
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
                  Your 90-minute guest session has ended. Please sign up for unlimited access to create rooms!
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="bg-black/40 border-pink-500/20 backdrop-blur-md p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl text-white">Create Watch Party</h2>
            <p className="text-white/60 text-sm md:text-base">Choose a platform and paste your video URL</p>
          </div>

          {/* Platform Selection - Mobile Optimized */}
          <div className="space-y-3">
            <Label className="text-white/80">Select Platform</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setPlatform("youtube")}
                className={`p-3 md:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                  platform === "youtube"
                    ? "border-red-500 bg-red-500/20"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
              >
                <Youtube className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-red-400" />
                <p className="text-xs md:text-sm text-white">YouTube</p>
              </button>

              <button
                onClick={() => setPlatform("twitch")}
                className={`p-3 md:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                  platform === "twitch"
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
              >
                <Twitch className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-xs md:text-sm text-white">Twitch</p>
              </button>

              <button
                onClick={() => setPlatform("hosted")}
                className={`p-3 md:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                  platform === "hosted"
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
              >
                <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-xs md:text-sm text-white">Hosted</p>
              </button>

              <button
                onClick={() => setPlatform("local")}
                className={`p-3 md:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                  platform === "local"
                    ? "border-pink-500 bg-pink-500/20"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
              >
                <FileVideo className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-pink-400" />
                <p className="text-xs md:text-sm text-white">Local File</p>
              </button>
            </div>
          </div>

          {/* URL Input or File Upload */}
          {platform && platform !== "local" && (
            <div className="space-y-2">
              <Label htmlFor="url" className="text-white/80">
                {platform === "youtube" && "YouTube Video URL"}
                {platform === "twitch" && "Twitch Stream URL"}
                {platform === "hosted" && "Video File URL"}
              </Label>
              <Input
                id="url"
                type="url"
                placeholder={
                  platform === "youtube"
                    ? "https://www.youtube.com/watch?v=..."
                    : platform === "twitch"
                    ? "https://www.twitch.tv/..."
                    : "https://example.com/video.mp4"
                }
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-black/30 border-white/20 text-white placeholder:text-white/40 h-12 md:h-auto"
              />
            </div>
          )}

          {/* Local File Upload */}
          {platform === "local" && (
            <div className="space-y-3">
              <Label htmlFor="file" className="text-white/80">
                Upload MP4 Video File
              </Label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 md:p-8 text-center hover:border-pink-400/40 transition-all">
                <Input
                  id="file"
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label 
                  htmlFor="file" 
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <FileVideo className="w-10 h-10 md:w-12 md:h-12 text-pink-400" />
                  {localFile ? (
                    <div className="space-y-1">
                      <p className="text-white text-sm md:text-base">{localFile.name}</p>
                      <p className="text-white/60 text-xs">
                        {(localFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-white text-sm md:text-base">Click to upload video file</p>
                      <p className="text-white/60 text-xs">MP4, WebM, or OGG</p>
                    </>
                  )}
                </label>
              </div>
              <p className="text-xs text-white/50">
                ⚠️ File will only be available while you're hosting. When you leave, the video will be removed.
              </p>
            </div>
          )}

          {/* Host Name */}
          {platform && url && (
            <div className="space-y-2">
              <Label htmlFor="hostName" className="text-white/80">
                Your Name (Host)
              </Label>
              <Input
                id="hostName"
                type="text"
                placeholder="Enter your name"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="bg-black/30 border-white/20 text-white placeholder:text-white/40 h-12 md:h-auto"
              />
            </div>
          )}

          <Button
            onClick={handleCreate}
            disabled={!platform || !url || !hostName || !isGuestSessionValid}
            className="w-full bg-gradient-to-r from-pink-600 to-green-600 hover:from-pink-500 hover:to-green-500 text-white py-5 md:py-6 h-auto disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            {!isGuestSessionValid ? 'Guest Session Expired - Sign Up Required' : 'Create Room'}
          </Button>
        </Card>
      </div>
    </div>
  );
}