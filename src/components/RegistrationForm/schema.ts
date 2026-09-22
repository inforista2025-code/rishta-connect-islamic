import { z } from 'zod';

// Step 1 Schema
export const step1Schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address (e.g. name@gmail.com)" }),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  gender: z.enum(['Male', 'Female'], { required_error: "Please select gender" }),
  dateOfBirth: z.date({ required_error: "Please select your date of birth" }),
  height: z.string().min(1, { message: "Please select or enter height" }),
  caste: z.string().optional().default(""),
  complexion: z.string().min(1, { message: "Please select complexion" }),
  maritalStatus: z.enum(['Single', 'Divorced', 'Widowed', 'Khula'], { required_error: "Please select marital status" }),
  maslak: z.string().min(2, { message: "Please select or enter your maslak/sect" }),
});

// Step 2 Schema
export const step2Schema = z.object({
  residenceLocation: z.string().min(2, { message: "Please enter your city and state" }),
  educationDetails: z.string().min(2, { message: "Please provide education details" }),
  occupationDetails: z.string().min(2, { message: "Please provide occupation / profession details" }),
  familyDetails: z.string().min(5, { message: "Please provide brief family details (Parents, Siblings)" }),
  whatsappNumber: z.string()
    .min(10, { message: "Please enter a valid 10-digit WhatsApp number" })
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
      message: "Please enter a valid contact number"
    }),
});

// Step 3 Schema
export const step3Schema = z.object({
  preferredAgeRange: z.string().min(2, { message: "Please enter preferred age range (e.g., 22-26)" }),
  preferredLocation: z.string().min(2, { message: "Please enter preferred location (e.g., Mumbai, Bihar, or Any)" }),
  partnerPreferences: z.string().min(5, { message: "Please describe your expectations for a partner" }),
  islamicEducation: z.string().optional().default(""),
  otherInfo: z.string().optional().default(""),
  photos: z.custom<File[]>()
    .refine((files) => files && files.length >= 1, {
      message: "Please upload at least 1 recent photo (2-3 recommended)"
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
  referral: z.string().optional().default(""),
  agreeToDeclaration: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Islamic declaration to proceed"
  }),
});

// Combined schema for all steps
export const registrationSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type RegistrationData = z.infer<typeof registrationSchema>;
