<?php

function render_admin_header($page_title)
{
    echo '<header class="main-header">
            <div class="header-title">
                <h1>' . htmlspecialchars($page_title) . '</h1>
            </div>
            <div class="user-profile">
                <a href="#">Admin User</a> 
            </div>
        </header>';
}

function render_admin_sidebar()
{
    // Determinar la página activa para el estilo del menú
    $current_page = basename($_SERVER['PHP_SELF']);

    $menu_items = [
        'dashboard.php' => 'Dashboard',
        'categorias.php' => 'Categorías',
        'productos.php' => 'Productos',
        '../public/index.php' => 'Salir' // Ejemplo de enlace de salida
    ];

    echo '<aside class="sidebar">
            <div class="logo">
                <a href="dashboard.php"> 
                    <img src="../../public/images/logo.png" alt="ArabitoStore Logo">
                </a>
            </div>
            <nav>
                <ul>';

    foreach ($menu_items as $url => $label) {
        $active_class = ($current_page == basename($url)) ? 'active' : '';
        echo '<li><a href="' . htmlspecialchars($url) . '" class="' . $active_class . '">' . htmlspecialchars($label) . '</a></li>';
    }

    echo '        </ul>
            </nav>
        </aside>';
}

function render_admin_footer()
{
    echo '<footer class="main-footer">
            <p>&copy; ' . date("Y") . ' ArabitoStore Admin Panel. Todos los derechos reservados.</p>
        </footer>';
}

function render_admin_page($page_title, $content_callback, $current_page_filename = '')
{
    echo '<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>' . htmlspecialchars($page_title) . ' - Admin</title>
        <link rel="stylesheet" href="../../assets/template/admin.css">
    </head>
    <body>';

    echo '<div class="admin-container">'; // Contenedor para sidebar y el resto

    render_admin_sidebar(); // Renderiza el sidebar primero

    echo '<div class="main-wrapper">'; // Wrapper para header y main content

    render_admin_header($page_title); // Renderiza el header

    echo '<main class="content">';
    if (is_callable($content_callback)) {
        call_user_func($content_callback);
    }
    echo '</main>';

    render_admin_footer(); // Renderiza el footer DESPUÉS del main content

    echo '</div>'; // Cierre de main-wrapper
    echo '</div>'; // Cierre de admin-container

    echo '</body>
    </html>';
}

?>