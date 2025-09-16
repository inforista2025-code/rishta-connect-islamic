import { MessageCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingContactWidget() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/1234567890", "_blank");
  };

  const handleCallClick = () => {
    window.open("tel:+911234567890", "_self");
  };

  const handleMessageClick = () => {
    window.open("mailto:contact@rishtamatrimony.com", "_self");
  };

  return (
    <>
      {/* WhatsApp Button - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={handleWhatsAppClick}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Call Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleCallClick}
          className="px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <Phone className="w-5 h-5" />
          <span className="hidden sm:inline">Call Now</span>
        </Button>
      </div>

      {/* Personal Message Button - Bottom Center */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={handleMessageClick}
          className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          size="icon"
        >
          <Mail className="w-5 h-5 text-white" />
        </Button>
      </div>
    </>
  );
}