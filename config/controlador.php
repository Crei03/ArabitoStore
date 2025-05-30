<?php
// api.php - Controlador dinámico para operaciones CRUD

require_once(__DIR__ . "/config.php");
require_once(__DIR__ . "/handler.php");
header("Content-Type: application/json");

// Usar la función conectarBD definida en config.php
$conn = conectarBD();

$db = new DBHandler($conn);

// Determinar el tipo de contenido de la solicitud
$contentType = $_SERVER["CONTENT_TYPE"] ?? '';

$request = [];
$action = '';
$table = '';
$data = [];

if (strpos($contentType, 'application/json') !== false) {
    $input = file_get_contents("php://input");
    $request = json_decode($input, true) ?? []; // Asegurar que $request sea un array
    $action = $request['action'] ?? '';
    $table = $request['table'] ?? '';
    $data = $request['data'] ?? [];
} elseif (strpos($contentType, 'multipart/form-data') !== false) {
    $action = $_POST['action'] ?? '';
    $table = $_POST['table'] ?? ''; // Aunque no se use para uploadImage, es bueno tenerlo por consistencia
    // $data se manejará de forma diferente o no se usará directamente para uploadImage
} else {
    // Si no es JSON ni FormData, intentar obtener action de $_REQUEST como último recurso o manejar error
    $action = $_REQUEST['action'] ?? '';
    $table = $_REQUEST['table'] ?? '';
}


// Validaciones
if (!$action) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Se requiere 'action'"]);
    exit;
}

// Solo validar 'table' para acciones que lo requieren
$acciones_requieren_tabla = ['create', 'readAll', 'read', 'update', 'delete'];
if (in_array($action, $acciones_requieren_tabla) && !$table) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Se requiere 'table' para la acción '$action'"]);
    exit;
}

$filteredData = [];
if (is_array($data)) {
    foreach ($data as $key => $value) {
        $filteredData[$key] = htmlspecialchars(trim($value));
    }
}

// Manejo de acciones
switch ($action) {
    case 'login':
        login($db, $request);
        break;
    case 'create':
        create($db, $table, $filteredData);
        break;
    case 'readAll':
        readAll($db, $table);
        break;
    case 'read':
        read($db, $table, $filteredData);
        break;
    case 'update':
        update($db, $table, $filteredData);
        break;
    case 'delete':
        delete($db, $table, $filteredData);
        break;
    case 'uploadImage':
        // Determinar la ruta de subida según la tabla
        if ($table === 'categoria') {
            $uploadDir = __DIR__ . '/../public/images/categoria/';
        } elseif ($table === 'producto') {
            $uploadDir = __DIR__ . '/../public/images/producto/';
        } else {
            echo json_encode(["status" => "error", "message" => "Tabla no soportada para subida de imagen."]);
            exit;
        }
        handleImageUpload($uploadDir);
        break;
    case 'getDashboardStats':
        getDashboardStats($db);
        break;
    case 'getLatestProducts':
        getLatestProducts($db);
        break;
    case 'getCategoryProductSummary':
        getCategoryProductSummary($db);
        break;
    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Acción no válida"]);
        break;
}

function handleImageUpload($uploadDir)
{
    if (isset($_FILES['imagen_file']) && $_FILES['imagen_file']['error'] === UPLOAD_ERR_OK) {
        $nombre_personalizado_original = $_POST['nombre_imagen_personalizado'] ?? '';

        if (empty($nombre_personalizado_original)) {
            echo json_encode(["status" => "error", "message" => "Nombre de imagen personalizado no proporcionado."]);
            exit;
        }

        $uploadedFileExtension = strtolower(pathinfo($_FILES['imagen_file']['name'], PATHINFO_EXTENSION));
        $allowedExtensions = ['png', 'jpg'];
        if (!in_array($uploadedFileExtension, $allowedExtensions)) {
            echo json_encode(["status" => "error", "message" => "Tipo de archivo no permitido. Solo se aceptan .png y .jpg."]);
            exit;
        }

        $nombre_base_sanitizado = preg_replace('/[^a-zA-Z0-9_.-]/', '_', pathinfo($nombre_personalizado_original, PATHINFO_FILENAME));
        $nombre_final_sanitizado = $nombre_base_sanitizado . '.' . $uploadedFileExtension;

        // Usar la ruta recibida por parámetro
        // Crear el directorio si no existe
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                echo json_encode(["status" => "error", "message" => "Error al crear el directorio de subida: {$uploadDir}. Verifique los permisos."]);
                exit;
            }
        }

        // Verificar permisos de escritura en el directorio de subida
        if (!is_writable($uploadDir)) {
            echo json_encode(["status" => "error", "message" => "El directorio de subida ('{$uploadDir}') no tiene permisos de escritura."]);
            exit;
        }

        $uploadFile = $uploadDir . basename($nombre_final_sanitizado);

        if (move_uploaded_file($_FILES['imagen_file']['tmp_name'], $uploadFile)) {
            echo json_encode(["status" => "ok", "message" => "Imagen ('{$nombre_final_sanitizado}') subida y guardada correctamente."]);
        } else {
            $moveError = error_get_last();
            $errorMessageDetail = "Error al mover el archivo subido.";
            if ($moveError !== null && isset($moveError['message'])) {
                $errorMessageDetail .= " Detalles del servidor: " . $moveError['message'];
            }
            // También considera verificar $_FILES['imagen_file']['error'] aquí por si cambió después del chequeo inicial.
            echo json_encode(["status" => "error", "message" => $errorMessageDetail, "upload_error_code" => $_FILES['imagen_file']['error']]);
        }
    } else {
        $errorCode = $_FILES['imagen_file']['error'] ?? 'unknown';
        $errorMessage = 'Error en la subida del archivo.';
        switch ($errorCode) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $errorMessage = "El archivo es demasiado grande.";
                break;
            case UPLOAD_ERR_PARTIAL:
                $errorMessage = "El archivo solo se subió parcialmente.";
                break;
            case UPLOAD_ERR_NO_FILE:
                $errorMessage = "No se seleccionó ningún archivo.";
                break;
            case UPLOAD_ERR_NO_TMP_DIR:
                $errorMessage = "Falta la carpeta temporal.";
                break;
            case UPLOAD_ERR_CANT_WRITE:
                $errorMessage = "No se pudo escribir el archivo en el disco.";
                break;
            case UPLOAD_ERR_EXTENSION:
                $errorMessage = "Una extensión de PHP detuvo la subida del archivo.";
                break;
        }
        echo json_encode(["status" => "error", "message" => $errorMessage, "code" => $errorCode]);
    }
    exit; // Salir después de manejar la subida de imagen
}

function login($db, $request)
{
    $usuario = trim($request['usuario'] ?? '');
    $contrasena = trim($request['contrasena'] ?? '');

    // Validar campos vacíos
    if (empty($usuario) || empty($contrasena)) {
        echo json_encode([
            'success' => false,
            'type' => 'warning',
            'message' => 'Campos requeridos',
            'reason' => 'Por favor, completa todos los campos obligatorios'
        ]);
        exit;
    }

    try {
        // Buscar usuario usando DBHandler
        $result = $db->selectOne('admin', 'usuario', $usuario);

        if ($result['status'] === 'ok') {
            $admin = $result['data'];

            // Verificar contraseña
            if (password_verify($contrasena, $admin['password']) || $contrasena === $admin['password']) {
                // Login exitoso - iniciar sesión
                session_start();
                $_SESSION['usuario'] = $admin['usuario'];
                $_SESSION['rol'] = $admin['rol'];

                echo json_encode([
                    'success' => true,
                    'type' => 'success',
                    'message' => 'Login exitoso',
                    'reason' => 'Bienvenido ' . $admin['usuario'],
                    'redirect' => '../../public/catalogo.php'
                ]);
            } else {
                // Contraseña incorrecta
                echo json_encode([
                    'success' => false,
                    'type' => 'error',
                    'message' => 'Credenciales incorrectas',
                    'reason' => 'Usuario o contraseña incorrectos'
                ]);
            }
        } else {
            // Usuario no encontrado
            echo json_encode([
                'success' => false,
                'type' => 'error',
                'message' => 'Credenciales incorrectas',
                'reason' => 'Usuario o contraseña incorrectos'
            ]);
        }

    } catch (Exception $e) {
        // Error de conexión o base de datos
        echo json_encode([
            'success' => false,
            'type' => 'error',
            'message' => 'Error de conexión',
            'reason' => 'No se pudo conectar al servidor. Inténtalo más tarde.'
        ]);
    }
}

function create($db, $table, $data)
{
    $columns = array_keys($data);
    $values = array_values($data);
    $result = $db->insert($table, $columns, $values);
    echo json_encode($result);
}

function readAll($db, $table)
{
    $result = $db->selectAll($table);
    echo json_encode($result);
}

function read($db, $table, $data)
{
    $idColumn = array_keys($data)[0];
    $idValue = array_values($data)[0];
    $result = $db->selectOne($table, $idColumn, $idValue);
    echo json_encode($result);
}

function update($db, $table, $data)
{
    // Manejo especial para tablas con clave primaria compuesta
    if ($table === 'producto_categoria') {
        // Se espera que $data contenga producto_id y categoria_id_nueva (la nueva categoría)
        $producto_id = $data['producto_id'] ?? null;
        $categoria_id = $data['categoria_id'] ?? null;
        if (!$producto_id) {
            echo json_encode(["status" => "error", "message" => "Falta producto_id para actualizar producto_categoria."]);
            return;
        }
        // Si se quiere cambiar la categoría, se debe actualizar el campo categoria_id donde producto_id = ?
        $columns = ['categoria_id'];
        $values = [$categoria_id];
        $result = $db->update($table, $columns, $values, 'producto_id', $producto_id);
        echo json_encode($result);
        return;
    }

    $idColumn = 'id';
    $idValue = $data['id'];
    unset($data['id']);

    $columns = array_keys($data);
    $values = array_values($data);
    $result = $db->update($table, $columns, $values, $idColumn, $idValue);
    echo json_encode($result);
}

function delete($db, $table, $data)
{
    $idColumn = array_keys($data)[0];
    $idValue = array_values($data)[0];
    $result = $db->delete($table, $idColumn, $idValue);
    echo json_encode($result);
}

// --- Nuevas funciones para el dashboard ---
function getDashboardStats($db)
{
    $totalProductos = 0;
    $totalCategorias = 0;
    $res1 = $db->selectAll('producto');
    if ($res1['status'] === 'ok')
        $totalProductos = count($res1['data']);
    $res2 = $db->selectAll('categoria');
    if ($res2['status'] === 'ok')
        $totalCategorias = count($res2['data']);
    echo json_encode([
        'status' => 'ok',
        'totalProductos' => $totalProductos,
        'totalCategorias' => $totalCategorias
    ]);
}

function getLatestProducts($db)
{
    $conn = $db->getConnection();
    $result = $conn->query("SELECT id, nombre, descripcion, precio, imagen FROM producto ORDER BY id DESC LIMIT 5");
    $productos = [];
    if ($result) {
        $productos = $result->fetch_all(MYSQLI_ASSOC);
    }
    echo json_encode([
        'status' => 'ok',
        'data' => $productos
    ]);
}

function getCategoryProductSummary($db)
{
    $conn = $db->getConnection();
    $sql = "SELECT c.nombre AS categoria_nombre, COUNT(pc.producto_id) AS cantidad_productos FROM categoria c LEFT JOIN producto_categoria pc ON c.id = pc.categoria_id GROUP BY c.id, c.nombre ORDER BY cantidad_productos DESC";
    $result = $conn->query($sql);
    $resumen = [];
    if ($result) {
        $resumen = $result->fetch_all(MYSQLI_ASSOC);
    }
    echo json_encode([
        'status' => 'ok',
        'data' => $resumen
    ]);
}
