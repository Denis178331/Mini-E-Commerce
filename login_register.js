const loginSection = document.getElementById('login-form-section');
const registerSection = document.getElementById('register-form-section');
const toggleText = document.getElementById('toggle-text');
const registerPasswordInput = document.getElementById('register-password');
const passwordStrengthIndicator = document.getElementById('register-password-indicator');
const updateVisualPanel = (isLoginMode) => {
    if (isLoginMode) {
        toggleText.innerHTML = `Aveți nevoie de un cont? <a href="#" id="toggle-auth-mode">Înregistrați-vă</a>`;
    } else {
        toggleText.innerHTML = `Aveți deja un cont? <a href="#" id="toggle-auth-mode">Conectați-vă</a>`;
    }
    const newToggleLink = document.getElementById('toggle-auth-mode');
    if (newToggleLink) {
        newToggleLink.addEventListener('click', toggleForm);
    }
};
const toggleForm = (event) => {
    if (event) {
        event.preventDefault();
    }   
    const isLoginActive = loginSection.classList.contains('active');
    if (isLoginActive) {
        loginSection.classList.remove('active');
        registerSection.classList.add('active');
        updateVisualPanel(false);
    } else {
        registerSection.classList.remove('active');
        loginSection.classList.add('active');
        updateVisualPanel(true);
    }
};

updateVisualPanel(true); 
const switchToRegisterLink = document.getElementById('switch-to-register');
const switchToLoginLink = document.getElementById('switch-to-login');

if (switchToRegisterLink) {
    switchToRegisterLink.addEventListener('click', toggleForm);
}
if (switchToLoginLink) {
    switchToLoginLink.addEventListener('click', toggleForm);
}

const checkPasswordStrength = (password) => {
    let strength = 0;
    const indicator = passwordStrengthIndicator;
    
    if (!indicator) return;
    if (password.length > 5) strength++;
    if (password.length > 9) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;

    switch (strength) {
        case 0:
            indicator.textContent = 'Puterea parolei: Nu ați introdus nimic';
            indicator.style.color = '#888';
            break;
        case 1:
            indicator.textContent = 'Puterea parolei: Slabă';
            indicator.style.color = '#f87171';
            break;
        case 2:
        case 3:
            indicator.textContent = 'Puterea parolei: Moderată';
            indicator.style.color = '#fbbf24';
            break;
        case 4:
        case 5:
            indicator.textContent = 'Puterea parolei: Puternică';
            indicator.style.color = '#34d399';
            break;
    }
};
if (registerPasswordInput) {
    registerPasswordInput.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value);
    });
}

document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        const icon = toggle.querySelector('i');

        if (!passwordInput || !icon) return;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});
document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Formularul a fost trimis (Acțiune oprită pentru demo).');
    });
});