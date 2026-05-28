document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorContainer = document.getElementById('error-container');
    const errorText = document.getElementById('error-text');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Credenciales de prueba oficiales
    const VALID_USER = "estudiante@ug.edu.ec";
    const VALID_PASS = "ug2026";

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Detiene el envío automático[cite: 4]

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // 1. Validación de campos vacíos
            if (email === "" || password === "") {
                showError("Por favor, completa todos los campos requeridos.");
                email === "" ? emailInput.focus() : passwordInput.focus();
                return;
            }

            // 2. Validación de formato de correo (Regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError("El formato del correo no es válido (ejemplo@correo.com).");
                emailInput.focus();
                return;
            }

            // 3. Validación de credenciales
            if (email === VALID_USER && password === VALID_PASS) {
                // ÉXITO: Guardar sesión en el navegador
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', email);

                alert('¡Bienvenido a ComponentesGamingUG!');
                window.location.href = 'index.html'; // Redirige al catálogo[cite: 17]
            } else {
                // ERROR: Datos incorrectos
                showError("El correo electrónico o la contraseña son incorrectos.");
                passwordInput.value = ""; 
                passwordInput.focus();
            }
        });
    }

    function showError(message) {
        if (errorContainer && errorText) {
            errorText.textContent = message;
            errorContainer.style.display = 'flex';
        }
    }
});