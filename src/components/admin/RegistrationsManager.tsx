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
import { Loader2, Eye, Copy, CheckCircle, XCircle, Search } from 'lucide-react';
import { RegistrationDetailModal } from './RegistrationDetailModal';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Registration = Tables<'registrations'>;

export function RegistrationsManager() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('verification_status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch registrations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [filter]);

  const handleVerify = async (id: string) => {
    try {
      // First, get the registration data
      const registration = registrations.find(r => r.id === id);
      if (!registration) throw new Error('Registration not found');

      // Check if profile already exists for this registration
      const { data: existingProfile } = await supabase
        .from('profiles_data')
        .select('id')
        .eq('registration_id', id)
        .maybeSingle();

      if (existingProfile) {
        // Profile already exists, just update registration status
        const { error: updateError } = await supabase
          .from('registrations')
          .update({ verification_status: 'verified', is_live: true })
          .eq('id', id);

        if (updateError) throw updateError;
        toast({ title: 'Profile already exists, status updated!' });
        fetchRegistrations();
        return;
      }

      // Update registration status
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ verification_status: 'verified', is_live: true })
        .eq('id', id);

      if (updateError) throw updateError;

      // Calculate age from date_of_birth
      const dob = new Date(registration.date_of_birth);
      const today = new Date();
      const age = Math.floor((today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      
      // Format DOB for display (DD/MM/YYYY)
      const formattedDob = `${String(dob.getDate()).padStart(2, '0')}/${String(dob.getMonth() + 1).padStart(2, '0')}/${dob.getFullYear()}`;

      // Get max display_order to add new profile at top
      const { data: maxOrderData } = await supabase
        .from('profiles_data')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);
      
      const newOrder = (maxOrderData && maxOrderData[0]?.display_order) ? maxOrderData[0].display_order + 1 : 1;

      // Insert into profiles_data table with registration_id link
      const { error: insertError } = await supabase
        .from('profiles_data')
        .insert({
          name: registration.full_name,
          gender: registration.gender,
          age: String(age),
          dob: formattedDob,
          location: registration.residence_location,
          height: registration.height,
          complexion: registration.complexion,
          education: registration.education_details,
          profession: registration.occupation_details,
          marital_status: registration.marital_status,
          caste: registration.caste,
          maslak: registration.maslak,
          islamic_knowledge: registration.islamic_education,
          family: registration.family_details,
          preferred_partner: registration.partner_preferences,
          preferred_location: registration.preferred_location,
          preferred_age: registration.preferred_age_range,
          display_order: newOrder,
          registration_id: id
        });

      if (insertError) throw insertError;

      toast({ title: 'Profile verified and added to public profiles!' });
      fetchRegistrations();
    } catch (error) {
      console.error('Error verifying:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify profile',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      // Update registration status
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ verification_status: 'rejected', is_live: false })
        .eq('id', id);

      if (updateError) throw updateError;

      // Remove profile from profiles_data if it exists
      const { error: deleteError } = await supabase
        .from('profiles_data')
        .delete()
        .eq('registration_id', id);

      if (deleteError) {
        console.error('Error removing profile:', deleteError);
      }

      toast({ title: 'Profile rejected and removed from public profiles' });
      fetchRegistrations();
    } catch (error) {
      console.error('Error rejecting:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject profile',
        variant: 'destructive',
      });
    }
  };

  const handleCopyProfile = (registration: Registration) => {
    const profileText = `
📋 *RISHTA PROFILE*
━━━━━━━━━━━━━━━━━━

👤 *Personal Details*
Name: ${registration.full_name}
Gender: ${registration.gender}
Date of Birth: ${registration.date_of_birth}
Height: ${registration.height}
Complexion: ${registration.complexion}
Marital Status: ${registration.marital_status}

📍 *Location*
${registration.residence_location}

🎓 *Education & Profession*
Education: ${registration.education_details}
Occupation: ${registration.occupation_details}

🏠 *Family Details*
${registration.family_details}

🕌 *Religious Details*
Maslak: ${registration.maslak}
Caste: ${registration.caste}
${registration.islamic_education ? `Islamic Education: ${registration.islamic_education}` : ''}

💑 *Partner Preferences*
Age Range: ${registration.preferred_age_range}
Location: ${registration.preferred_location}
Other: ${registration.partner_preferences}

📞 *Contact*
WhatsApp: ${registration.whatsapp_number}
Email: ${registration.email}

${registration.other_info ? `📝 Additional Info:\n${registration.other_info}` : ''}
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

  const filteredRegistrations = registrations.filter(
    (r) =>
      r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.whatsapp_number.includes(searchTerm)
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

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No registrations found.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Photo</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell">WhatsApp</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>
                    {registration.photo_urls && registration.photo_urls[0] ? (
                      <img
                        src={registration.photo_urls[0]}
                        alt={registration.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{registration.full_name}</TableCell>
                  <TableCell>{registration.gender}</TableCell>
                  <TableCell className="hidden md:table-cell">{registration.residence_location}</TableCell>
                  <TableCell className="hidden lg:table-cell">{registration.whatsapp_number}</TableCell>
                  <TableCell className="hidden lg:table-cell">{registration.email}</TableCell>
                  <TableCell>{getStatusBadge(registration.verification_status)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(registration.created_at), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setIsModalOpen(true);
                        }}
                        title="View/Edit"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyProfile(registration)}
                        title="Copy Profile"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      {registration.verification_status !== 'verified' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleVerify(registration.id)}
                          title="Verify"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {registration.verification_status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReject(registration.id)}
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <RegistrationDetailModal
        registration={selectedRegistration}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRegistration(null);
        }}
        onUpdate={fetchRegistrations}
      />
    </div>
  );
}
