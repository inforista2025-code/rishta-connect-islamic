import type { IncomingMessage, ServerResponse } from 'http';
import * as crypto from 'crypto';

interface SignRequestBody {
  purpose?: string;
  [key: string]: unknown;
}

/**
 * Allowed upload purposes and their strict server-controlled folder mappings.
 * NOTE: 'admin_property' is intentionally disabled in Phase 1 pending full Firebase Admin token verification in a future phase.
 */
const ALLOWED_PURPOSES: Record<string, { folder: string; enabled: boolean }> = {
  seller_property: {
    folder: 'goodcall/pending_sellers',
    enabled: true,
  },
  valuation: {
    folder: 'goodcall/valuations',
    enabled: true,
  },
  admin_property: {
    folder: 'goodcall/properties',
    enabled: false, // Disabled in Phase 1
  },
};

// Disallowed client parameters that must never be accepted from the browser
const FORBIDDEN_CLIENT_KEYS = [
  'folder',
  'public_id',
  'publicId',
  'transformation',
  'upload_preset',
  'uploadPreset',
  'tags',
  'eager',
  'notification_url',
  'eval',
  'api_secret',
  'apiSecret',
];

/**
 * Origin Allowlist (Defense-in-depth only, NOT authentication).
 */
const ALLOWED_ORIGINS = [
  'https://www.goodcallproperties.in',
  'https://goodcallproperties.in',
];

function isOriginAllowed(originHeader: string | undefined): boolean {
  if (!originHeader) {
    // Permitted for non-browser/server/automated test environments where Origin is absent.
    // NOTE: Absence of Origin is NOT treated as authentication.
    return true;
  }
  const normalized = originHeader.trim().toLowerCase();
  if (ALLOWED_ORIGINS.includes(normalized)) {
    return true;
  }
  // Allow local development origins (http://localhost:*)
  if (/^http:\/\/localhost(:\d+)?$/.test(normalized) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(normalized)) {
    return true;
  }
  return false;
}

/**
 * In-memory sliding window rate limiter for single-container burst smoothing.
 * IMPORTANT: This is NOT a distributed Vercel-wide rate limiter.
 * On Vercel, ephemeral serverless instances do not share in-memory state.
 */
const ipRequestHistory = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 signatures per IP per 15 mins on a warm container

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, validTimestamps);
    return true;
  }
  
  validTimestamps.push(now);
  ipRequestHistory.set(ip, validTimestamps);
  return false;
}

/**
 * Cloudinary Signature Generator
 * Parameters must be sorted alphabetically and joined with '&', followed by api_secret.
 */
export function generateCloudinarySignature(
  paramsToSign: Record<string, string | number>,
  apiSecret: string
): string {
  const sortedKeys = Object.keys(paramsToSign).sort();
  const serialized = sortedKeys
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join('&');
  
  return crypto
    .createHash('sha1')
    .update(serialized + apiSecret)
    .digest('hex');
}

/**
 * Parses JSON body from incoming Node.js request stream
 */
async function parseJsonBody(req: IncomingMessage): Promise<SignRequestBody> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // Safety limit: 10KB max body payload
      if (body.length > 10 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

/**
 * Vercel Serverless Function Handler
 */
export default async function handler(req: any, res: any) {
  // 1. Strict Anti-Cache Headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Type', 'application/json');

  // 2. Enforce HTTP Method: POST only
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are permitted for generating upload signatures.',
    });
  }

  // 3. Origin Validation (Defense-in-depth)
  const origin = req.headers['origin'];
  if (!isOriginAllowed(origin)) {
    return res.status(403).json({
      error: 'Forbidden Origin',
      message: 'Requests from this origin are not permitted.',
    });
  }

  // 4. Rate Limiting Check (Warm Container Burst Guard)
  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .toString()
    .split(',')[0]
    .trim();

  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Signature request limit exceeded. Please try again later.',
    });
  }

  // 5. Verify Server Environment Configuration
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Server Configuration Error: Cloudinary environment variables are missing.');
    return res.status(500).json({
      error: 'Server Configuration Error',
      message: 'Upload signing service is temporarily unavailable.',
    });
  }

  // 6. Parse and Validate Request Body
  let body: SignRequestBody;
  try {
    if (req.body && typeof req.body === 'object') {
      body = req.body;
    } else {
      body = await parseJsonBody(req);
    }
  } catch (err: any) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message || 'Invalid request body.',
    });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Request body must be a valid JSON object.',
    });
  }

  // 7. Reject Arbitrary / Forbidden Client Parameters
  for (const forbiddenKey of FORBIDDEN_CLIENT_KEYS) {
    if (forbiddenKey in body) {
      return res.status(400).json({
        error: 'Forbidden Parameter',
        message: `Client parameter "${forbiddenKey}" is not permitted. Upload parameters are strictly server-controlled.`,
      });
    }
  }

  // 8. Validate Upload Purpose
  const { purpose } = body;
  if (!purpose || typeof purpose !== 'string' || !ALLOWED_PURPOSES[purpose]) {
    const validPurposes = Object.keys(ALLOWED_PURPOSES).filter(p => ALLOWED_PURPOSES[p].enabled).join(', ');
    return res.status(400).json({
      error: 'Invalid Purpose',
      message: `Invalid or missing upload purpose. Must be one of: [${validPurposes}].`,
    });
  }

  const targetConfig = ALLOWED_PURPOSES[purpose];

  // 9. Purpose Enforcement & Admin Disabled Check
  if (!targetConfig.enabled) {
    if (purpose === 'admin_property') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin signing is currently disabled in this phase.',
      });
    }
    return res.status(400).json({
      error: 'Disabled Purpose',
      message: `Upload purpose "${purpose}" is currently disabled.`,
    });
  }

  // 10. Generate Controlled Signature Parameters
  // NOTE: Public signing for seller_property and valuation is NOT user authentication.
  // Workflow-level validation & abuse protection must be enforced in Phase 2 client integration.
  const timestamp = Math.floor(Date.now() / 1000);
  const allowedFormats = 'jpg,jpeg,png,webp,heic';
  const folder = targetConfig.folder;

  const paramsToSign: Record<string, string | number> = {
    allowed_formats: allowedFormats,
    folder: folder,
    timestamp: timestamp,
  };

  const signature = generateCloudinarySignature(paramsToSign, apiSecret);

  // 11. Return Controlled Public Upload Parameters
  // API Secret is NEVER returned or logged.
  // NOTE: maxFileSize (10 MB) is returned purely as informational metadata for the client uploader.
  return res.status(200).json({
    cloudName: cloudName,
    apiKey: apiKey,
    timestamp: timestamp,
    signature: signature,
    folder: folder,
    allowedFormats: allowedFormats,
    maxFileSize: 10485760, // 10 MB informational account limit
  });
}
