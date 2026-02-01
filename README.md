# MWD Engineer Toolbox

A comprehensive web-based toolkit for Measurement While Drilling (MWD) engineers. This application provides essential calculations, conversion charts, and reference data commonly used in drilling operations.

## Features

### Poppit Orifice Selection
- Calculate recommended orifice size based on flow rate, mud weight, and available pressure drop
- Complete reference chart with orifice sizes (in 32nds), areas, and typical flow ranges
- Pressure drop calculations using industry-standard orifice flow equations

### Pipe Connection Conversion Charts
- API rotary shouldered connection specifications
- Includes NC, IF, FH, REG, and PAC connection types
- Dimensions: OD, ID, TPI, taper, pin length, box ID
- Connection interchange reference

### Hydraulics Calculator
- **Pipe Pressure Loss**: Bingham Plastic model calculations for pressure loss in drill pipe
- **Annular Pressure Loss**: Calculate pressure loss in the annulus
- **Critical Velocity**: Determine laminar/turbulent flow transition points
- Includes Reynolds number, flow regime identification

### Annular Calculations
- Annular volume (bbl/ft and total)
- Annular velocity (ft/min)
- **Bottoms Up Calculator**: Multi-section support for accurate lag time calculations

### ECD Calculator
- Equivalent Circulating Density calculations
- Hydrostatic pressure calculator
- Bottom hole circulating pressure (BHCP)

### Pump Output Calculator
- Triplex pump output calculations
- Support for various liner sizes and stroke lengths
- Strokes to surface calculator
- Common pump liner output reference table

### Bit Nozzle/TFA Calculator
- Total Flow Area (TFA) calculations for up to 6 nozzles
- Bit pressure drop
- Nozzle velocity
- Hydraulic horsepower
- Impact force

### Mud Weight Conversions
- Convert between PPG, Specific Gravity, PCF, kg/m³, and PSI/ft
- Quick reference for common values

### Trip/Slug Calculator
- Slug weight calculator for achieving desired dry pipe length
- Pipe displacement (open and closed end)
- Kill Weight Mud calculator

## Usage

1. Open `index.html` in any modern web browser
2. Navigate using the menu or feature cards on the home page
3. Enter values and click Calculate to see results

### Installation as PWA (Mobile)
The app can be installed on mobile devices for offline use:
1. Open the app in Chrome/Safari
2. Use "Add to Home Screen" option
3. The app will work offline once installed

## Calculations Reference

All calculations use industry-standard formulas:

- **Annular Volume**: V = (Dh² - Dp²) / 1029.4 bbl/ft
- **Annular Velocity**: V = 24.5 × Q / (Dh² - Dp²) ft/min
- **ECD**: ECD = MW + (APL / (0.052 × TVD)) PPG
- **Hydrostatic Pressure**: HP = MW × 0.052 × TVD PSI
- **Bit Pressure Drop**: ΔP = (Q² × MW) / (10858 × TFA²) PSI
- **Pump Output (Triplex)**: Q = 0.000243 × D² × L × Eff × 3 bbl/stk

## File Structure

```
├── index.html          # Main HTML file
├── manifest.json       # PWA manifest
├── css/
│   └── styles.css     # Application styles
├── js/
│   ├── data.js        # Reference data (orifices, connections, etc.)
│   ├── calculations.js # Engineering calculation functions
│   └── app.js         # Main application logic
└── README.md          # This file
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome for Android)

## Disclaimer

This tool is provided for field reference only. Always verify calculations with official engineering documentation and company procedures. The developers are not responsible for any errors or decisions made based on these calculations.

## License

MIT License - Free to use and modify for personal and commercial use.
