/**
 * Cloudflare Pages Advanced Mode Worker.
 *
 * IMPORTANT:
 * - This file is intentionally named _worker.js and lives in the Pages output root.
 * - Do NOT deploy this repository with `npx wrangler deploy`.
 * - In Cloudflare Pages Git integration, use an empty build command and output directory `.`.
 *
 * Required Cloudflare variables/secrets:
 *   GAS_URL          = Apps Script /exec URL
 *   API_TOKEN        = same secret as Apps Script Script Property API_TOKEN
 *   OWNER_EMAIL_MAP  = JSON, e.g. {"user@example.com":"fredy"}
 */

const FALLBACK_GAS_URL = 'https://script.google.com/macros/s/AKfycbwAl77M63KGmY5CQU1MmbQB2dvWZ-QK9Tydtbrycek8vDLfm4amJ9cPEgUP1msdQvB98g/exec';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api') {
      if (request.method !== 'GET') {
        return json({ error: 'Method Not Allowed' }, 405);
      }

      const gasUrl = env.GAS_URL || FALLBACK_GAS_URL;
      if (!env.API_TOKEN) {
        return json({ error: 'API_TOKEN belum dikonfigurasi di Cloudflare.' }, 500);
      }

      const accessEmail = (request.headers.get('Cf-Access-Authenticated-User-Email') || '')
        .trim()
        .toLowerCase();
      const map = parseJson(env.OWNER_EMAIL_MAP || '{}');
      const profileKey = map[accessEmail];

      if (!profileKey) {
        return json({
          error: 'Akun Anda belum terdaftar sebagai pemilik LHK. Hubungi administrator.'
        }, 403);
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
      } catch (error) {
        return json({ error: 'Gagal menghubungi Google Apps Script.' }, 502);
      }
    }

    // Cloudflare Pages Advanced Mode exposes static assets through ASSETS.
    return env.ASSETS.fetch(request);
  }
};

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch (_) {
    return {};
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
