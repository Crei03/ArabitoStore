<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="../assets/css/categoria.css">
    <link rel="stylesheet" href="../assets/CSS/articulos.css">
</head>

<body>

    <?php
    require_once __DIR__ . '/../assets/template/public.php';

    // Render the page content
    render_page('Inicio', function () {

        echo '<div id="contenedor-articulos-por-categoria"> </div>';



    });
    ?>


    <script src="../components/articulos.js"></script>
</body>

</html>