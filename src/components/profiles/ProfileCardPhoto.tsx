import { memo, useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  photoUrls?: string[];
  name: string;
  /** true when the logged-in viewer has an active premium plan */
  viewerIsPremium: boolean;
}

/**
 * Profile photo shown at the top of every profile card.
 * Visitors & free members get a heavily blurred, dimmed photo with an unlock CTA.
 * Premium members get the original image.
 */
export const ProfileCardPhoto = memo(({ photoUrls, name, viewerIsPremium }: Props) => {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  const src = photoUrls?.[0];
  if (!src || failed) return null;

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-t-lg bg-muted">
      <img
        src={src}
        alt={viewerIsPremium ? `Profile photo of ${name}` : `Blurred profile photo of ${name}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        draggable={false}
        className={
          viewerIsPremium
            ? "w-full h-full object-cover object-top"
            : "w-full h-full object-cover object-top scale-125 select-none pointer-events-none [filter:blur(18px)]"
        }
        style={viewerIsPremium ? undefined : { WebkitFilter: "blur(18px)" }}
      />

      {!viewerIsPremium && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/60" />

          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur-sm">
            <Lock className="w-3 h-3" />
            Premium Unlock
          </span>

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/register");
              }}
              className="rounded-full px-4 shadow-lg"
            >
              View Original Photo
            </Button>
          </div>
        </>
      )}
    </div>
  );
});

ProfileCardPhoto.displayName = "ProfileCardPhoto";