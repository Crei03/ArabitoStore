<?php
// api.php - Controlador dinámico para operaciones CRUD

require_once(__DIR__ . "/config.php");
require_once(__DIR__ . "/handler.php");
header("Content-Type: application/json");

// Usar la función conectarBD definida en config.php
$conn = conectarBD();

$db = new DBHandler($conn);
$input = file_get_contents("php://input");
$request = json_decode($input, true);

// Validaciones
$action = $request['action'] ?? '';
$table  = $request['table'] ?? '';
$data   = $request['data']  ?? [];

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
    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Acción no válida"]);
        break;
}

function login($db, $request) {
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

function create($db, $table, $data) {
    $columns = array_keys($data);
    $values = array_values($data);
    $result = $db->insert($table, $columns, $values);
    echo json_encode($result);
}

function readAll($db, $table) {
    $result = $db->selectAll($table);
    echo json_encode($result);
}

function read($db, $table, $data) {
    $idColumn = array_keys($data)[0];
    $idValue = array_values($data)[0];
    $result = $db->selectOne($table, $idColumn, $idValue);
    echo json_encode($result);
}

function update($db, $table, $data) {
    $idColumn = 'id';
    $idValue = $data['id'];
    unset($data['id']);
    
    $columns = array_keys($data);
    $values = array_values($data);
    $result = $db->update($table, $columns, $values, $idColumn, $idValue);
    echo json_encode($result);
}

function delete($db, $table, $data) {
    $idColumn = array_keys($data)[0];
    $idValue = array_values($data)[0];
    $result = $db->delete($table, $idColumn, $idValue);
    echo json_encode($result);
}
