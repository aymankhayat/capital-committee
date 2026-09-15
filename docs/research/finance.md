# Research: Engineering-Economics Calculator (NPV / IRR / Payback + Tornado)

Compiled 2026-09-15. All currency USD unless stated; SAR pegged at 3.75/USD, AED at 3.6725/USD.
Confidence tags: **[V]** = verified from primary/near-primary source in this session; **[S]** = secondary source (news/aggregator); **[E]** = analyst estimate / triangulated, flagged so the app can label it "illustrative".

---

## 1. Discount rates / WACC

### 1.1 Anchor data points

| Source (year) | Figure | Tag |
|---|---|---|
| Damodaran country risk premiums, Jan 2026 | Saudi Arabia Aa3: default spread 0.51%, **CRP 0.78%**, total ERP 5.01%. UAE Aa2: spread 0.42%, **CRP 0.64%**, ERP 4.87%. Qatar Aa2: **CRP 0.64%**, ERP 4.87%. Kuwait A1: CRP 0.91%. Oman Baa3: CRP 2.85%. Implied mature-market ERP = 5.01 − 0.78 = **4.23%** | [V] |
| Damodaran industry WACC (US, Jan 2026) | Power 5.01% (β 0.48, D/(D+E) 43%); Utility (General) 4.36%; Water Utility 4.93%; **Green & Renewable Energy 6.04%** (β 0.86, D/(D+E) 53%, pre-tax Kd 6.02%); Oil/Gas E&P 6.25%; Oil/Gas Integrated 5.07%; Chemical (Basic) 6.22%; Chemical (Diversified) 5.23%; Total market 6.96%. Nominal USD, after-tax | [V] |
| IRENA *Renewable Power Generation Costs in 2024* (Jul 2025) | WACC assumptions for 2024 range from **3.8% (Europe) to 12% (Africa)**, set from prior-year (2023) macro data; country-specific (rating, risk premium, tax). Global utility PV LCOE $0.043/kWh, TIC $691/kW; onshore wind LCOE $0.034/kWh, TIC $1,041/kW; BESS $192/kWh (2024) | [V] |
| IEA *Reducing the Cost of Capital* (2024) and Cost of Capital Observatory (2025 update) | Utility PV cost of capital in advanced economies about **5–6.5%**. In EMDEs it is more than 2x that; 2024 medians: Indonesia 9.4%, Vietnam 9.0%, Philippines 8.0%. Values are nominal, post-tax, local currency | [S/V] |
| Lazard LCOE+ v18.0 (Jun 2025) | Base: **60% debt @ 8%, 40% equity @ 12%**, 40% combined tax. Cost-of-capital sensitivity axis runs after-tax WACC 4.2% / 5.4% / 6.5% / **7.7% (base)** / 8.8% / 10.0% (Ke 6–16%, Kd 5–10%). LCOS/storage uses 20% debt @ 8% and 80% equity @ 12% | [V] |
| NREL ATB 2024 | R&D-only case: **nominal after-tax WACC 6.01%–8.21%** for RE technologies, 8.0% for natural gas. Inflation assumption 2.5% for real/nominal conversion | [S] |
| KPMG Cost of Capital Study 2025 (DACH) | Average WACC 8.5% (range 5.2–10.4%). Energy & Natural Resources lowest at **6.3%**; Industrial Manufacturing 9.4%; Chemicals & Pharma levered β 0.93 | [S] |
| Tabreed (district cooling) Q1-2025 call | Target project IRR **10–12%** (high single to low double digits, above WACC) | [S] |
| Upstream O&G | SEC PV-10 standard uses a 10% discount rate for reserves reporting. Majors' project hurdle is about **15% IRR**: BP cites a 15% hurdle, with next-wave projects above 20%. Higher-risk jurisdictions use 20–25% | [S] |
| SAIBOR 3M | 4.75% (May 2026); 4.84% (Feb 2026) | [S] |

### 1.2 Implied GCC IPP WACC (reverse-engineered from tariffs)

- **SPPC NREP Round 6** (awarded 29 Oct 2025) [V/S]:
  - Najran PV, 1,400 MW (Masdar): **1.097 USc/kWh**, the world's second-lowest.
  - Ad Darb PV, 600 MW: 1.361 USc/kWh.
  - Samtah PV, 600 MW: 1.487 USc/kWh.
  - As Sufun PV, 400 MW: 1.507 USc/kWh.
  - Dawadmi Wind, 1,500 MW: **1.338 USc/kWh**, a claimed record-low wind LCOE.
  - Shuaiba 1 PV holds the record at 3.9 halalas (about 1.04 USc/kWh).
- **EWEC (Abu Dhabi)** [S]:
  - Al Ajban 1.5 GW: 5.1921 fils/kWh (about 1.41 USc/kWh).
  - Khazna 1.5 GW: 5.35502 fils/kWh (about 1.46 USc/kWh).
- **Sudair 1.5 GW (ACWA/Badeel/SAPCO, FC 2021)** [S]: SAR 3.4 bn (~$905 M, ≈ $0.60/W). 25-year PPA with SPPC. Limited-recourse **28-year soft mini-perm** debt, conventional plus Islamic tranches.
- **Implied WACC.** With capex around $0.45–0.55/W, yields above 2,000 kWh/kWp (single-axis tracking, bifacial) and O&M around $6–8/kW/yr, tariffs of 1.1–1.5 USc are only achievable at **~4.5–6.0% nominal USD project WACC** [E]. That implies about 2–3.5% real at 2–2.5% inflation. The build-up behind it:
  - Leverage 75–85% with long tenors.
  - Kd ≈ SOFR/SAIBOR-swap + 80–150 bp, giving about 5.5–6.5% all-in pre-tax.
  - Equity IRR 7–9% for sovereign-backed offtake; low-single-digit returns have been reported for the most aggressive bids.
  - Low tax (zakat 2.5% on the Saudi share).

### 1.3 Recommended calculator discount-rate table (USD)

Real ≈ (1+nominal)/(1+inflation) − 1, with inflation 2.0–2.5%.

| Asset class | Project WACC nominal (low / base / high) | Real (base) | Typical corporate hurdle | Rationale |
|---|---|---|---|---|
| Utility PV, GCC contracted IPP (SPPC/EWEC 25–30 yr PPA) | 4.5 / **5.5** / 6.5% | ~3.0% | Sponsor equity IRR 7–10% | Aa-rated sovereign offtake, CRP only 0.6–0.8%, 75–85% debt, 25–28 yr tenors |
| Utility PV, global (OECD, contracted) | 5.0 / **6.5** / 8.0% | ~4.0% | 8–10% | IEA 5–6.5% advanced economies; Lazard 7.7%; NREL 6–8% |
| Utility PV, EMDE | 8 / **10** / 12%+ | ~7.5% | 12–15% | IEA observatory; IRENA up to 12% (Africa) |
| Onshore wind, GCC IPP | 5.0 / **6.0** / 7.0% | ~3.5% | 8–10% | Slightly above PV (resource/tech risk); Dawadmi 1.34 USc |
| Onshore wind, global | 5.5 / **7.0** / 8.5% | ~4.5% | 9–11% | Lazard 7.7%, NREL, Damodaran G&RE 6.0% |
| C&I solar, factory-owned (self-consumption) | 6.5 / **8.0** / 10% | ~5.5% | 10–12% | Uses the host's corporate WACC. Offtake risk = own credit. Behind-the-meter savings are less bankable than a sovereign PPA |
| Industrial energy-efficiency retrofit (VFD, compressed air, WHR) | 8 / **10** / 12% | ~7.5% | **12–15%**, or a simple-payback rule of < 2–3 yrs | Companies apply high internal hurdles to EE capex (capital rationing; savings seen as uncertain). Many firms screen by payback, not NPV |
| Petrochemical / industrial capacity (KSA/UAE) | 8 / **9.5** / 11% | ~7.0% | 12–15% | Damodaran chemicals 5.2–6.2% (US) + GCC CRP + commodity-cycle risk; KPMG manufacturing 9.4% |
| Oil & gas upstream | 9 / **10** / 12% | ~7.5% | **15%** (20–25% frontier) | PV-10 convention; BP 15% hurdle; E&P WACC 6.3% (Damodaran) but hurdles much higher |
| Desalination IWP (GCC, sovereign offtake) | 5.0 / **6.0** / 7.0% | ~3.5% | 8–10% equity | Same structure as IPPs (EWEC/SWPC 25–30 yr WPA; e.g. Taweelah, Hassyan) |
| District cooling (concession) | 7 / **8** / 9% | ~5.5% | **10–12% IRR** (Tabreed) | Utility-like, long concessions, but counterparty/demand ramp risk |

**Key reasoning to show in the UI tooltip:**
- **Project WACC ≠ corporate hurdle.** Project WACC is the market-derived opportunity cost of capital for that specific risk. Hurdle rate = WACC + margin, typically 2–5 pp, for estimation error, optimism bias, capital rationing and strategic premium.
- **Cost of equity in USD:** Ke = Rf + β × mature ERP + CRP. For KSA, Rf ≈ 4.2% (UST 10y), mature ERP 4.23%, CRP 0.78% (Damodaran Jan 2026).
- **WACC formula:** WACC = E/V·Ke + D/V·Kd·(1−t). IPPs run at 70–85% debt, so WACC is close to after-tax Kd.
- **Tax shield:** in KSA, CIT is 20% on the foreign-owned share and zakat 2.5% of the zakat base on the Saudi/GCC share. In the UAE, CT is 9% above AED 375k.

---

## 2. Preset projects: default cash-flow inputs

### 2.0 Year-by-year structure conventions (all presets)

- **Year 0** holds capex, as a single lump at t = 0. Optional: split construction across Y-1/Y0 (e.g. 60/40) for projects over 12 months.
- **Year 1..N** operations, with these items:
  - **Ramp-up:** Y1 output at 85–95% for industrial projects; PV is at 100% from Y1.
  - **Escalation:** apply each item's own rate, i.e. price/tariff (g_p), opex (g_om), degradation (d).
  - **Lumpy replacements:** inverter, overhaul, membranes, battery augmentation.
  - **Tax:** (Revenue/savings − opex − depreciation) × t. Allow negative tax (a loss credit) as the default for corporate-owned assets whose losses offset group profits. Add a toggle for "no credit / carry forward".
  - **Working capital:** negligible for savings projects. For capacity projects, use about 10–15% of incremental revenue, invested in Y0/Y1 and recovered in the final year.
- **Terminal year:** salvage value (default 0 for PV and EE). Decommissioning cost ≈ salvage for PV, so net 0 is the industry convention (Lazard uses the same logic for fossil plants).
- **Nominal vs real:** the default is nominal cash flows with escalation, discounted at a nominal WACC. The app should warn when real rates are mixed with escalated flows.

### 2.1 Preset A: 10 MWp C&I solar PV for a factory in Saudi Arabia (self-owned, behind-the-meter)

| Input | Default | Tornado low / high | Source / note |
|---|---|---|---|
| Size | 10 MWp DC (mix of ground-mount and rooftop) | – | Mid-size, C&I. Real example: ENGIE 22 MW for Al Jouf Cement (Nov 2024), rooftop + ground. It is a 25-yr PPA saving SAR 3.6 M/yr and covers about 25% of site load |
| Capex | **$0.60/Wp → $6.0 M** | $0.45 / $0.85 | [E] triangulated. (a) KSA utility-scale ≈ $0.55/W: Round 7 $8.3 bn / 15 GW, 2025. (b) Sudair ≈ $0.60/W (2021). (c) ME large-scale EPC $0.45–0.65/W [S]. (d) C&I adds a 10–40% premium for smaller scale, rooftop structure and grid-interface works. For comparison only, US C&I is $1.60–3.30/W (Lazard 2025) and $1.78/W (NREL ATB 2024) |
| Specific yield (Y1) | **1,800 kWh/kWp/yr** (fixed tilt, after soiling) | 1,650 / 2,000 | Global Solar Atlas KSA average PVOUT ≈ 1,899 kWh/kWp [S]. Net 3–7% for soiling/availability. Single-axis tracking adds about 15–25% |
| Degradation | **0.5%/yr** | 0.3 / 0.8 | NREL (Jordan & Kurtz): median 0.5%/yr, mean 0.8–0.9%. Hot desert climates trend higher [V/S] |
| O&M | **$12/kW-yr** (≈ 2% of capex), escalating 2.5%/yr | $8 / $18 | Lazard C&I US $13–20/kW-yr; NREL commercial ≈ $21/kWdc-yr (US). GCC labour is cheaper, but module cleaning is intensive [E] |
| Inverter replacement | **Year 12, $0.035/Wp → $350k** | Y10 / Y15; $0.03–0.06/W | Inverter life 10–15 yr; central inverter ≈ $0.03–0.06/W [S] |
| Avoided tariff | **SAR 0.20/kWh = $0.0533/kWh** | SAR 0.18 / 0.30 | KSA industrial rate is 18 halalas/kWh (2018 reform). From 27–28 May 2025, **non-eligible** industrial, commercial and agricultural customers pay **+2 halalas** (the SERA intensive-consumption tariff split) [S]. Commercial is 20 (≤6,000 kWh/mo) / 30 halalas [S]. GlobalPetrolPrices lists the KSA business average at SAR 0.277/kWh (Dec 2025). **UAE alternatives:** Abu Dhabi industrial 15 fils/kWh flat (TOU for loads above 1 MW: peak 36.6 / off-peak 27.0 fils). DEWA industrial 23 / 38 fils plus a 6-fils fuel surcharge [S] |
| Tariff escalation | **1.0%/yr** | 0% / 3% | KSA tariffs have been largely frozen since 2018 apart from the 2025 adjustment. Treat as a policy scenario |
| Life | **25 yrs** | 20 / 30 | Lazard C&I life 30 yrs; conservative 25 for rooftop leases |
| Discount rate | **8.0% nominal** | 6% / 10% | Host corporate WACC (Section 1.3) |
| Tax | **20%** (foreign-owned KSA); UAE option 9%; Saudi-owned: zakat 2.5% | 0% / 20% | PwC Tax Summaries. Default depreciation: straight-line over 20 yrs. KSA tax rules use declining-balance asset groups (plant/machinery commonly quoted at 25%), which can be offered as an option. **Verify before relying on it** |
| Salvage / decommissioning | 0 (they net off) | – | Convention |

**Sanity check** (computed this session, end-of-year discounting, 25 yrs):
- Y1 energy 18.0 GWh; Y1 savings about $0.96 M.
- After-tax: **NPV at 8% ≈ +$1.7 M, IRR ≈ 11.2%**, simple payback ≈ 8.1 yrs, discounted payback ≈ 14 yrs.
- Pre-tax: NPV ≈ +$2.9 M, IRR ≈ 13.4%, payback ≈ 7.1 yrs.
- The low KSA tariff is the binding constraint. At SAR 0.30/kWh the project becomes strongly positive, so tariff and capex will top the tornado.

### 2.2 Preset B: Plant efficiency upgrade, 5 MWe waste-heat-to-power (steam Rankine/ORC) at a cement or petrochemical plant

| Input | Default | Tornado low / high | Source / note |
|---|---|---|---|
| Net capacity | 5 MWe | – | Typical of cement kiln/clinker cooler WHR |
| Capex | **$2,000/kW → $10.0 M** (installed, incl. integration) | $1,500 / $3,000/kW | ORC $1,200–3,000/kW by size [S]. Industrial 1–10 MWe ORC $1.8–3.2 M/MWe (2024–25) [S]. Indian cement WHR is about Rs 70–100 M/MW, **≈ $0.85–1.2 M/MW** at around 83 INR/USD. That is low-cost Indian EPC; one search summary mis-converted it as $12 M/MW and was checked. Waste-heat recovery boilers alone cost $300–900/kWth |
| Operating hours × load | 8,000 h × 90% → **36 GWh/yr** | 7,000 h / 8,400 h | Kiln/process availability limits WHR output |
| Ramp-up | Y1 = 85% of steady state | 70% / 100% | Commissioning and tuning |
| Value of power | **$0.0533/kWh** (avoided KSA industrial tariff), +1%/yr | $0.048 / $0.080 | Same as Preset A. If the plant self-generates on gas, value it at the displaced fuel instead: heat rate × gas price (KSA regulated gas about $2.1–3.5/MMBtu; verify) |
| O&M | **3% of capex/yr** ($300k), +2.5%/yr | 2% / 4% | [E] typical steam/ORC WHR |
| Major overhaul | **Year 10, 8% of capex** | 5% / 12% | Turbine/boiler overhaul [E] |
| Life | **20 yrs** | 15 / 25 | |
| Discount rate | **10% nominal** (industrial EE hurdle) | 8% / 12% | Section 1.3 |
| Tax | 20%, straight-line depreciation over 20 yrs | | |

**Sanity check:**
- At $10 M: **NPV at 10% ≈ +$1.9 M, IRR ≈ 12.6%**, payback ≈ 7.2 yrs, discounted payback ≈ 13.7 yrs.
- At $12 M ($2,400/kW): NPV ≈ −$0.5 M, IRR ≈ 9.4%.
- Breakeven sits right in the input range, which makes a good tornado and breakeven demo. Paybacks are much longer than the "14 months to 3–6 yrs" in India/US literature because KSA power is cheap.

**Alternative Preset B′: compressed-air + VFD retrofit** (smaller and faster; use it if the app wants a "quick win" example):
- Capex $0.4–0.6 M for a 2–3 MW compressor house.
- Savings 20–35% of compressor energy (DOE/Compressed Air Challenge Sourcebook: 20–50% system savings).
- Example: 2.5 MW × 7,000 h × 25% = 4.4 GWh/yr → $0.23 M/yr at $0.0533.
- Maintenance 2% of capex/yr; life 12–15 yrs.
- Payback ≈ 2–3 yrs (DOE data for 100 hp+ compressors running 4,000+ h/yr: 2–3.5 yrs) [S].

### 2.3 Optional Preset C: SWRO energy-recovery-device (isobaric pressure exchanger) retrofit, 20,000 m³/d desalination plant

| Input | Default | Range | Note |
|---|---|---|---|
| Capex | **$1.0 M** (ERD + booster pump + integration) | $0.7 / 1.5 M | ERDs are under 2% of total plant capex for plants over 50,000 m³/d [S] |
| Energy saving | **0.8 kWh/m³** (replacing Francis/Pelton or no ERD) | 0.4 / 1.2 | Retrofits cut SEC 25–60%; brackish example 1.03 → 0.77 kWh/m³ [S] |
| Output | 20,000 m³/d × 92% availability | | |
| Power value | $0.0533/kWh, +1%/yr | | |
| O&M | 2% of capex/yr | | |
| Life | 15 yrs | 10 / 20 | |
| Discount rate | 9% | | |

**Sanity check:** NPV at 9% ≈ +$0.95 M, IRR ≈ 23%, payback ≈ 4.2 yrs. This matches vendor claims of ROI in under 5 yrs.

**BESS alternative (Preset C′):**
- Turnkey price 2025: **$117/kWh global average**; 4-h systems $110/kWh; China $73, EU $177, US $219/kWh (BNEF Dec 2025).
- IRENA 2024 installed cost: $192/kWh.
- For GCC, assume **$150–200/kWh installed** [E]. Round-trip efficiency 85–88%, 1 cycle/day, degradation about 2%/yr, augmentation in Y8–10.
- Revenue = TOU arbitrage. Abu Dhabi industrial TOU spread: 36.6 − 27.0 = 9.6 fils/kWh in summer only. **This is usually uneconomic on arbitrage alone**, so the preset is useful to show a negative NPV.

---

## 3. Tornado chart conventions (consulting / banking / FP&A)

**Construction (deterministic one-at-a-time sensitivity):**
- Vary one input between its low and high values and hold all others at base.
- Bars are horizontal, **sorted by total swing (|high − low|), largest at the top**. That ordering produces the "tornado" silhouette (Wikipedia, citing PMBOK Guide 5th ed. p.338).
- A vertical line marks the **base-case output**, e.g. "Base NPV $1.7 M". Bars extend left and right from that line, so the axis shows either absolute NPV or Δ from base. Crystal Ball offers both, as "Absolute values" (default) or "Differences from base case".
- **Two colours, one for low-input and one for high-input:**
  - Crystal Ball labels them "Downside" and "Upside" and lets you rename the legend.
  - @RISK 7.5+ adds shading to show whether the input was high or low when the output moved.
  - Common bank/consulting convention: dark = low-input value, light = high-input value. Equivalently, red = unfavourable outcome and green = favourable; state which in the legend.
  - Do not assume the "low" input gives the lower output. Capex low → NPV high. Colour by the input level, not by direction.
- **Value labels:** output value at each bar end (e.g. "$0.4 M" / "$3.1 M"). The input range annotation goes in the axis label, e.g. **"WACC 6% – 10%"**, "Capex $0.45–0.85/Wp", "Tariff SAR 0.18–0.30/kWh".
- **Range definition, stated in a footnote:**
  - (a) **±X% of base**, e.g. ±10% or ±20%. Simple, but it treats all inputs as equally uncertain, which is misleading.
  - (b) **P10/P90** (10th/90th percentile of each input's distribution). This is Crystal Ball's default tornado test range (10%–90%) and a common decision-analysis/SPE convention.
  - (c) **Explicit engineering low/high** from quotes, benchmarks or tender data. **Recommended default for this app**, with a toggle to ±% mode.
- **Typical variables:** capex, WACC/discount rate, tariff or price, volume/yield/capacity factor/operating hours, opex/O&M, price escalation, lifespan, degradation, tax rate, ramp-up, and major replacement cost and timing. Usually show 6–10 bars; beyond about 10 the tail is "not material".
- **Breakeven reporting:** for each variable, report the value at which NPV = 0 (or IRR = hurdle), where it falls inside the plausible range. Examples: "Breakeven tariff SAR 0.16/kWh (−20% vs base)"; "Breakeven capex $0.78/Wp (+30%)". Show this as a table next to the tornado, or as a marker/tick on each bar where it crosses the NPV = 0 line, plus a vertical NPV = 0 reference line if 0 is inside the axis.
- **Probabilistic tornadoes (Monte Carlo):** @RISK offers four sensitivity measures:
  1. Change in output statistic: sort iterations by input, split them into equal-probability bins (e.g. 10) and measure the swing of the output mean across bins.
  2. Regression coefficients: standardized, −1 to 1; results are unstable if R² < 0.5.
  3. Spearman rank correlation.
  4. Contribution to variance.

  Spider graphs are only available for the change-in-output-statistic method. AACE RP 41R-08 (range estimating, retitled "Understanding Estimate Ranging" in 2021) uses tornado ranking to find the few critical items and to allocate contingency.

**Spider chart vs tornado:**
- The spider chart plots output (y) against % change in each input (x), with one line per variable through the base point.
- Slope equals sensitivity (Crystal Ball shows an **elasticity** statistic, the % output change per % input change) and reveals **nonlinearity** and asymmetric ranges.
- The tornado shows the magnitude ranking only.
- Use a tornado for the headline exhibit and a spider chart for the analyst appendix.

**Exhibit styling (McKinsey/BCG/bank style):**
- **Action title** is a full-sentence "so what", not a label. Example: "Tariff and capex drive ~70% of NPV risk; project stays NPV-positive unless tariff falls below SAR 0.16/kWh". A subtitle carries units: "NPV at 8% WACC, $M; base case $1.7 M".
- **Source line** bottom-left, e.g. "Source: SERA tariff (2025); Damodaran (Jan 2026); team analysis". **Footnotes** use 7–8 pt numbered notes stating the range method (P10/P90 vs ±20%), the one-at-a-time assumption, nominal vs real, and the discounting convention.
- Keep it muted: grey base line, two restrained colours, no 3D, no gridline clutter, labels directly on bars rather than a legend where possible. The exhibit number goes top-left ("Exhibit 3").

---

## 4. Formulas and conventions

Let CF_t be the net cash flow in year t (t = 0…N), r the discount rate, and C_0 the initial investment.

| Metric | Formula | Notes |
|---|---|---|
| **NPV** | NPV = Σ_{t=0..N} CF_t / (1+r)^t | Accept if > 0. Additive; the primary decision rule |
| **IRR** | r* such that Σ CF_t/(1+r*)^t = 0 | Solve by Newton/bisection with a bracket of −99%…+100%. **Multiple IRRs** occur when the cash-flow sign changes more than once (Descartes' rule), e.g. a big mid-life overhaul or decommissioning cost. **No IRR** occurs if NPV never crosses 0. Mutually exclusive projects of different scale can rank differently on IRR vs NPV. The app should count sign changes and warn, or fall back to MIRR |
| **MIRR** | MIRR = [FV(positive CFs at reinvestment rate r_re) / PV(negative CFs at finance rate r_f)]^{1/N} − 1 | Default r_re = r_f = WACC. Unique; fixes the reinvestment-at-IRR assumption |
| **Simple payback** | Smallest T with Σ_{t=1..T} CF_t ≥ C_0; interpolate: T = (k−1) + (remaining unrecovered)/CF_k | Ignores time value and post-payback flows; widely used as the EE screen (< 2–3 yrs) |
| **Discounted payback** | Same as simple payback, on discounted CF_t/(1+r)^t | Report "not reached" if it never recovers within N |
| **Profitability index** | PI = PV(CF_{1..N}) / |CF_0| = 1 + NPV/|CF_0| | Use for capital rationing; accept if > 1 |
| **LCOE** | LCOE = [C_0 + Σ (O&M_t + Fuel_t + Repl_t)/(1+r)^t] / Σ E_t/(1+r)^t | Discount energy too. E_t = E_1·(1−d)^{t−1}. Alternative: CRF form, LCOE = (C_0·CRF + O&M)/E with CRF = r(1+r)^N / ((1+r)^N − 1). Lazard solves for the $/MWh giving levered equity IRR = Ke (after-tax, 30-yr, MACRS) |
| **Annualized cost / EAC** | EAC = NPV × CRF | Compares assets of unequal life |
| **Real ↔ nominal (Fisher)** | (1+r_nom) = (1+r_real)(1+i) | Use consistent flows. ATB uses i = 2.5% |
| **WACC** | E/V·Ke + D/V·Kd·(1−t); Ke = Rf + β·ERP + CRP | Section 1 |

**Timing conventions:**
- **End-of-year (default):** CF_t discounted by (1+r)^t. Excel `NPV()` assumes the first value is at t = 1, so use `=CF0 + NPV(r, CF1:CFN)`.
- **Mid-year convention:** discount operating flows by (1+r)^(t−0.5) to approximate cash arriving evenly through the year. It raises NPV by roughly a factor of (1+r)^0.5 on operating flows. It is common in valuation/banking DCFs; engineering-economy textbooks and LCOE tools (NREL/Lazard) use end-of-year. Offer it as a toggle and footnote it.
- **Beginning-of-year:** used for capex and lease payments paid in advance.
- **Year 0 capex** is undiscounted. Construction spread across Y−1/Y0 can be compounded forward at WACC (IDC-like) or discounted consistently from a single valuation date.

---

## 5. Sources

| # | Source | Year | URL |
|---|---|---|---|
| 1 | Damodaran, Country Default Spreads and Risk Premiums | Jan 2026 | https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html |
| 2 | Damodaran, Cost of Capital by Sector (US) | Jan 2026 | https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/wacc.html |
| 3 | IRENA, Renewable Power Generation Costs in 2024 (summary) | Jul 2025 | https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf |
| 4 | IEA, Reducing the Cost of Capital; Cost of Capital Observatory | 2024 / 2025 | https://www.iea.org/reports/reducing-the-cost-of-capital ; https://www.iea.org/reports/cost-of-capital-observatory |
| 5 | IEA commentary: cost of capital survey (solar vs gas in EMDEs) | 2023 | https://www.iea.org/commentaries/cost-of-capital-survey-shows-investments-in-solar-pv-can-be-less-risky-than-gas-power-in-emerging-and-developing-economies-though-values-remain-high |
| 6 | pv magazine: IEA says cost of capital for solar remains high in SE Asia | Oct 2025 | https://www.pv-magazine.com/2025/10/09/iea-says-cost-of-capital-for-solar-remains-high-in-southeast-asia/ |
| 7 | Lazard, LCOE+ (LCOE v18.0, LCOS v10.0) | Jun 2025 | https://www.lazard.com/media/uounhon4/lazards-lcoeplus-june-2025.pdf |
| 8 | NREL ATB 2024: Financial Cases & Methods; Commercial PV | 2024 | https://atb.nrel.gov/electricity/2024/financial_cases_&_methods ; https://atb.nrel.gov/electricity/2024/commercial_pv |
| 9 | KPMG Cost of Capital Study 2025 (DACH) | 2025 | https://assets.kpmg.com/content/dam/kpmgsites/ch/pdf/cost-of-capital-study-2025.pdf |
| 10 | TaiyangNews: Saudi Arabia concludes NREP Round 6 (4.5 GW) | Oct 2025 | https://taiyangnews.info/markets/saudi-arabia-concludes-nrep-round-6 |
| 11 | MEED: EWEC signs Ajban solar PV contract; Khazna award | 2024 | https://guest.meed.com/ewec-signs-ajban-solar-pv-contract/ ; https://www.meed.com/abu-dhabi-to-award-khazna-solar-ipp-contract |
| 12 | Mercom / Zawya: ACWA Power Sudair financial close | Aug 2021 | https://www.mercomindia.com/acwa-power-financial-close-solar |
| 13 | SaudiGulf Projects: Saudi Arabia awards $8.3 bn, 15,000 MW solar & wind | Jul 2025 | https://www.saudigulfprojects.com/2025/07/saudi-arabia-awards-8-3-billion-worth-15000-mw-solar-and-wind-energy-projects/ |
| 14 | SERA, Electricity Tariff (official; site unreachable from this session, figures via secondary sources) | 2025 | https://www.sera.gov.sa/en/systems-and-regulations/electric-tariff |
| 15 | GlobalPetrolPrices: Saudi Arabia electricity prices | Dec 2025 | https://www.globalpetrolprices.com/Saudi-Arabia/electricity_prices/ |
| 16 | UAE Utility Bill Calculator: Business electricity tariffs UAE (ADDC/DEWA) | 2025–26 | https://utilitybilluae.com/business-electricity-tariffs-uae/ |
| 17 | PwC Tax Summaries: Saudi Arabia corporate taxes | 2025 | https://taxsummaries.pwc.com/saudi-arabia/corporate/taxes-on-corporate-income |
| 18 | Mercom: ENGIE 22 MW solar for Saudi cement factory (Al Jouf) | Nov 2024 | https://www.mercomindia.com/engie-to-build-22-mw-solar-project-for-saudi-cement-factory |
| 19 | Global Solar Atlas / ENERGYDATA.INFO PVOUT dataset | ongoing | https://energydata.info/dataset/world-photovoltaic-power-potential-pvout-gis-data-global-solar-atlas |
| 20 | Jordan & Kurtz, Photovoltaic Degradation Rates: An Analytical Review (NREL) | 2013 | https://docs.nrel.gov/docs/fy13osti/56485.pdf |
| 21 | Energy-Storage.News: BNEF and Ember battery storage system prices | Dec 2025 | https://www.energy-storage.news/battery-storage-system-prices-continue-to-fall-sharply-bnef-and-ember-reports-find/ |
| 22 | DOE/NREL, Improving Compressed Air System Performance: A Sourcebook for Industry | 2003 (rev.) | https://www1.eere.energy.gov/manufacturing/tech_assistance/pdfs/compressed_air_sourcebook.pdf |
| 23 | DOE/BCS, Waste Heat Recovery: Technology and Opportunities in U.S. Industry | 2008 | https://www.osti.gov/biblio/1218716 |
| 24 | ORNL, Waste Heat to Power Market Assessment | 2015 | http://www.heatispower.org/wp-content/uploads/2015/02/ORNL-WHP-Mkt-Assessment-Report-March-2015.pdf |
| 25 | UltraTech Cement: Waste heat recovery (cost per MW) | – | https://www.ultratechcement.com/corporate/media/press-releases/waste-heat-recovery |
| 26 | Danfoss: SWRO retrofits; Energy Recovery Inc. brackish ERD paper | 2023–25 | https://www.danfoss.com/en/about-danfoss/articles/hpp/retrofits-the-key-to-improving-energy-and-cost-efficiency-for-swro-s-installed-base/ ; https://energyrecovery.com/wp-content/uploads/2023/11/BRACKISH-WATER-DESALINATION-ENERGY-AND-COST-CONSIDERATIONS.pdf |
| 27 | Tabreed Q1 2025 earnings call transcript | May 2025 | https://tabreed.ae/sites/default/files/2025-06/Tabreed_Q1%202025_Earnings%20Call%20Transcript.pdf |
| 28 | Wood Mackenzie: rising hurdles for upstream; bp 2025 CMD upstream slides | 2025 | https://www.woodmac.com/blogs/the-edge/the-rising-hurdles-for-investment-in-upstream/ ; https://www.bp.com/content/dam/bp/business-sites/en/global/corporate/pdfs/investors/bp-cmd-2025-oil-and-gas-presentation-slides.pdf |
| 29 | Stout: Limits of PV-10 in oil & gas reserve valuation | – | https://www.stout.com/en/insights/article/limits-pv10-oil-gas-reserve-valuation |
| 30 | Palisade/Lumivero @RISK help: Sensitivity Analysis; @RISK 7.5 tornado blog | 2016 / v8 | https://help-risk.lumivero.com/v8_1/en/@RISK/Analysis/Sensitivity-Analysis.htm ; https://blog.palisade.com/2016/07/29/new-and-improved-tornado-graphs-in-risk-7-5/ |
| 31 | Oracle Crystal Ball User's Guide: Tornado chart options; tornado/spider interpretation | – | https://docs.oracle.com/cd/E57185_01/CYBUG/cb_tornado_chartopts.htm ; https://docs.oracle.com/cd/E12825_01/epm.111/cb_user/ch09s05s04s02.html |
| 32 | AACE RP 41R-08, Risk Analysis and Contingency Determination Using Range Estimating | 2008 (retitled 2021) | https://wsdot.wa.gov/sites/default/files/2021-12/risk-analysis-contingency-RangeEstimating.pdf |
| 33 | Wikipedia: Tornado diagram (cites PMBOK 5th ed.) | – | https://en.wikipedia.org/wiki/Tornado_diagram |
| 34 | Deckary: Consulting slide standards (action titles, source lines) | 2025–26 | https://deckary.com/blog/consulting-slide-standards |
| 35 | SAIBOR (Trading Economics / CEIC) | 2026 | https://tradingeconomics.com/saudi-arabia/interbank-rate |

**Caveats:**
- The SERA and SEC official tariff pages could not be reached from this session. The industrial rate of 18 halalas plus the 2-halala non-eligible surcharge (May 2025) comes from secondary sources, and the commercial bracket values differ between sources (20/30 vs 22/32). Re-verify before publishing.
- The GCC C&I capex ($0.60/Wp) and the GCC IPP WACC (4.5–6%) are triangulated estimates, not published figures.
- KSA tax depreciation rates should be checked with ZATCA.
