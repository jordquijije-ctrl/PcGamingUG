document.addEventListener('DOMContentLoaded', () => {
    // Detectar los componentes del botón "Mi Cuenta"
    const accountLink = document.getElementById('account-menu-item');
    const accountText = document.getElementById('account-text');
    const accountIcon = document.getElementById('account-icon');

    // Verificar si el usuario ya inició sesión en sessionStorage
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userEmail = sessionStorage.getItem('userEmail');

    if (isLoggedIn === 'true' && userEmail) {
        // 1. Extraer la primera parte del correo para no saturar el Header visualmente
        const username = userEmail.split('@')[0];

        // 2. Modificar el texto e icono para reflejar la sesión activa
        if (accountText) accountText.textContent = username.toUpperCase();
        if (accountIcon) {
            accountIcon.className = "ph-fill ph-user-circle-gear"; // Cambia a un icono de usuario logueado
            accountIcon.style.color = "#3b82f6"; // Color azul destacado (Primary)
        }

        // 3. Cambiar el comportamiento del clic: En vez de ir al login, ahora sirve para Cerrar Sesión
        if (accountLink) {
            accountLink.href = "#";
            accountLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Confirmación intuitiva de cierre de sesión
                if (confirm('¿Deseas cerrar tu sesión actual?')) {
                    sessionStorage.removeItem('isLoggedIn');
                    sessionStorage.removeItem('userEmail');
                    alert('Sesión finalizada correctamente.');
                    window.location.reload(); // Recarga la página actual con el estado limpio
                }
            });
        }
    }
});