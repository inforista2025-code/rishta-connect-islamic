import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, MapPin, GraduationCap, Briefcase, Lock, ArrowRight } from "lucide-react";

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
  const [allProfiles, setAllProfiles] = useState<FeaturedProfile[]>([]);
  const [displayedProfiles, setDisplayedProfiles] = useState<FeaturedProfile[] | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const { member } = useMemberAuth();

  const viewerIsPremium =
    member?.plan_type === "premium" &&
    (!member?.premium_expiry || new Date(member.premium_expiry) > new Date());

  // 1. Fetch and shuffle all verified profiles on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase
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

        const shuffled = shuffleArray(listToUse);
        setAllProfiles(shuffled);
        setDisplayedProfiles(shuffled.slice(0, 4));
      } catch (err) {
        console.warn("Error loading featured profiles:", err);
        if (active) {
          const shuffled = shuffleArray(FALLBACK_PROFILES);
          setAllProfiles(shuffled);
          setDisplayedProfiles(shuffled.slice(0, 4));
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // 2. Rotate to the next batch of 4 profiles automatically every 45 seconds
  useEffect(() => {
    if (allProfiles.length <= 4) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => {
        const nextIndex = (prev + 4) % allProfiles.length;
        // Slice 4 items, wrapping around if needed
        let nextFour = allProfiles.slice(nextIndex, nextIndex + 4);
        if (nextFour.length < 4) {
          nextFour = [...nextFour, ...allProfiles.slice(0, 4 - nextFour.length)];
        }
        setDisplayedProfiles(nextFour);
        return nextIndex;
      });
    }, 45000);

    return () => clearInterval(interval);
  }, [allProfiles]);

  const open = (id: number, gender?: string | null) => {
    const genderParam = gender === "Female" ? "Female" : "Male";
    navigate(`/profiles?id=${id}&gender=${genderParam}`);
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="flex items-end justify-between gap-4 mb-7 md:mb-9">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Matrimonial Profiles</h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1.5">
              Genuine, admin-verified profiles looking for a righteous spouse
            </p>
          </div>
          <button
            onClick={() => navigate("/profiles")}
            className="shrink-0 inline-flex items-center gap-1 text-sm md:text-base font-semibold text-primary hover:underline"
          >
            See All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Profile Grid (Smooth Transition & Micro-Interactions) */}
        <div key={startIndex} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in duration-500">
          {!displayedProfiles &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
                <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}

          {displayedProfiles?.map((p) => {
            const photo = p.photo_urls?.[0];
            return (
              <article
                key={p.id}
                onClick={() => open(p.id, p.gender)}
                className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden shadow-card hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.99] transition-all duration-300 ease-out"
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
                          ? "w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-500 ease-out"
                          : "w-full h-full object-cover object-[center_25%] scale-110 select-none pointer-events-none [filter:blur(6px)] group-hover:scale-115 transition-transform duration-500 ease-out"
                      }
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground text-xs text-center p-2 group-hover:scale-105 transition-transform duration-300">
                      <span className="text-2xl mb-1">{p.gender === "Female" ? "👰" : "🤵"}</span>
                      <span>{p.gender === "Female" ? "Bride Profile" : "Groom Profile"}</span>
                    </div>
                  )}
                  {!viewerIsPremium && photo && (
                    <>
                      <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/5 transition-colors duration-300" />
                      <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-primary shadow-xs">
                        <Lock className="w-3 h-3" /> Premium Unlock
                      </span>
                    </>
                  )}
                  {p.verification_status?.toLowerCase() === "verified" && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-sage px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-xs">
                      <BadgeCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-foreground text-sm md:text-base leading-tight truncate group-hover:text-primary transition-colors duration-200">
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
                    className="w-full mt-3 rounded-full shadow-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      open(p.id, p.gender);
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
