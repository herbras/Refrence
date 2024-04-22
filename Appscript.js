

/**
 * @description
 * HANYA bisa digunakan di appscript https://script.google.com/
 * Fungsi ini merupakan fungsi utama yang akan dipanggil ketika terjadi permintaan GET.
 * Fungsi ini akan mengambil struktur file dari beberapa folder root yang ditentukan dalam variabel `rootFolderIds`.
 * Struktur file akan dihasilkan menggunakan fungsi `generateFileStructure` untuk setiap folder root.
 * Hasil struktur file akan diubah menjadi format JSON dan dikembalikan sebagai respons dengan tipe konten JSON.
 *
 * @param {Object} request - Objek permintaan (request) yang diterima.
 * @returns {HTTPResponse} - Objek respons HTTP yang berisi struktur file dalam format JSON.
 */
function doGet(request) {
	var rootFolderIds = ["FolderID1", "FolderID2"];
	var fileStructures = rootFolderIds.map(function(rootFolderId) {
	  return generateFileStructure(rootFolderId);
	});

	var response = ContentService.createTextOutput();
	var json = JSON.stringify(fileStructures);
	response.setContent(json);

	var httpResponse = response.setMimeType(ContentService.MimeType.JSON);
	return httpResponse;
  }

  /**
   * @description
   * Fungsi ini digunakan untuk menghasilkan struktur file dari sebuah folder dengan ID yang diberikan.
   * Fungsi ini akan mengambil daftar file dan subfolder dalam folder tersebut secara rekursif.
   * Struktur file akan berisi informasi seperti nama folder, ID folder, daftar file, dan daftar subfolder.
   * Untuk setiap file, informasi seperti nama file, ID file, dan URL unduhan akan disertakan.
   * Fungsi ini akan memanggil dirinya sendiri secara rekursif untuk menghasilkan struktur file dari subfolder.
   *
   * @param {string} folderId - ID folder yang akan diproses.
   * @returns {Object} - Objek yang merepresentasikan struktur file dari folder yang diberikan.
   */
  function generateFileStructure(folderId) {
	try {
	  var folder = DriveApp.getFolderById(folderId);
	  var files = folder.getFiles();
	  var folders = folder.getFolders();

	  var structure = {
		name: folder.getName(),
		id: folderId,
		files: [],
		folders: []
	  };

	  while (files.hasNext()) {
		var file = files.next();
		var fileId = file.getId();
		var fileName = file.getName();
		var downloadUrl = "https://drive.google.com/uc?export=download&id=" + fileId;

		structure.files.push({
		  name: fileName,
		  id: fileId,
		  downloadUrl: downloadUrl
		});
	  }

	  while (folders.hasNext()) {
		var subFolder = folders.next();
		var subFolderId = subFolder.getId();
		var subFolderStructure = generateFileStructure(subFolderId);
		structure.folders.push(subFolderStructure);
	  }

	  return structure;
	} catch (e) {
	  console.error("Error processing folder: " + folderId + ". " + e.message);
	  return null;
	}
  }
