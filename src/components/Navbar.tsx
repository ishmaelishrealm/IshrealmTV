import { Tv2, Home, LogOut, User, Download, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { View } from "../App";
import { useState } from "react";

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  inRoom: boolean;
  onLeaveRoom: () => void;
}

export function Navbar({ currentView, setCurrentView, inRoom, onLeaveRoom }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-10 border-b border-white/10 bg-black backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Mobile Optimized */}
          <button 
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Tv2 className="w-6 h-6 md:w-8 md:h-8 text-pink-400" />
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl tracking-wider bg-gradient-to-r from-pink-400 to-green-400 bg-clip-text text-transparent">
                ISHREALM TV
              </span>
              <span className="text-[8px] md:text-[10px] text-white/40 tracking-widest -mt-1">BY SONOAAC</span>
            </div>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {!inRoom && currentView !== "home" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("home")}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            )}
            
            {inRoom && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLeaveRoom}
                className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Room
              </Button>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 w-9 h-9 p-0 rounded-full"
                >
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/95 border-white/20 text-white backdrop-blur-xl">
                <DropdownMenuItem 
                  onClick={() => setCurrentView("downloader")}
                  className="cursor-pointer hover:bg-pink-500/20 focus:bg-pink-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  YouTube Downloader
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {inRoom && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLeaveRoom}
                className="text-red-300 hover:text-red-200 hover:bg-red-500/20 h-9 px-3"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white/80 hover:text-white hover:bg-white/10 w-9 h-9 p-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-2 border-t border-white/10 mt-3">
            {!inRoom && currentView !== "home" && (
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentView("home");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 h-12"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={() => {
                setCurrentView("downloader");
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 h-12"
            >
              <Download className="w-4 h-4 mr-2" />
              YouTube Downloader
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}