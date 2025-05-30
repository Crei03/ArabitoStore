// Definición de rutas utilizadas en fetch y para imágenes de categoría
const CATEGORIA_API_URL = '../config/controlador.php';
const CATEGORIA_IMG_PATH = '../public/images/categoria/';

function renderAddCategoryForm() {
    const formContainer = document.getElementById('add-category-form');
    if (!formContainer) return;
    // Crear elementos manualmente en vez de innerHTML
    const container = document.createElement('div');
    container.className = 'add-category-form-container';

    const h1 = document.createElement('h1');
    h1.textContent = 'Agregar Categoría';
    container.appendChild(h1);

    const form = document.createElement('form');
    form.id = 'formAddCategory';
    form.className = 'add-category-form';
    form.enctype = 'multipart/form-data';

    const columns = document.createElement('div');
    columns.className = 'form-columns';

    // Columna izquierda (previsualización)
    const colLeft = document.createElement('div');
    colLeft.className = 'form-column-left';
    const previewContainer = document.createElement('div');
    previewContainer.id = 'imagePreviewContainer';
    const imgPreview = document.createElement('img');
    imgPreview.id = 'imagePreview';
    previewContainer.appendChild(imgPreview);
    // Mover el label y el input de imagen aquí
    const labelFile = document.createElement('label');
    labelFile.htmlFor = 'imageUpload';
    labelFile.textContent = 'Seleccionar Imagen:';
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.name = 'imagen_categoria';
    inputFile.id = 'imageUpload';
    inputFile.accept = 'image/*';
    inputFile.required = true;
    previewContainer.appendChild(labelFile);
    previewContainer.appendChild(inputFile);
    colLeft.appendChild(previewContainer);

    // Columna derecha (inputs)
    const colRight = document.createElement('div');
    colRight.className = 'form-column-right';

    // Grupo: Nombre de la categoría
    const groupNombre = document.createElement('div');
    groupNombre.className = 'form-group';
    const labelNombre = document.createElement('label');
    labelNombre.htmlFor = 'nombre_categoria';
    labelNombre.textContent = 'Nombre de la Categoría:';
    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.name = 'nombre_categoria';
    inputNombre.id = 'nombre_categoria';
    inputNombre.required = true;
    groupNombre.appendChild(labelNombre);
    groupNombre.appendChild(inputNombre);
    colRight.appendChild(groupNombre);

    // Grupo: Nombre imagen personalizado
    const groupImgName = document.createElement('div');
    groupImgName.className = 'form-group';
    const labelImgName = document.createElement('label');
    labelImgName.htmlFor = 'nombre_imagen_personalizado';
    labelImgName.textContent = 'Nombre del Archivo de Imagen (con extensión, ej: mi_imagen.png):';
    const inputImgName = document.createElement('input');
    inputImgName.type = 'text';
    inputImgName.name = 'nombre_imagen_personalizado';
    inputImgName.id = 'nombre_imagen_personalizado';
    inputImgName.placeholder = 'Ej: nueva_categoria.png';
    inputImgName.required = true;
    groupImgName.appendChild(labelImgName);
    groupImgName.appendChild(inputImgName);
    colRight.appendChild(groupImgName);

    // Botones
    const formButtons = document.createElement('div');
    formButtons.className = 'form-buttons';
    const btnSave = document.createElement('button');
    btnSave.type = 'submit';
    btnSave.className = 'btn btn-save';
    btnSave.textContent = 'Guardar';
    const btnCancel = document.createElement('button');
    btnCancel.type = 'reset';
    btnCancel.className = 'btn btn-cancel';
    btnCancel.id = 'cancelAddCategory';
    btnCancel.textContent = 'Cancelar';
    formButtons.appendChild(btnSave);
    formButtons.appendChild(btnCancel);
    colRight.appendChild(formButtons);

    // Mensajes
    const msgDiv = document.createElement('div');
    msgDiv.id = 'add-category-message';
    colRight.appendChild(msgDiv);

    columns.appendChild(colLeft);
    columns.appendChild(colRight);
    form.appendChild(columns);
    container.appendChild(form);
    formContainer.innerHTML = '';
    formContainer.appendChild(container);

    // Previsualización de imagen y reset
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    // labelFile ya está declarado arriba, lo reutilizamos aquí
    const cancelAddCategoryButton = document.getElementById('cancelAddCategory');
    if (imageUpload) {
        imageUpload.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (imagePreview) {
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block';
                    }
                    if (labelFile) {
                        labelFile.style.display = 'none';
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }
    if (cancelAddCategoryButton) {
        cancelAddCategoryButton.addEventListener('click', function () {
            if (imagePreview) {
                imagePreview.src = '#';
                imagePreview.style.display = 'none';
            }
            if (labelFile) {
                labelFile.style.display = 'block';
            }
        });
    }
    // Envío del formulario
    const formEl = document.getElementById('formAddCategory');
    if (formEl) {
        formEl.addEventListener('submit', async function (e) {
            e.preventDefault();
            const nombre_categoria = document.getElementById('nombre_categoria').value.trim();
            const nombre_imagen_personalizado = document.getElementById('nombre_imagen_personalizado').value.trim();
            const imagen_categoria = document.getElementById('imageUpload').files[0]; // El objeto File
            const messageDiv = document.getElementById('add-category-message');
            messageDiv.innerHTML = '';

            // Validar todos los campos, incluyendo el archivo de imagen
            if (!nombre_categoria || !nombre_imagen_personalizado || !imagen_categoria) {
                showWarningMessage('Todos los campos son obligatorios, incluyendo la imagen.');
                return;
            }

            const requestData = {
                action: 'create',
                table: 'categoria',
                data: {
                    nombre: nombre_categoria,
                    img_link: nombre_imagen_personalizado
                }
            };

            try {
                // Paso 1: Enviar datos de la categoría (JSON)
                const responseCreate = await fetch(CATEGORIA_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
                const resultCreate = await responseCreate.json();

                if (resultCreate.status === 'ok') {
                    showSuccessMessage('Categoría agregada exitosamente. Subiendo imagen...');

                    // Paso 2: Subir la imagen (FormData) si la creación fue exitosa
                    const uploadSuccess = await uploadCategoryImage(imagen_categoria, nombre_imagen_personalizado);

                    if (uploadSuccess) {
                        // Ambas operaciones fueron exitosas
                        formEl.reset();
                        if (imagePreview) {
                            imagePreview.src = '#';
                            imagePreview.style.display = 'none';
                        }
                        const labelFile = document.querySelector('label[for="imageUpload"]');
                        if (labelFile) {
                            labelFile.style.display = 'block';
                        }
                        renderCategoriesTable(); // Actualizar la tabla
                    } else {
                        // La subida de la imagen falló, pero la categoría se creó.
                        // Podrías querer mostrar un mensaje más específico o revertir la creación de la categoría.
                        showErrorMessage('Categoría creada, pero la imagen no pudo ser subida.');
                    }
                } else {
                    showErrorMessage(resultCreate.message || 'Error al agregar la categoría.');
                }
            } catch (error) {
                showErrorMessage('Error de conexión con el servidor.');
            }
        });
    }
}

// Nueva función para subir la imagen
async function uploadCategoryImage(imageFile, customImageName) {
    const formData = new FormData();
    formData.append('action', 'uploadImage'); // Acción específica para la subida
    // El tercer argumento de append para File es el nombre del archivo que el servidor recibirá.
    formData.append('table', 'categoria'); // Tabla a la que pertenece la imagen
    formData.append('imagen_file', imageFile, customImageName);
    formData.append('nombre_imagen_personalizado', customImageName); // Nombre personalizado para referencia en el servidor

    try {
        const response = await fetch(CATEGORIA_API_URL, {
            method: 'POST',
            body: formData
            // Nota: No establezcas 'Content-Type' manualmente cuando uses FormData con archivos,
            // el navegador lo hará automáticamente con el boundary correcto.
        });
        const result = await response.json();
        if (result.status === 'ok') {
            showSuccessMessage(result.message || 'Imagen subida exitosamente.');
            return true; // Indicar éxito
        } else {
            showErrorMessage(result.message || 'Error al subir la imagen.');
            return false; // Indicar fallo
        }
    } catch (error) {
        showErrorMessage('Error de conexión al subir la imagen.');
        return false; // Indicar fallo
    }
}

// Función para crear y mostrar el modal de edición
function openEditCategoryModal(categoria) {
    const existingModal = document.getElementById('editCategoryModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Contenedor principal del modal (fondo oscuro)
    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'editCategoryModal';
    modalBackdrop.className = 'modal-edit-category-backdrop'; // Clase para el fondo

    // Contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-edit-category-content'; // Clase para el contenido

    // Encabezado del modal
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-edit-header';
    const h2 = document.createElement('h2');
    h2.textContent = 'Editar Categoría';
    const closeModalSpan = document.createElement('span');
    closeModalSpan.className = 'close-modal-edit';
    closeModalSpan.innerHTML = '&times;';
    closeModalSpan.onclick = () => modalBackdrop.remove();
    modalHeader.appendChild(h2);
    modalHeader.appendChild(closeModalSpan);
    modalContent.appendChild(modalHeader);

    // Formulario
    const form = document.createElement('form');
    form.id = 'formEditCategory';
    form.className = 'edit-category-form'; // Clase para el formulario
    form.enctype = 'multipart/form-data';

    // Input oculto para el ID
    const inputId = document.createElement('input');
    inputId.type = 'hidden';
    inputId.name = 'id_categoria_edit';
    inputId.id = 'id_categoria_edit';
    inputId.value = categoria.id;
    form.appendChild(inputId);

    // Input oculto para el nombre de la imagen existente
    const inputImgExistente = document.createElement('input');
    inputImgExistente.type = 'hidden';
    inputImgExistente.name = 'nombre_imagen_existente_edit';
    inputImgExistente.id = 'nombre_imagen_existente_edit';
    inputImgExistente.value = categoria.img_link;
    form.appendChild(inputImgExistente);

    // Contenedor de columnas del formulario
    const formColumns = document.createElement('div');
    formColumns.className = 'form-columns-edit'; // Clase para las columnas

    // Columna izquierda (Imagen)
    const colLeft = document.createElement('div');
    colLeft.className = 'form-column-left-edit'; // Clase para columna izquierda

    const previewContainerEdit = document.createElement('div');
    previewContainerEdit.id = 'imagePreviewContainerEdit'; // ID para el contenedor de previsualización
    previewContainerEdit.className = 'image-preview-container-edit'; // Clase para estilos

    const imgPreviewEdit = document.createElement('img');
    imgPreviewEdit.id = 'imagePreviewEdit'; // ID para la imagen de previsualización
    imgPreviewEdit.src = `${CATEGORIA_IMG_PATH}${categoria.img_link}?v=${new Date().getTime()}`;
    imgPreviewEdit.alt = 'Previsualización';

    const labelImageUploadEdit = document.createElement('label');
    labelImageUploadEdit.htmlFor = 'imageUploadEdit';
    labelImageUploadEdit.id = 'labelImageUploadEdit'; // ID para el label
    labelImageUploadEdit.textContent = 'Seleccionar Imagen';
    if (categoria.img_link) {
        labelImageUploadEdit.style.display = 'none';
    }

    previewContainerEdit.appendChild(imgPreviewEdit);
    previewContainerEdit.appendChild(labelImageUploadEdit);

    const inputFileEdit = document.createElement('input');
    inputFileEdit.type = 'file';
    inputFileEdit.name = 'imagen_categoria_edit';
    inputFileEdit.id = 'imageUploadEdit';
    inputFileEdit.accept = 'image/*';
    inputFileEdit.style.display = 'none'; // Oculto, se activa con el botón

    const btnTriggerImageUpload = document.createElement('button');
    btnTriggerImageUpload.type = 'button';
    btnTriggerImageUpload.id = 'triggerImageUploadEdit';
    btnTriggerImageUpload.className = 'btn btn-upload-edit'; // Clase para el botón de cambiar imagen
    btnTriggerImageUpload.textContent = 'Cambiar Imagen';
    btnTriggerImageUpload.onclick = () => inputFileEdit.click();

    colLeft.appendChild(previewContainerEdit);
    colLeft.appendChild(inputFileEdit); // Aunque esté oculto, debe estar en el DOM
    colLeft.appendChild(btnTriggerImageUpload);
    formColumns.appendChild(colLeft);


    // Columna derecha (Nombre y botones)
    const colRight = document.createElement('div');
    colRight.className = 'form-column-right-edit'; // Clase para columna derecha

    // Grupo: Nombre de la categoría
    const groupNombre = document.createElement('div');
    groupNombre.className = 'form-group-edit'; // Clase para grupo de formulario
    const labelNombre = document.createElement('label');
    labelNombre.htmlFor = 'nombre_categoria_edit';
    labelNombre.textContent = 'Nombre de la Categoría:';
    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.name = 'nombre_categoria_edit';
    inputNombre.id = 'nombre_categoria_edit';
    inputNombre.value = categoria.nombre;
    inputNombre.required = true;
    groupNombre.appendChild(labelNombre);
    groupNombre.appendChild(inputNombre);
    colRight.appendChild(groupNombre);

    // Div para mensajes
    const msgDivEdit = document.createElement('div');
    msgDivEdit.id = 'edit-category-message'; // ID para mensajes
    msgDivEdit.className = 'message-div-edit'; // Clase para mensajes
    colRight.appendChild(msgDivEdit);

    // Botones del formulario
    const formButtons = document.createElement('div');
    formButtons.className = 'form-buttons-edit'; // Clase para botones
    const btnSave = document.createElement('button');
    btnSave.type = 'submit';
    btnSave.className = 'btn btn-save-edit'; // Clase para botón guardar
    btnSave.textContent = 'Guardar Cambios';
    const btnCancel = document.createElement('button');
    btnCancel.type = 'button'; // Importante: type button para no hacer submit
    btnCancel.className = 'btn btn-cancel-edit'; // Clase para botón cancelar
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

    // Event listener para previsualización de imagen
    inputFileEdit.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreviewEdit.src = e.target.result;
                imgPreviewEdit.style.display = 'block';
                labelImageUploadEdit.style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    // Event listener para el envío del formulario
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const id = inputId.value;
        const nombre = inputNombre.value.trim();
        const imagen_existente = inputImgExistente.value;
        const nuevaImagenFile = inputFileEdit.files[0];

        msgDivEdit.innerHTML = ''; // Limpiar mensajes previos

        if (!nombre) {
            showWarningMessage('El nombre de la categoría es obligatorio.', '');
            return;
        }

        let nombreImagenFinal = imagen_existente;

        if (nuevaImagenFile) {
            showWaitingMessage('Subiendo nueva imagen...', '');
            const imagenSubida = await uploadCategoryImage(nuevaImagenFile, imagen_existente); // Usa el nombre existente para sobrescribir
            if (!imagenSubida) {
                showErrorMessage('Error al subir la nueva imagen. No se guardarán los cambios.', 'edit-category-message');
                return;
            }
        }

        const requestData = {
            action: 'update',
            table: 'categoria',
            data: {
                id: id,
                nombre: nombre,
                img_link: nombreImagenFinal
            }
        };

        try {
            showWaitingMessage('Guardando cambios de la categoría...', '');
            const responseUpdate = await fetch(CATEGORIA_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            const resultUpdate = await responseUpdate.json();

            if (resultUpdate.status === 'ok') {
                showSuccessMessage('Categoría actualizada exitosamente.', '');
                setTimeout(() => {
                    modalBackdrop.remove();
                    renderCategoriesTable(); // Actualizar la tabla
                }, 1500);
            } else {
                showErrorMessage(resultUpdate.message || 'Error al actualizar la categoría.', '');
            }
        } catch (error) {
            showErrorMessage('Error de conexión con el servidor al actualizar.', '');
        }
    });
}


function renderCategoriesTable() {
    const tableContainer = document.getElementById('categories-table');
    if (!tableContainer) return;
    tableContainer.innerHTML = '<div class="categories-container"><p>Cargando categorías...</p></div>';
    fetch(CATEGORIA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'readAll', table: 'categoria' })
    })
        .then(res => res.json())
        .then(result => {
            if (result.status === 'ok' && Array.isArray(result.data) && result.data.length > 0) {
                let html = '<div class="categories-container"><table><thead><tr><th>ID</th><th>Imagen</th><th>Nombre</th><th>Acciones</th></tr></thead><tbody>';
                result.data.forEach(categoria => {
                    html += `<tr>
                    <td>${categoria.id}</td>
                    <td><img src="${CATEGORIA_IMG_PATH}${categoria.img_link}?v=${new Date().getTime()}" alt="${categoria.nombre}" style="width: 50px; height: auto;"></td>
                    <td>${categoria.nombre}</td>
                    <td>
                        <button class="btn-edit-categoria" data-id="${categoria.id}" title="Editar Categoría">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn-delete-categoria" data-id="${categoria.id}" title="Eliminar Categoría">
                            <i class="material-icons">delete</i>
                        </button>
                    </td>
                </tr>`;
                });
                html += '</tbody></table></div>';
                tableContainer.innerHTML = html;

                // Añadir event listeners para los botones de editar
                document.querySelectorAll('.btn-edit-categoria').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const categoryId = event.currentTarget.dataset.id;
                        // Fetch de los datos de la categoría específica para asegurar que tenemos la info más reciente
                        // y el objeto completo, incluyendo img_link.
                        try {
                            const response = await fetch(CATEGORIA_API_URL, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'read', table: 'categoria', data: { id: categoryId } })
                            });
                            const resultCategoria = await response.json();
                            if (resultCategoria.status === 'ok' && resultCategoria.data) {
                                openEditCategoryModal(resultCategoria.data);
                            } else {
                                showErrorMessage('No se pudieron obtener los datos de la categoría para editar.');
                            }
                        } catch (error) {
                            showErrorMessage('Error al cargar datos de la categoría para editar.');
                        }
                    });
                });

                // Añadir event listeners para los botones de eliminar 
                document.querySelectorAll('.btn-delete-categoria').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const categoryId = event.currentTarget.dataset.id;
                        // Usar el modal de confirmación personalizado
                        const modal = new window.ConfirmModal({
                            message: '¿Estás seguro de que deseas eliminar esta categoría?',
                            onConfirm: async () => {
                                try {
                                    const response = await fetch(CATEGORIA_API_URL, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ action: 'delete', table: 'categoria', data: { id: categoryId } })
                                    });
                                    const resultDelete = await response.json();
                                    if (resultDelete.status === 'ok') {
                                        showSuccessMessage('Categoría eliminada exitosamente.');
                                        renderCategoriesTable(); // Actualizar la tabla
                                    } else {
                                        showErrorMessage(resultDelete.message || 'Error al eliminar la categoría.');
                                    }
                                } catch (error) {
                                    showErrorMessage('Error de conexión al eliminar la categoría.');
                                }
                            },
                            onCancel: () => { }
                        });
                        modal.open();
                    });
                });

            } else {
                tableContainer.innerHTML = '<div class="categories-container"><p>No hay categorías para mostrar.</p></div>';
            }
        })
        .catch(() => {
            tableContainer.innerHTML = '<div class="categories-container"><p>Error al cargar las categorías.</p></div>';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    renderAddCategoryForm();
    renderCategoriesTable();
});