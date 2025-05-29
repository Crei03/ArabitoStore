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
                const responseCreate = await fetch('../../config/controlador.php', {
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
    formData.append('imagen_categoria_file', imageFile, customImageName);
    formData.append('nombre_imagen_personalizado', customImageName); // Nombre personalizado para referencia en el servidor

    try {
        const response = await fetch('../../config/controlador.php', {
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

function renderCategoriesTable() {
    const tableContainer = document.getElementById('categories-table');
    if (!tableContainer) return;
    tableContainer.innerHTML = '<div class="categories-container"><p>Cargando categorías...</p></div>';
    fetch('../../config/controlador.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'readAll', table: 'categoria' })
    })
        .then(res => res.json())
        .then(result => {
            if (result.status === 'ok' && Array.isArray(result.data) && result.data.length > 0) {
                let html = '<div class="categories-container"><table><thead><tr><th>ID</th><th>Imagen</th><th>Nombre</th><th>Acciones</th></tr></thead><tbody>'; // Cabecera actualizada
                result.data.forEach(categoria => {
                    html += `<tr>
                    <td>${categoria.id}</td>
                    <td><img src="../../public/images/categoria/${categoria.img_link}" alt="${categoria.nombre}" style="width: 50px; height: auto;"></td>
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