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
    <div className="flex flex-col items-center gap-2 pt-4 pb-1">
      {/* Compact face-only thumbnail */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-primary/20 shadow-sm">
        <img
          src={src}
          alt={viewerIsPremium ? `Profile photo of ${name}` : `Blurred profile photo of ${name}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          draggable={false}
          /* zoomed & top-anchored so only the face area fills the circle */
          className={
            viewerIsPremium
              ? "w-full h-full object-cover object-[center_20%] scale-[1.35]"
              : "w-full h-full object-cover object-[center_20%] scale-[1.35] select-none pointer-events-none [filter:blur(10px)]"
          }
          style={viewerIsPremium ? undefined : { WebkitFilter: "blur(10px)" }}
        />
        {!viewerIsPremium && <div className="absolute inset-0 rounded-full bg-foreground/35" />}
      </div>

      {!viewerIsPremium && (
        <div className="flex flex-col items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            <Lock className="w-3 h-3" />
            Premium Unlock
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/register");
            }}
            className="h-7 rounded-full px-3 text-xs"
          >
            View Original Photo
          </Button>
        </div>
      )}
    </div>
  );
});

ProfileCardPhoto.displayName = "ProfileCardPhoto";