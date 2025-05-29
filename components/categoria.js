// filepath: c:\xampp\htdocs\DS6_II\web\components\categoria.js

/**
 * Crea un elemento HTML para mostrar una categoría.
 * @param {object} datosCategoria - Objeto con los datos de la categoría.
 * @param {string} datosCategoria.nombre - Nombre de la categoría.
 * @param {string} datosCategoria.imagen - Ruta o URL de la imagen de la categoría.
 * @returns {HTMLElement} El elemento de la tarjeta de categoría.
 */
function crearElementoCategoria(datosCategoria) {
    const card = document.createElement('div');
    card.classList.add('category-card');

    const img = document.createElement('img');
    // Asumimos que tienes una columna 'imagen' en tu tabla 'categoria'
    // y que 'controlador.php' la devuelve.
    // Si la ruta de la imagen necesita un prefijo (ej. 'public/images/'), ajústalo aquí.
    img.src = 'images/categoria/' + datosCategoria.imagen; // Usa un placeholder si no hay imagen
    img.alt = datosCategoria.nombre;

    const name = document.createElement('p');
    name.classList.add('category-name');
    name.textContent = datosCategoria.nombre;

    card.appendChild(img);
    card.appendChild(name);

    return card;
}

/**
 * Obtiene las categorías del servidor y las muestra en la página.
 * @param {string} selectorContenedor - El selector CSS del elemento donde se mostrarán las categorías.
 */
async function mostrarCategoriasEnPagina(selectorContenedor) {
    const contenedor = document.querySelector(selectorContenedor);
    if (!contenedor) {
        console.error(`Error: No se encontró el contenedor con el selector "${selectorContenedor}".`);
        return;
    }

    // Limpiar el contenedor por si acaso
    contenedor.innerHTML = '';
    // Aplicar la clase para el layout flex (opcional)
    contenedor.classList.add('categories-container');


    try {
        const response = await fetch('../config/controlador.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'readAll',
                table: 'categoria' // Asegúrate de que tu tabla se llame así
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'ok' && result.data) {
            if (result.data.length === 0) {
                contenedor.textContent = 'No hay categorías para mostrar.';
                return;
            }
            result.data.forEach(categoria => {
                // Asumimos que la tabla 'categoria' tiene columnas 'nombre' e 'imagen'
                // Ajusta los nombres de las propiedades si son diferentes en tu BD.
                const elementoCategoria = crearElementoCategoria({
                    nombre: categoria.nombre, // Ajusta si el nombre de la columna es diferente
                    imagen: categoria.img_link // Ajusta si el nombre de la columna es diferente
                });
                contenedor.appendChild(elementoCategoria);
            });
        } else {
            console.error('Error al obtener las categorías:', result.message);
            contenedor.textContent = 'Error al cargar las categorías.';
        }
    } catch (error) {
        console.error('Error en la solicitud fetch:', error);
        contenedor.textContent = 'No se pudo conectar al servidor para cargar las categorías.';
    }
}

// Ejecutar cuando el DOM esté completamente cargado.
// Deberás tener un div con id="contenedor-categorias" (o el que elijas) en tu HTML.
document.addEventListener('DOMContentLoaded', () => {
    mostrarCategoriasEnPagina('#contenedor-categorias');
});


