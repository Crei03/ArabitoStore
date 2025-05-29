<?php

function render_header()
{
    echo '<header>
            <div class="logo">
                <a href="/index.php">
                    <img src="./images/logo.png" alt="ArabitoStore Logo">
                </a>
            </div>
            <nav>
                <a href="../public/catalogo.php">Catálogo</a>
                <a href="#">FAQ</a>
                <a href="#">Sobre nosotros</a>
            </nav>
        </header>';
}

function render_footer()
{
    echo '<footer>
            <div class="social-media">
                <a href="#" class="social-icon facebook">
                    <img src="./logos/facebook.svg" alt="Facebook">
                </a>
                <a href="#" class="social-icon instagram">
                    <img src="./logos/instagram.svg" alt="Instagram">
                </a>
                <a href="#" class="social-icon tiktok">
                    <img src="./logos/tiktok.svg" alt="TikTok">
                </a>
                <a href="#" class="social-icon whatsapp">
                    <img src="./logos/whatsapp.svg" alt="WhatsApp">
                </a>
            </div>
            <div class="store-logo">
                <img src="./images/logo.png" alt="ArabitoStore Logo">
            </div>
        </footer>';
}

function render_page($page_title, $content_callback)
{
    echo '<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>' . htmlspecialchars($page_title) . '</title>
        <link rel="stylesheet" href="../assets/template/public.css">
    </head>
    <body>';

    render_header();

    echo '<main>';
    if (is_callable($content_callback)) {
        call_user_func($content_callback);
    }
    echo '</main>';

    render_footer();

    echo '</body>
    </html>';
}

?>