// Billing Module & Invoice Generator
const Billing = {
    invoices: [],

    async render(container) {
        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Billing & Invoices</h2>
                    <p>Track bills, manage accounts, process UPI/Card transactions, and download receipts.</p>
                </div>
                <button class="btn btn-primary" onclick="Billing.openBillingGenerator()"><i class="fa-solid fa-file-invoice-dollar"></i> Generate Invoice</button>
            </div>

            <div class="table-card">
                <!-- Invoices Table Grid -->
                <div class="grid-container">
                    <table class="data-grid" id="invoices-grid">
                        <thead>
                            <tr>
                                <th>Invoice No.</th>
                                <th>Order Ref</th>
                                <th>Customer Name</th>
                                <th>Subtotal</th>
                                <th>GST (18%)</th>
                                <th>Discount</th>
                                <th>Grand Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="invoices-list-rows">
                            <tr>
                                <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-secondary);">Loading accounts ledger...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        await this.loadList();
    },

    async loadList() {
        try {
            const response = await fetch(`${App.API_BASE}/invoices`);
            if (response.ok) {
                this.invoices = await response.json();
                this.renderTableRows();
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    },

    renderTableRows() {
        const tbody = document.getElementById('invoices-list-rows');
        if (!tbody) return;

        if (this.invoices.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">No billing invoices issued yet.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.invoices.map(inv => {
            const statusBadge = inv.paymentStatus === 'PAID' ? 'badge-success' : 'badge-danger';
            return `
                <tr>
                    <td><strong>${inv.invoiceNumber}</strong></td>
                    <td>${inv.order.orderNumber}</td>
                    <td><strong>${inv.order.customer.name}</strong></td>
                    <td>₹${inv.subtotal.toLocaleString('en-IN')}</td>
                    <td>₹${inv.gstAmount.toLocaleString('en-IN')}</td>
                    <td>₹${inv.discountAmount.toLocaleString('en-IN')}</td>
                    <td><strong>₹${inv.grandTotal.toLocaleString('en-IN')}</strong></td>
                    <td><span class="badge ${statusBadge}">${inv.paymentStatus}</span></td>
                    <td>
                        <div class="actions-cell">
                            <button class="action-btn" title="View & Print Invoice" onclick="Billing.viewInvoice(${inv.id})"><i class="fa-regular fa-file-lines"></i></button>
                            ${inv.paymentStatus === 'UNPAID' ? `
                                <button class="action-btn edit" title="Settle Invoice" onclick="Billing.settleInvoice(${inv.id})"><i class="fa-solid fa-hand-holding-dollar"></i></button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    async openBillingGenerator(orderId = null) {
        // Fetch orders that don't have invoices yet
        let pendingOrders = [];
        try {
            const response = await fetch(`${App.API_BASE}/orders`);
            if (response.ok) {
                const orders = await response.json();
                // Filter to only non-delivered/ready orders, or if orderId is preselected
                pendingOrders = orders.filter(o => o.status === 'READY' || o.status === 'DELIVERED' || o.id === orderId);
            }
        } catch (e) {
            console.error('Error fetching orders:', e);
        }

        const bodyHtml = `
            <form id="generate-invoice-form" onsubmit="Billing.handleGenerateInvoice(event)">
                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Select Production Order *</label>
                    <select id="inv-orderId" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);" required onchange="Billing.updatePricePlaceholder(this.value)">
                        <option value="">-- Select Completed/Ready Order --</option>
                        ${pendingOrders.map(o => `<option value="${o.id}" ${orderId == o.id ? 'selected' : ''} data-price="${o.totalAmount}">${o.orderNumber} - ${o.customer.name} (${o.dressType}) - ₹${o.totalAmount}</option>`).join('')}
                    </select>
                </div>
                
                <div style="background-color: var(--bg-light); padding: 14px; border-radius: var(--border-radius-md); margin-bottom: 16px; font-size: 13px;">
                    <p><strong>Base Order Value:</strong> <span id="inv-placeholder-base">₹0</span></p>
                    <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">* Note: System will automatically add 18% GST onto the taxable value (Base - Discount).</p>
                </div>

                <div class="profile-info-grid" style="margin-bottom: 16px;">
                    <div class="form-group">
                        <label>Discount Amount (INR)</label>
                        <input type="number" id="inv-discount" value="0" placeholder="0">
                    </div>
                    <div class="form-group">
                        <label>Payment Method</label>
                        <select id="inv-method" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                            <option value="UPI">UPI / QR Scan</option>
                            <option value="CASH">Cash Payment</option>
                            <option value="CARD">Debit/Credit Card</option>
                        </select>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                    <label>Payment Status</label>
                    <select id="inv-status" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                        <option value="PAID">Paid / Settled</option>
                        <option value="UNPAID">Unpaid / Credit Ledger</option>
                    </select>
                </div>

                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeDrawer()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Generate Invoice</button>
                </div>
            </form>
        `;
        App.openDrawer('Generate Invoice', bodyHtml);
        
        if (orderId) {
            this.updatePricePlaceholder(orderId);
        }
    },

    updatePricePlaceholder(orderId) {
        if (!orderId) {
            document.getElementById('inv-placeholder-base').innerText = '₹0';
            return;
        }
        const select = document.getElementById('inv-orderId');
        const selectedOption = select.options[select.selectedIndex];
        const basePrice = parseFloat(selectedOption.getAttribute('data-price')) || 0;
        document.getElementById('inv-placeholder-base').innerText = `₹${basePrice.toLocaleString('en-IN')}`;
    },

    async handleGenerateInvoice(e) {
        e.preventDefault();
        const payload = {
            orderId: parseInt(document.getElementById('inv-orderId').value),
            discountAmount: parseFloat(document.getElementById('inv-discount').value) || 0.0,
            paymentMethod: document.getElementById('inv-method').value,
            paymentStatus: document.getElementById('inv-status').value
        };

        try {
            const response = await fetch(`${App.API_BASE}/invoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                App.showToast('Sales invoice generated successfully!', 'success');
                App.closeDrawer();
                // Reload billing page
                this.render(document.getElementById('content-viewport'));
            } else {
                const errMsg = await response.text();
                App.showToast(errMsg || 'Failed to generate invoice.', 'error');
            }
        } catch (error) {
            console.error('Invoice error:', error);
        }
    },

    async viewInvoice(id) {
        try {
            const response = await fetch(`${App.API_BASE}/invoices/${id}`);
            if (response.ok) {
                const inv = await response.json();
                
                // UPI QR Code visual container (mocking UPI scanning image)
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(inv.qrPayload)}`;
                
                const bodyHtml = `
                    <div class="invoice-preview-card">
                        <!-- Invoice Header -->
                        <div class="invoice-header">
                            <div class="invoice-brand">
                                <h2>TailorSys Boutique</h2>
                                <p>GSTIN: 07AAAAA1111A1Z0</p>
                                <p>12, Fashion Enclave, Connaught Place, New Delhi</p>
                            </div>
                            <div class="invoice-number-block">
                                <h3>INVOICE</h3>
                                <p><strong>No:</strong> ${inv.invoiceNumber}</p>
                                <p><strong>Date:</strong> ${App.formatDate(inv.generatedAt.split('T')[0])}</p>
                            </div>
                        </div>

                        <!-- Billing Information -->
                        <div class="invoice-billing-row">
                            <div class="invoice-billing-col">
                                <h4>Billed To:</h4>
                                <p><strong>${inv.order.customer.name}</strong></p>
                                <p>Phone: ${inv.order.customer.phone}</p>
                                <p>Email: ${inv.order.customer.email || 'N/A'}</p>
                            </div>
                            <div class="invoice-billing-col" style="text-align: right;">
                                <h4>Payment Status:</h4>
                                <span class="badge ${inv.paymentStatus === 'PAID' ? 'badge-success' : 'badge-danger'}" style="font-size: 13px; padding: 4px 10px;">
                                    ${inv.paymentStatus}
                                </span>
                                <p style="margin-top: 8px;"><strong>Method:</strong> ${inv.paymentMethod || 'Credit Ledger'}</p>
                            </div>
                        </div>

                        <!-- Invoice Table -->
                        <table class="invoice-details-table">
                            <thead>
                                <tr>
                                    <th>Job Description</th>
                                    <th style="text-align: right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>${inv.order.dressType}</strong>
                                        <p style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Order Code: ${inv.order.orderNumber} | Target: ${App.formatDate(inv.order.deliveryDate)}</p>
                                    </td>
                                    <td style="text-align: right;">₹${inv.subtotal.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Bottom Section -->
                        <div class="invoice-summary-block">
                            <!-- QR Payment Scan -->
                            ${inv.paymentStatus === 'UNPAID' ? `
                                <div class="invoice-qr-section">
                                    <div class="qr-code-placeholder">
                                        <img src="${qrUrl}" alt="UPI QR Code" style="width: 70px; height: 70px;">
                                    </div>
                                    <div class="qr-text">
                                        <h5>Scan to Pay UPI</h5>
                                        <p>Scan using GPay, PhonePe or Paytm to settle ₹${inv.grandTotal.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ` : `
                                <div style="color: var(--success); font-weight: 500; font-style: italic;">
                                    <i class="fa-solid fa-circle-check"></i> Slipped Receipt - Settle completed.
                                </div>
                            `}

                            <!-- Price Breakdowns -->
                            <div class="invoice-totals">
                                <div class="invoice-total-row">
                                    <span>Subtotal:</span>
                                    <span>₹${inv.subtotal.toFixed(2)}</span>
                                </div>
                                <div class="invoice-total-row">
                                    <span>Discount:</span>
                                    <span>-₹${inv.discountAmount.toFixed(2)}</span>
                                </div>
                                <div class="invoice-total-row">
                                    <span>GST (18%):</span>
                                    <span>₹${inv.gstAmount.toFixed(2)}</span>
                                </div>
                                <div class="invoice-total-row grand">
                                    <span>Total:</span>
                                    <span>₹${inv.grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Print / Settle controls -->
                    <div class="invoice-actions">
                        <button class="btn btn-secondary" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Invoice</button>
                        ${inv.paymentStatus === 'UNPAID' ? `
                            <button class="btn btn-primary" onclick="Billing.settleInvoice(${inv.id})"><i class="fa-solid fa-circle-check"></i> Settle Payment</button>
                        ` : ''}
                    </div>
                `;

                App.openDrawer('Invoice Preview', bodyHtml);
            }
        } catch (e) {
            console.error(e);
        }
    },

    async settleInvoice(id) {
        if (!confirm('Mark this invoice as PAID and settle order accounts?')) return;

        try {
            const response = await fetch(`${App.API_BASE}/invoices/${id}/pay`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentMethod: 'UPI' })
            });

            if (response.ok) {
                App.showToast('Invoice paid and settled!', 'success');
                App.closeDrawer();
                this.render(document.getElementById('content-viewport'));
            } else {
                App.showToast('Failed to update invoice.', 'error');
            }
        } catch (error) {
            console.error(error);
        }
    }
};
