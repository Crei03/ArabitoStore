// filepath: c:\xampp\htdocs\DS6_II\web\admin\components\articulo.js
// Definición de rutas utilizadas en fetch y para imágenes de producto
const PRODUCTO_API_URL = '../config/controlador.php';
const PRODUCTO_IMG_PATH = '../public/images/producto/';
const CATEGORIA_API_URL = '../config/controlador.php'; // Para cargar categorías

// Función para cargar categorías en el select del formulario de productos
async function loadCategoriesIntoSelect(selectElementId, selectedCategoryId = null) {
    try {
        const response = await fetch(CATEGORIA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'readAll', table: 'categoria' })
        });
        const result = await response.json();
        if (result.status === 'ok' && Array.isArray(result.data)) {
            const select = document.getElementById(selectElementId);
            if (select) {
                select.innerHTML = '<option value="">Seleccione una categoría</option>'; // Opción por defecto
                result.data.forEach(categoria => {
                    const option = document.createElement('option');
                    option.value = categoria.id;
                    option.textContent = categoria.nombre;
                    if (selectedCategoryId && categoria.id.toString() === selectedCategoryId.toString()) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });
            }
        } else {
            console.error('Error al cargar categorías:', result.message);
        }
    } catch (error) {
        console.error('Error en fetch al cargar categorías:', error);
    }
}

function renderAddProductForm() {
    const formContainer = document.getElementById('add-product-form-container'); // Asumiendo que tendrás un div con este ID en productos.php
    if (!formContainer) {
        console.error('El contenedor del formulario de productos no fue encontrado.');
        return;
    }
    formContainer.innerHTML = ''; // Limpiar por si acaso

    const container = document.createElement('div');
    container.className = 'add-product-form-container'; // Similar a add-category-form-container

    const h1 = document.createElement('h1');
    h1.textContent = 'Agregar Producto';
    container.appendChild(h1);

    const form = document.createElement('form');
    form.id = 'formAddProduct';
    form.className = 'add-product-form'; // Similar a add-category-form
    form.enctype = 'multipart/form-data';

    const columns = document.createElement('div');
    columns.className = 'form-columns'; // Reutilizando la clase de categoria.css si es aplicable

    // Columna izquierda (previsualización de imagen)
    const colLeft = document.createElement('div');
    colLeft.className = 'form-column-left';
    const previewContainer = document.createElement('div');
    previewContainer.className = 'image-preview-container'; // Para coherencia visual con CSS
    previewContainer.id = 'imagePreviewContainerProduct';
    const imgPreview = document.createElement('img');
    imgPreview.className = 'image-preview'; // Para coherencia visual con CSS
    imgPreview.id = 'imagePreviewProduct';
    previewContainer.appendChild(imgPreview);

    const labelFile = document.createElement('label');
    labelFile.htmlFor = 'imageUploadProduct';
    labelFile.textContent = 'Seleccionar Imagen:';
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.name = 'imagen_file';
    inputFile.id = 'imageUploadProduct';
    inputFile.accept = 'image/*';
    inputFile.required = true;
    previewContainer.appendChild(labelFile);
    previewContainer.appendChild(inputFile);
    colLeft.appendChild(previewContainer);

    // Columna derecha (inputs)
    const colRight = document.createElement('div');
    colRight.className = 'form-column-right'; // Reutilizando

    // Grupo: Nombre del Producto
    const groupNombre = document.createElement('div');
    groupNombre.className = 'form-group'; // Reutilizando
    const labelNombre = document.createElement('label');
    labelNombre.htmlFor = 'nombre_producto';
    labelNombre.textContent = 'Nombre del Producto:';
    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.name = 'nombre_producto';
    inputNombre.id = 'nombre_producto';
    inputNombre.required = true;
    groupNombre.appendChild(labelNombre);
    groupNombre.appendChild(inputNombre);
    colRight.appendChild(groupNombre);

    // Grupo: Descripción del Producto
    const groupDescripcion = document.createElement('div');
    groupDescripcion.className = 'form-group';
    const labelDescripcion = document.createElement('label');
    labelDescripcion.htmlFor = 'descripcion_producto';
    labelDescripcion.textContent = 'Descripción (Opcional):';
    const inputDescripcion = document.createElement('textarea');
    inputDescripcion.name = 'descripcion_producto';
    inputDescripcion.id = 'descripcion_producto';
    groupDescripcion.appendChild(labelDescripcion);
    groupDescripcion.appendChild(inputDescripcion);
    colRight.appendChild(groupDescripcion);

    // Grupo: Precio del Producto
    const groupPrecio = document.createElement('div');
    groupPrecio.className = 'form-group';
    const labelPrecio = document.createElement('label');
    labelPrecio.htmlFor = 'precio_producto';
    labelPrecio.textContent = 'Precio del Producto:';
    const inputPrecio = document.createElement('input');
    inputPrecio.type = 'text'; // O 'number' con validación adecuada
    inputPrecio.name = 'precio_producto';
    inputPrecio.id = 'precio_producto';
    inputPrecio.required = true;
    groupPrecio.appendChild(labelPrecio);
    groupPrecio.appendChild(inputPrecio);
    colRight.appendChild(groupPrecio);

    // Grupo: Categoría del Producto
    const groupCategoria = document.createElement('div');
    groupCategoria.className = 'form-group';
    const labelCategoria = document.createElement('label');
    labelCategoria.htmlFor = 'categoria_id_producto';
    labelCategoria.textContent = 'Categoría del Producto:';
    const selectCategoria = document.createElement('select');
    selectCategoria.name = 'categoria_id'; // Nombre del campo para el backend
    selectCategoria.id = 'categoria_id_producto';
    selectCategoria.required = true;
    // Las opciones se cargarán dinámicamente
    groupCategoria.appendChild(labelCategoria);
    groupCategoria.appendChild(selectCategoria);
    colRight.appendChild(groupCategoria);

    // Grupo: Nombre imagen personalizado
    const groupImgName = document.createElement('div');
    groupImgName.className = 'form-group';
    const labelImgName = document.createElement('label');
    labelImgName.htmlFor = 'nombre_imagen_personalizado_producto';
    labelImgName.textContent = 'Nombre del Archivo de Imagen (con extensión, ej: mi_producto.png):';
    const inputImgName = document.createElement('input');
    inputImgName.type = 'text';
    inputImgName.name = 'nombre_imagen_personalizado_producto';
    inputImgName.id = 'nombre_imagen_personalizado_producto';
    inputImgName.placeholder = 'Ej: nuevo_producto.png';
    inputImgName.required = true;
    groupImgName.appendChild(labelImgName);
    groupImgName.appendChild(inputImgName);
    colRight.appendChild(groupImgName);

    columns.appendChild(colLeft);
    columns.appendChild(colRight);
    form.appendChild(columns);

    // Botones
    const formButtons = document.createElement('div');
    formButtons.className = 'form-buttons';
    const btnSave = document.createElement('button');
    btnSave.type = 'submit';
    btnSave.className = 'btn btn-save';
    btnSave.textContent = 'Guardar Producto';
    const btnCancel = document.createElement('button');
    btnCancel.type = 'button';
    btnCancel.className = 'btn btn-cancel';
    btnCancel.textContent = 'Cancelar';
    btnCancel.onclick = () => {
        form.reset();
        document.getElementById('imagePreviewProduct').src = '';
        // Opcional: restaurar placeholder visual si se usa
    };
    formButtons.appendChild(btnSave);
    formButtons.appendChild(btnCancel);
    form.appendChild(formButtons);

    // Div para mensajes de feedback
    const messageDiv = document.createElement('div');
    messageDiv.id = 'product-feedback-message'; // ID único
    messageDiv.className = 'feedback-message'; // Clase genérica para estilizar
    form.appendChild(messageDiv);


    container.appendChild(form);
    formContainer.appendChild(container);

    // Cargar categorías en el select
    loadCategoriesIntoSelect('categoria_id_producto');

    // Previsualización de imagen y reset
    inputFile.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';
                labelFile.style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });
    btnCancel.addEventListener('click', function () {
        imgPreview.src = '';
        imgPreview.style.display = 'none';
        labelFile.style.display = 'block';
    });

    // Manejo del envío del formulario
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const feedbackMessageDiv = document.getElementById('product-feedback-message');
        feedbackMessageDiv.textContent = '';
        feedbackMessageDiv.className = 'feedback-message';

        // Obtener valores de los campos
        const nombre = inputNombre.value.trim();
        const descripcion = inputDescripcion.value.trim();
        const precio = inputPrecio.value.trim();
        const categoriaId = selectCategoria.value;
        const customImageName = inputImgName.value.trim();
        const imageFile = inputFile.files[0];

        // Validación básica
        if (!nombre || !precio || !categoriaId || !customImageName || !imageFile) {
            showWarningMessage('Todos los campos son obligatorios, incluyendo la imagen y la categoría.');
            return;
        }

        // Paso 1: Enviar datos del producto (sin imagen ni categoría) en JSON
        const productData = {
            action: 'create',
            table: 'producto',
            data: {
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                imagen: customImageName // Guardar el nombre personalizado en la BD
            }
        };

        showWaitingMessage('Guardando producto...', '');
        try {
            const responseCreate = await fetch(PRODUCTO_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            const resultCreate = await responseCreate.json();
            // Usar resultCreate.data.id en lugar de resultCreate.insertedId
            if (resultCreate.status === 'ok' && resultCreate.data && resultCreate.data.id) {
                showSuccessMessage('Producto guardado. Subiendo imagen...');
                // Paso 2: Subir la imagen
                const formData = new FormData();
                formData.append('action', 'uploadImage');
                formData.append('table', 'producto');
                formData.append('imagen_file', imageFile, customImageName); // Usar el nombre correcto que espera el backend
                formData.append('nombre_imagen_personalizado', customImageName);

                try {
                    const responseUpload = await fetch(PRODUCTO_API_URL, {
                        method: 'POST',
                        body: formData
                    });
                    const resultUpload = await responseUpload.json();
                    if (resultUpload.status === 'ok') {
                        // Paso 3: Relacionar producto con categoría
                        const productoCategoriaData = {
                            action: 'create',
                            table: 'producto_categoria',
                            data: {
                                // Usar resultCreate.data.id aquí también
                                producto_id: resultCreate.data.id.toString(),
                                categoria_id: categoriaId.toString()
                            }
                        };
                        // Usar await para asegurar la inserción antes de continuar
                        try {
                            const responseRelacion = await fetch(PRODUCTO_API_URL, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(productoCategoriaData)
                            });
                            const resultRelacion = await responseRelacion.json();
                            if (resultRelacion.status === 'ok') {
                                showSuccessMessage('Producto agregado exitosamente.');
                                form.reset();
                                imgPreview.src = '';
                                if (typeof renderProductsTable === 'function') {
                                    await renderProductsTable();
                                }
                            } else {
                                showErrorMessage('Producto e imagen guardados, pero no se pudo asociar la categoría.');
                            }
                        } catch (error) {
                            showErrorMessage('Producto e imagen guardados, pero error de conexión al asociar la categoría.');
                        }
                    } else {
                        showErrorMessage('Producto guardado, pero la imagen no pudo ser subida.');
                    }
                } catch (error) {
                    showErrorMessage('Producto guardado, pero error de conexión al subir la imagen.');
                }
            } else {
                showErrorMessage(resultCreate.message || 'Error al guardar el producto.');
            }
        } catch (error) {
            showErrorMessage('Error de conexión al guardar el producto.');
        }
    });
}

// Variable global para almacenar las categorías y evitar múltiples fetch innecesarios
let allCategoriesMap = new Map();

async function fetchAllCategories() {
    if (allCategoriesMap.size > 0) return allCategoriesMap; // Devolver cache si ya está poblado
    try {
        const response = await fetch(CATEGORIA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'readAll', table: 'categoria' })
        });
        const result = await response.json();
        if (result.status === 'ok' && Array.isArray(result.data)) {
            result.data.forEach(cat => allCategoriesMap.set(cat.id.toString(), cat.nombre));
            return allCategoriesMap;
        } else {
            console.error('Error al cargar todas las categorías:', result.message);
            return allCategoriesMap; // Devolver mapa vacío o parcialmente lleno en caso de error
        }
    } catch (error) {
        console.error('Error en fetch al cargar todas las categorías:', error);
        return allCategoriesMap;
    }
}

async function renderProductsTable() {
    const tableContainer = document.getElementById('products-table-container');
    if (!tableContainer) {
        console.error('El contenedor de la tabla de productos no fue encontrado.');
        return;
    }
    tableContainer.innerHTML = '<h2>Lista de Productos</h2>'; // Título para la sección

    // Asegurar que las categorías estén cargadas antes de renderizar productos
    await fetchAllCategories();

    try {
        const response = await fetch(PRODUCTO_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'readAll', table: 'producto' })
        });
        const result = await response.json();

        if (result.status === 'ok' && Array.isArray(result.data)) {
            if (result.data.length === 0) {
                tableContainer.innerHTML += '<p>No hay productos para mostrar.</p>';
                return;
            }

            const table = document.createElement('table');
            table.className = 'products-table'; // Aplicar estilos CSS si es necesario (articulos.css)

            // Encabezados de la tabla
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = ['Imagen', 'Nombre', 'Descripción', 'Precio', 'Categoría', 'Acciones'];
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Cuerpo de la tabla
            const tbody = document.createElement('tbody');
            for (const product of result.data) {

                let productCategoryName = '-';


                // Si el backend en `readAll` para `producto` devuelve un campo como `categoria_nombre` (del JOIN)
                if (product.categoria_nombre) { // Asumiendo que el backend hace el JOIN
                    productCategoryName = product.categoria_nombre;
                } else if (product.categoria_id) { // Si devuelve el ID de la categoría
                    if (allCategoriesMap.has(product.categoria_id.toString())) {
                        productCategoryName = allCategoriesMap.get(product.categoria_id.toString());
                    } else {
                        // Podríamos intentar cargarla individualmente, pero es ineficiente.
                        console.warn(`Categoría ID ${product.categoria_id} no encontrada en el mapa.`);
                    }
                }

                const row = document.createElement('tr');

                const cellImage = document.createElement('td');
                const img = document.createElement('img');

                if (product.imagen && (product.imagen.startsWith('https://'))) {
                    img.src = product.imagen;
                } else if (product.imagen) {
                    img.src = `${PRODUCTO_IMG_PATH}${product.imagen}`;
                }
                img.alt = product.nombre;
                img.style.width = '50px'; img.style.height = '50px'; img.style.objectFit = 'cover';
                cellImage.appendChild(img);
                row.appendChild(cellImage);

                const cellNombre = document.createElement('td');
                cellNombre.textContent = product.nombre;
                row.appendChild(cellNombre);

                const cellDescripcion = document.createElement('td');
                cellDescripcion.textContent = product.descripcion || '-';
                cellDescripcion.className = 'description-cell'; // Para aplicar el truncado CSS
                if (cellDescripcion.textContent.length > 50) {
                    cellDescripcion.textContent = cellDescripcion.textContent.substring(0, 47) + '...';
                }
                row.appendChild(cellDescripcion);

                const cellPrecio = document.createElement('td');
                cellPrecio.textContent = product.precio ? `$${parseFloat(product.precio).toFixed(2)}` : '-';
                row.appendChild(cellPrecio);

                const cellCategoria = document.createElement('td');
                cellCategoria.textContent = productCategoryName;
                row.appendChild(cellCategoria);

                const cellAcciones = document.createElement('td');
                const btnEdit = document.createElement('button');
                btnEdit.innerHTML = '<i class="material-icons">edit</i>';
                btnEdit.className = 'btn btn-edit btn-edit-producto';
                btnEdit.onclick = () => openEditProductModal(product);
                cellAcciones.appendChild(btnEdit);

                const btnDelete = document.createElement('button');
                btnDelete.innerHTML = '<i class="material-icons">delete</i>';
                btnDelete.className = 'btn btn-delete btn-delete-producto';
                btnDelete.onclick = () => deleteProduct(product.id, product.nombre, product.imagen);
                cellAcciones.appendChild(btnDelete);
                row.appendChild(cellAcciones);

                tbody.appendChild(row);
            }
            table.appendChild(tbody);
            tableContainer.appendChild(table);
        } else {
            tableContainer.innerHTML += `<p>Error al cargar productos: ${result.message || 'Respuesta no exitosa.'}</p>`;
        }
    } catch (error) {
        console.error('Error en fetch al cargar productos:', error);
        tableContainer.innerHTML += '<p>Error de conexión al cargar productos.</p>';
    }
}

// --- Implementaciones futuras (similares a categoria.js) ---

// function openEditProductModal(producto) { /* ... similar a openEditCategoryModal ... */ }

// function deleteProduct(productId, productName, productImageName) { /* ... */ }


document.addEventListener('DOMContentLoaded', () => {
    // Cargar categorías una vez al inicio para tenerlas disponibles
    fetchAllCategories();

    if (document.getElementById('add-product-form-container')) {
        renderAddProductForm();
    }
    if (document.getElementById('products-table-container')) {
        renderProductsTable();
    }
});

// Obtener la categoría asociada a un producto
async function getCategoriaIdByProductoId(productoId) {
    try {
        const response = await fetch(PRODUCTO_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'read',
                table: 'producto_categoria',
                data: { producto_id: productoId }
            })
        });
        const result = await response.json();
        if (result.status === 'ok' && result.data && result.data.categoria_id) {
            return result.data.categoria_id;
        }
    } catch (error) {
        console.error('Error al obtener la categoría del producto:', error);
    }
    return null;
}

async function openEditProductModal(producto) {
    // Eliminar cualquier modal previa
    const existingModal = document.getElementById('editProductModal');
    if (existingModal) existingModal.remove();

    // Obtener la categoría actual del producto
    let categoriaIdActual = await getCategoriaIdByProductoId(producto.id);

    // Backdrop principal
    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'editProductModal';
    modalBackdrop.className = 'modal-edit-product-backdrop active';

    // Contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-edit-product-content';

    // Header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-edit-header';
    const h2 = document.createElement('h2');
    h2.textContent = 'Editar Producto';
    const closeModalSpan = document.createElement('span');
    closeModalSpan.className = 'close-modal-edit';
    closeModalSpan.innerHTML = '&times;';
    closeModalSpan.onclick = () => modalBackdrop.remove();
    modalHeader.appendChild(h2);
    modalHeader.appendChild(closeModalSpan);
    modalContent.appendChild(modalHeader);

    // Formulario
    const form = document.createElement('form');
    form.id = 'formEditProduct';
    form.className = 'edit-product-form';
    form.enctype = 'multipart/form-data';

    // Input oculto para ID
    const inputId = document.createElement('input');
    inputId.type = 'hidden';
    inputId.name = 'id_producto_edit';
    inputId.id = 'id_producto_edit';
    inputId.value = producto.id;
    form.appendChild(inputId);

    // Input oculto para nombre de imagen existente
    const inputImgExistente = document.createElement('input');
    inputImgExistente.type = 'hidden';
    inputImgExistente.name = 'nombre_imagen_existente_edit';
    inputImgExistente.id = 'nombre_imagen_existente_edit';
    inputImgExistente.value = producto.imagen;
    form.appendChild(inputImgExistente);

    // Contenedor de columnas
    const formColumns = document.createElement('div');
    formColumns.className = 'form-columns-edit';

    // Columna izquierda (imagen)
    const colLeft = document.createElement('div');
    colLeft.className = 'form-column-left-edit';
    const previewContainerEdit = document.createElement('div');
    previewContainerEdit.id = 'imagePreviewContainerEditProduct';
    previewContainerEdit.className = 'image-preview-container-edit';
    const imgPreviewEdit = document.createElement('img');
    imgPreviewEdit.id = 'imagePreviewEditProduct';
    imgPreviewEdit.className = 'image-preview-edit';
    imgPreviewEdit.src = `${PRODUCTO_IMG_PATH}${producto.imagen}?v=${new Date().getTime()}`;
    imgPreviewEdit.alt = 'Previsualización';
    const labelImageUploadEdit = document.createElement('label');
    labelImageUploadEdit.htmlFor = 'imageUploadEditProduct';
    labelImageUploadEdit.id = 'labelImageUploadEditProduct';
    labelImageUploadEdit.textContent = 'Seleccionar Imagen';
    labelImageUploadEdit.style.display = 'none';
    previewContainerEdit.appendChild(imgPreviewEdit);
    previewContainerEdit.appendChild(labelImageUploadEdit);
    const inputFileEdit = document.createElement('input');
    inputFileEdit.type = 'file';
    inputFileEdit.name = 'imagen_producto_edit';
    inputFileEdit.id = 'imageUploadEditProduct';
    inputFileEdit.accept = 'image/*';
    inputFileEdit.style.display = 'none';
    const btnTriggerImageUpload = document.createElement('button');
    btnTriggerImageUpload.type = 'button';
    btnTriggerImageUpload.id = 'triggerImageUploadEditProduct';
    btnTriggerImageUpload.className = 'btn btn-upload-edit';
    btnTriggerImageUpload.textContent = 'Cambiar Imagen';
    btnTriggerImageUpload.onclick = (e) => {
        e.preventDefault();
        inputFileEdit.click();
    };
    colLeft.appendChild(previewContainerEdit);
    colLeft.appendChild(inputFileEdit);
    colLeft.appendChild(btnTriggerImageUpload);
    formColumns.appendChild(colLeft);

    // Columna derecha (inputs)
    const colRight = document.createElement('div');
    colRight.className = 'form-column-right-edit';
    // Grupo: Nombre
    const groupNombre = document.createElement('div');
    groupNombre.className = 'form-group-edit';
    const labelNombre = document.createElement('label');
    labelNombre.htmlFor = 'nombre_producto_edit';
    labelNombre.textContent = 'Nombre del Producto:';
    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.name = 'nombre_producto_edit';
    inputNombre.id = 'nombre_producto_edit';
    inputNombre.value = producto.nombre;
    inputNombre.required = true;
    groupNombre.appendChild(labelNombre);
    groupNombre.appendChild(inputNombre);
    colRight.appendChild(groupNombre);
    // Grupo: Descripción
    const groupDescripcion = document.createElement('div');
    groupDescripcion.className = 'form-group-edit';
    const labelDescripcion = document.createElement('label');
    labelDescripcion.htmlFor = 'descripcion_producto_edit';
    labelDescripcion.textContent = 'Descripción (Opcional):';
    const inputDescripcion = document.createElement('textarea');
    inputDescripcion.name = 'descripcion_producto_edit';
    inputDescripcion.id = 'descripcion_producto_edit';
    inputDescripcion.value = producto.descripcion || '';
    groupDescripcion.appendChild(labelDescripcion);
    groupDescripcion.appendChild(inputDescripcion);
    colRight.appendChild(groupDescripcion);
    // Grupo: Precio
    const groupPrecio = document.createElement('div');
    groupPrecio.className = 'form-group-edit';
    const labelPrecio = document.createElement('label');
    labelPrecio.htmlFor = 'precio_producto_edit';
    labelPrecio.textContent = 'Precio del Producto:';
    const inputPrecio = document.createElement('input');
    inputPrecio.type = 'text';
    inputPrecio.name = 'precio_producto_edit';
    inputPrecio.id = 'precio_producto_edit';
    inputPrecio.value = producto.precio;
    inputPrecio.required = true;
    groupPrecio.appendChild(labelPrecio);
    groupPrecio.appendChild(inputPrecio);
    colRight.appendChild(groupPrecio);
    // Grupo: Categoría
    const groupCategoria = document.createElement('div');
    groupCategoria.className = 'form-group-edit';
    const labelCategoria = document.createElement('label');
    labelCategoria.htmlFor = 'categoria_id_producto_edit';
    labelCategoria.textContent = 'Categoría del Producto:';
    const selectCategoria = document.createElement('select');
    selectCategoria.name = 'categoria_id_edit';
    selectCategoria.id = 'categoria_id_producto_edit';
    selectCategoria.required = true;
    groupCategoria.appendChild(labelCategoria);
    groupCategoria.appendChild(selectCategoria);
    colRight.appendChild(groupCategoria);
    // Grupo: Nombre imagen personalizado
    const groupImgName = document.createElement('div');
    groupImgName.className = 'form-group-edit';
    const labelImgName = document.createElement('label');
    labelImgName.htmlFor = 'nombre_imagen_personalizado_producto_edit';
    labelImgName.textContent = 'Nombre del Archivo de Imagen (con extensión, ej: mi_producto.png):';
    const inputImgName = document.createElement('input');
    inputImgName.type = 'text';
    inputImgName.name = 'nombre_imagen_personalizado_producto_edit';
    inputImgName.id = 'nombre_imagen_personalizado_producto_edit';
    inputImgName.value = producto.imagen;
    inputImgName.required = true;
    groupImgName.appendChild(labelImgName);
    groupImgName.appendChild(inputImgName);
    colRight.appendChild(groupImgName);
    // Mensajes
    const msgDivEdit = document.createElement('div');
    msgDivEdit.id = 'edit-product-message';
    msgDivEdit.className = 'message-div-edit';
    colRight.appendChild(msgDivEdit);
    // Botones
    const formButtons = document.createElement('div');
    formButtons.className = 'form-buttons-edit';
    const btnSave = document.createElement('button');
    btnSave.type = 'submit';
    btnSave.className = 'btn btn-save-edit';
    btnSave.textContent = 'Guardar Cambios';
    const btnCancel = document.createElement('button');
    btnCancel.type = 'button';
    btnCancel.className = 'btn btn-cancel-edit';
    btnCancel.textContent = 'Cancelar';
    btnCancel.onclick = () => modalBackdrop.remove();
    formButtons.appendChild(btnSave);
    formButtons.appendChild(btnCancel);
    colRight.appendChild(formButtons);
    formColumns.appendChild(colRight);
    form.appendChild(formColumns);
    modalContent.appendChild(form);
    modalBackdrop.appendChild(modalContent);
    document.body.appendChild(modalBackdrop);

    // Cargar categorías en el select y seleccionar la actual
    await loadCategoriesIntoSelect('categoria_id_producto_edit', categoriaIdActual);

    // Previsualización de imagen
    inputFileEdit.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreviewEdit.src = e.target.result;
                imgPreviewEdit.style.display = 'block';
                labelImageUploadEdit.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Manejo del envío del formulario
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        msgDivEdit.innerHTML = '';
        const id = inputId.value;
        const nombre = inputNombre.value.trim();
        const descripcion = inputDescripcion.value.trim();
        const precio = inputPrecio.value.trim();
        const categoriaId = selectCategoria.value;
        const nombreImagenExistente = inputImgExistente.value;
        const customImageName = inputImgName.value.trim();
        const nuevaImagenFile = inputFileEdit.files[0];

        if (!nombre || !precio || !categoriaId || !customImageName) {
            showWarningMessage('Todos los campos obligatorios deben estar completos.');
            return;
        }

        let nombreImagenFinal = nombreImagenExistente;
        // Si el usuario cambió el nombre de la imagen personalizada, usar ese
        if (customImageName && customImageName !== nombreImagenExistente) {
            nombreImagenFinal = customImageName;
        }

        // Si hay nueva imagen, subirla primero
        if (nuevaImagenFile) {
            showWaitingMessage('Subiendo nueva imagen...', '');
            const formData = new FormData();
            formData.append('action', 'uploadImage');
            formData.append('table', 'producto');
            formData.append('imagen_file', nuevaImagenFile, nombreImagenFinal);
            formData.append('nombre_imagen_personalizado', nombreImagenFinal);
            try {
                const response = await fetch(PRODUCTO_API_URL, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.status !== 'ok') {
                    showErrorMessage(result.message || 'Error al subir la imagen.');
                    return;
                }
            } catch (error) {
                showErrorMessage('Error de conexión al subir la imagen.');
                return;
            }
        }

        // Actualizar datos del producto
        const requestData = {
            action: 'update',
            table: 'producto',
            data: {
                id: id,
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                imagen: nombreImagenFinal
            }
        };
        try {
            showWaitingMessage('Guardando cambios del producto...', '');
            const responseUpdate = await fetch(PRODUCTO_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            const resultUpdate = await responseUpdate.json();
            if (resultUpdate.status === 'ok') {
                // Actualizar relación producto-categoría
                const productoCategoriaData = {
                    action: 'update',
                    table: 'producto_categoria',
                    data: {
                        producto_id: id.toString(),
                        categoria_id: categoriaId.toString()
                    }
                };
                try {
                    const responseRelacion = await fetch(PRODUCTO_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(productoCategoriaData)
                    });
                    const resultRelacion = await responseRelacion.json();
                    if (resultRelacion.status === 'ok') {
                        showSuccessMessage('Producto actualizado exitosamente.');
                        modalBackdrop.remove();
                        if (typeof renderProductsTable === 'function') {
                            await renderProductsTable();
                        }
                    } else {
                        showErrorMessage('Producto actualizado, pero no se pudo actualizar la categoría.');
                    }
                } catch (error) {
                    showErrorMessage('Producto actualizado, pero error de conexión al actualizar la categoría.');
                }
            } else {
                showErrorMessage(resultUpdate.message || 'Error al actualizar el producto.');
            }
        } catch (error) {
            showErrorMessage('Error de conexión con el servidor al actualizar.');
        }
    });
}