import { generateCloudinarySignature } from '../api/sign-cloudinary.ts';
import handler from '../api/sign-cloudinary.ts';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

// Mock Helper for Node Request/Response
function createMockReqRes({ method = 'POST', body = {}, headers = {}, ip = '127.0.0.1' } = {}) {
  const req = {
    method,
    body,
    headers: {
      'x-forwarded-for': ip,
      ...headers,
    },
    socket: { remoteAddress: ip },
  };

  let statusCode = 200;
  let responseData = null;
  const responseHeaders = {};

  const res = {
    setHeader(key, value) {
      responseHeaders[key] = value;
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    getStatusCode: () => statusCode,
    getResponseData: () => responseData,
    getResponseHeaders: () => responseHeaders,
  };

  return { req, res };
}

async function runTests() {
  console.log('--- STARTING CLOUDINARY SIGNING ENDPOINT TESTS (FINAL PHASE 1) ---\n');

  // Set mock environment variables for tests
  process.env.CLOUDINARY_CLOUD_NAME = 'cqh7xuvh';
  process.env.CLOUDINARY_API_KEY = 'test_api_key_123';
  process.env.CLOUDINARY_API_SECRET = 'my_super_secret_sample_key';

  // Test 1: GET and unsupported HTTP methods rejected (405)
  {
    const { req, res } = createMockReqRes({ method: 'GET' });
    await handler(req, res);
    assert(res.getStatusCode() === 405, '1. GET request rejected with 405 Method Not Allowed');
    assert(res.getResponseData().error === 'Method Not Allowed', '1.1 Returns proper method error');
  }

  // Test 2: Missing or invalid request body rejected (400)
  {
    const { req, res } = createMockReqRes({ body: null });
    await handler(req, res);
    assert(res.getStatusCode() === 400, '2. Missing/null body rejected with 400');
  }

  // Test 3: Arbitrary folder and upload parameters rejected (400)
  {
    const { req, res } = createMockReqRes({
      body: { purpose: 'seller_property', folder: 'malicious/folder' },
    });
    await handler(req, res);
    assert(res.getStatusCode() === 400, '3. Arbitrary folder parameter rejected with 400');
    assert(res.getResponseData().error === 'Forbidden Parameter', '3.1 Returns Forbidden Parameter error');
  }

  // Test 3.2: Arbitrary transformation rejected
  {
    const { req, res } = createMockReqRes({
      body: { purpose: 'seller_property', transformation: 'w_100' },
    });
    await handler(req, res);
    assert(res.getStatusCode() === 400, '3.2 Arbitrary transformation parameter rejected');
  }

  // Test 4: Unknown upload purpose rejected (400)
  {
    const { req, res } = createMockReqRes({
      body: { purpose: 'random_hacker_purpose' },
    });
    await handler(req, res);
    assert(res.getStatusCode() === 400, '4. Unknown upload purpose rejected with 400');
    assert(res.getResponseData().error === 'Invalid Purpose', '4.1 Returns Invalid Purpose error');
  }

  // Test 5: admin_property is DISABLED and rejected with 403 (Never issues signature)
  {
    const { req, res } = createMockReqRes({
      body: { purpose: 'admin_property' },
    });
    await handler(req, res);
    assert(res.getStatusCode() === 403, '5. admin_property purpose is disabled & rejected with 403');
    assert(res.getResponseData().error === 'Forbidden', '5.1 Returns Forbidden error for admin_property');
    assert(!res.getResponseData().signature, '5.2 No signature issued for admin_property');
  }

  // Test 6: Valid seller_property request succeeds (200)
  {
    const { req, res } = createMockReqRes({
      body: { purpose: 'seller_property' },
      headers: { origin: 'https://www.goodcallproperties.in' },
      ip: '10.0.0.1',
    });
    await handler(req, res);
    assert(res.getStatusCode() === 200, '6. Valid seller_property request succeeds with 200 OK');

    const data = res.getResponseData();
    assert(data.cloudName === 'cqh7xuvh', '6.1 Correct cloudName returned');
    assert(data.folder === 'goodcall/pending_sellers', '6.2 Correct server-controlled folder returned');
    assert(typeof data.signature === 'string' && data.signature.length === 40, '6.3 Valid SHA-1 hex signature returned');
    assert(data.maxFileSize === 10485760, '6.4 Informational maxFileSize (10MB) returned');
  }

  // Test 7: Valid valuation request succeeds (200)
  {
    const { req, res } = createMockReqRes({
      body: { purpose: 'valuation' },
      headers: { origin: 'http://localhost:5173' },
      ip: '10.0.0.2',
    });
    await handler(req, res);
    assert(res.getStatusCode() === 200, '7. Valid valuation request succeeds with 200 OK');

    const data = res.getResponseData();
    assert(data.folder === 'goodcall/valuations', '7.1 Correct valuation folder returned');
    assert(typeof data.signature === 'string' && data.signature.length === 40, '7.2 Valid signature returned');
  }

  // Test 8: Origin Check (Defense-in-depth)
  {
    // Disallowed origin rejected
    const { req: badReq, res: badRes } = createMockReqRes({
      body: { purpose: 'seller_property' },
      headers: { origin: 'https://malicious-site.com' },
    });
    await handler(badReq, badRes);
    assert(badRes.getStatusCode() === 403, '8. Disallowed Origin rejected with 403');
    assert(badRes.getResponseData().error === 'Forbidden Origin', '8.1 Returns Forbidden Origin');

    // Allowed dev origin accepted
    const { req: devReq, res: devRes } = createMockReqRes({
      body: { purpose: 'seller_property' },
      headers: { origin: 'http://localhost:3000' },
      ip: '10.0.0.3',
    });
    await handler(devReq, devRes);
    assert(devRes.getStatusCode() === 200, '8.2 Allowed localhost development origin accepted');
  }

  // Test 9: Missing environment variables fail safely (500)
  {
    const prevSecret = process.env.CLOUDINARY_API_SECRET;
    delete process.env.CLOUDINARY_API_SECRET;

    const { req, res } = createMockReqRes({
      body: { purpose: 'seller_property' },
      ip: '10.0.0.4',
    });
    await handler(req, res);
    assert(res.getStatusCode() === 500, '9. Missing environment variables fail safely with 500');
    assert(res.getResponseData().error === 'Server Configuration Error', '9.1 Returns safe error without exposing internals');

    process.env.CLOUDINARY_API_SECRET = prevSecret;
  }

  // Test 10: API Secret is NEVER included in any response
  {
    const { req, res } = createMockReqRes({
      body: { purpose: 'seller_property' },
      ip: '10.0.0.5',
    });
    await handler(req, res);
    const data = res.getResponseData();
    const stringified = JSON.stringify(data);
    assert(!stringified.includes('my_super_secret_sample_key'), '10. API Secret is NEVER included in response data');
    assert(!('apiSecret' in data) && !('api_secret' in data), '10.1 No secret key in response object');
  }

  // Test 11: Anti-Cache Headers are present
  {
    const { req, res } = createMockReqRes({
      body: { purpose: 'seller_property' },
      ip: '10.0.0.6',
    });
    await handler(req, res);
    const headers = res.getResponseHeaders();
    assert(headers['Cache-Control'] === 'no-store, no-cache, must-revalidate, proxy-revalidate', '11. Cache-Control header strictly prevents caching');
    assert(headers['Pragma'] === 'no-cache', '11.1 Pragma no-cache header set');
  }

  // Test 12: Signature Algorithm Verification
  {
    const sampleParams = {
      allowed_formats: 'jpg,jpeg,png,webp,heic',
      folder: 'goodcall/pending_sellers',
      timestamp: 1727490000,
    };
    const secret = 'sample_secret';
    const sig = generateCloudinarySignature(sampleParams, secret);
    assert(typeof sig === 'string' && sig.length === 40, '12. SHA-1 signature format verified');
  }

  console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
