
/**
 * Crea una tarjeta HTML para un artículo.
 * @param {object} articulo - Objeto con los datos del artículo (nombre, precio, imagen).
 * @returns {HTMLElement} El elemento de la tarjeta del artículo.
 */
function crearTarjetaArticulo(articulo) {
    const card = document.createElement('div');
    card.classList.add('article-card');

    const img = document.createElement('img');
    // Asume que la columna 'imagen' en la tabla 'producto' contiene la ruta de la imagen.
    // Ajusta la ruta base si es necesario, ej: 'public/images/productos/'
    img.src = articulo.imagen; // Placeholder si no hay imagen
    img.alt = articulo.nombre;

    const name = document.createElement('h3');
    name.textContent = articulo.nombre;

    const price = document.createElement('p');
    price.classList.add('price');
    // Formatear el precio si es necesario, ej: a moneda local
    price.textContent = `$${parseFloat(articulo.precio).toFixed(2)}`;

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(price);

    return card;
}

/**
 * Crea una sección HTML para una categoría, incluyendo su título y las tarjetas de sus artículos.
 * @param {object} categoria - Objeto de la categoría (debe tener nombre).
 * @param {Array<object>} articulosDeCategoria - Array de objetos de artículo pertenecientes a esta categoría.
 * @returns {HTMLElement} El elemento de la sección de la categoría.
 */
function crearSeccionCategoria(categoria, articulosDeCategoria) {
    const section = document.createElement('div');
    section.classList.add('category-section');

    const title = document.createElement('h2');
    title.textContent = categoria.nombre; // Asume que la columna es 'nombre'

    const articlesContainer = document.createElement('div');
    articlesContainer.classList.add('articles-container');

    if (articulosDeCategoria.length === 0) {
        const noArticlesMessage = document.createElement('p');
        noArticlesMessage.textContent = 'No hay artículos disponibles en esta categoría por el momento.';
        articlesContainer.appendChild(noArticlesMessage);
    } else {
        articulosDeCategoria.forEach(articulo => {
            const articleCard = crearTarjetaArticulo(articulo);
            articlesContainer.appendChild(articleCard);
        });
    }

    section.appendChild(title);
    section.appendChild(articlesContainer);

    return section;
}

/**
 * Carga datos de categorías, productos y sus relaciones, luego los muestra en la página.
 * @param {string} selectorDestino - El selector CSS del elemento donde se mostrarán las secciones de artículos.
 */
async function cargarYMostrarArticulos(selectorDestino) {
    const destino = document.querySelector(selectorDestino);
    if (!destino) {
        console.error(`Error: No se encontró el elemento destino con el selector "${selectorDestino}".`);
        return;
    }
    destino.innerHTML = '<p>Cargando artículos...</p>'; // Mensaje de carga inicial

    const apiURL = '../config/controlador.php';

    try {
        const [categoriasRes, productosRes, prodCatRes] = await Promise.all([
            fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'readAll', table: 'categoria' })
            }),
            fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'readAll', table: 'producto' })
            }),
            fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'readAll', table: 'producto_categoria' })
            })
        ]);

        if (!categoriasRes.ok || !productosRes.ok || !prodCatRes.ok) {
            throw new Error('Error al obtener datos del servidor.');
        }

        const categoriasData = await categoriasRes.json();
        const productosData = await productosRes.json();
        const prodCatData = await prodCatRes.json();

        if (categoriasData.status !== 'ok' || productosData.status !== 'ok' || prodCatData.status !== 'ok') {
            console.error('Error en los datos recibidos:', categoriasData, productosData, prodCatData);
            destino.innerHTML = '<p>Error al procesar los datos del servidor.</p>';
            return;
        }

        const todasCategorias = categoriasData.data || [];
        const todosProductos = productosData.data || [];
        const relacionesProdCat = prodCatData.data || [];

        if (todasCategorias.length === 0) {
            destino.innerHTML = '<p>No hay categorías definidas.</p>';
            return;
        }

        // Crear un mapa de productos para fácil acceso por ID
        // Asume que la PK de producto es 'id' o 'producto_id'. Ajusta si es diferente.
        const productosMap = todosProductos.reduce((map, prod) => {
            map[prod.id_producto || prod.id] = prod; // Ajusta 'id_producto' o 'id' según tu tabla producto
            return map;
        }, {});

        destino.innerHTML = ''; // Limpiar mensaje de carga
        let seccionesMostradas = 0;

        todasCategorias.forEach(categoria => {
            // Asume que la PK de categoria es 'id_categoria' o 'id'. Ajusta si es diferente.
            const categoriaId = categoria.id_categoria || categoria.id;

            const idsProductosDeCategoria = relacionesProdCat
                .filter(rel => rel.categoria_id === categoriaId) // Ajusta 'categoria_id' si es diferente en producto_categoria
                .map(rel => rel.producto_id); // Ajusta 'producto_id' si es diferente en producto_categoria

            const articulosDeCategoria = idsProductosDeCategoria
                .map(prodId => productosMap[prodId])
                .filter(prod => prod); // Filtrar por si algún producto no se encontró

            // Solo mostrar la sección si hay artículos en la categoría
            if (articulosDeCategoria.length > 0) {
                const seccionElemento = crearSeccionCategoria(categoria, articulosDeCategoria);
                destino.appendChild(seccionElemento);
                seccionesMostradas++;
            }
        });

        if (seccionesMostradas === 0) {
            destino.innerHTML = '<p>No hay artículos para mostrar en ninguna categoría.</p>';
        }

    } catch (error) {
        console.error('Error al cargar y mostrar artículos:', error);
        destino.innerHTML = '<p>Ocurrió un error al cargar los artículos. Intenta de nuevo más tarde.</p>';
    }
}

// Ejecutar cuando el DOM esté completamente cargado.
// Deberás tener un div con id="contenedor-articulos-por-categoria" (o el que elijas) en tu HTML.
document.addEventListener('DOMContentLoaded', () => {
    cargarYMostrarArticulos('#contenedor-articulos-por-categoria');
});
