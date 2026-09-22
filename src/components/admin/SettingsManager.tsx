import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Lock, 
  KeyRound, 
  MessageCircle, 
  Mail, 
  Send, 
  Instagram, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Loader2, 
  ExternalLink,
  Copy,
  Sparkles
} from "lucide-react";

export function SettingsManager() {
  const { toast } = useToast();
  const [adminEmail, setAdminEmail] = useState<string>("");
  
  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Official Contact and Community defaults
  const contactInfo = {
    whatsapp: "+91 9128719875",
    whatsappLink: "https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20have%20an%20inquiry%20regarding%20Rishta%20Matrimony.",
    email: "info.rista2025@gmail.com",
    pricingPlan: "₹491 (2 Months Unlimited Access)",
    whatsappChannel: "https://www.whatsapp.com/channel/0029Vb6AIqPC1FuDwWaJVx0B",
    whatsappCommunity: "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t",
    telegram: "https://t.me/Rishtamatrimony",
    instagram: "https://www.instagram.com/rishtamatrimony786?stkn=MXBjajltZWFwMXdrdQ==",
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setAdminEmail(user.email);
      }
    });
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New Password and Confirm Password do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password Updated! ✅",
        description: "Your Admin password has been changed successfully.",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="bg-muted/40 border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Platform & Admin Settings
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your Admin account security, Official WhatsApp support info, and Community links.
          </p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 flex items-center gap-1.5 py-1 px-3">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>System Active & Healthy</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Admin Security & Password */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-base">Admin Security & Password</CardTitle>
                <CardDescription className="text-xs">
                  Logged in as: <span className="font-semibold text-foreground">{adminEmail || "Admin User"}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">New Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (min. 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Confirm New Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={isUpdatingPassword} className="w-full">
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Change Admin Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Section 2: Official Support & Pricing */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <CardTitle className="text-base">Official Support & Pricing</CardTitle>
                <CardDescription className="text-xs">
                  Active contact and pricing details used across website
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {/* WhatsApp */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground uppercase font-semibold">Official WhatsApp</p>
                <p className="text-sm font-medium">{contactInfo.whatsapp}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={() => copyToClipboard(contactInfo.whatsapp, "WhatsApp number")}
                  title="Copy Number"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 px-2.5 text-xs text-emerald-600 border-emerald-500/30"
                  onClick={() => window.open(contactInfo.whatsappLink, "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Test
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground uppercase font-semibold">Official Support Email</p>
                <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-none">{contactInfo.email}</p>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 shrink-0"
                onClick={() => copyToClipboard(contactInfo.email, "Support email")}
                title="Copy Email"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Pricing Plan */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-primary/5 border-primary/20">
              <div className="space-y-0.5">
                <p className="text-[11px] text-primary uppercase font-semibold">Current Premium Plan</p>
                <p className="text-sm font-bold text-foreground">{contactInfo.pricingPlan}</p>
              </div>
              <Badge variant="default" className="bg-primary text-xs">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Section 3: Official Community Channels */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-base">Official Community Channels</CardTitle>
                <CardDescription className="text-xs">
                  Official channels linked in Website Header, Footer & Contact page
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">4 Channels</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* WhatsApp Channel */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">WhatsApp Channel</p>
                  <p className="text-[11px] text-muted-foreground">Broadcast Updates</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 px-2 text-xs"
                onClick={() => window.open(contactInfo.whatsappChannel, "_blank")}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Open
              </Button>
            </div>

            {/* WhatsApp Community */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:border-emerald-600/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">WhatsApp Community</p>
                  <p className="text-[11px] text-muted-foreground">Member Group</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 px-2 text-xs"
                onClick={() => window.open(contactInfo.whatsappCommunity, "_blank")}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Open
              </Button>
            </div>

            {/* Telegram Channel */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:border-sky-500/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Telegram Channel</p>
                  <p className="text-[11px] text-muted-foreground">@Rishtamatrimony</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 px-2 text-xs"
                onClick={() => window.open(contactInfo.telegram, "_blank")}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Open
              </Button>
            </div>

            {/* Instagram Profile */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:border-rose-500/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Instagram Handle</p>
                  <p className="text-[11px] text-muted-foreground">@rishtamatrimony786</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 px-2 text-xs"
                onClick={() => window.open(contactInfo.instagram, "_blank")}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Open
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  );
}
