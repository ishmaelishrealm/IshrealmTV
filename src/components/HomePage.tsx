import { useState, useEffect } from "react";
import { Plus, Users, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { View } from "../App";

interface HomePageProps {
  setCurrentView: (view: View) => void;
}

const rotatingWords = ["Romance", "Friendly", "Family"];

export function HomePage({ setCurrentView }: HomePageProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-6xl mx-auto text-center space-y-8 md:space-y-12">
        {/* Cinematic Hero Section */}
        <div className="space-y-6 md:space-y-8">
          {/* Main Heading with Rotating Text */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight px-4">
              <span className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
                Movie Night
              </span>
            </h1>
            
            {/* Rotating Text */}
            <div className="h-20 md:h-24 flex items-center justify-center overflow-hidden">
              <h2 
                className={`text-4xl md:text-6xl lg:text-7xl font-bold transition-all duration-500 ${
                  isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                }`}
              >
                <span className={`${
                  currentWordIndex === 0 ? 'bg-gradient-to-r from-red-400 via-pink-400 to-rose-400' :
                  currentWordIndex === 1 ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400' :
                  'bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400'
                } bg-clip-text text-transparent`}>
                  {rotatingWords[currentWordIndex]}
                </span>
              </h2>
            </div>

            <p className="text-xl md:text-2xl text-white/80 font-light">
              Watch Together, Anytime, Anywhere
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
          <Button
            size="lg"
            onClick={() => setCurrentView("create")}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:via-rose-500 hover:to-red-500 text-white px-8 md:px-12 py-6 md:py-7 text-lg md:text-xl font-semibold rounded-2xl shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 hover:scale-105 transition-all duration-300 touch-manipulation"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            Start Watching
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => setCurrentView("join")}
            className="w-full sm:w-auto border-2 border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20 text-white px-8 md:px-12 py-6 md:py-7 text-lg md:text-xl font-semibold rounded-2xl backdrop-blur-md hover:scale-105 transition-all duration-300 touch-manipulation"
          >
            <Users className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            Join Party
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