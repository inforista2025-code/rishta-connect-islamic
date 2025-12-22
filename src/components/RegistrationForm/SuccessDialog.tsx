import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SuccessDialog({ open, onClose }: SuccessDialogProps) {
  const whatsappLink = "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95vw] p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
        <div className="bg-gradient-to-b from-pink-50 to-rose-100 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle2 className="w-16 h-16 md:w-20 md:h-20 text-green-500" />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Thank you!
          </h2>
          
          <p className="text-lg md:text-xl text-foreground/90 mb-6 leading-relaxed">
            Your form has been submitted successfully.
          </p>
          
          <p className="text-base md:text-lg text-foreground/80 mb-8 leading-relaxed">
            Our team will review your profile and contact you soon on WhatsApp.
          </p>

          <p className="text-sm md:text-base text-foreground/70 mb-6">
            For all new updates and latest profiles, please join our WhatsApp Community Channel below:
          </p>

          {/* WhatsApp Button */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full"
          >
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-600 text-white font-semibold text-base md:text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Join WhatsApp Community
            </Button>
          </a>

          {/* Close link */}
          <button
            onClick={onClose}
            className="mt-6 text-sm text-foreground/60 hover:text-foreground/80 underline transition-colors"
          >
            Close and return to home
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
