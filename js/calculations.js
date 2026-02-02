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
    },

    // ===========================================
    // DIRECTIONAL/SURVEY CALCULATIONS
    // ===========================================

    /**
     * Convert degrees to radians
     */
    toRadians: function(degrees) {
        return degrees * (Math.PI / 180);
    },

    /**
     * Convert radians to degrees
     */
    toDegrees: function(radians) {
        return radians * (180 / Math.PI);
    },

    /**
     * Calculate Dogleg Severity
     * Formula: DLS = (100/CL) × arccos[cos(I2-I1) - sin(I1)×sin(I2)×(1-cos(A2-A1))]
     * @param {number} inc1 - Survey 1 inclination in degrees
     * @param {number} azi1 - Survey 1 azimuth in degrees
     * @param {number} inc2 - Survey 2 inclination in degrees
     * @param {number} azi2 - Survey 2 azimuth in degrees
     * @param {number} courseLength - Course length in ft
     * @returns {object} DLS calculations
     */
    doglegSeverity: function(inc1, azi1, inc2, azi2, courseLength) {
        const i1 = this.toRadians(inc1);
        const i2 = this.toRadians(inc2);
        const a1 = this.toRadians(azi1);
        const a2 = this.toRadians(azi2);

        // Dogleg angle calculation
        const cosAngle = Math.cos(i2 - i1) - Math.sin(i1) * Math.sin(i2) * (1 - Math.cos(a2 - a1));
        const clampedCos = Math.max(-1, Math.min(1, cosAngle)); // Clamp to [-1, 1]
        const doglegAngle = Math.acos(clampedCos);
        const doglegDegrees = this.toDegrees(doglegAngle);

        // DLS per 100 ft
        const dls = (100 / courseLength) * doglegDegrees;

        return {
            doglegAngle: doglegDegrees,
            dls: dls,
            dlsPer30m: dls * 0.3048 * 100 / 30 // DLS per 30m
        };
    },

    /**
     * Calculate Build and Turn rates from two surveys
     * @param {number} inc1 - Survey 1 inclination in degrees
     * @param {number} azi1 - Survey 1 azimuth in degrees
     * @param {number} inc2 - Survey 2 inclination in degrees
     * @param {number} azi2 - Survey 2 azimuth in degrees
     * @param {number} courseLength - Course length in ft
     * @returns {object} Build/Turn calculations
     */
    buildTurnRate: function(inc1, azi1, inc2, azi2, courseLength) {
        // Build rate (change in inclination per 100 ft)
        const incChange = inc2 - inc1;
        const buildRate = (incChange / courseLength) * 100;

        // Turn rate (change in azimuth per 100 ft)
        let aziChange = azi2 - azi1;
        // Handle azimuth wrap-around
        if (aziChange > 180) aziChange -= 360;
        if (aziChange < -180) aziChange += 360;
        const turnRate = (aziChange / courseLength) * 100;

        // Calculate DLS
        const dlsResult = this.doglegSeverity(inc1, azi1, inc2, azi2, courseLength);

        return {
            buildRate: buildRate,
            turnRate: turnRate,
            incChange: incChange,
            aziChange: aziChange,
            dls: dlsResult.dls,
            isBuilding: buildRate > 0,
            isTurningRight: turnRate > 0
        };
    },

    /**
     * Convert between Gravity Toolface (GTF) and Magnetic Toolface (MTF)
     * @param {number} inclination - Current inclination in degrees
     * @param {number} azimuth - Current azimuth in degrees
     * @param {number} toolface - Toolface value in degrees
     * @param {string} fromType - 'gtf' or 'mtf'
     * @returns {object} Converted toolface values
     */
    convertToolface: function(inclination, azimuth, toolface, fromType) {
        const inc = this.toRadians(inclination);

        if (fromType === 'gtf') {
            // GTF to MTF
            // MTF = Azi + arctan(tan(GTF) / cos(Inc))
            const gtfRad = this.toRadians(toolface);
            let mtf;

            if (Math.abs(toolface - 90) < 0.001 || Math.abs(toolface - 270) < 0.001) {
                // Handle 90° and 270° cases
                mtf = toolface;
            } else {
                const tanGTF = Math.tan(gtfRad);
                const cosInc = Math.cos(inc);
                mtf = this.toDegrees(Math.atan2(tanGTF, cosInc));

                // Adjust quadrant
                if (toolface > 90 && toolface <= 270) {
                    mtf += 180;
                }
            }

            // Normalize to 0-360
            while (mtf < 0) mtf += 360;
            while (mtf >= 360) mtf -= 360;

            return {
                gtf: toolface,
                mtf: mtf,
                direction: this.getToolfaceDirection(toolface)
            };
        } else {
            // MTF to GTF
            const mtfRad = this.toRadians(toolface);
            const cosInc = Math.cos(inc);
            let gtf = this.toDegrees(Math.atan(Math.tan(mtfRad) * cosInc));

            // Adjust quadrant
            if (toolface > 90 && toolface <= 270) {
                gtf += 180;
            }

            // Normalize to 0-360
            while (gtf < 0) gtf += 360;
            while (gtf >= 360) gtf -= 360;

            return {
                gtf: gtf,
                mtf: toolface,
                direction: this.getToolfaceDirection(gtf)
            };
        }
    },

    /**
     * Get toolface direction description
     */
    getToolfaceDirection: function(gtf) {
        if (gtf >= 337.5 || gtf < 22.5) return 'High Side (Building)';
        if (gtf >= 22.5 && gtf < 67.5) return 'High Right';
        if (gtf >= 67.5 && gtf < 112.5) return 'Right (Turning Right)';
        if (gtf >= 112.5 && gtf < 157.5) return 'Low Right';
        if (gtf >= 157.5 && gtf < 202.5) return 'Low Side (Dropping)';
        if (gtf >= 202.5 && gtf < 247.5) return 'Low Left';
        if (gtf >= 247.5 && gtf < 292.5) return 'Left (Turning Left)';
        if (gtf >= 292.5 && gtf < 337.5) return 'High Left';
        return 'Unknown';
    },

    /**
     * Project survey ahead using expected DLS and toolface
     * @param {number} currentInc - Current inclination in degrees
     * @param {number} currentAzi - Current azimuth in degrees
     * @param {number} dls - Expected DLS in deg/100ft
     * @param {number} toolface - Toolface in degrees (0=high side)
     * @param {number} distance - Projection distance in ft
     * @returns {object} Projected survey values
     */
    projectSurvey: function(currentInc, currentAzi, dls, toolface, distance) {
        // Convert DLS to dogleg for this distance
        const dogleg = (dls * distance) / 100;
        const doglegRad = this.toRadians(dogleg);
        const tfRad = this.toRadians(toolface);
        const incRad = this.toRadians(currentInc);

        // Calculate expected build and turn components
        const buildComponent = dogleg * Math.cos(tfRad);
        const turnComponent = dogleg * Math.sin(tfRad);

        // New inclination
        let newInc = currentInc + buildComponent;

        // New azimuth (adjusted for inclination)
        let newAzi = currentAzi;
        if (currentInc > 0.5) { // Avoid division by near-zero
            newAzi = currentAzi + (turnComponent / Math.sin(incRad));
        }

        // Normalize azimuth
        while (newAzi < 0) newAzi += 360;
        while (newAzi >= 360) newAzi -= 360;

        // Clamp inclination
        if (newInc < 0) newInc = 0;
        if (newInc > 180) newInc = 180;

        return {
            projectedInc: newInc,
            projectedAzi: newAzi,
            buildComponent: buildComponent,
            turnComponent: turnComponent,
            effectiveDLS: dogleg * (100 / distance)
        };
    },

    // ===========================================
    // MOTOR YIELD CALCULATIONS
    // ===========================================

    /**
     * Calculate slide footage needed for target DLS
     * @param {number} motorYield - Motor yield in deg/100ft (100% slide)
     * @param {number} targetDLS - Target DLS in deg/100ft
     * @param {number} interval - Drilling interval in ft
     * @returns {object} Slide calculations
     */
    slideCalculation: function(motorYield, targetDLS, interval) {
        const slidePercent = (targetDLS / motorYield) * 100;
        const slideFootage = (slidePercent / 100) * interval;
        const rotateFootage = interval - slideFootage;

        return {
            slidePercent: Math.min(100, Math.max(0, slidePercent)),
            slideFootage: Math.min(interval, Math.max(0, slideFootage)),
            rotateFootage: Math.max(0, rotateFootage),
            achievableDLS: (slideFootage / interval) * motorYield
        };
    },

    /**
     * Estimate motor yield from bend angle
     * Rough estimation: Yield ≈ Bend × 4 for typical motors
     * @param {number} bendAngle - Motor bend angle in degrees
     * @param {number} bitToBend - Bit to bend distance in ft
     * @returns {object} Estimated yield
     */
    estimateMotorYield: function(bendAngle, bitToBend) {
        // Simplified formula: shorter bit-to-bend = higher yield
        const baseFactor = 4.5; // Base multiplier
        const btbFactor = 3.5 / bitToBend; // Adjustment for bit-to-bend

        const estimatedYield = bendAngle * baseFactor * btbFactor;

        return {
            estimatedYield: estimatedYield,
            minYield: estimatedYield * 0.8,
            maxYield: estimatedYield * 1.2,
            note: 'Actual yield varies by motor design, formation, and WOB'
        };
    },

    /**
     * Calculate expected build/turn from slide
     * @param {number} motorYield - Motor yield in deg/100ft
     * @param {number} toolface - Toolface in degrees
     * @param {number} slideFootage - Slide footage
     * @returns {object} Expected build and turn
     */
    expectedBuildTurn: function(motorYield, toolface, slideFootage) {
        const tfRad = this.toRadians(toolface);
        const totalDogleg = (motorYield * slideFootage) / 100;

        const buildComponent = totalDogleg * Math.cos(tfRad);
        const turnComponent = totalDogleg * Math.sin(tfRad);

        return {
            expectedBuild: buildComponent,
            expectedTurn: turnComponent,
            totalDogleg: totalDogleg,
            buildRate: (buildComponent / slideFootage) * 100,
            turnRate: (turnComponent / slideFootage) * 100
        };
    },

    // ===========================================
    // MAGNETIC REFERENCE CALCULATIONS
    // ===========================================

    /**
     * Calculate total correction angle
     * @param {number} declination - Magnetic declination (East +, West -)
     * @param {number} convergence - Grid convergence (East +, West -)
     * @returns {object} Magnetic reference calculations
     */
    magneticReference: function(declination, convergence) {
        const totalCorrection = declination - convergence;

        return {
            declination: declination,
            convergence: convergence,
            totalCorrection: totalCorrection
        };
    },

    /**
     * Convert azimuth between reference systems
     * @param {number} azimuth - Input azimuth in degrees
     * @param {string} fromType - 'mag', 'true', or 'grid'
     * @param {number} declination - Magnetic declination
     * @param {number} convergence - Grid convergence
     * @returns {object} Converted azimuths
     */
    convertAzimuth: function(azimuth, fromType, declination, convergence) {
        let magAzi, trueAzi, gridAzi;

        switch (fromType) {
            case 'mag':
                magAzi = azimuth;
                trueAzi = azimuth + declination;
                gridAzi = trueAzi - convergence;
                break;
            case 'true':
                trueAzi = azimuth;
                magAzi = azimuth - declination;
                gridAzi = azimuth - convergence;
                break;
            case 'grid':
                gridAzi = azimuth;
                trueAzi = azimuth + convergence;
                magAzi = trueAzi - declination;
                break;
            default:
                magAzi = trueAzi = gridAzi = azimuth;
        }

        // Normalize all to 0-360
        const normalize = (azi) => {
            while (azi < 0) azi += 360;
            while (azi >= 360) azi -= 360;
            return azi;
        };

        return {
            magnetic: normalize(magAzi),
            true: normalize(trueAzi),
            grid: normalize(gridAzi)
        };
    },

    // ===========================================
    // UNIT CONVERSIONS
    // ===========================================

    /**
     * Convert decimal to fraction
     * @param {number} decimal - Decimal value
     * @param {number} denominator - Target denominator (8, 16, 32, 64)
     * @returns {object} Fraction representation
     */
    decimalToFraction: function(decimal, denominator) {
        const numerator = Math.round(decimal * denominator);
        const gcd = this.gcd(numerator, denominator);
        const reducedNum = numerator / gcd;
        const reducedDen = denominator / gcd;

        const wholePart = Math.floor(reducedNum / reducedDen);
        const fractionalNum = reducedNum % reducedDen;

        let fractionStr;
        if (wholePart > 0 && fractionalNum > 0) {
            fractionStr = `${wholePart} ${fractionalNum}/${reducedDen}`;
        } else if (wholePart > 0) {
            fractionStr = `${wholePart}`;
        } else if (fractionalNum > 0) {
            fractionStr = `${fractionalNum}/${reducedDen}`;
        } else {
            fractionStr = '0';
        }

        return {
            numerator: numerator,
            denominator: denominator,
            reduced: `${reducedNum}/${reducedDen}`,
            display: fractionStr,
            thirtySeconds: Math.round(decimal * 32)
        };
    },

    /**
     * Convert fraction to decimal
     * @param {string} fraction - Fraction string (e.g., "3/8" or "1 3/8")
     * @returns {number} Decimal value
     */
    fractionToDecimal: function(fraction) {
        const parts = fraction.trim().split(' ');
        let total = 0;

        for (const part of parts) {
            if (part.includes('/')) {
                const [num, den] = part.split('/').map(Number);
                total += num / den;
            } else {
                total += Number(part);
            }
        }

        return total;
    },

    /**
     * Greatest common divisor
     */
    gcd: function(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a;
    },

    /**
     * Convert length units
     * @param {number} value - Input value
     * @param {string} fromUnit - 'ft', 'm', 'in', 'cm'
     * @returns {object} All length conversions
     */
    convertLength: function(value, fromUnit) {
        let meters;

        switch (fromUnit) {
            case 'ft': meters = value * 0.3048; break;
            case 'm': meters = value; break;
            case 'in': meters = value * 0.0254; break;
            case 'cm': meters = value / 100; break;
            default: meters = value;
        }

        return {
            feet: meters / 0.3048,
            meters: meters,
            inches: meters / 0.0254,
            centimeters: meters * 100
        };
    },

    /**
     * Convert temperature
     * @param {number} value - Input value
     * @param {string} fromUnit - 'f' or 'c'
     * @returns {object} Temperature conversions
     */
    convertTemperature: function(value, fromUnit) {
        let celsius;

        if (fromUnit === 'f') {
            celsius = (value - 32) * 5 / 9;
        } else {
            celsius = value;
        }

        return {
            fahrenheit: (celsius * 9 / 5) + 32,
            celsius: celsius,
            kelvin: celsius + 273.15
        };
    },

    /**
     * Convert pressure
     * @param {number} value - Input value
     * @param {string} fromUnit - 'psi', 'kpa', 'bar', 'atm'
     * @returns {object} Pressure conversions
     */
    convertPressure: function(value, fromUnit) {
        let psi;

        switch (fromUnit) {
            case 'psi': psi = value; break;
            case 'kpa': psi = value / 6.89476; break;
            case 'bar': psi = value * 14.5038; break;
            case 'atm': psi = value * 14.6959; break;
            default: psi = value;
        }

        return {
            psi: psi,
            kpa: psi * 6.89476,
            bar: psi / 14.5038,
            atm: psi / 14.6959,
            mpa: psi * 0.00689476
        };
    },

    /**
     * Calculate sensor depth from bit depth
     * @param {number} bitDepth - Bit depth in ft
     * @param {number} sensorOffset - Sensor offset (bit to sensor) in ft
     * @returns {object} Depth calculations
     */
    sensorDepth: function(bitDepth, sensorOffset) {
        return {
            bitDepth: bitDepth,
            surveyDepth: bitDepth - sensorOffset,
            sensorOffset: sensorOffset
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculations;
}
