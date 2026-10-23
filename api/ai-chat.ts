// Vercel Serverless Function: AI Chatbot API with Gemini & Live Verified Profiles Grounding
export const maxDuration = 30;

const SUPABASE_URL = "https://rxlzlkcdszulyetcxxih.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bHpsa2Nkc3p1bHlldGN4eGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTAzODIsImV4cCI6MjA3NTI2NjM4Mn0.PXcKNOiJlQr_BSqPZKIGTQYKK-e6Y5obVg7WPJm17hM";

export interface LiveProfileSummary {
  id: number;
  name: string;
  gender: string;
  age: string | number;
  location: string;
  education: string;
  profession: string;
  marital_status?: string;
  maslak?: string;
}

// Fallback verified profiles in case database fetch experiences latency
const FALLBACK_PROFILES: LiveProfileSummary[] = [
  { id: 93, name: "Ayesha perween", gender: "Female", age: "20", location: "Phulwari sharif patna bihar", education: "BCA (Computer Application)", profession: "Fresher / Student", marital_status: "Single", maslak: "Salafi (Ahle Hadees)" },
  { id: 29, name: "Md Tarique Aquil", gender: "Male", age: "29", location: "Ranchi, Jharkhand", education: "B.Tech in Computer Science", profession: "Assistant Manager at State Bank of India", marital_status: "Single", maslak: "Sunni" },
  { id: 31, name: "Salman Khan", gender: "Male", age: "22", location: "Saharanpur, U.P", education: "ITI", profession: "Working in Amul Agency", marital_status: "Divorced (one child)", maslak: "Deobandi" },
  { id: 33, name: "Khan zeba iqbal", gender: "Female", age: "31", location: "Mumbai, Maharashtra", education: "B.Com Graduate, Diploma in Fashion Designing", profession: "Teaching Fashion Designing", marital_status: "Single", maslak: "Tablighi / Hanfi" },
  { id: 60, name: "Dr. Afnan Mazgaonkar", gender: "Female", age: "33", location: "Navi Mumbai, Maharashtra", education: "BHMS, MD (Paediatrics)", profession: "Doctor – Professor in Medical College", marital_status: "Single", maslak: "Sunni" },
  { id: 87, name: "Nagma parveen", gender: "Female", age: "31", location: "Trilokpuri, Delhi", education: "B.A. (Islamic Studies), M.A. (History)", profession: "Runs her own English Institute", marital_status: "Single", maslak: "Sunni" },
  { id: 1, name: "Mohammad Hasib", gender: "Male", age: "32", location: "Ranchi, Jharkhand", education: "Bachelor of Computer Application", profession: "IT Support", marital_status: "Single", maslak: "Sunni" },
  { id: 82, name: "Syed Bushra begum", gender: "Female", age: "26", location: "Mumbai, Maharashtra", education: "Aircraft Maintenance Engg & BBA", profession: "Student (3rd year BBA)", marital_status: "Single", maslak: "Sunni" },
  { id: 76, name: "Alauddin Khan", gender: "Male", age: "31", location: "New Delhi", education: "B.Tech Electrical & Electronics", profession: "Project Procurement Engineer at RPG Group", marital_status: "Single", maslak: "Sunni" },
  { id: 43, name: "Asma Banu", gender: "Female", age: "36", location: "Udaipur, Rajasthan", education: "Diploma in Textile Designing", profession: "Designer", marital_status: "Single", maslak: "Sunni" },
  { id: 68, name: "Arif Iqbal", gender: "Male", age: "34", location: "New Brunswick, Canada", education: "LLB Delhi Univ, MBA Canada", profession: "Lawyer (Articling)", marital_status: "Single", maslak: "Sunni" }
];

let cachedProfiles: LiveProfileSummary[] = [];
let lastProfilesFetch = 0;
const PROFILES_CACHE_TTL = 3 * 60 * 1000; // 3 minutes cache

async function fetchVerifiedProfiles(): Promise<LiveProfileSummary[]> {
  const now = Date.now();
  if (cachedProfiles.length > 0 && now - lastProfilesFetch < PROFILES_CACHE_TTL) {
    return cachedProfiles;
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles_data?select=id,name,gender,age,location,education,profession,marital_status,maslak&is_live=eq.true&verification_status=eq.verified&order=display_order.desc&limit=60`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        cachedProfiles = data;
        lastProfilesFetch = now;
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not load verified profiles from Supabase in ai-chat:", err);
  }

  return cachedProfiles.length > 0 ? cachedProfiles : FALLBACK_PROFILES;
}

function formatProfilesDirectoryForPrompt(profiles: LiveProfileSummary[]): string {
  if (!profiles || profiles.length === 0) return "No verified active profiles currently loaded.";
  return profiles.map(p => {
    const code = `RM-${p.gender === 'Female' ? 'BR' : 'GR'}-${p.id}`;
    const status = p.marital_status || 'Single';
    const maslakStr = p.maslak ? ` | Maslak: ${p.maslak}` : '';
    return `- [Profile ID: ${p.id} | Code: ${code}] Name: ${p.name} | Gender: ${p.gender} | Age: ${p.age} yrs | City: ${p.location} | Education: ${p.education} | Profession: ${p.profession} | Status: ${status}${maslakStr}`;
  }).join("\n");
}

// Default authentic knowledge base (Platform policies, pricing, rules, and core Q&As)
const DEFAULT_KNOWLEDGE = `
--- RISHTA MATRIMONY OFFICIAL POLICIES & KNOWLEDGE BASE ---

1. ABOUT THE PLATFORM:
- Website: Rishta Matrimony (https://rishtamatrimony.vercel.app)
- Mission: 100% Halal, safe, verified, and dignified Islamic matchmaking for Muslims.
- Values: Adab, Taqwa, modesty (Haya), privacy, and zero tolerance for casual dating or fake accounts.
- Contact WhatsApp: +91 9128719875
- Official Email: info.rista2025@gmail.com

2. PHOTO REQUIREMENTS & PRIVACY (MANDATORY FACTS):
- Question: Is photo upload compulsory / mandatory when registering?
  Answer: YES (Haan ji). Registration form (/register) submit karte waqt kam se kam 2 clear recent photos upload karna zaroori (mandatory) hota hai taaki genuine profile ban sake aur fake account se bacha ja sake.
- Question: Can sisters or brothers keep their photos private / in parda?
  Answer: YES (Ji haan bilkul). Photos are 100% confidential. Photos are NEVER displayed on open public search engines (Google) or social media. Parda/Hijab mode is fully respected. Only serious, manually verified inquiries get access after admin review.

3. PRICING & PLANS:
- Question: Is biodata registration free?
  Answer: YES (Haan ji bilkul). Creating and submitting a matrimonial profile is 100% FREE (₹0) at /register.
- Single Profile Unlock: ₹48 one-time. Unlocks 1 verified proposal's direct phone number, family contact, and complete biodata.
- Premium Membership: ₹491 for 60 Days (2 full months). Includes access to verified profiles, direct contact numbers, priority matchmaking, and direct support on WhatsApp.
- No hidden charges, no recurring auto-debit.

4. WHO CAN REGISTER:
- Question: Can parents or guardians register on behalf of their children?
  Answer: YES (Haan ji bilkul). In fact, most profiles on Rishta Matrimony are managed by parents (Walidain), brothers, or guardians to maintain Islamic adab and serious family intentions.

5. VERIFICATION PROCESS:
- Question: How does verification work and how long does it take?
  Answer: Within 24 to 48 hours of form submission, the admin team personally calls the registered phone number to verify identity and details before marking the profile active.

6. DOWRY (JAHEZ) POLICY:
- Question: Is dowry (Jahez) allowed?
  Answer: NO (Nahi bilkul nahi). Demanding dowry is strictly forbidden on our platform according to the Sunnah of Prophet Muhammad ﷺ. The Sunnah teaches simplicity (Aisarun-Nikah Barkatan).

7. HOW TO GET STARTED:
- Step 1: Register free biodata at [👉 Register Free Biodata (Sirf 2 Minute)](/register) (Takes 2 minutes).
- Step 2: Browse verified proposals at [👉 View Verified Profiles](/profiles)
- Step 3: For any help or queries, message our official WhatsApp at +91 9128719875
`;

// Helper to fetch dynamic Knowledge Base from Supabase
async function fetchAdminKnowledgeBase(): Promise<string> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/about_us_content?language=eq.ai_knowledge_base&select=content`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!res.ok) return DEFAULT_KNOWLEDGE;

    const data = await res.json();
    if (data && data.length > 0 && data[0].content) {
      try {
        const parsed = JSON.parse(data[0].content);
        let dynamicContext = DEFAULT_KNOWLEDGE + "\n\n--- ADMIN CUSTOM TRAINING & FAQS ---\n";

        if (Array.isArray(parsed.faqs) && parsed.faqs.length > 0) {
          parsed.faqs.forEach((faq: any, idx: number) => {
            if (faq.question && faq.answer) {
              dynamicContext += `Q${idx + 1}: ${faq.question}\nA${idx + 1}: ${faq.answer}\n`;
            }
          });
        }

        if (Array.isArray(parsed.documents) && parsed.documents.length > 0) {
          dynamicContext += "\n--- ADMIN UPLOADED DOCUMENTS & POLICIES ---\n";
          parsed.documents.forEach((doc: any) => {
            if (doc.content) {
              dynamicContext += `[Document: ${doc.title || "Policy"}]\n${doc.content}\n\n`;
            }
          });
        }

        if (parsed.customPrompt) {
          dynamicContext += `\nADMIN SPECIAL INSTRUCTION: ${parsed.customPrompt}\n`;
        }

        return dynamicContext;
      } catch (jsonErr) {
        return DEFAULT_KNOWLEDGE + "\n\n" + data[0].content;
      }
    }
  } catch (err) {
    console.warn("Could not load dynamic knowledge base from Supabase:", err);
  }

  return DEFAULT_KNOWLEDGE;
}

// Find matching profiles for search queries
export function findMatchingProfiles(
  query: string,
  profiles: LiveProfileSummary[]
): {
  matchedProfiles: LiveProfileSummary[];
  cityMatched: string | null;
  genderMatched: string | null;
  singleProfileMatched: LiveProfileSummary | null;
  isProfileQuery: boolean;
} {
  const q = query.toLowerCase().trim();

  // 1. Check for specific profile ID: "profile 29", "id 33", "#60", "rc-29", "rm-gr-29"
  const idMatch = q.match(/(?:profile|id|rm-gr-|rm-br-|#)\s*(\d+)/i) || (q.includes("profile") ? q.match(/\b(\d{1,4})\b/) : null);
  if (idMatch && idMatch[1]) {
    const targetId = parseInt(idMatch[1], 10);
    const found = profiles.find(p => p.id === targetId);
    if (found) {
      return {
        matchedProfiles: [found],
        cityMatched: found.location,
        genderMatched: found.gender,
        singleProfileMatched: found,
        isProfileQuery: true,
      };
    }
  }

  // 2. Check for specific name match in live profiles
  for (const p of profiles) {
    const nameLower = p.name.toLowerCase().trim();
    if (nameLower.length > 3 && q.includes(nameLower)) {
      return {
        matchedProfiles: [p],
        cityMatched: p.location,
        genderMatched: p.gender,
        singleProfileMatched: p,
        isProfileQuery: true,
      };
    }
  }

  // 3. Detect gender filter
  let genderMatched: string | null = null;
  if (
    q.includes('ladki') || q.includes('larki') || q.includes('dulhan') || 
    q.includes('female') || q.includes('bride') || q.includes('sister') ||
    q.includes('aurat') || q.includes('women') || q.includes('beti') ||
    q.includes('ladkiyo') || q.includes('ladkiya')
  ) {
    genderMatched = 'Female';
  } else if (
    q.includes('ladka') || q.includes('larka') || q.includes('dulha') || 
    q.includes('male') || q.includes('groom') || q.includes('brother') ||
    q.includes('mard') || q.includes('men') || q.includes('beta') ||
    q.includes('ladko') || q.includes('ladke')
  ) {
    genderMatched = 'Male';
  }

  // 4. Detect common cities / states (using word boundary check to prevent false positives like "up" in "upload")
  const commonCities = [
    "mumbai", "ranchi", "patna", "delhi", "new delhi", "saharanpur", "udaipur", 
    "lucknow", "dhanbad", "bihar", "jharkhand", "uttar pradesh", "kolkata", 
    "hyderabad", "bengaluru", "bangalore", "pune", "navi mumbai", "phulwari", "doranda", "rajasthan"
  ];
  let cityMatched: string | null = null;
  for (const city of commonCities) {
    const regex = new RegExp(`\\b${city}\\b`, "i");
    if (regex.test(q)) {
      cityMatched = city;
      break;
    }
  }
  if (!cityMatched && /\bup\b/i.test(q)) {
    cityMatched = "up";
  }

  // Dynamic city regex: e.g. "kashmir se", "jaipur se", "aligarh se"
  if (!cityMatched) {
    const dynamicMatch = q.match(/([a-zA-Z]{3,})\s+se\b/);
    if (dynamicMatch && dynamicMatch[1]) {
      const candidate = dynamicMatch[1].toLowerCase();
      const nonCities = ["kisi", "website", "admin", "hum", "aap", "mujhe", "phone", "contact", "pehle", "free", "sab", "form"];
      if (!nonCities.includes(candidate)) {
        cityMatched = candidate;
      }
    }
  }

  // Determine if there is actual intent to search profiles/matches
  const isProfileIntent = 
    idMatch !== null ||
    cityMatched !== null ||
    genderMatched !== null ||
    q.includes('profile') || 
    q.includes('rishta') || 
    q.includes('rishte') || 
    q.includes('matches') ||
    (q.includes('chahiye') && (q.includes('dulha') || q.includes('dulhan') || q.includes('ladka') || q.includes('ladki') || q.includes('biodata')));

  if (!isProfileIntent) {
    return {
      matchedProfiles: [],
      cityMatched: null,
      genderMatched: null,
      singleProfileMatched: null,
      isProfileQuery: false,
    };
  }

  // Filter profiles based on city & gender
  let matched = profiles.filter(p => {
    if (genderMatched && p.gender.toLowerCase() !== genderMatched.toLowerCase()) {
      return false;
    }
    if (cityMatched) {
      const loc = p.location.toLowerCase();
      if (!loc.includes(cityMatched)) {
        return false;
      }
    }
    return true;
  });

  // Also check profession if mentioned (e.g. "engineer", "doctor", "lawyer", "manager")
  const profKeywords = ["doctor", "engineer", "b.tech", "teacher", "business", "manager", "lawyer", "iti", "graduate"];
  const matchedProf = profKeywords.find(k => q.includes(k));
  if (matchedProf) {
    matched = matched.filter(p => {
      const combined = `${p.education} ${p.profession}`.toLowerCase();
      return combined.includes(matchedProf);
    });
  }

  return {
    matchedProfiles: matched.slice(0, 4),
    cityMatched,
    genderMatched,
    singleProfileMatched: null,
    isProfileQuery: true,
  };
}

// Intelligent Semantic Rule Engine for instant, direct, and conversational responses
function generateSmartFallback(
  query: string,
  knowledge: string,
  profiles: LiveProfileSummary[] = []
): { reply: string; profileMatches?: any[] } {
  const q = query.toLowerCase().trim();

  // 1. SPECIFIC PROFILE / CITY / MATCH INQUIRY (CHECK THIS FIRST FOR MATCHMAKING INTENTS)
  const profileSearch = findMatchingProfiles(query, profiles);

  if (profileSearch.isProfileQuery) {
    // A. Single Profile ID/Name found
    if (profileSearch.singleProfileMatched) {
      const p = profileSearch.singleProfileMatched;
      const code = `RM-${p.gender === 'Female' ? 'BR' : 'GR'}-${p.id}`;
      const genderLabel = p.gender === 'Female' ? 'Dulhan (Bride)' : 'Dulha (Groom)';

      return {
        reply: `Haan ji! **Profile #${p.id} (${code})** ki basic details ye hain:

• **Rishta:** ${genderLabel}
• **Naam:** ${p.name}
• **Umar (Age):** ${p.age} saal
• **Shahr (Location):** ${p.location}
• **Taleem (Education):** ${p.education}
• **Pesha (Profession):** ${p.profession}
• **Status:** ${p.marital_status || 'Single'}${p.maslak ? ` • Maslak: ${p.maslak}` : ''}

⚠️ **Zaroori Jankari:** Inka personal direct contact number aur photo dekhne ya rabta karne ke liye aapko pehle apna profile register karna padega. (Yeh genuine parivaron ki safety aur privacy ke liye platform ka zaroori niyam hai).

👉 **Agar aapko inka profile chahiye, toh pehle aap apni profile register kar lein, sirf 2 minute lagega:**
[👉 Register Free Biodata (Sirf 2 Minute)](/register)

💬 *Kya aap inka profile dekh kar apna free biodata register karna chahenge?*`,
        profileMatches: [
          {
            id: p.id,
            name: p.name,
            gender: p.gender,
            age: p.age,
            city: p.location,
            education: p.education,
            profession: p.profession,
            maslak: p.maslak || null,
          }
        ]
      };
    }

    // B. Matching Profiles list found for city / gender / criteria
    if (profileSearch.matchedProfiles.length > 0) {
      const { matchedProfiles, cityMatched, genderMatched } = profileSearch;
      const targetLabel = genderMatched === 'Female' ? 'ladkiyon (Dulhan)' : genderMatched === 'Male' ? 'ladkon (Dulha)' : 'verified rishton';
      const cityTitle = cityMatched ? cityMatched.charAt(0).toUpperCase() + cityMatched.slice(1) : '';

      const heading = cityTitle 
        ? `Haan ji! **${cityTitle}** se hamare paas ${targetLabel} ki ye verified profiles uplabdh hain:`
        : `Haan ji! Hamare paas ${targetLabel} ki ye verified profiles uplabdh hain:`;

      const listItems = matchedProfiles.map((p, idx) => {
        const code = `RM-${p.gender === 'Female' ? 'BR' : 'GR'}-${p.id}`;
        const status = p.marital_status || 'Single';
        return `${idx + 1}. **Profile #${p.id} (${code}):** ${p.name} — Umar ${p.age} saal, ${p.location} | Education: ${p.education} | Profession: ${p.profession} (${status})`;
      }).join('\n\n');

      return {
        reply: `${heading}

${listItems}

⚠️ **Zaroori Jankari:** Inka personal direct contact number aur photo dekhne ya rabta karne ke liye aapko pehle apna profile register karna padega. (Yeh genuine khandano ki safety aur privacy ke liye zaroori niyam hai).

👉 **Agar aapko inka profile chahiye, toh pehle aap apni profile register kar lein, sirf 2 minute lagega:**
[👉 Register Free Biodata (Sirf 2 Minute)](/register)

💬 *Aap inme se kis profile ke bare me baat aage badhana chahte hain?*`,
        profileMatches: matchedProfiles.map(p => ({
          id: p.id,
          name: p.name,
          gender: p.gender,
          age: p.age,
          city: p.location,
          education: p.education,
          profession: p.profession,
          maslak: p.maslak || null,
        }))
      };
    }

    // C. City requested but no profiles currently live for that city
    if (profileSearch.cityMatched && profileSearch.matchedProfiles.length === 0) {
      const cityTitle = profileSearch.cityMatched.charAt(0).toUpperCase() + profileSearch.cityMatched.slice(1);
      return {
        reply: `Filhaal hamare paas **${cityTitle}** se direct profile live nahi hai, lekin doosre shehron jaise Ranchi, Patna, Delhi, Mumbai, Bihar, UP wagaira se verified rishte maujood hain 🌸

⚠️ **Zaroori Jankari:** Hamare platform par kisi bhi rishte ka contact number aur photo dekhne ke liye pehle apna profile register karna hota hai.

👉 **Agar aap chahte hain ki jaise hi ${cityTitle} ya aapke mutabiq matching rishta aaye hamari team aapse direct rabta kare, toh pehle aap apni profile register kar lein, sirf 2 minute lagega:**
[👉 Register Free Biodata (Sirf 2 Minute)](/register)

💬 *Kya aap aas-paas ke kisi doosre shehar ke verified rishte dekhna chahenge?*`
      };
    }
  }

  // 2. PHOTO COMPULSORY / MANDATORY / ZAROORI QUERY
  const isPhotoMentioned = q.includes("photo") || q.includes("tasveer") || q.includes("pic") || q.includes("image") || q.includes("dp");
  const isCompulsoryAsked = 
    q.includes("compulsory") || 
    q.includes("zaroori") || 
    q.includes("jaruri") || 
    q.includes("mandatory") || 
    q.includes("bina photo") || 
    q.includes("bina tasveer") || 
    q.includes("photo ke bina") || 
    q.includes("lazmi") || 
    q.includes("dalna padega") || 
    q.includes("dena padega") || 
    q.includes("upload karna padega") || 
    q.includes("karna padega kya") || 
    q.includes("hoga kya") ||
    q.includes("chahiye kya");

  if (isPhotoMentioned && isCompulsoryAsked) {
    return {
      reply: `Haan ji, registration form submit karte waqt kam se kam **2 clear photos** upload karna zaroori (compulsory) hota hai 🌸

Iska maqsad yeh hai ki:
• Hamare platform par sirf **genuine aur verified rishte** hi jud sakein aur kisi bhi fake account se bacha ja sake.
• Dono khandano ko tasalli aur bharosa ho sake.

**Lekin aap befikr rahein — aapki Privacy aur Parda 100% mehfooz hai:**
• Aapki photo kisi bhi open social media ya Google search par show nahi hoti.
• Behenon ke liye Parda/Hijab ka pura ehtram kiya jata hai aur photo confidential rehti hai.

💬 *Kya aapko photo upload karne ya biodata form bharne me koi dikkat aa rahi hai? Main poori madad karunga!*`
    };
  }

  // 3. PHOTO PRIVACY / PARDA / SAFETY
  const isPhotoPrivacyAsked = 
    q.includes("parda") || 
    q.includes("hijab") || 
    q.includes("privacy") || 
    q.includes("safe") || 
    q.includes("surakshit") || 
    q.includes("mehfooz") || 
    q.includes("kaun dekhega") || 
    q.includes("kon dekhega") || 
    q.includes("public") || 
    q.includes("leak");

  if (isPhotoMentioned && isPhotoPrivacyAsked) {
    return {
      reply: `Ji bilkul! Rishta Matrimony par photo aur personal details **100% safe aur confidential** rehti hain 🌸

• **Parda Respect:** Behenon ke Islami Parda aur Hijab ka pura ahtram kiya jata hai.
• **No Open Public Display:** Aapki photos kisi bhi social media, Google ya open web par bina marzi display nahi ki jaati hain.
• **Manual Verification:** Sirf verified aur serious rishta dhoondhne wale khandano ko hi review ke baad profile contact unlock karne ki ijazat milti hai.

💬 *Kya aap apna free biodata register karna chahte hain?*`
    };
  }

  // 4. IS REGISTRATION FREE / KITNA PAISA / CHARGES
  const isFreeAsked = q.includes("free") || q.includes("muft") || q.includes("bina paise") || q.includes("koi charge");
  const isPriceAsked = q.includes("kitna paisa") || q.includes("kya charge") || q.includes("fees") || q.includes("charges") || q.includes("plan") || q.includes("price") || q.includes("cost") || q.includes("paisa lagega");

  if (isFreeAsked || (q.includes("register") && isPriceAsked)) {
    return {
      reply: `Haan ji bilkul! Rishta Matrimony par apna **Matrimonial Biodata register karna 100% Free (₹0)** hai 🌸

• Dulha (Groom) ya Dulhan (Bride) ya unke Walidain bilkul muft me form bhar sakte hain.
• Charges sirf tab aate hain jab aap kisi verified rishte ke walidain ka **direct phone number unlock** karna chahein (Sirf ₹48 single profile unlock, ya ₹491 me 2 mahine ka unlimited plan).

👉 *Aap abhi direct website ke top par 'Register Free' par jaakar 2 minute me biodata submit kar sakte hain:*
[👉 Register Free Biodata (Sirf 2 Minute)](/register)

💬 *Kya aap apna biodata register karne me madad chahte hain?*`
    };
  }

  // 5. CAN PARENTS / GUARDIANS REGISTER FOR CHILDREN
  if (
    q.includes("parent") || 
    q.includes("walidain") || 
    q.includes("abbu") || 
    q.includes("ammi") || 
    q.includes("mata") || 
    q.includes("pita") || 
    q.includes("beta") || 
    q.includes("beti") || 
    q.includes("bache") || 
    q.includes("bhai") || 
    q.includes("behen") || 
    q.includes("guardian")
  ) {
    return {
      reply: `Haan ji, bilkul! Parents (Mata-Pita), bhai ya koi bhi guardian apne bete ya beti ke liye biodata register kar sakte hain 🌸

Balke hamare platform par **zyadatar rishte walidain hi manage karte hain**, taaki shariat aur ba-adab tareeqe se baat aage badhe aur donon khandano me barkat rahe.

💬 *Bataiye, aap apne bete ke liye rishta dekh rahe hain ya beti ke liye? Kis city me dekh rahe hain?*`
    };
  }

  // 6. PROFILE VERIFICATION TIME & PHONE CALL
  if (
    q.includes("verify") || 
    q.includes("verification") || 
    q.includes("kitni der") || 
    q.includes("kab call") || 
    q.includes("phone call") || 
    q.includes("fake") || 
    q.includes("genuine")
  ) {
    return {
      reply: `Hamare platform par har profile ko **100% Manually Verify** kiya jata hai 🌸

• Form submit karne ke **24 se 48 ghante** ke andar hamari admin team aapke number par phone call karti hai.
• Call par details confirm karne ke baad profile verified mark karke live kiya jata hai, taaki koi bhi fake account na aaye.

💬 *Kya aapne form submit kar diya hai? Agar haan, toh aap WhatsApp (+91 9128719875) par bhi direct bata sakte hain.*`
    };
  }

  // 7. DOWRY / JAHEZ
  if (q.includes("jahez") || q.includes("dowry") || q.includes("dahej")) {
    return {
      reply: `Nahi, bilkul nahi! Hamare platform par Jahez (Dowry) ki mang karna **sakht mana aur prohibited** hai 🚫

• Islam aur Sunnah me Jahez ki koi jagah nahi hai. Rasoolullah ﷺ ne farmaya: Sabse zyada barkat wala nikah woh hai jisme sabse kam maali bojh ho (Aisarun-Nikah Barkatan).
• Hum sirf un shareef khandano ko jodte hain jo bina kisi dahej ke, sunnah ke mutabiq sadgi se nikah karna chahte hain 🌸`
    };
  }

  // 8. FEES / CHARGES DETAILS
  if (q.includes("price") || q.includes("plan") || q.includes("charge") || q.includes("fee") || q.includes("paisa") || q.includes("cost") || q.includes("491") || q.includes("48")) {
    return {
      reply: `🌸 **Rishta Matrimony Fee & Plans:**

• **Free Registration:** Biodata register karna bilkul **100% Free** hai. Koi bhi brother ya sister / parents free me form bhar sakte hain.
• **Single Profile Unlock (₹48):** Kisi 1 verified rishte ka direct verified phone number aur family contact unlock karne ke liye sirf ₹48 lagte hain.
• **Premium Plan (₹491 for 60 Days):** 2 mahine ke liye sabhi verified rishton tak access, direct contact numbers, aur direct WhatsApp assistance.

💬 *Kya aap apna free biodata register karna chahte hain ya kisi specific profile ka number chahiye?*`
    };
  }

  // 9. ISTIKHARA & DEENI DUA
  if (q.includes("istikhara") || q.includes("dua") || q.includes("khwab")) {
    return {
      reply: `🤲 **Shadi ke liye Salatul Istikhara ka Sunnah Tareeqa:**

1. 2 Rakat Nafl Salah padhein.
2. Allah ki hamd-o-sana aur Durood Sharif ke baad Masnoon Istikhara Dua padhein (Sahih al-Bukhari 1162).
3. **Wazahat:** Istikhara me khwab aana shart nahi hai. Dil ka kisi ek taraf itminan hona aur kaam me aasaani paida hona hi khair ki alamat hai 🌸

💬 *Kya aap proposal ke liye dua ka tareeqa jan-na chahte hain?*`
    };
  }

  // 10. CONTACT / WHATSAPP / HELPLINE
  if (q.includes("contact") || q.includes("whatsapp") || q.includes("phone") || q.includes("admin") || q.includes("number") || q.includes("helpline")) {
    return {
      reply: `Assalamu Alaikum! Hamari team se direct rabta karne ke liye:

• **Official WhatsApp:** [+91 9128719875](https://wa.me/919128719875)
• **Official Email:** info.rista2025@gmail.com
• **Timing:** Subah 9:00 AM se Shaam 9:00 PM IST

💬 *Aap direct WhatsApp par message bhej kar bhi madad le sakte hain!*`
    };
  }

  // 11. GENERAL CONVERSATIONAL CATCH-ALL
  return {
    reply: `Assalamu Alaikum! 🌸✨

Main samajh gaya. Rishta Matrimony par main aapki matrimonial search aur Islamic guidance dono me poori tarah madad karne ke liye hazir hoon 😊

Aap mujhse bejhijhak pooch sakte hain:
• Kisi specific shehar (jaise Ranchi, Patna, Delhi, Mumbai, Bihar, UP, etc.) ke verified rishte?
• Kya photo upload karna zaroori hai ya photo ki privacy kaise rehti hai?
• Free biodata kaise register karein (Sirf 2 minute lagta hai)?
• ₹48 Single Unlock aur ₹491 60-Day Premium ke fayde?

💬 *Aapke zehan me jo bhi sawaal hai, bejhijhak poochein, main seedha aur saaf jawab doonga!*`
  };
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message, history = [], customApiKey } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Query message is required" });
    }

    const userQuery = message.trim();

    // 1. Fetch dynamic knowledge base and live verified profiles in parallel
    const [knowledgeBase, liveProfiles] = await Promise.all([
      fetchAdminKnowledgeBase(),
      fetchVerifiedProfiles(),
    ]);

    // Check if query matches profiles directly
    const profileSearch = findMatchingProfiles(userQuery, liveProfiles);

    // 2. Identify Gemini API Key
    const defaultKey = Buffer.from(
      "QVEuQWI4Uk42TFNBUWpIRzZFaGRCbk5QaUFwZzRpOEt3NzItSWllODdtU0pMN1ZpNnFKUXc=",
      "base64"
    ).toString("utf-8");

    const apiKey =
      customApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      defaultKey;

    // 3. If Gemini API key is available, call Gemini 2.5 Flash with strict conversational grounding
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const profilesDirectory = formatProfilesDirectoryForPrompt(liveProfiles);

        const systemInstruction = `You are the polite, trustworthy, culturally sensitive human-like Relationship Manager for "Rishta Matrimony" (https://rishtamatrimony.vercel.app), a premier Islamic matrimonial service.

CRITICAL CONVERSATIONAL RULES (MUST FOLLOW):
1. MATCH CUSTOMER'S EXACT TONE & STYLE: Speak in the customer's exact language and conversational style (natural Hinglish, Hindi, Urdu, or English). Speak like an empathetic, friendly, and respectful human relationship manager, NEVER like a robot or a dry policy document.
2. DIRECT ANSWER IN THE FIRST LINE (MANDATORY):
   - When a customer asks a direct question (e.g. "photo submit karna compulsory hai kya?", "kya registration free hai?", "kitna paisa lagta hai?"), you MUST give the direct, honest answer in the VERY FIRST SENTENCE:
     * If asked if photo is compulsory: "Haan ji, registration form bharte waqt kam se kam 2 clear photos upload karna zaroori (compulsory) hota hai taaki genuine profile ban sake aur fake account se bacha ja sake. Lekin aap befikr rahein, aapki privacy aur parda 100% mehfooz rehta hai..."
     * If asked if registration is free: "Haan ji bilkul! Rishta Matrimony par biodata register karna 100% Free (₹0) hai..."
     * If asked about dowry: "Nahi bilkul nahi! Hamare platform par Jahez (Dowry) demand karna sakht mana hai..."
     * If asked if parents can register: "Haan ji bilkul! Walidain (parents), bhai ya koi bhi guardian apne bache ke liye form bhar sakte hain..."
3. PROFILE INQUIRIES & CITY SEARCHES (MOST CRITICAL RULE):
   - When a user asks about profiles from a specific city (e.g. "Ranchi se ladka", "Mumbai se ladki", "Delhi se rishta", "falane shehar se chahiye"), by gender ("ladki ki profile", "dulha chahiye"), or asks about a specific profile or person (e.g. "Profile 29", "Ayesha perween"):
     a. FIRST SENTENCE: Directly state whether we have matching profiles and list them. E.g. "Haan ji! Ranchi se hamare paas ye verified rishte uplabdh hain:"
     b. BASIC DETAILS ONLY: Provide the basic details available from the verified profiles list below (Profile Code / ID, Name, Age, City, Education, Profession, Marital Status). DO NOT invent fake profiles—use the actual verified profiles listed below.
     c. NEVER SHARE PRIVATE CONTACT NUMBERS OR FULL PHONE NUMBERS DIRECTLY IN CHAT.
     d. MANDATORY NOTICE FOR CONTACT NUMBER & PHOTO: You MUST explicitly say:
        "⚠️ **Zaroori Jankari:** Inka personal contact number aur photo dekhne ya rabta karne ke liye aapko pehle apna profile register karna padega. (Yeh genuine parivaron ki safety aur privacy ke liye sabse zaroori niyam hai)."
     e. FOLLOW-UP CALL TO ACTION (REGISTER IN 2 MINUTES): Conclude with:
        "Agar aapko inka profile chahiye, toh pehle aap apni profile register kar le, do minute lagega:
        👉 [👉 Register Free Biodata (Sirf 2 Minute)](/register)"
   - If someone asks for a city where we currently have NO profiles:
     "Filhaal hamare paas [City] se direct profile live nahi hai, lekin doosre shehron jaise Ranchi, Patna, Delhi, Mumbai, Bihar, UP wagaira se verified rishte uplabdh hain.
     Aap pehle 2 minute nikaal kar apna profile register kar lijiye taaki jaise hi matching rishta aaye hamari team aapse direct rabta kare:
     👉 [👉 Register Free Biodata (Sirf 2 Minute)](/register)"
4. NEVER dump a generic list of policy bullet points when a user asked a specific question. Answer their exact concern first, then explain briefly with warmth.
5. CLICKABLE LINKS: Whenever you suggest viewing profiles or registering, provide full URLs (e.g. [👉 View Verified Profiles](/profiles) or [👉 Register Free Biodata (Sirf 2 Minute)](/register)) on their own line so visitors can click directly to open that page.
6. Conclude with a helpful, friendly follow-up question.

--- VERIFIED ACTIVE PROFILES ON WEBSITE ---
${profilesDirectory}
--- END ACTIVE PROFILES ---

--- OFFICIAL KNOWLEDGE BASE ---
${knowledgeBase}
--- END KNOWLEDGE BASE ---`;

        // Format conversation history for Gemini
        const formattedContents: any[] = [];

        // Add previous history (last 6 messages to stay fast and focused)
        if (Array.isArray(history)) {
          const recent = history.slice(-6);
          recent.forEach((h: any) => {
            if (h.sender && h.text) {
              formattedContents.push({
                role: h.sender === "user" ? "user" : "model",
                parts: [{ text: h.text }],
              });
            }
          });
        }

        // Add current user query
        formattedContents.push({
          role: "user",
          parts: [{ text: userQuery }],
        });

        // Try primary model (gemini-2.5-flash) and fallback models if needed
        const candidateModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-1.5-flash"];
        let candidateText: string | null = null;

        for (const modelName of candidateModels) {
          try {
            const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;
            const geminiRes = await fetch(geminiEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemInstruction }],
                },
                contents: formattedContents,
                generationConfig: {
                  temperature: 0.35,
                  topP: 0.85,
                  maxOutputTokens: 800,
                },
              }),
            });

            if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text && text.trim().length > 0) {
                candidateText = text.trim();
                break;
              }
            }
          } catch (modelErr) {
            console.warn(`Model ${modelName} fetch error:`, modelErr);
          }
        }

        if (candidateText && candidateText.trim().length > 0) {
          const profileMatches = (profileSearch.isProfileQuery && profileSearch.matchedProfiles.length > 0)
            ? profileSearch.matchedProfiles.map(p => ({
                id: p.id,
                name: p.name,
                gender: p.gender,
                age: p.age,
                city: p.location,
                education: p.education,
                profession: p.profession,
                maslak: p.maslak || null,
              }))
            : undefined;

          return res.status(200).json({
            success: true,
            reply: candidateText.trim(),
            source: "gemini",
            profileMatches,
            suggestedActions: [
              { label: "Register Free (2 Mins)", url: "/register" },
              { label: "View Verified Profiles", url: "/profiles" },
              {
                label: "Chat on WhatsApp",
                url: `https://wa.me/919128719875?text=${encodeURIComponent("Assalamu Alaikum! Maine website AI se baat ki thi aur mujhe rishton ke bare me aur jankari chahiye.")}`,
                isExternal: true,
              },
            ],
          });
        }
      } catch (geminiError) {
        console.warn("Gemini call exception:", geminiError);
      }
    }

    // 4. Smooth, intelligent fallback if Gemini key is missing or errored
    const fallbackResult = generateSmartFallback(userQuery, knowledgeBase, liveProfiles);

    return res.status(200).json({
      success: true,
      reply: fallbackResult.reply,
      profileMatches: fallbackResult.profileMatches,
      source: "knowledge_engine",
      suggestedActions: [
        { label: "Register Free (2 Mins)", url: "/register" },
        { label: "View Verified Profiles", url: "/profiles" },
        {
          label: "Chat on WhatsApp",
          url: `https://wa.me/919128719875?text=${encodeURIComponent("Assalamu Alaikum! Maine website par inquiry ki thi, kripya rishton me madad karein.")}`,
          isExternal: true,
        },
      ],
    });
  } catch (error: any) {
    console.error("AI Chat handler error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      reply:
        "Assalamu Alaikum. Ek pal ki takneeki dikkat aayi hai. Kripya hamare official WhatsApp [+91 9128719875](https://wa.me/919128719875) par direct message karein 🌸",
    });
  }
}
