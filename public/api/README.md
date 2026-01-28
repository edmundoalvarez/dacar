# API de Carga de Imágenes para Presupuestos

Este directorio contiene el script PHP necesario para manejar la carga de imágenes de presupuestos en el servidor de Dreamhost.

## Estructura

```
api/
├── upload_image.php    # Script principal para subir/eliminar imágenes
├── uploads/
│   └── budgets/        # Directorio donde se almacenan las imágenes
└── README.md           # Este archivo
```

## Configuración en Dreamhost

### 1. Subir archivos

Cuando despliegues el frontend en Dreamhost, asegurate de que la carpeta `api/` se suba junto con el resto de archivos públicos.

### 2. Permisos

El directorio `uploads/budgets/` necesita permisos de escritura. Ejecutá en SSH:

```bash
chmod 755 /ruta/a/tu/sitio/api/uploads/budgets
```

### 3. Configuración de PHP

El script está configurado para:
- Aceptar imágenes de hasta **10MB**
- Permitir formatos: **JPEG, PNG, GIF, WebP**
- Generar nombres de archivo únicos para evitar conflictos

### 4. CORS (Opcional)

Si el frontend está en un dominio diferente al del PHP, modificá las cabeceras CORS en `upload_image.php`:

```php
// Cambiar de:
header('Access-Control-Allow-Origin: *');

// A tu dominio específico:
header('Access-Control-Allow-Origin: https://tu-dominio-frontend.com');
```

## Endpoints

### POST /api/upload_image.php

Subir una imagen.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (archivo de imagen)

**Response (éxito):**
```json
{
  "success": true,
  "message": "Imagen subida correctamente",
  "data": {
    "url": "https://tu-dominio.com/api/uploads/budgets/20260125_123456_abc123.jpg",
    "filename": "20260125_123456_abc123.jpg",
    "original_name": "foto-original.jpg",
    "mime_type": "image/jpeg",
    "size": 123456,
    "path": "/uploads/budgets/20260125_123456_abc123.jpg"
  }
}
```

### DELETE /api/upload_image.php

Eliminar una imagen.

**Request:**
- Content-Type: `application/json`
- Body: `{ "filename": "20260125_123456_abc123.jpg" }`

**Response (éxito):**
```json
{
  "success": true,
  "message": "Imagen eliminada correctamente"
}
```

## Configuración del Frontend

En el archivo `src/config.json`, la URL del endpoint está configurada como:

```json
{
  "apiUploadImage": "/api/upload_image.php"
}
```

Si necesitás usar una URL absoluta (por ejemplo, si el PHP está en otro servidor), cambiala a:

```json
{
  "apiUploadImage": "https://tu-servidor.com/api/upload_image.php"
}
```

## Troubleshooting

### Error "No se pudo subir la imagen"

1. Verificá que el directorio `uploads/budgets/` tenga permisos de escritura
2. Verificá que PHP tenga habilitada la directiva `file_uploads`
3. Revisá el tamaño máximo de subida en `php.ini`: `upload_max_filesize` y `post_max_size`

### Error de CORS

Si ves errores de CORS en la consola del navegador:
1. Verificá que las cabeceras CORS estén configuradas correctamente
2. Asegurate de que el servidor soporte las cabeceras OPTIONS (preflight)

### Imágenes no se muestran

1. Verificá que la URL generada sea accesible públicamente
2. Verificá que no haya reglas de `.htaccess` bloqueando el acceso al directorio `uploads/`
