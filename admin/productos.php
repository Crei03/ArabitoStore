<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="../assets/CSS/target-messages.css">
    <link rel="stylesheet" href="../assets/CSS/articulos.css">

</head>

<body>

    <?php
    require_once '../assets/template/admin.php';
    render_admin_page('Gestión de Productos', function () {
        echo '<div id="add-product-form-container"></div>';
        echo '<div id="products-table-container"></div>';
    });

    ?>


    <script src="../components/target-messages.js"></script>
    <script src="./components/articulo.js"></script>
</body>

</html>