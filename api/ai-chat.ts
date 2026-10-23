// Vercel Serverless Function: AI Chatbot API with Gemini & Knowledge Base Grounding
export const maxDuration = 30;

const SUPABASE_URL = "https://rxlzlkcdszulyetcxxih.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bHpsa2Nkc3p1bHlldGN4eGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTAzODIsImV4cCI6MjA3NTI2NjM4Mn0.PXcKNOiJlQr_BSqPZKIGTQYKK-e6Y5obVg7WPJm17hM";

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
  Answer: YES (Haan ji). Registration form (/register) submit karte waqt kam se kam 2 clear recent photos upload karna zaroori (mandatory) hota hai. Yeh isliye zaroori hai taaki genuine profile ban sake aur fake logo se bacha ja sake.
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
- Step 1: Register free biodata at https://rishtamatrimony.vercel.app/register
- Step 2: Browse verified proposals at https://rishtamatrimony.vercel.app/profiles
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

// Intelligent Semantic Rule Engine for instant, direct, and conversational responses
function generateSmartFallback(query: string, knowledge: string): string {
  const q = query.toLowerCase().trim();

  // 1. PHOTO COMPULSORY / MANDATORY / ZAROORI QUERY
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
    return `Haan ji, registration form submit karte waqt kam se kam **2 clear photos** upload karna zaroori (compulsory) hota hai 🌸

Iska maqsad yeh hai ki:
• Hamare platform par sirf **genuine aur verified rishte** hi jud sakein aur kisi bhi fake account se bacha ja sake.
• Dono khandano ko tasalli aur bharosa ho sake.

**Lekin aap befikr rahein — aapki Privacy aur Parda 100% mehfooz hai:**
• Aapki photo kisi bhi open social media ya Google search par show nahi hoti.
• Behenon ke liye Parda/Hijab ka pura ehtram kiya jata hai aur photo confidential rehti hai.

💬 *Kya aapko photo upload karne ya biodata form bharne me koi dikkat aa rahi hai? Main poori madad karunga!*`;
  }

  // 2. PHOTO PRIVACY / PARDA / SAFETY
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
    return `Ji bilkul! Rishta Matrimony par photo aur personal details **100% safe aur confidential** rehti hain 🌸

• **Parda Respect:** Behenon ke Islami Parda aur Hijab ka pura ahtram kiya jata hai.
• **No Open Public Display:** Aapki photos kisi bhi social media, Google ya open web par bina marzi display nahi ki jaati hain.
• **Manual Verification:** Sirf verified aur serious rishta dhoondhne wale khandano ko hi review ke baad profile contact unlock karne ki ijazat milti hai.

💬 *Kya aap apna free biodata register karna chahte hain?*`;
  }

  // 3. IS REGISTRATION FREE / KITNA PAISA / CHARGES
  const isFreeAsked = q.includes("free") || q.includes("muft") || q.includes("bina paise") || q.includes("koi charge");
  const isPriceAsked = q.includes("kitna paisa") || q.includes("kya charge") || q.includes("fees") || q.includes("charges") || q.includes("plan") || q.includes("price") || q.includes("cost") || q.includes("paisa lagega");

  if (isFreeAsked || (q.includes("register") && isPriceAsked)) {
    return `Haan ji bilkul! Rishta Matrimony par apna **Matrimonial Biodata register karna 100% Free (₹0)** hai 🌸

• Dulha (Groom) ya Dulhan (Bride) ya unke Walidain bilkul muft me form bhar sakte hain.
• Charges sirf tab aate hain jab aap kisi verified rishte ke walidain ka **direct phone number unlock** karna chahein (Sirf ₹48 single profile unlock, ya ₹491 me 2 mahine ka unlimited plan).

👉 *Aap abhi direct website ke top par 'Register Free' par jaakar biodata submit kar sakte hain.*

💬 *Kya aap apna biodata register karne me madad chahte hain?*`;
  }

  // 4. CAN PARENTS / GUARDIANS REGISTER FOR CHILDREN
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
    return `Haan ji, bilkul! Parents (Mata-Pita), bhai ya koi bhi guardian apne bete ya beti ke liye biodata register kar sakte hain 🌸

Balke hamare platform par **zyadatar rishte walidain hi manage karte hain**, taaki shariat aur ba-adab tareeqe se baat aage badhe aur donon khandano me barkat rahe.

💬 *Bataiye, aap apne bete ke liye rishta dekh rahe hain ya beti ke liye? Kis city me dekh rahe hain?*`;
  }

  // 5. PROFILE VERIFICATION TIME & PHONE CALL
  if (
    q.includes("verify") || 
    q.includes("verification") || 
    q.includes("kitni der") || 
    q.includes("kab call") || 
    q.includes("phone call") || 
    q.includes("fake") || 
    q.includes("genuine")
  ) {
    return `Hamare platform par har profile ko **100% Manually Verify** kiya jata hai 🌸

• Form submit karne ke **24 se 48 ghante** ke andar hamari admin team aapke number par phone call karti hai.
• Call par details confirm karne ke baad profile verified mark karke live kiya jata hai, taaki koi bhi fake account na aaye.

💬 *Kya aapne form submit kar diya hai? Agar haan, toh aap WhatsApp (+91 9128719875) par bhi direct bata sakte hain.*`;
  }

  // 6. DOWRY / JAHEZ
  if (q.includes("jahez") || q.includes("dowry") || q.includes("dahej")) {
    return `Nahi, bilkul nahi! Hamare platform par Jahez (Dowry) ki mang karna **sakht mana aur prohibited** hai 🚫

• Islam aur Sunnah me Jahez ki koi jagah nahi hai. Rasoolullah ﷺ ne farmaya: Sabse zyada barkat wala nikah woh hai jisme sabse kam maali bojh ho (Aisarun-Nikah Barkatan).
• Hum sirf un shareef khandano ko jodte hain jo bina kisi dahej ke, sunnah ke mutabiq sadgi se nikah karna chahte hain 🌸`;
  }

  // 7. SPECIFIC CITY / LOCATION SEARCHES
  const cities = ["patna", "ranchi", "delhi", "mumbai", "bihar", "jharkhand", "lucknow", "dhanbad", "up", "kolkata", "hyderabad", "bengaluru"];
  const matchedCity = cities.find(c => q.includes(c));
  if (matchedCity) {
    const formattedCity = matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1);
    return `Alhamdulillah! Hamare paas **${formattedCity}** aur aas-paas ke verified deendar rishte maujood hain 👰🤵

• Aap website ke **'Profiles'** section me jaakar ${formattedCity} ke rishte filter karke dekh sakte hain.
• Ya aap apna WhatsApp number share kar sakte hain taaki hamari matchmaking team direct aapke pasand ke rishte WhatsApp par share kare.

💬 *Aapko ${formattedCity} me Dulhan (Bride) ka rishta chahiye ya Dulha (Groom) ka?*`;
  }

  // 8. FEES / CHARGES DETAILS
  if (q.includes("price") || q.includes("plan") || q.includes("charge") || q.includes("fee") || q.includes("paisa") || q.includes("cost") || q.includes("491") || q.includes("48")) {
    return `🌸 **Rishta Matrimony Fee & Plans:**

• **Free Registration:** Biodata register karna bilkul **100% Free** hai. Koi bhi brother ya sister / parents free me form bhar sakte hain.
• **Single Profile Unlock (₹48):** Kisi 1 verified rishte ka direct verified phone number aur family contact unlock karne ke liye sirf ₹48 lagte hain.
• **Premium Plan (₹491 for 60 Days):** 2 mahine ke liye sabhi verified rishton tak access, direct contact numbers, aur direct WhatsApp assistance.

💬 *Kya aap apna free biodata register karna chahte hain ya kisi specific profile ka number chahiye?*`;
  }

  // 9. ISTIKHARA & DEENI DUA
  if (q.includes("istikhara") || q.includes("dua") || q.includes("khwab")) {
    return `🤲 **Shadi ke liye Salatul Istikhara ka Sunnah Tareeqa:**

1. 2 Rakat Nafl Salah padhein.
2. Allah ki hamd-o-sana aur Durood Sharif ke baad Masnoon Istikhara Dua padhein (Sahih al-Bukhari 1162).
3. **Wazahat:** Istikhara me khwab aana shart nahi hai. Dil ka kisi ek taraf itminan hona aur kaam me aasaani paida hona hi khair ki alamat hai 🌸

💬 *Kya aap proposal ke liye dua ka tareeqa jan-na chahte hain?*`;
  }

  // 10. CONTACT / WHATSAPP / HELPLINE
  if (q.includes("contact") || q.includes("whatsapp") || q.includes("phone") || q.includes("admin") || q.includes("number") || q.includes("helpline")) {
    return `Assalamu Alaikum! Hamari team se direct rabta karne ke liye:

• **Official WhatsApp:** [+91 9128719875](https://wa.me/919128719875)
• **Official Email:** info.rista2025@gmail.com
• **Timing:** Subah 9:00 AM se Shaam 9:00 PM IST

💬 *Aap direct WhatsApp par message bhej kar bhi madad le sakte hain!*`;
  }

  // 11. GENERAL CONVERSATIONAL CATCH-ALL
  return `Assalamu Alaikum! 🌸✨

Main samajh gaya. Rishta Matrimony par main aapki matrimonial search aur Islamic guidance dono me poori tarah madad karne ke liye hazir hoon 😊

Aap mujhse bejhijhak pooch sakte hain:
• Kya photo upload karna zaroori hai ya photo ki privacy kaise rehti hai?
• Free biodata kaise register karein (/register)?
• ₹48 Single Unlock aur ₹491 60-Day Premium ke fayde?
• Kisi specific shehar (jaise Ranchi, Patna, Delhi, Bihar, etc.) ke verified rishte?

💬 *Aapke zehan me jo bhi sawaal hai, bejhijhak poochein, main seedha aur saaf jawab doonga!*`;
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

    // 1. Fetch dynamic knowledge base (combining default + admin uploaded guidelines)
    const knowledgeBase = await fetchAdminKnowledgeBase();

    // 2. Identify Gemini API Key
    const apiKey =
      customApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      "";

    // 3. If Gemini API key is available, call Gemini 1.5 Flash with strict conversational grounding
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const systemInstruction = `You are the polite, trustworthy, culturally sensitive human-like Relationship Manager for "Rishta Matrimony" (https://rishtamatrimony.vercel.app), a premier Islamic matrimonial service.

CRITICAL CONVERSATIONAL RULES (MUST FOLLOW):
1. MATCH CUSTOMER'S EXACT TONE & STYLE: Speak in the customer's exact language and conversational style (natural Hinglish, Hindi, Urdu, or English). Speak like an empathetic, friendly, and respectful human relationship manager, NEVER like a robot or a dry policy document.
2. DIRECT ANSWER IN THE FIRST LINE (MANDATORY):
   - When a customer asks a direct question (e.g. "photo submit karna compulsory hai kya?", "kya registration free hai?", "kitna paisa lagta hai?"), you MUST give the direct, honest answer in the VERY FIRST SENTENCE:
     * If asked if photo is compulsory: "Haan ji, registration form bharte waqt kam se kam 2 clear photos upload karna zaroori (compulsory) hota hai taaki genuine profile ban sake aur fake account se bacha ja sake. Lekin aap befikr rahein, aapki privacy aur parda 100% mehfooz rehta hai..."
     * If asked if registration is free: "Haan ji bilkul! Rishta Matrimony par biodata register karna 100% Free (₹0) hai..."
     * If asked about dowry: "Nahi bilkul nahi! Hamare platform par Jahez (Dowry) demand karna sakht mana hai..."
     * If asked if parents can register: "Haan ji bilkul! Walidain (parents), bhai ya koi bhi guardian apne bache ke liye form bhar sakte hain..."
3. NEVER dump a generic list of policy bullet points when a user asked a specific question. Answer their exact concern first, then explain briefly with warmth.
4. Conclude with a helpful, friendly follow-up question.

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

        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

        const geminiRes = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            contents: formattedContents,
            generationConfig: {
              temperature: 0.35, // Low temperature for high factual accuracy + natural conversational warmth
              topP: 0.85,
              maxOutputTokens: 800,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

          if (candidateText && candidateText.trim().length > 0) {
            return res.status(200).json({
              success: true,
              reply: candidateText.trim(),
              source: "gemini",
              suggestedActions: [
                { label: "Register Free", url: "/register" },
                {
                  label: "Chat on WhatsApp",
                  url: `https://wa.me/919128719875?text=${encodeURIComponent("Assalamu Alaikum! Maine website AI se baat ki thi aur mujhe rishton ke bare me aur jankari chahiye.")}`,
                  isExternal: true,
                },
              ],
            });
          }
        } else {
          const errBody = await geminiRes.text();
          console.warn("Gemini API non-200 response:", geminiRes.status, errBody);
        }
      } catch (geminiError) {
        console.warn("Gemini call exception:", geminiError);
      }
    }

    // 4. Smooth, intelligent fallback if Gemini key is missing or errored
    const fallbackReply = generateSmartFallback(userQuery, knowledgeBase);

    return res.status(200).json({
      success: true,
      reply: fallbackReply,
      source: "knowledge_engine",
      suggestedActions: [
        { label: "Register Free Biodata", url: "/register" },
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
