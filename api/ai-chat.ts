// Vercel Serverless Function: AI Chatbot API with Gemini & Knowledge Base Grounding
export const maxDuration = 30;

const SUPABASE_URL = "https://rxlzlkcdszulyetcxxih.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bHpsa2Nkc3p1bHlldGN4eGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTAzODIsImV4cCI6MjA3NTI2NjM4Mn0.PXcKNOiJlQr_BSqPZKIGTQYKK-e6Y5obVg7WPJm17hM";

// Default authentic knowledge base (15+ core platform policies & Islamic rules)
const DEFAULT_KNOWLEDGE = `
--- RISHTA MATRIMONY OFFICIAL POLICIES & KNOWLEDGE BASE ---
1. ABOUT THE PLATFORM:
- Website: Rishta Matrimony (https://rishtamatrimony.vercel.app)
- Mission: 100% Halal, safe, verified, and dignified Islamic matchmaking for Muslims.
- Values: Adab, Taqwa, modesty (Haya), privacy, and zero tolerance for casual dating or fake accounts.
- Contact WhatsApp: +91 9128719875
- Official Email: info.rista2025@gmail.com

2. PRICING & PLANS:
- 100% Free Registration: Any brother (Dulha) or sister (Dulhan) or their parents can create and submit their matrimonial biodata completely FREE at /register.
- Single Profile Unlock: ₹48 one-time. Allows you to unlock 1 verified member's direct phone number, family contact, and full biodata.
- Premium Membership: ₹491 for 60 Days (2 full months).
  * Includes: Access to all verified profiles, direct contact numbers, priority matchmaking suggestions, and direct support on WhatsApp.
- No hidden charges, no recurring auto-debit. Payment is 100% transparent via secure UPI / QR code.

3. VERIFICATION & SAFETY:
- 100% Manual Verification: Every profile submitted is personally reviewed and verified by the admin team via a phone call within 24 to 48 hours.
- Fake & Fraud Prevention: Suspicious, incomplete, or unverified submissions are rejected.
- Direct Admin Mediation: To protect family modesty and respect, admin ensures serious family-oriented inquiries only.

4. PHOTO PRIVACY & PARDA:
- We deeply respect Islamic Parda (Hijab / Niqab).
- Sisters and brothers can keep their photos private (Blurred or Parda mode).
- Photos are never published publicly on open social media or search engines.
- Contact numbers are strictly hidden behind manual unlock / admin verification.

5. ISLAMIC PRINCIPLES:
- Dowry (Jahez) strictly prohibited: In Islam, demanding Jahez is unlawful and against the Sunnah. The Prophet ﷺ taught simplicity (Aisarun-Nikah Barkatan).
- Mehr (Dower): Mehr is the exclusive and obligatory Islamic right of the bride given willingly by the groom (Surah An-Nisa 4:4).
- Salatul Istikhara: The Prophet ﷺ taught Istikhara for all major decisions including marriage (Sahih al-Bukhari 1162). Istikhara means seeking Allah's guidance; seeing dreams is not mandatory.
- Wali (Guardian) Involvement: Halal nikah requires the knowledge, consent, and blessings of parents / guardians.
- Criteria for choosing a spouse: The Prophet ﷺ advised prioritizing Deen, character, and Taqwa above all (Sahih al-Bukhari 5090).

6. HOW TO GET STARTED:
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
        // Plain text fallback
        return DEFAULT_KNOWLEDGE + "\n\n" + data[0].content;
      }
    }
  } catch (err) {
    console.warn("Could not load dynamic knowledge base from Supabase:", err);
  }

  return DEFAULT_KNOWLEDGE;
}

// Intelligent Semantic Rule Engine for instant, reliable fallback
function generateSmartFallback(query: string, knowledge: string): string {
  const q = query.toLowerCase();

  if (q.includes("price") || q.includes("plan") || q.includes("charge") || q.includes("fee") || q.includes("paisa") || q.includes("cost") || q.includes("491") || q.includes("48")) {
    return `🌸 **Rishta Matrimony Fee & Plans:**

• **Free Registration:** Biodata register karna bilkul **100% Free** hai. Koi bhi brother ya sister / parents free me form bhar sakte hain.
• **Single Profile Unlock (₹48):** Kisi 1 verified rishte ka direct verified phone number aur family contact unlock karne ke liye sirf ₹48 lagte hain.
• **Premium Plan (₹491 for 60 Days):** 2 mahine ke liye sabhi verified rishton tak access, direct contact numbers, aur direct WhatsApp assistance.

💬 *Kya aap apna free biodata register karna chahte hain ya kisi specific profile ka number chahiye?*`;
  }

  if (q.includes("register") || q.includes("form") || q.includes("profile kaise banaye") || q.includes("biodata")) {
    return `Alhamdulillah! Rishta Matrimony par biodata banana behad aasan aur **100% Free** hai:

1. Website ke top par **'Register Free'** button par click karein.
2. Apni basic details (Taleem, Pesha, Umar, City, Family aur Partner Preference) darj karein.
3. Form submit karne ke 24-48 ghante ke andar admin team call karke verify karegi aur aapka profile live ho jayega.

👉 *Aap abhi direct /register par jaakar apna biodata submit kar sakte hain.*`;
  }

  if (q.includes("photo") || q.includes("parda") || q.includes("privacy") || q.includes("security") || q.includes("safe") || q.includes("tasveer")) {
    return `🌸 **Photo & Data Privacy Policy:**

Hamare platform par Islami Haya aur Parda ka khaas khayal rakha jata hai:
• **Photo Parda Option:** Behen ya bhai apni photo ko Parda / Blurred mode me rakh sakte hain.
• **No Public Sharing:** Aapki photo ya phone number kisi bhi social media ya open web par bina marzi ke display nahi kiya jata.
• **Manual Verification:** Har user ko phone verification ke baad hi access milta hai, taaki fake log door rahein.`;
  }

  if (q.includes("istikhara") || q.includes("dua") || q.includes("khwab")) {
    return `🤲 **Shadi ke liye Salatul Istikhara:**

• **Sunnah Tareeqa:** 2 Rakat Nafl Salah padhein, fir Allah ki hamd-o-sana aur Durood Sharif ke baad Masnoon Istikhara Dua padhein (Sahih al-Bukhari 1162).
• **Wazahat:** Istikhara me khwab aana shart nahi hai. Dil ka kisi ek taraf itminan hona aur kaam me aasaani paida hona hi khair ki alamat hai.

💬 *Kya aap proposal ke liye dua ka tareeqa jan-na chahte hain?*`;
  }

  if (q.includes("jahez") || q.includes("dowry")) {
    return `🚫 **Islam me Jahez (Dowry) ki Mumaniyat:**

Islam me ladki ya uske gharwalon se Jahez demand karna sakht mana aur ghair-islami hai.
• Sunnah ka paighaam aasaani aur sadgi hai (Aisarun-Nikah Barkatan).
• Rasoolullah ﷺ ne shadi ko aasan aur ba-barkat banane ka hukum diya hai. Hamara platform Jahez-free rishton ko promote karta hai.`;
  }

  if (q.includes("contact") || q.includes("whatsapp") || q.includes("phone") || q.includes("admin") || q.includes("number")) {
    return `Assalamu Alaikum! Hamari team se direct rabta karne ke liye:

• **Official WhatsApp:** [+91 9128719875](https://wa.me/919128719875)
• **Official Email:** info.rista2025@gmail.com
• **Timing:** Subah 9:00 AM se Shaam 9:00 PM IST

💬 *Aap direct WhatsApp par message bhej kar bhi madad le sakte hain!*`;
  }

  return `Assalamu Alaikum! 🌸✨

Main Rishta Matrimony ka official AI Assistant hoon. Main aapki har tarah se madad kar sakta hoon:
• Verified Dulha / Dulhan ke rishton ki jankari
• Free Biodata Registration (/register)
• Plans (₹48 Single Unlock & ₹491 60-Day Premium)
• Islamic Shadi, Nikah, Istikhara aur Mehr ke masail

💬 *Bataiye, aap kis shehar ya maslak ke rishte dhoondh rahe hain?*`;
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

    // 3. If Gemini API key is available, call Gemini 1.5 Flash with strict grounding
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const systemInstruction = `You are the polite, trustworthy, and knowledgeable AI Assistant for "Rishta Matrimony" (https://rishtamatrimony.vercel.app), a premier Islamic Matrimonial service.

YOUR CORE DUTIES:
1. Speak in a warm, respectful, and culturally appropriate tone in the user's language (Urdu, Hinglish, Hindi, or English).
2. STRICT GROUNDING: ONLY provide facts, fees, and rules that match the provided Knowledge Base below. NEVER make up false prices, plans, or guarantees.
3. If the user asks about matchmaking, rishte, or proposals, highlight that registration is 100% Free at /register, and encourage them to leave their Name & WhatsApp number so the matchmaking team can send matching biodatas on WhatsApp.
4. For Islamic topics (Istikhara, Mehr, Dowry, Humsafar), provide authentic Quranic and Sahih Hadith guidance. Emphasize that dowry is prohibited and simplicity brings barakah.
5. Use tasteful emojis (🌸, 🤲, 💍, 👰, 🤵, ✨, 😊). Keep paragraphs concise with readable bullet points.
6. Always end with a natural, helpful question to guide them to next steps.

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
              temperature: 0.3, // Low temperature for high factual accuracy and zero hallucination
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
