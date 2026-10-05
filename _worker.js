/** Cloudflare Pages Advanced Mode worker.
 * Environment variables:
 * GAS_URL   = deployed Google Apps Script Web App URL, e.g. https://script.google.com/macros/s/.../exec
 * API_TOKEN = secret token matching the Apps Script Script Property API_TOKEN
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api') {
      if (request.method !== 'GET') return new Response('Method Not Allowed', {status:405});
      if (!env.GAS_URL || !env.API_TOKEN) return Response.json({error:'Cloudflare belum dikonfigurasi: GAS_URL/API_TOKEN.'},{status:500});
      const target = new URL(env.GAS_URL);
      target.search = url.search;
      target.searchParams.set('token', env.API_TOKEN);
      const upstream = await fetch(target.toString(), {redirect:'follow'});
      const body = await upstream.text();
      return new Response(body, {status:upstream.status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
    }
    return env.ASSETS.fetch(request);
  }
};
