// Customer Directory & Profiles Manager
const Customers = {
    list: [],
    searchQuery: '',
    statusFilter: 'ALL',
    sortBy: 'name',
    currentPage: 1,
    pageSize: 10,

    async render(container) {
        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Customer Management</h2>
                    <p>Track client accounts, size measurements, billing history, and order logs.</p>
                </div>
                <button class="btn btn-primary" onclick="Customers.openAddCustomer()"><i class="fa-solid fa-user-plus"></i> Add Customer</button>
            </div>

            <div class="table-card">
                <!-- Data Grid Filter Row -->
                <div class="grid-filter-row">
                    <div class="filter-left">
                        <div class="filter-input-search">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <input type="text" id="customer-search" placeholder="Search name, phone, email..." value="${this.searchQuery}">
                        </div>
                        <select class="filter-select" id="customer-status-filter">
                            <option value="ALL" ${this.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
                            <option value="ACTIVE" ${this.statusFilter === 'ACTIVE' ? 'selected' : ''}>Active</option>
                            <option value="INACTIVE" ${this.statusFilter === 'INACTIVE' ? 'selected' : ''}>Inactive</option>
                        </select>
                        <select class="filter-select" id="customer-sort">
                            <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>Sort by Name</option>
                            <option value="visits" ${this.sortBy === 'visits' ? 'selected' : ''}>Sort by Last Visit</option>
                            <option value="orders" ${this.sortBy === 'orders' ? 'selected' : ''}>Sort by Orders Count</option>
                        </select>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="Customers.exportToCSV()"><i class="fa-solid fa-file-export"></i> Export CSV</button>
                </div>

                <!-- Grid Table -->
                <div class="grid-container">
                    <table class="data-grid" id="customers-grid">
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Orders</th>
                                <th>Last Visit</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="customers-list-rows">
                            <tr>
                                <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-secondary);">Loading directory...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination footer -->
                <div class="pagination-row" id="customers-pagination"></div>
            </div>
        `;

        this.bindEvents();
        await this.loadList();
    },

    bindEvents() {
        const searchInput = document.getElementById('customer-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        const filterSelect = document.getElementById('customer-status-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.statusFilter = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        const sortSelect = document.getElementById('customer-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }
    },

    async loadList() {
        try {
            // Include search query in URL to query the backend database directly
            let url = `${App.API_BASE}/customers`;
            if (this.searchQuery.trim()) {
                url += `?search=${encodeURIComponent(this.searchQuery)}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                this.list = await response.json();
                this.applyFilters(); // Apply local filters/sorting/pagination
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            App.showToast('Failed to load customers from database.', 'error');
        }
    },

    applyFilters() {
        let filtered = [...this.list];

        // Apply local status filter (since backend returns matching search entries)
        if (this.statusFilter !== 'ALL') {
            filtered = filtered.filter(c => c.status === this.statusFilter);
        }

        // Apply Sorting
        filtered.sort((a, b) => {
            if (this.sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (this.sortBy === 'visits') {
                if (!a.lastVisit) return 1;
                if (!b.lastVisit) return -1;
                return b.lastVisit.localeCompare(a.lastVisit);
            } else if (this.sortBy === 'orders') {
                return b.ordersCount - a.ordersCount;
            }
            return 0;
        });

        // Paginate
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const paginatedList = filtered.slice(startIndex, startIndex + this.pageSize);

        this.renderTableRows(paginatedList);
        this.renderPagination(totalItems, totalPages);
    },

    renderTableRows(items) {
        const tbody = document.getElementById('customers-list-rows');
        if (!tbody) return;

        if (items.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        <i class="fa-regular fa-folder-open" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                        No customers found matching filters.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = items.map(c => {
            const lastVisit = c.lastVisit ? App.formatDate(c.lastVisit) : 'Never';
            const statusBadge = c.status === 'ACTIVE' ? 'badge-success' : 'badge-danger';
            
            return `
                <tr>
                    <td><strong>#C-100${c.id}</strong></td>
                    <td><a href="#customers" class="profile-link" onclick="Customers.viewProfile(${c.id}); event.preventDefault();" style="color: var(--accent); font-weight: 600; text-decoration: none;">${c.name}</a></td>
                    <td>${c.phone}</td>
                    <td>${c.email || '<span class="text-muted">N/A</span>'}</td>
                    <td><span class="badge badge-muted">${c.ordersCount}</span></td>
                    <td>${lastVisit}</td>
                    <td><span class="badge ${statusBadge}">${c.status}</span></td>
                    <td>
                        <div class="actions-cell">
                            <button class="action-btn" title="View Profile" onclick="Customers.viewProfile(${c.id})"><i class="fa-regular fa-eye"></i></button>
                            <button class="action-btn edit" title="Edit Customer" onclick="Customers.openEditCustomer(${c.id})"><i class="fa-regular fa-pen-to-square"></i></button>
                            <button class="action-btn delete" title="Delete Customer" onclick="Customers.deleteCustomer(${c.id})"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderPagination(totalItems, totalPages) {
        const container = document.getElementById('customers-pagination');
        if (!container) return;

        if (totalItems === 0) {
            container.innerHTML = '';
            return;
        }

        const startIdx = (this.currentPage - 1) * this.pageSize + 1;
        const endIdx = Math.min(this.currentPage * this.pageSize, totalItems);

        container.innerHTML = `
            <div>Showing ${startIdx} to ${endIdx} of ${totalItems} entries</div>
            <div class="pagination-controls">
                <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="Customers.changePage(${this.currentPage - 1})"><i class="fa-solid fa-angle-left"></i></button>
                ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
                    <button class="page-btn ${this.currentPage === page ? 'active' : ''}" onclick="Customers.changePage(${page})">${page}</button>
                `).join('')}
                <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="Customers.changePage(${this.currentPage + 1})"><i class="fa-solid fa-angle-right"></i></button>
            </div>
        `;
    },

    changePage(page) {
        this.currentPage = page;
        this.applyFilters();
    },

    async viewProfile(id) {
        try {
            const response = await fetch(`${App.API_BASE}/customers/${id}`);
            if (response.ok) {
                const customer = await response.json();
                
                // Get latest measurement summary
                let measurementHtml = `<p class="text-muted" style="font-size: 13px;">No measurement records found.</p>`;
                const mResponse = await fetch(`${App.API_BASE}/measurements/customer/${id}/latest`);
                if (mResponse.ok) {
                    const m = await mResponse.json();
                    measurementHtml = `
                        <div class="profile-info-grid" style="background: var(--bg-light); padding: 12px; border-radius: 8px;">
                            <div class="profile-info-item"><label>Chest</label><span>${m.chest ? m.chest + '"' : '-'}</span></div>
                            <div class="profile-info-item"><label>Shoulder</label><span>${m.shoulder ? m.shoulder + '"' : '-'}</span></div>
                            <div class="profile-info-item"><label>Sleeve</label><span>${m.sleeve ? m.sleeve + '"' : '-'}</span></div>
                            <div class="profile-info-item"><label>Neck</label><span>${m.neck ? m.neck + '"' : '-'}</span></div>
                            <div class="profile-info-item"><label>Waist</label><span>${m.waist ? m.waist + '"' : '-'}</span></div>
                            <div class="profile-info-item"><label>Hip</label><span>${m.hip ? m.hip + '"' : '-'}</span></div>
                            <div class="profile-info-item"><label>Pant Length</label><span>${m.pantLength ? m.pantLength + '"' : '-'}</span></div>
                            <div class="profile-info-item"><label>Inseam</label><span>${m.inseam ? m.inseam + '"' : '-'}</span></div>
                        </div>
                        <div style="margin-top: 8px; font-size: 12px; font-style: italic; color: var(--text-secondary);">
                            *Notes: ${m.notes || 'None'}
                        </div>
                    `;
                }

                const bodyHtml = `
                    <div class="profile-card-header">
                        <div class="profile-photo-large">${customer.name.charAt(0).toUpperCase()}</div>
                        <h4>${customer.name}</h4>
                        <p>ID: #C-100${customer.id} | Joined: ${App.formatDate(customer.createdAt.split('T')[0])}</p>
                    </div>

                    <div class="profile-section-title">Contact Information</div>
                    <div class="profile-info-grid">
                        <div class="profile-info-item"><label>Phone</label><span>${customer.phone}</span></div>
                        <div class="profile-info-item"><label>Email</label><span>${customer.email || 'N/A'}</span></div>
                        <div class="profile-info-item"><label>Status</label><span class="badge ${customer.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}">${customer.status}</span></div>
                        <div class="profile-info-item"><label>Total Orders</label><span>${customer.ordersCount}</span></div>
                    </div>

                    <div class="profile-section-title">Measurements Summary</div>
                    ${measurementHtml}
                    <button class="btn btn-secondary btn-sm btn-block" style="margin-top: 10px;" onclick="App.closeDrawer(); App.navigateTo('measurements');"><i class="fa-solid fa-ruler-combined"></i> View Details / Update</button>

                    <div style="margin-top: 24px; display: flex; gap: 12px;">
                        <button class="btn btn-primary btn-sm flex-1" onclick="App.closeDrawer(); Orders.openCreateOrder(${customer.id});"><i class="fa-solid fa-file-signature"></i> Create Order</button>
                    </div>
                `;

                App.openDrawer(`Customer Profile`, bodyHtml);
            }
        } catch (error) {
            console.error('Error fetching profile details:', error);
        }
    },

    openAddCustomer() {
        const bodyHtml = `
            <form id="add-customer-form" onsubmit="Customers.handleAddCustomer(event)">
                <div class="form-group" style="margin-bottom: 16px;">
                    <label for="cust-name">Full Name *</label>
                    <input type="text" id="cust-name" placeholder="e.g. Rajesh Kumar" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label for="cust-phone">Phone Number *</label>
                    <input type="text" id="cust-phone" placeholder="e.g. +91 98765 43210" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label for="cust-email">Email Address</label>
                    <input type="email" id="cust-email" placeholder="e.g. raj@gmail.com">
                </div>
                <div class="form-group" style="margin-bottom: 24px;">
                    <label for="cust-status">Status</label>
                    <select id="cust-status" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeDrawer()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Customer</button>
                </div>
            </form>
        `;
        App.openDrawer('Add New Customer', bodyHtml);
    },

    async handleAddCustomer(e) {
        e.preventDefault();
        const payload = {
            name: document.getElementById('cust-name').value.trim(),
            phone: document.getElementById('cust-phone').value.trim(),
            email: document.getElementById('cust-email').value.trim(),
            status: document.getElementById('cust-status').value
        };

        try {
            const response = await fetch(`${App.API_BASE}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                App.showToast('Customer saved successfully!', 'success');
                App.closeDrawer();
                this.loadList(); // Refresh list
            } else {
                App.showToast('Failed to save customer.', 'error');
            }
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    },

    openEditCustomer(id) {
        const customer = this.list.find(c => c.id === id);
        if (!customer) return;

        const bodyHtml = `
            <form id="edit-customer-form" onsubmit="Customers.handleEditCustomer(event, ${id})">
                <div class="form-group" style="margin-bottom: 16px;">
                    <label for="edit-cust-name">Full Name *</label>
                    <input type="text" id="edit-cust-name" value="${customer.name}" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label for="edit-cust-phone">Phone Number *</label>
                    <input type="text" id="edit-cust-phone" value="${customer.phone}" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label for="edit-cust-email">Email Address</label>
                    <input type="email" id="edit-cust-email" value="${customer.email || ''}">
                </div>
                <div class="form-group" style="margin-bottom: 24px;">
                    <label for="edit-cust-status">Status</label>
                    <select id="edit-cust-status" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                        <option value="ACTIVE" ${customer.status === 'ACTIVE' ? 'selected' : ''}>Active</option>
                        <option value="INACTIVE" ${customer.status === 'INACTIVE' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeDrawer()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        `;
        App.openDrawer('Edit Customer Details', bodyHtml);
    },

    async handleEditCustomer(e, id) {
        e.preventDefault();
        const payload = {
            name: document.getElementById('edit-cust-name').value.trim(),
            phone: document.getElementById('edit-cust-phone').value.trim(),
            email: document.getElementById('edit-cust-email').value.trim(),
            status: document.getElementById('edit-cust-status').value
        };

        try {
            const response = await fetch(`${App.API_BASE}/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                App.showToast('Customer details updated!', 'success');
                App.closeDrawer();
                this.loadList();
            } else {
                App.showToast('Failed to update details.', 'error');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    },

    async deleteCustomer(id) {
        if (!confirm('Are you sure you want to delete this customer? This will delete all measurements and orders tied to this account.')) {
            return;
        }

        try {
            const response = await fetch(`${App.API_BASE}/customers/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                App.showToast('Customer deleted successfully.', 'success');
                this.loadList();
            } else {
                App.showToast('Failed to delete customer.', 'error');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    },

    exportToCSV() {
        if (this.list.length === 0) return;
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Customer ID,Name,Phone,Email,Orders Count,Last Visit,Status\r\n";
        
        this.list.forEach(c => {
            const row = `#C-100${c.id},"${c.name}",${c.phone},${c.email || 'N/A'},${c.ordersCount},${c.lastVisit || 'N/A'},${c.status}`;
            csvContent += row + "\r\n";
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `customer_directory_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
