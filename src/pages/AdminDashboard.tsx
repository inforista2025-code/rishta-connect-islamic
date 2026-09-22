import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, BookOpen, Users, Settings, LogOut, Info, ClipboardList, FileText, Shield, GitPullRequest, Activity } from 'lucide-react';
import { BlogManager } from '@/components/admin/BlogManager';
import { AboutUsManager } from '@/components/admin/AboutUsManager';
import { RegistrationsManager } from '@/components/admin/RegistrationsManager';
import { TermsManager } from '@/components/admin/TermsManager';
import { PrivacyPolicyManager } from '@/components/admin/PrivacyPolicyManager';
import { UpdateRequestsManager } from '@/components/admin/UpdateRequestsManager';
import { MemberActivityManager } from '@/components/admin/MemberActivityManager';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('registrations');

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/auth');
    }
  }, [isAdmin, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Logged out successfully' });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Registrations
            </TabsTrigger>
            <TabsTrigger value="update-requests" className="flex items-center gap-2">
              <GitPullRequest className="w-4 h-4" />
              Update Requests
            </TabsTrigger>
            <TabsTrigger value="member-activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Member Activity
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Blog Manager
            </TabsTrigger>
            <TabsTrigger value="about-us" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              About Us
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Terms & Conditions
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Profiles
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            <RegistrationsManager />
          </TabsContent>

          <TabsContent value="update-requests">
            <UpdateRequestsManager />
          </TabsContent>

          <TabsContent value="member-activity">
            <MemberActivityManager />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          <TabsContent value="about-us">
            <AboutUsManager />
          </TabsContent>

          <TabsContent value="terms">
            <TermsManager />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacyPolicyManager />
          </TabsContent>

          <TabsContent value="profiles">
            <div className="text-center py-10 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Profile management is available on the Profiles page</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/profiles')}
              >
                Go to Profiles
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}