import assert from 'node:assert/strict';
import { getShareUrls } from '../api/og-profiles.ts';
import { readFileSync } from 'node:fs';

assert.equal(getShareUrls(undefined).ogImage, 'https://rishtamatrimony.vercel.app/og-image.jpg', 'Website share image must remain unchanged');
assert.equal(getShareUrls('93').ogImage, 'https://rishtamatrimony.vercel.app/og-profile.jpg?v=20261016', 'Profile links use the updated image independently of database availability');
assert.equal(getShareUrls('93').targetUrl, 'https://rishtamatrimony.vercel.app/profiles?id=93');
assert.equal(getShareUrls('<script>').profileId, undefined);
const { rewrites } = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
for (const ua of ['WhatsApp/2', 'TelegramBot (like TwitterBot)', 'facebookexternalhit/1.1', 'Instagram', 'meta-externalagent/1.1']) {
  for (const source of ['/profiles', '/profiles/(.*)']) {
    const route = rewrites.find(r => r.source === source);
    assert.ok(new RegExp(route.has[0].value).test(ua), `${ua} must receive social metadata on ${source}`);
  }
}
assert.equal(rewrites.find(r => r.source === '/profiles/(.*)').destination, '/api/og-profiles?id=$1');
console.log('Profile share URL and social crawler routing checks passed');