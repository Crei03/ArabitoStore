// dashboard_category_summary.js

// Definición de rutas utilizadas en fetch
const CATEGORY_SUMMARY_API_URL = '../config/controlador.php';

document.addEventListener('DOMContentLoaded', () => {
    const summaryContainer = document.getElementById('dashboard-category-summary');
    if (!summaryContainer) return;

    // Limpiar el contenedor
    summaryContainer.innerHTML = '';

    // Crear título
    const h3 = document.createElement('h3');
    h3.textContent = 'Resumen de Productos por Categoría';
    summaryContainer.appendChild(h3);

    // Crear elemento de carga
    const loading = document.createElement('p');
    loading.textContent = 'Cargando resumen de categorías...';
    summaryContainer.appendChild(loading);

    fetch(CATEGORY_SUMMARY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getCategoryProductSummary' })
    })
        .then(res => res.json())
        .then(result => {
            loading.remove();
            if (result.status === 'ok' && Array.isArray(result.data) && result.data.length > 0) {
                const ul = document.createElement('ul');
                result.data.forEach(cat => {
                    const li = document.createElement('li');
                    const strong = document.createElement('strong');
                    strong.textContent = cat.categoria_nombre + ':';
                    li.appendChild(strong);
                    li.appendChild(document.createTextNode(' ' + cat.cantidad_productos + ' producto(s)'));
                    ul.appendChild(li);
                });
                summaryContainer.appendChild(ul);
            } else {
                const p = document.createElement('p');
                p.textContent = 'No hay datos de categorías para mostrar.';
                summaryContainer.appendChild(p);
            }
        })
        .catch(() => {
            loading.remove();
            const p = document.createElement('p');
            p.textContent = 'Error al cargar el resumen de categorías.';
            summaryContainer.appendChild(p);
        });
});