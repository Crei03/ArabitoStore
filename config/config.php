<?php
/**
 * Configuración general de la aplicación
 */

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'ds6');
define('DB_PASS', '123');
define('DB_NAME', 'ds6_ii');

function conectarBD() {
    $conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Verificar la conexión
    if ($conexion->connect_error) {
        die("Error de conexión a la base de datos: " . $conexion->connect_error);
    }
    
    return $conexion;
}

?>