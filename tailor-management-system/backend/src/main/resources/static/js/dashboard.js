// Dashboard View Component
const Dashboard = {
    charts: {},

    async render(container) {
        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Dashboard</h2>
                    <p>Overview of boutique operations, schedule, and revenue.</p>
                </div>
            </div>

            <!-- 6 KPI Cards Grid -->
            <div class="kpi-grid" id="kpi-container">
                <!-- Skeletons while loading -->
                ${this.renderSkeletons(6)}
            </div>

            <!-- Dashboard Analytics & Schedule -->
            <div class="dashboard-columns">
                <div class="dashboard-left">
                    <!-- Charts Grid -->
                    <div class="charts-grid-row">
                        <div class="chart-card">
                            <h3>Monthly Revenue Trend (INR)</h3>
                            <canvas id="chart-revenue"></canvas>
                        </div>
                        <div class="chart-card">
                            <h3>Orders by Dress Category</h3>
                            <canvas id="chart-category"></canvas>
                        </div>
                        <div class="chart-card">
                            <h3>Order Pipeline Status</h3>
                            <canvas id="chart-status"></canvas>
                        </div>
                        <div class="chart-card">
                            <h3>Fabric Consumption (Meters)</h3>
                            <canvas id="chart-inventory"></canvas>
                        </div>
                    </div>
                </div>

                <div class="dashboard-right">
                    <!-- Quick Actions -->
                    <div class="quick-actions-card">
                        <h3>Quick Actions</h3>
                        <div class="actions-btn-stack">
                            <button class="btn btn-primary" onclick="Customers.openAddCustomer()"><i class="fa-solid fa-user-plus"></i> Add Customer</button>
                            <button class="btn btn-secondary" onclick="Orders.openCreateOrder()"><i class="fa-solid fa-file-signature"></i> Create Order</button>
                            <button class="btn btn-secondary" onclick="Measurements.openAddMeasurementSelector()"><i class="fa-solid fa-ruler"></i> Add Measurement</button>
                            <button class="btn btn-secondary" onclick="Billing.openBillingGenerator()"><i class="fa-solid fa-file-invoice-dollar"></i> Generate Invoice</button>
                            <button class="btn btn-secondary" onclick="Inventory.openAddInventory()"><i class="fa-solid fa-cubes"></i> Update Inventory</button>
                        </div>
                    </div>

                    <!-- Today's Schedule -->
                    <div class="timeline-card">
                        <h3>Today's Deliveries</h3>
                        <div class="timeline-view" id="schedule-timeline">
                            <p class="text-muted">Loading schedule...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Load dashboard data
        await this.loadKPIs();
        await this.loadSchedule();
        await this.loadCharts();
    },

    renderSkeletons(count) {
        let skeletons = '';
        for (let i = 0; i < count; i++) {
            skeletons += `
                <div class="kpi-card skeleton">
                    <div style="width: 100%">
                        <div style="height: 14px; background: #e2e8f0; border-radius: 4px; width: 60%; margin-bottom: 12px;"></div>
                        <div style="height: 28px; background: #e2e8f0; border-radius: 4px; width: 40%;"></div>
                    </div>
                </div>
            `;
        }
        return skeletons;
    },

    async loadKPIs() {
        try {
            const response = await fetch(`${App.API_BASE}/orders/kpis`);
            if (response.ok) {
                const kpis = await response.json();
                const container = document.getElementById('kpi-container');
                container.innerHTML = `
                    <!-- Total Customers -->
                    <div class="kpi-card">
                        <div class="kpi-left">
                            <h3>Total Customers</h3>
                            <div class="kpi-number">${kpis.totalCustomers}</div>
                            <span class="trend-indicator up"><i class="fa-solid fa-arrow-trend-up"></i> ${kpis.customersTrend}</span>
                        </div>
                        <div class="kpi-icon-box blue"><i class="fa-solid fa-users"></i></div>
                    </div>

                    <!-- Active Orders -->
                    <div class="kpi-card">
                        <div class="kpi-left">
                            <h3>Active Orders</h3>
                            <div class="kpi-number">${kpis.activeOrders}</div>
                            <span class="trend-indicator up"><i class="fa-solid fa-arrow-trend-up"></i> ${kpis.ordersTrend}</span>
                        </div>
                        <div class="kpi-icon-box blue"><i class="fa-solid fa-clipboard-list"></i></div>
                    </div>

                    <!-- Pending Deliveries -->
                    <div class="kpi-card">
                        <div class="kpi-left">
                            <h3>Pending Deliveries</h3>
                            <div class="kpi-number">${kpis.pendingDeliveries}</div>
                            <span class="trend-indicator down"><i class="fa-solid fa-arrow-trend-down"></i> ${kpis.deliveriesTrend}</span>
                        </div>
                        <div class="kpi-icon-box amber"><i class="fa-solid fa-truck-fast"></i></div>
                    </div>

                    <!-- Revenue This Month -->
                    <div class="kpi-card">
                        <div class="kpi-left">
                            <h3>Revenue This Month</h3>
                            <div class="kpi-number">₹${kpis.revenue.toLocaleString('en-IN')}</div>
                            <span class="trend-indicator up"><i class="fa-solid fa-arrow-trend-up"></i> ${kpis.revenueTrend}</span>
                        </div>
                        <div class="kpi-icon-box green"><i class="fa-solid fa-indian-rupee-sign"></i></div>
                    </div>

                    <!-- Low Stock Items -->
                    <div class="kpi-card">
                        <div class="kpi-left">
                            <h3>Low Stock Fabrics</h3>
                            <div class="kpi-number">${kpis.lowStockItems}</div>
                            <span class="trend-indicator ${kpis.lowStockItems > 0 ? 'down' : 'up'}">
                                <i class="fa-solid ${kpis.lowStockItems > 0 ? 'fa-triangle-exclamation' : 'fa-check'}"></i> 
                                ${kpis.lowStockItems > 0 ? 'Needs restock' : 'All good'}
                            </span>
                        </div>
                        <div class="kpi-icon-box red"><i class="fa-solid fa-boxes-stacked"></i></div>
                    </div>

                    <!-- Completed Orders -->
                    <div class="kpi-card">
                        <div class="kpi-left">
                            <h3>Completed Orders</h3>
                            <div class="kpi-number">${kpis.completedOrders}</div>
                            <span class="trend-indicator up"><i class="fa-solid fa-arrow-trend-up"></i> ${kpis.completedTrend}</span>
                        </div>
                        <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading KPIs:', error);
            App.showToast('Failed to load KPI statistics.', 'error');
        }
    },

    async loadSchedule() {
        try {
            const response = await fetch(`${App.API_BASE}/orders/todays-schedule`);
            const container = document.getElementById('schedule-timeline');
            if (response.ok) {
                const schedule = await response.json();
                if (schedule.length === 0) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 20px 0;">
                            <i class="fa-solid fa-calendar-check" style="font-size: 32px; color: var(--text-muted); margin-bottom: 8px; display: block;"></i>
                            <p style="color: var(--text-secondary); font-size: 13px;">No deliveries scheduled for today.</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = schedule.map(order => {
                    let dotClass = 'success';
                    if (order.priority === 'URGENT') dotClass = 'urgent';
                    else if (order.priority === 'NEAR_DEADLINE') dotClass = 'warning';

                    return `
                        <div class="timeline-item">
                            <div class="timeline-dot ${dotClass}"></div>
                            <div class="timeline-content">
                                <div class="timeline-meta">
                                    <span class="timeline-name">${order.customer.name}</span>
                                    <span class="timeline-time">${order.orderNumber}</span>
                                </div>
                                <div class="timeline-details">
                                    <span>${order.dressType}</span>
                                    <span class="badge ${order.status === 'READY' ? 'badge-success' : 'badge-warning'}">${order.status}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Error loading timeline schedule:', error);
        }
    },

    async loadCharts() {
        try {
            const response = await fetch(`${App.API_BASE}/reports/analytics`);
            if (response.ok) {
                const data = await response.json();

                // Destroy old charts to prevent duplicate canvases on reload
                Object.keys(this.charts).forEach(key => {
                    if (this.charts[key]) this.charts[key].destroy();
                });

                // Chart 1: Revenue Trend (Line / Area)
                const revCtx = document.getElementById('chart-revenue').getContext('2d');
                const revMonths = Object.keys(data.revenueTrend);
                const revValues = Object.values(data.revenueTrend);
                this.charts.revenue = new Chart(revCtx, {
                    type: 'line',
                    data: {
                        labels: revMonths,
                        datasets: [{
                            label: 'Revenue (₹)',
                            data: revValues,
                            borderColor: '#3066be',
                            backgroundColor: 'rgba(48, 102, 190, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } }
                    }
                });

                // Chart 2: Category distribution (Donut / Polar)
                const catCtx = document.getElementById('chart-category').getContext('2d');
                const catLabels = Object.keys(data.categoryDistribution);
                const catValues = Object.values(data.categoryDistribution);
                this.charts.category = new Chart(catCtx, {
                    type: 'doughnut',
                    data: {
                        labels: catLabels,
                        datasets: [{
                            data: catValues,
                            backgroundColor: ['#0d1b2a', '#1b4965', '#3066be', '#10b981', '#f59e0b', '#ef4444'],
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
                    }
                });

                // Chart 3: Order Pipeline Status (Bar)
                const statCtx = document.getElementById('chart-status').getContext('2d');
                const statLabels = Object.keys(data.statusDistribution);
                const statValues = Object.values(data.statusDistribution);
                this.charts.status = new Chart(statCtx, {
                    type: 'bar',
                    data: {
                        labels: statLabels,
                        datasets: [{
                            data: statValues,
                            backgroundColor: ['#f59e0b', '#3066be', '#1b4965', '#10b981', '#0d1b2a'],
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } }
                    }
                });

                // Chart 4: Fabric Consumption (Horizontal Bar)
                const invCtx = document.getElementById('chart-inventory').getContext('2d');
                const invLabels = Object.keys(data.inventoryConsumption);
                const invValues = Object.values(data.inventoryConsumption);
                this.charts.inventory = new Chart(invCtx, {
                    type: 'bar',
                    data: {
                        labels: invLabels,
                        datasets: [{
                            data: invValues,
                            backgroundColor: 'rgba(16, 185, 129, 0.85)',
                            borderRadius: 6
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { x: { beginAtZero: true, grid: { color: '#e2e8f0' } }, y: { grid: { display: false } } }
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing dashboard charts:', error);
        }
    }
};
