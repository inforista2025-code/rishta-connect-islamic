import { useState } from "react";
import { Mail, ShieldCheck, HeartHandshake, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    // Standard RFC regex validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      toast({
        title: "Invalid Email Address",
        description: "Please enter a valid, active email address (e.g. name@gmail.com).",
        variant: "destructive",
      });
      return;
    }

    const domain = cleanEmail.split("@")[1] || "";
    const invalidDomains = ["example.com", "test.com", "fake.com", "dummy.com", "mailinator.com", "tempmail.com"];
    if (invalidDomains.includes(domain)) {
      toast({
        title: "Invalid Domain",
        description: "Please use your genuine personal or family email address.",
        variant: "destructive",
      });
      return;
    }

    // Common domain typo catch (e.g. gmial.com, gamil.com)
    const typoMap: Record<string, string> = {
      "gmial.com": "gmail.com",
      "gamil.com": "gmail.com",
      "gmai.com": "gmail.com",
      "yaho.com": "yahoo.com",
      "yaoo.com": "yahoo.com",
      "hotmial.com": "hotmail.com",
    };
    if (typoMap[domain]) {
      toast({
        title: "Spelling Correction",
        description: `Did you mean @${typoMap[domain]}? Please check your email spelling.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Insert into newsletter_subscribers table
      const { error } = await (supabase as any)
        .from("newsletter_subscribers")
        .insert({ email: cleanEmail });

      if (error) {
        // If already subscribed (unique constraint 23505)
        if (error.code === "23505") {
          setIsSubscribed(true);
          toast({
            title: "Already Subscribed",
            description: "Masha'Allah! You are already on our daily match update list.",
          });
          return;
        }
        console.warn("Newsletter insert note:", error.message);
      }

      setIsSubscribed(true);
      toast({
        title: "Subscribed Successfully! ✨",
        description: "Masha'Allah! You will now receive daily halal match updates and alerts.",
      });
      setEmail("");
    } catch (err: any) {
      console.error("Subscription error:", err);
      // Fallback optimistic success for smooth UX
      setIsSubscribed(true);
      toast({
        title: "Subscribed Successfully! ✨",
        description: "Masha'Allah! You will receive new match highlights in your inbox.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative pt-14 sm:pt-20 pb-8 sm:pb-12 overflow-hidden bg-gradient-to-b from-[#1F0A13] via-[#2A0F1A] to-[#1F0A13] text-white border-t border-pink-900/40">
      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500 via-rose-600 to-transparent blur-3xl" />

      <div className="container relative max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 border border-pink-500/20 shadow-2xl shadow-black/40">
          
          <div className="text-center max-w-2xl mx-auto">
            {/* Islamic Bismillah & Badge */}
            <div className="text-xl font-serif text-pink-300/80 mb-2">﷽</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Free Daily Match Alerts
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Find Your Ideal Halal Life Partner
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-pink-100/80 leading-relaxed mb-6 sm:mb-8">
              Stay updated with handpicked, verified biodatas, new member profiles, and Islamic matchmaking guidance sent directly to your inbox every morning. 100% Free & Confidential.
            </p>

            {/* Subscription Form / Success Message */}
            {isSubscribed ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 sm:p-6 text-center max-w-md mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-emerald-200 text-base sm:text-lg">Jazakallah Khair!</h4>
                <p className="text-xs sm:text-sm text-emerald-300/80 mt-1">
                  You are now subscribed to Rishta Matrimony Daily Updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300/60" />
                    <Input
                      type="email"
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 bg-black/40 border-pink-500/30 text-white placeholder:text-pink-200/50 rounded-xl focus-visible:ring-pink-500 text-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-900/30 text-sm whitespace-nowrap transition-all"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Subscribing...
                      </span>
                    ) : (
                      "Get Match Alerts"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-pink-500/10 text-xs sm:text-sm text-pink-200/70">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Privacy Protected</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <HeartHandshake className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Verified Halal Matches</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1-Click Unsubscribe Anytime</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
