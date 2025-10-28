import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, RotateCcw, Gauge } from "lucide-react";
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
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const togglePlayPause = () => {
    onStateChange({
      ...videoState,
      playing: !videoState.playing,
    });
  };

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreview, setSeekPreview] = useState(0);

  const handleSeekChange = (value: number[]) => {
    // Preview while dragging
    setIsSeeking(true);
    setSeekPreview(value[0]);
  };

  const handleSeekCommit = (value: number[]) => {
    // Commit when user releases the slider
    setIsSeeking(false);
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

  const skipBackward = () => {
    const newTime = Math.max(videoState.currentTime - 10, 0);
    onStateChange({
      ...videoState,
      currentTime: newTime,
    });
  };

  const restartVideo = () => {
    onStateChange({
      ...videoState,
      currentTime: 0,
      playing: false,
    });
  };

  const changePlaybackSpeed = (speed: number) => {
    onStateChange({
      ...videoState,
      playbackSpeed: speed,
    });
    setShowSpeedMenu(false);
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
            {formatTime(isSeeking ? seekPreview : videoState.currentTime)}
          </span>
          <Slider
            value={[isSeeking ? seekPreview : videoState.currentTime]}
            max={videoState.duration}
            step={0.1}
            onValueChange={handleSeekChange}
            onValueCommit={handleSeekCommit}
            className="flex-1"
          />
          <span className="text-white/60 text-xs md:text-sm min-w-[35px] md:min-w-[40px]">
            {formatTime(videoState.duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
            {/* Restart Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={restartVideo}
              className="hover:bg-white/10 h-9 w-9 md:h-10 md:w-10 p-0"
              title="Restart video"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
            </Button>

            {/* Rewind 10s */}
            <Button
              size="sm"
              variant="ghost"
              onClick={skipBackward}
              className="hover:bg-white/10 h-9 w-9 md:h-10 md:w-10 p-0"
              title="Rewind 10 seconds"
            >
              <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
            </Button>

            {/* Play/Pause */}
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

            {/* Skip Forward 30s */}
            <Button
              size="sm"
              variant="ghost"
              onClick={skipForward}
              className="hover:bg-white/10 h-9 w-9 md:h-10 md:w-10 p-0"
              title="Skip 30 seconds"
            >
              <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
            </Button>

            {/* Playback Speed */}
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="hover:bg-white/10 h-9 px-2 md:h-10 md:px-3"
                title="Playback speed"
              >
                <Gauge className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                <span className="text-xs">{videoState.playbackSpeed}x</span>
              </Button>
              
              {showSpeedMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-black/95 border border-white/20 rounded-lg p-2 backdrop-blur-xl z-50">
                  <div className="flex flex-col gap-1 min-w-[80px]">
                    {playbackSpeeds.map((speed) => (
                      <Button
                        key={speed}
                        size="sm"
                        variant="ghost"
                        onClick={() => changePlaybackSpeed(speed)}
                        className={`hover:bg-white/10 text-xs justify-start ${
                          videoState.playbackSpeed === speed ? 'bg-pink-500/20 text-pink-300' : 'text-white'
                        }`}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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