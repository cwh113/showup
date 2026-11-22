// Show Up → Oura relay (Cloudflare Worker, free tier).
// Oura's API doesn't allow calls from web pages, so this passes them through.
// It stores nothing: your sign-in key goes phone → here → Oura and back.
const ALLOWED_ORIGIN = 'https://cwh113.github.io';

export default {
  async fetch(req) {
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const url = new URL(req.url);
    if (req.method !== 'GET' || !url.pathname.startsWith('/v2/usercollection/')) {
      return new Response('Show Up Oura relay is running.', { status: 200, headers: cors });
    }
    const r = await fetch('https://api.ouraring.com' + url.pathname + url.search, {
      headers: { Authorization: req.headers.get('Authorization') || '' },
    });
    return new Response(r.body, { status: r.status, headers: { ...cors, 'Content-Type': 'application/json' } });
  },
};
