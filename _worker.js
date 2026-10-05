/**
 * Cloudflare Pages Advanced Mode Worker.
 *
 * Required environment variables/secrets:
 * GAS_URL           = URL /exec Google Apps Script
 * API_TOKEN         = same secret as Apps Script Script Property API_TOKEN
 * OWNER_EMAIL_MAP   = JSON object: {"email@domain":"fredy","email2@domain":"owner2"}
 *
 * Cloudflare Access should protect the Pages site. The Worker reads the
 * authenticated email header and converts it to a locked profileKey.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api') {
      if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });
      if (!env.GAS_URL || !env.API_TOKEN) {
        return Response.json({ error: 'GAS_URL/API_TOKEN belum dikonfigurasi.' }, { status: 500 });
      }

      const accessEmail = (request.headers.get('Cf-Access-Authenticated-User-Email') || '').trim().toLowerCase();
      const map = parseJson(env.OWNER_EMAIL_MAP || '{}');
      const profileKey = map[accessEmail];

      // Untuk produksi, jangan izinkan default profile tanpa Cloudflare Access.
      if (!profileKey) {
        return Response.json({
          error: 'Akun Anda belum terdaftar sebagai pemilik LHK. Hubungi administrator.'
        }, { status: 403 });
      }

      const target = new URL(env.GAS_URL || "https://script.google.com/macros/s/AKfycbwAl77M63KGmY5CQU1MmbQB2dvWZ-QK9Tydtbrycek8vDLfm4amJ9cPEgUP1msdQvB98g/exec");
      for (const [k, v] of url.searchParams.entries()) target.searchParams.set(k, v);
      target.searchParams.set('token', env.API_TOKEN);
      target.searchParams.set('profileKey', profileKey);

      const upstream = await fetch(target.toString(), { redirect: 'follow' });
      const body = await upstream.text();
      return new Response(body, {
        status: upstream.ok ? 200 : upstream.status,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store, no-cache, must-revalidate'
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};

function parseJson(value) {
  try { return JSON.parse(value); } catch (_) { return {}; }
}
