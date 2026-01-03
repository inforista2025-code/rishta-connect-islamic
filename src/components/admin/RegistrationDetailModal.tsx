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

  const handleSave = async () => {
    if (!registration) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('registrations')
        .update({
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
        })
        .eq('id', registration.id);

      if (error) throw error;

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
                    <SelectItem value="Never Married">Never Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Separated">Separated</SelectItem>
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
