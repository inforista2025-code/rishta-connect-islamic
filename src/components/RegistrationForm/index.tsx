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
import { compressImage } from "@/lib/imageCompression";

const TOTAL_STEPS = 3;

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string>("Submitting Profile...");
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
        'height', 'complexion', 'maritalStatus', 'maslak'
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

  const uploadFileWithTimeout = async (file: File, bucket: string, path: string, timeoutMs: number = 30000): Promise<string> => {
    const uploadPromise = async () => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error(`Upload error for ${bucket}:`, error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      return data.path;
    };

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout: Please check your internet connection and try with smaller photos')), timeoutMs);
    });

    try {
      return await Promise.race([uploadPromise(), timeoutPromise]);
    } catch (err: any) {
      console.error(`Upload exception for ${bucket}:`, err);
      if (err.message?.includes('fetch') || err.message?.includes('Network')) {
        throw new Error('Network connection error while uploading photos. Please retry.');
      }
      throw err;
    }
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
      console.warn('Google Sheet webhook error (non-blocking):', error);
    }
  };

  const sendRegistrationEmails = async (data: RegistrationData) => {
    try {
      const { error } = await supabase.functions.invoke('send-registration-emails', {
        body: {
          type: 'registration',
          full_name: data.fullName,
          email: data.email,
          gender: data.gender,
          city: data.residenceLocation,
          whatsapp_number: data.whatsappNumber,
        },
      });
      if (error) {
        console.warn('Email sending failed (non-blocking):', error);
      }
    } catch (err) {
      console.warn('Email sending failed (non-blocking):', err);
    }
  };

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    setSubmitStatus("Preparing photos...");
    
    try {
      // 1. Validate photos exist
      if (!data.photos || data.photos.length < 2) {
        throw new Error('Please upload at least 2 photos before submitting');
      }

      // 2. Compress and upload photos
      const photoFullUrls: string[] = [];
      for (let i = 0; i < data.photos.length; i++) {
        const originalFile = data.photos[i];
        
        // Fast client-side image compression
        setSubmitStatus(`Optimizing photo ${i + 1} of ${data.photos.length}...`);
        let fileToUpload: File = originalFile;
        try {
          fileToUpload = await compressImage(originalFile);
        } catch (compErr) {
          console.warn(`Compression fallback for photo ${i + 1}:`, compErr);
          fileToUpload = originalFile;
        }

        // Sanitize filename
        const sanitizedName = fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const timestamp = Date.now();
        const fileName = `${timestamp}-${i}-${sanitizedName}`;
        
        setSubmitStatus(`Uploading photo ${i + 1} of ${data.photos.length}...`);
        const path = await uploadFileWithTimeout(fileToUpload, 'registration-photos', fileName, 25000);
        
        // Get public URL
        const { data: urlData } = supabase.storage.from('registration-photos').getPublicUrl(path);
        photoFullUrls.push(urlData.publicUrl);
      }

      // 3. Upload optional biodata PDF if provided
      let biodataFullUrl: string | null = null;
      if (data.biodata) {
        setSubmitStatus("Uploading biodata document...");
        const sanitizedName = data.biodata.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const timestamp = Date.now();
        const fileName = `${timestamp}-${sanitizedName}`;
        const biodataPath = await uploadFileWithTimeout(data.biodata, 'registration-biodatas', fileName, 25000);
        
        const { data: urlData } = supabase.storage.from('registration-biodatas').getPublicUrl(biodataPath);
        biodataFullUrl = urlData.publicUrl;
      }

      // 4. Calculate age & DOB
      setSubmitStatus("Saving your profile biodata...");
      const today = new Date();
      const birthDate = new Date(data.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      const dobFormatted = data.dateOfBirth.toISOString().split('T')[0];

      // 5. Insert into profiles_data table
      const { error: insertError } = await supabase
        .from('profiles_data')
        .insert({
          name: data.fullName,
          gender: data.gender,
          age: String(age),
          dob: dobFormatted,
          date_of_birth: dobFormatted,
          location: data.residenceLocation,
          height: data.height,
          complexion: data.complexion,
          education: data.educationDetails,
          profession: data.occupationDetails,
          marital_status: data.maritalStatus,
          caste: data.caste,
          maslak: data.maslak,
          islamic_knowledge: data.islamicEducation || null,
          family: data.familyDetails,
          preferred_partner: data.partnerPreferences,
          preferred_location: data.preferredLocation,
          preferred_age: data.preferredAgeRange,
          email: data.email,
          whatsapp_number: data.whatsappNumber,
          photo_urls: photoFullUrls,
          biodata_url: biodataFullUrl,
          other_info: data.otherInfo || null,
          verification_status: 'pending',
          is_live: false,
          plan_type: 'free',
        } as any);

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error('Failed to save profile. Please check details and try again.');
      }

      // 6. Background tasks (fire and forget)
      sendToGoogleSheet(data, photoFullUrls, biodataFullUrl);
      sendRegistrationEmails(data);

      // 7. Show success dialog
      setShowSuccessDialog(true);
      form.reset();

    } catch (error: any) {
      console.error('Submission error:', error);
      
      let errorMessage = 'Failed to submit registration. Please try again.';
      if (error.message?.includes('Network') || error.message?.includes('fetch') || error.message?.includes('timeout')) {
        errorMessage = error.message;
      } else if (error.message?.includes('upload') || error.message?.includes('Upload')) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setSubmitStatus("Submitting Profile...");
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
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                toast({
                  title: errors.photos ? "Photos required" : "Please complete the form",
                  description: errors.photos
                    ? String(errors.photos.message || "Please upload at least 2 photos")
                    : "Kuch fields adhoore hain, unhe theek karke dobara submit karein.",
                  variant: "destructive",
                });
              })}
              className="space-y-6"
            >
              <div key={currentStep} className="animate-in fade-in-50 duration-300">
                {currentStep === 1 && <Step1 form={form} />}
                {currentStep === 2 && <Step2 form={form} />}
                {currentStep === 3 && <Step3 form={form} />}
              </div>

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
                    disabled={isSubmitting}
                    className="flex-1 font-bold h-11 transition-all cursor-pointer shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                        <span>{submitStatus}</span>
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
