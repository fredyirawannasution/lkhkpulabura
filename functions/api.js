const FALLBACK_GAS_URL = 'https://script.google.com/macros/s/AKfycbwAl77M63KGmY5CQU1MmbQB2dvWZ-QK9Tydtbrycek8vDLfm4amJ9cPEgUP1msdQvB98g/exec';

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const gasUrl = env.GAS_URL || FALLBACK_GAS_URL;
  if (!env.API_TOKEN) {
    return json({ error: 'API_TOKEN belum dikonfigurasi di Cloudflare.' }, 500);
  }

  const accessEmail = (request.headers.get('Cf-Access-Authenticated-User-Email') || '')
    .trim().toLowerCase();
  const map = parseJson(env.OWNER_EMAIL_MAP || '{}');
  const profileKey = map[accessEmail];

  if (!profileKey) {
    return json({ error: 'Akun Anda belum terdaftar sebagai pemilik LHK. Hubungi administrator.' }, 403);
  }

  const target = new URL(gasUrl);
  for (const [key, value] of url.searchParams.entries()) {
    target.searchParams.set(key, value);
  }
  target.searchParams.set('token', env.API_TOKEN);
  target.searchParams.set('profileKey', profileKey);

  try {
    const upstream = await fetch(target.toString(), { redirect: 'follow' });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (_) {
    return json({ error: 'Gagal menghubungi Google Apps Script.' }, 502);
  }
}

export function onRequest(context) {
  if (context.request.method === 'GET') return onRequestGet(context);
  return json({ error: 'Method Not Allowed' }, 405);
}

function parseJson(value) {
  try { return JSON.parse(value); } catch (_) { return {}; }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}
