import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, Copy, CheckCircle, XCircle, Search, Star, Plus, Globe, GlobeLock, Trash2, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { RegistrationDetailModal } from './RegistrationDetailModal';
import { AdminPhotoPreviewModal } from './AdminPhotoPreviewModal';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProfileRecord {
  id: number;
  name: string;
  gender: string;
  age: string;
  dob: string;
  location: string;
  height: string;
  complexion: string;
  education: string;
  profession: string;
  marital_status: string;
  caste: string | null;
  maslak: string | null;
  islamic_knowledge: string | null;
  family: string;
  preferred_partner: string;
  preferred_location: string;
  preferred_age: string;
  display_order: number;
  plan_type: string;
  premium_expiry: string | null;
  registration_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  email: string | null;
  whatsapp_number: string | null;
  photo_urls: string[] | null;
  biodata_url: string | null;
  verification_status: string;
  is_live: boolean;
  admin_notes: string | null;
  other_info: string | null;
  date_of_birth: string | null;
}

export function RegistrationsManager() {
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<ProfileRecord | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<ProfileRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<{
    isOpen: boolean;
    photos: string[];
    initialIndex: number;
    title: string;
    subtitle: string;
  }>({
    isOpen: false,
    photos: [],
    initialIndex: 0,
    title: '',
    subtitle: '',
  });
  const { toast } = useToast();

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('verification_status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProfiles((data as unknown as ProfileRecord[]) || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({ title: 'Error', description: 'Failed to fetch profiles', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filter]);

  const handleVerify = async (id: number) => {
    try {
      const { error } = await supabase
        .from('profiles_data')
        .update({ verification_status: 'verified', is_live: true } as any)
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Profile verified and set live!' });
      fetchProfiles();
    } catch (error) {
      console.error('Error verifying:', error);
      toast({ title: 'Error', description: 'Failed to verify profile', variant: 'destructive' });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const { error } = await supabase
        .from('profiles_data')
        .update({ verification_status: 'rejected', is_live: false } as any)
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Profile rejected and hidden from public' });
      fetchProfiles();
    } catch (error) {
      console.error('Error rejecting:', error);
      toast({ title: 'Error', description: 'Failed to reject profile', variant: 'destructive' });
    }
  };

  const handleToggleLive = async (profile: ProfileRecord) => {
    try {
      const { error } = await supabase
        .from('profiles_data')
        .update({ is_live: !profile.is_live } as any)
        .eq('id', profile.id);
      if (error) throw error;
      toast({ title: profile.is_live ? 'Profile hidden from public' : 'Profile is now live!' });
      fetchProfiles();
    } catch (error) {
      console.error('Error toggling live:', error);
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const handleTogglePremium = async (profile: ProfileRecord) => {
    const newPlan = profile.plan_type === 'premium' ? 'free' : 'premium';
    try {
      const { error } = await supabase
        .from('profiles_data')
        .update({ plan_type: newPlan, premium_expiry: null } as any)
        .eq('id', profile.id);
      if (error) throw error;
      // Also update linked registration if exists
      if (profile.registration_id) {
        await supabase
          .from('registrations')
          .update({ plan_type: newPlan, premium_expiry: null } as any)
          .eq('id', profile.registration_id);
      }
      toast({ title: newPlan === 'premium' ? '⭐ Premium activated!' : 'Premium removed' });
      fetchProfiles();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to update plan', variant: 'destructive' });
    }
  };

  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;
    setIsDeleting(true);
    try {
      const pid = profileToDelete.id;
      const regId = profileToDelete.registration_id;

      // 1. Delete associated interests
      try {
        await supabase
          .from('profile_interests')
          .delete()
          .or(`sender_profile_id.eq.${pid},receiver_profile_id.eq.${pid}`);
      } catch (e) {
        console.warn('Interests cleanup:', e);
      }

      // 2. Delete member editable profile
      try {
        await supabase
          .from('member_editable_profile')
          .delete()
          .eq('profile_id', pid);
      } catch (e) {
        console.warn('Editable profile cleanup:', e);
      }

      // 3. Delete member sessions
      try {
        await supabase
          .from('member_sessions')
          .delete()
          .eq('profile_data_id', pid);
      } catch (e) {
        console.warn('Sessions cleanup:', e);
      }

      // 4. Delete member OTPs
      try {
        await supabase
          .from('member_otps')
          .delete()
          .eq('profile_data_id', pid);
      } catch (e) {
        console.warn('OTPs cleanup:', e);
      }

      // 5. Delete from main profiles_data table
      const { error: deleteError } = await supabase
        .from('profiles_data')
        .delete()
        .eq('id', pid);

      if (deleteError) throw deleteError;

      // 6. Delete from registrations table if linked
      if (regId) {
        try {
          await supabase
            .from('registrations')
            .delete()
            .eq('id', regId);
        } catch (e) {
          console.warn('Registrations table cleanup:', e);
        }
      }

      toast({
        title: 'Profile Deleted! 🗑️',
        description: `Profile "${profileToDelete.name}" has been permanently removed from website & database.`,
      });
      setProfileToDelete(null);
      fetchProfiles();
    } catch (error: any) {
      console.error('Error deleting profile:', error);
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete profile from database.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyProfile = (profile: ProfileRecord) => {
    const profileText = `
📋 *RISHTA PROFILE*
━━━━━━━━━━━━━━━━━━

👤 *Personal Details*
Name: ${profile.name}
Gender: ${profile.gender}
Age: ${profile.age}
DOB: ${profile.dob}
Height: ${profile.height}
Complexion: ${profile.complexion}
Marital Status: ${profile.marital_status}

📍 *Location*
${profile.location}

🎓 *Education & Profession*
Education: ${profile.education}
Occupation: ${profile.profession}

🏠 *Family Details*
${profile.family}

🕌 *Religious Details*
${profile.maslak ? `Maslak: ${profile.maslak}` : ''}
${profile.caste ? `Caste: ${profile.caste}` : ''}
${profile.islamic_knowledge ? `Islamic Education: ${profile.islamic_knowledge}` : ''}

💑 *Partner Preferences*
Age Range: ${profile.preferred_age}
Location: ${profile.preferred_location}
Other: ${profile.preferred_partner}

📞 *Contact*
${profile.whatsapp_number ? `WhatsApp: ${profile.whatsapp_number}` : ''}
${profile.email ? `Email: ${profile.email}` : ''}

${profile.other_info ? `📝 Additional Info:\n${profile.other_info}` : ''}
━━━━━━━━━━━━━━━━━━
    `.trim();

    navigator.clipboard.writeText(profileText);
    toast({ title: 'Profile copied to clipboard!' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleAddNew = () => {
    setSelectedProfile(null);
    setIsAddMode(true);
    setIsModalOpen(true);
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.whatsapp_number || '').includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No profiles found.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell">WhatsApp</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Live</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    {profile.photo_urls && profile.photo_urls.length > 0 ? (
                      <div
                        className="relative group cursor-pointer w-12 h-12 inline-block select-none"
                        onClick={() =>
                          setPhotoPreview({
                            isOpen: true,
                            photos: profile.photo_urls || [],
                            initialIndex: 0,
                            title: `${profile.name} (${profile.gender})`,
                            subtitle: `${profile.age ? profile.age + ' yrs' : ''} ${profile.location ? '• ' + profile.location : ''} ${profile.profession ? '• ' + profile.profession : ''}`,
                          })
                        }
                        title="Click to view & zoom full photos"
                      >
                        <img
                          src={profile.photo_urls[0]}
                          alt={profile.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all shadow-sm group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ZoomIn className="w-5 h-5" />
                        </div>
                        {profile.photo_urls.length > 1 && (
                          <span className="absolute -bottom-1 -right-1 bg-primary text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full shadow border border-background">
                            +{profile.photo_urls.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-[10px] text-center font-medium border border-dashed">
                        No Photo
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-1.5">
                      {profile.name}
                      {profile.created_at && (Date.now() - new Date(profile.created_at).getTime()) < 24 * 60 * 60 * 1000 && (
                        <Badge className="bg-blue-500 text-[10px] px-1.5 py-0">New</Badge>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>{profile.gender}</TableCell>
                  <TableCell className="hidden md:table-cell">{profile.location}</TableCell>
                  <TableCell className="hidden lg:table-cell">{profile.whatsapp_number || '-'}</TableCell>
                  <TableCell className="hidden lg:table-cell">{profile.email || '-'}</TableCell>
                  <TableCell>{getStatusBadge(profile.verification_status)}</TableCell>
                  <TableCell>
                    {profile.is_live ? (
                      <Badge className="bg-green-500">Live</Badge>
                    ) : (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {profile.plan_type === 'premium' ? (
                      <Badge className="bg-[#6C4DF6] hover:bg-[#5a3de0] text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {profile.created_at ? format(new Date(profile.created_at), 'dd MMM yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedProfile(profile);
                          setIsAddMode(false);
                          setIsModalOpen(true);
                        }}
                        title="View/Edit"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyProfile(profile)}
                        title="Copy Profile"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={profile.plan_type === 'premium' ? 'text-[#6C4DF6] hover:text-[#5a3de0]' : 'text-muted-foreground hover:text-[#6C4DF6]'}
                        onClick={() => handleTogglePremium(profile)}
                        title={profile.plan_type === 'premium' ? 'Remove Premium' : 'Make Premium'}
                      >
                        <Star className="w-4 h-4" fill={profile.plan_type === 'premium' ? 'currentColor' : 'none'} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={profile.is_live ? 'text-green-600 hover:text-red-600' : 'text-muted-foreground hover:text-green-600'}
                        onClick={() => handleToggleLive(profile)}
                        title={profile.is_live ? 'Remove from Live' : 'Make Live'}
                      >
                        {profile.is_live ? <Globe className="w-4 h-4" /> : <GlobeLock className="w-4 h-4" />}
                      </Button>
                      {profile.verification_status !== 'verified' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleVerify(profile.id)}
                          title="Verify"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {profile.verification_status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReject(profile.id)}
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                        onClick={() => setProfileToDelete(profile)}
                        title="Permanently Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <RegistrationDetailModal
        profile={selectedProfile}
        isOpen={isModalOpen}
        isAddMode={isAddMode}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProfile(null);
          setIsAddMode(false);
        }}
        onUpdate={fetchProfiles}
      />

      {/* Confirmation Dialog for Permanent Deletion */}
      <AlertDialog open={!!profileToDelete} onOpenChange={(open) => !open && setProfileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Profile Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-sm">
              <p>
                Are you sure you want to delete <span className="font-bold text-foreground">"{profileToDelete?.name}"</span>?
              </p>
              <p className="text-xs text-red-500 font-medium">
                ⚠️ This action cannot be undone. This profile will be completely erased from the public website, member portal, and Supabase database.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteProfile();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Yes, Delete Profile'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Photo Preview Lightbox / Modal */}
      <AdminPhotoPreviewModal
        isOpen={photoPreview.isOpen}
        photos={photoPreview.photos}
        initialIndex={photoPreview.initialIndex}
        title={photoPreview.title}
        subtitle={photoPreview.subtitle}
        onClose={() => setPhotoPreview((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
