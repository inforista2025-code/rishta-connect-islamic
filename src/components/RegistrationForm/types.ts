export interface RegistrationFormData {
  // Step 1 - Personal Information
  email: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: Date;
  height: string;
  caste: string;
  complexion: string;
  maritalStatus: 'Single' | 'Divorced' | 'Widowed';
  maslak: string;

  // Step 2 - Family, Education & Contact
  residenceLocation: string;
  educationDetails: string;
  occupationDetails: string;
  familyDetails: string;
  whatsappNumber: string;

  // Step 3 - Preferences & Uploads
  preferredAgeRange: string;
  preferredLocation: string;
  partnerPreferences: string;
  islamicEducation?: string;
  otherInfo?: string;
  photos: File[];
  biodata?: File;
  referral?: string;
  agreeToDeclaration: boolean;
}
