import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, MapPin, GraduationCap, Briefcase, Lock, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface FeaturedProfile {
  id: number;
  name: string;
  gender?: string | null;
  age: string | null;
  location: string | null;
  education: string | null;
  profession: string | null;
  photo_urls: string[] | null;
  verification_status: string | null;
}

const FALLBACK_PROFILES: FeaturedProfile[] = [
  {
    id: 1,
    name: "Mohammad Hasib",
    gender: "Male",
    age: "32",
    location: "Ranchi, Jharkhand",
    education: "Bachelor of Computer Application",
    profession: "IT Support",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 2,
    name: "Afshaa Bharde",
    gender: "Female",
    age: "24",
    location: "Navi Mumbai, Maharashtra",
    education: "BCA",
    profession: "HR in Qatar (Private Company)",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 3,
    name: "Shamsuzzama Hashmi",
    gender: "Male",
    age: "32",
    location: "Saudi Arabia, Tabuk",
    education: "B.Tech Civil Engineer",
    profession: "Assistant Technical Manager",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 4,
    name: "Shadma Khatoon",
    gender: "Female",
    age: "25",
    location: "Darbhanga, Bihar",
    education: "B.Sc. Mathematics + D.El.Ed",
    profession: "Educator",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 5,
    name: "MD Sarwar Alam",
    gender: "Male",
    age: "31",
    location: "Ranchi, Jharkhand",
    education: "MBA",
    profession: "Sales & Marketing, Private Sector",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 6,
    name: "Shaima Perween",
    gender: "Female",
    age: "25",
    location: "Bihar Sharif, Nalanda, Bihar",
    education: "M.Sc, D.El.Ed, CTET Qualified",
    profession: "Educator",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 7,
    name: "Wasil Khan",
    gender: "Male",
    age: "29",
    location: "Doranda, Ranchi, Jharkhand",
    education: "MBA (Finance & Marketing)",
    profession: "Business Professional",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 8,
    name: "Md Rahim Khan",
    gender: "Male",
    age: "26",
    location: "Dhanbad, Jharkhand",
    education: "M.Com",
    profession: "Private Job at SBI (Loan Dept)",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 9,
    name: "Taheera Ansari",
    gender: "Female",
    age: "31",
    location: "Deoria, Uttar Pradesh",
    education: "PhD in Zoology",
    profession: "Assistant Professor in Degree College",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 10,
    name: "MD Shabbir Akhtar",
    gender: "Male",
    age: "33",
    location: "Patna City, Bihar",
    education: "B.Tech (ECE)",
    profession: "School Principal",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 11,
    name: "Samreen Fatima",
    gender: "Female",
    age: "26",
    location: "Patna City, Bihar",
    education: "Graduation (B.Com)",
    profession: "Homemaker",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 12,
    name: "Sania Akhtar",
    gender: "Female",
    age: "21",
    location: "Patna City, Bihar",
    education: "Graduation",
    profession: "Homemaker",
    photo_urls: null,
    verification_status: "verified"
  },
  {
    id: 13,
    name: "Kamran Ansari",
    gender: "Male",
    age: "27",
    location: "Ranchi, Jharkhand",
    education: "MBA (Marketing & HR)",
    profession: "Assistant Manager, Bhutani Infra",
    photo_urls: null,
    verification_status: "verified"
  }
];

// Helper to shuffle array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function FeaturedProfilesSection() {
  const [profiles, setProfiles] = useState<FeaturedProfile[] | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const { member } = useMemberAuth();

  const viewerIsPremium =
    member?.plan_type === "premium" &&
    (!member?.premium_expiry || new Date(member.premium_expiry) > new Date());

  // Load and shuffle all verified profiles
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles_data")
          .select("id, name, gender, age, location, education, profession, photo_urls, verification_status")
          .eq("is_live", true)
          .eq("verification_status", "verified");

        if (!active) return;

        let listToUse: FeaturedProfile[] = [];
        if (data && data.length > 0) {
          listToUse = data as FeaturedProfile[];
        } else {
          listToUse = FALLBACK_PROFILES;
        }

        // Shuffle so profiles are never fixed and change on every visit
        const randomized = shuffleArray(listToUse);
        setProfiles(randomized);
      } catch (err) {
        console.warn("Featured profiles load fallback:", err);
        if (active) {
          setProfiles(shuffleArray(FALLBACK_PROFILES));
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Continuous auto-loop scroll effect (advances every 3.5 seconds)
  useEffect(() => {
    if (!api || isPaused) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [api, isPaused]);

  const open = (id: number, gender?: string | null) => {
    const genderParam = gender === "Female" ? "Female" : "Male";
    navigate(`/profiles?id=${id}&gender=${genderParam}`);
  };

  return (
    <section 
      className="py-12 md:py-16 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 md:mb-9">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Verified Members</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Meet Some of Our Members
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Genuine, admin-verified profiles continuously updating from our community
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => api?.scrollPrev()}
              className="h-8 w-8 p-0 rounded-full border-border/80 hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Previous Profile"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => api?.scrollNext()}
              className="h-8 w-8 p-0 rounded-full border-border/80 hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Next Profile"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profiles")}
              className="text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 rounded-full gap-1 ml-1"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {!profiles && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4 shadow-sm animate-pulse">
                <Skeleton className="w-full aspect-square rounded-xl mb-3" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-8 w-full rounded-full mt-3" />
              </div>
            ))}
          </div>
        )}

        {/* Profiles Loop Carousel */}
        {profiles && profiles.length > 0 && (
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              dragFree: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {profiles.map((p) => {
                const photo = p.photo_urls?.[0];
                return (
                  <CarouselItem
                    key={p.id}
                    className="pl-3 md:pl-4 basis-[72%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <article
                      onClick={() => open(p.id, p.gender)}
                      className="group cursor-pointer h-full flex flex-col justify-between rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Photo Container */}
                      <div className="relative aspect-square bg-muted/50 overflow-hidden">
                        {photo ? (
                          <img
                            src={photo}
                            alt={viewerIsPremium ? `Profile photo of ${p.name}` : `Blurred profile photo of ${p.name}`}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            className={
                              viewerIsPremium
                                ? "w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-500"
                                : "w-full h-full object-cover object-[center_25%] scale-110 select-none pointer-events-none [filter:blur(7px)] group-hover:scale-115 transition-transform duration-500"
                            }
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-muted to-primary/10 text-muted-foreground text-xs p-4 text-center">
                            <span className="text-3xl mb-1">{p.gender === "Female" ? "👰" : "🤵"}</span>
                            <span className="text-[11px] font-medium text-foreground/70">{p.gender === "Female" ? "Bride Profile" : "Groom Profile"}</span>
                          </div>
                        )}

                        {/* Blurred Photo Privacy Badge */}
                        {!viewerIsPremium && photo && (
                          <>
                            <div className="absolute inset-0 bg-foreground/10" />
                            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold text-primary shadow-xs">
                              <Lock className="w-3 h-3" /> Photo Protected
                            </span>
                          </>
                        )}

                        {/* Verified Badge */}
                        <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 text-white px-2 py-0.5 text-[10px] font-semibold shadow-xs">
                          <BadgeCheck className="w-3 h-3" /> Verified
                        </span>
                      </div>

                      {/* Info Container */}
                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight truncate group-hover:text-primary transition-colors">
                            {p.name?.trim()}
                            {p.age ? <span className="text-muted-foreground font-normal text-xs sm:text-sm">, {p.age} yrs</span> : null}
                          </h3>

                          <ul className="mt-2.5 space-y-1.5 text-[11px] sm:text-xs text-muted-foreground">
                            {p.location && (
                              <li className="flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                                <span className="line-clamp-1">{p.location.trim()}</span>
                              </li>
                            )}
                            {p.education && (
                              <li className="flex items-start gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                                <span className="line-clamp-1">{p.education.trim()}</span>
                              </li>
                            )}
                            {p.profession && (
                              <li className="flex items-start gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                                <span className="line-clamp-1">{p.profession.trim()}</span>
                              </li>
                            )}
                          </ul>
                        </div>

                        <Button
                          size="sm"
                          className="w-full mt-3.5 rounded-full text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            open(p.id, p.gender);
                          }}
                        >
                          <span>View Profile</span>
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </div>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
}
