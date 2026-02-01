// MWD Engineer Toolbox - Reference Data

// Poppit Orifice Data
const POPPIT_ORIFICE_DATA = [
    { size: 0.125, thirtySeconds: 4, area: 0.0123, cv: 0.15, flowRange: '20-50' },
    { size: 0.156, thirtySeconds: 5, area: 0.0191, cv: 0.23, flowRange: '30-75' },
    { size: 0.188, thirtySeconds: 6, area: 0.0276, cv: 0.34, flowRange: '50-100' },
    { size: 0.219, thirtySeconds: 7, area: 0.0376, cv: 0.46, flowRange: '75-150' },
    { size: 0.250, thirtySeconds: 8, area: 0.0491, cv: 0.60, flowRange: '100-200' },
    { size: 0.281, thirtySeconds: 9, area: 0.0621, cv: 0.76, flowRange: '125-250' },
    { size: 0.313, thirtySeconds: 10, area: 0.0767, cv: 0.94, flowRange: '150-300' },
    { size: 0.344, thirtySeconds: 11, area: 0.0928, cv: 1.13, flowRange: '200-375' },
    { size: 0.375, thirtySeconds: 12, area: 0.1104, cv: 1.35, flowRange: '250-450' },
    { size: 0.406, thirtySeconds: 13, area: 0.1296, cv: 1.58, flowRange: '300-525' },
    { size: 0.438, thirtySeconds: 14, area: 0.1503, cv: 1.84, flowRange: '350-600' },
    { size: 0.469, thirtySeconds: 15, area: 0.1726, cv: 2.11, flowRange: '400-700' },
    { size: 0.500, thirtySeconds: 16, area: 0.1963, cv: 2.40, flowRange: '450-800' },
    { size: 0.531, thirtySeconds: 17, area: 0.2217, cv: 2.71, flowRange: '500-900' },
    { size: 0.563, thirtySeconds: 18, area: 0.2485, cv: 3.04, flowRange: '550-1000' },
    { size: 0.594, thirtySeconds: 19, area: 0.2769, cv: 3.38, flowRange: '600-1100' },
    { size: 0.625, thirtySeconds: 20, area: 0.3068, cv: 3.75, flowRange: '650-1200' },
    { size: 0.688, thirtySeconds: 22, area: 0.3712, cv: 4.54, flowRange: '750-1400' },
    { size: 0.750, thirtySeconds: 24, area: 0.4418, cv: 5.40, flowRange: '900-1600' },
    { size: 0.813, thirtySeconds: 26, area: 0.5185, cv: 6.34, flowRange: '1000-1850' },
    { size: 0.875, thirtySeconds: 28, area: 0.6013, cv: 7.35, flowRange: '1150-2100' },
    { size: 0.938, thirtySeconds: 30, area: 0.6903, cv: 8.44, flowRange: '1300-2400' },
    { size: 1.000, thirtySeconds: 32, area: 0.7854, cv: 9.60, flowRange: '1450-2700' }
];

// API Rotary Shouldered Connections Data
const PIPE_CONNECTIONS_DATA = [
    // NC (Numbered Connection) Series
    { connection: 'NC23', type: 'NC', od: 2.875, id: 1.000, tpi: 4, taper: 2, pinLength: 2.5, boxId: 1.750, interchange: '2-3/8 PAC' },
    { connection: 'NC26', type: 'NC', od: 3.375, id: 1.500, tpi: 4, taper: 2, pinLength: 3.0, boxId: 2.063, interchange: '2-3/8 IF' },
    { connection: 'NC31', type: 'NC', od: 4.000, id: 2.000, tpi: 4, taper: 2, pinLength: 3.0, boxId: 2.563, interchange: '2-7/8 IF' },
    { connection: 'NC35', type: 'NC', od: 4.500, id: 2.250, tpi: 4, taper: 2, pinLength: 3.5, boxId: 2.813, interchange: '3-1/2 DSL' },
    { connection: 'NC38', type: 'NC', od: 4.875, id: 2.500, tpi: 4, taper: 2, pinLength: 3.5, boxId: 3.063, interchange: '3-1/2 IF' },
    { connection: 'NC40', type: 'NC', od: 5.250, id: 2.813, tpi: 4, taper: 2, pinLength: 4.0, boxId: 3.250, interchange: '4 SL' },
    { connection: 'NC44', type: 'NC', od: 5.750, id: 3.000, tpi: 4, taper: 2, pinLength: 4.0, boxId: 3.750, interchange: '-' },
    { connection: 'NC46', type: 'NC', od: 6.000, id: 3.000, tpi: 4, taper: 2, pinLength: 4.0, boxId: 4.000, interchange: '4 IF' },
    { connection: 'NC50', type: 'NC', od: 6.625, id: 3.500, tpi: 4, taper: 2, pinLength: 4.0, boxId: 4.250, interchange: '4-1/2 IF (XH)' },
    { connection: 'NC56', type: 'NC', od: 7.250, id: 4.000, tpi: 4, taper: 2, pinLength: 4.5, boxId: 5.000, interchange: '-' },
    { connection: 'NC61', type: 'NC', od: 8.000, id: 4.500, tpi: 4, taper: 2, pinLength: 4.5, boxId: 5.250, interchange: '-' },
    { connection: 'NC70', type: 'NC', od: 9.000, id: 5.000, tpi: 4, taper: 2, pinLength: 5.0, boxId: 6.000, interchange: '-' },
    { connection: 'NC77', type: 'NC', od: 10.000, id: 6.000, tpi: 4, taper: 2, pinLength: 5.5, boxId: 7.000, interchange: '-' },

    // IF (Internal Flush) Series
    { connection: '2-3/8 IF', type: 'IF', od: 3.375, id: 1.500, tpi: 4, taper: 2, pinLength: 3.0, boxId: 2.063, interchange: 'NC26' },
    { connection: '2-7/8 IF', type: 'IF', od: 4.000, id: 2.000, tpi: 4, taper: 2, pinLength: 3.0, boxId: 2.563, interchange: 'NC31' },
    { connection: '3-1/2 IF', type: 'IF', od: 4.875, id: 2.563, tpi: 4, taper: 2, pinLength: 3.5, boxId: 3.063, interchange: 'NC38' },
    { connection: '4 IF', type: 'IF', od: 6.000, id: 3.000, tpi: 4, taper: 2, pinLength: 4.0, boxId: 4.000, interchange: 'NC46' },
    { connection: '4-1/2 IF', type: 'IF', od: 6.625, id: 3.500, tpi: 4, taper: 2, pinLength: 4.0, boxId: 4.250, interchange: 'NC50 (XH)' },

    // FH (Full Hole) Series
    { connection: '3-1/2 FH', type: 'FH', od: 4.750, id: 2.563, tpi: 4, taper: 3, pinLength: 3.5, boxId: 2.750, interchange: '-' },
    { connection: '4 FH', type: 'FH', od: 5.375, id: 3.000, tpi: 4, taper: 3, pinLength: 4.0, boxId: 3.250, interchange: '-' },
    { connection: '4-1/2 FH', type: 'FH', od: 5.875, id: 3.500, tpi: 4, taper: 3, pinLength: 4.0, boxId: 3.625, interchange: '-' },
    { connection: '5-1/2 FH', type: 'FH', od: 7.000, id: 4.250, tpi: 4, taper: 3, pinLength: 4.5, boxId: 4.500, interchange: '-' },
    { connection: '6-5/8 FH', type: 'FH', od: 8.250, id: 5.000, tpi: 4, taper: 3, pinLength: 5.0, boxId: 5.500, interchange: '6-5/8 REG' },

    // REG (Regular) Series
    { connection: '2-3/8 REG', type: 'REG', od: 3.125, id: 1.250, tpi: 5, taper: 3, pinLength: 2.5, boxId: 1.750, interchange: '-' },
    { connection: '2-7/8 REG', type: 'REG', od: 3.625, id: 1.750, tpi: 5, taper: 3, pinLength: 3.0, boxId: 2.125, interchange: '-' },
    { connection: '3-1/2 REG', type: 'REG', od: 4.500, id: 2.250, tpi: 5, taper: 3, pinLength: 3.5, boxId: 2.750, interchange: '-' },
    { connection: '4-1/2 REG', type: 'REG', od: 5.750, id: 3.000, tpi: 4, taper: 3, pinLength: 4.0, boxId: 3.625, interchange: '-' },
    { connection: '5-1/2 REG', type: 'REG', od: 7.000, id: 4.000, tpi: 4, taper: 3, pinLength: 4.5, boxId: 4.500, interchange: '-' },
    { connection: '6-5/8 REG', type: 'REG', od: 8.250, id: 5.000, tpi: 4, taper: 3, pinLength: 5.0, boxId: 5.500, interchange: '6-5/8 FH' },
    { connection: '7-5/8 REG', type: 'REG', od: 9.500, id: 6.000, tpi: 4, taper: 3, pinLength: 5.5, boxId: 6.500, interchange: '-' },
    { connection: '8-5/8 REG', type: 'REG', od: 10.750, id: 7.000, tpi: 4, taper: 3, pinLength: 6.0, boxId: 7.500, interchange: '-' },

    // PAC (Slim Hole) Series
    { connection: '2-3/8 PAC', type: 'PAC', od: 2.875, id: 1.000, tpi: 4, taper: 2, pinLength: 2.5, boxId: 1.750, interchange: 'NC23' },
    { connection: '2-7/8 PAC', type: 'PAC', od: 3.500, id: 1.750, tpi: 4, taper: 2, pinLength: 3.0, boxId: 2.125, interchange: '-' },
    { connection: '3-1/2 PAC', type: 'PAC', od: 4.250, id: 2.250, tpi: 4, taper: 2, pinLength: 3.5, boxId: 2.625, interchange: '-' }
];

// Common Drill Pipe Specifications
const DRILL_PIPE_DATA = [
    { size: '2-3/8"', od: 2.375, id: 1.815, weight: 4.85, grade: 'E-75', capacity: 0.00320, displacement: 0.00394 },
    { size: '2-3/8"', od: 2.375, id: 1.815, weight: 6.65, grade: 'X-95', capacity: 0.00320, displacement: 0.00540 },
    { size: '2-7/8"', od: 2.875, id: 2.441, weight: 6.85, grade: 'E-75', capacity: 0.00579, displacement: 0.00556 },
    { size: '2-7/8"', od: 2.875, id: 2.441, weight: 10.40, grade: 'X-95', capacity: 0.00579, displacement: 0.00844 },
    { size: '3-1/2"', od: 3.500, id: 2.764, weight: 9.50, grade: 'E-75', capacity: 0.00742, displacement: 0.00771 },
    { size: '3-1/2"', od: 3.500, id: 2.764, weight: 13.30, grade: 'S-135', capacity: 0.00742, displacement: 0.01080 },
    { size: '3-1/2"', od: 3.500, id: 2.602, weight: 15.50, grade: 'S-135', capacity: 0.00658, displacement: 0.01259 },
    { size: '4"', od: 4.000, id: 3.340, weight: 11.85, grade: 'E-75', capacity: 0.01084, displacement: 0.00962 },
    { size: '4"', od: 4.000, id: 3.340, weight: 14.00, grade: 'X-95', capacity: 0.01084, displacement: 0.01137 },
    { size: '4-1/2"', od: 4.500, id: 3.826, weight: 13.75, grade: 'E-75', capacity: 0.01422, displacement: 0.01116 },
    { size: '4-1/2"', od: 4.500, id: 3.826, weight: 16.60, grade: 'X-95', capacity: 0.01422, displacement: 0.01348 },
    { size: '4-1/2"', od: 4.500, id: 3.640, weight: 20.00, grade: 'S-135', capacity: 0.01287, displacement: 0.01624 },
    { size: '5"', od: 5.000, id: 4.276, weight: 16.25, grade: 'E-75', capacity: 0.01776, displacement: 0.01319 },
    { size: '5"', od: 5.000, id: 4.276, weight: 19.50, grade: 'X-95', capacity: 0.01776, displacement: 0.01583 },
    { size: '5"', od: 5.000, id: 4.276, weight: 25.60, grade: 'S-135', capacity: 0.01776, displacement: 0.02079 },
    { size: '5-1/2"', od: 5.500, id: 4.778, weight: 19.20, grade: 'E-75', capacity: 0.02218, displacement: 0.01559 },
    { size: '5-1/2"', od: 5.500, id: 4.670, weight: 21.90, grade: 'X-95', capacity: 0.02119, displacement: 0.01778 },
    { size: '5-1/2"', od: 5.500, id: 4.670, weight: 24.70, grade: 'S-135', capacity: 0.02119, displacement: 0.02005 },
    { size: '5-7/8"', od: 5.875, id: 5.153, weight: 23.40, grade: 'S-135', capacity: 0.02580, displacement: 0.01900 },
    { size: '6-5/8"', od: 6.625, id: 5.901, weight: 25.20, grade: 'S-135', capacity: 0.03383, displacement: 0.02046 }
];

// Pump Liner Output Data (95% efficiency, triplex pump)
const PUMP_LINER_DATA = [
    { liner: 4.0, stroke10: 0.0437, stroke11: 0.0480, stroke12: 0.0524 },
    { liner: 4.5, stroke10: 0.0553, stroke11: 0.0608, stroke12: 0.0664 },
    { liner: 5.0, stroke10: 0.0683, stroke11: 0.0751, stroke12: 0.0819 },
    { liner: 5.5, stroke10: 0.0826, stroke11: 0.0909, stroke12: 0.0991 },
    { liner: 6.0, stroke10: 0.0983, stroke11: 0.1081, stroke12: 0.1179 },
    { liner: 6.5, stroke10: 0.1154, stroke11: 0.1269, stroke12: 0.1384 },
    { liner: 7.0, stroke10: 0.1338, stroke11: 0.1472, stroke12: 0.1606 },
    { liner: 7.5, stroke10: 0.1536, stroke11: 0.1690, stroke12: 0.1843 },
    { liner: 8.0, stroke10: 0.1748, stroke11: 0.1923, stroke12: 0.2097 }
];

// Common Hole Sizes
const HOLE_SIZES = [
    { size: '4-3/4"', diameter: 4.75 },
    { size: '5-7/8"', diameter: 5.875 },
    { size: '6"', diameter: 6.0 },
    { size: '6-1/8"', diameter: 6.125 },
    { size: '6-1/4"', diameter: 6.25 },
    { size: '6-1/2"', diameter: 6.5 },
    { size: '6-3/4"', diameter: 6.75 },
    { size: '7-7/8"', diameter: 7.875 },
    { size: '8-1/2"', diameter: 8.5 },
    { size: '8-3/4"', diameter: 8.75 },
    { size: '9-1/2"', diameter: 9.5 },
    { size: '9-7/8"', diameter: 9.875 },
    { size: '10-5/8"', diameter: 10.625 },
    { size: '12-1/4"', diameter: 12.25 },
    { size: '14-3/4"', diameter: 14.75 },
    { size: '17-1/2"', diameter: 17.5 },
    { size: '26"', diameter: 26.0 }
];

// Common Casing Sizes and Weights
const CASING_DATA = [
    { size: '4-1/2"', od: 4.5, weight: 9.5, id: 4.090, drift: 3.965 },
    { size: '4-1/2"', od: 4.5, weight: 11.6, id: 4.000, drift: 3.875 },
    { size: '5"', od: 5.0, weight: 11.5, id: 4.560, drift: 4.435 },
    { size: '5"', od: 5.0, weight: 15.0, id: 4.408, drift: 4.283 },
    { size: '5-1/2"', od: 5.5, weight: 14.0, id: 5.012, drift: 4.887 },
    { size: '5-1/2"', od: 5.5, weight: 17.0, id: 4.892, drift: 4.767 },
    { size: '7"', od: 7.0, weight: 20.0, id: 6.456, drift: 6.331 },
    { size: '7"', od: 7.0, weight: 23.0, id: 6.366, drift: 6.241 },
    { size: '7"', od: 7.0, weight: 26.0, id: 6.276, drift: 6.151 },
    { size: '7-5/8"', od: 7.625, weight: 24.0, id: 7.025, drift: 6.900 },
    { size: '7-5/8"', od: 7.625, weight: 29.7, id: 6.875, drift: 6.750 },
    { size: '9-5/8"', od: 9.625, weight: 36.0, id: 8.921, drift: 8.765 },
    { size: '9-5/8"', od: 9.625, weight: 40.0, id: 8.835, drift: 8.679 },
    { size: '9-5/8"', od: 9.625, weight: 47.0, id: 8.681, drift: 8.525 },
    { size: '10-3/4"', od: 10.75, weight: 40.5, id: 10.050, drift: 9.894 },
    { size: '10-3/4"', od: 10.75, weight: 45.5, id: 9.950, drift: 9.794 },
    { size: '11-3/4"', od: 11.75, weight: 42.0, id: 11.084, drift: 10.928 },
    { size: '11-3/4"', od: 11.75, weight: 47.0, id: 11.000, drift: 10.844 },
    { size: '13-3/8"', od: 13.375, weight: 48.0, id: 12.715, drift: 12.559 },
    { size: '13-3/8"', od: 13.375, weight: 54.5, id: 12.615, drift: 12.459 },
    { size: '13-3/8"', od: 13.375, weight: 68.0, id: 12.415, drift: 12.259 },
    { size: '16"', od: 16.0, weight: 65.0, id: 15.250, drift: 15.062 },
    { size: '16"', od: 16.0, weight: 84.0, id: 15.010, drift: 14.822 },
    { size: '18-5/8"', od: 18.625, weight: 87.5, id: 17.755, drift: 17.567 },
    { size: '20"', od: 20.0, weight: 94.0, id: 19.124, drift: 18.936 },
    { size: '20"', od: 20.0, weight: 106.5, id: 19.000, drift: 18.812 }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        POPPIT_ORIFICE_DATA,
        PIPE_CONNECTIONS_DATA,
        DRILL_PIPE_DATA,
        PUMP_LINER_DATA,
        HOLE_SIZES,
        CASING_DATA
    };
}
