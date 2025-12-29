import { Navbar } from "@/components/Navbar";
import { RegistrationForm } from "@/components/RegistrationForm";
import registerBg from "@/assets/register-bg.png";

export default function Register() {
  return (
    <div className="min-h-screen relative">
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${registerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        {/* Header Section */}
        <div className="py-12 px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 drop-shadow-md">
            Registration Form
          </h1>
          <p className="text-sm md:text-base text-foreground/90 max-w-2xl mx-auto font-medium drop-shadow-sm">
            Complete the form below to join our verified and halal matrimonial community.
          </p>
        </div>

        {/* Registration Form */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <RegistrationForm />
        </div>

        {/* Islamic Quote Section */}
        <div className="text-center py-8 px-4">
          <p className="text-base md:text-lg italic text-foreground/90 font-medium drop-shadow-sm">
            "Nikah is half of faith – Prophet Muhammad ﷺ"
          </p>
        </div>
      </div>
    </div>
  );
}
