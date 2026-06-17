// Order Kanban Board Manager
const Orders = {
    list: [],

    async render(container) {
        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Order Tracking</h2>
                    <p>Track production status via Kanban pipeline. Drag cards between columns to update stages.</p>
                </div>
                <button class="btn btn-primary" onclick="Orders.openCreateOrder()"><i class="fa-solid fa-plus"></i> Create Order</button>
            </div>

            <!-- Kanban Board Grid Layout -->
            <div class="kanban-board">
                <!-- Column 1: Pending -->
                <div class="kanban-column" data-status="PENDING">
                    <div class="kanban-column-header">
                        <h3>Pending</h3>
                        <span class="kanban-card-count" id="count-pending">0</span>
                    </div>
                    <div class="kanban-cards-area" id="cards-pending" ondragover="Orders.handleDragOver(event)" ondragleave="Orders.handleDragLeave(event)" ondrop="Orders.handleDrop(event, 'PENDING')"></div>
                </div>

                <!-- Column 2: Cutting -->
                <div class="kanban-column" data-status="CUTTING">
                    <div class="kanban-column-header">
                        <h3>Cutting</h3>
                        <span class="kanban-card-count" id="count-cutting">0</span>
                    </div>
                    <div class="kanban-cards-area" id="cards-cutting" ondragover="Orders.handleDragOver(event)" ondragleave="Orders.handleDragLeave(event)" ondrop="Orders.handleDrop(event, 'CUTTING')"></div>
                </div>

                <!-- Column 3: Stitching -->
                <div class="kanban-column" data-status="STITCHING">
                    <div class="kanban-column-header">
                        <h3>Stitching</h3>
                        <span class="kanban-card-count" id="count-stitching">0</span>
                    </div>
                    <div class="kanban-cards-area" id="cards-stitching" ondragover="Orders.handleDragOver(event)" ondragleave="Orders.handleDragLeave(event)" ondrop="Orders.handleDrop(event, 'STITCHING')"></div>
                </div>

                <!-- Column 4: Ready -->
                <div class="kanban-column" data-status="READY">
                    <div class="kanban-column-header">
                        <h3>Ready</h3>
                        <span class="kanban-card-count" id="count-ready">0</span>
                    </div>
                    <div class="kanban-cards-area" id="cards-ready" ondragover="Orders.handleDragOver(event)" ondragleave="Orders.handleDragLeave(event)" ondrop="Orders.handleDrop(event, 'READY')"></div>
                </div>

                <!-- Column 5: Delivered -->
                <div class="kanban-column" data-status="DELIVERED">
                    <div class="kanban-column-header">
                        <h3>Delivered</h3>
                        <span class="kanban-card-count" id="count-delivered">0</span>
                    </div>
                    <div class="kanban-cards-area" id="cards-delivered" ondragover="Orders.handleDragOver(event)" ondragleave="Orders.handleDragLeave(event)" ondrop="Orders.handleDrop(event, 'DELIVERED')"></div>
                </div>
            </div>
        `;

        await this.loadList();
    },

    async loadList() {
        try {
            const response = await fetch(`${App.API_BASE}/orders`);
            if (response.ok) {
                this.list = await response.json();
                this.renderCards();
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            App.showToast('Failed to load orders from database.', 'error');
        }
    },

    renderCards() {
        // Clear all columns
        const columns = ['PENDING', 'CUTTING', 'STITCHING', 'READY', 'DELIVERED'];
        columns.forEach(col => {
            const area = document.getElementById(`cards-${col.toLowerCase()}`);
            if (area) area.innerHTML = '';
            
            const countBadge = document.getElementById(`count-${col.toLowerCase()}`);
            if (countBadge) countBadge.innerText = '0';
        });

        // Filter and sort items to inject
        this.list.forEach(order => {
            const status = order.status;
            const area = document.getElementById(`cards-${status.toLowerCase()}`);
            if (!area) return;

            // Priority logic class selection
            let priorityClass = 'on-schedule';
            if (order.priority === 'URGENT') priorityClass = 'urgent';
            else if (order.priority === 'NEAR_DEADLINE') priorityClass = 'near-deadline';

            const card = document.createElement('div');
            card.className = `kanban-card ${priorityClass}`;
            card.draggable = true;
            card.id = `order-${order.id}`;
            card.setAttribute('ondragstart', `Orders.handleDragStart(event, ${order.id})`);
            card.onclick = () => this.openOrderDetails(order.id);

            card.innerHTML = `
                <div class="kanban-card-header">
                    <span class="kanban-order-no">${order.orderNumber}</span>
                    <span class="badge ${order.paymentStatus === 'PAID' ? 'badge-success' : 'badge-danger'}" style="font-size: 8px; padding: 2px 4px;">
                        ${order.paymentStatus}
                    </span>
                </div>
                <div class="kanban-card-body">
                    <h4>${order.customer.name}</h4>
                    <span class="kanban-dress-type">${order.dressType}</span>
                </div>
                <div class="kanban-card-footer">
                    <span class="kanban-date"><i class="fa-regular fa-clock"></i> ${App.formatDate(order.deliveryDate)}</span>
                    <span class="kanban-tailor">${order.assignedTailor || 'Unassigned'}</span>
                </div>
            `;

            area.appendChild(card);
        });

        // Update counts
        columns.forEach(col => {
            const area = document.getElementById(`cards-${col.toLowerCase()}`);
            const countBadge = document.getElementById(`count-${col.toLowerCase()}`);
            if (area && countBadge) {
                countBadge.innerText = area.children.length;
            }
        });
    },

    // HTML5 Drag and Drop Handlers
    handleDragStart(e, orderId) {
        e.dataTransfer.setData('text/plain', orderId);
        e.dataTransfer.effectAllowed = 'move';
    },

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    },

    handleDragLeave(e) {
        e.currentTarget.classList.remove('dragover');
    },

    async handleDrop(e, newStatus) {
        e.preventDefault();
        const area = e.currentTarget;
        area.classList.remove('dragover');

        const orderId = e.dataTransfer.getData('text/plain');
        if (!orderId) return;

        // Perform backend state transition API call
        try {
            const response = await fetch(`${App.API_BASE}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                
                // Update local model
                const idx = this.list.findIndex(o => o.id == orderId);
                if (idx !== -1) {
                    this.list[idx] = updatedOrder;
                }

                App.showToast(`Order #${updatedOrder.orderNumber} moved to ${newStatus}`, 'success');
                this.renderCards();
            } else {
                App.showToast('Failed to update order status.', 'error');
            }
        } catch (error) {
            console.error('Error dragging order:', error);
            App.showToast('Connection failed. Status not updated.', 'error');
        }
    },

    async openOrderDetails(id) {
        const order = this.list.find(o => o.id === id);
        if (!order) return;

        let billingActionHtml = '';
        if (order.status === 'READY' || order.status === 'DELIVERED') {
            // Check if invoice already exists
            try {
                const response = await fetch(`${App.API_BASE}/invoices/order/${id}`);
                if (response.status === 404) {
                    billingActionHtml = `
                        <div style="margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">Order is finished. Generate a sales invoice.</p>
                            <button class="btn btn-primary btn-sm btn-block" onclick="App.closeDrawer(); Billing.openBillingGenerator(${order.id})">
                                <i class="fa-solid fa-file-invoice-dollar"></i> Generate Invoice
                            </button>
                        </div>
                    `;
                } else if (response.ok) {
                    const invoice = await response.json();
                    billingActionHtml = `
                        <div style="margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                            <button class="btn btn-secondary btn-sm btn-block" onclick="App.closeDrawer(); Billing.viewInvoice(${invoice.id})">
                                <i class="fa-regular fa-file-lines"></i> View Sales Invoice
                            </button>
                        </div>
                    `;
                }
            } catch (e) {
                console.error(e);
            }
        }

        const bodyHtml = `
            <div class="profile-card-header">
                <div class="profile-photo-large" style="background: linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%);"><i class="fa-solid fa-scissors"></i></div>
                <h4>${order.customer.name}</h4>
                <p>Order Reference: ${order.orderNumber}</p>
            </div>

            <div class="profile-section-title">Order Particulars</div>
            <div class="profile-info-grid">
                <div class="profile-info-item"><label>Dress Type</label><span>${order.dressType}</span></div>
                <div class="profile-info-item"><label>Production Stage</label><span class="badge badge-info">${order.status}</span></div>
                <div class="profile-info-item"><label>Priority</label><span class="badge ${order.priority === 'URGENT' ? 'badge-danger' : 'badge-warning'}">${order.priority}</span></div>
                <div class="profile-info-item"><label>Target Delivery</label><span>${App.formatDate(order.deliveryDate)}</span></div>
                <div class="profile-info-item"><label>Assigned Tailor</label><span>${order.assignedTailor || 'Unassigned'}</span></div>
                <div class="profile-info-item"><label>Order Price</label><span style="color: var(--accent); font-weight: 600;">₹${order.totalAmount.toLocaleString('en-IN')}</span></div>
                <div class="profile-info-item"><label>Payment Status</label><span class="badge ${order.paymentStatus === 'PAID' ? 'badge-success' : 'badge-danger'}">${order.paymentStatus}</span></div>
            </div>

            <div style="margin-top: 24px; display: flex; gap: 12px;">
                <button class="btn btn-secondary btn-sm flex-1" onclick="Orders.openEditOrder(${order.id})"><i class="fa-regular fa-pen-to-square"></i> Modify Details</button>
            </div>

            ${billingActionHtml}
        `;

        App.openDrawer('Order Tracking Card', bodyHtml);
    },

    async openCreateOrder(customerId = null) {
        // Fetch customers list for dropdown
        let customers = [];
        try {
            const response = await fetch(`${App.API_BASE}/customers`);
            if (response.ok) {
                customers = await response.json();
            }
        } catch (e) {
            console.error('Error fetching customers:', e);
        }

        const bodyHtml = `
            <form id="create-order-form" onsubmit="Orders.handleCreateOrder(event)">
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Select Customer *</label>
                    <select id="ord-customerId" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);" required>
                        <option value="">-- Choose Customer --</option>
                        ${customers.map(c => `<option value="${c.id}" ${customerId == c.id ? 'selected' : ''}>${c.name} (${c.phone})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Dress Style / Garment Description *</label>
                    <input type="text" id="ord-dressType" placeholder="e.g. 3-Piece Navy Wool Suit" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Assigned Tailor</label>
                    <select id="ord-tailor" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                        <option value="Unassigned">-- Select Tailor --</option>
                        <option value="Master Aslam">Master Aslam (Senior Tailor)</option>
                        <option value="Master Bahadur">Master Bahadur (Stitcher)</option>
                    </select>
                </div>
                <div class="profile-info-grid" style="margin-bottom: 16px;">
                    <div class="form-group">
                        <label>Delivery Target *</label>
                        <input type="date" id="ord-deliveryDate" required>
                    </div>
                    <div class="form-group">
                        <label>Total Price (INR) *</label>
                        <input type="number" id="ord-price" placeholder="15000" required>
                    </div>
                </div>
                <div class="profile-info-grid" style="margin-bottom: 24px;">
                    <div class="form-group">
                        <label>Priority level</label>
                        <select id="ord-priority" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                            <option value="ON_SCHEDULE">On Schedule</option>
                            <option value="NEAR_DEADLINE">Near Deadline</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Initial Stage</label>
                        <select id="ord-status" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                            <option value="PENDING">Pending</option>
                            <option value="CUTTING">Cutting</option>
                            <option value="STITCHING">Stitching</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeDrawer()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Job Ticket</button>
                </div>
            </form>
        `;
        App.openDrawer('Create Production Order', bodyHtml);
    },

    async handleCreateOrder(e) {
        e.preventDefault();
        const payload = {
            customer: { id: parseInt(document.getElementById('ord-customerId').value) },
            dressType: document.getElementById('ord-dressType').value.trim(),
            assignedTailor: document.getElementById('ord-tailor').value,
            deliveryDate: document.getElementById('ord-deliveryDate').value,
            totalAmount: parseFloat(document.getElementById('ord-price').value),
            priority: document.getElementById('ord-priority').value,
            status: document.getElementById('ord-status').value
        };

        if (payload.assignedTailor === 'Unassigned') {
            payload.assignedTailor = null;
        }

        try {
            const response = await fetch(`${App.API_BASE}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                App.showToast('Job ticket created and added to pipeline!', 'success');
                App.closeDrawer();
                this.loadList();
            } else {
                App.showToast('Failed to create order.', 'error');
            }
        } catch (error) {
            console.error('Error creating order:', error);
        }
    },

    openEditOrder(id) {
        const order = this.list.find(o => o.id === id);
        if (!order) return;

        const bodyHtml = `
            <form id="edit-order-form" onsubmit="Orders.handleEditOrder(event, ${id})">
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Dress Style Description *</label>
                    <input type="text" id="edit-ord-dressType" value="${order.dressType}" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Assigned Tailor</label>
                    <select id="edit-ord-tailor" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                        <option value="Unassigned" ${!order.assignedTailor ? 'selected' : ''}>-- Unassigned --</option>
                        <option value="Master Aslam" ${order.assignedTailor === 'Master Aslam' ? 'selected' : ''}>Master Aslam (Senior Tailor)</option>
                        <option value="Master Bahadur" ${order.assignedTailor === 'Master Bahadur' ? 'selected' : ''}>Master Bahadur (Stitcher)</option>
                    </select>
                </div>
                <div class="profile-info-grid" style="margin-bottom: 16px;">
                    <div class="form-group">
                        <label>Delivery Target *</label>
                        <input type="date" id="edit-ord-deliveryDate" value="${order.deliveryDate}" required>
                    </div>
                    <div class="form-group">
                        <label>Total Price (INR) *</label>
                        <input type="number" id="edit-ord-price" value="${order.totalAmount}" required>
                    </div>
                </div>
                <div class="profile-info-grid" style="margin-bottom: 24px;">
                    <div class="form-group">
                        <label>Priority level</label>
                        <select id="edit-ord-priority" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                            <option value="ON_SCHEDULE" ${order.priority === 'ON_SCHEDULE' ? 'selected' : ''}>On Schedule</option>
                            <option value="NEAR_DEADLINE" ${order.priority === 'NEAR_DEADLINE' ? 'selected' : ''}>Near Deadline</option>
                            <option value="URGENT" ${order.priority === 'URGENT' ? 'selected' : ''}>Urgent</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Production Stage</label>
                        <select id="edit-ord-status" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                            <option value="PENDING" ${order.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                            <option value="CUTTING" ${order.status === 'CUTTING' ? 'selected' : ''}>Cutting</option>
                            <option value="STITCHING" ${order.status === 'STITCHING' ? 'selected' : ''}>Stitching</option>
                            <option value="READY" ${order.status === 'READY' ? 'selected' : ''}>Ready</option>
                            <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeDrawer()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Job Ticket</button>
                </div>
            </form>
        `;
        App.openDrawer('Edit Production Order', bodyHtml);
    },

    async handleEditOrder(e, id) {
        e.preventDefault();
        const payload = {
            dressType: document.getElementById('edit-ord-dressType').value.trim(),
            assignedTailor: document.getElementById('edit-ord-tailor').value,
            deliveryDate: document.getElementById('edit-ord-deliveryDate').value,
            totalAmount: parseFloat(document.getElementById('edit-ord-price').value),
            priority: document.getElementById('edit-ord-priority').value,
            status: document.getElementById('edit-ord-status').value
        };

        if (payload.assignedTailor === 'Unassigned') {
            payload.assignedTailor = null;
        }

        try {
            const response = await fetch(`${App.API_BASE}/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                App.showToast('Order details modified!', 'success');
                App.closeDrawer();
                this.loadList();
            } else {
                App.showToast('Failed to modify order.', 'error');
            }
        } catch (error) {
            console.error('Error editing order:', error);
        }
    }
};
