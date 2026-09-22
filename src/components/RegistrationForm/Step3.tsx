import { UseFormReturn } from "react-hook-form";
import { RegistrationData } from "./schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, FileText, Sparkles, HeartHandshake, ShieldCheck, Image as ImageIcon, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Step3Props {
  form: UseFormReturn<RegistrationData>;
}

export function Step3({ form }: Step3Props) {
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [biodataFile, setBiodataFile] = useState<File | null>(null);
  const photos = form.watch('photos') || [];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const currentPhotos = form.getValues('photos') || [];
      if (currentPhotos.length + files.length > 3) {
        toast({
          title: "Maximum 3 photos allowed",
          description: "Aap zyada se zyada 3 photos upload kar sakte hain.",
          variant: "destructive",
        });
      }
      const newPhotos = [...currentPhotos, ...files].slice(0, 3);
      form.setValue('photos', newPhotos, { shouldValidate: true });
      
      // Generate previews
      const newPreviews = newPhotos.map(file => URL.createObjectURL(file));
      setPhotoPreviews(newPreviews);
    }
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    const currentPhotos = form.getValues('photos') || [];
    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    form.setValue('photos', newPhotos, { shouldValidate: true });
    
    if (photoPreviews[index]) {
      URL.revokeObjectURL(photoPreviews[index]);
    }
    setPhotoPreviews(newPhotos.map(file => URL.createObjectURL(file)));
  };

  const handleBiodataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('biodata', file, { shouldValidate: true });
      setBiodataFile(file);
    }
  };

  const removeBiodata = () => {
    form.setValue('biodata', undefined);
    setBiodataFile(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="border-b pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-primary" />
          <span>Partner Preferences & Photo Upload</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Tell us about your expectations for a life partner & upload recent photos
        </p>
      </div>

      {/* Partner Expectations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="preferredAgeRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Preferred Age Range *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 22–27 years" {...field} className="h-11" />
              </FormControl>
              <FormDescription className="text-[11px]">
                Acceptable age range for partner.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Preferred Location / State *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mumbai, UP, Bihar, Gulf or Any" {...field} className="h-11" />
              </FormControl>
              <FormDescription className="text-[11px]">
                Preferred cities/states for marriage.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="partnerPreferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">Partner Expectations & Qualities *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe expectations regarding education, religiousness (Namazi/Deeni), profession, nature, family background, etc."
                className="min-h-[110px] text-sm leading-relaxed"
                {...field} 
              />
            </FormControl>
            <FormDescription className="text-[11px]">
              Be clear and polite about the qualities you seek in your future spouse.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Islamic Education & Extra Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="islamicEducation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Islamic / Deeni Knowledge (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Quran Nazra, Hifz, Aalimah, Namazi" {...field} className="h-11" />
              </FormControl>
              <FormDescription className="text-[11px]">
                Madrasa / Islamic courses if any.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otherInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Any Other Details (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Any extra information or special preference" {...field} className="h-11" />
              </FormControl>
              <FormDescription className="text-[11px]">
                Hobbies, dietary habits, or relocation preferences.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Photo Upload Section */}
      <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 space-y-4">
        <div>
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span>Candidate Photo Upload (1 to 3 Photos) *</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload clear, recent portraits. Blurry, group, or heavily filtered photos will delay verification.
          </p>
        </div>

        <FormField
          control={form.control}
          name="photos"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="space-y-4">
                  {photos.length < 3 && (
                    <div className="border-2 border-dashed border-primary/40 rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer bg-background">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer block">
                        <Upload className="w-9 h-9 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-bold text-foreground">Click or Drag to Upload Photos</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {photos.length}/3 photos selected • JPG, PNG, WEBP (Max 10MB each)
                        </p>
                      </label>
                    </div>
                  )}
                  
                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden border-2 border-primary/30 shadow-sm bg-card aspect-square">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              ⭐ Main Card Photo
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-white rounded-full p-1.5 shadow-md transition-all cursor-pointer"
                            title="Remove Photo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Biodata PDF (Optional) */}
      <FormField
        control={form.control}
        name="biodata"
        render={() => (
          <FormItem>
            <FormLabel className="text-sm font-semibold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              <span>Full Biodata File (PDF Document - Optional)</span>
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                {!biodataFile ? (
                  <div className="border border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-card">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleBiodataChange}
                      className="hidden"
                      id="biodata-upload"
                    />
                    <label htmlFor="biodata-upload" className="cursor-pointer flex items-center justify-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">Upload Prepared Biodata PDF (Max 10MB)</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">{biodataFile.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {(biodataFile.size / 1024 / 1024).toFixed(2)} MB PDF
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeBiodata}
                      className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Referral */}
      <FormField
        control={form.control}
        name="referral"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">How did you hear about us? / Referred By (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., WhatsApp group, Friend/Relative name, Instagram, etc." {...field} className="h-11" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Islamic Declaration */}
      <FormField
        control={form.control}
        name="agreeToDeclaration"
        render={({ field }) => (
          <FormItem className="rounded-2xl border-2 border-emerald-500/30 p-5 bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20 shadow-sm">
            <div className="flex items-start space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
              </FormControl>
              <div className="space-y-2 leading-tight flex-1">
                <FormLabel className="font-bold text-sm sm:text-base text-foreground cursor-pointer flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>I Confirm and Agree to the Islamic Declaration *</span>
                </FormLabel>
                <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed pt-1">
                  <p>✔ All details provided are true, accurate, and submitted for the pure purpose of Nikah.</p>
                  <p>✔ I understand the platform will verify my details before publishing.</p>
                  <p>✔ Photos and personal details remain confidential under Islamic privacy guidelines.</p>
                </div>
                <FormMessage />
              </div>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
