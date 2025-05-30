<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/dashboard.css">
    <title>Document</title>
</head>

<body>
    <?php
    require_once '../assets/template/admin.php'; // Ajusta la ruta si es necesario
    
    // Título de la página del dashboard
    $page_title = 'Dashboard';


    // Renderizar la página de administrador completa
    render_admin_page($page_title, function () {
        echo '<h2>Bienvenido al Panel de Administración</h2>';
        echo '<div class="dashboard-container">';
        echo '  <div id="dashboard-stats" class="dashboard-section"></div>';
        echo '  <div id="dashboard-latest-products" class="dashboard-section"></div>';
        echo '  <div id="dashboard-category-summary" class="dashboard-section"></div>';
        echo '</div>';
        echo '<script src="components/dashboard_stats.js"></script>';
        echo '<script src="components/dashboard_latest_products.js"></script>';
        echo '<script src="components/dashboard_category_summary.js"></script>';
    });
    ?>
</body>

</html>