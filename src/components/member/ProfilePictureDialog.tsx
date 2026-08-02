import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ImageOff } from "lucide-react";
import { useMemberApi } from "@/hooks/useMemberApi";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  photos: string[];
  /** called after the primary photo has been saved, with the new ordered list */
  onUpdated?: (photoUrls: string[]) => void;
}

export function ProfilePictureDialog({ open, onOpenChange, photos, onUpdated }: Props) {
  const { call } = useMemberApi();
  const { toast } = useToast();
  const [selected, setSelected] = useState<string | null>(photos[0] ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setSelected(photos[0] ?? null);
  }, [open, photos]);

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await call("set_primary_photo", { photo_url: selected });
      toast({ title: "Profile picture updated" });
      onUpdated?.(res?.photo_urls || [selected, ...photos.filter((p) => p !== selected)]);
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Could not update photo", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
          <DialogDescription>
            Choose your primary profile picture from the photos you uploaded at registration.
          </DialogDescription>
        </DialogHeader>

        {photos.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground space-y-2">
            <ImageOff className="w-8 h-8 mx-auto opacity-60" />
            <p>No photos found on your profile. Please contact support to add photos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto p-0.5">
            {photos.map((url) => {
              const active = selected === url;
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => setSelected(url)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border-2 transition",
                    active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50",
                  )}
                  aria-pressed={active}
                >
                  <img src={url} alt="Uploaded profile option" className="w-full h-full object-cover" loading="lazy" />
                  {active && (
                    <span className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={!selected || saving || photos.length === 0}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Set as Profile Picture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
