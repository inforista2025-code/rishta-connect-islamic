import { useNavigate } from "react-router-dom";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Crown, Heart, Users, MessageCircle } from "lucide-react";

export default function PremiumDashboard() {
  const { member, logout } = useMemberAuth();
  const navigate = useNavigate();

  if (!member) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/member/login");
  };

  const expiry = member.premium_expiry ? new Date(member.premium_expiry).toLocaleDateString() : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Crown className="w-7 h-7 text-purple-600" /> {member.full_name}
            </h1>
            <p className="text-muted-foreground mt-1">Premium Member Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600 hover:bg-purple-700">Premium</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Crown className="w-5 h-5 text-purple-600" /> Premium Status</CardTitle>
              <CardDescription>Your benefits are active</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Plan: <span className="font-semibold text-purple-700">Premium</span></div>
              {expiry && <div>Valid until: <span className="font-semibold">{expiry}</span></div>}
              <ul className="mt-3 space-y-1 text-muted-foreground">
                <li>✓ Direct contact access</li>
                <li>✓ Priority profile visibility</li>
                <li>✓ Premium-only matches</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Email:</span> {member.email}</div>
              {member.whatsapp_number && <div><span className="text-muted-foreground">WhatsApp:</span> {member.whatsapp_number}</div>}
              {member.residence_location && <div><span className="text-muted-foreground">Location:</span> {member.residence_location}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Browse Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate("/profiles")}>Open Profiles</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary" /> Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate("/contact")}>Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}