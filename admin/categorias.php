<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="../assets/CSS/categoria.css">
    <link rel="stylesheet" href="../assets/CSS/target-messages.css">

</head>

<body>

    <?php
    require_once '../assets/template/admin.php';
    render_admin_page('Gestión de Categorías', function () {
        echo '<div id="add-category-form"></div>';
        echo '<div id="categories-table"></div>';
    });

    ?>


    <script src="./components/categoria.js"></script>
    <script src="../components/target-messages.js"></script>
</body>

</html>