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
  },
  parentsRespect: {
    quranRef: `Surah Al-Isra, 17:23`,
    hadithRef: `Sahih al-Bukhari 5971`,
    quranAyah: `And your Lord has decreed that you not worship except Him, and to parents, good treatment.`
  },
  husbandWifeRights: {
    hadithRef: `Sunan at-Tirmidhi 1162 (Sahih)`,
    hadithText: `The best of you are those who are best to their wives, and I am the best among you to my wives.`
  },
  dowryProhibition: {
    hadithRef: `Sahih al-Bukhari 5149`,
    explanation: `Demanding dowry (Jahez) from the bride or her family has no place in Islam. The Sunnah teaches simplicity (Aisarun-Nikah Barkatan - the most blessed marriage is that with the least financial burden).`
  }
};

// Comprehensive verified dataset aligned with the platform profiles
export const verifiedMatrimonialProfiles = [
  {
    id: 1,
    name: "Mohammad Hasib",
    gender: "Male",
    age: "32",
    city: "Ranchi, Jharkhand",
    education: "Bachelor of Computer Application (BCA)",
    profession: "IT Support",
    maslak: "Salafi (Ahle Hadees)"
  },
  {
    id: 2,
    name: "Afshaa Bharde",
    gender: "Female",
    age: "24",
    city: "Navi Mumbai, Maharashtra",
    education: "BCA",
    profession: "HR in Qatar (Private Company)",
    maslak: "Sunni"
  },
  {
    id: 3,
    name: "Shamsuzzama Hashmi",
    gender: "Male",
    age: "32",
    city: "Saudi Arabia, Tabuk",
    education: "B.Tech Civil Engineer",
    profession: "Assistant Technical Manager at Red Sea Global",
    maslak: "Sunni"
  },
  {
    id: 4,
    name: "Shadma Khatoon",
    gender: "Female",
    age: "25",
    city: "Darbhanga, Bihar",
    education: "B.Sc Mathematics + D.El.Ed + NTT",
    profession: "Educator",
    maslak: "Sunni Deobandi"
  },
  {
    id: 5,
    name: "MD Sarwar Alam",
    gender: "Male",
    age: "31",
    city: "Ranchi, Jharkhand",
    education: "MBA",
    profession: "Sales & Marketing, Private Sector",
    maslak: "Sunni"
  },
  {
    id: 6,
    name: "Shaima Perween",
    gender: "Female",
    age: "25",
    city: "Bihar Sharif, Nalanda, Bihar",
    education: "M.Sc, D.El.Ed, CTET Qualified",
    profession: "Educator",
    maslak: "Sunni"
  },
  {
    id: 7,
    name: "Wasil Khan",
    gender: "Male",
    age: "29",
    city: "Doranda, Ranchi, Jharkhand",
    education: "MBA (Finance & Marketing)",
    profession: "Business Professional",
    maslak: "Sunni"
  },
  {
    id: 8,
    name: "Md Rahim Khan",
    gender: "Male",
    age: "26",
    city: "Dhanbad, Jharkhand",
    education: "M.Com",
    profession: "Private Job at SBI (Loan Department)",
    maslak: "Sunni"
  },
  {
    id: 9,
    name: "Taheera Ansari",
    gender: "Female",
    age: "31",
    city: "Deoria, Uttar Pradesh",
    education: "PhD in Zoology",
    profession: "Assistant Professor in Degree College",
    maslak: "Sunni Muslim"
  },
  {
    id: 10,
    name: "MD Shabbir Akhtar",
    gender: "Male",
    age: "33",
    city: "Patna City, Bihar",
    education: "B.Tech (ECE)",
    profession: "School Principal",
    maslak: "Sunni Islam"
  },
  {
    id: 11,
    name: "Samreen Fatima",
    gender: "Female",
    age: "26",
    city: "Patna City, Bihar",
    education: "Graduation (B.Com)",
    profession: "Homemaker",
    maslak: "Sunni Islam"
  },
  {
    id: 12,
    name: "Sania Akhtar",
    gender: "Female",
    age: "21",
    city: "Patna City, Bihar",
    education: "Graduation",
    profession: "Homemaker",
    maslak: "Sunni Islam"
  },
  {
    id: 13,
    name: "Kamran Ansari",
    gender: "Male",
    age: "27",
    city: "Ranchi, Jharkhand",
    education: "MBA (Marketing & HR)",
    profession: "Assistant Manager, Bhutani Infra",
    maslak: "Sunni"
  }
];

// Search database for live profiles when user asks for matchmaking
export async function searchProfilesForAssistant(queryText: string) {
  try {
    const q = queryText.toLowerCase();
    let genderFilter: string | null = null;
    if (
      q.includes('female') || q.includes('dulhan') || q.includes('bride') || 
      q.includes('ladki') || q.includes('sister') || q.includes('women') || 
      q.includes('aurat') || q.includes('ladkiya') || q.includes('brides')
    ) {
      genderFilter = 'Female';
    } else if (
      q.includes('male') || q.includes('dulha') || q.includes('groom') || 
      q.includes('ladka') || q.includes('brother') || q.includes('men') || 
      q.includes('mard') || q.includes('ladke') || q.includes('grooms')
    ) {
      genderFilter = 'Male';
    }

    const stopWords = new Set([
      'hai', 'kya', 'koi', 'dikhao', 'se', 'in', 'for', 'me', 'show', 'from', 
      'looking', 'want', 'de', 'dijiye', 'batao', 'mujhe', 'find', 'ka', 'ki', 
      'ke', 'female', 'male', 'bride', 'groom', 'dulhan', 'dulha', 'profile', 
      'profiles', 'rishta', 'rishte', 'ladki', 'ladka', 'match', 'matches', 
      'please', 'bhi', 'kuch', 'hoga', 'wali', 'wala', 'aur', 'the', 'a', 'an', 'is', 'are',
      'search', 'all', 'available', 'matrimony', 'shaadi', 'nikah', 'dhoondo', 'mil', 'sakta', 'bhejo'
    ]);

    const words = q
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w));

    let matches: {
      id: number;
      name: string;
      gender: string;
      age: string;
      city: string;
      education: string;
      profession: string;
      maslak: string | null;
    }[] = [];

    let searchedTerm = words.join(', ');

    // 1. Try querying Supabase
    try {
      let supabaseQuery = supabase
        .from('profiles_data')
        .select('id, name, gender, age, location, education, profession, maslak')
        .eq('is_live', true)
        .eq('verification_status', 'verified');

      if (genderFilter) {
        supabaseQuery = supabaseQuery.eq('gender', genderFilter);
      }

      if (words.length > 0) {
        const orConditions = words.map(w => `location.ilike.%${w}%,profession.ilike.%${w}%,name.ilike.%${w}%,maslak.ilike.%${w}%,education.ilike.%${w}%`).join(',');
        supabaseQuery = supabaseQuery.or(orConditions);
      }

      supabaseQuery = supabaseQuery.limit(4);
      const { data } = await supabaseQuery;
      if (data && data.length > 0) {
        matches = data.map((p) => ({
          id: p.id,
          name: p.name,
          gender: p.gender,
          age: p.age,
          city: p.location,
          education: p.education,
          profession: p.profession,
          maslak: p.maslak,
        }));
      }
    } catch (e) {
      console.warn('Supabase search exception, falling back to static verified list:', e);
    }

    // 2. If Supabase returned 0 rows, search verifiedMatrimonialProfiles
    if (matches.length === 0) {
      matches = verifiedMatrimonialProfiles.filter(p => {
        if (genderFilter && p.gender !== genderFilter) return false;
        if (words.length === 0) return true;
        
        const profileSearchText = `${p.city} ${p.name} ${p.education} ${p.profession} ${p.maslak || ''}`.toLowerCase();
        return words.some(w => profileSearchText.includes(w));
      }).slice(0, 4);
    }

    return {
      matches,
      searchedTerm,
      hasKeyword: words.length > 0,
      genderFilter
    };
  } catch (err) {
    console.warn('Profile search error in assistant:', err);
    return { matches: [], searchedTerm: '', hasKeyword: false, genderFilter: null };
  }
}

// Smart Intelligent Multi-topic Islamic Matrimonial AI Brain
export async function generateIslamicAssistantResponse(userPrompt: string): Promise<{
  text: string;
  actionLinks?: { label: string; url: string; isExternal?: boolean; variant?: 'default' | 'outline' | 'whatsapp' }[];
  profileMatches?: any[];
}> {
  const rawQ = userPrompt.trim();
  const q = rawQ.toLowerCase();

  // ==========================================
  // 1. CASUAL CHAT & HUMAN-LIKE INTERACTIONS
  // ==========================================

  // Greetings & Salam
  if (
    q.startsWith('salam') || 
    q.startsWith('slm') || 
    q.includes('assalamu alaikum') || 
    q.includes('assalam alaikum') || 
    q.includes('asalam') ||
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey'
  ) {
    return {
      text: `Wa Alaikum Assalam wa Rahmatullahi wa Barakatuh! 🌸✨\n\nMarhaban! Main Rishta Matrimony ka AI Matchmaking & Islamic Assistant hoon 🤵👰\n\nAap se baat karke bahut khushi hui! Aap kaise hain? Aaj main aapki matrimonial search ya deeni sawaalat me kya madad kar sakta hoon? 😊`,
      actionLinks: [
        { label: '🔍 Search Verified Profiles', url: '/profiles', variant: 'default' },
        { label: '⭐ View Premium Plan (₹491)', url: '/pricing', variant: 'outline' },
        { label: '📝 Free Biodata Registration', url: '/register', variant: 'outline' }
      ]
    };
  }

  // How are you / Hal chal
  if (
    q.includes('kaise ho') || 
    q.includes('kaisi ho') || 
    q.includes('kya hal') || 
    q.includes('how are you') || 
    q.includes('kya chal raha') ||
    q.includes('sab theek')
  ) {
    return {
      text: `Alhamdulillah, main bilkul theek hoon! Allah ka lakh lakh shukr hai 🤲🌸\n\nAap sunayein, aapki sehat aur deen ka kya haal hai? Umeed hai aap khairiyat se honge 😊\n\nAgar aap kisi specific city ke rishte dhoondh rahe hain, biodata banana chahte hain, ya shadi ke talluq se koi Islamic masla poochna chahte hain, to bejhijhak poochein! Main aapki poori madad karunga ✨`,
      actionLinks: [
        { label: '🔍 Brides (Dulhan) Dekhein', url: '/profiles?gender=Female', variant: 'default' },
        { label: '🤵 Grooms (Dulha) Dekhein', url: '/profiles?gender=Male', variant: 'outline' }
      ]
    };
  }

  // Who are you / Identity / Introduction
  if (
    q.includes('aap kaun ho') || 
    q.includes('who are you') || 
    q.includes('tum kaun ho') || 
    q.includes('tell me about yourself') ||
    q.includes('kya kar sakte ho') ||
    q.includes('what can you do')
  ) {
    return {
      text: `Assalamu Alaikum! Main **Rishta Matrimony Matchmaker AI** hoon 🤖💍\n\nMera maqsad Musalman bhai-behno ko Quran aur Sahih Sunnah ke mutabiq ek nek aur deendaar humsafar talash karne me madad karna hai.\n\n### Main aapke liye kya kar sakta hoon:\n• 🔍 **Verified Rishte Dhoondhna:** Aapke city, age aur maslak ke mutabiq profile match karna.\n• 📖 **Islamic Guidance:** Istikhara ka tareeqa, Mehr ke ahkaam, aur walidain ki raza-mandi par Sahih Hadith se rehnumai.\n• 🛡️ **Privacy & Support:** Contact details unlock karne ke liye ₹491 Premium membership me guide karna.\n• 💬 **General Chat:** Shadi aur deeni masail par dostana aur mohtaram guftagu karna.\n\nAap mujhse kuch bhi pooch sakte hain! 😊`,
      actionLinks: [
        { label: '✨ Explore Profiles', url: '/profiles', variant: 'default' },
        { label: '📖 Marriage Advice Blog', url: '/blog', variant: 'outline' }
      ]
    };
  }

  // Gratitude / Thank you / JazakAllah
  if (
    q.includes('shukriya') || 
    q.includes('thank') || 
    q.includes('jazakallah') || 
    q.includes('jazak allah') || 
    q.includes('dhanyawad')
  ) {
    return {
      text: `Wa Antum fa Jazakumullahu Khairan! 🤲🌸\n\nAapka shukriya ada karne ka bahut ehsaas hua. Allah Ta'ala aapki zindagi me barkat ata farmaye aur aapko ek nek, wafadaar aur deendaar jeevansathi naseeb kare 💖\n\nAgar koi aur sawaal ya madad chahiye ho, to main hamesha yahan hazir hoon! 😊`,
      actionLinks: [
        { label: '🔍 Browse Profiles', url: '/profiles', variant: 'default' },
        { label: '💬 WhatsApp Support', url: 'https://wa.me/919128719875', isExternal: true, variant: 'whatsapp' }
      ]
    };
  }

  // Compliments / Positive vibes
  if (
    q.includes('good') || 
    q.includes('nice') || 
    q.includes('bohot acha') || 
    q.includes('great') || 
    q.includes('bahut badhiya') ||
    q.includes('shandar') ||
    q.includes('love you') ||
    q.includes('mashallah')
  ) {
    return {
      text: `Masha'Allah! TabarakAllah! 💖✨\n\nAapki hausla-afzai ke liye dil se shukriya. Rishta Matrimony par hamari koshish hai ki har family ko ek safe, transparent aur halal platform mile jahan bina kisi fraud ke deeni rishte mil sakein 🕊️\n\nAapko website me kya cheez sabse achi lagi?`,
      actionLinks: [
        { label: '🔍 View Verified Proposals', url: '/profiles', variant: 'default' },
        { label: '⭐ ₹491 Premium Plan', url: '/pricing', variant: 'outline' }
      ]
    };
  }

  // Casual mood / Boredom / Chit-chat
  if (
    q.includes('bore') || 
    q.includes('kuch batao') || 
    q.includes('baat karo') || 
    q.includes('tell me something') ||
    q.includes('kuch sunao')
  ) {
    return {
      text: `Zaroor! Ek khoobsurat deeni baat aur naseehat share karta hoon 😊🌸\n\n> **Rasoolullah ﷺ ne farmaya:**\n> *"Duniya saari ki saari mataa (fayde ki cheez) hai, aur is duniya ki sabse behtareen mataa ek 'Nek Aurat' (Nek Jeevansathi) hai."*\n> **[Sahih Muslim: 1467]** 📖\n\nEk nek shareek-e-hayat na sirf duniya me sukoon banta hai balke aakhirat ki kamyabi me bhi madadgaar hota hai ✨\n\nAap kis tarah ke partner ki talash me hain? Mujhe batayein, main aapke liye matching profiles shortlist karne me madad karunga! 👰🤵`,
      actionLinks: [
        { label: '🔍 Brides Dhoondhein', url: '/profiles?gender=Female', variant: 'default' },
        { label: '🤵 Grooms Dhoondhein', url: '/profiles?gender=Male', variant: 'outline' }
      ]
    };
  }

  // Lighthearted joke / Smile
  if (
    q.includes('joke') || 
    q.includes('chutkula') || 
    q.includes('hasi') || 
    q.includes('hasao') ||
    q.includes('funny')
  ) {
    return {
      text: `Ek pyara aur muskurahat bhara rishta moment suniye 😄🌸:\n\nLadke wale ladki dekhne aaye aur bole:\n*"Humein aisi bahu chahiye jo ghar ko jannat bana de!"*\n\nLadki ke walid ne muskura kar jawab diya:\n*"Zaroor Janab! Lekin yaad rakhein, Jannat me jaane ke liye pehle khud nek banna padta hai!"* 😜✨\n\nNabi Kareem ﷺ ne farmaya ki muskurana bhi ek Sadqah hai 😊 [Tirmidhi].\n\nAb batayein, aapke liye koi accha sa rishta search karein? 💍`,
      actionLinks: [
        { label: '🔍 Find Match Proposals', url: '/profiles', variant: 'default' }
      ]
    };
  }

  // Emotional support / Stress / Sadness
  if (
    q.includes('sad') || 
    q.includes('tension') || 
    q.includes('pareshan') || 
    q.includes('depression') || 
    q.includes('stress') || 
    q.includes('dukhi') ||
    q.includes('mushkil')
  ) {
    return {
      text: `Dil chota mat kijiye, Allah Ta'ala har cheez par qaadir hai 🤲💖\n\n> **Quran Pak me Allah farmata hai:**\n> *"Beshak mushkil ke sath aasaani hai."*\n> **[Surah Ash-Sharh, 94:6]** 📖\n\n**Aapke sukoon ke liye ek Masnoon Dua:**\n> *اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ*\n> *"Allahumma inni a'oodhu bika minal-hammi wal-hazan"*\n> (Aye Allah! Main teri panah chahta hoon fikar aur gham se - **Sahih al-Bukhari 2893**).\n\nSabr aur Namaz se madad lijiye, Allah Ta'ala aapke har band darwaze ko behtareen tareeqe se khol dega. Sab theek ho jayega Insha'Allah! 🌸`,
      actionLinks: [
        { label: '🤲 Marriage Dua & Istikhara', url: '/blog', variant: 'outline' },
        { label: '💬 Talk to Our Support Team', url: 'https://wa.me/919128719875', isExternal: true, variant: 'whatsapp' }
      ]
    };
  }

  // ==========================================
  // 2. MATRIMONIAL & RELATIONSHIP QUESTIONS
  // ==========================================

  // Convincing parents for marriage (Walidain ko manana)
  if (
    q.includes('parents') || 
    q.includes('walidain') || 
    q.includes('abba') || 
    q.includes('ammi') || 
    q.includes('manaye') || 
    q.includes('convince') ||
    q.includes('ghar wale nahi man rahe')
  ) {
    return {
      text: `### 🌸 Walidain ko Shadi ke liye Manane ka Islami Tareeqa:\n\nIslam me walidain ka martaba bahut uncha hai. Agar aap kisi nek shakhs se shadi karna chahte hain aur ghar wale razi nahi hain, to in baaton par amal karein:\n\n1. **Adab aur Izzat se Baat Karein:** Gusse ya zid se bachein. Unko pyaar se samjhayein ki aap us shakhs me deen aur akhlaq dekhte hain.\n2. **Khandan ke kisi Samjhdar Buzurg ki Madad:** Agar direct baat nahi ban rahi, to kisi aise rishtedaar ya aalim ko shamil karein jinki baat walidain maante hon.\n3. **Salatul Istikhara & Dua:** Tahajjud me Allah se dua karein ki agar yeh rishta deen aur duniya ke liye behtar hai to walidain ke dil me narmi paida farmaye.\n4. **Sabr & Duas:** Walidain hamesha aulaad ki bhalai chahte hain, thoda waqt aur dua se raste aasaan hote hain Insha'Allah 🤲`,
      actionLinks: [
        { label: '📖 Read Marriage Guidance Blog', url: '/blog', variant: 'outline' },
        { label: '🔍 Browse Verified Profiles', url: '/profiles', variant: 'default' }
      ]
    };
  }

  // Rights of Wife / Husband (Biwi aur Shohar ke Huqooq)
  if (
    q.includes('huqooq') || 
    q.includes('rights') || 
    q.includes('biwi ke haq') || 
    q.includes('shohar ke haq') ||
    q.includes('wife rights') ||
    q.includes('husband rights')
  ) {
    return {
      text: `### 💍 Islam me Biwi aur Shohar ke Huqooq:\n\n**Biwi ke Shohar par Huqooq:**\n• **Naan-o-Nafqa:** Halal rizq se rehna, khana aur pehenne ka intezam (Surah An-Nisa 4:34).\n• **Husn-e-Sulook & Izzat:** Nabi ﷺ ne farmaya: *"Tum me se sabse behtareen shakhs wo hai jo apni biwi ke sath sabse accha ho."* (Tirmidhi 1162 - Sahih).\n• **Mehr ki Adaigi:** Mehr biwi ka haq hai aur use khushi se ada karna farz hai.\n\n**Shohar ke Biwi par Huqooq:**\n• **Izzat aur Farmanbardari:** Jaiz aur deeni umoor me shohar ki baat maanna aur ghar me sukoon ka mahaul banana.\n• **Maal aur Izzat ki Hifazat:** Shohar ki ghair-maujoodgi me ghar aur izzat ki hifazat karna.\n\nEk doosre ke sath mohabbat, sabr aur rahem (Mawaddah wa Rahmah) hi kamyab nikah ka raaz hai 🌸`,
      actionLinks: [
        { label: '📖 Marriage Ethics Blog', url: '/blog', variant: 'outline' },
        { label: '🔍 Browse Profiles', url: '/profiles', variant: 'default' }
      ]
    };
  }

  // Dowry / Jahez strictly prohibited
  if (
    q.includes('jahez') || 
    q.includes('dowry') || 
    q.includes('dahej') || 
    q.includes('demand')
  ) {
    return {
      text: `### 🚫 Islam me Jahez (Dowry) ki Mumaniat:\n\nIslam me ladki walon se **jahez (dowry) mangna ya demand karna sakht mana aur ghair-Islami rasm hai** ⚠️\n\n• **Sunnah Tareeqa:** Sunnah yeh hai ki shohar biwi ko **Mehr** ada kare aur kharche ki zimmedari le.\n• **Sahih Hadith:** Rasoolullah ﷺ ne farmaya: *"Sabse zyada barkat wala nikah wo hai jisme kam se kam kharch aur bojh ho."* (Musnad Ahmad).\n• Rishta Matrimony par hum kisi bhi tarah ke jahez demand ki sakht mukhalifat karte hain aur simple, Sunnah nikah ko promote karte hain 🛡️`,
      actionLinks: [
        { label: '🔍 Find Simple & Sunnah Proposals', url: '/profiles', variant: 'default' },
        { label: '📖 Read Sunnah Nikah Guide', url: '/blog', variant: 'outline' }
      ]
    };
  }

  // Nikah conditions / Khutbah / Sharait
  if (
    q.includes('sharat') || 
    q.includes('conditions') || 
    q.includes('ijab') || 
    q.includes('qubool') || 
    q.includes('nikah kaise hota') ||
    q.includes('nikah valid')
  ) {
    return {
      text: `### 📜 Sahi Nikah ke Zaroori Sharaet (Conditions):\n\nIslam me ek valid aur shar'ee Nikah ke liye 4 zaroori baatein hoti hain:\n\n1. **Ijab-o-Qubool:** Dono (Dulha aur Dulhan) ki aapas me wazeh aur azaad raza-mandi.\n2. **Wali (Guardian) ki Raza-mandi:** Ladki ke shar'ee sarparast (Walid ya Guardian) ki maujoodgi.\n3. **Do (2) Deendaar Aadil Gawah:** Kam az kam 2 musalman mard gawah maujood hon (Bukhari & Muslim).\n4. **Mehr (Dower):** Shohar ki taraf se biwi ko tay shuda shar'ee Mehr ada kiya jaye.\n\nIn sharaet ke sath kiya gaya nikah mukammal halal aur ba-barkat hota hai 💍🌸`,
      actionLinks: [
        { label: '📖 Complete Nikah Step-by-Step Guide', url: '/blog', variant: 'outline' }
      ]
    };
  }

  // Walima Sunnah
  if (
    q.includes('walima') || 
    q.includes('valima') || 
    q.includes('dawat')
  ) {
    return {
      text: `### 🍽️ Walima ki Sunnah aur Ahkaam:\n\n• **Sunnah-e-Muakkadah:** Walima shohar ki taraf se shadi ki khushi me dawat-e-ta'am hai jo rukhsati ke baad ki jaati hai.\n• **Sahih Hadith:** Nabi Kareem ﷺ ne Hazrat Abdur Rahman bin Awf (RA) se farmaya: *"Walima karo khwah ek bakri hi kyu na ho."* (**Sahih al-Bukhari 5155**).\n• **Ghareebon ko Shamil Karna:** Walima me sirf ameer logon ko nahi balke ghareebon aur rishtedaaron ko bhi dawat deni chahiye taaki barkat ho ✨`,
      actionLinks: [
        { label: '📖 Explore Marriage Guidance', url: '/blog', variant: 'outline' }
      ]
    };
  }

  // Delay in Marriage / Dua for Good Spouse
  if (
    q.includes('deri') || 
    q.includes('delay') || 
    q.includes('rishta nahi aa raha') || 
    q.includes('dua for marriage') || 
    q.includes('dua for spouse') ||
    q.includes('shadi ki dua') ||
    q.includes('wazifa')
  ) {
    return {
      text: `### 🤲 Nek Rishta Pane aur Deri Khatam Karne ki Masnoon Duayein:\n\n1. **Hazrat Musa (AS) ki Dua (Surah Al-Qasas: 24):**\n> *رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ*\n> *"Rabbi innee limaaa anzalta ilayya min khayrin faqeer"*\n> (Aye mere Rabb! Tu jo bhi bhalai meri taraf utare, main uska mohtaj hoon).\n\n2. **Nek Jeevansathi aur Aulaad ki Dua (Surah Al-Furqan: 74):**\n> *رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا*\n> *"Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama"*\n\n**Amal:** Har namaz ke baad aur Tahajjud me kasrat se **Astaghfar** aur yeh duayein padhein. Allah behtareen faisla farmayega Insha'Allah 🌸`,
      actionLinks: [
        { label: '📝 Register Free Biodata', url: '/register', variant: 'default' },
        { label: '🔍 Browse Profiles', url: '/profiles', variant: 'outline' }
      ]
    };
  }

  // Talking before marriage (Halal boundaries)
  if (
    q.includes('baat kar sakte') || 
    q.includes('chat') || 
    q.includes('meeting') || 
    q.includes('mil sakte') || 
    q.includes('dekh sakte') ||
    q.includes('video call')
  ) {
    return {
      text: `### 🛡️ Shadi se pehle Baat karne aur Dekhne ke Islami Qawaneen:\n\n1. **Chehra aur Haliyah Dekhna:** Shadi ke maqsad se ek doosre ko dekhna Sunnah se sabit hai taaki dil me itminan paida ho (Sahih Muslim 1424).\n2. **Khalwat (Akelepan) se Bachna:** Tanhaai ya akele me milna jaiz nahi hai. Jab bhi baat ho ya mulaqat ho, wali ya family member ki maujoodgi/ilm me honi chahiye.\n3. **Sanjeeda Guftagu:** Guftagu sirf shadi ki zaroori baaton (deen, lifestyle, expectation, career) tak mehdood honi chahiye.\n\nRishta Matrimony is baat ko ensure karta hai ki direct communication family aur wali ke through ho 🌸`,
      actionLinks: [
        { label: '🔍 Explore Verified Profiles', url: '/profiles', variant: 'default' }
      ]
    };
  }

  // Inter-caste / Regional differences in Islam
  if (
    q.includes('caste') || 
    q.includes('zaat') || 
    q.includes('khandan') || 
    q.includes('biradari') || 
    q.includes('intercaste')
  ) {
    return {
      text: `### 🕌 Islam me Zaat-Paat (Caste) ka Tasawwur:\n\nIslam me kisi zaat, biradari ya zubaan ki wajah se kisi ko doosre par koi bartari nahi hai 🤍\n\n> **Hujjat-ul-Wida me Nabi Kareem ﷺ ne farmaya:**\n> *"Kisi Arabi ko Ajami par aur kisi Ajami ko Arabi par, na kisi gore ko kaale par aur na kisi kaale ko gore par koi fazilat hai, siwaye Taqwa (Parhezgari) ke."*\n> **[Musnad Ahmad: 23489]** 📖\n\nShadi me asil cheez **Deen, Akhlaq aur Aapas ki Compatibility (Kufu)** hai. Rishta Matrimony par sabhi maslak aur background ke shareef khandan ke rishte maujood hain ✨`,
      actionLinks: [
        { label: '🔍 View All Verified Profiles', url: '/profiles', variant: 'default' }
      ]
    };
  }

  // ==========================================
  // 3. SEARCHING PROFILES & MATCHMAKING
  // ==========================================
  if (
    q.includes('profile') || 
    q.includes('rishta') || 
    q.includes('dulhan') || 
    q.includes('dulha') || 
    q.includes('bride') || 
    q.includes('groom') || 
    q.includes('match') || 
    q.includes('ladki') || 
    q.includes('ladka') ||
    q.includes('ranchi') ||
    q.includes('patna') ||
    q.includes('bihar') ||
    q.includes('delhi') ||
    q.includes('mumbai') ||
    q.includes('lucknow') ||
    q.includes('dhanbad') ||
    q.includes('jharkhand') ||
    q.includes('up')
  ) {
    const searchRes = await searchProfilesForAssistant(userPrompt);
    const { matches, searchedTerm, hasKeyword, genderFilter } = searchRes;

    if (matches && matches.length > 0) {
      const targetLabel = genderFilter === 'Female' ? 'Brides (Dulhan)' : genderFilter === 'Male' ? 'Grooms (Dulha)' : 'Proposals';
      return {
        text: `Alhamdulillah! Hamare database me aapke liye matching verified **${targetLabel}** daryaft hue hain${searchedTerm ? ` ("${searchedTerm}")` : ''} 👰🤵\n\nNeeche diye gaye profile card par click karke aap full bio-data dekh sakte hain:`,
        profileMatches: matches,
        actionLinks: [
          { label: '🔍 Browse All Verified Profiles', url: '/profiles', variant: 'outline' },
          { label: '⭐ Unlock Contacts with Premium (₹491)', url: '/pricing', variant: 'default' },
          { label: '💬 Inquire on WhatsApp', url: 'https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20inquire%20about%20verified%20profiles%20on%20Rishta%20Matrimony.', isExternal: true, variant: 'whatsapp' },
        ]
      };
    } else if (hasKeyword) {
      return {
        text: `Filhal hamare platform par **"${searchedTerm}"** se koi naya verified profile live nahi hai 🌸\n\n• Aap **Free Biodata Register** kar sakte hain taaki ${searchedTerm} aur aas-paas ke naye rishte aane par aapko direct notify kiya jaye.\n• Ya aap baaki shehron ke verified rishte explore kar sakte hain:`,
        profileMatches: [],
        actionLinks: [
          { label: '📝 Register Free Biodata for ' + searchedTerm, url: '/register', variant: 'default' },
          { label: '🔍 View All Verified Profiles', url: '/profiles', variant: 'outline' },
          { label: '💬 Ask Support on WhatsApp', url: `https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20am%20looking%20for%20profiles%20from%20${encodeURIComponent(searchedTerm)}%20on%20Rishta%20Matrimony.`, isExternal: true, variant: 'whatsapp' }
        ]
      };
    }
  }

  // ==========================================
  // 4. CONTACTS, PRICING, & ₹491 PREMIUM PLAN
  // ==========================================
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
    q.includes('plan') ||
    q.includes('charges') ||
    q.includes('fees') ||
    q.includes('paise')
  ) {
    return {
      text: `### 🛡️ Privacy & Contact Number Protection:\nIslam me parda aur behno ki hifazat ke madd-e-nazar, candidate ke verified phone numbers aur unblurred photos sirf verified Premium members ke liye unlock hote hain ✨\n\n### ⭐ Premium Membership Plan (Sirf ₹491 - 2 Months Access):\n• 📞 **Direct WhatsApp Numbers:** Sabhi verified candidates aur unke walidain ke contact numbers.\n• 🖼️ **Unblurred Full Photos:** Sabhi profiles ki HD photos dekhne ki access.\n• 🤝 **1-on-1 Matchmaking Assistance:** Hamari support team se WhatsApp par personal help.\n• ♾️ **Unlimited Profile Views:** Poore India aur Abroad ke proposals bina kisi rok-tok ke dekhein.\n\nAap abhi apna plan activate kar sakte hain:`,
      actionLinks: [
        { label: '💎 Upgrade to Premium Plan (₹491)', url: '/pricing', variant: 'default' },
        { label: '💬 Instant WhatsApp Activation (+91 9128719875)', url: 'https://wa.me/919128719875?text=Assalamu%20Alaikum%20Team%20Rishta%20Matrimony%2C%20I%20would%20like%20to%20upgrade%20to%20the%20Premium%20Rishta%20Plan%20(Rs.%20491%20for%202%20Months).', isExternal: true, variant: 'whatsapp' }
      ]
    };
  }

  // ==========================================
  // 5. ISTIKHARA QUESTIONS
  // ==========================================
  if (q.includes('istikhara') || q.includes('dua')) {
    const ref = authenticIslamicReferences.istikhara;
    return {
      text: `### 🤲 Shadi ke liye Salatul Istikhara ka Sunnah Tareeqa:\n\n**Authentic Reference:**\n> Jabir ibn Abdullah (RA) se riwayat hai: Rasoolullah ﷺ humein tamaam maamlaat me Istikhara karna sikhate the jaise Quran ki Surah sikhate hain.\n> **[${ref.hadithRef}]**\n\n**Istikhara ka Tareeqa:**\n${ref.method}\n\n*Wazahat:* Istikhara me khwab aana zaroori nahi hota. Kaam me aasaani paida hona ya dil me itminan hona hi khair ki alamat hai 🌸`,
      actionLinks: [
        { label: '🔍 Browse Compatible Profiles', url: '/profiles', variant: 'default' },
        { label: '📖 Read Marriage Guidance Blog', url: '/blog', variant: 'outline' }
      ]
    };
  }

  // ==========================================
  // 6. MEHR (DOWER) QUESTIONS
  // ==========================================
  if (q.includes('mehr') || q.includes('mahr') || q.includes('dower') || q.includes('haq mehr')) {
    const ref = authenticIslamicReferences.mehr;
    return {
      text: `### 💍 Mehr (Dower) ke Shar'ee Ahkaam:\n\n**Quranic Hukum:**\n> *"Aur auraton ko unke Mehr khushi se ada karo."*\n> **[${ref.quranRef}]**\n\n**Hadith Sharif:**\n> Nabi Kareem ﷺ ne ek sahabi se farmaya: *"${ref.hadithText}"*\n> **[${ref.hadithRef}]**\n\n**Zaroori Baatein:**\n• Mehr biwi ka zaati haq hai, koi doosra isme hissa nahi le sakta.\n• Sunnah ye hai ki Mehr me aitedal (moderation) rakha jaye taaki shadi aasan ho.\n• Dono khandano ko aapas ki razamandi se izzat ke sath Mehr tay karna chahiye 🌸`,
      actionLinks: [
        { label: '📖 Explore Marriage Guidance', url: '/blog', variant: 'outline' },
        { label: '🔍 Search Profiles', url: '/profiles', variant: 'default' }
      ]
    };
  }

  // ==========================================
  // 7. CHOOSING A RIGHTEOUS SPOUSE (DEENDAR)
  // ==========================================
  if (
    q.includes('choose') || 
    q.includes('selection') || 
    q.includes('spouse') || 
    q.includes('kufu') || 
    q.includes('partner') || 
    q.includes('humsafar') ||
    q.includes('kaisa jeevansathi')
  ) {
    const ref = authenticIslamicReferences.spouseSelection;
    return {
      text: `### 👰 Islam me Humsafar Chunne ke 4 Usool:\n\n**Sahih Hadith Sharif:**\n> *"${ref.translation}"*\n> **[${ref.hadithRef}]**\n\n**Islami Mayaar:**\n• **Deen & Akhlaq (Taqwa):** Sabse ahem deen aur nek aadat hai jo zindagi bhar khushiyon ka zariya banti hai.\n• **Sharafat & Character:** Imandar aur halal kamai par yakeen rakhne wala shakhs.\n• **Compatibility (Kufu):** Soch, taleem aur deeni mayaar me aapas ki munasibat.\n\nRishta Matrimony par verified deendaar rishte dekhein:`,
      actionLinks: [
        { label: '👰 View Verified Brides', url: '/profiles?gender=Female', variant: 'default' },
        { label: '🤵 View Verified Grooms', url: '/profiles?gender=Male', variant: 'outline' },
        { label: '📝 Free Biodata Registration', url: '/register', variant: 'outline' }
      ]
    };
  }

  // ==========================================
  // 8. FREE REGISTRATION QUESTIONS
  // ==========================================
  if (
    q.includes('register') || 
    q.includes('create profile') || 
    q.includes('biodata') || 
    q.includes('join') || 
    q.includes('account') ||
    q.includes('kaise banaye')
  ) {
    return {
      text: `### 📝 Rishta Matrimony par Free Biodata Registration:\nAap apna ya apne bache/bhai/behan ka matrimonial biodata **100% Free** create kar sakte hain ✨:\n\n1. **Zati Maloomat:** Naam, Umar, Shahr (Location), Qad (Height)\n2. **Taleem aur Rozgar:** Degree, Profession, Family background\n3. **Deeni Tafseelat:** Maslak, Namaz, Deeni Taleem\n4. **Partner Ki Ummedein:** Age preference, City preference, Photo upload\n\nHar profile verification ke baad hi live ki jaati hai taaki sabhi rishte 100% genuine hon 🛡️`,
      actionLinks: [
        { label: '✨ Register Free Biodata Now', url: '/register', variant: 'default' },
        { label: '🔑 Member Portal Login', url: '/member/login', variant: 'outline' }
      ]
    };
  }

  // ==========================================
  // 9. DYNAMIC EXTERNAL AI (IF KEY IS SET)
  // ==========================================
  const geminiKey = localStorage.getItem('gemini_api_key');
  if (geminiKey) {
    try {
      const systemPrompt = `You are the friendly, empathetic, highly intelligent AI Assistant for "Rishta Matrimony" (https://rishtamatrimony.vercel.app).
User question: "${rawQ}"

GUIDELINES:
1. Answer ANY user question with warmth, intelligence, and natural conversational flow in the user's language (Hindi, Hinglish, Urdu, English).
2. For Islamic questions, cite authentic Quran (Surah:Ayah) and Sahih Hadith (Sahih al-Bukhari / Sahih Muslim).
3. Use expressive, tasteful emojis (🌸, 🤲, 💍, 👰, 🤵, ✨, 😊, 📖).
4. If they search for brides/grooms, direct them to /profiles.
5. If they ask about unlocking candidate phone numbers or photos, explain the ₹491 (2 Months) Premium plan with /pricing link.
6. Keep paragraphs readable with neat bullet points.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { temperature: 0.7 }
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

  // ==========================================
  // 10. CONTEXTUAL INTELLIGENT AI CATCH-ALL
  // ==========================================
  return {
    text: `Assalamu Alaikum! 🌸✨\n\nAapne poocha: **"${rawQ}"**\n\nMain aapki is maamle me poori tarah madad karne ke liye tayyar hoon! Chahe aapko:\n• 👰🤵 Kisi specific shahr ya maslak ke **verified rishte** talash karne hon\n• 📖 Shadi, nikah, ya deen ke talluq se **Quran aur Sahih Hadith** ki roshni me rehnumai chahiye ho\n• 📞 Contact number aur unblurred photos ke liye **₹491 Premium Plan** ki jaankari leni ho\n• 📝 Apna **Free Matrimonial Biodata** register karna ho\n\nAap mujhse thoda aur tafseel se poochein, ya neeche diye gaye options me se select karein 😊🤲`,
    actionLinks: [
      { label: '🔍 Browse Verified Profiles', url: '/profiles', variant: 'default' },
      { label: '💎 Premium Membership (₹491)', url: '/pricing', variant: 'outline' },
      { label: '📝 Free Registration', url: '/register', variant: 'outline' },
      { label: '💬 WhatsApp Support (+91 9128719875)', url: 'https://wa.me/919128719875?text=' + encodeURIComponent('Assalamu Alaikum, I need assistance regarding: ' + rawQ), isExternal: true, variant: 'whatsapp' }
    ]
  };
}
