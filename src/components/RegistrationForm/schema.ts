import { z } from 'zod';

// Step 1 Schema
export const step1Schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  gender: z.enum(['Male', 'Female'], { required_error: "Please select your gender" }),
  dateOfBirth: z.date({ required_error: "Please select your date of birth" }),
  height: z.string().min(2, { message: "Please enter your height" }),
  caste: z.string().min(2, { message: "Please enter your caste" }),
  complexion: z.string().min(2, { message: "Please enter your complexion" }),
  maritalStatus: z.enum(['Single', 'Divorced', 'Widowed'], { required_error: "Please select marital status" }),
  maslak: z.string().min(2, { message: "Please enter your maslak" }),
});

// Step 2 Schema
export const step2Schema = z.object({
  residenceLocation: z.string().min(3, { message: "Please enter your city and state" }),
  educationDetails: z.string().min(3, { message: "Please provide your education details" }),
  occupationDetails: z.string().min(3, { message: "Please provide your occupation details" }),
  familyDetails: z.string().min(10, { message: "Please provide detailed family information" }),
  whatsappNumber: z.string()
    .min(10, { message: "Please enter a valid WhatsApp number" })
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
      message: "Please enter a valid phone number"
    }),
});

// Step 3 Schema
export const step3Schema = z.object({
  preferredAgeRange: z.string().min(3, { message: "Please enter preferred age range" }),
  preferredLocation: z.string().min(3, { message: "Please enter preferred location" }),
  partnerPreferences: z.string().min(10, { message: "Please provide partner preferences" }),
  islamicEducation: z.string().optional(),
  otherInfo: z.string().optional(),
  photos: z.custom<File[]>()
    .refine((files) => files && files.length >= 2, {
      message: "Please upload at least 2 photos"
    })
    .refine((files) => files && files.length <= 3, {
      message: "Maximum 3 photos allowed"
    })
    .refine(
      (files) => files && files.every((file) => file.size <= 10 * 1024 * 1024),
      { message: "Each photo must be less than 10MB" }
    )
    .refine(
      (files) => files && files.every((file) => 
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
      ),
      { message: "Only JPG, PNG, and WEBP images are allowed" }
    ),
  biodata: z.custom<File>()
    .optional()
    .refine(
      (file) => !file || file.size <= 10 * 1024 * 1024,
      { message: "Biodata must be less than 10MB" }
    )
    .refine(
      (file) => !file || file.type === 'application/pdf',
      { message: "Biodata must be a PDF file" }
    ),
  referral: z.string().optional(),
  agreeToDeclaration: z.boolean().refine((val) => val === true, {
    message: "You must agree to the declaration to proceed"
  }),
});

// Combined schema for all steps
export const registrationSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type RegistrationData = z.infer<typeof registrationSchema>;
