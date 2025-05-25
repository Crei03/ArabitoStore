<?php
session_start();
require_once '../../config/config.php';

// Procesar peticiones AJAX
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
    header('Content-Type: application/json');
    
    $usuario = trim($_POST['usuario'] ?? '');
    $contrasena = trim($_POST['contrasena'] ?? '');
    
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
        // Conectar a la base de datos
        $conexion = conectarBD();
        
        // Buscar usuario en la tabla admin
        $stmt = $conexion->prepare("SELECT usuario, password, rol FROM admin WHERE usuario = ? LIMIT 1");
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        if ($resultado->num_rows === 1) {
            $admin = $resultado->fetch_assoc();
            
            // Verificar contraseña (asumiendo que están hasheadas con password_hash)
            if (password_verify($contrasena, $admin['password']) || $contrasena === $admin['password']) {
                // Login exitoso
                $_SESSION['usuario'] = $admin['usuario'];
                $_SESSION['rol'] = $admin['rol'];
                
                echo json_encode([
                    'success' => true,
                    'type' => 'success',
                    'message' => 'Login exitoso',
                    'reason' => 'Bienvenido ' . $admin['usuario'],
                    'redirect' => '../../public/dashboard.php'
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
        
        $stmt->close();
        $conexion->close();
        
    } catch (Exception $e) {
        // Error de conexión o base de datos
        echo json_encode([
            'success' => false,
            'type' => 'error',
            'message' => 'Error de conexión',
            'reason' => 'No se pudo conectar al servidor. Inténtalo más tarde.'
        ]);
    }
    
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    <title>Iniciar Sesión - ElectroSound</title>    <link rel="stylesheet" href="../../Assets/CSS/login.css">
    <link rel="stylesheet" href="../../Assets/CSS/target-messages.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <!-- Header con logo -->
            <div class="login-header">
                <img src="../../public/images/logo.png" alt="ElectroSound Logo" class="logo">
                <h1>¡Bienvenido!</h1>
            </div>
              <!-- Formulario de login -->
            <form id="loginForm" class="login-form" method="POST" action="">
                <div class="form-group">
                    <label for="usuario">Usuario:</label>
                    <input type="text" id="usuario" name="usuario" required>
                </div>
                  <div class="form-group">
                    <label for="contrasena">Contraseña:</label>
                    <div class="password-input-container">
                        <input type="password" id="contrasena" name="contrasena" required>
                        <span class="password-toggle" onclick="togglePassword()">
                            <i class="material-icons" id="password-icon">visibility_off</i>
                        </span>
                    </div>
                </div>
                
                <button type="submit" class="login-btn">Iniciar Sesión</button>
            </form>
            
            <!-- Enlaces adicionales -->
            <div class="login-footer">
                <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>        </div>
    </div>    <!-- Incluir componente de mensajes -->
    <script src="../../components/target-messages.js"></script>
    
    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('contrasena');
            const passwordIcon = document.getElementById('password-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordIcon.textContent = 'visibility';
            } else {
                passwordInput.type = 'password';
                passwordIcon.textContent = 'visibility_off';
            }
        }

        // Manejo del formulario con AJAX
        document.addEventListener('DOMContentLoaded', function() {
            const loginForm = document.getElementById('loginForm');
            const loginBtn = loginForm.querySelector('.login-btn');
            const originalBtnText = loginBtn.textContent;

            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Deshabilitar botón y mostrar estado de carga
                loginBtn.disabled = true;
                loginBtn.textContent = 'Iniciando...';
                
                // Obtener datos del formulario
                const formData = new FormData(loginForm);
                
                // Realizar petición AJAX
                fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }
                    return response.json();
                })
                .then(data => {
                    // Mostrar mensaje según el tipo de respuesta
                    if (data.type === 'success') {
                        showSuccessMessage(data.message, data.reason);
                        
                        // Redirigir después de mostrar el mensaje de éxito
                        if (data.redirect) {
                            setTimeout(() => {
                                window.location.href = data.redirect;
                            }, 1500);
                        }
                    } else if (data.type === 'warning') {
                        showWarningMessage(data.message, data.reason);
                    } else if (data.type === 'error') {
                        showErrorMessage(data.message, data.reason);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showErrorMessage('Error de conexión', 'No se pudo procesar la solicitud. Inténtalo más tarde.');
                })
                .finally(() => {
                    // Rehabilitar botón
                    loginBtn.disabled = false;
                    loginBtn.textContent = originalBtnText;
                });
            });
        });
    </script>
</body>
</html>