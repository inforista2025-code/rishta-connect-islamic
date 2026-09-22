import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  X, 
  Send, 
  MessageCircle, 
  BookOpen, 
  ShieldCheck, 
  Star, 
  User, 
  ExternalLink, 
  RefreshCw,
  ChevronDown,
  Lock,
  Heart
} from 'lucide-react';
import { generateIslamicAssistantResponse, ChatMessage } from '@/lib/islamicAiKnowledge';

const quickPrompts = [
  "🤲 Istikhara ka tarika aur dua kya hai?",
  "💍 Mehr (हक़-मेहर) ke Islamic ahkaam kya hain?",
  "👰 Deendar Rishta (Righteous Spouse) chunne ke usool?",
  "🔍 Delhi / Bihar / Mumbai me verified profiles dikhao",
  "🔒 Contact number aur Photos kaise unlock karein?",
  "⭐ ₹491 Premium Membership ke kya fayde hain?",
];

export function IslamicAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**\n\nAssalamu Alaikum! Welcome to **Rishta Matrimony AI Assistant** 🕌\n\nI am trained on authentic **Quranic verses** and **Sahih Hadiths (Bukhari & Muslim)** to guide you in finding a righteous life partner in accordance with the Sunnah.\n\nYou can ask me about:\n• 🤲 **Istikhara & Marriage Duas**\n• 💍 **Mehr & Islamic Marriage Principles**\n• 🔍 **Searching verified Brides & Grooms**\n• 💎 **Unlocking contact numbers with ₹491 Premium**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionLinks: [
        { label: '🔍 Browse Profiles', url: '/profiles', variant: 'outline' },
        { label: '💎 Premium Plan (₹491)', url: '/pricing', variant: 'default' },
        { label: '📝 Free Registration', url: '/register', variant: 'outline' }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await generateIslamicAssistantResponse(query.trim());
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLinks: response.actionLinks,
        profileMatches: response.profileMatches,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**\n\nAssalamu Alaikum. I encountered a momentary hiccup. Please try again or connect directly with our official support on WhatsApp (+91 9128719875).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLinks: [
          { label: '💬 WhatsApp Support', url: 'https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20need%20assistance.', isExternal: true, variant: 'whatsapp' }
        ]
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**\n\nChat restarted! How can I guide you today regarding Islamic marriage, authentic Hadith references, or finding your righteous partner?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLinks: [
          { label: '🔍 Browse Profiles', url: '/profiles', variant: 'outline' },
          { label: '💎 Premium Plan (₹491)', url: '/pricing', variant: 'default' }
        ]
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#3B0E23] via-[#4A152D] to-[#1F0A13] text-pink-100 border border-pink-500/40 shadow-2xl hover:shadow-pink-950/50 hover:scale-105 transition-all duration-300 active:scale-95"
            aria-label="Open Islamic AI Assistant"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-pink-500/20 text-pink-300">
              <Sparkles className="w-4 h-4 animate-pulse text-pink-300" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-white tracking-tight flex items-center gap-1">
                <span>Islamic AI Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </span>
              <span className="block text-[10px] text-pink-300/80 font-serif">
                ﷽ Quran & Sunnah Guide
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Expandable Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] md:w-[460px] h-[580px] sm:h-[620px] max-h-[88vh] bg-card/95 backdrop-blur-md rounded-2xl border border-pink-900/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2A0F1A] via-[#1F0A13] to-[#16060D] text-white p-3.5 sm:p-4 border-b border-pink-900/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-950/80 border border-pink-700/40 flex items-center justify-center text-pink-300">
                <Sparkles className="w-5 h-5 text-pink-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-xs text-pink-300">﷽</span>
                  <h3 className="font-extrabold text-sm text-white tracking-tight">
                    Islamic Marriage Assistant
                  </h3>
                </div>
                <p className="text-[11px] text-pink-300/80 font-medium">
                  Verified Quran & Sahih Hadith (Bukhari/Muslim)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleResetChat}
                className="h-8 w-8 p-0 text-pink-300/70 hover:text-white hover:bg-pink-950/50 rounded-lg"
                title="Reset Chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-pink-300/70 hover:text-white hover:bg-pink-950/50 rounded-lg"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-muted/40 border-b border-border/50 px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-background/80 hover:bg-primary/10 hover:text-primary border border-border/60 text-muted-foreground transition-all duration-200 active:scale-95 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-background/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none shadow-sm'
                      : 'bg-card border border-border/80 text-foreground rounded-bl-none shadow-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text.split('\n').map((line, i) => {
                      // Quran/Arabic/Hadith callout styling
                      if (line.startsWith('```arabic')) return null;
                      if (line === '```') return null;
                      
                      return (
                        <p key={i} className={line.startsWith('**بِسْمِ') ? 'font-serif text-center text-sm font-bold text-primary mb-1' : 'mb-1'}>
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  {/* Profile Match Cards (if any) */}
                  {msg.profileMatches && msg.profileMatches.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-border/40">
                      {msg.profileMatches.map((profile) => (
                        <div
                          key={profile.id}
                          className="p-2.5 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5 text-xs">
                            <p className="font-bold text-foreground flex items-center gap-1">
                              <span>{profile.name}</span>
                              <span className="text-[10px] text-muted-foreground">({profile.age} Yrs, {profile.city})</span>
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {profile.education} • {profile.profession}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[11px] shrink-0"
                            onClick={() => {
                              setIsOpen(false);
                              navigate(`/profiles`);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Link Buttons */}
                  {msg.actionLinks && msg.actionLinks.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-border/40 flex flex-wrap gap-1.5">
                      {msg.actionLinks.map((link, lIdx) => (
                        link.isExternal ? (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              link.variant === 'whatsapp'
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            }`}
                          >
                            {link.variant === 'whatsapp' && <MessageCircle className="w-3 h-3" />}
                            <span>{link.label}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <Link
                            key={lIdx}
                            to={link.url}
                            onClick={() => setIsOpen(false)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              link.variant === 'default'
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'bg-muted hover:bg-primary/10 text-foreground hover:text-primary border border-border'
                            }`}
                          >
                            {link.variant === 'default' && <Star className="w-3 h-3 text-amber-300" />}
                            <span>{link.label}</span>
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border rounded-2xl p-3 max-w-[70%] rounded-bl-none">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                <span>Searching Quran & Sunnah sources...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-card border-t border-border shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="Ask about Istikhara, Mehr, Profiles, or ₹491 Plan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="h-10 text-xs sm:text-sm bg-muted/40 rounded-xl"
              />
              <Button
                type="submit"
                disabled={!input.trim() || loading}
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-[10px] text-center text-muted-foreground mt-1.5">
              Guidance referenced from Quran & Sahihayn. For legal fatwas, consult local Ulama.
            </p>
          </div>

        </div>
      )}
    </>
  );
}
