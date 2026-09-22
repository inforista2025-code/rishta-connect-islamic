import { memo, useState } from "react";
import { Lock, BadgeCheck } from "lucide-react";

interface Props {
  photoUrls?: string[];
  name: string;
  /** true when the logged-in viewer has an active premium plan */
  viewerIsPremium: boolean;
  /** Whether the profile is verified; defaults to true for listings on /profiles. */
  verified?: boolean;
}

/**
 * Square profile photo shown at the top of every profile card (matches homepage featured cards).
 * Visitors & free members get a blurred photo with an unlock CTA.
 * Premium members get the original image.
 */
export const ProfileCardPhoto = memo(({ photoUrls, name, viewerIsPremium, verified = true }: Props) => {
  const [failed, setFailed] = useState(false);

  const src = photoUrls?.[0];
  if (!src || failed) return null;

  return (
    <div className="w-full flex justify-center items-center py-4 px-2 bg-gradient-to-b from-muted/30 to-background border-b border-border/60">
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-primary/20 bg-muted">
        <img
          src={src}
          alt={viewerIsPremium ? `Profile photo of ${name}` : `Blurred profile photo of ${name}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          draggable={false}
          className={
            viewerIsPremium
              ? "w-full h-full object-cover object-center"
              : "w-full h-full object-cover object-center scale-110 select-none pointer-events-none [filter:blur(7px)] md:[filter:blur(9px)]"
          }
        />
        {!viewerIsPremium && (
          <>
            <div className="absolute inset-0 bg-foreground/10" />
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold text-primary shadow-sm backdrop-blur-sm">
              <Lock className="w-3 h-3" /> Premium Unlock
            </span>
          </>
        )}
        {verified && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm">
            <BadgeCheck className="w-3 h-3" /> Verified
          </span>
        )}
      </div>
    </div>
  );
});

ProfileCardPhoto.displayName = "ProfileCardPhoto";
