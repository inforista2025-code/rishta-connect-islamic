import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionLinks?: { label: string; url: string; isExternal?: boolean; variant?: 'default' | 'outline' | 'whatsapp' }[];
  profileMatches?: {
    id: number;
    name: string;
    gender: string;
    age: string;
    city: string;
    education: string;
    profession: string;
    maslak: string | null;
  }[];
}

// Authentic Quran & Hadith Knowledge Base
export const authenticIslamicReferences = {
  spouseSelection: {
    hadithRef: `Sahih al-Bukhari 5090, Sahih Muslim 1466`,
    arabic: `تُنْكَحُ الْمَرْأَةُ لأَرْبَعٍ: لِمَالِهَا وَلِحَسَبِهَا وَجَمَالِهَا وَلِدِينِهَا، فَاظْفَرْ بِذَاتِ الدِّينِ تَرِبَتْ يَدَاكَ`,
    translation: `A woman is married for four reasons: her wealth, lineage, beauty, and religious commitment. So choose the one with religious commitment and you will prosper.`,
    explanation: `The Prophet ﷺ advised prioritizing Taqwa, character, and Islamic manners (Deen) above wealth and status. The exact same standard applies when selecting a groom.`
  },
  nikahSunnah: {
    hadithRef: `Sahih al-Bukhari 5066, Sahih Muslim 1400`,
    quranRef: `Surah Ar-Rum, 30:21`,
    quranAyah: `And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.`,
    translation: `O young people! Whoever among you can afford to marry, let him marry, for it helps lower the gaze and guard chastity.`
  },
  istikhara: {
    hadithRef: `Sahih al-Bukhari 1162`,
    dua: `اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ، وَتَعْلَمُ وَلاَ أَعْلَمُ، وَأَنْتَ عَلاَّمُ الْغُيُوبِ...`,
    method: `1. Perform 2 voluntary Rak'ahs of Salah with sincere intention.
2. Praise Allah, send Salawat upon Prophet Muhammad ﷺ, and recite the Masnoon Istikhara Dua.
3. Put your trust in Allah: Ease in matter indicates goodness, while obstacles indicate protection from harm.`
  },
  mehr: {
    quranRef: `Surah An-Nisa, 4:4`,
    hadithRef: `Sahih al-Bukhari 5126, Sahih Muslim 1425`,
    quranAyah: `And give the women (upon marriage) their bridal gifts (Mehr) graciously as a free gift.`,
    hadithText: `The Prophet ﷺ said to a companion seeking marriage: "Give her something, even if it is an iron ring."`
  }
};

// Search database for live profiles when user asks for matchmaking
export async function searchProfilesForAssistant(queryText: string) {
  try {
    const q = queryText.toLowerCase();
    let genderFilter: string | null = null;
    if (q.includes('female') || q.includes('dulhan') || q.includes('bride') || q.includes('ladki') || q.includes('sister') || q.includes('women')) {
      genderFilter = 'Female';
    } else if (q.includes('male') || q.includes('dulha') || q.includes('groom') || q.includes('ladka') || q.includes('brother') || q.includes('men')) {
      genderFilter = 'Male';
    }

    let supabaseQuery = supabase
      .from('profiles_data')
      .select('id, name, gender, age, location, education, profession, maslak')
      .eq('is_live', true)
      .eq('verification_status', 'verified')
      .limit(3);

    if (genderFilter) {
      supabaseQuery = supabaseQuery.eq('gender', genderFilter);
    }

    // Check for common cities / states
    const cities = ['delhi', 'mumbai', 'bihar', 'patna', 'lucknow', 'up', 'uttar pradesh', 'hyderabad', 'kolkata', 'bangalore', 'pune'];
    for (const city of cities) {
      if (q.includes(city)) {
        supabaseQuery = supabaseQuery.ilike('location', `%${city}%`);
        break;
      }
    }

    const { data } = await supabaseQuery;
    return (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      gender: p.gender,
      age: p.age,
      city: p.location,
      education: p.education,
      profession: p.profession,
      maslak: p.maslak,
    }));
  } catch (err) {
    console.warn('Profile search error in assistant:', err);
    return [];
  }
}

// Smart Intelligent Islamic Matrimonial Assistant Engine
export async function generateIslamicAssistantResponse(userPrompt: string): Promise<{
  text: string;
  actionLinks?: { label: string; url: string; isExternal?: boolean; variant?: 'default' | 'outline' | 'whatsapp' }[];
  profileMatches?: any[];
}> {
  const q = userPrompt.toLowerCase().trim();

  // 1. Check if user is looking for matches / profiles
  if (
    q.includes('profile') || 
    q.includes('rishta') || 
    q.includes('dulhan') || 
    q.includes('dulha') || 
    q.includes('bride') || 
    q.includes('groom') || 
    q.includes('match') || 
    q.includes('ladki') || 
    q.includes('ladka')
  ) {
    const profiles = await searchProfilesForAssistant(userPrompt);
    if (profiles && profiles.length > 0) {
      return {
        text: `Alhamdulillah! Here are some verified proposals currently available on **Rishta Matrimony** matching your search criteria:`,
        profileMatches: profiles,
        actionLinks: [
          { label: '🔍 Browse All Verified Profiles', url: '/profiles', variant: 'outline' },
          { label: '⭐ Unlock Contacts with Premium (₹491)', url: '/pricing', variant: 'default' },
          { label: '💬 Inquire on WhatsApp', url: 'https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20inquire%20about%20verified%20profiles%20on%20Rishta%20Matrimony.', isExternal: true, variant: 'whatsapp' },
        ]
      };
    }
  }

  // 2. Questions about Contact, Unlock, Paid Info, Pricing, Premium
  if (
    q.includes('contact') || 
    q.includes('number') || 
    q.includes('phone') || 
    q.includes('photo') || 
    q.includes('unlock') || 
    q.includes('paid') || 
    q.includes('price') || 
    q.includes('pricing') || 
    q.includes('premium') || 
    q.includes('491') || 
    q.includes('plan')
  ) {
    return {
      text: `### 🛡️ Photo & Contact Number Privacy:\nTo maintain Islamic modesty and avoid spam, candidate WhatsApp numbers and unblurred photos are protected.\n\n### ⭐ Premium Plan Features (₹491 for 2 Months):\n• **Direct Verified WhatsApp Numbers** for candidates & families.\n• **Unblurred Photos Access** across all profiles.\n• **1-on-1 WhatsApp Matchmaking Support**.\n• **Unlimited Profile Views** across India and abroad.\n\nActivate your Premium membership to connect with matching proposals directly:`,
      actionLinks: [
        { label: '💎 Activate Premium Plan (₹491)', url: '/pricing', variant: 'default' },
        { label: '💬 Instant WhatsApp Upgrade (+91 9128719875)', url: 'https://wa.me/919128719875?text=Assalamu%20Alaikum%20Team%20Rishta%20Matrimony%2C%20I%20would%20like%20to%20upgrade%20to%20the%20Premium%20Rishta%20Plan%20(Rs.%20491%20for%202%20Months).', isExternal: true, variant: 'whatsapp' }
      ]
    };
  }

  // 3. Questions about Istikhara
  if (q.includes('istikhara') || q.includes('dua')) {
    const ref = authenticIslamicReferences.istikhara;
    return {
      text: `### 🤲 The Sunnah of Salatul Istikhara for Marriage:\n\n**Authentic Reference:**\n> Jabir ibn Abdullah (RA) narrated: The Prophet ﷺ used to teach us Istikhara in all matters just as he taught us a Surah from the Quran.\n> **[${ref.hadithRef}]**\n\n**How to Perform Istikhara:**\n${ref.method}\n\n*Note:* Istikhara does not require a dream. Ease in proceedings and mutual peace of heart are signs of Allah's blessing.`,
      actionLinks: [
        { label: '🔍 Browse Compatible Profiles', url: '/profiles', variant: 'default' },
        { label: '📖 Read Marriage Guidance Blog', url: '/blog', variant: 'outline' }
      ]
    };
  }

  // 4. Questions about Mehr (Dower)
  if (q.includes('mehr') || q.includes('mahr') || q.includes('dower') || q.includes('haq mehr')) {
    const ref = authenticIslamicReferences.mehr;
    return {
      text: `### 💍 Islamic Principles on Mehr (Dower):\n\n**Quranic Command:**\n> *"And give the women (upon marriage) their bridal gifts (Mehr) graciously as a free gift."*\n> **[${ref.quranRef}]**\n\n**Prophetic Sunnah:**\n> The Prophet ﷺ said: *"${ref.hadithText}"*\n> **[${ref.hadithRef}]**\n\n**Key Guidelines:**\n• Mehr is the exclusive right of the bride.\n• The Sunnah encourages moderation and simplicity without unnecessary financial hardship.\n• It should be agreed upon with mutual respect.`,
      actionLinks: [
        { label: '📖 Explore Marriage Guidance', url: '/blog', variant: 'outline' },
        { label: '🔍 Search Profiles', url: '/profiles', variant: 'default' }
      ]
    };
  }

  // 5. Questions about Choosing a Righteous Spouse (Deendar Life Partner)
  if (q.includes('choose') || q.includes('selection') || q.includes('spouse') || q.includes('kufu') || q.includes('partner') || q.includes('humsafar')) {
    const ref = authenticIslamicReferences.spouseSelection;
    return {
      text: `### 👰 Choosing a Righteous Spouse in Islam:\n\n**Hadith Reference:**\n> *"${ref.translation}"*\n> **[${ref.hadithRef}]**\n\n**Core Islamic Criteria:**\n• **Deen & Character (Taqwa & Akhlaq):** The strongest foundation for enduring love and family peace.\n• **Compatibility (Kufu):** Alignment in religious values, lifestyle, and goals.\n• **Family Involvement (Wali):** Dignified communication through parents and guardians.\n\nExplore verified profiles on Rishta Matrimony:`,
      actionLinks: [
        { label: '👰 View Verified Brides', url: '/profiles?gender=Female', variant: 'default' },
        { label: '🤵 View Verified Grooms', url: '/profiles?gender=Male', variant: 'outline' },
        { label: '📝 Free Biodata Registration', url: '/register', variant: 'outline' }
      ]
    };
  }

  // 6. Free Registration questions
  if (q.includes('register') || q.includes('create profile') || q.includes('biodata') || q.includes('join')) {
    return {
      text: `### 📝 Free Biodata Registration on Rishta Matrimony:\nYou can create and register your matrimonial biodata **100% Free**:\n\n1. **Personal Information** (Name, DOB, Location, Height)\n2. **Education & Career** (Degree, Profession, Family Background)\n3. **Islamic Details** (Maslak, Deeni Education, Namaz)\n4. **Partner Preferences** (Age preference, City, Photo upload)\n\nEvery profile is manually verified before going live to maintain authenticity.`,
      actionLinks: [
        { label: '✨ Register Free Biodata', url: '/register', variant: 'default' },
        { label: '🔑 Member Portal Login', url: '/member/login', variant: 'outline' }
      ]
    };
  }

  // 7. Try Gemini AI if configured in localStorage
  const geminiKey = localStorage.getItem('gemini_api_key');
  if (geminiKey) {
    try {
      const prompt = `You are the Official AI Matchmaker for "Rishta Matrimony" (https://rishtamatrimony.vercel.app).
User question: "${userPrompt}"

RULES:
1. Always maintain a warm, respectful matrimonial matchmaker persona.
2. Quote authentic Quran (Surah:Ayah) and Sahih Hadith (Sahih al-Bukhari or Sahih Muslim with book/number).
3. If user is searching for marriage candidates, guide them to /profiles.
4. If they ask about unlocking candidate contact numbers or photos, explain the ₹491 (2 Months Unlimited Access) plan with link to /pricing.
5. Format cleanly using concise bullet points and short paragraphs without clutter.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6 }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (geminiReply) {
          return {
            text: geminiReply,
            actionLinks: [
              { label: '🔍 Browse Profiles', url: '/profiles', variant: 'outline' },
              { label: '⭐ Premium Plan (₹491)', url: '/pricing', variant: 'default' }
            ]
          };
        }
      }
    } catch (e) {
      console.warn('Gemini dynamic API call fallback:', e);
    }
  }

  // General Matrimonial Welcome Guidance
  return {
    text: `Assalamu Alaikum! Welcome to **Rishta Matrimony Matchmaker Assistant** 💍\n\nI am here to assist you with finding compatible Muslim matrimonial proposals and providing guidance according to the Quran & Sunnah.\n\n• **Search Proposals:** Find verified Brides & Grooms by city & maslak.\n• **Privacy & Security:** Contact numbers & unblurred photos protected under ₹491 Premium plan.\n• **Deeni Guidance:** Sunnah of Nikah, Istikhara Dua, and Mehr rules.\n\nHow can I help you today?`,
    actionLinks: [
      { label: '🔍 Browse Verified Profiles', url: '/profiles', variant: 'default' },
      { label: '💎 Premium Membership (₹491)', url: '/pricing', variant: 'outline' },
      { label: '📝 Free Registration', url: '/register', variant: 'outline' },
      { label: '💬 WhatsApp Matchmaking Support', url: 'https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20have%20an%20inquiry%20regarding%20Rishta%20Matrimony.', isExternal: true, variant: 'whatsapp' }
    ]
  };
}
