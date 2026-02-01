// MWD Engineer Toolbox - Calculation Functions

/**
 * Drilling Engineering Calculation Functions
 * All calculations use industry-standard formulas
 */

const Calculations = {
    // ===========================================
    // CONSTANTS
    // ===========================================
    constants: {
        WATER_GRADIENT: 0.052,  // PSI per foot per PPG
        BRINE_FACTOR: 8.33,     // Fresh water PPG
        PI: Math.PI,
        NOZZLE_COEFFICIENT: 0.95  // Discharge coefficient
    },

    // ===========================================
    // POPPIT ORIFICE CALCULATIONS
    // ===========================================

    /**
     * Calculate orifice area from diameter
     * @param {number} diameter - Orifice diameter in inches
     * @returns {number} Area in square inches
     */
    orificeArea: function(diameter) {
        return this.constants.PI * Math.pow(diameter / 2, 2);
    },

    /**
     * Calculate pressure drop through orifice
     * Formula: ΔP = (Q² × MW) / (12032 × Cd² × A²)
     * @param {number} flowRate - Flow rate in GPM
     * @param {number} mudWeight - Mud weight in PPG
     * @param {number} area - Orifice area in square inches
     * @param {number} cd - Discharge coefficient (default 0.95)
     * @returns {number} Pressure drop in PSI
     */
    orificePressureDrop: function(flowRate, mudWeight, area, cd = 0.95) {
        return (Math.pow(flowRate, 2) * mudWeight) / (12032 * Math.pow(cd, 2) * Math.pow(area, 2));
    },

    /**
     * Calculate required orifice area for given pressure drop
     * @param {number} flowRate - Flow rate in GPM
     * @param {number} mudWeight - Mud weight in PPG
     * @param {number} pressureDrop - Desired pressure drop in PSI
     * @param {number} cd - Discharge coefficient
     * @returns {number} Required area in square inches
     */
    requiredOrificeArea: function(flowRate, mudWeight, pressureDrop, cd = 0.95) {
        return Math.sqrt((Math.pow(flowRate, 2) * mudWeight) / (12032 * Math.pow(cd, 2) * pressureDrop));
    },

    /**
     * Find recommended orifice from data
     * @param {number} flowRate - Flow rate in GPM
     * @param {number} mudWeight - Mud weight in PPG
     * @param {number} pressureDrop - Available pressure drop in PSI
     * @returns {object} Recommended orifice and calculated values
     */
    recommendOrifice: function(flowRate, mudWeight, pressureDrop) {
        const requiredArea = this.requiredOrificeArea(flowRate, mudWeight, pressureDrop);

        // Find best matching orifice
        let recommended = null;
        let minDiff = Infinity;

        for (const orifice of POPPIT_ORIFICE_DATA) {
            const diff = Math.abs(orifice.area - requiredArea);
            if (diff < minDiff && orifice.area >= requiredArea * 0.9) {
                minDiff = diff;
                recommended = orifice;
            }
        }

        if (!recommended) {
            // Select largest available if none suitable
            recommended = POPPIT_ORIFICE_DATA[POPPIT_ORIFICE_DATA.length - 1];
        }

        const actualPressureDrop = this.orificePressureDrop(flowRate, mudWeight, recommended.area);

        return {
            requiredArea: requiredArea,
            recommended: recommended,
            actualPressureDrop: actualPressureDrop,
            flowVelocity: flowRate / (recommended.area * 60 * 12) // ft/sec approximately
        };
    },

    // ===========================================
    // HYDRAULICS CALCULATIONS
    // ===========================================

    /**
     * Calculate fluid velocity in pipe
     * Formula: V = Q / (2.448 × D²)
     * @param {number} flowRate - Flow rate in GPM
     * @param {number} diameter - Inside diameter in inches
     * @returns {number} Velocity in ft/sec
     */
    pipeVelocity: function(flowRate, diameter) {
        return flowRate / (2.448 * Math.pow(diameter, 2));
    },

    /**
     * Calculate annular velocity
     * Formula: V = Q / (2.448 × (Dh² - Dp²))
     * @param {number} flowRate - Flow rate in GPM
     * @param {number} holeID - Hole/casing ID in inches
     * @param {number} pipeOD - Pipe OD in inches
     * @returns {number} Annular velocity in ft/min
     */
    annularVelocity: function(flowRate, holeID, pipeOD) {
        return (24.5 * flowRate) / (Math.pow(holeID, 2) - Math.pow(pipeOD, 2));
    },

    /**
     * Calculate Reynolds number in pipe (Bingham Plastic)
     * @param {number} velocity - Velocity in ft/sec
     * @param {number} diameter - Diameter in inches
     * @param {number} mudWeight - Mud weight in PPG
     * @param {number} pv - Plastic viscosity in cP
     * @returns {number} Reynolds number
     */
    reynoldsNumberPipe: function(velocity, diameter, mudWeight, pv) {
        return (928 * mudWeight * velocity * diameter) / pv;
    },

    /**
     * Calculate pressure loss in pipe (Bingham Plastic Model)
     * Formula: ΔP = (PV × L × V) / (1500 × D²) + (YP × L) / (225 × D)
     * @param {number} mudWeight - Mud weight in PPG
     * @param {number} flowRate - Flow rate in GPM
     * @param {number} pipeID - Pipe ID in inches
     * @param {number} length - Pipe length in ft
     * @param {number} pv - Plastic viscosity in cP
     * @param {number} yp - Yield point in lb/100ft²
     * @returns {object} Pressure loss details
     */
    pipePressureLoss: function(mudWeight, flowRate, pipeID, length, pv, yp) {
        const velocity = this.pipeVelocity(flowRate, pipeID);

        // Laminar flow calculation
        const laminarLoss = ((pv * length * velocity) / (1500 * Math.pow(pipeID, 2))) +
                           ((yp * length) / (225 * pipeID));

        // Critical velocity
        const criticalVel = (1.08 * pv + 1.08 * Math.sqrt(Math.pow(pv, 2) + 12.34 * Math.pow(pipeID, 2) * yp * mudWeight)) / (mudWeight * pipeID);

        // Reynolds number
        const re = this.reynoldsNumberPipe(velocity, pipeID, mudWeight, pv);

        // Determine flow regime and calculate
        let pressureLoss;
        let flowRegime;

        if (velocity < criticalVel || re < 2100) {
            pressureLoss = laminarLoss;
            flowRegime = 'Laminar';
        } else {
            // Turbulent flow (simplified)
            const f = 0.046 / Math.pow(re, 0.2);
            pressureLoss = (f * mudWeight * Math.pow(velocity, 2) * length) / (25.8 * pipeID);
            flowRegime = 'Turbulent';
        }

        return {
            pressureLoss: pressureLoss,
            velocity: velocity,
            reynoldsNumber: re,
            criticalVelocity: criticalVel,
            flowRegime: flowRegime
        };
    },

    /**
     * Calculate pressure loss in annulus (Bingham Plastic Model)
     * @param {number} mudWeight - Mud weight in PPG
     * @param {number} flowRate - Flow rate in GPM
     * @param {number} holeID - Hole/casing ID in inches
     * @param {number} pipeOD - Pipe OD in inches
     * @param {number} length - Length in ft
     * @param {number} pv - Plastic viscosity in cP
     * @param {number} yp - Yield point in lb/100ft²
     * @returns {object} Annular pressure loss details
     */
    annularPressureLoss: function(mudWeight, flowRate, holeID, pipeOD, length, pv, yp) {
        const annVel = this.annularVelocity(flowRate, holeID, pipeOD);
        const hydraulicDia = holeID - pipeOD;

        // Laminar flow calculation for annulus
        const laminarLoss = ((pv * length * annVel) / (60000 * Math.pow(hydraulicDia, 2))) +
                           ((yp * length) / (200 * hydraulicDia));

        // Critical velocity for annulus
        const criticalVel = (1.08 * pv + 1.08 * Math.sqrt(Math.pow(pv, 2) + 9.256 * Math.pow(hydraulicDia, 2) * yp * mudWeight)) / (mudWeight * hydraulicDia);

        // Reynolds number for annulus
        const re = (928 * mudWeight * (annVel / 60) * hydraulicDia) / pv;

        let pressureLoss;
        let flowRegime;

        if ((annVel / 60) < criticalVel || re < 2100) {
            pressureLoss = laminarLoss;
            flowRegime = 'Laminar';
        } else {
            // Turbulent flow
            const f = 0.046 / Math.pow(re, 0.2);
            pressureLoss = (f * mudWeight * Math.pow(annVel / 60, 2) * length) / (25.8 * hydraulicDia);
            flowRegime = 'Turbulent';
        }

        return {
            pressureLoss: pressureLoss,
            velocity: annVel,
            reynoldsNumber: re,
            criticalVelocity: criticalVel,
            flowRegime: flowRegime,
            hydraulicDiameter: hydraulicDia
        };
    },

    /**
     * Calculate critical velocity
     * @param {number} mudWeight - Mud weight in PPG
     * @param {number} pv - Plastic viscosity in cP
     * @param {number} yp - Yield point in lb/100ft²
     * @param {number} diameter - Hydraulic diameter in inches
     * @returns {object} Critical velocity results
     */
    criticalVelocity: function(mudWeight, pv, yp, diameter) {
        const critVel = (1.08 * pv + 1.08 * Math.sqrt(Math.pow(pv, 2) + 12.34 * Math.pow(diameter, 2) * yp * mudWeight)) / (mudWeight * diameter);
        const critFlowPipe = critVel * 2.448 * Math.pow(diameter, 2);

        return {
            criticalVelocity: critVel,
            criticalFlowRate: critFlowPipe
        };
    },

    // ===========================================
    // ANNULAR VOLUME CALCULATIONS
    // ===========================================

    /**
     * Calculate annular volume
     * Formula: V = (Dh² - Dp²) / 1029.4 (bbl/ft)
     * @param {number} holeID - Hole/casing ID in inches
     * @param {number} pipeOD - Pipe OD in inches
     * @param {number} length - Length in ft
     * @returns {object} Volume calculations
     */
    annularVolume: function(holeID, pipeOD, length) {
        const capacityPerFoot = (Math.pow(holeID, 2) - Math.pow(pipeOD, 2)) / 1029.4;
        const totalVolume = capacityPerFoot * length;
        const totalGallons = totalVolume * 42;

        return {
            capacityPerFoot: capacityPerFoot,
            totalVolume: totalVolume,
            totalGallons: totalGallons
        };
    },

    /**
     * Calculate pipe capacity
     * Formula: V = D² / 1029.4 (bbl/ft)
     * @param {number} pipeID - Pipe ID in inches
     * @param {number} length - Length in ft
     * @returns {object} Pipe capacity calculations
     */
    pipeCapacity: function(pipeID, length) {
        const capacityPerFoot = Math.pow(pipeID, 2) / 1029.4;
        const totalVolume = capacityPerFoot * length;
        const totalGallons = totalVolume * 42;

        return {
            capacityPerFoot: capacityPerFoot,
            totalVolume: totalVolume,
            totalGallons: totalGallons
        };
    },

    /**
     * Calculate pipe displacement
     * Formula: V = (OD² - ID²) / 1029.4 (bbl/ft)
     * @param {number} pipeOD - Pipe OD in inches
     * @param {number} pipeID - Pipe ID in inches
     * @param {number} length - Length in ft
     * @returns {object} Displacement calculations
     */
    pipeDisplacement: function(pipeOD, pipeID, length) {
        const displacementPerFoot = (Math.pow(pipeOD, 2) - Math.pow(pipeID, 2)) / 1029.4;
        const totalDisplacement = displacementPerFoot * length;
        const closedEnd = Math.pow(pipeOD, 2) / 1029.4 * length;

        return {
            displacementPerFoot: displacementPerFoot,
            openEndDisplacement: totalDisplacement,
            closedEndDisplacement: closedEnd
        };
    },

    /**
     * Calculate bottoms up time
     * @param {number} totalVolume - Total annular volume in bbl
     * @param {number} flowRate - Flow rate in GPM
     * @returns {object} Time calculations
     */
    bottomsUpTime: function(totalVolume, flowRate) {
        const flowRateBBLperMin = flowRate / 42;
        const minutes = totalVolume / flowRateBBLperMin;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);

        return {
            totalMinutes: minutes,
            hours: hours,
            minutes: remainingMinutes,
            formatted: `${hours}h ${remainingMinutes}m`
        };
    },

    // ===========================================
    // ECD CALCULATIONS
    // ===========================================

    /**
     * Calculate Equivalent Circulating Density
     * Formula: ECD = MW + (APL / (0.052 × TVD))
     * @param {number} mudWeight - Mud weight in PPG
     * @param {number} annularPressureLoss - Annular pressure loss in PSI
     * @param {number} tvd - True vertical depth in ft
     * @returns {object} ECD calculations
     */
    ecd: function(mudWeight, annularPressureLoss, tvd) {
        const ecdValue = mudWeight + (annularPressureLoss / (0.052 * tvd));
        const addedWeight = annularPressureLoss / (0.052 * tvd);
        const bhcp = ecdValue * 0.052 * tvd; // Bottom hole circulating pressure

        return {
            ecd: ecdValue,
            addedWeight: addedWeight,
            bhcp: bhcp,
            staticBHP: mudWeight * 0.052 * tvd
        };
    },

    /**
     * Calculate hydrostatic pressure
     * Formula: HP = MW × 0.052 × TVD
     * @param {number} mudWeight - Mud weight in PPG
     * @param {number} tvd - True vertical depth in ft
     * @returns {number} Hydrostatic pressure in PSI
     */
    hydrostaticPressure: function(mudWeight, tvd) {
        return mudWeight * 0.052 * tvd;
    },

    // ===========================================
    // PUMP CALCULATIONS
    // ===========================================

    /**
     * Calculate triplex pump output
     * Formula: Q = 0.000243 × D² × L × Eff × 3 (bbl/stk)
     * @param {number} linerSize - Liner diameter in inches
     * @param {number} strokeLength - Stroke length in inches
     * @param {number} efficiency - Pump efficiency (0-100)
     * @returns {object} Pump output calculations
     */
    triplexPumpOutput: function(linerSize, strokeLength, efficiency) {
        const effDecimal = efficiency / 100;
        const outputPerStroke = 0.000243 * Math.pow(linerSize, 2) * strokeLength * effDecimal * 3;
        const gallonsPerStroke = outputPerStroke * 42;

        return {
            bblPerStroke: outputPerStroke,
            galPerStroke: gallonsPerStroke
        };
    },

    /**
     * Calculate flow rate at given SPM
     * @param {number} bblPerStroke - Pump output in bbl/stk
     * @param {number} spm - Strokes per minute
     * @returns {object} Flow rate calculations
     */
    flowRate: function(bblPerStroke, spm) {
        const bblPerMin = bblPerStroke * spm;
        const gpm = bblPerMin * 42;

        return {
            bblPerMin: bblPerMin,
            gpm: gpm
        };
    },

    /**
     * Calculate strokes to surface
     * @param {number} volume - Total volume in bbl
     * @param {number} bblPerStroke - Pump output in bbl/stk
     * @param {number} spm - Strokes per minute
     * @returns {object} Strokes calculations
     */
    strokesToSurface: function(volume, bblPerStroke, spm) {
        const strokes = volume / bblPerStroke;
        const minutes = strokes / spm;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);

        return {
            strokes: Math.round(strokes),
            totalMinutes: minutes,
            hours: hours,
            minutes: remainingMinutes,
            formatted: `${hours}h ${remainingMinutes}m`
        };
    },

    // ===========================================
    // BIT NOZZLE CALCULATIONS
    // ===========================================

    /**
     * Calculate Total Flow Area (TFA)
     * @param {Array} nozzleSizes - Array of nozzle sizes in 32nds
     * @returns {object} TFA calculations
     */
    totalFlowArea: function(nozzleSizes) {
        let totalArea = 0;
        let nozzleCount = 0;

        for (const size of nozzleSizes) {
            if (size > 0) {
                const diameterInches = size / 32;
                const area = this.constants.PI * Math.pow(diameterInches / 2, 2);
                totalArea += area;
                nozzleCount++;
            }
        }

        return {
            tfa: totalArea,
            nozzleCount: nozzleCount,
            avgNozzleArea: nozzleCount > 0 ? totalArea / nozzleCount : 0
        };
    },

    /**
     * Calculate bit pressure drop
     * Formula: ΔP = (Q² × MW) / (10858 × TFA²)
     * @param {number} flowRate - Flow rate in GPM
     * @param {number} mudWeight - Mud weight in PPG
     * @param {number} tfa - Total flow area in sq inches
     * @returns {object} Bit pressure calculations
     */
    bitPressureDrop: function(flowRate, mudWeight, tfa) {
        const pressureDrop = (Math.pow(flowRate, 2) * mudWeight) / (10858 * Math.pow(tfa, 2));
        const nozzleVelocity = flowRate / (3.117 * tfa);
        const hydraulicHP = (flowRate * pressureDrop) / 1714;
        const impactForce = (flowRate * nozzleVelocity * mudWeight) / 1930;

        return {
            pressureDrop: pressureDrop,
            nozzleVelocity: nozzleVelocity,
            hydraulicHP: hydraulicHP,
            impactForce: impactForce
        };
    },

    // ===========================================
    // MUD WEIGHT CONVERSIONS
    // ===========================================

    /**
     * Convert mud weight between units
     * @param {number} value - Input value
     * @param {string} fromUnit - Source unit (ppg, sg, pcf, kgm3, psi_ft)
     * @returns {object} All converted values
     */
    convertMudWeight: function(value, fromUnit) {
        let ppg;

        // Convert to PPG first
        switch (fromUnit) {
            case 'ppg':
                ppg = value;
                break;
            case 'sg':
                ppg = value * 8.33;
                break;
            case 'pcf':
                ppg = value / 7.48;
                break;
            case 'kgm3':
                ppg = value / 119.83;
                break;
            case 'psi_ft':
                ppg = value / 0.052;
                break;
            default:
                ppg = value;
        }

        // Convert from PPG to all units
        return {
            ppg: ppg,
            sg: ppg / 8.33,
            pcf: ppg * 7.48,
            kgm3: ppg * 119.83,
            psi_ft: ppg * 0.052
        };
    },

    // ===========================================
    // SLUG CALCULATIONS
    // ===========================================

    /**
     * Calculate slug weight for dry pipe
     * Formula: Slug Weight = MW + (Dry Pipe Height × MW × 0.052) / (Slug Length × 0.052)
     * @param {number} mudWeight - Current mud weight in PPG
     * @param {number} dryPipeLength - Desired dry pipe in ft
     * @param {number} pipeID - Pipe ID in inches
     * @param {number} slugLength - Slug length in pipe in ft
     * @returns {object} Slug calculations
     */
    slugWeight: function(mudWeight, dryPipeLength, pipeID, slugLength) {
        const hydrostaticDryPipe = mudWeight * 0.052 * dryPipeLength;
        const slugWeight = mudWeight + (hydrostaticDryPipe / (slugLength * 0.052));

        // Volume calculation
        const pipeCapacity = Math.pow(pipeID, 2) / 1029.4; // bbl/ft
        const slugVolume = pipeCapacity * slugLength;

        return {
            slugWeight: slugWeight,
            slugVolume: slugVolume,
            slugVolumeGal: slugVolume * 42,
            weightIncrease: slugWeight - mudWeight,
            hydrostaticGain: hydrostaticDryPipe
        };
    },

    /**
     * Calculate kill weight mud
     * Formula: KWM = MW + (SIDPP / (0.052 × TVD))
     * @param {number} mudWeight - Current mud weight in PPG
     * @param {number} sidpp - Shut-in drill pipe pressure in PSI
     * @param {number} tvd - True vertical depth in ft
     * @returns {object} Kill weight calculations
     */
    killWeightMud: function(mudWeight, sidpp, tvd) {
        const kwm = mudWeight + (sidpp / (0.052 * tvd));
        const weightIncrease = kwm - mudWeight;
        const formationPressure = (mudWeight * 0.052 * tvd) + sidpp;
        const formationGradient = formationPressure / tvd;

        return {
            killWeight: kwm,
            weightIncrease: weightIncrease,
            formationPressure: formationPressure,
            formationGradient: formationGradient,
            formationPPG: formationGradient / 0.052
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculations;
}
