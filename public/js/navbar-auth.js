document.addEventListener('DOMContentLoaded', () => {
    // Busca el contenedor de "Mi Cuenta" en tu header global
    const accountText = document.querySelector('.header-actions .action-item span');
    const accountIcon = document.querySelector('.header-actions .action-item i');
    const accountLink = document.querySelector('.header-actions .action-item');

    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userEmail = sessionStorage.getItem('userEmail');

    // Si hay una sesión activa en el navegador...
    if (isLoggedIn === 'true' && userEmail) {
        // Extrae el nombre antes del @ (ej: "estudiante")
        const username = userEmail.split('@')[0].toUpperCase();
        
        if (accountText) accountText.textContent = username;
        if (accountIcon) {
            accountIcon.className = "ph-fill ph-user-circle-gear";
            accountIcon.style.color = "#3b82f6"; // Lo pone azul gaming
        }

        // Si le da clic al nombre, se convierte en un botón de cerrar sesión
        if (accountLink) {
            accountLink.style.cursor = "pointer";
            accountLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('¿Deseas cerrar tu sesión actual?')) {
                    sessionStorage.clear();
                    window.location.href = 'index.html';
                }
            });
        }
    }
});