<?php
session_start();

// Verificar si el usuario está logueado
if (!isset($_SESSION['usuario'])) {
    header('Location: ../module/Auth/login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - ElectroSound</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #F8DB9D 0%, #D97904 100%);
            min-height: 100vh;
        }
        
        .header {
            background: #0D0D0D;
            color: #F8DB9D;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .welcome {
            font-size: 1.2rem;
        }
        
        .logout-btn {
            background: #F2A20C;
            color: #fff;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
        }
        
        .logout-btn:hover {
            background: #D97904;
        }
        
        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(13, 13, 13, 0.2);
            margin-bottom: 2rem;
        }
        
        .card h2 {
            color: #8C4C27;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="welcome">
            Bienvenido, <?php echo htmlspecialchars($_SESSION['usuario']); ?> 
            (Rol: <?php echo htmlspecialchars($_SESSION['rol']); ?>)
        </div>
        <a href="../module/Auth/logout.php" class="logout-btn">Cerrar Sesión</a>
    </div>
    
    <div class="container">
        <div class="card">
            <h2>Dashboard Principal</h2>
            <p>¡Bienvenido al sistema de gestión de ElectroSound!</p>
            <p>Has iniciado sesión exitosamente.</p>
        </div>
        
        <div class="card">
            <h2>Acciones Disponibles</h2>
            <ul>
                <li>Gestión de productos</li>
                <li>Gestión de categorías</li>
                <li>Administración de usuarios</li>
                <li>Reportes del sistema</li>
            </ul>
        </div>
    </div>
</body>
</html>