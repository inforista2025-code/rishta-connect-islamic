import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, X } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Registration = Tables<'registrations'>;

interface RegistrationDetailModalProps {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function RegistrationDetailModal({
  registration,
  isOpen,
  onClose,
  onUpdate,
}: RegistrationDetailModalProps) {
  const [formData, setFormData] = useState<Partial<Registration>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (registration) {
      setFormData(registration);
    }
  }, [registration]);

  const handleChange = (field: keyof Registration, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const sendVerificationStatusEmail = async (
    fullName: string,
    email: string,
    status: 'verified' | 'rejected'
  ) => {
    try {
      const { error } = await supabase.functions.invoke('send-registration-emails', {
        body: {
          type: 'verification_status',
          full_name: fullName,
          email: email,
          verification_status: status,
        },
      });
      if (error) {
        console.error('Failed to send verification email:', error);
      } else {
        console.log('Verification status email sent successfully');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  const syncPublicProfile = async (updated: Partial<Registration>) => {
    if (!registration) return;

    const shouldBePublic = updated.verification_status === 'verified' && updated.is_live === true;

    if (!shouldBePublic) {
      // If verification is reverted or set to non-live, remove from public profiles
      const { error: deleteError } = await supabase
        .from('profiles_data')
        .delete()
        .eq('registration_id', registration.id);

      if (deleteError) {
        console.error('Error removing public profile:', deleteError);
      }
      return;
    }

    // Ensure we have DOB for formatting/age calc
    const dobValue = updated.date_of_birth as unknown as string | undefined;
    const dob = dobValue ? new Date(dobValue) : null;

    const today = new Date();
    const age = dob
      ? Math.floor((today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : 0;

    const formattedDob = dob
      ? `${String(dob.getDate()).padStart(2, '0')}/${String(dob.getMonth() + 1).padStart(2, '0')}/${dob.getFullYear()}`
      : '';

    // Keep the same display_order if profile already exists; otherwise append at top
    const { data: existingProfile } = await supabase
      .from('profiles_data')
      .select('id, display_order')
      .eq('registration_id', registration.id)
      .maybeSingle();

    let displayOrder = existingProfile?.display_order;

    if (displayOrder == null) {
      const { data: maxOrderData } = await supabase
        .from('profiles_data')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

      displayOrder = (maxOrderData && maxOrderData[0]?.display_order)
        ? maxOrderData[0].display_order + 1
        : 1;
    }

    const profilePayload = {
      name: updated.full_name ?? registration.full_name,
      gender: updated.gender ?? registration.gender,
      age: String(age),
      dob: formattedDob,
      location: updated.residence_location ?? registration.residence_location,
      height: updated.height ?? registration.height,
      complexion: updated.complexion ?? registration.complexion,
      education: updated.education_details ?? registration.education_details,
      profession: updated.occupation_details ?? registration.occupation_details,
      marital_status: updated.marital_status ?? registration.marital_status,
      caste: updated.caste ?? registration.caste,
      maslak: updated.maslak ?? registration.maslak,
      islamic_knowledge: updated.islamic_education ?? registration.islamic_education,
      family: updated.family_details ?? registration.family_details,
      preferred_partner: updated.partner_preferences ?? registration.partner_preferences,
      preferred_location: updated.preferred_location ?? registration.preferred_location,
      preferred_age: updated.preferred_age_range ?? registration.preferred_age_range,
      display_order: displayOrder,
      registration_id: registration.id,
    };

    if (existingProfile?.id) {
      const { error: updateError } = await supabase
        .from('profiles_data')
        .update(profilePayload)
        .eq('id', existingProfile.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('profiles_data')
        .insert(profilePayload);

      if (insertError) {
        throw insertError;
      }
    }
  };

  const handleSave = async () => {
    if (!registration) return;

    setSaving(true);
    try {
      const updatedRegistration: Partial<Registration> = {
        full_name: formData.full_name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        height: formData.height,
        complexion: formData.complexion,
        marital_status: formData.marital_status,
        caste: formData.caste,
        maslak: formData.maslak,
        residence_location: formData.residence_location,
        education_details: formData.education_details,
        occupation_details: formData.occupation_details,
        family_details: formData.family_details,
        islamic_education: formData.islamic_education,
        whatsapp_number: formData.whatsapp_number,
        email: formData.email,
        preferred_age_range: formData.preferred_age_range,
        preferred_location: formData.preferred_location,
        partner_preferences: formData.partner_preferences,
        other_info: formData.other_info,
        verification_status: formData.verification_status,
        is_live: formData.is_live,
        admin_notes: formData.admin_notes,
        plan_type: (formData as any).plan_type || 'free',
        premium_expiry: (formData as any).premium_expiry || null,
      };

      const { error } = await supabase
        .from('registrations')
        .update(updatedRegistration)
        .eq('id', registration.id);

      if (error) throw error;

      // Keep public profiles in sync with (verified + live) rule
      await syncPublicProfile(updatedRegistration);

      // Send verification status email if status changed to verified or rejected
      const previousStatus = registration.verification_status;
      const newStatus = formData.verification_status;
      if (previousStatus !== newStatus && (newStatus === 'verified' || newStatus === 'rejected')) {
        sendVerificationStatusEmail(
          formData.full_name || registration.full_name,
          formData.email || registration.email,
          newStatus
        );
      }

      toast({ title: 'Registration updated successfully!' });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating registration:', error);
      toast({
        title: 'Error',
        description: 'Failed to update registration',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!registration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Registration Details - {registration.full_name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Photos Section */}
            {registration.photo_urls && registration.photo_urls.length > 0 && (
              <div>
                <Label className="text-base font-semibold">Photos</Label>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {registration.photo_urls.map((url, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={url}
                        alt={`Photo ${index + 1}`}
                        className="w-24 h-24 rounded-lg object-cover border hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Biodata */}
            {registration.biodata_url && (
              <div>
                <Label className="text-base font-semibold">Biodata</Label>
                <a
                  href={registration.biodata_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline block mt-1"
                >
                  View Biodata Document
                </a>
              </div>
            )}

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={formData.full_name || ''}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={formData.gender || ''}
                  onValueChange={(v) => handleChange('gender', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Height</Label>
                <Input
                  value={formData.height || ''}
                  onChange={(e) => handleChange('height', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Complexion</Label>
                <Input
                  value={formData.complexion || ''}
                  onChange={(e) => handleChange('complexion', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Marital Status</Label>
                <Select
                  value={formData.marital_status || ''}
                  onValueChange={(v) => handleChange('marital_status', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Caste</Label>
                <Input
                  value={formData.caste || ''}
                  onChange={(e) => handleChange('caste', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Maslak</Label>
                <Input
                  value={formData.maslak || ''}
                  onChange={(e) => handleChange('maslak', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Residence Location</Label>
                <Input
                  value={formData.residence_location || ''}
                  onChange={(e) => handleChange('residence_location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input
                  value={formData.whatsapp_number || ''}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>

            {/* Education & Profession */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Education Details</Label>
                <Textarea
                  value={formData.education_details || ''}
                  onChange={(e) => handleChange('education_details', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Occupation Details</Label>
                <Textarea
                  value={formData.occupation_details || ''}
                  onChange={(e) => handleChange('occupation_details', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Family Details</Label>
                <Textarea
                  value={formData.family_details || ''}
                  onChange={(e) => handleChange('family_details', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Islamic Education</Label>
                <Textarea
                  value={formData.islamic_education || ''}
                  onChange={(e) => handleChange('islamic_education', e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Partner Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold">Partner Preferences</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preferred Age Range</Label>
                  <Input
                    value={formData.preferred_age_range || ''}
                    onChange={(e) => handleChange('preferred_age_range', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Location</Label>
                  <Input
                    value={formData.preferred_location || ''}
                    onChange={(e) => handleChange('preferred_location', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Partner Preferences</Label>
                <Textarea
                  value={formData.partner_preferences || ''}
                  onChange={(e) => handleChange('partner_preferences', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Other Info */}
            <div className="space-y-2">
              <Label>Other Info</Label>
              <Textarea
                value={formData.other_info || ''}
                onChange={(e) => handleChange('other_info', e.target.value)}
                rows={2}
              />
            </div>

            {/* Admin Section */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Admin Controls</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Verification Status</Label>
                  <Select
                    value={formData.verification_status || ''}
                    onValueChange={(v) => {
                      handleChange('verification_status', v);
                      if (v === 'verified') {
                        handleChange('is_live', true);
                      } else {
                        handleChange('is_live', false);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Is Live</Label>
                  <Select
                    value={formData.is_live ? 'true' : 'false'}
                    onValueChange={(v) => handleChange('is_live', v === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes - Visible on Public Page</SelectItem>
                      <SelectItem value="false">No - Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Type</Label>
                  <Select
                    value={(formData as any).plan_type || 'free'}
                    onValueChange={(v) => handleChange('plan_type' as any, v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData as any).plan_type === 'premium' && (
                  <div className="space-y-2">
                    <Label>Premium Expiry Date</Label>
                    <Input
                      type="date"
                      value={(formData as any).premium_expiry ? new Date((formData as any).premium_expiry).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleChange('premium_expiry' as any, e.target.value ? new Date(e.target.value).toISOString() : '')}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Admin Notes (Internal)</Label>
                <Textarea
                  value={formData.admin_notes || ''}
                  onChange={(e) => handleChange('admin_notes', e.target.value)}
                  rows={3}
                  placeholder="Add internal notes about this registration..."
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
