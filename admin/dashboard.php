<?php
require_once '../assets/template/admin.php'; // Ajusta la ruta si es necesario

// Título de la página del dashboard
$page_title = 'Dashboard';

// Función de callback para el contenido específico del dashboard
function render_dashboard_content() {
    echo '<h2>Bienvenido al Panel de Administración</h2>';
    echo '<p>Selecciona una opción del menú lateral para comenzar.</p>';
    // Aquí puedes agregar más contenido específico del dashboard
}

// Renderizar la página de administrador completa
render_admin_page($page_title, 'render_dashboard_content');
?>