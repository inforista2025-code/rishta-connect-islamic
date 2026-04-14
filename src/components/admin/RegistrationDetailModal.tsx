import { useState, useEffect, useRef, useCallback } from 'react';
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
import { Loader2, Save, X, Upload, Trash2, RefreshCw } from 'lucide-react';
import { compressImage } from '@/lib/imageCompression';

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

interface RegistrationDetailModalProps {
  profile: ProfileRecord | null;
  isOpen: boolean;
  isAddMode: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const emptyProfile: Partial<ProfileRecord> = {
  name: '',
  gender: 'Male',
  age: '',
  dob: '',
  location: '',
  height: '',
  complexion: '',
  education: '',
  profession: '',
  marital_status: 'Single',
  caste: '',
  maslak: '',
  islamic_knowledge: '',
  family: '',
  preferred_partner: '',
  preferred_location: '',
  preferred_age: '',
  email: '',
  whatsapp_number: '',
  other_info: '',
  verification_status: 'pending',
  is_live: false,
  plan_type: 'free',
  premium_expiry: null,
  admin_notes: '',
  date_of_birth: '',
  photo_urls: [],
  biodata_url: '',
};

export function RegistrationDetailModal({
  profile,
  isOpen,
  isAddMode,
  onClose,
  onUpdate,
}: RegistrationDetailModalProps) {
  const [formData, setFormData] = useState<Partial<ProfileRecord>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isAddMode) {
      setFormData({ ...emptyProfile });
    } else if (profile) {
      setFormData({ ...profile });
    }
  }, [profile, isAddMode]);

  const handleChange = (field: string, value: string | boolean | string[] | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadCompressedPhoto = async (file: File): Promise<string> => {
    toast({ title: 'Compressing image...', description: 'Resizing & converting to WebP' });
    const compressed = await compressImage(file);
    
    const sanitizedName = compressed.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `admin-${Date.now()}-${sanitizedName}`;
    
    const { data, error } = await supabase.storage
      .from('registration-photos')
      .upload(fileName, compressed, { cacheControl: '3600', upsert: false });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data: urlData } = supabase.storage
      .from('registration-photos')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadCompressedPhoto(files[i]);
        newUrls.push(url);
      }

      const currentUrls = formData.photo_urls || [];
      handleChange('photo_urls', [...currentUrls, ...newUrls]);
      toast({ title: `${newUrls.length} photo(s) uploaded successfully!` });
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReplacePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || replacingIndex === null) return;

    setUploading(true);
    try {
      const url = await uploadCompressedPhoto(files[0]);
      const updatedUrls = [...(formData.photo_urls || [])];
      updatedUrls[replacingIndex] = url;
      handleChange('photo_urls', updatedUrls);
      toast({ title: 'Photo replaced successfully!' });
    } catch (error: any) {
      console.error('Photo replace error:', error);
      toast({ title: 'Replace failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      setReplacingIndex(null);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedUrls = [...(formData.photo_urls || [])];
    updatedUrls.splice(index, 1);
    handleChange('photo_urls', updatedUrls);
    toast({ title: 'Photo removed' });
  };

  const triggerReplace = (index: number) => {
    setReplacingIndex(index);
    replaceFileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!formData.name || !formData.gender) {
      toast({ title: 'Name and Gender are required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      let age = formData.age || '';
      let dob = formData.dob || '';
      if (formData.date_of_birth) {
        const dobDate = new Date(formData.date_of_birth);
        const today = new Date();
        age = String(Math.floor((today.getTime() - dobDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)));
        dob = `${String(dobDate.getDate()).padStart(2, '0')}/${String(dobDate.getMonth() + 1).padStart(2, '0')}/${dobDate.getFullYear()}`;
      }

      const payload: any = {
        name: formData.name,
        gender: formData.gender,
        age,
        dob,
        location: formData.location || '',
        height: formData.height || '',
        complexion: formData.complexion || '',
        education: formData.education || '',
        profession: formData.profession || '',
        marital_status: formData.marital_status || 'Single',
        caste: formData.caste || null,
        maslak: formData.maslak || null,
        islamic_knowledge: formData.islamic_knowledge || null,
        family: formData.family || '',
        preferred_partner: formData.preferred_partner || '',
        preferred_location: formData.preferred_location || '',
        preferred_age: formData.preferred_age || '',
        email: formData.email || null,
        whatsapp_number: formData.whatsapp_number || null,
        other_info: formData.other_info || null,
        verification_status: formData.verification_status || 'pending',
        is_live: formData.is_live ?? false,
        plan_type: formData.plan_type || 'free',
        premium_expiry: formData.premium_expiry || null,
        admin_notes: formData.admin_notes || null,
        date_of_birth: formData.date_of_birth || null,
        photo_urls: formData.photo_urls || [],
      };

      if (isAddMode) {
        const { data: maxOrderData } = await supabase
          .from('profiles_data')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1);
        payload.display_order = (maxOrderData?.[0]?.display_order ?? 0) + 1;

        const { error } = await supabase.from('profiles_data').insert(payload);
        if (error) throw error;
        toast({ title: 'New profile created successfully!' });
      } else if (profile) {
        const { error } = await supabase
          .from('profiles_data')
          .update(payload)
          .eq('id', profile.id);
        if (error) throw error;

        if (profile.registration_id) {
          await supabase
            .from('registrations')
            .update({
              full_name: payload.name,
              gender: payload.gender,
              residence_location: payload.location,
              height: payload.height,
              complexion: payload.complexion,
              education_details: payload.education,
              occupation_details: payload.profession,
              marital_status: payload.marital_status,
              caste: payload.caste,
              maslak: payload.maslak,
              islamic_education: payload.islamic_knowledge,
              family_details: payload.family,
              partner_preferences: payload.preferred_partner,
              preferred_location: payload.preferred_location,
              preferred_age_range: payload.preferred_age,
              email: payload.email,
              whatsapp_number: payload.whatsapp_number,
              other_info: payload.other_info,
              verification_status: payload.verification_status,
              is_live: payload.is_live,
              plan_type: payload.plan_type,
              premium_expiry: payload.premium_expiry,
              admin_notes: payload.admin_notes,
              photo_urls: payload.photo_urls,
            } as any)
            .eq('id', profile.registration_id);
        }

        toast({ title: 'Profile updated successfully!' });
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: 'Error', description: 'Failed to save profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isAddMode ? 'Add New Profile' : `Profile Details - ${profile?.name || ''}`}
          </DialogTitle>
        </DialogHeader>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handlePhotoUpload}
        />
        <input
          ref={replaceFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleReplacePhoto}
        />

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Photos Section */}
            <div>
              <Label className="text-base font-semibold">Photos</Label>
              <div className="flex gap-3 mt-2 flex-wrap">
                {(formData.photo_urls || []).map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-24 h-24 rounded-lg object-cover border cursor-pointer"
                      onClick={() => setPreviewPhoto(url)}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-white hover:bg-white/20"
                        onClick={() => triggerReplace(index)}
                        disabled={uploading}
                        title="Replace"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-white hover:bg-red-500/50"
                        onClick={() => handleRemovePhoto(index)}
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span className="text-[10px]">Add Photo</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Images auto-compressed to WebP (max 800px, ~300KB)
              </p>
            </div>

            {/* Biodata */}
            {formData.biodata_url && (
              <div>
                <Label className="text-base font-semibold">Biodata</Label>
                <a
                  href={formData.biodata_url}
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
                <Label>Name *</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select
                  value={formData.gender || 'Male'}
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
                  value={formData.marital_status || 'Single'}
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
                <Label>Location</Label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
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
                  value={formData.education || ''}
                  onChange={(e) => handleChange('education', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Occupation Details</Label>
                <Textarea
                  value={formData.profession || ''}
                  onChange={(e) => handleChange('profession', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Family Details</Label>
                <Textarea
                  value={formData.family || ''}
                  onChange={(e) => handleChange('family', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Islamic Education</Label>
                <Textarea
                  value={formData.islamic_knowledge || ''}
                  onChange={(e) => handleChange('islamic_knowledge', e.target.value)}
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
                    value={formData.preferred_age || ''}
                    onChange={(e) => handleChange('preferred_age', e.target.value)}
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
                  value={formData.preferred_partner || ''}
                  onChange={(e) => handleChange('preferred_partner', e.target.value)}
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
                    value={formData.verification_status || 'pending'}
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
                    value={formData.plan_type || 'free'}
                    onValueChange={(v) => handleChange('plan_type', v)}
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

                {formData.plan_type === 'premium' && (
                  <div className="space-y-2">
                    <Label>Premium Expiry Date</Label>
                    <Input
                      type="date"
                      value={formData.premium_expiry ? new Date(formData.premium_expiry).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleChange('premium_expiry', e.target.value ? new Date(e.target.value).toISOString() : null)}
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
                  placeholder="Add internal notes about this profile..."
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
          <Button onClick={handleSave} disabled={saving || uploading}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isAddMode ? 'Create Profile' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

      {/* Photo Preview Lightbox */}
      <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
        <DialogContent className="max-w-3xl p-2 bg-black/90 border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Photo Preview</DialogTitle>
          </DialogHeader>
          {previewPhoto && (
            <img
              src={previewPhoto}
              alt="Full preview"
              className="w-full h-auto max-h-[85vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
  );
}
