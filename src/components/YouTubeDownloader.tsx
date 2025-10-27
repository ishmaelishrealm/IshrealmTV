import { useState } from "react";
import { Download, Video, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

interface YouTubeDownloaderProps {
  onBack: () => void;
}

export function YouTubeDownloader({ onBack }: YouTubeDownloaderProps) {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownload = async (quality: string) => {
    if (!url) return;
    
    setIsProcessing(true);
    
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    
    // In a real implementation, this would call a backend API
    alert(`This feature requires backend integration with yt-dlp. Quality: ${quality}\n\nIn production, this would:\n1. Send URL to your server\n2. Use yt-dlp to download the video\n3. Return the file to the user`);
  };

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 text-white/80 hover:text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500/10 border border-pink-500/20 rounded-2xl">
            <Download className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-3xl md:text-4xl bg-gradient-to-r from-pink-400 to-green-400 bg-clip-text text-transparent">
            YouTube Downloader
          </h1>
          <p className="text-white/60">
            Download YouTube videos to watch offline or host in your room
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="bg-pink-500/10 border-pink-500/20 text-white">
          <AlertCircle className="w-4 h-4 text-pink-400" />
          <AlertDescription className="text-white/80">
            This feature requires backend integration with yt-dlp. For production use, implement a secure backend API.
          </AlertDescription>
        </Alert>

        {/* Download Form */}
        <Card className="bg-black/40 border-pink-500/20 backdrop-blur-sm p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-white/90">YouTube Video URL</label>
            <Input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 md:h-14 text-base md:text-lg"
              disabled={isProcessing}
            />
          </div>

          {/* Quality Options */}
          <div className="space-y-3">
            <label className="text-white/90">Select Quality</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={() => handleDownload("720p")}
                disabled={!url || isProcessing}
                className="bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-300 h-12 md:h-14"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Video className="w-4 h-4 mr-2" />
                )}
                720p HD
              </Button>

              <Button
                onClick={() => handleDownload("1080p")}
                disabled={!url || isProcessing}
                className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-300 h-12 md:h-14"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Video className="w-4 h-4 mr-2" />
                )}
                1080p Full HD
              </Button>

              <Button
                onClick={() => handleDownload("4k")}
                disabled={!url || isProcessing}
                className="bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-300 h-12 md:h-14"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Video className="w-4 h-4 mr-2" />
                )}
                4K Ultra HD
              </Button>
            </div>
          </div>

          {/* Implementation Notes */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <h3 className="text-white/90 text-sm">Backend Implementation Guide:</h3>
            <ul className="text-sm text-white/60 space-y-1 list-disc list-inside">
              <li>Install yt-dlp on your server</li>
              <li>Create API endpoint to handle download requests</li>
              <li>Validate YouTube URLs and check for copyright</li>
              <li>Stream the downloaded file to the user</li>
              <li>Implement rate limiting to prevent abuse</li>
            </ul>
          </div>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-black/40 border-green-500/20 backdrop-blur-sm p-6 space-y-2">
            <h3 className="text-white">Offline Viewing</h3>
            <p className="text-white/60 text-sm">
              Download videos to watch later without internet connection
            </p>
          </Card>

          <Card className="bg-black/40 border-pink-500/20 backdrop-blur-sm p-6 space-y-2">
            <h3 className="text-white">Host Locally</h3>
            <p className="text-white/60 text-sm">
              Upload downloaded videos to host in your watch party room
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
