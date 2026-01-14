import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";

const GOOGLE_FORM_URL = "https://forms.gle/sY4jHKFHWTqb6yfD9";

export default function Register() {
  const handleGoogleFormClick = () => {
    window.open(GOOGLE_FORM_URL, "_blank", "noopener,noreferrer");
  };

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
        <div className="relative">
          {/* Google Form Button - Top right of form */}
          <Button
            size="sm"
            onClick={handleGoogleFormClick}
            className="absolute -top-4 right-4 text-xs px-4 py-2 h-8 bg-pink-500 text-white hover:bg-pink-600 rounded-lg shadow-lg shadow-pink-300/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-400/60 font-medium z-10"
          >
            Register via Google Form
          </Button>
          <RegistrationForm />
        </div>
      </div>

      {/* Islamic Quote Section */}
      <div className="text-center py-8 px-4">
        <p className="text-base md:text-lg italic text-muted-foreground">
          "Nikah is half of faith – Prophet Muhammad ﷺ"
        </p>
      </div>

      <Footer />
    </div>
  );
}