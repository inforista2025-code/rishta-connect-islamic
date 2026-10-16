const SUPABASE_URL = "https://rxlzlkcdszulyetcxxih.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bHpsa2Nkc3p1bHlldGN4eGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTAzODIsImV4cCI6MjA3NTI2NjM4Mn0.PXcKNOiJlQr_BSqPZKIGTQYKK-e6Y5obVg7WPJm17hM";

export function getShareUrls(profileId: unknown) {
  const siteUrl = "https://rishtamatrimony.vercel.app";
  const id = typeof profileId === "string" && /^\d+$/.test(profileId) ? profileId : undefined;
  return {
    profileId: id,
    targetUrl: id ? `${siteUrl}/profiles?id=${encodeURIComponent(id)}` : `${siteUrl}/profiles`,
    ogImage: id ? `${siteUrl}/og-profile.jpg?v=20261016` : `${siteUrl}/og-image.jpg`,
  };
}

export default async function handler(req: any, res: any) {
  const { profileId, targetUrl, ogImage } = getShareUrls(req.query?.id);
  const isCrawler = /bot|crawler|spider|whatsapp|facebookexternalhit|facebot|iMessage|Instagram|meta-external|Pinterest|Snapchat/i.test(req.headers?.["user-agent"] || "");

  let title = "Rishta Matrimony - 100% Halal Islamic Marriage Community";
  let description = "Join our Muslim Matrimony community to connect with verified profiles. Connecting Muslim hearts with authentic Islamic values.";

  if (profileId) {
    try {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/profiles_data?id=eq.${profileId}&select=id,name,gender,verification_status,is_live`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

      if (resp.ok) {
        const rows = await resp.json();
        if (rows && rows.length > 0) {
          const p = rows[0];
          const candidateName = (p.name || `Member #${p.id}`).trim();

          title = `Rishta Matrimony - Verified Profile: ${candidateName}`;
          description = `100% Verified Profile on Rishta Matrimony. Connecting Muslim hearts with authentic Islamic values and complete family privacy.`;
        }
      }
    } catch (e) {
      console.warn("Could not fetch profile metadata:", e);
    }
  }

  // Profile names are data, never executable HTML.
  title = title.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] || char));
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="icon" href="/favicon.png" type="image/png" />
  <link rel="image_src" href="${ogImage}" />
  
  <!-- OpenGraph Metadata for WhatsApp & Social Media Preview -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${targetUrl}" />
  <meta property="og:site_name" content="Rishta Matrimony" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:secure_url" content="${ogImage}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Rishta Matrimony" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- Instant Browser Redirect -->
  ${isCrawler ? "" : `<meta http-equiv="refresh" content="0; url=${targetUrl}" />
  <script>
    window.location.replace("${targetUrl}");
  </script>`}
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fdf2f6; color: #880e4f; text-align: center; padding: 50px 20px;">
  <h2>Opening Rishta Matrimony...</h2>
  <p>${title}</p>
  <p><a href="${targetUrl}" style="color: #e91e63; font-weight: bold; text-decoration: underline;">Click here if not redirected automatically.</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Vary", "User-Agent");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(html);
}
