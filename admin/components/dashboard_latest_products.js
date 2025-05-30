// dashboard_latest_products.js

// Definición de rutas utilizadas en fetch y para imágenes de producto
const LATEST_PRODUCTS_API_URL = '../config/controlador.php';
const PRODUCT_IMG_PATH = '../public/images/producto/';

document.addEventListener('DOMContentLoaded', () => {
    const latestContainer = document.getElementById('dashboard-latest-products');
    if (!latestContainer) return;

    // Limpiar el contenedor
    latestContainer.innerHTML = '';

    // Crear título
    const h3 = document.createElement('h3');
    h3.textContent = 'Últimos Productos Agregados';
    latestContainer.appendChild(h3);

    // Crear elemento de carga
    const loading = document.createElement('p');
    loading.textContent = 'Cargando últimos productos...';
    latestContainer.appendChild(loading);

    fetch(LATEST_PRODUCTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getLatestProducts' })
    })
        .then(res => res.json())
        .then(result => {
            loading.remove();
            if (result.status === 'ok' && Array.isArray(result.data) && result.data.length > 0) {
                const ul = document.createElement('ul');
                result.data.forEach(producto => {
                    const li = document.createElement('li');
                    const strong = document.createElement('strong');
                    strong.textContent = producto.nombre;
                    li.appendChild(strong);
                    li.appendChild(document.createTextNode(` (ID: ${producto.id}) - Precio: ${producto.precio}`));
                    if (producto.imagen) {
                        const img = document.createElement('img');
                        if (producto.imagen.startsWith('https://')) {
                            img.src = producto.imagen;
                        } else {
                            img.src = PRODUCT_IMG_PATH + producto.imagen;
                        }
                        img.alt = producto.nombre;
                        img.style.width = '50px';
                        img.style.height = 'auto';
                        img.style.verticalAlign = 'middle';
                        img.style.marginLeft = '10px';
                        li.appendChild(img);
                    }
                    ul.appendChild(li);
                });
                latestContainer.appendChild(ul);
            } else {
                const p = document.createElement('p');
                p.textContent = 'No hay productos recientes para mostrar.';
                latestContainer.appendChild(p);
            }
        })
        .catch(() => {
            loading.remove();
            const p = document.createElement('p');
            p.textContent = 'Error al cargar los productos.';
            latestContainer.appendChild(p);
        });
});