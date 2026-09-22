import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SuccessDialog({ open, onClose }: SuccessDialogProps) {
  const navigate = useNavigate();
  const whatsappLink = "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi";

  const handleBrowseProfiles = () => {
    onClose();
    navigate("/profiles");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[92vw] p-0 border-0 bg-transparent shadow-none [&>button]:hidden z-[150]">
        <div className="bg-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-9 text-center shadow-2xl overflow-hidden relative">
          {/* Top Decorative Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-primary to-teal-900 text-white -mx-6 sm:-mx-9 -mt-6 sm:-mt-9 p-6 mb-6">
            <div className="text-2xl font-serif text-amber-200 mb-1">
              ﷽
            </div>
            <h3 className="text-lg font-bold tracking-tight text-emerald-100">
              Registration Submitted Alhamdulillah!
            </h3>
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-foreground mb-2">
            JazakAllahu Khairan!
          </h2>
          
          <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
            Aapka registration form successfully submit ho chuka hai. Hamari team 24 ghante ke andar aapka profile review karke WhatsApp par inform karegi.
          </p>

          <div className="bg-muted/40 p-3.5 rounded-xl border mb-6 text-xs text-foreground/80 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile ID & Verification details WhatsApp par send ki jayengi.</span>
          </div>

          {/* WhatsApp Community Action */}
          <div className="space-y-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-6 rounded-xl shadow-lg gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Join Official WhatsApp Community</span>
              </Button>
            </a>

            <Button
              variant="outline"
              size="lg"
              onClick={handleBrowseProfiles}
              className="w-full text-sm font-semibold h-11 gap-1.5"
            >
              <span>Browse Verified Profiles</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Close link */}
          <button
            onClick={onClose}
            className="mt-5 text-xs text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
          >
            Close and return to home
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
