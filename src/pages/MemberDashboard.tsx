import { useNavigate } from "react-router-dom";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Crown, Heart, Users, Sparkles } from "lucide-react";
import { useEffect } from "react";

export default function MemberDashboard() {
  const { member, logout, loading } = useMemberAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && member?.plan_type === "premium") {
      navigate("/member/premium", { replace: true });
    }
  }, [loading, member, navigate]);

  if (!member) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/member/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assalamu Alaikum, {member.full_name}</h1>
            <p className="text-muted-foreground mt-1">Welcome to your member dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Free Member</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Verified profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Email:</span> {member.email}</div>
              {member.whatsapp_number && <div><span className="text-muted-foreground">WhatsApp:</span> {member.whatsapp_number}</div>}
              {member.residence_location && <div><span className="text-muted-foreground">Location:</span> {member.residence_location}</div>}
              {member.gender && <div><span className="text-muted-foreground">Gender:</span> {member.gender}</div>}
              <div className="pt-2">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">✓ Verified</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Crown className="w-5 h-5 text-primary" /> Upgrade to Premium</CardTitle>
              <CardDescription>Unlock contact details and priority matches.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 mb-4 text-muted-foreground">
                <li>• Direct contact access</li>
                <li>• Priority profile visibility</li>
                <li>• Premium-only matches</li>
              </ul>
              <Button className="w-full" onClick={() => navigate("/pricing")}>
                <Sparkles className="w-4 h-4 mr-2" /> View Premium Plans
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Browse Profiles</CardTitle>
              <CardDescription>Explore verified members.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate("/profiles")}>Open Profiles</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-primary" /> Coming Soon</CardTitle>
              <CardDescription>Saved profiles, interests & recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">More personalized features will appear here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}