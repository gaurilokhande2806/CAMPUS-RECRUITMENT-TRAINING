// Core Application Manager & State Router
const App = {
    API_BASE: '/api',
    activeView: 'dashboard',

    init() {
        this.bindEvents();
        
        // Initialize Auth module
        Auth.init();

        // Update header current date
        const dateSpan = document.getElementById('current-date-text');
        if (dateSpan) {
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            dateSpan.innerText = new Date().toLocaleDateString('en-GB', options);
        }
    },

    bindEvents() {
        // Sidebar Navigation clicks
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                if (view) {
                    this.navigateTo(view);
                }
            });
        });

        // Sidebar Toggle button
        const toggleBtn = document.getElementById('sidebar-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('collapsed');
            });
        }

        // Notification bell dropdown toggle
        const bell = document.getElementById('notification-bell');
        if (bell) {
            bell.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('notification-dropdown').classList.toggle('hidden');
                document.getElementById('profile-dropdown').classList.add('hidden');
                document.getElementById('quick-add-dropdown').classList.add('hidden');
            });
        }

        // Profile trigger dropdown toggle
        const profile = document.getElementById('profile-trigger');
        if (profile) {
            profile.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('profile-dropdown').classList.toggle('hidden');
                document.getElementById('notification-dropdown').classList.add('hidden');
                document.getElementById('quick-add-dropdown').classList.add('hidden');
            });
        }

        // Quick add dropdown toggle
        const quickAdd = document.getElementById('quick-add-btn');
        if (quickAdd) {
            quickAdd.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('quick-add-dropdown').classList.toggle('hidden');
                document.getElementById('notification-dropdown').classList.add('hidden');
                document.getElementById('profile-dropdown').classList.add('hidden');
            });
        }

        // Document click close dropdowns
        document.addEventListener('click', () => {
            const dropdowns = ['profile-dropdown', 'notification-dropdown', 'quick-add-dropdown'];
            dropdowns.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
        });

        // Quick Add items execution
        const quickAddItems = document.querySelectorAll('.quick-add-item');
        quickAddItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = item.getAttribute('data-action');
                if (action === 'add-customer') {
                    Customers.openAddCustomer();
                } else if (action === 'create-order') {
                    Orders.openCreateOrder();
                } else if (action === 'add-fabric') {
                    Inventory.openAddInventory();
                }
            });
        });

        // Side drawer close events
        const closeBtn = document.getElementById('btn-close-drawer');
        if (closeBtn) {
            closeBtn.addEventListener('click', this.closeDrawer.bind(this));
        }
        const backdrop = document.getElementById('drawer-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', this.closeDrawer.bind(this));
        }

        // Logout actions
        const logoutTrigger = document.getElementById('logout-btn');
        if (logoutTrigger) {
            logoutTrigger.addEventListener('click', () => Auth.logout());
        }
        const navLogout = document.getElementById('nav-logout-btn');
        if (navLogout) {
            navLogout.addEventListener('click', (e) => {
                e.preventDefault();
                Auth.logout();
            });
        }

        // Global search input handling
        const globalSearch = document.getElementById('global-search-input');
        if (globalSearch) {
            globalSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = globalSearch.value.trim();
                    if (query) {
                        this.handleGlobalSearch(query);
                    }
                }
            });
        }
    },

    navigateTo(view) {
        if (!Auth.currentUser) return; // Prevent navigation if logged out
        
        this.activeView = view;
        
        // Highlight active nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-view') === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const container = document.getElementById('content-viewport');
        if (!container) return;

        // Render appropriate view module
        switch (view) {
            case 'dashboard':
                Dashboard.render(container);
                break;
            case 'customers':
                Customers.render(container);
                break;
            case 'measurements':
                Measurements.render(container);
                break;
            case 'orders':
                Orders.render(container);
                break;
            case 'inventory':
                Inventory.render(container);
                break;
            case 'billing':
                Billing.render(container);
                break;
            case 'reports':
                Reports.render(container);
                break;
            case 'settings':
                this.renderSettings(container);
                break;
            default:
                container.innerHTML = `<h2>Under Construction</h2><p>The ${view} view is not implemented yet.</p>`;
        }

        // Auto collapse sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
    },

    renderSettings(container) {
        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Settings & Profile</h2>
                    <p>Configure store policies, tax structures, invoice headings, and security keys.</p>
                </div>
            </div>
            
            <div class="measurement-section-card" style="max-width: 600px; margin: 0 auto; background: white;">
                <h3>System Preferences</h3>
                <div class="form-group" style="margin-top: 16px;">
                    <label>Boutique Trading Name</label>
                    <input type="text" value="TailorSys Boutique" style="width:100%;">
                </div>
                <div class="form-group" style="margin-top: 16px;">
                    <label>GST Registration Number (GSTIN)</label>
                    <input type="text" value="07AAAAA1111A1Z0" style="width:100%;">
                </div>
                <div class="form-group" style="margin-top: 16px;">
                    <label>Standard CGST + SGST Rate (%)</label>
                    <input type="number" value="18" style="width:100%;">
                </div>
                <div class="form-group" style="margin-top: 16px;">
                    <label>UPI Merchant Pay Address</label>
                    <input type="text" value="tailorcorp@okaxis" style="width:100%;">
                </div>
                <button class="btn btn-primary" style="margin-top: 24px;" onclick="App.showToast('Settings updated (Mocked)', 'success')">Save Configurations</button>
            </div>
        `;
    },

    handleGlobalSearch(query) {
        // Route search terms logically
        App.showToast(`Searching for "${query}"...`, 'info');
        if (isNaN(query)) {
            // Probably a customer name search
            this.navigateTo('customers');
            const searchInput = document.getElementById('customer-search');
            if (searchInput) {
                searchInput.value = query;
                Customers.searchQuery = query;
                Customers.currentPage = 1;
                Customers.loadList();
            }
        } else {
            // Probably looking for order ID
            this.navigateTo('orders');
        }
    },

    // Side Drawer (Modals) Utilities
    openDrawer(title, contentHtml) {
        document.getElementById('drawer-title').innerText = title;
        document.getElementById('drawer-body').innerHTML = contentHtml;
        document.getElementById('side-drawer').classList.remove('hidden');
    },

    closeDrawer() {
        document.getElementById('side-drawer').classList.add('hidden');
        document.getElementById('drawer-body').innerHTML = '';
    },

    // Toast Notifications System
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = '<i class="fa-solid fa-circle-check toast-icon"></i>';
        if (type === 'error') {
            icon = '<i class="fa-solid fa-circle-xmark toast-icon"></i>';
        } else if (type === 'warning') {
            icon = '<i class="fa-solid fa-triangle-exclamation toast-icon"></i>';
        } else if (type === 'info') {
            icon = '<i class="fa-solid fa-circle-info toast-icon"></i>';
        }

        toast.innerHTML = `
            ${icon}
            <span class="toast-msg">${message}</span>
        `;

        container.appendChild(toast);

        // Auto remove toast
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 4000);
    },

    // Helper: format YYYY-MM-DD to DD MMM YYYY
    formatDate(dateStr) {
        if (!dateStr) return '-';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }
};

// Start app on load
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
