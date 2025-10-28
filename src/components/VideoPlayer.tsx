import { useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Room } from "../App";
import { VideoState } from "./WatchParty";
import { Play, Pause, Volume2 } from "lucide-react";

interface VideoPlayerProps {
  room: Room;
  videoState: VideoState;
  onStateChange: (state: VideoState) => void;
  isHost: boolean;
}

export function VideoPlayer({ room, videoState, onStateChange, isHost }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (videoState.playing) {
        videoRef.current.play().catch(e => console.log('Play error:', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [videoState.playing]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoState.playbackSpeed;
    }
  }, [videoState.playbackSpeed]);

  // Sync video time with tolerance (for guests)
  useEffect(() => {
    if (!videoRef.current || isHost) return;
    
    const currentTime = videoRef.current.currentTime;
    const targetTime = videoState.currentTime;
    const timeDiff = Math.abs(currentTime - targetTime);
    
    // Only sync if difference is more than 2 seconds (prevents stuttering)
    if (timeDiff > 2) {
      videoRef.current.currentTime = targetTime;
    }
  }, [videoState.currentTime, isHost]);

  const getEmbedUrl = () => {
    if (room.platform === "youtube") {
      const videoId = room.url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=${isHost ? 1 : 0}`;
    } else if (room.platform === "twitch") {
      const channel = room.url.split("twitch.tv/")[1];
      return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
    }
    return room.url;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onStateChange({
        ...videoState,
        currentTime: videoRef.current.currentTime,
      });
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      onStateChange({
        ...videoState,
        duration: videoRef.current.duration,
      });
    }
  };

  return (
    <Card className="bg-black border-pink-500/20 overflow-hidden">
      <div className="aspect-video bg-black relative">
        {room.platform === "youtube" || room.platform === "twitch" ? (
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={room.url}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            controls={isHost}
          />
        )}

        {/* Sync Indicator */}
        {!isHost && (
          <div className="absolute top-2 md:top-4 left-2 md:left-4 px-2 md:px-3 py-1 bg-pink-500/80 backdrop-blur-sm rounded-full flex items-center gap-2 text-xs md:text-sm text-white">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="hidden sm:inline">Synced with host</span>
            <span className="sm:hidden">Synced</span>
          </div>
        )}

        {/* Host Indicator */}
        {isHost && (
          <div className="absolute top-2 md:top-4 left-2 md:left-4 px-2 md:px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full flex items-center gap-2 text-xs md:text-sm text-white">
            <Volume2 className="w-3 h-3" />
            <span className="hidden sm:inline">You're controlling playback</span>
            <span className="sm:hidden">Host</span>
            {room.platform === "local" && (
              <span className="ml-1 text-yellow-200">⚠️</span>
            )}
          </div>
        )}

        {/* Simple overlay controls for demo */}
        {!videoState.playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              {videoState.playing ? (
                <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" />
              ) : (
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-3 md:p-4 bg-white/5 border-t border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-white mb-1 text-sm md:text-base">
              {room.platform === "youtube"
                ? "YouTube Video"
                : room.platform === "twitch"
                ? "Twitch Stream"
                : room.platform === "local"
                ? room.localFile?.name || "Local Video"
                : "Video"}
            </h3>
            <p className="text-white/60 text-xs md:text-sm truncate">
              {room.platform === "local" 
                ? `${((room.localFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB` 
                : room.url}
            </p>
            {room.platform === "local" && isHost && (
              <p className="text-yellow-400 text-xs mt-1">
                ⚠️ Local file will be removed when you leave
              </p>
            )}
          </div>
          <div className="px-2 md:px-3 py-1 bg-pink-500/20 rounded-full text-xs text-pink-300 shrink-0">
            {room.platform}
          </div>
        </div>
      </div>
    </Card>
  );
}