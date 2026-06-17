// Auth Component Management
const Auth = {
    currentUser: null,

    init() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Check if session exists in localStorage
        const storedUser = localStorage.getItem('tailor_session');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
                this.applySession();
            } catch (e) {
                this.clearSession();
            }
        }
    },

    async handleLogin(e) {
        e.preventDefault();
        const usernameInput = document.getElementById('login-username').value.trim();
        const passwordInput = document.getElementById('login-password').value.trim();
        const rememberMe = document.getElementById('remember-me').checked;

        if (!usernameInput || !passwordInput) {
            App.showToast('Please enter both username and password.', 'error');
            return;
        }

        const btn = document.getElementById('login-btn');
        btn.disabled = true;
        btn.querySelector('span').innerText = 'Signing In...';

        try {
            const response = await fetch(`${App.API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password: passwordInput })
            });

            if (response.ok) {
                const userData = await response.json();
                this.currentUser = userData;

                if (rememberMe) {
                    localStorage.setItem('tailor_session', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('tailor_session', JSON.stringify(userData));
                }

                App.showToast('Successfully signed in!', 'success');
                this.applySession();
            } else {
                const errMsg = await response.text();
                App.showToast(errMsg || 'Invalid credentials.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            App.showToast('Server connection failed. Is the backend running?', 'error');
        } finally {
            btn.disabled = false;
            btn.querySelector('span').innerText = 'Sign In';
        }
    },

    applySession() {
        // Toggle screens
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-layout').classList.remove('hidden');

        // Update Nav UI
        document.getElementById('user-name-display').innerText = this.currentUser.fullName;
        document.getElementById('user-role-display').innerText = this.currentUser.role;
        
        // Character initial for avatars
        const initial = this.currentUser.fullName.charAt(0).toUpperCase();
        document.getElementById('user-avatar-char').innerText = initial;
        document.getElementById('nav-profile-char').innerText = initial;

        // Apply role permissions
        this.applyRolePermissions(this.currentUser.role);

        // Load the dashboard view
        App.navigateTo('dashboard');
    },

    applyRolePermissions(role) {
        const sidebar = document.getElementById('sidebar');
        // Reset permissions
        const navItems = sidebar.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('hidden'));

        if (role === 'TAILOR') {
            // Tailors can only access Orders, Settings
            navItems.forEach(item => {
                const view = item.getAttribute('data-view');
                if (view !== 'orders' && view !== 'settings') {
                    item.classList.add('hidden');
                }
            });
        } else if (role === 'DESIGNER') {
            // Designers cannot access Billing, Reports, Inventory management
            navItems.forEach(item => {
                const view = item.getAttribute('data-view');
                if (view === 'billing' || view === 'reports') {
                    item.classList.add('hidden');
                }
            });
        }
    },

    logout() {
        this.clearSession();
        document.getElementById('main-layout').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        App.showToast('Signed out successfully.', 'info');
    },

    clearSession() {
        this.currentUser = null;
        localStorage.removeItem('tailor_session');
        sessionStorage.removeItem('tailor_session');
    }
};
