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
import { MapPin, GraduationCap, Briefcase, Users, MessageCircle, Info } from "lucide-react";

interface Step2Props {
  form: UseFormReturn<RegistrationData>;
}

export function Step2({ form }: Step2Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="border-b pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <span>Education, Career & Family Details</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Share your professional background, location and family information
        </p>
      </div>

      {/* Residence Location & WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="residenceLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Current City & State *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mumbai, Maharashtra / Ranchi, Jharkhand" {...field} className="h-11" />
              </FormControl>
              <FormDescription className="text-[11px]">
                City & state where candidate currently resides.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whatsappNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                <span>Official WhatsApp Number *</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="9128719875 (10-digit number)" 
                    type="tel"
                    {...field} 
                    className="h-11 pl-3"
                  />
                </div>
              </FormControl>
              <FormDescription className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                🔒 Kept confidential. Only used for ID verification & direct matching.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Education & Occupation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="educationDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                <span>Highest Qualification / Degree *</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., B.Tech / MBA / BCA / M.Com / Doctor / Graduate"
                  {...field} 
                  className="h-11"
                />
              </FormControl>
              <FormDescription className="text-[11px]">
                Highest completed degree and college/university.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupationDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <span>Occupation / Job / Business *</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Software Engineer / Govt Teacher / Business / Homemaker"
                  {...field} 
                  className="h-11"
                />
              </FormControl>
              <FormDescription className="text-[11px]">
                Company/Designation or Business details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Family Details Card */}
      <div className="bg-muted/30 p-4 sm:p-5 rounded-2xl border border-border/80 space-y-3">
        <FormField
          control={form.control}
          name="familyDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-base font-bold">
                <Users className="w-4 h-4 text-primary" />
                <span>Family Background Details *</span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="• Father Name & Occupation:&#10;• Mother Name & Occupation:&#10;• Brothers (e.g., 2 Brothers - 1 Married, 1 Studying):&#10;• Sisters (e.g., 1 Sister - Married):&#10;• Native Place / Family Status:"
                  className="min-h-[130px] bg-background text-sm leading-relaxed"
                  {...field} 
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground flex items-start gap-1 mt-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                <span>Parents name, occupation, brothers/sisters (married/unmarried) details bharein. Agar koi member inteqal kar chuke hain to 'Late' likhein.</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
