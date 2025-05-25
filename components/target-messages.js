// Target Messages JavaScript Component
// Componente autónomo para mostrar mensajes de estado
// Requiere: Material Icons CSS y target-messages.css

// Verificar dependencias al cargar
document.addEventListener('DOMContentLoaded', function () {
    checkDependencies();
});

function checkDependencies() {
    // Verificar Material Icons CSS
    const materialIcons = document.querySelector('link[href*="material-icons"], link[href*="Material+Icons"]');
    if (!materialIcons) {
        console.warn('Target Messages: Material Icons CSS no encontrado. Agregando automáticamente...');
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
}

function closeTargetMessage(element) {
    const message = element.closest('.target-message');
    if (message) {
        message.classList.add('closing');

        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 300);
    }
}

function showTargetMessage(message, reason = '', status = 'exito') {
    // Crear contenedor si no existe
    let container = document.querySelector('.target-messages-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'target-messages-container';
        document.body.appendChild(container);
    }

    // Configuración de iconos según el estado
    const statusConfig = {
        'exito': {
            icon: 'check_circle',
            class: 'target-message-success',
            autoClose: 3000
        },
        'suceso inesperado': {
            icon: 'warning',
            class: 'target-message-warning',
            autoClose: 5000
        },
        'error': {
            icon: 'error',
            class: 'target-message-error',
            autoClose: false
        }
    };

    // Verificar que el estado sea válido
    if (!statusConfig[status]) {
        status = 'exito';
    }

    const config = statusConfig[status];

    // Crear el elemento del mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `target-message ${config.class}`;
    messageElement.setAttribute('data-status', status);

    const reasonHtml = reason ? `<div class="target-message-reason">${escapeHtml(reason)}</div>` : '';

    messageElement.innerHTML = `
        <div class="target-message-icon">
            <i class="material-icons">${config.icon}</i>
        </div>
        <div class="target-message-content">
            <div class="target-message-text">${escapeHtml(message)}</div>
            ${reasonHtml}
        </div>
        <div class="target-message-close" onclick="closeTargetMessage(this)">
            <i class="material-icons">close</i>
        </div>
    `;

    // Agregar al contenedor
    container.appendChild(messageElement);

    // Auto-cerrar según configuración
    if (config.autoClose) {
        setTimeout(() => {
            if (messageElement.parentNode) {
                closeTargetMessage(messageElement.querySelector('.target-message-close'));
            }
        }, config.autoClose);
    }

    return messageElement;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}



function showSuccessMessage(message, reason = '') {
    return showTargetMessage(message, reason, 'exito');
}

function showWarningMessage(message, reason = '') {
    return showTargetMessage(message, reason, 'suceso inesperado');
}

function showErrorMessage(message, reason = '') {
    return showTargetMessage(message, reason, 'error');
}


// Ejemplos de uso:
// TargetMessages.success('Login exitoso', 'Has iniciado sesión correctamente');
// TargetMessages.warning('Advertencia', 'Algo inesperado ocurrió');
// TargetMessages.error('Error de conexión', 'No se pudo conectar al servidor');
// TargetMessages.show('Mensaje personalizado', 'Razón opcional', 'exito', 5000);
