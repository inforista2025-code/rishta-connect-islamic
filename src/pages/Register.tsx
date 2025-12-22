import { Navbar } from "@/components/Navbar";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function Register() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <div className="hero-gradient py-12 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-3">
          Registration Form
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Complete the form below to join our verified and halal matrimonial community.
        </p>
      </div>

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <RegistrationForm />
      </div>

      {/* Islamic Quote Section */}
      <div className="text-center py-8 px-4">
        <p className="text-base md:text-lg italic text-muted-foreground">
          "Nikah is half of faith – Prophet Muhammad ﷺ"
        </p>
      </div>
    </div>
  );
}
