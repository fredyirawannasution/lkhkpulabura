export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api') {
      if (request.method !== 'POST') return new Response('Hanya POST yang diizinkan', { status: 405 });

      // Masukkan URL GAS Anda dari langkah 1 di sini sebagai cadangan
      const GAS_URL = env.GAS_URL || "https://script.google.com/macros/s/AKfycbwLrp_Axq4G9Dg8FsQ_QWW93ioeSHFO6VvuU2SogWEL54WRs_Omn5xqpejz8GZf5-grCg/exec";

      try {
        const upstream = await fetch(GAS_URL, {
          method: 'POST',
          body: await request.text(),
          redirect: 'follow', // Wajib untuk mengikuti redirect dari Google
          headers: { 'Content-Type': 'text/plain' } // Hindari CORS preflight tambahan
        });

        const bodyText = await upstream.text();
        return new Response(bodyText, {
          status: 200,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store, no-cache'
          }
        });
      } catch (e) {
        return Response.json({ error: 'Gagal terhubung ke server. ' + e.message }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
