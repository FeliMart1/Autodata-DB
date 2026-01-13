// Authentication Module
const auth = {
    currentUser: null,

    async init() {
        if (authToken) {
            try {
                const response = await api.me();
                this.currentUser = response.data;
                this.showApp();
            } catch (error) {
                console.error('Session expired or invalid');
                this.showLogin();
            }
        } else {
            this.showLogin();
        }
    },

    showLogin() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('appScreen').classList.add('hidden');
    },

    showApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('appScreen').classList.remove('hidden');
        this.updateUserDisplay();
    },

    updateUserDisplay() {
        const userDisplay = document.getElementById('userDisplay');
        if (this.currentUser) {
            userDisplay.textContent = `👤 ${this.currentUser.username || 'Usuario'}`;
        }
    },

    async handleLogin(event) {
        event.preventDefault();
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = '';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await api.login(username, password);
            this.currentUser = response.user;
            this.showApp();
            
            // Load initial data
            await loadAllData();
        } catch (error) {
            errorDiv.textContent = error.message || 'Error al iniciar sesión';
        }
    },

    handleLogout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            api.logout();
            this.currentUser = null;
            this.showLogin();
        }
    }
};

// Event Listeners
document.getElementById('loginForm').addEventListener('submit', (e) => auth.handleLogin(e));
document.getElementById('logoutBtn').addEventListener('click', () => auth.handleLogout());
