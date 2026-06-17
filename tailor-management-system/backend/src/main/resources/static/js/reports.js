// Reports & Executive Analytics Module
const Reports = {
    charts: {},

    async render(container) {
        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Executive Analytics</h2>
                    <p>Analyze business revenue, customer growth trajectories, inventory consumption, and employee output metrics.</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary btn-sm" onclick="Reports.exportReport('CSV')"><i class="fa-solid fa-file-csv"></i> Export CSV</button>
                    <button class="btn btn-secondary btn-sm" onclick="Reports.exportReport('EXCEL')"><i class="fa-solid fa-file-excel"></i> Export Excel</button>
                    <button class="btn btn-primary btn-sm" onclick="window.print()"><i class="fa-solid fa-file-pdf"></i> Save PDF</button>
                </div>
            </div>

            <!-- Reports Charts Grid Layout -->
            <div class="charts-grid-row" style="grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 24px;">
                <div class="chart-card">
                    <div class="card-title-row">
                        <h3>Business Revenue Reports (Monthly)</h3>
                    </div>
                    <canvas id="rpt-revenue"></canvas>
                </div>

                <div class="chart-card">
                    <div class="card-title-row">
                        <h3>Customer Registration Growth</h3>
                    </div>
                    <canvas id="rpt-growth"></canvas>
                </div>

                <div class="chart-card">
                    <div class="card-title-row">
                        <h3>Tailor Production Tally</h3>
                    </div>
                    <canvas id="rpt-performance"></canvas>
                </div>

                <div class="chart-card">
                    <div class="card-title-row">
                        <h3>Inventory Ledger Logs Summaries</h3>
                    </div>
                    <canvas id="rpt-inventory-pie"></canvas>
                </div>
            </div>
        `;

        await this.loadCharts();
    },

    async loadCharts() {
        try {
            const response = await fetch(`${App.API_BASE}/reports/analytics`);
            if (response.ok) {
                const data = await response.json();

                // Destroy old charts if they exist
                Object.keys(this.charts).forEach(key => {
                    if (this.charts[key]) this.charts[key].destroy();
                });

                // Chart 1: Revenue (Area Line)
                const revCtx = document.getElementById('rpt-revenue').getContext('2d');
                this.charts.revenue = new Chart(revCtx, {
                    type: 'line',
                    data: {
                        labels: Object.keys(data.revenueTrend),
                        datasets: [{
                            label: 'Monthly Net Revenue (₹)',
                            data: Object.values(data.revenueTrend),
                            borderColor: '#3066be',
                            backgroundColor: 'rgba(48, 102, 190, 0.1)',
                            fill: true,
                            tension: 0.3
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });

                // Chart 2: Customer Growth (Line)
                const growthCtx = document.getElementById('rpt-growth').getContext('2d');
                // Mocking customer registrations per month
                this.charts.growth = new Chart(growthCtx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Total Customers Registered',
                            data: [35, 42, 58, 68, 85, 92],
                            borderColor: '#10b981',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            pointRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });

                // Chart 3: Tailor Performance (Bar Chart)
                const perfCtx = document.getElementById('rpt-performance').getContext('2d');
                // Standard order assignments count
                this.charts.performance = new Chart(perfCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Master Aslam', 'Master Bahadur'],
                        datasets: [{
                            label: 'Completed orders',
                            data: [4, 2],
                            backgroundColor: '#1b4965'
                        }, {
                            label: 'Active works',
                            data: [1, 2],
                            backgroundColor: '#3066be'
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true } }
                    }
                });

                // Chart 4: Inventory (Pie Chart)
                const invCtx = document.getElementById('rpt-inventory-pie').getContext('2d');
                this.charts.inventory = new Chart(invCtx, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(data.inventoryConsumption),
                        datasets: [{
                            data: Object.values(data.inventoryConsumption),
                            backgroundColor: ['#0d1b2a', '#1b4965', '#3066be', '#10b981', '#f59e0b']
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }
        } catch (error) {
            console.error('Error loading reports charts:', error);
        }
    },

    exportReport(format) {
        // Mock a CSV download representing the aggregated business data
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Metric,Value\r\n";
        csvContent += "Total Customers,92\r\n";
        csvContent += "Completed Orders,6\r\n";
        csvContent += "Total Fabric Restocked,130.5\r\n";
        csvContent += "Total Fabric Consumed,69.8\r\n";
        csvContent += "Monthly Net Revenue,₹2,95,000\r\n";

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `tailorsys_executive_report_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        App.showToast(`Report downloaded as ${format}!`, 'success');
    }
};
