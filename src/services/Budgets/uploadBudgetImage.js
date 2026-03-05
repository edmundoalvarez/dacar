import config from "../../config.json";

/**
 * Sube una imagen al servidor PHP
 * @param {File} file - Archivo de imagen a subir
 * @returns {Promise<Object>} - Datos de la imagen subida
 */
async function uploadBudgetImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  // URL del endpoint PHP - Usar la URL configurada o la relativa
  const uploadUrl = config.apiUploadImage || "/api/upload_image.php";

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (parseError) {
    throw new Error(
      "El servidor de imágenes no respondió correctamente. " +
      "Verificá que el servidor PHP esté corriendo en el puerto 8080."
    );
  }

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Error al subir la imagen");
  }

  return data.data;
}

/**
 * Elimina una imagen del servidor PHP
 * @param {string} filename - Nombre del archivo a eliminar
 * @returns {Promise<Object>} - Resultado de la operación
 */
async function deleteBudgetImage(filename) {
  const uploadUrl = config.apiUploadImage || "/api/upload_image.php";

  const res = await fetch(uploadUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (parseError) {
    throw new Error(
      "El servidor de imágenes no respondió correctamente. " +
      "Verificá que el servidor PHP esté corriendo en el puerto 8080."
    );
  }

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Error al eliminar la imagen");
  }

  return data;
}

export { uploadBudgetImage, deleteBudgetImage };
