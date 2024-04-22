/**
* @description
* Fungsi ini merupakan event listener yang akan dijalankan ketika terjadi permintaan (request) dari klien.
* Fungsi ini akan memanggil fungsi `handleRequest` untuk menangani permintaan tersebut.
*
* @param {FetchEvent} event - Objek event yang berisi informasi tentang permintaan (request) yang diterima.
*/
addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request));
 });

 /**
 * @description
 * Variabel ini berisi data JSON cadangan yang akan digunakan jika terjadi kesalahan saat mengambil data dari URL API Google Apps Script.
 * @type {Array}
 */
 const FALLBACK_JSON_DATA = [json_backup_kamu];

 /**
 * @description
 * Fungsi ini merupakan fungsi utama yang akan menangani permintaan (request) dari klien.
 * Fungsi ini akan memeriksa metode permintaan (GET) dan mengambil data JSON dari Cloudflare KV atau URL API Google Apps Script.
 * Jika data tidak ditemukan di Cloudflare KV, fungsi akan mencoba mengambil data dari URL API Google Apps Script.
 * Jika terjadi kesalahan saat mengambil data dari URL API Google Apps Script, fungsi akan menggunakan data JSON cadangan.
 * Setelah mendapatkan data JSON, fungsi akan mengembalikan respons berupa data JSON kepada klien.
 *
 * @param {Request} request - Objek permintaan (request) yang diterima dari klien.
 * @returns {Promise<Response>} - Promise yang mengembalikan objek Response berisi data JSON.
 */
 async function handleRequest(request) {
	if (request.method === 'GET') {
		const cacheKey = 'json_data';

		// Memeriksa apakah data sudah tersedia di Cloudflare KV
		let jsonData = await syafii.get(cacheKey);

		if (!jsonData) {
			// Jika data tidak ditemukan di Cloudflare KV, mengambil data dari URL API Google Apps Script
			try {
				const response = await fetch(SCRIPT_URL);
				jsonData = await response.json();

				// Menyimpan data ke Cloudflare KV
				await syafii.put(cacheKey, JSON.stringify(jsonData));
			} catch (error) {
				// Jika terjadi kesalahan, menggunakan data JSON cadangan
				jsonData = FALLBACK_JSON_DATA;

				// Opsional: Menyimpan data cadangan ke Cloudflare KV jika diinginkan
				await syafii.put(cacheKey, JSON.stringify(jsonData));
			}
		} else {
			// Jika data ditemukan di Cloudflare KV, mem-parsing data JSON
			jsonData = JSON.parse(jsonData);
		}

		// Mengembalikan data JSON sebagai respons
		return new Response(JSON.stringify(jsonData), {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		});
	} else {
		// Jika metode permintaan bukan GET, mengembalikan respons dengan status 405 (Method Not Allowed)
		return new Response('Method not allowed', { status: 405 });
	}
 }
