const SUPABASE_URL = "https://rxlzlkcdszulyetcxxih.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bHpsa2Nkc3p1bHlldGN4eGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTAzODIsImV4cCI6MjA3NTI2NjM4Mn0.PXcKNOiJlQr_BSqPZKIGTQYKK-e6Y5obVg7WPJm17hM";

export default async function handler(req: any, res: any) {
  const profileId = req.query?.id;
  const siteUrl = "https://rishtamatrimony.vercel.app";

  let title = "Rishta Matrimony - 100% Halal Islamic Matchmaking Community";
  let description = "Connect with verified Muslim brides and grooms across India. 100% Halal, modest, and family-first with complete privacy.";
  let ogImage = `${siteUrl}/og-image.jpg`;
  let targetUrl = `${siteUrl}/profiles`;

  if (profileId) {
    targetUrl = `${siteUrl}/profiles?id=${profileId}`;
    try {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/profiles_data?id=eq.${profileId}&select=id,name,gender,age,location,profession,education,caste,maslak,marital_status`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

      if (resp.ok) {
        const rows = await resp.json();
        if (rows && rows.length > 0) {
          const p = rows[0];
          const genderLabel = (p.gender || "").toLowerCase() === "male" ? "Groom" : "Bride";
          title = `Verified ${genderLabel} Profile #${p.id} (${p.name || 'Candidate'}) | Rishta Matrimony`;
          
          const details: string[] = [];
          if (p.age) details.push(`Age: ${p.age} Yrs`);
          if (p.education) details.push(p.education);
          if (p.profession && p.profession.toLowerCase() !== "no") details.push(p.profession);
          if (p.location) details.push(p.location);
          if (p.maslak) details.push(p.maslak);

          description = `${details.join(" • ")} | 100% Verified Islamic Matrimonial Biodata. Click to view full profile details on Rishta Matrimony.`;
          ogImage = `${siteUrl}/og-profile.jpg`;
        }
      }
    } catch (e) {
      console.warn("Could not fetch profile metadata:", e);
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  
  <!-- OpenGraph Metadata for WhatsApp & Social Media Preview -->
  <meta property="og:type" content="profile" />
  <meta property="og:url" content="${targetUrl}" />
  <meta property="og:site_name" content="Rishta Matrimony" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:secure_url" content="${ogImage}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="675" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- Instant Browser Redirect -->
  <meta http-equiv="refresh" content="0; url=${targetUrl}" />
  <script>
    window.location.replace("${targetUrl}");
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f7f5f0; color: #1f4037; text-align: center; padding: 50px 20px;">
  <h2>Opening Rishta Matrimony...</h2>
  <p>${title}</p>
  <p><a href="${targetUrl}" style="color: #2c7a7b; font-weight: bold; text-decoration: underline;">Click here if not redirected automatically.</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(html);
}
