import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { setMemberToken, useMemberAuth } from "@/hooks/useMemberAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Loader2, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  MessageCircle, 
  Mail, 
  KeyRound, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  FileText,
  Eye,
  Send,
  PhoneCall,
  HelpCircle
} from "lucide-react";

type Stage = "phone" | "otp";

const OTP_STATE_KEY = "member_login_otp_state";
const OTP_STATE_TTL_MS = 10 * 60 * 1000; // matches OTP expiry

type PersistedOtpState = { whatsapp: string; emailHint: string; ts: number };

function readOtpState(): PersistedOtpState | null {
  try {
    const raw = sessionStorage.getItem(OTP_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedOtpState;
    if (!parsed?.whatsapp || Date.now() - parsed.ts > OTP_STATE_TTL_MS) {
      sessionStorage.removeItem(OTP_STATE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export default function MemberLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { member, loading: authLoading } = useMemberAuth();
  const persisted = useState(() => readOtpState())[0];
  const [stage, setStage] = useState<Stage>(persisted ? "otp" : "phone");
  const [whatsapp, setWhatsapp] = useState(persisted?.whatsapp ?? "");
  const [code, setCode] = useState("");
  const [emailHint, setEmailHint] = useState(persisted?.emailHint ?? "");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Keep the OTP step alive across tab switches / mobile browser reloads.
  useEffect(() => {
    if (stage === "otp" && whatsapp) {
      sessionStorage.setItem(
        OTP_STATE_KEY,
        JSON.stringify({ whatsapp, emailHint, ts: readOtpState()?.ts ?? Date.now() } as PersistedOtpState)
      );
    } else if (stage === "phone") {
      sessionStorage.removeItem(OTP_STATE_KEY);
    }
  }, [stage, whatsapp, emailHint]);

  // If already signed in, jump straight to the correct dashboard
  useEffect(() => {
    if (!authLoading && member) {
      if (member.plan_type === "premium") navigate("/member/premium", { replace: true });
      else navigate("/member/dashboard", { replace: true });
    }
  }, [authLoading, member, navigate]);

  const requestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNumber = whatsapp.replace(/\D/g, "");
    if (cleanNumber.length < 7) {
      toast({ title: "Invalid WhatsApp Number", description: "Please enter your valid registered WhatsApp number.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("member-login-request", {
        body: { whatsapp_number: whatsapp },
      });
      if (error || data?.error) {
        toast({ title: "Login Failed", description: data?.error || error?.message || "Account not found or verification error", variant: "destructive" });
        return;
      }
      setEmailHint(data.email_hint || "");
      sessionStorage.setItem(
        OTP_STATE_KEY,
        JSON.stringify({ whatsapp, emailHint: data.email_hint || "", ts: Date.now() } as PersistedOtpState)
      );
      setStage("otp");
      setResendTimer(45); // 45 seconds countdown
      toast({ title: "✅ OTP Sent", description: `Verification code sent to ${data.email_hint || "your registered email"}.` });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      toast({ title: "Invalid Code", description: "Please enter the complete 6-digit verification code.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const device_info = {
        ua: navigator.userAgent,
        platform: navigator.platform,
        ts: new Date().toISOString(),
      };
      const { data, error } = await supabase.functions.invoke("member-login-verify", {
        body: { whatsapp_number: whatsapp, code: code.trim(), device_info },
      });
      if (error || data?.error || !data?.session_token) {
        toast({ title: "Verification Failed", description: data?.error || error?.message || "Invalid or expired code. Please try again.", variant: "destructive" });
        return;
      }
      setMemberToken(data.session_token);
      sessionStorage.removeItem(OTP_STATE_KEY);
      toast({ title: "✅ Welcome Back", description: `Assalamu Alaikum, ${data.member.full_name}!` });
      if (data.member.plan_type === "premium") navigate("/member/premium");
      else navigate("/member/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppHelp = () => {
    window.open(
      `https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20need%20help%20logging%20into%20my%20Rishta%20Matrimony%20Member%20Account%20(WhatsApp%3A%20${encodeURIComponent(whatsapp)}).`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Islamic Premium Header Section (Matches Register & Profiles Pages) */}
      <div className="relative bg-gradient-to-b from-primary/15 via-muted/30 to-background -mt-16 pt-24 pb-12 px-4 text-center overflow-hidden border-b">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Bismillah Calligraphy */}
          <div className="text-3xl sm:text-4xl font-serif text-primary/80 mb-2">
            ﷽
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
            Member Portal & Profile Access
          </h1>
          
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Login to your verified account to manage your matrimony biodata, monitor shortlist requests, and connect with prospective life partners.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* 2-Column Grid: Left Login Form, Right Portal Features */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Form Card (7 Cols) */}
            <div className="lg:col-span-7 bg-card rounded-3xl border border-border/80 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 via-emerald-500/5 to-teal-500/10 p-6 sm:p-7 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Member Area</span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">
                      {stage === "phone" ? "Log In to Your Biodata" : "Verify OTP Code"}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stage === "phone" 
                    ? "Enter your registered WhatsApp number to receive an instant verification code."
                    : "Enter the 6-digit verification code sent to your registered email."}
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                {stage === "phone" ? (
                  <form onSubmit={requestOtp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="wa" className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Registered WhatsApp Number</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="wa"
                          type="tel"
                          placeholder="e.g. 9128719875 or +91 91287 19875"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          required
                          autoFocus
                          className="h-12 rounded-xl bg-background text-sm focus-visible:ring-primary pl-3.5"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>A 6-digit OTP will be sent to your registered email address.</span>
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-md transition-all duration-200 gap-2 cursor-pointer" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Get Verification Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <div className="pt-2 text-center text-xs text-muted-foreground border-t">
                      Don't have a matrimonial profile yet?{" "}
                      <Link to="/register" className="text-primary font-bold hover:underline">
                        Register Free
                      </Link>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={verifyOtp} className="space-y-4 animate-fade-in">
                    <div className="space-y-2 text-center">
                      <div className="w-11 h-11 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-foreground">Enter 6-Digit OTP</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Code sent to your email{" "}
                        {emailHint ? <span className="font-bold text-foreground">({emailHint})</span> : null}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="code"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="• • • • • •"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        required
                        autoFocus
                        className="h-12 text-center text-2xl tracking-[0.4em] font-extrabold rounded-xl bg-background border-primary/40 focus-visible:ring-primary"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-md transition-all duration-200 gap-2 cursor-pointer" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Login</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    {/* Resend & Back Row */}
                    <div className="flex items-center justify-between pt-2 text-xs">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setStage("phone"); setCode(""); }} 
                        disabled={loading}
                        className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 p-0 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Change Number</span>
                      </Button>

                      {resendTimer > 0 ? (
                        <span className="text-[11px] text-muted-foreground">
                          Resend in {resendTimer}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => requestOtp()}
                          disabled={loading}
                          className="text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Resend OTP</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground text-center leading-relaxed pt-1 bg-muted/40 p-2.5 rounded-xl border">
                      💡 Tip: If you don't see the email in your inbox, please check your <span className="font-semibold text-foreground">Spam / Junk</span> folder.
                    </p>
                  </form>
                )}

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Encrypted & Secure Halal Matchmaking Portal</span>
                </div>
              </div>
            </div>

            {/* Right Column: What You Can Do in Portal (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-cream via-amber-50/40 to-primary/5 rounded-3xl p-6 sm:p-7 border border-primary/20 shadow-sm space-y-5">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Member Dashboard Features</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-foreground">Update Your Biodata & Photos</h5>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Edit education, job, family information, and photos anytime with ease.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-foreground">Control Profile Privacy</h5>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Choose to keep photos blurred or visible, and protect family contact numbers.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-foreground">Track Sent & Received Interests</h5>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">See which families have shown interest in your proposal and respond directly.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-foreground">Direct WhatsApp Contact</h5>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Premium members get 1-click verified contact details for seamless communication.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-card border rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <h6 className="text-xs font-bold text-foreground">Facing issue logging in?</h6>
                  <p className="text-[11px] text-muted-foreground">Get instant assistance on WhatsApp</p>
                </div>
                <Button
                  onClick={handleWhatsAppHelp}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs font-semibold border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 rounded-lg gap-1.5 shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Help</span>
                </Button>
              </div>
            </div>

          </div>

          {/* 3-Step Process Strip */}
          <div className="mt-14 pt-10 border-t">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple & Secure</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">
                How Member Access Works
              </h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="p-5 rounded-2xl bg-card border shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm mx-auto flex items-center justify-center">
                  1
                </div>
                <h5 className="text-sm font-bold text-foreground">Enter WhatsApp Number</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">Provide the registered phone number associated with your matrimonial biodata.</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm mx-auto flex items-center justify-center">
                  2
                </div>
                <h5 className="text-sm font-bold text-foreground">Receive 6-Digit Email OTP</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">Check your inbox or spam folder for your unique verification code.</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm mx-auto flex items-center justify-center">
                  3
                </div>
                <h5 className="text-sm font-bold text-foreground">Manage Your Profile</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">Instantly enter your member dashboard to explore matches and update details.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Islamic Hadith Quote Section */}
      <div className="text-center py-6 px-4 bg-muted/20 border-t">
        <p className="text-xs sm:text-sm italic text-muted-foreground max-w-2xl mx-auto">
          "When a person marries, they have fulfilled half of their religion, so let them fear Allah regarding the remaining half." – Prophet Muhammad ﷺ (Al-Bayhaqi)
        </p>
      </div>

      <Footer />
    </div>
  );
}
