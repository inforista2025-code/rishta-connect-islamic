# Architecture rules

- Vercel profile-link crawlers receive server-rendered social metadata through `api/og-profiles.ts`; keep crawler responses free of instant redirects so previews can be read reliably.
- Profile share image selection must depend on the validated link ID, not a successful profile lookup, so temporary data failures cannot replace it with the website image.
- Components mounted app-wide (e.g. `IslamicAssistantWidget`) must never early-return before their hook calls; a hooks-order violation crashes the whole app on route change (this caused blank pages requiring refresh). `ErrorBoundary` wraps the router in `App.tsx` so future errors show a recoverable screen instead of a blank page.
