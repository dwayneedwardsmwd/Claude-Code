// MWD Engineer Toolbox - Main Application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    App.init();
});

const App = {
    // Current section
    currentSection: 'home',
    bottomsUpSectionCount: 1,

    /**
     * Initialize the application
     */
    init: function() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupTabs();
        this.setupFeatureCards();
        this.populateTables();
        this.setupCalculators();
        this.setupBottomsUp();
    },

    /**
     * Setup navigation click handlers
     */
    setupNavigation: function() {
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateTo(section);

                // Close mobile menu
                document.getElementById('mainNav').classList.remove('nav-open');
            });
        });
    },

    /**
     * Setup mobile menu toggle
     */
    setupMobileMenu: function() {
        const menuToggle = document.getElementById('menuToggle');
        const nav = document.getElementById('mainNav');

        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('nav-open');
            }
        });
    },

    /**
     * Navigate to a section
     */
    navigateTo: function(sectionId) {
        // Update active nav link
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });

        // Show/hide sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });

        this.currentSection = sectionId;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Setup tab functionality
     */
    setupTabs: function() {
        const tabButtons = document.querySelectorAll('.tab-btn');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                const container = btn.closest('.tab-container');

                // Update active tab button
                container.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.tab === tabId);
                });

                // Update active tab content
                container.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.toggle('active', content.id === tabId);
                });
            });
        });
    },

    /**
     * Setup feature card click handlers
     */
    setupFeatureCards: function() {
        const featureCards = document.querySelectorAll('.feature-card');

        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const section = card.dataset.goto;
                if (section) {
                    this.navigateTo(section);
                }
            });
        });
    },

    /**
     * Populate reference tables
     */
    populateTables: function() {
        this.populatePoppitTable();
        this.populateConnectionsTable();
        this.populateLinerTable();
    },

    /**
     * Populate mud pulse flow configuration table
     */
    populatePoppitTable: function() {
        const tbody = document.querySelector('#poppitTable tbody');
        tbody.innerHTML = '';

        MUD_PULSE_FLOW_CONFIG.forEach(config => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${config.flowRangeM3}</td>
                <td>${config.flowRangeGPM}</td>
                <td><strong>${config.poppet}"</strong></td>
                <td><strong>${config.orifice}"</strong></td>
            `;
            tbody.appendChild(row);
        });
    },

    /**
     * Populate pipe connections table
     */
    populateConnectionsTable: function(filter = 'all') {
        const tbody = document.querySelector('#connectionsTable tbody');
        tbody.innerHTML = '';

        const filteredData = filter === 'all'
            ? PIPE_CONNECTIONS_DATA
            : PIPE_CONNECTIONS_DATA.filter(conn => conn.type === filter);

        filteredData.forEach(conn => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${conn.connection}</strong></td>
                <td>${conn.od.toFixed(3)}</td>
                <td>${conn.id.toFixed(3)}</td>
                <td>${conn.tpi}</td>
                <td>${conn.taper}</td>
                <td>${conn.pinLength.toFixed(1)}</td>
                <td>${conn.boxId.toFixed(3)}</td>
                <td>${conn.interchange}</td>
            `;
            tbody.appendChild(row);
        });

        // Setup filter listener
        document.getElementById('connectionFilter').addEventListener('change', (e) => {
            this.populateConnectionsTable(e.target.value);
        });
    },

    /**
     * Populate pump liner output table
     */
    populateLinerTable: function() {
        const tbody = document.querySelector('#linerTable tbody');
        tbody.innerHTML = '';

        PUMP_LINER_DATA.forEach(liner => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${liner.liner.toFixed(1)}</td>
                <td>${liner.stroke10.toFixed(4)}</td>
                <td>${liner.stroke11.toFixed(4)}</td>
                <td>${liner.stroke12.toFixed(4)}</td>
            `;
            tbody.appendChild(row);
        });
    },

    /**
     * Setup all calculator event listeners
     */
    setupCalculators: function() {
        // Poppit Orifice Calculator
        document.getElementById('calcPoppit').addEventListener('click', () => this.calculatePoppit());

        // Hydraulics - Pipe Loss
        document.getElementById('calcPipeLoss').addEventListener('click', () => this.calculatePipeLoss());

        // Hydraulics - Annular Loss
        document.getElementById('calcAnnLoss').addEventListener('click', () => this.calculateAnnularLoss());

        // Hydraulics - Critical Velocity
        document.getElementById('calcCritVel').addEventListener('click', () => this.calculateCriticalVelocity());

        // Annular Volume
        document.getElementById('calcAnnular').addEventListener('click', () => this.calculateAnnular());

        // ECD
        document.getElementById('calcECD').addEventListener('click', () => this.calculateECD());

        // Hydrostatic Pressure
        document.getElementById('calcHP').addEventListener('click', () => this.calculateHP());

        // Pump Output
        document.getElementById('calcPump').addEventListener('click', () => this.calculatePump());

        // Strokes to Surface
        document.getElementById('calcSTS').addEventListener('click', () => this.calculateSTS());

        // Bit Nozzle
        document.getElementById('calcNozzle').addEventListener('click', () => this.calculateNozzle());

        // Mud Weight Conversion
        document.getElementById('calcMW').addEventListener('click', () => this.calculateMudWeight());

        // Slug Calculator
        document.getElementById('calcSlug').addEventListener('click', () => this.calculateSlug());

        // Pipe Displacement
        document.getElementById('calcDisp').addEventListener('click', () => this.calculateDisplacement());

        // Kill Weight Mud
        document.getElementById('calcKWM').addEventListener('click', () => this.calculateKWM());

        // Survey/Directional Calculators
        document.getElementById('calcDLS').addEventListener('click', () => this.calculateDLS());
        document.getElementById('calcTF').addEventListener('click', () => this.calculateToolface());
        document.getElementById('calcBT').addEventListener('click', () => this.calculateBuildTurn());
        document.getElementById('calcProj').addEventListener('click', () => this.calculateProjection());

        // Motor Yield Calculators
        document.getElementById('calcSlide').addEventListener('click', () => this.calculateSlideSheet());
        document.getElementById('calcMotorYield').addEventListener('click', () => this.calculateMotorYieldEstimate());
        document.getElementById('calcExpBT').addEventListener('click', () => this.calculateExpectedBuildTurn());

        // Magnetic Reference Calculators
        document.getElementById('calcMagRef').addEventListener('click', () => this.calculateMagneticRef());
        document.getElementById('calcAziConv').addEventListener('click', () => this.calculateAzimuthConversion());

        // Unit Converters
        document.getElementById('calcDecFrac').addEventListener('click', () => this.calculateDecFrac());
        document.getElementById('calcLength').addEventListener('click', () => this.calculateLengthConversion());
        document.getElementById('calcTemp').addEventListener('click', () => this.calculateTempConversion());
        document.getElementById('calcPress').addEventListener('click', () => this.calculatePressConversion());

        // BHA Reference
        document.getElementById('calcSensorDepth').addEventListener('click', () => this.calculateSensorDepth());
    },

    /**
     * Setup bottoms up section management
     */
    setupBottomsUp: function() {
        document.getElementById('addSection').addEventListener('click', () => this.addBottomsUpSection());
        document.getElementById('calcBottomsUp').addEventListener('click', () => this.calculateBottomsUp());
    },

    /**
     * Add a new bottoms up section
     */
    addBottomsUpSection: function() {
        this.bottomsUpSectionCount++;
        const container = document.getElementById('bottomsUpSections');

        const section = document.createElement('div');
        section.className = 'section-input';
        section.dataset.section = this.bottomsUpSectionCount;
        section.innerHTML = `
            <button class="remove-section" onclick="App.removeBottomsUpSection(${this.bottomsUpSectionCount})">×</button>
            <h4>Section ${this.bottomsUpSectionCount}</h4>
            <div class="input-row">
                <div class="input-group">
                    <label>Hole/Casing ID (in)</label>
                    <input type="number" class="buHoleID" value="8.5" step="0.1">
                </div>
                <div class="input-group">
                    <label>Pipe OD (in)</label>
                    <input type="number" class="buPipeOD" value="5" step="0.1">
                </div>
                <div class="input-group">
                    <label>Length (ft)</label>
                    <input type="number" class="buLength" value="5000" step="100">
                </div>
            </div>
        `;
        container.appendChild(section);
    },

    /**
     * Remove a bottoms up section
     */
    removeBottomsUpSection: function(sectionNum) {
        const section = document.querySelector(`.section-input[data-section="${sectionNum}"]`);
        if (section) {
            section.remove();
        }
    },

    /**
     * Show result in a result box
     */
    showResult: function(elementId, html) {
        const resultBox = document.getElementById(elementId);
        resultBox.innerHTML = html;
        resultBox.classList.add('visible');
    },

    /**
     * Format number with specified decimals
     */
    formatNumber: function(num, decimals = 2) {
        return Number(num).toFixed(decimals);
    },

    // ===========================================
    // CALCULATOR FUNCTIONS
    // ===========================================

    calculatePoppit: function() {
        const flowRate = parseFloat(document.getElementById('poppitFlowRate').value);
        const mudType = document.getElementById('mudType').value;

        if (!flowRate) {
            this.showResult('poppitResult', '<p style="color: red;">Please enter a flow rate</p>');
            return;
        }

        if (flowRate < 130 || flowRate > 800) {
            this.showResult('poppitResult', '<p style="color: red;">Flow rate must be between 130-800 GPM</p>');
            return;
        }

        // Find the matching configuration
        let config = MUD_PULSE_FLOW_CONFIG.find(c => flowRate >= c.flowMinGPM && flowRate < c.flowMaxGPM);

        // Handle edge case for max flow rate
        if (!config && flowRate === 800) {
            config = MUD_PULSE_FLOW_CONFIG[MUD_PULSE_FLOW_CONFIG.length - 1];
        }

        if (!config) {
            this.showResult('poppitResult', '<p style="color: red;">No configuration found for this flow rate</p>');
            return;
        }

        // Adjust for invert mud - increase poppet size
        let poppetSize = config.poppet;
        let poppetNote = '';
        if (mudType === 'invert') {
            // Increase poppet one size for invert
            poppetSize = 1.12; // Use larger poppet for invert
            poppetNote = '<div class="highlight warning"><strong>Invert Mud:</strong> Using larger poppet size (1.12") as recommended</div>';
        }

        this.showResult('poppitResult', `
            <h4>Recommended Configuration</h4>
            <div class="result-item">
                <span class="result-label">Flow Rate</span>
                <span class="result-value">${flowRate} GPM</span>
            </div>
            <div class="result-item">
                <span class="result-label">Flow Range</span>
                <span class="result-value">${config.flowRangeGPM} GPM (${config.flowRangeM3} m³/min)</span>
            </div>
            <div class="highlight">
                <strong>Poppet: ${poppetSize}"</strong><br>
                <strong>Orifice: ${config.orifice}"</strong>
            </div>
            ${poppetNote}
            <div class="result-item">
                <span class="result-label">Mud Type</span>
                <span class="result-value">${mudType === 'invert' ? 'Invert (Oil-Based)' : 'Standard (Water-Based)'}</span>
            </div>
        `);
    },

    calculatePipeLoss: function() {
        const mw = parseFloat(document.getElementById('pipeLossMW').value);
        const flow = parseFloat(document.getElementById('pipeLossFlow').value);
        const id = parseFloat(document.getElementById('pipeLossID').value);
        const length = parseFloat(document.getElementById('pipeLossLength').value);
        const pv = parseFloat(document.getElementById('pipeLossPV').value);
        const yp = parseFloat(document.getElementById('pipeLossYP').value);

        const result = Calculations.pipePressureLoss(mw, flow, id, length, pv, yp);

        this.showResult('pipeLossResult', `
            <h4>Pipe Pressure Loss Results</h4>
            <div class="result-item">
                <span class="result-label">Pressure Loss</span>
                <span class="result-value">${this.formatNumber(result.pressureLoss)} PSI</span>
            </div>
            <div class="result-item">
                <span class="result-label">Velocity</span>
                <span class="result-value">${this.formatNumber(result.velocity)} ft/sec</span>
            </div>
            <div class="result-item">
                <span class="result-label">Reynolds Number</span>
                <span class="result-value">${this.formatNumber(result.reynoldsNumber, 0)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Flow Regime</span>
                <span class="result-value">${result.flowRegime}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Critical Velocity</span>
                <span class="result-value">${this.formatNumber(result.criticalVelocity)} ft/sec</span>
            </div>
        `);
    },

    calculateAnnularLoss: function() {
        const mw = parseFloat(document.getElementById('annLossMW').value);
        const flow = parseFloat(document.getElementById('annLossFlow').value);
        const holeID = parseFloat(document.getElementById('annLossHoleID').value);
        const pipeOD = parseFloat(document.getElementById('annLossPipeOD').value);
        const length = parseFloat(document.getElementById('annLossLength').value);
        const pv = parseFloat(document.getElementById('annLossPV').value);
        const yp = parseFloat(document.getElementById('annLossYP').value);

        const result = Calculations.annularPressureLoss(mw, flow, holeID, pipeOD, length, pv, yp);

        this.showResult('annLossResult', `
            <h4>Annular Pressure Loss Results</h4>
            <div class="result-item">
                <span class="result-label">Pressure Loss</span>
                <span class="result-value">${this.formatNumber(result.pressureLoss)} PSI</span>
            </div>
            <div class="result-item">
                <span class="result-label">Annular Velocity</span>
                <span class="result-value">${this.formatNumber(result.velocity)} ft/min</span>
            </div>
            <div class="result-item">
                <span class="result-label">Hydraulic Diameter</span>
                <span class="result-value">${this.formatNumber(result.hydraulicDiameter)} in</span>
            </div>
            <div class="result-item">
                <span class="result-label">Flow Regime</span>
                <span class="result-value">${result.flowRegime}</span>
            </div>
        `);
    },

    calculateCriticalVelocity: function() {
        const mw = parseFloat(document.getElementById('critVelMW').value);
        const pv = parseFloat(document.getElementById('critVelPV').value);
        const yp = parseFloat(document.getElementById('critVelYP').value);
        const dia = parseFloat(document.getElementById('critVelDia').value);

        const result = Calculations.criticalVelocity(mw, pv, yp, dia);

        this.showResult('critVelResult', `
            <h4>Critical Velocity Results</h4>
            <div class="result-item">
                <span class="result-label">Critical Velocity</span>
                <span class="result-value">${this.formatNumber(result.criticalVelocity)} ft/sec</span>
            </div>
            <div class="result-item">
                <span class="result-label">Critical Flow Rate (Pipe)</span>
                <span class="result-value">${this.formatNumber(result.criticalFlowRate)} GPM</span>
            </div>
        `);
    },

    calculateAnnular: function() {
        const holeID = parseFloat(document.getElementById('annHoleID').value);
        const pipeOD = parseFloat(document.getElementById('annPipeOD').value);
        const length = parseFloat(document.getElementById('annLength').value);
        const flowRate = parseFloat(document.getElementById('annFlowRate').value);

        const volume = Calculations.annularVolume(holeID, pipeOD, length);
        const velocity = Calculations.annularVelocity(flowRate, holeID, pipeOD);
        const time = Calculations.bottomsUpTime(volume.totalVolume, flowRate);

        this.showResult('annularResult', `
            <h4>Annular Volume Results</h4>
            <div class="result-item">
                <span class="result-label">Capacity</span>
                <span class="result-value">${this.formatNumber(volume.capacityPerFoot, 5)} bbl/ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Volume</span>
                <span class="result-value">${this.formatNumber(volume.totalVolume)} bbl (${this.formatNumber(volume.totalGallons)} gal)</span>
            </div>
            <div class="result-item">
                <span class="result-label">Annular Velocity</span>
                <span class="result-value">${this.formatNumber(velocity)} ft/min</span>
            </div>
            <div class="highlight">
                <strong>Bottoms Up Time: ${time.formatted}</strong>
                <br>(${this.formatNumber(time.totalMinutes)} minutes)
            </div>
        `);
    },

    calculateBottomsUp: function() {
        const sections = document.querySelectorAll('#bottomsUpSections .section-input');
        const flowRate = parseFloat(document.getElementById('buFlowRate').value);

        let totalVolume = 0;
        let sectionDetails = '';

        sections.forEach((section, index) => {
            const holeID = parseFloat(section.querySelector('.buHoleID').value);
            const pipeOD = parseFloat(section.querySelector('.buPipeOD').value);
            const length = parseFloat(section.querySelector('.buLength').value);

            const volume = Calculations.annularVolume(holeID, pipeOD, length);
            totalVolume += volume.totalVolume;

            sectionDetails += `
                <div class="result-item">
                    <span class="result-label">Section ${index + 1} (${holeID}" × ${pipeOD}" × ${length}')</span>
                    <span class="result-value">${this.formatNumber(volume.totalVolume)} bbl</span>
                </div>
            `;
        });

        const time = Calculations.bottomsUpTime(totalVolume, flowRate);

        this.showResult('bottomsUpResult', `
            <h4>Bottoms Up Results</h4>
            ${sectionDetails}
            <div class="result-item" style="border-top: 2px solid var(--primary-color); margin-top: 0.5rem; padding-top: 0.5rem;">
                <span class="result-label"><strong>Total Volume</strong></span>
                <span class="result-value"><strong>${this.formatNumber(totalVolume)} bbl</strong></span>
            </div>
            <div class="highlight">
                <strong>Total Bottoms Up Time: ${time.formatted}</strong>
                <br>(${this.formatNumber(time.totalMinutes)} minutes at ${flowRate} GPM)
            </div>
        `);
    },

    calculateECD: function() {
        const mw = parseFloat(document.getElementById('ecdMW').value);
        const annPressure = parseFloat(document.getElementById('ecdAnnPressure').value);
        const tvd = parseFloat(document.getElementById('ecdTVD').value);

        const result = Calculations.ecd(mw, annPressure, tvd);

        this.showResult('ecdResult', `
            <h4>ECD Results</h4>
            <div class="highlight">
                <strong>ECD: ${this.formatNumber(result.ecd)} PPG</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Added Weight</span>
                <span class="result-value">+${this.formatNumber(result.addedWeight)} PPG</span>
            </div>
            <div class="result-item">
                <span class="result-label">Static BHP</span>
                <span class="result-value">${this.formatNumber(result.staticBHP)} PSI</span>
            </div>
            <div class="result-item">
                <span class="result-label">Circulating BHP</span>
                <span class="result-value">${this.formatNumber(result.bhcp)} PSI</span>
            </div>
        `);
    },

    calculateHP: function() {
        const mw = parseFloat(document.getElementById('hpMW').value);
        const tvd = parseFloat(document.getElementById('hpTVD').value);

        const hp = Calculations.hydrostaticPressure(mw, tvd);

        this.showResult('hpResult', `
            <h4>Hydrostatic Pressure</h4>
            <div class="highlight">
                <strong>HP: ${this.formatNumber(hp)} PSI</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Pressure Gradient</span>
                <span class="result-value">${this.formatNumber(mw * 0.052, 4)} PSI/ft</span>
            </div>
        `);
    },

    calculatePump: function() {
        const liner = parseFloat(document.getElementById('pumpLinerSize').value);
        const stroke = parseFloat(document.getElementById('pumpStrokeLength').value);
        const eff = parseFloat(document.getElementById('pumpEfficiency').value);
        const spm = parseFloat(document.getElementById('pumpSPM').value);

        const output = Calculations.triplexPumpOutput(liner, stroke, eff);
        const flow = Calculations.flowRate(output.bblPerStroke, spm);

        this.showResult('pumpResult', `
            <h4>Pump Output Results</h4>
            <div class="highlight">
                <strong>Output: ${this.formatNumber(output.bblPerStroke, 4)} bbl/stk</strong>
                <br>(${this.formatNumber(output.galPerStroke, 2)} gal/stk)
            </div>
            <div class="result-item">
                <span class="result-label">Flow Rate @ ${spm} SPM</span>
                <span class="result-value">${this.formatNumber(flow.gpm)} GPM</span>
            </div>
            <div class="result-item">
                <span class="result-label">Flow Rate</span>
                <span class="result-value">${this.formatNumber(flow.bblPerMin)} bbl/min</span>
            </div>
        `);
    },

    calculateSTS: function() {
        const volume = parseFloat(document.getElementById('stsVolume').value);
        const output = parseFloat(document.getElementById('stsPumpOutput').value);
        const spm = parseFloat(document.getElementById('stsSPM').value);

        const result = Calculations.strokesToSurface(volume, output, spm);

        this.showResult('stsResult', `
            <h4>Strokes to Surface Results</h4>
            <div class="highlight">
                <strong>Strokes: ${result.strokes.toLocaleString()}</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Time @ ${spm} SPM</span>
                <span class="result-value">${result.formatted}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Minutes</span>
                <span class="result-value">${this.formatNumber(result.totalMinutes)}</span>
            </div>
        `);
    },

    calculateNozzle: function() {
        const nozzles = [
            parseFloat(document.getElementById('nozzle1').value) || 0,
            parseFloat(document.getElementById('nozzle2').value) || 0,
            parseFloat(document.getElementById('nozzle3').value) || 0,
            parseFloat(document.getElementById('nozzle4').value) || 0,
            parseFloat(document.getElementById('nozzle5').value) || 0,
            parseFloat(document.getElementById('nozzle6').value) || 0
        ];
        const flowRate = parseFloat(document.getElementById('nozzleFlow').value);
        const mw = parseFloat(document.getElementById('nozzleMW').value);

        const tfa = Calculations.totalFlowArea(nozzles);
        const bitCalc = Calculations.bitPressureDrop(flowRate, mw, tfa.tfa);

        // Get nozzle sizes string
        const nozzleSizes = nozzles.filter(n => n > 0).join('-');

        this.showResult('nozzleResult', `
            <h4>Bit Nozzle Results</h4>
            <div class="result-item">
                <span class="result-label">Nozzle Configuration</span>
                <span class="result-value">${nozzleSizes} (${tfa.nozzleCount} nozzles)</span>
            </div>
            <div class="highlight">
                <strong>TFA: ${this.formatNumber(tfa.tfa, 4)} in²</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Bit Pressure Drop</span>
                <span class="result-value">${this.formatNumber(bitCalc.pressureDrop)} PSI</span>
            </div>
            <div class="result-item">
                <span class="result-label">Nozzle Velocity</span>
                <span class="result-value">${this.formatNumber(bitCalc.nozzleVelocity)} ft/sec</span>
            </div>
            <div class="result-item">
                <span class="result-label">Hydraulic HP</span>
                <span class="result-value">${this.formatNumber(bitCalc.hydraulicHP)} HP</span>
            </div>
            <div class="result-item">
                <span class="result-label">Impact Force</span>
                <span class="result-value">${this.formatNumber(bitCalc.impactForce)} lbf</span>
            </div>
        `);
    },

    calculateMudWeight: function() {
        const value = parseFloat(document.getElementById('mwInput').value);
        const unit = document.getElementById('mwUnit').value;

        const result = Calculations.convertMudWeight(value, unit);

        this.showResult('mwResult', `
            <h4>Mud Weight Conversions</h4>
            <div class="result-item ${unit === 'ppg' ? 'highlight' : ''}">
                <span class="result-label">PPG (lb/gal)</span>
                <span class="result-value">${this.formatNumber(result.ppg, 3)}</span>
            </div>
            <div class="result-item ${unit === 'sg' ? 'highlight' : ''}">
                <span class="result-label">Specific Gravity</span>
                <span class="result-value">${this.formatNumber(result.sg, 3)}</span>
            </div>
            <div class="result-item ${unit === 'pcf' ? 'highlight' : ''}">
                <span class="result-label">PCF (lb/ft³)</span>
                <span class="result-value">${this.formatNumber(result.pcf, 2)}</span>
            </div>
            <div class="result-item ${unit === 'kgm3' ? 'highlight' : ''}">
                <span class="result-label">kg/m³</span>
                <span class="result-value">${this.formatNumber(result.kgm3, 1)}</span>
            </div>
            <div class="result-item ${unit === 'psi_ft' ? 'highlight' : ''}">
                <span class="result-label">PSI/ft</span>
                <span class="result-value">${this.formatNumber(result.psi_ft, 4)}</span>
            </div>
        `);
    },

    calculateSlug: function() {
        const mw = parseFloat(document.getElementById('slugMW').value);
        const dryPipe = parseFloat(document.getElementById('slugDryPipe').value);
        const pipeID = parseFloat(document.getElementById('slugPipeID').value);
        const slugLength = parseFloat(document.getElementById('slugLength').value);

        const result = Calculations.slugWeight(mw, dryPipe, pipeID, slugLength);

        this.showResult('slugResult', `
            <h4>Slug Calculator Results</h4>
            <div class="highlight">
                <strong>Required Slug Weight: ${this.formatNumber(result.slugWeight)} PPG</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Weight Increase</span>
                <span class="result-value">+${this.formatNumber(result.weightIncrease)} PPG</span>
            </div>
            <div class="result-item">
                <span class="result-label">Slug Volume</span>
                <span class="result-value">${this.formatNumber(result.slugVolume)} bbl (${this.formatNumber(result.slugVolumeGal)} gal)</span>
            </div>
            <div class="result-item">
                <span class="result-label">Hydrostatic Gain</span>
                <span class="result-value">${this.formatNumber(result.hydrostaticGain)} PSI</span>
            </div>
        `);
    },

    calculateDisplacement: function() {
        const od = parseFloat(document.getElementById('dispPipeOD').value);
        const id = parseFloat(document.getElementById('dispPipeID').value);
        const length = parseFloat(document.getElementById('dispLength').value);

        const result = Calculations.pipeDisplacement(od, id, length);
        const capacity = Calculations.pipeCapacity(id, length);

        this.showResult('dispResult', `
            <h4>Pipe Displacement Results</h4>
            <div class="result-item">
                <span class="result-label">Displacement/ft (open)</span>
                <span class="result-value">${this.formatNumber(result.displacementPerFoot, 5)} bbl/ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Open End Disp.</span>
                <span class="result-value">${this.formatNumber(result.openEndDisplacement)} bbl</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Closed End Disp.</span>
                <span class="result-value">${this.formatNumber(result.closedEndDisplacement)} bbl</span>
            </div>
            <div class="result-item">
                <span class="result-label">Pipe Capacity</span>
                <span class="result-value">${this.formatNumber(capacity.totalVolume)} bbl</span>
            </div>
        `);
    },

    calculateKWM: function() {
        const mw = parseFloat(document.getElementById('kwmCurrentMW').value);
        const sidpp = parseFloat(document.getElementById('kwmSIDP').value);
        const tvd = parseFloat(document.getElementById('kwmTVD').value);

        const result = Calculations.killWeightMud(mw, sidpp, tvd);

        this.showResult('kwmResult', `
            <h4>Kill Weight Mud Results</h4>
            <div class="highlight">
                <strong>Kill Weight: ${this.formatNumber(result.killWeight)} PPG</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Weight Increase</span>
                <span class="result-value">+${this.formatNumber(result.weightIncrease)} PPG</span>
            </div>
            <div class="result-item">
                <span class="result-label">Formation Pressure</span>
                <span class="result-value">${this.formatNumber(result.formationPressure)} PSI</span>
            </div>
            <div class="result-item">
                <span class="result-label">Formation Gradient</span>
                <span class="result-value">${this.formatNumber(result.formationGradient, 4)} PSI/ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Formation EMW</span>
                <span class="result-value">${this.formatNumber(result.formationPPG)} PPG</span>
            </div>
        `);
    },

    // ===========================================
    // SURVEY/DIRECTIONAL CALCULATORS
    // ===========================================

    calculateDLS: function() {
        const inc1 = parseFloat(document.getElementById('dls1Inc').value);
        const azi1 = parseFloat(document.getElementById('dls1Azi').value);
        const inc2 = parseFloat(document.getElementById('dls2Inc').value);
        const azi2 = parseFloat(document.getElementById('dls2Azi').value);
        const cl = parseFloat(document.getElementById('dlsCL').value);

        const result = Calculations.doglegSeverity(inc1, azi1, inc2, azi2, cl);

        this.showResult('dlsResult', `
            <h4>Dogleg Severity Results</h4>
            <div class="highlight">
                <strong>DLS: ${this.formatNumber(result.dls)} °/100ft</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Dogleg Angle</span>
                <span class="result-value">${this.formatNumber(result.doglegAngle)}°</span>
            </div>
            <div class="result-item">
                <span class="result-label">DLS (per 30m)</span>
                <span class="result-value">${this.formatNumber(result.dlsPer30m)} °/30m</span>
            </div>
            <div class="result-item">
                <span class="result-label">Course Length</span>
                <span class="result-value">${cl} ft</span>
            </div>
        `);
    },

    calculateToolface: function() {
        const inc = parseFloat(document.getElementById('tfInc').value);
        const azi = parseFloat(document.getElementById('tfAzi').value);
        const tf = parseFloat(document.getElementById('tfValue').value);
        const type = document.getElementById('tfType').value;

        const result = Calculations.convertToolface(inc, azi, tf, type);

        this.showResult('tfResult', `
            <h4>Toolface Conversion Results</h4>
            <div class="highlight">
                <strong>GTF: ${this.formatNumber(result.gtf)}°</strong><br>
                <strong>MTF: ${this.formatNumber(result.mtf)}°</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Direction</span>
                <span class="result-value">${result.direction}</span>
            </div>
            <div class="result-item">
                <span class="result-label">At Inclination</span>
                <span class="result-value">${inc}°</span>
            </div>
        `);
    },

    calculateBuildTurn: function() {
        const inc1 = parseFloat(document.getElementById('bt1Inc').value);
        const azi1 = parseFloat(document.getElementById('bt1Azi').value);
        const inc2 = parseFloat(document.getElementById('bt2Inc').value);
        const azi2 = parseFloat(document.getElementById('bt2Azi').value);
        const cl = parseFloat(document.getElementById('btCL').value);

        const result = Calculations.buildTurnRate(inc1, azi1, inc2, azi2, cl);

        const buildDir = result.isBuilding ? 'Building' : 'Dropping';
        const turnDir = result.isTurningRight ? 'Right' : 'Left';

        this.showResult('btResult', `
            <h4>Build & Turn Rate Results</h4>
            <div class="highlight">
                <strong>Build Rate: ${this.formatNumber(result.buildRate)} °/100ft</strong> (${buildDir})<br>
                <strong>Turn Rate: ${this.formatNumber(result.turnRate)} °/100ft</strong> (${turnDir})
            </div>
            <div class="result-item">
                <span class="result-label">Inc Change</span>
                <span class="result-value">${this.formatNumber(result.incChange)}°</span>
            </div>
            <div class="result-item">
                <span class="result-label">Azi Change</span>
                <span class="result-value">${this.formatNumber(result.aziChange)}°</span>
            </div>
            <div class="result-item">
                <span class="result-label">DLS</span>
                <span class="result-value">${this.formatNumber(result.dls)} °/100ft</span>
            </div>
        `);
    },

    calculateProjection: function() {
        const inc = parseFloat(document.getElementById('projInc').value);
        const azi = parseFloat(document.getElementById('projAzi').value);
        const dls = parseFloat(document.getElementById('projDLS').value);
        const tf = parseFloat(document.getElementById('projTF').value);
        const dist = parseFloat(document.getElementById('projDist').value);

        const result = Calculations.projectSurvey(inc, azi, dls, tf, dist);
        const tfDirection = Calculations.getToolfaceDirection(tf);

        this.showResult('projResult', `
            <h4>Survey Projection Results</h4>
            <div class="highlight">
                <strong>Projected Inc: ${this.formatNumber(result.projectedInc)}°</strong><br>
                <strong>Projected Azi: ${this.formatNumber(result.projectedAzi)}°</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Current Survey</span>
                <span class="result-value">${inc}° / ${azi}°</span>
            </div>
            <div class="result-item">
                <span class="result-label">Toolface</span>
                <span class="result-value">${tf}° (${tfDirection})</span>
            </div>
            <div class="result-item">
                <span class="result-label">Build Component</span>
                <span class="result-value">${this.formatNumber(result.buildComponent)}°</span>
            </div>
            <div class="result-item">
                <span class="result-label">Turn Component</span>
                <span class="result-value">${this.formatNumber(result.turnComponent)}°</span>
            </div>
            <div class="result-item">
                <span class="result-label">Projection Distance</span>
                <span class="result-value">${dist} ft</span>
            </div>
        `);
    },

    // ===========================================
    // MOTOR YIELD CALCULATORS
    // ===========================================

    calculateSlideSheet: function() {
        const motorYield = parseFloat(document.getElementById('slideMotorYield').value);
        const targetDLS = parseFloat(document.getElementById('slideTargetDLS').value);
        const interval = parseFloat(document.getElementById('slideInterval').value);

        const result = Calculations.slideCalculation(motorYield, targetDLS, interval);

        this.showResult('slideResult', `
            <h4>Slide Sheet Results</h4>
            <div class="highlight">
                <strong>Slide: ${this.formatNumber(result.slideFootage)} ft (${this.formatNumber(result.slidePercent)}%)</strong><br>
                <strong>Rotate: ${this.formatNumber(result.rotateFootage)} ft</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Target DLS</span>
                <span class="result-value">${targetDLS} °/100ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Motor Yield</span>
                <span class="result-value">${motorYield} °/100ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Achievable DLS</span>
                <span class="result-value">${this.formatNumber(result.achievableDLS)} °/100ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Drill Interval</span>
                <span class="result-value">${interval} ft</span>
            </div>
        `);
    },

    calculateMotorYieldEstimate: function() {
        const bendAngle = parseFloat(document.getElementById('bendAngle').value);
        const bitToBend = parseFloat(document.getElementById('motorBitToBend').value);

        const result = Calculations.estimateMotorYield(bendAngle, bitToBend);

        this.showResult('motorYieldResult', `
            <h4>Motor Yield Estimate</h4>
            <div class="highlight">
                <strong>Estimated Yield: ${this.formatNumber(result.estimatedYield)} °/100ft</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Range</span>
                <span class="result-value">${this.formatNumber(result.minYield)} - ${this.formatNumber(result.maxYield)} °/100ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Bend Angle</span>
                <span class="result-value">${bendAngle}°</span>
            </div>
            <div class="result-item">
                <span class="result-label">Bit to Bend</span>
                <span class="result-value">${bitToBend} ft</span>
            </div>
            <div class="info-box" style="margin-top: 1rem;">
                <strong>Note:</strong> ${result.note}
            </div>
        `);
    },

    calculateExpectedBuildTurn: function() {
        const motorYield = parseFloat(document.getElementById('expMotorYield').value);
        const tf = parseFloat(document.getElementById('expToolface').value);
        const slideFootage = parseFloat(document.getElementById('expSlideFootage').value);

        const result = Calculations.expectedBuildTurn(motorYield, tf, slideFootage);
        const tfDirection = Calculations.getToolfaceDirection(tf);

        this.showResult('expBTResult', `
            <h4>Expected Build/Turn Results</h4>
            <div class="highlight">
                <strong>Expected Build: ${this.formatNumber(result.expectedBuild)}°</strong><br>
                <strong>Expected Turn: ${this.formatNumber(result.expectedTurn)}°</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Toolface</span>
                <span class="result-value">${tf}° (${tfDirection})</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Dogleg</span>
                <span class="result-value">${this.formatNumber(result.totalDogleg)}°</span>
            </div>
            <div class="result-item">
                <span class="result-label">Build Rate</span>
                <span class="result-value">${this.formatNumber(result.buildRate)} °/100ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Turn Rate</span>
                <span class="result-value">${this.formatNumber(result.turnRate)} °/100ft</span>
            </div>
        `);
    },

    // ===========================================
    // MAGNETIC REFERENCE CALCULATORS
    // ===========================================

    calculateMagneticRef: function() {
        const dec = parseFloat(document.getElementById('magDeclination').value);
        const conv = parseFloat(document.getElementById('magConvergence').value);

        const result = Calculations.magneticReference(dec, conv);

        this.showResult('magRefResult', `
            <h4>Magnetic Reference Results</h4>
            <div class="highlight">
                <strong>Total Correction: ${this.formatNumber(result.totalCorrection)}°</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Declination</span>
                <span class="result-value">${dec}° ${dec >= 0 ? '(East)' : '(West)'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Grid Convergence</span>
                <span class="result-value">${conv}° ${conv >= 0 ? '(East)' : '(West)'}</span>
            </div>
            <div class="info-box" style="margin-top: 1rem;">
                Grid Azi = Magnetic Azi + Total Correction
            </div>
        `);
    },

    calculateAzimuthConversion: function() {
        const azi = parseFloat(document.getElementById('aziInput').value);
        const type = document.getElementById('aziType').value;
        const dec = parseFloat(document.getElementById('aziDec').value);
        const conv = parseFloat(document.getElementById('aziConv').value);

        const result = Calculations.convertAzimuth(azi, type, dec, conv);

        this.showResult('aziConvResult', `
            <h4>Azimuth Conversion Results</h4>
            <div class="result-item ${type === 'mag' ? 'highlight' : ''}">
                <span class="result-label">Magnetic Azimuth</span>
                <span class="result-value">${this.formatNumber(result.magnetic)}°</span>
            </div>
            <div class="result-item ${type === 'true' ? 'highlight' : ''}">
                <span class="result-label">True Azimuth</span>
                <span class="result-value">${this.formatNumber(result.true)}°</span>
            </div>
            <div class="result-item ${type === 'grid' ? 'highlight' : ''}">
                <span class="result-label">Grid Azimuth</span>
                <span class="result-value">${this.formatNumber(result.grid)}°</span>
            </div>
        `);
    },

    // ===========================================
    // UNIT CONVERTERS
    // ===========================================

    calculateDecFrac: function() {
        const input = document.getElementById('decFracInput').value;
        const denom = parseInt(document.getElementById('fracDenom').value);

        // Try to determine if input is decimal or fraction
        let result;
        if (input.includes('/')) {
            // Input is a fraction
            const decimal = Calculations.fractionToDecimal(input);
            result = Calculations.decimalToFraction(decimal, denom);
            this.showResult('decFracResult', `
                <h4>Fraction to Decimal Conversion</h4>
                <div class="highlight">
                    <strong>Decimal: ${this.formatNumber(decimal, 6)}</strong>
                </div>
                <div class="result-item">
                    <span class="result-label">As ${denom}nds</span>
                    <span class="result-value">${result.thirtySeconds}/32</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Reduced</span>
                    <span class="result-value">${result.display}</span>
                </div>
            `);
        } else {
            // Input is a decimal
            const decimal = parseFloat(input);
            result = Calculations.decimalToFraction(decimal, denom);
            this.showResult('decFracResult', `
                <h4>Decimal to Fraction Conversion</h4>
                <div class="highlight">
                    <strong>Fraction: ${result.display}</strong>
                </div>
                <div class="result-item">
                    <span class="result-label">As 32nds</span>
                    <span class="result-value">${result.thirtySeconds}/32</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Exact Fraction</span>
                    <span class="result-value">${result.numerator}/${result.denominator}</span>
                </div>
            `);
        }
    },

    calculateLengthConversion: function() {
        const value = parseFloat(document.getElementById('lengthInput').value);
        const unit = document.getElementById('lengthUnit').value;

        const result = Calculations.convertLength(value, unit);

        this.showResult('lengthResult', `
            <h4>Length Conversion Results</h4>
            <div class="result-item ${unit === 'ft' ? 'highlight' : ''}">
                <span class="result-label">Feet</span>
                <span class="result-value">${this.formatNumber(result.feet, 4)}</span>
            </div>
            <div class="result-item ${unit === 'm' ? 'highlight' : ''}">
                <span class="result-label">Meters</span>
                <span class="result-value">${this.formatNumber(result.meters, 4)}</span>
            </div>
            <div class="result-item ${unit === 'in' ? 'highlight' : ''}">
                <span class="result-label">Inches</span>
                <span class="result-value">${this.formatNumber(result.inches, 4)}</span>
            </div>
            <div class="result-item ${unit === 'cm' ? 'highlight' : ''}">
                <span class="result-label">Centimeters</span>
                <span class="result-value">${this.formatNumber(result.centimeters, 4)}</span>
            </div>
        `);
    },

    calculateTempConversion: function() {
        const value = parseFloat(document.getElementById('tempInput').value);
        const unit = document.getElementById('tempUnit').value;

        const result = Calculations.convertTemperature(value, unit);

        this.showResult('tempResult', `
            <h4>Temperature Conversion Results</h4>
            <div class="result-item ${unit === 'f' ? 'highlight' : ''}">
                <span class="result-label">Fahrenheit</span>
                <span class="result-value">${this.formatNumber(result.fahrenheit, 2)} °F</span>
            </div>
            <div class="result-item ${unit === 'c' ? 'highlight' : ''}">
                <span class="result-label">Celsius</span>
                <span class="result-value">${this.formatNumber(result.celsius, 2)} °C</span>
            </div>
            <div class="result-item">
                <span class="result-label">Kelvin</span>
                <span class="result-value">${this.formatNumber(result.kelvin, 2)} K</span>
            </div>
        `);
    },

    calculatePressConversion: function() {
        const value = parseFloat(document.getElementById('pressInput').value);
        const unit = document.getElementById('pressUnit').value;

        const result = Calculations.convertPressure(value, unit);

        this.showResult('pressResult', `
            <h4>Pressure Conversion Results</h4>
            <div class="result-item ${unit === 'psi' ? 'highlight' : ''}">
                <span class="result-label">PSI</span>
                <span class="result-value">${this.formatNumber(result.psi, 2)}</span>
            </div>
            <div class="result-item ${unit === 'kpa' ? 'highlight' : ''}">
                <span class="result-label">kPa</span>
                <span class="result-value">${this.formatNumber(result.kpa, 2)}</span>
            </div>
            <div class="result-item ${unit === 'bar' ? 'highlight' : ''}">
                <span class="result-label">Bar</span>
                <span class="result-value">${this.formatNumber(result.bar, 4)}</span>
            </div>
            <div class="result-item ${unit === 'atm' ? 'highlight' : ''}">
                <span class="result-label">ATM</span>
                <span class="result-value">${this.formatNumber(result.atm, 4)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">MPa</span>
                <span class="result-value">${this.formatNumber(result.mpa, 4)}</span>
            </div>
        `);
    },

    // ===========================================
    // BHA REFERENCE CALCULATOR
    // ===========================================

    calculateSensorDepth: function() {
        const bitDepth = parseFloat(document.getElementById('bitDepth').value);
        const offset = parseFloat(document.getElementById('sensorOffset').value);

        const result = Calculations.sensorDepth(bitDepth, offset);

        this.showResult('sensorDepthResult', `
            <h4>Sensor Depth Results</h4>
            <div class="highlight">
                <strong>Survey Depth: ${this.formatNumber(result.surveyDepth, 1)} ft</strong>
            </div>
            <div class="result-item">
                <span class="result-label">Bit Depth</span>
                <span class="result-value">${this.formatNumber(result.bitDepth, 1)} ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Sensor Offset</span>
                <span class="result-value">${this.formatNumber(result.sensorOffset, 1)} ft</span>
            </div>
        `);
    }
};
