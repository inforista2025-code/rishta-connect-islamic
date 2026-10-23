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
  MessageCircle, 
  ArrowRight, 
  PhoneCall,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { generateIslamicAssistantResponse, ChatMessage } from '@/lib/islamicAiKnowledge';
import { useToast } from '@/hooks/use-toast';

interface ExtendedChatMessage extends ChatMessage {
  isStreaming?: boolean;
  suggestedActions?: { label: string; url: string; isExternal?: boolean }[];
}


export function IslamicAssistantWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      text: `**Assalamu Alaikum!** 🌸✨\nWelcome to **Rishta Matrimony AI** 👰🤵\n\nMain aapka Halal Matchmaking Assistant hoon. Main aapke liye verified rishte dhoondhne, deeni masail aur pricing ki jankari ke liye hazir hoon.\n\n💬 *Bataiye, aaj main aapki kya madad karoon? Kya aap rishta dhoondh rahe hain ya apna Free Biodata register karna chahte hain?*`,
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
      // 1. First attempt to call the Gemini & Dynamic Knowledge API endpoint
      let replyText = '';
      let actions: { label: string; url: string; isExternal?: boolean }[] | undefined = undefined;
      let profileMatches: any[] | undefined = undefined;

      try {
        const historyPayload = messages.slice(-5).map(m => ({
          sender: m.sender,
          text: m.text
        }));

        const response = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query.trim(),
            history: historyPayload
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.reply) {
            replyText = data.reply;
            actions = data.suggestedActions;
          }
        }
      } catch (apiErr) {
        console.warn('API /api/ai-chat call fallback to local engine:', apiErr);
      }

      // 2. If API is offline or empty, fallback cleanly to local semantic engine
      if (!replyText) {
        const localResponse = await generateIslamicAssistantResponse(query.trim());
        replyText = localResponse.text;
        profileMatches = localResponse.profileMatches;
      }

      setIsThinking(false);

      const botMessageId = `bot-${Date.now()}`;
      const fullText = replyText;

      // Initialize streaming message
      const initialBotMsg: ExtendedChatMessage = {
        id: botMessageId,
        sender: 'assistant',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
        suggestedActions: actions,
        profileMatches,
      };

      setMessages((prev) => [...prev, initialBotMsg]);

      // Stream text chunk by chunk (typewriter effect)
      let currentIdx = 0;
      const chunkSize = 3;
      const tickSpeed = 16;

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
        text: `Assalamu Alaikum. Network me thodi rukawat aayi hai. Aap hamare team se direct WhatsApp (+91 9128719875) par rabta kar sakte hain 🌸`,
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
        text: `**Assalamu Alaikum!** 🌸✨\nRishta Matrimony Matchmaker AI ready.\n\n💬 *Bataiye, aaj main aapki kya madad karoon? Kya aap rishta dhoondh rahe hain ya biodata banana chahte hain?*`,
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
              <blockquote key={idx} className="border-l-2 border-amber-500/70 pl-2.5 my-1.5 text-[11px] sm:text-xs text-muted-foreground italic bg-amber-500/5 py-1 rounded-r">
                {trimmed.replace(/^>\s*/, '')}
              </blockquote>
            );
          }

          // Check if line is purely a URL
          if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            const match = trimmed.match(/^([a-zA-Z0-9+.-]+:\/\/[^\s]+?)([.,!?;:)]*)$/);
            const cleanUrl = match ? match[1] : trimmed;
            const trailing = match ? match[2] : '';
            return (
              <div key={idx} className="my-1.5">
                <a
                  href={cleanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-semibold text-xs transition-colors break-all shadow-xs"
                >
                  <span>{cleanUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                </a>
                {trailing}
              </div>
            );
          }

          // Bullet points
          if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.replace(/^(\u2022|\-|\*)\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-foreground/90 pl-1">
                <span className="text-primary text-[10px] mt-0.5">•</span>
                <span>{formatRichText(content)}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-xs text-foreground/90 leading-relaxed">
              {formatRichText(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  // Rich text renderer: Handles Bold, Italic, Markdown Links, and inline Raw URLs
  const formatRichText = (text: string) => {
    // Matches markdown links [text](url), raw URLs http(s)://..., bold **...**, or italic *...*
    const regex = /(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+|\*\*.*?\*\*|\*.*?\*)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (!part) return null;

      // 1. Markdown link: [Label](url)
      const mdMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (mdMatch) {
        const label = mdMatch[1];
        const linkUrl = mdMatch[2];
        return (
          <a
            key={i}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 underline decoration-emerald-500/60 hover:decoration-emerald-700 transition-colors"
          >
            <span>{label}</span>
            <ExternalLink className="w-3 h-3 inline shrink-0" />
          </a>
        );
      }

      // 2. Raw URL: https://... or http://...
      if (part.startsWith('http://') || part.startsWith('https://')) {
        const match = part.match(/^([a-zA-Z0-9+.-]+:\/\/[^\s]+?)([.,!?;:)]*)$/);
        const cleanUrl = match ? match[1] : part;
        const trailing = match ? match[2] : '';

        return (
          <span key={i} className="inline">
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 underline decoration-emerald-500/60 hover:decoration-emerald-700 transition-colors break-all"
            >
              <span>{cleanUrl}</span>
              <ExternalLink className="w-3 h-3 inline shrink-0" />
            </a>
            {trailing}
          </span>
        );
      }

      // 3. Bold: **text**
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }

      // 4. Italic: *text*
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-foreground/80">{part.slice(1, -1)}</em>;
      }

      return part;
    });
  };

  const directAdminWaUrl = `https://wa.me/919128719875?text=${encodeURIComponent(
    `Assalamu Alaikum! Maine website AI se baat ki thi, mujhe verified rishton ke bare me aur jankari chahiye.`
  )}`;

  return (
    <>
      {/* Floating Trigger Button at Bottom-Right */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Tooltip greeting */}
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-card/95 backdrop-blur-md border border-primary/30 px-3.5 py-1.5 rounded-full shadow-lg text-xs font-semibold text-foreground cursor-pointer hover:border-primary transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Rishta AI Assistant 🌸</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Matchmaking Assistant"
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white/30"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white"></span>
          </button>
        </div>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[600px] max-h-[85vh] bg-card border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-3.5 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shadow-inner">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  Rishta Matrimony AI
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                </h3>
                <p className="text-[10px] text-emerald-100/90 flex items-center gap-1">
                  <span>Halal Matchmaker & Assistant</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleResetChat}
                className="h-7 w-7 p-0 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg"
                title="Restart Chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 p-0 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg"
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
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
                      ? 'bg-emerald-700 text-white rounded-br-none shadow-sm font-medium'
                      : 'bg-card border border-border/80 text-foreground rounded-bl-none shadow-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div>
                    {renderCleanText(msg.text, msg.isStreaming)}
                  </div>

                  {/* Profile Match Cards */}
                  {!msg.isStreaming && msg.profileMatches && msg.profileMatches.length > 0 && (
                    <div className="mt-2.5 space-y-2 pt-2 border-t border-border/40 animate-in fade-in duration-300">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Matching Verified Proposals:
                      </p>
                      {msg.profileMatches.map((profile) => (
                        <div
                          key={profile.id}
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/profiles?id=${profile.id}&gender=${profile.gender}`);
                          }}
                          className="p-2.5 rounded-xl bg-muted/40 border border-border/60 hover:border-emerald-500/50 hover:bg-muted/70 transition-all cursor-pointer flex flex-col gap-1.5 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground text-xs group-hover:text-emerald-700 transition-colors">{profile.name}</span>
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
                            className="h-6.5 w-full text-[11px] bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg flex items-center justify-center gap-1 font-semibold pointer-events-none"
                          >
                            <span>Open Profile on Page</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons beneath answer */}
                  {!msg.isStreaming && msg.sender === 'assistant' && (
                    <div className="mt-2.5 pt-2 border-t border-border/40 flex flex-wrap items-center gap-1.5">
                      <a
                        href={directAdminWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>Chat on WhatsApp (+91 9128719875)</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors"
                      >
                        <span>Free Biodata (/register)</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
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
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                </span>
                <span className="text-[10px] text-emerald-800 font-medium ml-1">
                  Rishta AI soch raha hai... ✍️
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <div className="p-3 bg-card border-t border-border/60 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Poochhein (Fees, Photo privacy, Istikhara, Rishte)..."
                className="h-11 sm:h-12 text-sm bg-muted/40 rounded-xl px-3.5 border-emerald-200/80 focus-visible:ring-emerald-500/50 placeholder:text-muted-foreground/70"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-11 sm:h-12 px-4 bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl shrink-0 font-medium shadow-xs"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 mt-1.5 px-1">
              <span>Quran & Sahih Hadith Grounded</span>
              <a
                href={directAdminWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline flex items-center gap-0.5 font-medium"
              >
                WhatsApp Helpline: +91 9128719875
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
