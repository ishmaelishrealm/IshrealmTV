import { AlertTriangle, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

export function SessionExpiredModal({ 
  isOpen, 
  onClose, 
  message,
  title = "Session Expired" 
}: SessionExpiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="bg-gradient-to-br from-black via-red-950/50 to-black border-red-500/50 max-w-md w-full p-6 md:p-8 shadow-2xl shadow-red-500/20 animate-in zoom-in-95 duration-300">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/50 animate-pulse">
            <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {title}
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white py-6 h-auto text-base font-semibold"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Got It
          </Button>
          
          <p className="text-xs text-white/50 text-center">
            Sign up for unlimited access!
          </p>
        </div>
      </Card>
    </div>
  );
}

