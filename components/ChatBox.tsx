import { useState, useRef, useEffect } from "react";
import { Send, Heart, Laugh, ThumbsUp, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface ChatBoxProps {
  roomId: string;
}

interface Message {
  id: string;
  userName: string;
  text: string;
  timestamp: Date;
  isSystem?: boolean;
}

interface Reaction {
  id: string;
  icon: React.ReactNode;
  x: number;
  y: number;
}

export function ChatBox({ roomId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      userName: "System",
      text: `Welcome to room ${roomId}!`,
      timestamp: new Date(),
      isSystem: true,
    },
    {
      id: "2",
      userName: "Alex",
      text: "Hey everyone! Ready to watch?",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "3",
      userName: "Jordan",
      text: "Yes! This is going to be awesome 🎉",
      timestamp: new Date(Date.now() - 30000),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userName: "You",
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sendReaction = (icon: React.ReactNode) => {
    const reaction: Reaction = {
      id: Date.now().toString(),
      icon,
      x: Math.random() * 80 + 10,
      y: 100,
    };

    setReactions([...reactions, reaction]);

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
    }, 3000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="bg-black/40 border-pink-500/20 backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
      {/* Floating Reactions */}
      {reactions.map((reaction) => (
        <div
          key={reaction.id}
          className="absolute animate-float-up pointer-events-none z-10"
          style={{
            left: `${reaction.x}%`,
            bottom: `${reaction.y}%`,
          }}
        >
          {reaction.icon}
        </div>
      ))}

      {/* Header */}
      <div className="p-3 md:p-4 border-b border-white/10">
        <h3 className="text-white flex items-center gap-2 text-sm md:text-base">
          <Sparkles className="w-4 h-4 text-pink-300" />
          Chat
        </h3>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3 md:p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${
                message.isSystem
                  ? "text-center"
                  : message.userName === "You"
                  ? "text-right"
                  : "text-left"
              }`}
            >
              {message.isSystem ? (
                <div className="text-xs text-white/40 py-1">{message.text}</div>
              ) : (
                <div
                  className={`inline-block max-w-[85%] md:max-w-[80%] ${
                    message.userName === "You" ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.userName !== "You" && (
                      <>
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-pink-400 to-green-400 flex items-center justify-center text-white text-xs">
                          {message.userName[0]}
                        </div>
                        <span className="text-xs text-white/60">{message.userName}</span>
                      </>
                    )}
                    <span className="text-xs text-white/40">{formatTime(message.timestamp)}</span>
                  </div>
                  <div
                    className={`px-3 py-2 rounded-lg text-sm md:text-base ${
                      message.userName === "You"
                        ? "bg-gradient-to-r from-pink-600 to-green-600 text-white"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Reactions */}
      <div className="p-2 md:p-3 border-t border-white/10 bg-white/5">
        <div className="flex gap-1 md:gap-2 justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => sendReaction(<Heart className="w-5 h-5 md:w-6 md:h-6 text-red-400" />)}
            className="hover:bg-white/10 h-9 w-9 md:h-10 md:w-10 p-0 text-base md:text-lg"
          >
            ❤️
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => sendReaction(<Laugh className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />)}
            className="hover:bg-white/10 h-9 w-9 md:h-10 md:w-10 p-0 text-base md:text-lg"
          >
            😂
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => sendReaction(<ThumbsUp className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />)}
            className="hover:bg-white/10 h-9 w-9 md:h-10 md:w-10 p-0 text-base md:text-lg"
          >
            👍
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => sendReaction(<Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />)}
            className="hover:bg-white/10 h-9 w-9 md:h-10 md:w-10 p-0 text-base md:text-lg"
          >
            ✨
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-white/10 bg-white/5">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="bg-black/30 border-white/20 text-white placeholder:text-white/40 h-10 md:h-auto text-sm md:text-base"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-pink-600 to-green-600 hover:from-pink-500 hover:to-green-500 disabled:opacity-50 h-10 w-10 md:h-auto md:w-auto md:px-4 p-0 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
        }
      `}</style>
    </Card>
  );
}