// dashboard_stats.js

// Definición de ruta utilizada en fetch
const DASHBOARD_STATS_API_URL = '../config/controlador.php';

document.addEventListener('DOMContentLoaded', () => {
    const statsContainer = document.getElementById('dashboard-stats');
    if (!statsContainer) return;

    // Limpiar el contenedor
    statsContainer.innerHTML = '';

    // Crear título
    const h3 = document.createElement('h3');
    h3.textContent = 'Estadísticas Generales';
    statsContainer.appendChild(h3);

    // Crear elemento de carga
    const loading = document.createElement('p');
    loading.textContent = 'Cargando estadísticas...';
    statsContainer.appendChild(loading);

    fetch(DASHBOARD_STATS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getDashboardStats' })
    })
        .then(res => res.json())
        .then(result => {
            loading.remove();
            if (result.status === 'ok') {
                const statsCards = document.createElement('div');
                statsCards.className = 'stats-cards';

                // Tarjeta: Total Productos
                const cardProductos = document.createElement('div');
                cardProductos.className = 'stat-card';
                const h4Prod = document.createElement('h4');
                h4Prod.textContent = 'Total Productos';
                const pProd = document.createElement('p');
                pProd.textContent = result.totalProductos;
                cardProductos.appendChild(h4Prod);
                cardProductos.appendChild(pProd);
                statsCards.appendChild(cardProductos);

                // Tarjeta: Total Categorías
                const cardCategorias = document.createElement('div');
                cardCategorias.className = 'stat-card';
                const h4Cat = document.createElement('h4');
                h4Cat.textContent = 'Total Categorías';
                const pCat = document.createElement('p');
                pCat.textContent = result.totalCategorias;
                cardCategorias.appendChild(h4Cat);
                cardCategorias.appendChild(pCat);
                statsCards.appendChild(cardCategorias);

                statsContainer.appendChild(statsCards);
            } else {
                const p = document.createElement('p');
                p.textContent = 'No se pudieron cargar las estadísticas.';
                statsContainer.appendChild(p);
            }
        })
        .catch(() => {
            loading.remove();
            const p = document.createElement('p');
            p.textContent = 'Error al cargar las estadísticas.';
            statsContainer.appendChild(p);
        });
});