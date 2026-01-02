import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { SuccessDialog } from "./SuccessDialog";
import { registrationSchema, step1Schema, step2Schema, step3Schema, type RegistrationData } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const TOTAL_STEPS = 3;

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      photos: [],
      agreeToDeclaration: false,
    },
  });

  const validateCurrentStep = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await form.trigger([
        'email', 'fullName', 'gender', 'dateOfBirth', 
        'height', 'caste', 'complexion', 'maritalStatus', 'maslak'
      ]);
    } else if (currentStep === 2) {
      isValid = await form.trigger([
        'residenceLocation', 'educationDetails', 'occupationDetails',
        'familyDetails', 'whatsappNumber'
      ]);
    } else if (currentStep === 3) {
      isValid = await form.trigger([
        'preferredAgeRange', 'preferredLocation', 'partnerPreferences',
        'photos', 'agreeToDeclaration'
      ]);
    }
    
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data.path;
  };

  const sendToGoogleSheet = async (data: RegistrationData, photoUrls: string[], biodataUrl: string | null) => {
    const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzr0cvTmK8Dg2Pt2yies4NOuNaamMFurabOOt8VGlBiinmUHEorKqAyzYbzDPdsPmUp/exec';
    
    const payload = {
      email: data.email,
      full_name: data.fullName,
      gender: data.gender,
      date_of_birth: data.dateOfBirth.toISOString().split('T')[0],
      height: data.height,
      caste: data.caste,
      complexion: data.complexion,
      marital_status: data.maritalStatus,
      maslak: data.maslak,
      residence_location: data.residenceLocation,
      education_details: data.educationDetails,
      occupation_details: data.occupationDetails,
      family_details: data.familyDetails,
      whatsapp_number: data.whatsappNumber,
      preferred_age_range: data.preferredAgeRange,
      preferred_location: data.preferredLocation,
      partner_preferences: data.partnerPreferences,
      islamic_education: data.islamicEducation || '',
      other_info: data.otherInfo || '',
      photo_urls: photoUrls.join(', '),
      biodata_url: biodataUrl || '',
      referral: data.referral || '',
      submitted_at: new Date().toISOString()
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Google Sheet webhook error:', error);
    }
  };

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    
    try {
      // Upload photos and get full URLs
      const photoPaths: string[] = [];
      const photoFullUrls: string[] = [];
      for (let i = 0; i < data.photos.length; i++) {
        const file = data.photos[i];
        const timestamp = Date.now();
        const fileName = `${timestamp}-${i}-${file.name}`;
        const path = await uploadFile(file, 'registration-photos', fileName);
        photoPaths.push(path);
        
        // Get the full public URL for the webhook
        const { data: urlData } = supabase.storage.from('registration-photos').getPublicUrl(path);
        photoFullUrls.push(urlData.publicUrl);
      }

      // Upload biodata if provided
      let biodataPath: string | null = null;
      let biodataFullUrl: string | null = null;
      if (data.biodata) {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${data.biodata.name}`;
        biodataPath = await uploadFile(data.biodata, 'registration-biodatas', fileName);
        
        // Get the full public URL for the webhook
        const { data: urlData } = supabase.storage.from('registration-biodatas').getPublicUrl(biodataPath);
        biodataFullUrl = urlData.publicUrl;
      }

      // Insert registration data to the new registrations table (store full URLs)
      const { error: insertError } = await supabase
        .from('registrations')
        .insert({
          email: data.email,
          full_name: data.fullName,
          gender: data.gender,
          date_of_birth: data.dateOfBirth.toISOString().split('T')[0],
          height: data.height,
          caste: data.caste,
          complexion: data.complexion,
          marital_status: data.maritalStatus,
          maslak: data.maslak,
          residence_location: data.residenceLocation,
          education_details: data.educationDetails,
          occupation_details: data.occupationDetails,
          family_details: data.familyDetails,
          whatsapp_number: data.whatsappNumber,
          preferred_age_range: data.preferredAgeRange,
          preferred_location: data.preferredLocation,
          partner_preferences: data.partnerPreferences,
          islamic_education: data.islamicEducation || null,
          other_info: data.otherInfo || null,
          photo_urls: photoFullUrls,
          biodata_url: biodataFullUrl,
          referral: data.referral || null,
          verification_status: 'pending',
          is_live: false
        });

      if (insertError) throw insertError;

      // Send data to Google Sheet with full URLs (fire and forget)
      sendToGoogleSheet(data, photoFullUrls, biodataFullUrl);

      // Show success dialog
      setShowSuccessDialog(true);
      form.reset();

    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = async () => {
    return await validateCurrentStep();
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate('/');
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto card-shadow">
        <CardContent className="p-6 md:p-8">
          <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && <Step1 form={form} />}
              {currentStep === 2 && <Step2 form={form} />}
              {currentStep === 3 && <Step3 form={form} />}

              <div className="flex gap-4 pt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}

                {currentStep < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.formState.isValid}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Profile"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <SuccessDialog open={showSuccessDialog} onClose={handleSuccessClose} />
    </>
  );
}
