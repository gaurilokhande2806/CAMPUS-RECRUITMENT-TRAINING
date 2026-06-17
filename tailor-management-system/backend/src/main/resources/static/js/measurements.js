// Measurement Management Module
const Measurements = {
    selectedCustomerId: null,
    history: [],
    activeVersion: null,

    async render(container) {
        // Fetch all customers for selector dropdown
        let customers = [];
        try {
            const response = await fetch(`${App.API_BASE}/customers`);
            if (response.ok) {
                customers = await response.json();
            }
        } catch (e) {
            console.error('Error fetching customers:', e);
        }

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Measurement Management</h2>
                    <p>Log sizing profiles, analyze version histories, and compare fitting revisions.</p>
                </div>
                <div class="flex-row" style="display: flex; gap: 12px; align-items: center;">
                    <select class="filter-select" id="measurement-customer-select" style="min-width: 200px;" onchange="Measurements.selectCustomer(this.value)">
                        <option value="">-- Select Customer --</option>
                        ${customers.map(c => `<option value="${c.id}" ${this.selectedCustomerId == c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                    <button class="btn btn-primary" id="btn-new-measurement" ${!this.selectedCustomerId ? 'disabled' : ''} onclick="Measurements.openNewMeasurementForm()"><i class="fa-solid fa-plus"></i> New Sizing</button>
                </div>
            </div>

            <div id="measurements-display-layout" class="${!this.selectedCustomerId ? '' : 'hidden'}" style="text-align: center; padding: 60px 0; background: white; border-radius: 12px; border: 1px solid var(--border-color);">
                <i class="fa-solid fa-ruler-combined" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px; display: block;"></i>
                <h3>Select a Customer</h3>
                <p style="color: var(--text-secondary); margin-top: 6px;">Please choose a client from the dropdown above to view or update sizes.</p>
            </div>

            <div id="measurements-details-view" class="${this.selectedCustomerId ? '' : 'hidden'} dashboard-columns">
                <div class="dashboard-left">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h3 id="active-version-title" style="font-family: inherit;">Version Profile</h3>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-secondary btn-sm" onclick="Measurements.openComparisonView()"><i class="fa-solid fa-arrows-left-right"></i> Comparison View</button>
                            <button class="btn btn-secondary btn-sm" onclick="Measurements.duplicateActive()"><i class="fa-solid fa-copy"></i> Duplicate & Edit</button>
                        </div>
                    </div>

                    <div class="measurement-cards-container">
                        <!-- Upper Body -->
                        <div class="measurement-section-card">
                            <h3><span>Upper Body</span><i class="fa-solid fa-shirt" style="color: var(--accent);"></i></h3>
                            <div class="measurement-fields-grid">
                                <div class="measurement-field-display"><label>Chest</label><span id="m-chest">-</span></div>
                                <div class="measurement-field-display"><label>Shoulder</label><span id="m-shoulder">-</span></div>
                                <div class="measurement-field-display"><label>Sleeve</label><span id="m-sleeve">-</span></div>
                                <div class="measurement-field-display"><label>Neck</label><span id="m-neck">-</span></div>
                            </div>
                        </div>

                        <!-- Lower Body -->
                        <div class="measurement-section-card">
                            <h3><span>Lower Body</span><i class="fa-solid fa-person-half-dress" style="color: var(--accent);"></i></h3>
                            <div class="measurement-fields-grid">
                                <div class="measurement-field-display"><label>Waist</label><span id="m-waist">-</span></div>
                                <div class="measurement-field-display"><label>Hip</label><span id="m-hip">-</span></div>
                                <div class="measurement-field-display"><label>Pant Length</label><span id="m-pant_length">-</span></div>
                                <div class="measurement-field-display"><label>Inseam</label><span id="m-inseam">-</span></div>
                            </div>
                        </div>

                        <!-- Special Notes -->
                        <div class="measurement-notes-card">
                            <h3>Special Fit Instructions & Posture Notes</h3>
                            <p id="m-notes">No special instructions registered.</p>
                        </div>
                    </div>
                </div>

                <div class="dashboard-right">
                    <div class="timeline-card">
                        <h3>Sizing Revisions</h3>
                        <ul class="history-list" id="measurement-history-list">
                            <!-- Populated dynamically -->
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    openAddMeasurementSelector() {
        // Triggered by dashboard quick action
        App.navigateTo('measurements');
    },

    async selectCustomer(customerId) {
        if (!customerId) {
            this.selectedCustomerId = null;
            this.history = [];
            this.activeVersion = null;
            document.getElementById('btn-new-measurement').disabled = true;
            document.getElementById('measurements-display-layout').classList.remove('hidden');
            document.getElementById('measurements-details-view').classList.add('hidden');
            return;
        }

        this.selectedCustomerId = customerId;
        document.getElementById('btn-new-measurement').disabled = false;
        document.getElementById('measurements-display-layout').classList.add('hidden');
        document.getElementById('measurements-details-view').classList.remove('hidden');

        await this.loadHistory();
    },

    async loadHistory() {
        try {
            const response = await fetch(`${App.API_BASE}/measurements/customer/${this.selectedCustomerId}`);
            if (response.ok) {
                this.history = await response.json();
                this.renderHistoryList();

                if (this.history.length > 0) {
                    this.setActiveVersion(this.history[0].id);
                } else {
                    this.clearFields();
                }
            }
        } catch (error) {
            console.error('Error fetching measurements:', error);
        }
    },

    renderHistoryList() {
        const list = document.getElementById('measurement-history-list');
        if (!list) return;

        if (this.history.length === 0) {
            list.innerHTML = `<li style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px 0;">No revisions recorded.</li>`;
            return;
        }

        list.innerHTML = this.history.map(m => `
            <li class="history-item ${this.activeVersion && this.activeVersion.id === m.id ? 'active' : ''}" onclick="Measurements.setActiveVersion(${m.id})">
                <div>
                    <strong>Version #${m.versionNum}</strong>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${App.formatDate(m.createdAt.split('T')[0])}</div>
                </div>
                <i class="fa-solid fa-chevron-right" style="color: var(--text-muted); font-size: 12px;"></i>
            </li>
        `).join('');
    },

    setActiveVersion(id) {
        const item = this.history.find(m => m.id === id);
        if (!item) return;

        this.activeVersion = item;

        // Highlight in list
        this.renderHistoryList();

        // Update fields
        document.getElementById('active-version-title').innerText = `Revision Version #${item.versionNum} Profile`;
        document.getElementById('m-chest').innerText = item.chest ? item.chest + '"' : '-';
        document.getElementById('m-shoulder').innerText = item.shoulder ? item.shoulder + '"' : '-';
        document.getElementById('m-sleeve').innerText = item.sleeve ? item.sleeve + '"' : '-';
        document.getElementById('m-neck').innerText = item.neck ? item.neck + '"' : '-';
        document.getElementById('m-waist').innerText = item.waist ? item.waist + '"' : '-';
        document.getElementById('m-hip').innerText = item.hip ? item.hip + '"' : '-';
        document.getElementById('m-pant_length').innerText = item.pantLength ? item.pantLength + '"' : '-';
        document.getElementById('m-inseam').innerText = item.inseam ? item.inseam + '"' : '-';
        document.getElementById('m-notes').innerText = item.notes || 'No special fit instructions registered.';
    },

    clearFields() {
        document.getElementById('active-version-title').innerText = 'No Sizes Registered';
        document.getElementById('m-chest').innerText = '-';
        document.getElementById('m-shoulder').innerText = '-';
        document.getElementById('m-sleeve').innerText = '-';
        document.getElementById('m-neck').innerText = '-';
        document.getElementById('m-waist').innerText = '-';
        document.getElementById('m-hip').innerText = '-';
        document.getElementById('m-pant_length').innerText = '-';
        document.getElementById('m-inseam').innerText = '-';
        document.getElementById('m-notes').innerText = 'Click "New Sizing" to add a measurement profile.';
    },

    openNewMeasurementForm(prefillData = null) {
        const bodyHtml = `
            <form id="measurement-form" onsubmit="Measurements.handleSaveMeasurement(event)">
                <div class="profile-section-title" style="margin-top: 0;">Upper Body (Inches)</div>
                <div class="profile-info-grid" style="margin-bottom: 20px;">
                    <div class="form-group"><label>Chest</label><input type="number" step="0.1" id="mform-chest" value="${prefillData?.chest || ''}"></div>
                    <div class="form-group"><label>Shoulder</label><input type="number" step="0.1" id="mform-shoulder" value="${prefillData?.shoulder || ''}"></div>
                    <div class="form-group"><label>Sleeve</label><input type="number" step="0.1" id="mform-sleeve" value="${prefillData?.sleeve || ''}"></div>
                    <div class="form-group"><label>Neck</label><input type="number" step="0.1" id="mform-neck" value="${prefillData?.neck || ''}"></div>
                </div>

                <div class="profile-section-title">Lower Body (Inches)</div>
                <div class="profile-info-grid" style="margin-bottom: 20px;">
                    <div class="form-group"><label>Waist</label><input type="number" step="0.1" id="mform-waist" value="${prefillData?.waist || ''}"></div>
                    <div class="form-group"><label>Hip</label><input type="number" step="0.1" id="mform-hip" value="${prefillData?.hip || ''}"></div>
                    <div class="form-group"><label>Pant Length</label><input type="number" step="0.1" id="mform-pantLength" value="${prefillData?.pantLength || ''}"></div>
                    <div class="form-group"><label>Inseam</label><input type="number" step="0.1" id="mform-inseam" value="${prefillData?.inseam || ''}"></div>
                </div>

                <div class="form-group">
                    <label>Fitting Notes & Body Posture Details</label>
                    <textarea id="mform-notes" rows="4" style="width: 100%; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 12px;" placeholder="e.g. Broad shoulders, slight stoop. Prefer comfort waist.">${prefillData?.notes || ''}</textarea>
                </div>

                <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeDrawer()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Sizing Record</button>
                </div>
            </form>
        `;
        App.openDrawer('Add Sizing Profile', bodyHtml);
    },

    async handleSaveMeasurement(e) {
        e.preventDefault();
        const payload = {
            customer: { id: this.selectedCustomerId },
            chest: parseFloat(document.getElementById('mform-chest').value) || null,
            shoulder: parseFloat(document.getElementById('mform-shoulder').value) || null,
            sleeve: parseFloat(document.getElementById('mform-sleeve').value) || null,
            neck: parseFloat(document.getElementById('mform-neck').value) || null,
            waist: parseFloat(document.getElementById('mform-waist').value) || null,
            hip: parseFloat(document.getElementById('mform-hip').value) || null,
            pantLength: parseFloat(document.getElementById('mform-pantLength').value) || null,
            inseam: parseFloat(document.getElementById('mform-inseam').value) || null,
            notes: document.getElementById('mform-notes').value.trim()
        };

        try {
            const response = await fetch(`${App.API_BASE}/measurements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                App.showToast('Sizing profile version saved!', 'success');
                App.closeDrawer();
                await this.loadHistory(); // Reload
            } else {
                App.showToast('Failed to save sizes.', 'error');
            }
        } catch (error) {
            console.error('Error saving measurement:', error);
        }
    },

    duplicateActive() {
        if (!this.activeVersion) return;
        this.openNewMeasurementForm(this.activeVersion);
    },

    openComparisonView() {
        if (this.history.length < 2) {
            App.showToast('Need at least 2 sizing records to compare.', 'warning');
            return;
        }

        const bodyHtml = `
            <div class="flex-row" style="display: flex; gap: 12px; margin-bottom: 20px;">
                <select class="filter-select flex-1" id="compare-v1" onchange="Measurements.updateComparison()">
                    ${this.history.map((m, idx) => `<option value="${m.id}" ${idx === 0 ? 'selected' : ''}>Version #${m.versionNum} (${App.formatDate(m.createdAt.split('T')[0])})</option>`).join('')}
                </select>
                <div style="align-self: center; font-weight: 600;">VS</div>
                <select class="filter-select flex-1" id="compare-v2" onchange="Measurements.updateComparison()">
                    ${this.history.map((m, idx) => `<option value="${m.id}" ${idx === 1 ? 'selected' : ''}>Version #${m.versionNum} (${App.formatDate(m.createdAt.split('T')[0])})</option>`).join('')}
                </select>
            </div>
            
            <div id="comparison-display-content">
                <!-- Loaded dynamically -->
            </div>
        `;
        App.openDrawer('Sizing Revision Comparison', bodyHtml);
        this.updateComparison();
    },

    updateComparison() {
        const id1 = parseInt(document.getElementById('compare-v1').value);
        const id2 = parseInt(document.getElementById('compare-v2').value);

        const m1 = this.history.find(m => m.id === id1);
        const m2 = this.history.find(m => m.id === id2);

        if (!m1 || !m2) return;

        const fields = [
            { label: 'Chest', key: 'chest' },
            { label: 'Shoulder', key: 'shoulder' },
            { label: 'Sleeve', key: 'sleeve' },
            { label: 'Neck', key: 'neck' },
            { label: 'Waist', key: 'waist' },
            { label: 'Hip', key: 'hip' },
            { label: 'Pant Length', key: 'pantLength' },
            { label: 'Inseam', key: 'inseam' }
        ];

        const displayContainer = document.getElementById('comparison-display-content');
        displayContainer.innerHTML = `
            <table class="data-grid" style="font-size: 13px;">
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Version #${m1.versionNum}</th>
                        <th>Version #${m2.versionNum}</th>
                        <th>Variance</th>
                    </tr>
                </thead>
                <tbody>
                    ${fields.map(f => {
                        const val1 = m1[f.key] || 0;
                        const val2 = m2[f.key] || 0;
                        const diff = val2 - val1;
                        let diffText = '-';
                        let diffClass = '';
                        
                        if (diff > 0) {
                            diffText = `+${diff.toFixed(1)}"`;
                            diffClass = 'text-danger';
                        } else if (diff < 0) {
                            diffText = `${diff.toFixed(1)}"`;
                            diffClass = 'text-success';
                        }

                        return `
                            <tr>
                                <td><strong>${f.label}</strong></td>
                                <td>${m1[f.key] ? m1[f.key] + '"' : '-'}</td>
                                <td>${m2[f.key] ? m2[f.key] + '"' : '-'}</td>
                                <td><span class="${diffClass}">${diffText}</span></td>
                            </tr>
                        `;
                    }).join('')}
                    <tr>
                        <td><strong>Fit Notes</strong></td>
                        <td style="font-size: 11px; max-width: 180px; vertical-align: top;">${m1.notes || 'None'}</td>
                        <td style="font-size: 11px; max-width: 180px; vertical-align: top;">${m2.notes || 'None'}</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
};
