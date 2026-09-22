import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, Heart, MessageCircle, CheckCircle, Sparkles, HelpCircle } from "lucide-react";

export default function Register() {
  const handleWhatsAppHelp = () => {
    window.open("https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20need%20assistance%20with%20Matrimonial%20Registration%20Form.", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Islamic Premium Header Section */}
      <div className="relative bg-gradient-to-b from-primary/15 via-muted/30 to-background pt-10 pb-12 px-4 text-center overflow-hidden border-b">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Bismillah Calligraphy */}
          <div className="text-3xl sm:text-4xl font-serif text-primary/80 mb-2">
            ﷽
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-3">
            Islamic Matrimonial Registration
          </h1>
          
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
            Find a righteous life partner according to the Quran & Sunnah. Fill out the biodata form below to join our verified matrimonial network.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/50 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Free & Verified Profiles</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300/50 shadow-sm">
              <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Complete Photo & Contact Privacy</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/50 shadow-sm">
              <Heart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Halal Matchmaking</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <RegistrationForm />

          {/* Need Help WhatsApp Banner */}
          <div className="mt-8 bg-gradient-to-r from-emerald-800 via-primary to-teal-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6 text-amber-200" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Form Bharne Me Koi Pareshani?</h4>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Aap seedhe hamare WhatsApp support par apna Biodata send karke bhi register karwa sakte hain.
                </p>
              </div>
            </div>

            <Button
              onClick={handleWhatsAppHelp}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 h-11 rounded-xl shadow-sm shrink-0 gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Support</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Islamic Hadith Quote Section */}
      <div className="text-center py-6 px-4 bg-muted/20 border-t">
        <p className="text-sm sm:text-base italic text-muted-foreground">
          "When a person marries, they have fulfilled half of their religion, so let them fear Allah regarding the remaining half." – Prophet Muhammad ﷺ (Al-Bayhaqi)
        </p>
      </div>

      <Footer />
    </div>
  );
}