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
    hadith: `حَدَّثَنَا مُسَدَّدٌ، حَدَّثَنَا يَحْيَى، عَنْ عُبَيْدِ اللَّهِ، قَالَ حَدَّثَنِي سَعِيدُ بْنُ أَبِي سَعِيدٍ، عَنْ أَبِيهِ، عَنْ أَبِي هُرَيْرَةَ ـ رضى الله عنه ـ عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ:
"تُنْكَحُ الْمَرْأَةُ لأَرْبَعٍ: لِمَالِهَا وَلِحَسَبِهَا وَجَمَالِهَا وَلِدِينِهَا، فَاظْفَرْ بِذَاتِ الدِّينِ تَرِبَتْ يَدَاكَ"
[Sahih al-Bukhari 5090, Sahih Muslim 1466]`,
    translation: `"A woman is married for four things: for her wealth, her family status, her beauty, and her religion. So choose the one who is religious, may your hands be rubbed with dust (may you prosper)."`,
    explanation: `The Prophet ﷺ emphasized that while worldly qualities (wealth, lineage, beauty) are natural considerations, religious commitment (Taqwa, Akhlaq, Deen) is the ultimate foundation for enduring marital harmony. The same golden standard applies when a woman and her Wali choose a groom.`
  },
  nikahSunnah: {
    hadith: `قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: "يَا مَعْشَرَ الشَّبَابِ مَنِ اسْتَطَاعَ مِنْكُمُ الْبَاءَةَ فَلْيَتَزَوَّجْ، فَإِنَّهُ أَغَضُّ لِلْبَصَرِ، وَأَحْصَنُ لِلْفَرْجِ"
[Sahih al-Bukhari 5066, Sahih Muslim 1400]`,
    quran: `وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
"And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy." (Surah Ar-Rum, 30:21)`,
    translation: `"O young people! Whoever among you can afford to marry, let him marry, for it helps him lower his gaze and guard his chastity."`
  },
  istikhara: {
    hadith: `عَنْ جَابِرِ بْنِ عَبْدِ اللَّهِ ـ رضى الله عنهما ـ قَالَ: كَانَ رَسُولُ اللَّهِ صلى الله عليه وسلم يُعَلِّمُنَا الاِسْتِخَارَةَ فِي الأُمُورِ كُلِّهَا كَمَا يُعَلِّمُنَا السُّورَةَ مِنَ الْقُرْآنِ
[Sahih al-Bukhari 1162]`,
    dua: `اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ، وَتَعْلَمُ وَلاَ أَعْلَمُ، وَأَنْتَ عَلاَّمُ الْغُيُوبِ...
(O Allah, I seek Your counsel through Your knowledge, and I seek ability through Your power, and I ask You from Your great favor...)`,
    method: `1. Perform 2 voluntary Rak'ahs of Salah with pure intention.
2. After Tasleem, praise Allah, send Salawat on the Prophet ﷺ, and recite the Masnoon Istikhara Dua.
3. Trust Allah's decree: If the marriage is good for your Deen, Dunya, and Akhirah, Allah will make it smooth. If not, Allah will avert it peacefully.`
  },
  mehr: {
    quran: `وَآتُوا النِّسَاءَ صَدُقَاتِهِنَّ نِحْلَةً
"And give the women (upon marriage) their bridal gifts (Mehr) graciously as a free gift." (Surah An-Nisa, 4:4)`,
    hadith: `عَنْ سَهْلِ بْنِ سَعْدٍ قَالَ: جَاءَتِ امْرَأَةٌ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم فَقَالَتْ: إِنِّي وَهَبْتُ مِنْ نَفْسِي... فَقَالَ لِلرَّجُلِ: "الْتَمِسْ وَلَوْ خَاتَمًا مِنْ حَدِيدٍ"
[Sahih al-Bukhari 5126, Sahih Muslim 1425]`,
    explanation: `Mehr is an obligatory financial gift from the groom to the bride given with complete respect. The Sunnah recommends that the best and most blessed marriage is the one with ease and simplicity in financial obligations without showing off.`
  },
  mutualRights: {
    quran: `وَلَهُنَّ مِثْلُ الَّذِي عَلَيْهِنَّ بِالْمَعْرُوفِ
"And women have rights similar to those over them according to what is equitable." (Surah Al-Baqarah, 2:228)`,
    hadith: `عَنْ أَبِي هُرَيْرَةَ قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا، وَخِيَارُكُمْ خِيَارُكُمْ لِنِسَائِهِمْ"
[Sunan at-Tirmidhi 1162 (Hasan Sahih), Musnad Ahmad]`
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

// Smart Intelligent Islamic Assistant Engine
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
      let responseText = `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**\n\nAlhamdulillah! Here are some verified profiles matching your criteria:\n\n`;

      profiles.forEach((p, idx) => {
        responseText += `👤 **${p.name}** (${p.gender === 'Female' ? '👰 Bride' : '🤵 Groom'})\n`;
        responseText += `• **Age:** ${p.age} Yrs | **City:** ${p.city}\n`;
        responseText += `• **Education:** ${p.education} | **Profession:** ${p.profession}\n`;
        if (p.maslak) responseText += `• **Maslak:** ${p.maslak}\n`;
        responseText += `\n`;
      });

      responseText += `\n🔒 **Note on Privacy & Contact:**\nDirect WhatsApp contact numbers and unblurred photos are protected for privacy. You can unlock direct contact access by upgrading to **Premium Membership (₹491 for 2 Months Unlimited Access)**.\n\nMay Allah bless your search with a righteous life partner!`;

      return {
        text: responseText,
        profileMatches: profiles,
        actionLinks: [
          { label: '🔍 Browse All Profiles', url: '/profiles', variant: 'outline' },
          { label: '⭐ Upgrade to Premium (₹491)', url: '/pricing', variant: 'default' },
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
      text: `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**\n\n### 🛡️ Photo & Contact Number Access Policy:\nIn accordance with Islamic modesty and privacy guidelines, candidate WhatsApp numbers and unblurred photos are kept secure to prevent misuse and spam.\n\n### ⭐ Premium Plan Benefits (₹491 / 2 Months):\n1. **Direct Verified WhatsApp Numbers:** Connect directly with candidates and their families.\n2. **Unblurred Photos Access:** View genuine verified candidate photos.\n3. **Priority Admin Assistance:** 1-on-1 matchmaking support via official WhatsApp.\n4. **Unlimited Profile Viewing:** 2 Months full access across India and abroad.\n\nWould you like to activate your Premium membership today?`,
      actionLinks: [
        { label: '💎 View Premium Plans (₹491)', url: '/pricing', variant: 'default' },
        { label: '💬 Upgrade via WhatsApp (+91 9128719875)', url: 'https://wa.me/919128719875?text=Assalamu%20Alaikum%20Team%20Rishta%20Matrimony%2C%20I%20would%20like%20to%20upgrade%20to%20the%20Premium%20Rishta%20Plan%20(Rs.%20491%20for%202%20Months).', isExternal: true, variant: 'whatsapp' }
      ]
    };
  }

  // 3. Questions about Istikhara
  if (q.includes('istikhara') || q.includes('istikhara dua') || q.includes('dua')) {
    const ref = authenticIslamicReferences.istikhara;
    return {
      text: `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**\n\n### 🤲 The Sunnah of Salatul Istikhara for Marriage:\n\n**Hadith Reference:**\n> Jabir ibn Abdullah (RA) reported that the Prophet ﷺ used to teach us Istikhara in all matters just as he taught us a Surah from the Quran.\n> **[Sahih al-Bukhari 1162]**\n\n**Masnoon Dua (عربي):**\n\`\`\`arabic\n${ref.dua}\n\`\`\`\n\n**How to Perform Istikhara:**\n${ref.method}\n\n*Tip:* Istikhara does not require seeing a dream. Rather, peace of mind and the ease or difficulty in matters are signs of Allah's decree.`,
      actionLinks: [
        { label: '📖 Read Marriage Guidance Blog', url: '/blog', variant: 'outline' },
        { label: '🔍 Find Compatible Profiles', url: '/profiles', variant: 'default' }
      ]
    };
  }

  // 4. Questions about Mehr (Dower)
  if (q.includes('mehr') || q.includes('mahr') || q.includes('dower') || q.includes('haq mehr')) {
    const ref = authenticIslamicReferences.mehr;
    return {
      text: `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**\n\n### 💍 Islamic Principles on Mehr (Dower):\n\n**Quranic Reference:**\n> *"And give the women (upon marriage) their bridal gifts (Mehr) graciously as a free gift."*\n> **[Surah An-Nisa, 4:4]**\n\n**Hadith Reference:**\n> Sahl bin Sa'd narrated: The Prophet ﷺ said to a man seeking marriage: *"Give her something, even if it is an iron ring."*\n> **[Sahih al-Bukhari 5126, Sahih Muslim 1425]**\n\n**Key Sunnah Guidelines:**\n1. **Obligatory Right:** Mehr is the exclusive right of the bride, not her parents or in-laws.\n2. **Sunnah of Simplicity:** The Prophet ﷺ encouraged moderation and avoiding burdening the groom with unaffordable Mehr.\n3. **Prompt Payment:** It is recommended to pay the Mehr upon contract (Mu'ajjal) unless agreed otherwise.`,
      actionLinks: [
        { label: '📖 Islamic Marriage Guide', url: '/blog', variant: 'outline' }
      ]
    };
  }

  // 5. Questions about Choosing a Righteous Spouse (Deendar Life Partner)
  if (q.includes('choose') || q.includes('selection') || q.includes('spouse') || q.includes('kufu') || q.includes('partner') || q.includes('humsafar')) {
    const ref = authenticIslamicReferences.spouseSelection;
    return {
      text: `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**\n\n### 👰 Selection of a Righteous Spouse in Islam:\n\n**Authentic Hadith:**\n\`\`\`arabic\n${ref.hadith}\n\`\`\`\n\n**Translation:**\n> ${ref.translation}\n> **[Sahih al-Bukhari 5090, Sahih Muslim 1466]**\n\n**Essential Islamic Criteria:**\n1. **Deen & Akhlaq (Character):** Character outlasts beauty and wealth.\n2. **Kufu (Compatibility):** Religious values, family compatibility, and life goals alignment.\n3. **Family Involvement (Wali):** Islam protects both men and women by involving parents and trustworthy guardians in the decision.\n\nWould you like to explore verified practicing candidates on Rishta Matrimony?`,
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
      text: `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**\n\n### 📝 Free Biodata Registration:\nYou can create and submit your matrimonial biodata on **Rishta Matrimony** 100% Free in 4 simple steps:\n\n1. **Personal Details** (Name, DOB, Height, Location)\n2. **Education & Profession** (Degree, Job, Income, Family Background)\n3. **Islamic Information** (Maslak, Deeni Education, Hijab/Beard, Namaz)\n4. **Partner Preferences & Photos** (Age range, City preference, Photo upload)\n\nOur admin team verifies every profile manually before making it live to ensure 100% genuine proposals.`,
      actionLinks: [
        { label: '✨ Register Biodata Free', url: '/register', variant: 'default' },
        { label: '🔑 Member Portal Login', url: '/member/login', variant: 'outline' }
      ]
    };
  }

  // 7. Try Gemini AI if configured in localStorage, else General Islamic Guidance
  const geminiKey = localStorage.getItem('gemini_api_key');
  if (geminiKey) {
    try {
      const prompt = `You are the Official Islamic Marriage & Matrimony AI Assistant for "Rishta Matrimony" (https://rishtamatrimony.vercel.app).
User question: "${userPrompt}"

RULES:
1. Begin with Bismillah (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ).
2. Quote authentic references from Quran (with Surah:Ayah) and Sahih Hadith (explicitly mentioning Sahih al-Bukhari or Sahih Muslim book/Hadith references).
3. If the user asks about finding profiles or marriage proposals, encourage them to browse verified profiles at /profiles or register free at /register.
4. If they ask about getting direct contact numbers, phone, WhatsApp or unblurred photos, explain that candidate contact numbers are exclusive to Premium members for safety, and pitch the ₹491 (2 Months Unlimited Access) plan with link to /pricing.
5. Tone: Respectful, deendar, polite, encouraging, Islamic. Format in clean markdown with bullet points.`;

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

  // General Authentic Fallback Response
  return {
    text: `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**\n\nAssalamu Alaikum wa Rahmatullahi wa Barakatuh!\n\nThank you for reaching out to **Rishta Matrimony Assistant**.\n\n### 📖 Core Islamic Matrimonial Guidance:\n- **Nikah as Sunnah:** *"Marriage is part of my Sunnah, and whoever does not follow my Sunnah has nothing to do with me."* [Sahih al-Bukhari & Sunan Ibn Majah]\n- **Righteous Foundation:** Prioritize character, religious practice (Deen), and mutual respect.\n- **Dignity & Privacy:** Connect with families in a halal, respectable manner.\n\nHow can I best assist you today? You can ask about:\n- 🤲 **Istikhara & Dua for Marriage**\n- 💍 **Mehr & Islamic Wedding Sunnah**\n- 👰 **Finding Brides or Grooms in your city**\n- 💎 **Unlocking Contact numbers via ₹491 Premium Plan**`,
    actionLinks: [
      { label: '🔍 Browse Verified Profiles', url: '/profiles', variant: 'default' },
      { label: '💎 Premium Membership (₹491)', url: '/pricing', variant: 'outline' },
      { label: '📝 Free Registration', url: '/register', variant: 'outline' },
      { label: '💬 Chat with Support on WhatsApp', url: 'https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20have%20an%20inquiry%20regarding%20Rishta%20Matrimony.', isExternal: true, variant: 'whatsapp' }
    ]
  };
}
