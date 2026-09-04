import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, MapPin, GraduationCap, Briefcase, Lock, ArrowRight } from "lucide-react";

/** Curated featured profile IDs, in display order (verified records from the database). */
const FEATURED_IDS = [67, 68, 2, 62];

interface FeaturedProfile {
  id: number;
  name: string;
  age: string | null;
  location: string | null;
  education: string | null;
  profession: string | null;
  photo_urls: string[] | null;
  verification_status: string | null;
}

export function FeaturedProfilesSection() {
  const [profiles, setProfiles] = useState<FeaturedProfile[] | null>(null);
  const navigate = useNavigate();
  const { member } = useMemberAuth();

  const viewerIsPremium =
    member?.plan_type === "premium" &&
    (!member?.premium_expiry || new Date(member.premium_expiry) > new Date());

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("profiles_data")
        .select("id, name, age, location, education, profession, photo_urls, verification_status")
        .in("id", FEATURED_IDS);
      if (!active) return;
      const ordered = FEATURED_IDS.map((id) => (data || []).find((p: any) => p.id === id)).filter(
        Boolean
      ) as FeaturedProfile[];
      setProfiles(ordered);
    })();
    return () => {
      active = false;
    };
  }, []);

  const open = (id: number) => navigate(`/profiles?id=${id}`);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="flex items-end justify-between gap-4 mb-7 md:mb-9">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Meet Some of Our Members</h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1.5">
              Genuine, admin-verified profiles from our community
            </p>
          </div>
          <button
            onClick={() => navigate("/profiles")}
            className="shrink-0 inline-flex items-center gap-1 text-sm md:text-base font-semibold text-primary hover:underline"
          >
            See All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {!profiles &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4">
                <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}

          {profiles?.map((p) => {
            const photo = p.photo_urls?.[0];
            return (
              <article
                key={p.id}
                onClick={() => open(p.id)}
                className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="relative aspect-square bg-muted overflow-hidden">
                  {photo ? (
                    <img
                      src={photo}
                      alt={viewerIsPremium ? `Profile photo of ${p.name}` : `Blurred profile photo of ${p.name}`}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className={
                        viewerIsPremium
                          ? "w-full h-full object-cover object-[center_25%]"
                          : "w-full h-full object-cover object-[center_25%] scale-110 select-none pointer-events-none [filter:blur(6px)]"
                      }
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground text-xs">
                      No photo
                    </div>
                  )}
                  {!viewerIsPremium && photo && (
                    <>
                      <div className="absolute inset-0 bg-foreground/10" />
                      <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        <Lock className="w-3 h-3" /> Premium Unlock
                      </span>
                    </>
                  )}
                  {p.verification_status?.toLowerCase() === "verified" && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-sage px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      <BadgeCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-foreground text-sm md:text-base leading-tight truncate">
                    {p.name?.trim()}
                    {p.age ? <span className="text-muted-foreground font-normal">, {p.age}</span> : null}
                  </h3>
                  <ul className="mt-2 space-y-1 text-[11px] md:text-xs text-muted-foreground">
                    {p.location && (
                      <li className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 mt-px shrink-0 text-primary/70" />
                        <span className="line-clamp-1">{p.location.trim()}</span>
                      </li>
                    )}
                    {p.education && (
                      <li className="flex items-start gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 mt-px shrink-0 text-primary/70" />
                        <span className="line-clamp-1">{p.education.trim()}</span>
                      </li>
                    )}
                    {p.profession && (
                      <li className="flex items-start gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 mt-px shrink-0 text-primary/70" />
                        <span className="line-clamp-1">{p.profession.trim()}</span>
                      </li>
                    )}
                  </ul>
                  <Button
                    size="sm"
                    className="w-full mt-3 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      open(p.id);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
