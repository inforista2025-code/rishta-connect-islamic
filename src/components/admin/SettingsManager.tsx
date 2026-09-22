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
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Loader2, 
  ExternalLink,
  Save
} from "lucide-react";

export function SettingsManager() {
  const { toast } = useToast();
  const [adminEmail, setAdminEmail] = useState<string>("");
  
  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Editable Contact Info state
  const [whatsappNumber, setWhatsappNumber] = useState(() => {
    return localStorage.getItem("admin_support_whatsapp") || "+91 9128719875";
  });
  const [supportEmail, setSupportEmail] = useState(() => {
    return localStorage.getItem("admin_support_email") || "info.rista2025@gmail.com";
  });
  const [isSavingContact, setIsSavingContact] = useState(false);

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

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContact(true);
    try {
      localStorage.setItem("admin_support_whatsapp", whatsappNumber.trim());
      localStorage.setItem("admin_support_email", supportEmail.trim());
      toast({
        title: "Contact Details Saved! ✅",
        description: "Official WhatsApp and Email support details have been updated.",
      });
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Could not save details locally.",
        variant: "destructive",
      });
    } finally {
      setIsSavingContact(false);
    }
  };

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const waTestUrl = `https://wa.me/${cleanWaNumber || "919128719875"}?text=Assalamu%20Alaikum%2C%20I%20have%20an%20inquiry%20regarding%20Rishta%20Matrimony.`;

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
            Manage your Admin password and Official Support WhatsApp & Email details.
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

        {/* Section 2: Official Support Details (Editable) */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <CardTitle className="text-base">Official Support Details</CardTitle>
                <CardDescription className="text-xs">
                  Update Official WhatsApp and Email used for member support
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSaveContact} className="space-y-4">
              {/* WhatsApp Number Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Official WhatsApp Number
                  </Label>
                  <a
                    href={waTestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-600 hover:underline flex items-center gap-0.5 font-medium"
                  >
                    Test WhatsApp <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <Input
                  type="text"
                  placeholder="+91 9128719875"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  required
                />
              </div>

              {/* Support Email Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    Official Support Email
                  </Label>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-medium"
                  >
                    Test Email <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <Input
                  type="email"
                  placeholder="info.rista2025@gmail.com"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  required
                />
              </div>

              {/* Save Button */}
              <Button type="submit" disabled={isSavingContact} className="w-full" variant="outline">
                {isSavingContact ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Details...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2 text-emerald-600" />
                    Save Support Details
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
