import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  X, 
  Send, 
  MessageCircle, 
  Star, 
  User, 
  ExternalLink, 
  RefreshCw,
  Search,
  CheckCircle2,
  Heart,
  ArrowRight
} from 'lucide-react';
import { generateIslamicAssistantResponse, ChatMessage } from '@/lib/islamicAiKnowledge';

const quickPrompts = [
  "🔍 Search verified Brides (Dulhan)",
  "🔍 Search verified Grooms (Dulha)",
  "🔒 How to unlock contact numbers & photos?",
  "⭐ What are ₹491 Premium Plan benefits?",
  "🤲 Salatul Istikhara method & Dua",
  "💍 Sunnah of Mehr (Dower) in Islam",
];

export function IslamicAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-matrimony-1',
      sender: 'assistant',
      text: `**Assalamu Alaikum! Welcome to Rishta Matrimony AI Matchmaker** 👰🤵\n\nI am your dedicated Matrimonial AI Assistant, trained on authentic **Quran & Sahih Hadith (Bukhari & Muslim)** to help you find a righteous Muslim life partner with complete privacy.\n\n### How I can assist you today:\n• **Find Compatible Matches:** Search verified brides & grooms by city & maslak.\n• **Unlock Direct Contacts:** Learn about our ₹491 (2 Months) Premium Membership.\n• **Islamic Guidance:** Istikhara Dua, Mehr rules, and Sunnah of Nikah.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionLinks: [
        { label: '🔍 Browse Verified Profiles', url: '/profiles', variant: 'default' },
        { label: '⭐ Premium Membership (₹491)', url: '/pricing', variant: 'outline' },
        { label: '📝 Free Registration', url: '/register', variant: 'outline' }
      ]
    }
  ]);

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
        text: `Assalamu Alaikum. I encountered a momentary issue. Please try again or chat with our matchmaking team directly on WhatsApp (+91 9128719875).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLinks: [
          { label: '💬 Official WhatsApp Support', url: 'https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20need%20assistance.', isExternal: true, variant: 'whatsapp' }
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
        text: `**Assalamu Alaikum! Rishta Matrimony Matchmaker AI ready.**\n\nHow can I help you find your righteous life partner or answer your matrimonial questions today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLinks: [
          { label: '🔍 Browse Profiles', url: '/profiles', variant: 'default' },
          { label: '⭐ Premium Plan (₹491)', url: '/pricing', variant: 'outline' }
        ]
      }
    ]);
  };

  // Helper to format text cleanly without markdown clutter
  const renderCleanText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-1.5" />;

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
          <div key={idx} className="border-l-2 border-amber-500/60 bg-amber-500/5 px-2.5 py-1.5 rounded-r-lg my-1.5 text-[11px] sm:text-xs text-foreground/90 italic">
            {trimmed.replace(/^>\s*/, '')}
          </div>
        );
      }

      // Bullet points (• or *)
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ')) {
        const cleanItem = trimmed.replace(/^([•\-\*]\s*)/, '');
        return (
          <div key={idx} className="flex items-start gap-1.5 my-0.5 text-xs text-foreground/90">
            <span className="text-primary mt-0.5 text-[10px]">●</span>
            <span>{cleanItem.replace(/\*\*/g, '')}</span>
          </div>
        );
      }

      // Bold text or regular paragraph
      const cleanLine = trimmed.replace(/\*\*/g, '');
      return (
        <p key={idx} className="text-xs sm:text-[13px] text-foreground/90 leading-relaxed my-0.5">
          {cleanLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#2A0F1A] via-[#3B0E23] to-[#1F0A13] text-pink-100 border border-pink-500/40 shadow-2xl hover:shadow-pink-950/50 hover:scale-105 transition-all duration-300 active:scale-95"
            aria-label="Open Rishta Matrimony AI Matchmaker"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-pink-500/20 text-pink-300">
              <Sparkles className="w-4 h-4 animate-pulse text-pink-300" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Rishta Matchmaker AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </span>
              <span className="block text-[10px] text-pink-300/80 font-serif">
                ﷽ Halal Matchmaking Assistant
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] md:w-[450px] h-[560px] sm:h-[600px] max-h-[86vh] bg-card rounded-2xl border border-pink-900/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2A0F1A] via-[#1F0A13] to-[#16060D] text-white p-3.5 sm:p-4 border-b border-pink-900/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-950/80 border border-pink-700/40 flex items-center justify-center text-pink-300">
                <Heart className="w-4 h-4 text-primary fill-primary/30" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-xs text-pink-300">﷽</span>
                  <h3 className="font-extrabold text-sm text-white tracking-tight">
                    Rishta Matchmaker AI
                  </h3>
                </div>
                <p className="text-[11px] text-pink-300/80 font-medium">
                  Halal Marriage & Proposal Finder
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleResetChat}
                className="h-8 w-8 p-0 text-pink-300/70 hover:text-white hover:bg-pink-950/50 rounded-lg"
                title="Restart Chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-pink-300/70 hover:text-white hover:bg-pink-950/50 rounded-lg"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-muted/30 border-b border-border/50 px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-background hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition-all duration-200 active:scale-95 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-muted/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none shadow-sm font-medium'
                      : 'bg-card border border-border/80 text-foreground rounded-bl-none shadow-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div>
                    {renderCleanText(msg.text)}
                  </div>

                  {/* Profile Match Cards (Interactive Proposal Cards) */}
                  {msg.profileMatches && msg.profileMatches.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-border/40">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        Matching Verified Proposals:
                      </p>
                      {msg.profileMatches.map((profile) => (
                        <div
                          key={profile.id}
                          className="p-3 rounded-xl bg-muted/40 border border-border/60 hover:border-primary/40 transition-colors flex flex-col gap-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground text-xs">{profile.name}</span>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {profile.gender === 'Female' ? '👰 Bride' : '🤵 Groom'}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {profile.age} Yrs • {profile.city} • {profile.maslak || 'Sunni'}
                              </p>
                              <p className="text-[11px] text-foreground/80 font-medium">
                                {profile.education} • {profile.profession}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="h-7 w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center justify-center gap-1 font-semibold"
                            onClick={() => {
                              setIsOpen(false);
                              navigate(profile.gender === 'Female' ? '/profiles?gender=Female' : '/profiles?gender=Male');
                            }}
                          >
                            <span>Open Profile on Website</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Link Buttons */}
                  {msg.actionLinks && msg.actionLinks.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-border/40 flex flex-wrap gap-1.5">
                      {msg.actionLinks.map((link, lIdx) => (
                        link.isExternal ? (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              link.variant === 'whatsapp'
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            }`}
                          >
                            {link.variant === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5" />}
                            <span>{link.label}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <button
                            key={lIdx}
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              navigate(link.url);
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              link.variant === 'default'
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs'
                                : 'bg-muted hover:bg-primary/10 text-foreground hover:text-primary border border-border'
                            }`}
                          >
                            {link.variant === 'default' && <Star className="w-3 h-3 text-amber-300" />}
                            <span>{link.label}</span>
                          </button>
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
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border rounded-2xl p-3 max-w-[75%] rounded-bl-none">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                <span>Searching verified matrimonial proposals...</span>
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
                placeholder="Ask about Brides, Grooms, ₹491 Plan, or Istikhara..."
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
              Rishta Matrimony • Verified Islamic Proposals • 100% Modesty & Privacy
            </p>
          </div>

        </div>
      )}
    </>
  );
}
