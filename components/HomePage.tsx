import { Plus, Users, Sparkles, Monitor, Smartphone, Tablet, Laptop } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { View } from "../App";

interface HomePageProps {
  setCurrentView: (view: View) => void;
}

export function HomePage({ setCurrentView }: HomePageProps) {
  return (
    <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
        {/* Hero Section */}
        <div className="space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-pink-500/10 border border-pink-400/20 rounded-full backdrop-blur-sm">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-pink-400" />
            <span className="text-xs md:text-sm text-pink-200/80">Stream Anything. Watch Together.</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight bg-gradient-to-r from-white via-pink-200 to-green-200 bg-clip-text text-transparent px-4">
            WATCH TOGETHER
          </h1>

          {/* Platform Icons */}
          <div className="flex items-center justify-center gap-4 md:gap-8 pt-4 pb-2">
            {/* Mac */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:border-pink-400/40 group-hover:bg-pink-500/10 transition-all">
                <Laptop className="w-6 h-6 md:w-8 md:h-8 text-white/70 group-hover:text-pink-300 transition-colors" />
              </div>
              <span className="text-xs md:text-sm text-white/60 flex items-center gap-1">
                <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
                Mac
              </span>
            </div>

            {/* iPhone */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:border-pink-400/40 group-hover:bg-pink-500/10 transition-all">
                <Smartphone className="w-6 h-6 md:w-8 md:h-8 text-white/70 group-hover:text-pink-300 transition-colors" />
              </div>
              <span className="text-xs md:text-sm text-white/60 flex items-center gap-1">
                <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
                iPhone
              </span>
            </div>

            {/* Android */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:border-green-400/40 group-hover:bg-green-500/10 transition-all">
                <Tablet className="w-6 h-6 md:w-8 md:h-8 text-white/70 group-hover:text-green-300 transition-colors" />
              </div>
              <span className="text-xs md:text-sm text-white/60 flex items-center gap-1">
                <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 9.48L18.63 8.48C18.78 8.33 18.78 8.1 18.63 7.95C18.5 7.8 18.25 7.8 18.1 7.95L17.05 9C16.3 8.66 15.45 8.47 14.55 8.47C13.65 8.47 12.8 8.66 12.05 9L11 7.95C10.85 7.8 10.6 7.8 10.47 7.95C10.32 8.1 10.32 8.33 10.47 8.48L11.5 9.48C9.69997 10.68 8.49997 12.65 8.49997 14.91H20.5C20.5 12.65 19.3 10.68 17.6 9.48ZM11 13.5H10V12.5H11V13.5ZM15 13.5H14V12.5H15V13.5ZM6.99997 10C5.89997 10 4.99997 10.9 4.99997 12V17C4.99997 18.1 5.89997 19 6.99997 19C8.09997 19 8.99997 18.1 8.99997 17V12C8.99997 10.9 8.09997 10 6.99997 10ZM18 10C16.9 10 16 10.9 16 12V17C16 18.1 16.9 19 18 19C19.1 19 20 18.1 20 17V12C20 10.9 19.1 10 18 10Z"/>
                </svg>
                Android
              </span>
            </div>

            {/* Windows */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:border-green-400/40 group-hover:bg-green-500/10 transition-all">
                <Monitor className="w-6 h-6 md:w-8 md:h-8 text-white/70 group-hover:text-green-300 transition-colors" />
              </div>
              <span className="text-xs md:text-sm text-white/60 flex items-center gap-1">
                <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 5.45V11.45H10.45V3L3 5.45ZM3 12.55V18.55L10.45 21V12.55H3ZM11.55 2.72V11.45H21V3.27L11.55 2.72ZM21 12.55H11.55V21.28L21 20.73V12.55Z"/>
                </svg>
                Windows
              </span>
            </div>
          </div>
          
          <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto px-4">
            Create instant watch parties with friends. Sync YouTube, Twitch, and more. 
            Join as a guest or create an account for unlimited hosting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-4 md:pt-8 px-4">
          <Button
            size="lg"
            onClick={() => setCurrentView("create")}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-green-600 hover:from-pink-500 hover:to-green-500 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all touch-manipulation"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Create Room
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => setCurrentView("join")}
            className="w-full sm:w-auto border-2 border-white/20 hover:border-pink-400/40 bg-white/5 hover:bg-pink-500/10 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-xl backdrop-blur-sm transition-all touch-manipulation"
          >
            <Users className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Join Room
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 pt-8 md:pt-16 px-4">
          <Card className="bg-black/40 border-pink-500/20 backdrop-blur-sm p-5 md:p-6 space-y-3 hover:border-pink-500/40 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500/10 rounded-lg flex items-center justify-center border border-pink-500/20">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
            </div>
            <h3 className="text-white">Instant Sync</h3>
            <p className="text-white/60 text-sm">
              Real-time playback sync. Everyone watches at the exact same moment.
            </p>
          </Card>
          
          <Card className="bg-black/40 border-green-500/20 backdrop-blur-sm p-5 md:p-6 space-y-3 hover:border-green-500/40 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
            </div>
            <h3 className="text-white">Guest Mode</h3>
            <p className="text-white/60 text-sm">
              Join instantly as a guest with 90 minutes free per day. No account needed.
            </p>
          </Card>
          
          <Card className="bg-black/40 border-pink-500/20 backdrop-blur-sm p-5 md:p-6 space-y-3 hover:border-pink-500/40 transition-all md:col-span-1 col-span-1">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500/10 rounded-lg flex items-center justify-center border border-pink-500/20">
              <Plus className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
            </div>
            <h3 className="text-white">Multiple Platforms</h3>
            <p className="text-white/60 text-sm">
              YouTube, Twitch, and more. Watch content from your favorite platforms.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}