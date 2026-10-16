# Architecture rules

- Vercel profile-link crawlers receive server-rendered social metadata through `api/og-profiles.ts`; keep crawler responses free of instant redirects so previews can be read reliably.
- Profile share image selection must depend on the validated link ID, not a successful profile lookup, so temporary data failures cannot replace it with the website image.