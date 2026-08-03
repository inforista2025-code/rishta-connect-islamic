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
import { Label } from "@/components/ui/label";
import { Upload, X, FileText } from "lucide-react";
import { useState } from "react";

interface Step3Props {
  form: UseFormReturn<RegistrationData>;
}

export function Step3({ form }: Step3Props) {
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [biodataFile, setBiodataFile] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const currentPhotos = form.getValues('photos') || [];
      const newPhotos = [...currentPhotos, ...files].slice(0, 3);
      form.setValue('photos', newPhotos, { shouldValidate: true });
      
      // Generate previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPhotoPreviews(prev => [...prev, ...newPreviews].slice(0, 3));
    }
  };

  const removePhoto = (index: number) => {
    const currentPhotos = form.getValues('photos') || [];
    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    form.setValue('photos', newPhotos, { shouldValidate: true });
    
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Preferences & Uploads</h2>

      <FormField
        control={form.control}
        name="preferredAgeRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Partner Age Range *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 22-28" {...field} />
            </FormControl>
            <FormDescription>
              Enter acceptable age range (e.g., 22–28).
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
            <FormLabel>Preferred Location *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Mumbai, Delhi, or Any" {...field} />
            </FormControl>
            <FormDescription>
              Enter preferred location for marriage.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="partnerPreferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Partner Preferences *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your preferences regarding looks, education, nature, religiousness, etc."
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Looks, education, nature, religiousness, etc.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="islamicEducation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Islamic Education (if any)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Hifz, Aalimah course, Madrasa studies" {...field} />
            </FormControl>
            <FormDescription>
              Optional (Hifz, Aalimah course, Madrasa studies)
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
            <FormLabel>Any Other Info</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any extra details you want to add"
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Any extra details you want to add.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="photos"
        render={() => (
          <FormItem>
            <FormLabel>Photo Upload (Minimum 2 required, max 3) *</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                    disabled={photoPreviews.length >= 3}
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Click to upload photos</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {photoPreviews.length}/3 photos uploaded
                    </p>
                  </label>
                </div>
                
                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Upload recent original photos only. Screenshot, blurry, group or cropped photos are not accepted. Upload at least 2 photos (maximum 3).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="biodata"
        render={() => (
          <FormItem>
            <FormLabel>Biodata Upload (PDF, optional)</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {!biodataFile ? (
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleBiodataChange}
                      className="hidden"
                      id="biodata-upload"
                    />
                    <label htmlFor="biodata-upload" className="cursor-pointer">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">Click to upload biodata (PDF)</p>
                      <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{biodataFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(biodataFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeBiodata}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Upload your biodata if available (PDF, max 10MB).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="referral"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Referral (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter referrer's name if any" {...field} />
            </FormControl>
            <FormDescription>
              If someone referred this form to you, enter their name. If not, leave blank.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="agreeToDeclaration"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-primary/30 p-4 bg-primary/5">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="font-normal cursor-pointer">
                <span className="font-semibold">I Agree to the Declaration *</span>
              </FormLabel>
              <FormDescription className="text-xs mt-2" asChild>
                <ul className="list-disc pl-4 space-y-1.5">
                  <li>I confirm that all details and information submitted by me are true, accurate, and correct.</li>
                  <li>I understand and agree that the platform may request official ID proof for verification purposes.</li>
                  <li>I take full responsibility for any incorrect, false, or misleading information provided by me.</li>
                  <li>The platform is not responsible or liable for any false or incorrect details submitted by me.</li>
                  <li>I agree to adhere to the Islamic etiquettes and community guidelines of the platform.</li>
                </ul>
              </FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
