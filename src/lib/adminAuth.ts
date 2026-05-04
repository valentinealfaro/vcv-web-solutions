/* Server-only admin auth helpers.
   - HMAC-SHA256 signed session token, HttpOnly cookie
   - Edge-runtime compatible (uses Web Crypto, no Node-only APIs)
   - Constant-time comparison for password + signature checks */

const COOKIE_NAME = 'vcv_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours

const enc = new TextEncoder();
const dec = new TextDecoder();

const b64urlEncode = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const b64urlDecode = (s: string): Uint8Array => {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return new Uint8Array(sig);
}

const constantTimeEqual = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
};

const constantTimeStringEqual = (a: string, b: string): boolean => {
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  // pad shorter to longer length so we always compare full length
  const len = Math.max(aBytes.length, bBytes.length);
  const aPad = new Uint8Array(len);  aPad.set(aBytes);
  const bPad = new Uint8Array(len);  bPad.set(bBytes);
  return constantTimeEqual(aPad, bPad) && aBytes.length === bBytes.length;
};

export async function signSessionToken(secret: string, ttlSeconds = SESSION_TTL_SECONDS): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = b64urlEncode(enc.encode(JSON.stringify({ exp })));
  const sig = b64urlEncode(await hmac(secret, payload));
  return `${payload}.${sig}`;
}

export async function verifySessionToken(secret: string, token: string | undefined): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;

  const expected = await hmac(secret, payload);
  let provided: Uint8Array;
  try { provided = b64urlDecode(sig); } catch { return false; }
  if (!constantTimeEqual(expected, provided)) return false;

  try {
    const json = JSON.parse(dec.decode(b64urlDecode(payload)));
    if (typeof json.exp !== 'number') return false;
    if (Math.floor(Date.now() / 1000) >= json.exp) return false;
    return true;
  } catch { return false; }
}

export function isPasswordCorrect(provided: string, expected: string): boolean {
  if (!expected) return false; // never accept empty/missing env var
  return constantTimeStringEqual(provided, expected);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_SESSION_TTL = SESSION_TTL_SECONDS;
