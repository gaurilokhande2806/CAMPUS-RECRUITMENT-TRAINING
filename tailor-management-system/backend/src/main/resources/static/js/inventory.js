// Inventory Management Component
const Inventory = {
    list: [],

    async render(container) {
        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Fabric Inventory</h2>
                    <p>Track raw materials, fabric rolls, stock logs, and supplier details.</p>
                </div>
                <button class="btn btn-primary" onclick="Inventory.openAddInventory()"><i class="fa-solid fa-plus"></i> Add Fabric</button>
            </div>

            <!-- Summary KPI metrics -->
            <div class="kpi-grid" id="inventory-summary-cards" style="margin-bottom: 24px;">
                <div class="kpi-card skeleton" style="height: 100px;"></div>
                <div class="kpi-card skeleton" style="height: 100px;"></div>
                <div class="kpi-card skeleton" style="height: 100px;"></div>
                <div class="kpi-card skeleton" style="height: 100px;"></div>
            </div>

            <div class="table-card">
                <!-- Inventory Grid Table -->
                <div class="grid-container">
                    <table class="data-grid" id="inventory-grid">
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Fabric Name</th>
                                <th>Category</th>
                                <th>Available Stock</th>
                                <th>Rate (₹/mtr)</th>
                                <th>Supplier</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="inventory-list-rows">
                            <tr>
                                <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-secondary);">Loading stock list...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        await this.loadSummary();
        await this.loadList();
    },

    async loadSummary() {
        try {
            const response = await fetch(`${App.API_BASE}/inventory/summary`);
            if (response.ok) {
                const data = await response.json();
                const container = document.getElementById('inventory-summary-cards');
                container.innerHTML = `
                    <div class="kpi-card">
                        <div class="kpi-left">
                            <h3>Total Fabric Stock</h3>
                            <div class="kpi-number">${data.totalFabricStock ? data.totalFabricStock.toFixed(1) : '0'} mtrs</div>
                        </div>
                        <div class="kpi-icon-box blue"><i class="fa-solid fa-scroll"></i></div>
                    </div>

                    <div class="kpi-card">
                        <div class="kpi-left">
                            <h3>Low Stock Fabrics</h3>
                            <div class="kpi-number">${data.lowStockItems}</div>
                        </div>
                        <div class="kpi-icon-box red"><i class="fa-solid fa-triangle-exclamation"></i></div>
                    </div>

                    <div class="kpi-card">
                        <div class="kpi-left">
                            <h3>Active Suppliers</h3>
                            <div class="kpi-number">${data.suppliers}</div>
                        </div>
                        <div class="kpi-icon-box blue"><i class="fa-solid fa-truck-ramp-box"></i></div>
                    </div>

                    <div class="kpi-card">
                        <div class="kpi-left">
                            <h3>Monthly Usage</h3>
                            <div class="kpi-number">${data.monthlyUsage} mtrs</div>
                        </div>
                        <div class="kpi-icon-box green"><i class="fa-solid fa-chart-line"></i></div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading inventory summary:', error);
        }
    },

    async loadList() {
        try {
            const response = await fetch(`${App.API_BASE}/inventory`);
            if (response.ok) {
                this.list = await response.json();
                this.renderTableRows();
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    },

    renderTableRows() {
        const tbody = document.getElementById('inventory-list-rows');
        if (!tbody) return;

        if (this.list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">No fabrics logged in system.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.list.map(item => {
            let badgeClass = 'badge-success';
            if (item.status === 'LOW_STOCK') badgeClass = 'badge-warning';
            else if (item.status === 'OUT_OF_STOCK') badgeClass = 'badge-danger';

            return `
                <tr>
                    <td><strong>#FAB-100${item.id}</strong></td>
                    <td><strong>${item.fabricName}</strong></td>
                    <td>${item.category}</td>
                    <td><strong>${item.availableQty.toFixed(1)} mtrs</strong> <span style="font-size: 11px; color: var(--text-muted);">(${item.minAlertQty} threshold)</span></td>
                    <td>₹${item.unitPrice.toLocaleString('en-IN')}</td>
                    <td>${item.supplier}</td>
                    <td><span class="badge ${badgeClass}">${item.status.replace('_', ' ')}</span></td>
                    <td>
                        <div class="actions-cell">
                            <button class="action-btn" title="Adjust Stock" onclick="Inventory.openAdjustStock(${item.id})"><i class="fa-solid fa-sliders"></i></button>
                            <button class="action-btn" title="Movement History" onclick="Inventory.viewLogs(${item.id})"><i class="fa-solid fa-clock-rotate-left"></i></button>
                            <button class="action-btn edit" title="Edit Item" onclick="Inventory.openEditInventory(${item.id})"><i class="fa-regular fa-pen-to-square"></i></button>
                            <button class="action-btn delete" title="Delete Fabric" onclick="Inventory.deleteInventoryItem(${item.id})"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openAddInventory() {
        const bodyHtml = `
            <form id="add-inventory-form" onsubmit="Inventory.handleAddInventory(event)">
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Fabric Name *</label>
                    <input type="text" id="inv-name" placeholder="e.g. Super 120s Merino Wool (Navy Blue)" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Category *</label>
                    <select id="inv-category" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);" required>
                        <option value="Wool">Wool</option>
                        <option value="Silk">Silk</option>
                        <option value="Linen">Linen</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Velvet">Velvet</option>
                    </select>
                </div>
                <div class="profile-info-grid" style="margin-bottom: 16px;">
                    <div class="form-group">
                        <label>Initial Stock (Meters) *</label>
                        <input type="number" step="0.1" id="inv-qty" placeholder="30.5" required>
                    </div>
                    <div class="form-group">
                        <label>Unit Rate (₹ / Meter) *</label>
                        <input type="number" id="inv-price" placeholder="1800" required>
                    </div>
                </div>
                <div class="profile-info-grid" style="margin-bottom: 24px;">
                    <div class="form-group">
                        <label>Supplier Name *</label>
                        <input type="text" id="inv-supplier" placeholder="e.g. Raymonds Ltd." required>
                    </div>
                    <div class="form-group">
                        <label>Low Alert Threshold (Mtr)</label>
                        <input type="number" step="0.1" id="inv-alertQty" value="10.0">
                    </div>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeDrawer()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Fabric Roll</button>
                </div>
            </form>
        `;
        App.openDrawer('Add Fabric Stock', bodyHtml);
    },

    async handleAddInventory(e) {
        e.preventDefault();
        const payload = {
            fabricName: document.getElementById('inv-name').value.trim(),
            category: document.getElementById('inv-category').value,
            availableQty: parseFloat(document.getElementById('inv-qty').value),
            unitPrice: parseFloat(document.getElementById('inv-price').value),
            supplier: document.getElementById('inv-supplier').value.trim(),
            minAlertQty: parseFloat(document.getElementById('inv-alertQty').value)
        };

        try {
            const response = await fetch(`${App.API_BASE}/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                App.showToast('Fabric roll saved successfully!', 'success');
                App.closeDrawer();
                this.render(document.getElementById('content-viewport'));
            } else {
                App.showToast('Failed to save fabric.', 'error');
            }
        } catch (error) {
            console.error('Error saving fabric:', error);
        }
    },

    openEditInventory(id) {
        const item = this.list.find(i => i.id === id);
        if (!item) return;

        const bodyHtml = `
            <form id="edit-inventory-form" onsubmit="Inventory.handleEditInventory(event, ${id})">
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Fabric Name *</label>
                    <input type="text" id="edit-inv-name" value="${item.fabricName}" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Category *</label>
                    <select id="edit-inv-category" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);" required>
                        <option value="Wool" ${item.category === 'Wool' ? 'selected' : ''}>Wool</option>
                        <option value="Silk" ${item.category === 'Silk' ? 'selected' : ''}>Silk</option>
                        <option value="Linen" ${item.category === 'Linen' ? 'selected' : ''}>Linen</option>
                        <option value="Cotton" ${item.category === 'Cotton' ? 'selected' : ''}>Cotton</option>
                        <option value="Velvet" ${item.category === 'Velvet' ? 'selected' : ''}>Velvet</option>
                    </select>
                </div>
                <div class="profile-info-grid" style="margin-bottom: 16px;">
                    <div class="form-group">
                        <label>Current Stock (Meters) *</label>
                        <input type="number" step="0.1" id="edit-inv-qty" value="${item.availableQty}" required>
                    </div>
                    <div class="form-group">
                        <label>Unit Rate (₹ / Meter) *</label>
                        <input type="number" id="edit-inv-price" value="${item.unitPrice}" required>
                    </div>
                </div>
                <div class="profile-info-grid" style="margin-bottom: 24px;">
                    <div class="form-group">
                        <label>Supplier Name *</label>
                        <input type="text" id="edit-inv-supplier" value="${item.supplier}" required>
                    </div>
                    <div class="form-group">
                        <label>Low Alert Threshold (Mtr)</label>
                        <input type="number" step="0.1" id="edit-inv-alertQty" value="${item.minAlertQty}">
                    </div>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeDrawer()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Fabric Details</button>
                </div>
            </form>
        `;
        App.openDrawer('Modify Fabric Details', bodyHtml);
    },

    async handleEditInventory(e, id) {
        e.preventDefault();
        const payload = {
            fabricName: document.getElementById('edit-inv-name').value.trim(),
            category: document.getElementById('edit-inv-category').value,
            availableQty: parseFloat(document.getElementById('edit-inv-qty').value),
            unitPrice: parseFloat(document.getElementById('edit-inv-price').value),
            supplier: document.getElementById('edit-inv-supplier').value.trim(),
            minAlertQty: parseFloat(document.getElementById('edit-inv-alertQty').value)
        };

        try {
            const response = await fetch(`${App.API_BASE}/inventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                App.showToast('Fabric details updated!', 'success');
                App.closeDrawer();
                this.render(document.getElementById('content-viewport'));
            } else {
                App.showToast('Failed to update details.', 'error');
            }
        } catch (error) {
            console.error('Error updating fabric:', error);
        }
    },

    openAdjustStock(id) {
        const item = this.list.find(i => i.id === id);
        if (!item) return;

        const bodyHtml = `
            <div style="background-color: var(--bg-light); padding: 14px; border-radius: var(--border-radius-md); margin-bottom: 20px;">
                <p><strong>Fabric:</strong> ${item.fabricName}</p>
                <p><strong>Current Level:</strong> ${item.availableQty} meters</p>
            </div>
            
            <form id="adjust-stock-form" onsubmit="Inventory.handleAdjustStock(event, ${id})">
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Adjustment Type</label>
                    <select id="adj-type" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                        <option value="CONSUMPTION">Stock Consumption (Use fabric)</option>
                        <option value="RESTOCK">Restock (Add fabric rolls)</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Adjustment Quantity (Meters) *</label>
                    <input type="number" step="0.1" id="adj-qty" placeholder="5.5" required>
                </div>
                <div class="form-group" style="margin-bottom: 24px;">
                    <label>Remarks / Auditing Note</label>
                    <input type="text" id="adj-remarks" placeholder="e.g. Used for Order #ORD-1002" required>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeDrawer()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Post Adjustment</button>
                </div>
            </form>
        `;
        App.openDrawer('Adjust Stock Level', bodyHtml);
    },

    async handleAdjustStock(e, id) {
        e.preventDefault();
        const payload = {
            changeQty: parseFloat(document.getElementById('adj-qty').value),
            logType: document.getElementById('adj-type').value,
            remarks: document.getElementById('adj-remarks').value.trim()
        };

        try {
            const response = await fetch(`${App.API_BASE}/inventory/${id}/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                App.showToast('Inventory level adjusted!', 'success');
                App.closeDrawer();
                this.render(document.getElementById('content-viewport'));
            } else {
                App.showToast('Failed to adjust stock. Ensure sufficient quantity.', 'error');
            }
        } catch (error) {
            console.error('Error adjusting stock:', error);
        }
    },

    async viewLogs(id) {
        const item = this.list.find(i => i.id === id);
        if (!item) return;

        try {
            const response = await fetch(`${App.API_BASE}/inventory/${id}/logs`);
            if (response.ok) {
                const logs = await response.json();
                
                const bodyHtml = `
                    <div style="background-color: var(--bg-light); padding: 14px; border-radius: var(--border-radius-md); margin-bottom: 20px;">
                        <p><strong>Fabric name:</strong> ${item.fabricName}</p>
                        <p><strong>Supplier:</strong> ${item.supplier}</p>
                    </div>

                    <div class="profile-section-title">Stock Ledger Log History</div>
                    ${logs.length === 0 ? `
                        <p class="text-muted" style="text-align: center; padding: 20px 0;">No logs registered.</p>
                    ` : `
                        <table class="data-grid" style="font-size: 11px;">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Change (Mtr)</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${logs.map(log => `
                                    <tr>
                                        <td>${App.formatDate(log.loggedAt.split('T')[0])}</td>
                                        <td><span class="badge ${log.logType === 'RESTOCK' ? 'badge-success' : 'badge-danger'}">${log.logType}</span></td>
                                        <td><strong>${log.changeQty > 0 ? '+' : ''}${log.changeQty.toFixed(1)}</strong></td>
                                        <td>${log.remarks || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                `;
                App.openDrawer('Stock Movement Log', bodyHtml);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    },

    async deleteInventoryItem(id) {
        if (!confirm('Are you sure you want to delete this fabric from the inventory system?')) return;

        try {
            const response = await fetch(`${App.API_BASE}/inventory/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                App.showToast('Fabric roll deleted.', 'success');
                this.render(document.getElementById('content-viewport'));
            }
        } catch (e) {
            console.error(e);
        }
    }
};
