import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { setMemberToken, useMemberAuth } from "@/hooks/useMemberAuth";
import { Navbar } from "@/components/Navbar";
import { Loader2, ArrowLeft } from "lucide-react";

type Stage = "phone" | "otp";

export default function MemberLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { member, loading: authLoading } = useMemberAuth();
  const [stage, setStage] = useState<Stage>("phone");
  const [whatsapp, setWhatsapp] = useState("");
  const [code, setCode] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [loading, setLoading] = useState(false);

  // If already signed in, jump straight to the correct dashboard so the user
  // doesn't accidentally re-issue an OTP and revoke their own live session.
  useEffect(() => {
    if (!authLoading && member) {
      if (member.plan_type === "premium") navigate("/member/premium", { replace: true });
      else navigate("/member/dashboard", { replace: true });
    }
  }, [authLoading, member, navigate]);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsapp.replace(/\D/g, "").length < 7) {
      toast({ title: "Invalid number", description: "Please enter your registered WhatsApp number.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("member-login-request", {
        body: { whatsapp_number: whatsapp },
      });
      if (error || data?.error) {
        toast({ title: "Login failed", description: data?.error || error?.message || "Something went wrong", variant: "destructive" });
        return;
      }
      setEmailHint(data.email_hint || "");
      setStage("otp");
      toast({ title: "Code sent", description: `Verification code sent to ${data.email_hint || "your registered email"}.` });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      toast({ title: "Invalid code", description: "Please enter the 6-digit code.", variant: "destructive" });
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
        toast({ title: "Verification failed", description: data?.error || error?.message || "Invalid code", variant: "destructive" });
        return;
      }
      setMemberToken(data.session_token);
      toast({ title: "✅ Welcome back", description: `Hello ${data.member.full_name}!` });
      if (data.member.plan_type === "premium") navigate("/member/premium");
      else navigate("/member/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          {stage === "phone" ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Member Login</CardTitle>
                <CardDescription>Login using your registered WhatsApp number.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={requestOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wa">Registered WhatsApp Number</Label>
                    <Input
                      id="wa"
                      type="tel"
                      placeholder="+91 91287 19875"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                  </Button>
                </form>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Register Now
                  </Link>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Verify Your Account</CardTitle>
                <CardDescription>
                  A verification code has been sent to your registered email
                  {emailHint ? <> (<span className="font-medium">{emailHint}</span>)</> : null}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={verifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      required
                      autoFocus
                      className="text-center text-2xl tracking-[0.5em] font-semibold"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => { setStage("phone"); setCode(""); }} disabled={loading}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}