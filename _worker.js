export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api') {
      if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });

      // Cukup gunakan GAS_URL bawaan atau dari Environment Variable
      const target = new URL(env.GAS_URL || "https://script.google.com/macros/s/AKfycbwAl77M63KGmY5CQU1MmbQB2dvWZ-QK9Tydtbrycek8vDLfm4amJ9cPEgUP1msdQvB98g/exec");
      
      // Teruskan semua parameter dari frontend ke GAS
      for (const [k, v] of url.searchParams.entries()) {
        target.searchParams.set(k, v);
      }
      
      // Langsung tetapkan profileKey ke 'fredy' karena sistem email dimatikan
      target.searchParams.set('profileKey', 'fredy');

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
