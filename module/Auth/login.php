<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">   
    <title>Iniciar Sesión - ElectroSound</title>    
    <link rel="stylesheet" href="../../Assets/CSS/login.css">
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

         document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('loginForm');
            const usuarioInput = document.getElementById('usuario');
            const passwordInput = document.getElementById('contrasena');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const usuario = usuarioInput.value.trim();
                const contrasena = passwordInput.value;

                if (!usuario || !contrasena) {
                    showWarningMessage('Campos requeridos', 'Por favor ingresa usuario y contraseña.');
                    return;
                }

                try {
                    const response = await fetch('../../config/controlador.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'login', usuario, contrasena })
                    });

                    if (!response.ok) {
                        throw new Error('Error de conexión al servidor');
                    }

                    const result = await response.json();

                    if (result.success === true) {
                        showSuccessMessage(result.message, result.reason);
                        // Pequeña pausa para mostrar el mensaje antes de redirigir
                        setTimeout(() => {
                            window.location.href = result.redirect;
                        }, 1500);
                    } else {
                        showErrorMessage(result.message , result.reason);
                    }
                } catch (err) {
                    showErrorMessage('Error de conexión', 'No se pudo conectar al servidor. Inténtalo más tarde.');
                }
            });
        });
    </script>
</body>
</html>