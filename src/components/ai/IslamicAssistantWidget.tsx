import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  X, 
  Send, 
  RefreshCw,
  Heart,
  ArrowRight,
  Bot
} from 'lucide-react';
import { generateIslamicAssistantResponse, ChatMessage } from '@/lib/islamicAiKnowledge';

interface ExtendedChatMessage extends ChatMessage {
  isStreaming?: boolean;
}

const quickPrompts = [
  "🔍 Search Brides (Dulhan)",
  "🔍 Search Grooms (Dulha)",
  "🌸 Walidain ko kaise manayein?",
  "💍 Biwi aur Shohar ke Huqooq",
  "🤲 Salatul Istikhara Dua",
  "⭐ ₹491 Premium Benefits",
  "🚫 Jahez (Dowry) par Hadith",
];

export function IslamicAssistantWidget() {
  const location = useLocation();
  const navigate = useNavigate();

  // ONLY render the AI Assistant on the Home Page ('/')
  if (location.pathname !== '/') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      id: 'welcome-matrimony-1',
      sender: 'assistant',
      text: `**Assalamu Alaikum!** 🌸✨\nWelcome to **Rishta Matrimony AI** 👰🤵\n\nMain aapka Halal Matchmaking Assistant hoon. Main aapke liye verified rishte dhoondhne aur shadi ke deeni masail me madad karne ke liye hazir hoon.\n\n💬 *Bataiye, aaj main aapki kya madad karoon? Kya aap rishta talash kar rahe hain ya apna biodata register karna chahte hain? 😊*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isThinking]);

  // Clean up streaming on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }

    const userMsg: ExtendedChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);
    setIsThinking(true);

    try {
      // Natural thinking delay (350ms - 450ms) to feel like real AI processing
      await new Promise((r) => setTimeout(r, 400));
      
      const response = await generateIslamicAssistantResponse(query.trim());
      setIsThinking(false);

      const botMessageId = `bot-${Date.now()}`;
      const fullText = response.text;
      
      // Initialize streaming message
      const initialBotMsg: ExtendedChatMessage = {
        id: botMessageId,
        sender: 'assistant',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true
      };

      setMessages((prev) => [...prev, initialBotMsg]);

      // Stream text chunk by chunk (typewriter effect)
      let currentIdx = 0;
      const chunkSize = 3; // stream 3 characters per tick for smooth natural typing
      const tickSpeed = 16; // ~60fps smooth pace

      streamingIntervalRef.current = setInterval(() => {
        currentIdx += chunkSize;
        if (currentIdx >= fullText.length) {
          if (streamingIntervalRef.current) {
            clearInterval(streamingIntervalRef.current);
          }
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? {
                    ...msg,
                    text: fullText,
                    isStreaming: false,
                    profileMatches: response.profileMatches,
                  }
                : msg
            )
          );
          setLoading(false);
        } else {
          const displayedText = fullText.slice(0, currentIdx);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, text: displayedText }
                : msg
            )
          );
        }
      }, tickSpeed);

    } catch (err) {
      setIsThinking(false);
      const errorMsg: ExtendedChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: `Assalamu Alaikum. I encountered a momentary connection issue. Please feel free to try again or reach out directly to our team on WhatsApp (+91 9128719875) 🌸\n\n💬 *Kya aap sawaal dobara poochna chahenge?*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }
    setLoading(false);
    setIsThinking(false);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `**Assalamu Alaikum!** 🌸✨\nRishta Matrimony Matchmaker AI ready.\n\n💬 *Bataiye, aaj main aapki kya madad karoon? Kya aap rishta dhoondh rahe hain ya biodata banana chahte hain? 😊*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  // Helper to format text cleanly without markdown clutter
  const renderCleanText = (text: string, isStreaming?: boolean) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Header 3 (###)
          if (trimmed.startsWith('###')) {
            return (
              <div key={idx} className="font-bold text-xs sm:text-sm text-foreground mt-2 mb-1 flex items-center gap-1.5 text-primary border-l-2 border-primary pl-2">
                {trimmed.replace(/^###\s*/, '')}
              </div>
            );
          }

          // Blockquotes (>)
          if (trimmed.startsWith('>')) {
            return (
              <div key={idx} className="border-l-2 border-amber-500/60 bg-amber-500/10 dark:bg-amber-500/5 px-2.5 py-1.5 rounded-r-lg my-1.5 text-[11px] sm:text-xs text-foreground/90 italic">
                {trimmed.replace(/^>\s*/, '')}
              </div>
            );
          }

          // Conversational Follow-up questions (marked with 💬)
          if (trimmed.startsWith('💬')) {
            return (
              <div key={idx} className="mt-2 pt-1.5 border-t border-primary/20 text-xs sm:text-[13px] font-semibold text-primary flex items-start gap-1.5 bg-primary/5 p-2 rounded-xl">
                <span>{trimmed}</span>
              </div>
            );
          }

          // Bullet points (• or * or -)
          if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ')) {
            const cleanItem = trimmed.replace(/^([•\-\*]\s*)/, '');
            return (
              <div key={idx} className="flex items-start gap-1.5 my-0.5 text-xs text-foreground/90">
                <span className="text-primary mt-0.5 text-[10px]">●</span>
                <span>{cleanItem.replace(/\*\*/g, '')}</span>
              </div>
            );
          }

          // Numbered items (1. or 2.)
          if (/^\d+\.\s/.test(trimmed)) {
            return (
              <div key={idx} className="flex items-start gap-1.5 my-1 text-xs text-foreground/90">
                <span className="font-bold text-primary text-[11px] shrink-0">{trimmed.slice(0, 2)}</span>
                <span>{trimmed.slice(3).replace(/\*\*/g, '')}</span>
              </div>
            );
          }

          // Interactive Link Button (e.g. 👉 [Label](url) or [Label](url))
          const linkMatch = trimmed.match(/(?:👉\s*)?\[(.*?)\]\((.*?)\)/);
          if (linkMatch) {
            const [, linkText, linkUrl] = linkMatch;
            const isExternal = linkUrl.startsWith('http') || linkUrl.includes('wa.me');
            
            return (
              <div key={idx} className="my-2">
                {isExternal ? (
                  <a
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
                  >
                    <span>{linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      navigate(linkUrl);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all cursor-pointer group"
                  >
                    <span>{linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            );
          }

          // Regular paragraph
          const cleanLine = trimmed.replace(/\*\*/g, '');
          return (
            <p key={idx} className="text-xs sm:text-[13px] text-foreground/90 leading-relaxed my-0.5">
              {cleanLine}
            </p>
          );
        })}
        {isStreaming && (
          <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-0.5 align-middle rounded-sm" />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50">
        {!isOpen && (
          <>
            {/* Mobile View: Small, round floating button in corner */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="sm:hidden relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#2A0F1A] via-[#3B0E23] to-[#1F0A13] text-pink-100 border border-pink-500/50 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Open Rishta Matrimony AI Matchmaker"
            >
              <div className="relative flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
                <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white dark:border-black"></span>
                </span>
              </div>
            </button>

            {/* Desktop View: Compact pill button with text */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#2A0F1A] via-[#3B0E23] to-[#1F0A13] text-pink-100 border border-pink-500/40 shadow-2xl hover:shadow-pink-950/50 hover:scale-105 transition-all duration-300 active:scale-95"
              aria-label="Open Rishta Matrimony AI Matchmaker"
            >
              <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-300">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-300" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>Rishta AI Matchmaker</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </span>
              </div>
            </button>
          </>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 w-[calc(100vw-24px)] sm:w-[420px] md:w-[440px] h-[520px] sm:h-[570px] max-h-[82vh] bg-card rounded-3xl sm:rounded-2xl border border-pink-900/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2A0F1A] via-[#1F0A13] to-[#16060D] text-white p-3 sm:p-3.5 border-b border-pink-900/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-950/80 border border-pink-700/40 flex items-center justify-center text-pink-300 shadow-inner">
                <Heart className="w-3.5 h-3.5 text-primary fill-primary/30" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-[11px] text-pink-300">﷽</span>
                  <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-tight">
                    Rishta Matchmaker AI
                  </h3>
                </div>
                <p className="text-[10px] text-pink-300/80 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Interactive Matchmaking Assistant</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleResetChat}
                className="h-7 w-7 p-0 text-pink-300/70 hover:text-white hover:bg-pink-950/50 rounded-lg"
                title="Restart Chat"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 p-0 text-pink-300/70 hover:text-white hover:bg-pink-950/50 rounded-lg"
                title="Close Window"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-muted/30 border-b border-border/50 px-2.5 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-[10px] sm:text-[11px] whitespace-nowrap px-2 py-0.5 rounded-full bg-background hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition-all duration-200 active:scale-95 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-3 bg-muted/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-3 text-xs sm:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none shadow-sm font-medium'
                      : 'bg-card border border-border/80 text-foreground rounded-bl-none shadow-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div>
                    {renderCleanText(msg.text, msg.isStreaming)}
                  </div>

                  {/* Profile Match Cards (Interactive Proposal Cards) */}
                  {!msg.isStreaming && msg.profileMatches && msg.profileMatches.length > 0 && (
                    <div className="mt-2.5 space-y-2 pt-2 border-t border-border/40 animate-in fade-in duration-300">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Matching Verified Proposals:
                      </p>
                      {msg.profileMatches.map((profile) => (
                        <div
                          key={profile.id}
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/profiles?id=${profile.id}&gender=${profile.gender}`);
                          }}
                          className="p-2.5 rounded-xl bg-muted/40 border border-border/60 hover:border-primary/50 hover:bg-muted/70 transition-all cursor-pointer flex flex-col gap-1.5 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">{profile.name}</span>
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                                  {profile.gender === 'Female' ? '👰 Bride' : '🤵 Groom'}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {profile.age} Yrs • {profile.city} • {profile.maslak || 'Sunni'}
                              </p>
                              <p className="text-[10px] text-foreground/80 font-medium">
                                {profile.education} • {profile.profession}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="h-6.5 w-full text-[11px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center justify-center gap-1 font-semibold pointer-events-none"
                          >
                            <span>Open Profile on Page</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground mt-0.5 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Thinking / Typing Animation Indicator */}
            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border/80 px-3 py-2 rounded-2xl rounded-bl-none shadow-xs w-fit animate-in fade-in duration-200">
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                </span>
                <span className="text-[10px] text-primary/80 font-medium ml-1">
                  Rishta AI typing response... ✍️
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <div className="p-2.5 bg-card border-t border-border/60 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question or search..."
                className="h-9 text-xs bg-muted/40 rounded-xl focus-visible:ring-primary/40"
                disabled={loading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || loading}
                className="h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shrink-0 font-medium"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
            <p className="text-[9px] text-center text-muted-foreground/80 mt-1">
              Quran & Sahih Hadith (Bukhari & Muslim) • 100% Halal AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
