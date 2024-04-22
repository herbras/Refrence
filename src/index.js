const SCRIPT_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=deDAAYZlkEcQpAzDA4lLbjFqnqx-ytQm-dKXKbzXZdIIZWBrG9YfgfTd3p60I4NsbM7Amq2kNessrvwPHJ6qcz9xeCfELaz7m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLrIGAffBzPjryrveLeR0r27zVhfBiBi6d4fMZPoAdewDC3oAHyLXKgmEd5NAv7PBSP7VTiyMieOcZi4NjNe1J99DL_u_3Fn2dz9Jw9Md8uu&lib=M-Y-2Ar1DTKPYVIaaxiL11P8Y1bAqMqQH';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'GET') {
    const cacheKey = new Request(SCRIPT_URL, request);
    const cache = caches.default;

    // Cek apakah data sudah ada di cache
    let response = await cache.match(cacheKey);

    if (!response) {
      // Jika belum ada di cache, ambil data dari URL Google Apps Script
      try {
        response = await fetch(SCRIPT_URL);
        const jsonData = await response.json();

        // Simpan data ke cache
        await cache.put(cacheKey, new Response(JSON.stringify(jsonData)));
      } catch (error) {
        return new Response('Error fetching data from Google Apps Script', { status: 500 });
      }
    }

    return response;
  } else {
    return new Response('Method not allowed', { status: 405 });
  }
}