<?php
/**
 * Script para subir imágenes de presupuestos
 * Este archivo debe desplegarse en el servidor de Dreamhost
 * junto con el frontend de la aplicación
 */

// Configuración de CORS - Permitir acceso desde cualquier origen (ajustar en producción)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración
$uploadDir = __DIR__ . '/uploads/budgets/';
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxFileSize = 10 * 1024 * 1024; // 10MB

// Crear directorio si no existe
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

/**
 * Función para generar nombre único de archivo
 */
function generateUniqueFilename($originalName) {
    $extension = pathinfo($originalName, PATHINFO_EXTENSION);
    $uniqueId = uniqid('budget_', true);
    $timestamp = date('Ymd_His');
    return $timestamp . '_' . $uniqueId . '.' . $extension;
}

/**
 * Función para obtener la URL base del servidor
 */
function getBaseUrl() {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $scriptDir = dirname($_SERVER['SCRIPT_NAME']);
    return $protocol . '://' . $host . $scriptDir;
}

// Manejar subida de imagen (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Verificar que se envió un archivo
        if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
            throw new Exception('No se envió ninguna imagen');
        }

        $file = $_FILES['image'];

        // Verificar errores de subida
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido por el servidor',
                UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño máximo permitido por el formulario',
                UPLOAD_ERR_PARTIAL => 'El archivo se subió parcialmente',
                UPLOAD_ERR_NO_TMP_DIR => 'No se encontró el directorio temporal',
                UPLOAD_ERR_CANT_WRITE => 'Error al escribir el archivo en disco',
                UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida',
            ];
            $errorMsg = $errorMessages[$file['error']] ?? 'Error desconocido en la subida';
            throw new Exception($errorMsg);
        }

        // Verificar tipo de archivo
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            throw new Exception('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)');
        }

        // Verificar tamaño
        if ($file['size'] > $maxFileSize) {
            throw new Exception('El archivo excede el tamaño máximo de 10MB');
        }

        // Generar nombre único y mover archivo
        $newFilename = generateUniqueFilename($file['name']);
        $destination = $uploadDir . $newFilename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception('Error al guardar el archivo');
        }

        // Generar URL pública
        $baseUrl = getBaseUrl();
        $publicUrl = $baseUrl . '/uploads/budgets/' . $newFilename;

        // Respuesta exitosa
        echo json_encode([
            'success' => true,
            'message' => 'Imagen subida correctamente',
            'data' => [
                'url' => $publicUrl,
                'filename' => $newFilename,
                'original_name' => $file['name'],
                'mime_type' => $mimeType,
                'size' => $file['size'],
                'path' => '/uploads/budgets/' . $newFilename
            ]
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit();
}

// Manejar eliminación de imagen (DELETE)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        // Obtener el nombre del archivo del body
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['filename'])) {
            throw new Exception('No se especificó el archivo a eliminar');
        }

        $filename = basename($input['filename']); // Sanitizar para evitar path traversal
        $filePath = $uploadDir . $filename;

        // Verificar que el archivo existe
        if (!file_exists($filePath)) {
            throw new Exception('El archivo no existe');
        }

        // Eliminar archivo
        if (!unlink($filePath)) {
            throw new Exception('Error al eliminar el archivo');
        }

        echo json_encode([
            'success' => true,
            'message' => 'Imagen eliminada correctamente'
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit();
}

// Método no permitido
http_response_code(405);
echo json_encode([
    'success' => false,
    'message' => 'Método no permitido'
]);
