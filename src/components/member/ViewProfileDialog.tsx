import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Crown, Lock, FileText, Mail, Phone } from "lucide-react";
import { useMemberApi } from "@/hooks/useMemberApi";
import { useNavigate } from "react-router-dom";
import { ProfilePhoto } from "./ProfilePhoto";

export function ViewProfileDialog({ open, onOpenChange, targetId }: { open: boolean; onOpenChange: (v: boolean) => void; targetId: number | null }) {
  const { call } = useMemberApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !targetId) return;
    setLoading(true);
    call("view_profile", { target_id: targetId })
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [open, targetId, call]);

  const isPremium = data?.viewer_is_premium;
  const p = data?.profile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {loading || !p ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {p.name}
                {p.is_premium && <Badge className="bg-purple-600"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
              </DialogTitle>
              <DialogDescription>{p.age} yrs · {p.location}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {(p.photo_urls || []).slice(0, isPremium ? 6 : 1).map((u: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { if (isPremium && !p.photo_blurred) setLightbox(u); }}
                  className={isPremium && !p.photo_blurred ? "cursor-zoom-in focus:outline-none" : "cursor-default"}
                  aria-label="View photo"
                >
                  <ProfilePhoto src={u} alt={p.name} blurred={p.photo_blurred} size="full" className="aspect-square" showLockHint />
                </button>
              ))}
              {!isPremium && (p.photo_count ?? 0) > 1 && (
                <div className="aspect-square rounded-lg border-2 border-dashed border-primary/40 flex flex-col items-center justify-center text-center p-2 bg-primary/5">
                  <Lock className="w-5 h-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">+{(p.photo_count ?? 1) - 1} more</span>
                  <span className="text-xs font-medium text-primary">Premium only</span>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Info label="Gender" value={p.gender} />
              <Info label="Age" value={p.age} />
              <Info label="Marital Status" value={p.marital_status} />
              <Info label="Location" value={p.location} />
              <Info label="Education" value={p.education} />
              <Info label="Profession" value={p.profession} />
              <Info label="Height" value={p.height} />
              <Info label="Complexion" value={p.complexion} />
              <Info label="Maslak" value={p.maslak} />
              <Info label="Caste" value={p.caste} />
            </div>

            {isPremium ? (
              <div className="mt-4 space-y-3">
                <Section title="Family Details" body={p.family} />
                <Section title="Islamic Knowledge" body={p.islamic_knowledge} />
                <Section title="Partner Preferences" body={p.preferred_partner} />
                <Section title="Preferred Location" body={p.preferred_location} />
                <Section title="Preferred Age" body={p.preferred_age} />
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {p.email && (
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /><a href={`mailto:${p.email}`} className="hover:underline">{p.email}</a></div>
                  )}
                  {p.whatsapp_number && (
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /><a href={`https://wa.me/${String(p.whatsapp_number).replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="hover:underline">{p.whatsapp_number}</a></div>
                  )}
                </div>
                {p.biodata_url && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={p.biodata_url} target="_blank" rel="noreferrer"><FileText className="w-4 h-4 mr-2" /> Download Biodata PDF</a>
                  </Button>
                )}
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-lg border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-start gap-3">
                  <Crown className="w-6 h-6 text-purple-600 shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Unlock Full Profile</h4>
                    <p className="text-sm text-muted-foreground mt-1">View original photos, family details, biodata PDF, contact information and more.</p>
                    <Button className="mt-3 bg-purple-600 hover:bg-purple-700" onClick={() => navigate("/pricing")}>
                      Upgrade to Premium · ₹491/2 Months
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
      <Dialog open={!!lightbox} onOpenChange={(v) => !v && setLightbox(null)}>
        <DialogContent className="max-w-4xl p-2 bg-black/95 border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Photo</DialogTitle>
          </DialogHeader>
          {lightbox && (
            <img src={lightbox} alt="Full size" className="w-full h-auto max-h-[85vh] object-contain rounded" />
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2 border-b pb-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
function Section({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <div>
      <h5 className="font-semibold text-sm mb-1">{title}</h5>
      <p className="text-sm text-muted-foreground whitespace-pre-line">{body}</p>
    </div>
  );
}