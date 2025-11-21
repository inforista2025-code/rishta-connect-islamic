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

interface Step2Props {
  form: UseFormReturn<RegistrationData>;
}

export function Step2({ form }: Step2Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Family, Education & Contact Details</h2>

      <FormField
        control={form.control}
        name="residenceLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Residence Location (City, State) *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Mumbai, Maharashtra" {...field} />
            </FormControl>
            <FormDescription>
              Enter current city and state of residence.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="educationDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Education Details *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="e.g., B.Tech Computer Science from XYZ University"
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Provide your highest education details.
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
            <FormLabel>Occupation Details *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="e.g., Software Engineer at ABC Company"
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Provide your job/occupation details.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="familyDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Family Details *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Father name + occupation, Mother name + occupation, Brother/Sister name + occupation, marital status (Married/Unmarried), mention 'Late' if any member has passed away"
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Father/Mother name + occupation, Brother/Sister name + occupation, marital status (Married/Unmarried), mention 'Late' if any member has passed away.
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
            <FormLabel>WhatsApp Number *</FormLabel>
            <FormControl>
              <Input 
                placeholder="+91-9128719875" 
                type="tel"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Enter a valid WhatsApp number. Verification message will be sent on this number.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
