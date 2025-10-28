import { Play, Pause, SkipForward, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { VideoState } from "./WatchParty";
import { useState } from "react";

interface RoomControlsProps {
  videoState: VideoState;
  onStateChange: (state: VideoState) => void;
}

export function RoomControls({ videoState, onStateChange }: RoomControlsProps) {
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);

  const togglePlayPause = () => {
    onStateChange({
      ...videoState,
      playing: !videoState.playing,
    });
  };

  const handleSeek = (value: number[]) => {
    // Only commit the seek when user releases the slider
    onStateChange({
      ...videoState,
      currentTime: value[0],
    });
  };

  const skipForward = () => {
    const newTime = Math.min(videoState.currentTime + 30, videoState.duration);
    onStateChange({
      ...videoState,
      currentTime: newTime,
    });
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="bg-black/40 border-pink-500/20 backdrop-blur-sm p-3 md:p-4">
      <div className="space-y-3 md:space-y-4">
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs md:text-sm min-w-[35px] md:min-w-[40px]">
            {formatTime(videoState.currentTime)}
          </span>
          <Slider
            value={[videoState.currentTime]}
            max={videoState.duration}
            step={1}
            onValueCommit={handleSeek}
            className="flex-1"
          />
          <span className="text-white/60 text-xs md:text-sm min-w-[35px] md:min-w-[40px]">
            {formatTime(videoState.duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={togglePlayPause}
              className="hover:bg-white/10 h-9 w-9 md:h-10 md:w-10 p-0"
            >
              {videoState.playing ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={skipForward}
              className="hover:bg-white/10 h-9 w-9 md:h-10 md:w-10 p-0"
              title="Skip 30 seconds"
            >
              <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
            </Button>

            {/* Volume - Hidden on small mobile, shown on larger screens */}
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleMute}
                className="hover:bg-white/10 h-10 w-10 p-0"
              >
                {muted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <Slider
                value={[muted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={(value: number[]) => setVolume(value[0])}
                className="w-20 md:w-24"
              />
              <span className="text-white/60 text-xs min-w-[35px]">{muted ? 0 : volume}%</span>
            </div>
          </div>

          <div className="px-2 md:px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="hidden sm:inline">Host Controls</span>
            <span className="sm:hidden">Host</span>
          </div>
        </div>

        <div className="text-xs text-white/40 text-center hidden md:block">
          Your playback changes will sync to all viewers in real-time
        </div>
      </div>
    </Card>
  );
}