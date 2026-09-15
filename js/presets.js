// Calculator presets. Figures are sourced in docs/RESEARCH.md; [E] marks a
// triangulated estimate rather than a published number.
// Tariff: KSA industrial 18 halalas + 2 halala non-eligible surcharge (May 2025)
// = SAR 0.20/kWh = $0.0533/kWh at the 3.75 peg.
const TARIFF = 0.0533;

export const PRESETS = [
  {
    id: 'solar',
    name: '10 MWp factory solar PV',
    place: 'Eastern Province, Saudi Arabia',
    blurb: 'Behind-the-meter ground + rooftop array offsetting a plant’s grid purchases at the industrial tariff.',
    unit: '$/kWh',
    p: {
      capex: 6_000_000,               // $0.60/Wp [E]
      energyY1: 18_000_000,           // 10,000 kWp × 1,800 kWh/kWp
      revenue: 18_000_000 * TARIFF,   // avoided grid purchases
      growth: 0.01,                   // tariff escalation, policy scenario
      degradation: 0.005,             // NREL median
      rampY1: 1,
      opex: 120_000,                  // $12/kW-yr
      opexEsc: 0.025,
      replacements: [{ year: 12, cost: 350_000, label: 'Inverter replacement' }],
      taxRate: 0.20, deprYears: 20, life: 25, wacc: 0.08, salvagePct: 0,
    },
    drivers: [
      { key: 'wacc', label: 'Discount rate (WACC)', low: 0.06, high: 0.10, fmt: 'pct' },
      { key: 'capex', label: 'Initial cost', low: 4_500_000, high: 8_500_000, fmt: 'usd', note: '$0.45–0.85/Wp' },
      { key: 'priceMult', label: 'Avoided tariff', low: 0.9, high: 1.5, fmt: 'mult', note: 'SAR 0.18–0.30/kWh' },
      { key: 'volumeMult', label: 'Specific yield', low: 1650 / 1800, high: 2000 / 1800, fmt: 'mult', note: '1,650–2,000 kWh/kWp' },
      { key: 'growth', label: 'Revenue growth (tariff escalation)', low: 0, high: 0.03, fmt: 'pct' },
      { key: 'opex', label: 'O&M cost', low: 80_000, high: 180_000, fmt: 'usd', note: '$8–18/kW-yr' },
      { key: 'degradation', label: 'Module degradation', low: 0.003, high: 0.008, fmt: 'pct' },
      { key: 'life', label: 'Asset life', low: 20, high: 30, fmt: 'yrs' },
    ],
    source: 'SERA tariff via secondary sources (2025); Global Solar Atlas; NREL degradation review; Lazard LCOE+ (2025); team estimates.',
  },
  {
    id: 'whr',
    name: '5 MWe waste-heat-to-power upgrade',
    place: 'Cement plant, Saudi Arabia',
    blurb: 'Steam/ORC unit on the kiln and clinker-cooler exhaust, displacing purchased grid power.',
    unit: '$/kWh',
    p: {
      capex: 10_000_000,              // $2,000/kW installed [E]
      energyY1: 36_000_000,           // 8,000 h × 90% × 5 MW
      revenue: 36_000_000 * TARIFF,
      growth: 0.01, degradation: 0, rampY1: 0.85,
      opex: 300_000, opexEsc: 0.025,  // 3% of capex
      replacements: [{ year: 10, cost: 800_000, label: 'Turbine/boiler overhaul' }],
      taxRate: 0.20, deprYears: 20, life: 20, wacc: 0.10, salvagePct: 0,
    },
    drivers: [
      { key: 'wacc', label: 'Discount rate (hurdle)', low: 0.08, high: 0.12, fmt: 'pct' },
      { key: 'capex', label: 'Initial cost', low: 7_500_000, high: 15_000_000, fmt: 'usd', note: '$1,500–3,000/kW' },
      { key: 'priceMult', label: 'Value of power', low: 0.048 / TARIFF, high: 0.080 / TARIFF, fmt: 'mult', note: '$0.048–0.080/kWh' },
      { key: 'volumeMult', label: 'Operating hours', low: 7000 / 8000, high: 8400 / 8000, fmt: 'mult', note: '7,000–8,400 h/yr' },
      { key: 'growth', label: 'Revenue growth (tariff escalation)', low: 0, high: 0.03, fmt: 'pct' },
      { key: 'opex', label: 'O&M cost', low: 200_000, high: 400_000, fmt: 'usd', note: '2–4% of capex' },
      { key: 'rampY1', label: 'Year-1 ramp-up', low: 0.70, high: 1.0, fmt: 'pct' },
      { key: 'life', label: 'Asset life', low: 15, high: 25, fmt: 'yrs' },
    ],
    source: 'DOE/ORNL waste-heat-to-power assessments; industrial ORC cost ranges (2024–25); SERA tariff; team estimates.',
  },
  {
    id: 'swro',
    name: 'SWRO energy-recovery retrofit',
    place: '20,000 m³/d desalination plant, UAE',
    blurb: 'Isobaric pressure exchangers replacing a Francis turbine, cutting specific energy by 0.8 kWh/m³.',
    unit: '$/kWh',
    p: {
      capex: 1_000_000,
      energyY1: 20_000 * 365 * 0.92 * 0.8,
      revenue: 20_000 * 365 * 0.92 * 0.8 * TARIFF,
      growth: 0.01, degradation: 0, rampY1: 1,
      opex: 20_000, opexEsc: 0.025,
      replacements: [],
      taxRate: 0.09, deprYears: 15, life: 15, wacc: 0.09, salvagePct: 0,
    },
    drivers: [
      { key: 'wacc', label: 'Discount rate', low: 0.07, high: 0.11, fmt: 'pct' },
      { key: 'capex', label: 'Initial cost', low: 700_000, high: 1_500_000, fmt: 'usd' },
      { key: 'volumeMult', label: 'Energy saved per m³', low: 0.5, high: 1.5, fmt: 'mult', note: '0.4–1.2 kWh/m³' },
      { key: 'priceMult', label: 'Value of power', low: 0.9, high: 1.5, fmt: 'mult' },
      { key: 'growth', label: 'Revenue growth (tariff escalation)', low: 0, high: 0.03, fmt: 'pct' },
      { key: 'life', label: 'Asset life', low: 10, high: 20, fmt: 'yrs' },
    ],
    source: 'Danfoss and Energy Recovery Inc. retrofit papers (2023–25); UAE 9% corporate tax; team estimates.',
  },
  {
    id: 'bess',
    name: '10 MWh battery for tariff arbitrage',
    place: 'Industrial site, Abu Dhabi',
    blurb: 'A deliberately hard case: summer-only time-of-use spread of 9.6 fils/kWh against $175/kWh installed cost.',
    unit: '$/kWh',
    p: {
      capex: 1_750_000,
      energyY1: 10_000 * 0.87 * 150,
      revenue: 10_000 * 0.87 * 150 * (0.096 / 3.6725),
      growth: 0.01, degradation: 0.02, rampY1: 1,
      opex: 17_500, opexEsc: 0.025,
      replacements: [{ year: 9, cost: 350_000, label: 'Capacity augmentation' }],
      taxRate: 0.09, deprYears: 12, life: 15, wacc: 0.08, salvagePct: 0,
    },
    drivers: [
      { key: 'wacc', label: 'Discount rate', low: 0.06, high: 0.10, fmt: 'pct' },
      { key: 'capex', label: 'Initial cost', low: 1_170_000, high: 2_000_000, fmt: 'usd', note: '$117–200/kWh' },
      { key: 'priceMult', label: 'Arbitrage spread', low: 0.8, high: 2.0, fmt: 'mult' },
      { key: 'volumeMult', label: 'Cycling days per year', low: 120 / 150, high: 300 / 150, fmt: 'mult', note: '120–300 days' },
      { key: 'growth', label: 'Revenue growth', low: 0, high: 0.03, fmt: 'pct' },
      { key: 'life', label: 'Asset life', low: 10, high: 20, fmt: 'yrs' },
    ],
    source: 'BNEF/Ember storage prices (Dec 2025); IRENA (2025); ADDC TOU tariff; team estimates.',
  },
];

// Discount-rate reference bands shown next to the WACC slider (nominal USD).
export const WACC_BANDS = [
  { label: 'GCC contracted IPP (sovereign offtake)', low: 0.045, base: 0.055, high: 0.065 },
  { label: 'Utility PV, OECD', low: 0.05, base: 0.065, high: 0.08 },
  { label: 'C&I solar, factory-owned', low: 0.065, base: 0.08, high: 0.10 },
  { label: 'District cooling concession', low: 0.07, base: 0.08, high: 0.09 },
  { label: 'Petrochemical / industrial capacity', low: 0.08, base: 0.095, high: 0.11 },
  { label: 'Industrial efficiency retrofit', low: 0.08, base: 0.10, high: 0.12 },
  { label: 'Upstream oil & gas', low: 0.09, base: 0.10, high: 0.12 },
];
