# Research: Consulting Case Interviews for "Engineering Economics & Case Practice"

Compiled 2026-09-15. Sources are listed in Section 4. All 16 cases in Section 3 are original, written to resemble public casebook and firm formats. No casebook text was copied. All arithmetic was checked with a script; rounded figures are marked "~".

---

## 1. Framework Reference

### 1.0 What interviewers grade (across firms)

Firms describe the criteria differently, but the underlying rubric is consistent:

| Dimension | What "good" looks like | What loses points |
|---|---|---|
| **Structure** | A MECE issue tree tailored to *this* problem (no overlaps, no gaps, each branch split on one consistent dimension). The first split should test the real hypothesis. | Reciting a generic framework ("4Ps", "3Cs") without adapting it. Mixing dimensions in one layer (size on one branch, region on the next). |
| **Hypothesis-driven** | States an early, falsifiable hypothesis, then picks the analysis that confirms or kills it. Prioritizes the branch most likely to matter. | "Boiling the ocean": asking for all data on every branch. No stated view. |
| **Quantitative** | Sets up the equation before doing the math. Clean mental math, unit and order-of-magnitude sanity checks, then interprets the number. | Arithmetic slips, lost zeros, unit mixing (MW vs MWh, t vs kt). Leaving a number without saying what it means. |
| **Exhibit/data reading** | Picks out the one insight in a chart, notes caveats (e.g., mix effects, base years). | Describing the chart instead of drawing the implication. |
| **Creativity/brainstorm** | Ideas grouped into buckets (e.g., internal vs external, short vs long term), then prioritized. | An unstructured list of ideas. |
| **Synthesis / "so what"** | Answer first (Pyramid Principle): recommendation, 2-3 supporting reasons with numbers, risks, next steps. | Recapping the case chronologically. No clear decision. |
| **Communication & coachability** | Signposts ("I'll look at three things..."), checks in, and uses the interviewer's hints. | Going silent, ignoring nudges, getting defensive. |

Official firm pages (BCG, McKinsey) stress that there is often no single right answer; the quality of the reasoning is what gets graded. Crafting Cases and RoadToOffer list the concrete structure checks: non-overlapping labels, branches that sum to 100%, and a consistent dimension within each layer.

### 1.1 Interview style differences

| Format | Who drives | Typical firms | Implications for practice |
|---|---|---|---|
| **Interviewer-led** | The interviewer asks a fixed sequence of questions (structure, then exhibit, then math, then brainstorm, then synthesis). | McKinsey (official "Problem Solving Interview", always paired with the Personal Experience Interview). Bain increasingly. Monitor Deloitte individual cases. | Each question is scored separately. The candidate doesn't choose what to explore, so every mini-question must be answered crisply. Recovery between questions is possible. |
| **Candidate-led** | The candidate structures, chooses branches, requests data, and proposes next steps. | BCG (official prep page emphasizes structure, clarifying questions, and responsiveness to feedback), Deloitte S&O, Oliver Wyman, Kearney, Roland Berger, Strategy& (including Middle East offices). | Grades navigation: whether the candidate prioritizes and asks for the right data. An early wrong turn is costly unless the candidate course-corrects. |
| **Written case / presentation** | The candidate works alone on a data pack (Bain: about 20-30 slides, about 55 min prep; Oliver Wyman: about 30 min prep and 30 min presentation; BCG publishes a written-case example). | Bain (some offices, final round), BCG, Oliver Wyman, Roland Berger, Kearney MBA/experienced hires, Strategy& Middle East. | Tests triage (finding the signal in 20+ pages), building slides with action titles, and presenting under Q&A. |
| **Group case** | 4-6 candidates discuss while assessors observe (Deloitte: about 20 min group discussion then about 20 min of Q&A). | Deloitte, some Roland Berger and Kearney offices. | Grades collaboration, synthesis of others' points, and time-keeping. Dominating the discussion is penalized. |
| **Digital / chatbot screen** | McKinsey Solve (game-based; Redrock study, Sea Wolf, Sustainable Futures Lab). BCG Online Case "Casey" (about 8-10 sequential questions in 25-35 min, ending with a recorded 60-second recommendation). | McKinsey, BCG | Timed quantitative reasoning, chart reading, and a forced synthesis. |

**Engineering and technical consulting** (Roland Berger, Arthur D. Little, and project or engineering consultancies such as AECOM, Jacobs and WSP): cases lean toward operations, manufacturing, supply chain, capex and asset decisions. Expect more units-based math (MW vs MWh, capacity factors, efficiencies, cycle times, specific energy consumption) and go/no-go investment logic (NPV, IRR, LCOE/LCOW, payback). Candidates are also expected to raise technical constraints: feedstock limits, redundancy (N+1), diversity factors, degradation, and ramp-up.

### 1.2 Market sizing

**Structures to draw**
- **Top-down / demand-side (population):** Population → relevant segment (age, income, geography) → penetration or adoption rate → usage frequency → price. Market = Units × Price.
- **Household-based:** Households (population ÷ household size) → ownership rate → replacement cycle (units/yr = installed base ÷ lifetime) → price.
- **Bottom-up / supply-side:** Number of outlets (or machines, plants) × capacity per outlet × utilization × price. Use it as a sanity check on the demand-side estimate.
- **Installed-base / replacement:** Stock ÷ life = annual flow. Useful for durables, tyres, membranes, and batteries.

**Pitfalls:** No segmentation (treating 7 M residents as all buyers). Confusing stock with flow. Mixing annual with daily units. Never triangulating. Spurious precision (use round numbers and state assumptions aloud).

**Graded on:** Clear assumptions, logical segmentation, clean math, and a sanity check (e.g., "that's about USD 1.3 bn, roughly one-third of a national market, which is plausible for the capital").

### 1.3 Profitability tree

```
Profit = Revenue − Cost
├─ Revenue = Σ segments (Price × Quantity)
│   ├─ Price: list price, discounts, mix (product/customer/channel)
│   └─ Quantity: market size × market share (split by segment/channel)
└─ Cost
    ├─ Variable cost = unit variable cost × Q (materials, energy, freight, commissions)
    └─ Fixed cost (rent, salaries, depreciation, SG&A)
```

**Process:** Quantify the gap first (how much and since when). Then isolate it: revenue or cost, then which segment, then price or volume. Next, benchmark against competitors to separate a company problem from a market problem. Finally, find the root cause and propose fixes ranked by impact.

**Pitfalls:** Jumping to cost-cutting before checking revenue. Ignoring mix effects. Treating a market-wide decline as a company-specific one. Not converting findings into per-unit metrics.

**Graded on:** Isolating the driver efficiently, per-unit thinking, and whether the recommended levers are actually sized.

### 1.4 Breakeven

- Contribution margin (CM) per unit = Price − Variable cost.
- **Breakeven volume = Fixed costs ÷ CM**. Breakeven revenue = Fixed costs ÷ CM%.
- For an investment: payback = Upfront capex ÷ annual operating cash flow.
- Convert to capacity terms: breakeven utilization = breakeven volume ÷ available capacity. This is the "so what": is that utilization realistic compared with benchmarks?

**Pitfalls:** Counting depreciation as cash in payback. Forgetting capacity constraints. Ignoring ramp-up and seasonality.

### 1.5 Market entry

```
Should client enter market X?
├─ Market attractiveness: size, growth, profitability, regulation (e.g., licensing, local content)
├─ Competition: players, shares, likely reaction, barriers to entry
├─ Client capability/fit: right to win, synergies with existing assets
├─ Economics: unit economics → breakeven → NPV of entry
└─ Entry mode: build / buy / partner (JV) / license; phasing & risks
```

**Pitfalls:** Sizing the market but never checking whether the client can win a share of it. Ignoring incumbent reaction. Forgetting entry mode (in the GCC, JVs with local or government-linked entities are common).

### 1.6 M&A / acquisition

```
Should A acquire B at price P?
├─ Strategic rationale: why buy vs. build? (growth, capability, market access)
├─ Target standalone: market, position, financials → standalone value (DCF or multiples)
├─ Synergies: cost (procurement, SG&A, footprint) + revenue (cross-sell, distribution) − integration cost; probability-weight revenue synergies
├─ Price & financing: max price = standalone + NPV(synergies); premium vs. synergy value
└─ Risks: integration, culture, regulatory/antitrust, key-person
```

**Pitfalls:** Paying away more than 100% of synergies to the seller. Treating revenue synergies as certain. Forgetting integration costs. Ignoring alternatives (organic build, minority stake, JV).

### 1.7 Go/no-go investment (NPV / IRR / payback)

- NPV = Σ CF_t / (1+r)^t − Capex. Accept if NPV > 0 at the hurdle rate (WACC).
- IRR: the discount rate at which NPV = 0. Compare it with the hurdle rate.
- Simple payback = Capex ÷ annual cash flow. It ignores the time value of money but is common for screening.
- Annuity factor AF(r,n) = (1 − (1+r)^−n)/r. Capital recovery factor CRF = 1/AF.
- **Levelized cost** (LCOE / LCOW) = (Capex × CRF + annual Opex) ÷ annual output.
- Always run sensitivities on the 2-3 biggest drivers (price, capex, utilization or capacity factor) and state "what must be true".

**Pitfalls:** Mixing nominal and real rates. Ignoring ramp-up, degradation or terminal value. Double-counting depreciation. Using nameplate capacity instead of available capacity.

### 1.8 Pricing

Use three lenses and triangulate:
1. **Cost-based:** the floor (variable cost plus required margin).
2. **Competitor-based:** reference prices and the competitive response.
3. **Value-based:** the customer's willingness to pay, or the economic value delivered (the ceiling).

Then address price elasticity, segmentation or tiering, and the competitive reaction (game theory in commodities).
- Required volume to offset a price cut: new Q = old contribution ÷ new CM per unit.

**Pitfalls:** Maximizing revenue rather than profit. Ignoring competitor reaction and cannibalization. Forgetting that commodity markets are price-transparent.

### 1.9 Operations / capacity

```
Throughput problem
├─ Demand: required throughput (units/time), peaks vs. averages
├─ Capacity: design capacity × availability × utilization (OEE = availability × performance × quality)
├─ Bottleneck: slowest step limits system (Theory of Constraints); cycle time, batch size
├─ Levers: add capacity, debottleneck, shift demand, improve efficiency, buffer/redundancy
└─ Economics: cost of lever vs. value of incremental throughput
```

**Pitfalls:** Sizing to average rather than peak demand. Assuming debottlenecking one step raises system output when another constraint (such as feedstock or upstream capacity) binds next. Forgetting spares and redundancy.

---

## 2. Difficulty Calibration: Entry vs Advanced

### 2.1 What the public sources say
- **PrepLounge expert threads (UG/intern vs MBA):** Coaches say that structuring, math and logic are held to almost the same standard at every level. The difference is in business judgment, the ability to "connect the dots" across the case, story crafting, and polish. Interns get some benefit of the doubt on judgment and communication polish, but not on fundamentals.
- **Hacking the Case Interview (MBA guide):** MBA cases are not inherently harder in content, but expectations are higher. Candidates should be hypothesis-driven from the first minute, and the basics are only table stakes; differentiation comes from insight. Some firms give undergraduates shorter "mini-cases".
- **Management Consulted / MyConsultingOffer:** Market sizing is often asked early in the process and of undergraduates, while in later rounds it becomes one component of a longer multi-step case.
- **Kellogg casebook:** Cases are organized in difficulty tiers (easy, intermediate, difficult) as a progression, and interviewer-led cases are flagged. The 2020 edition removed subjective ratings in favor of evidence-based ones.
- **Darden casebook:** Every case carries a three-part difficulty rating (e.g., quantitative vs. qualitative difficulty) and most cases are interviewee-led, which shows firms and clubs calibrate along several dimensions rather than one.
- **Written cases (Bain, BCG, Oliver Wyman):** Used mostly in final rounds or for MBA and experienced hires. They add data triage (20+ pages) and slide synthesis, a clear marker of advanced-level assessment.

### 2.2 Operational rubric for the app

| Dimension | **Entry-level** (undergrad / analyst / BA) | **Advanced** (MBA / associate / experienced hire) |
|---|---|---|
| Scope | Single issue (one question: size it, find the profit driver, compute breakeven) | Multi-stage (size, then unit economics, then competition, then decision), 3+ linked questions |
| Data | Clean, round numbers, all relevant data offered on request, few distractors | Messy exhibits, irrelevant data mixed in, missing data requiring assumptions, conflicting sources |
| Guidance | Interviewer nudges toward the right branch; frameworks map closely onto the problem | Candidate must find the real issue; the obvious framework produces a trap answer |
| Math | 1-3 steps, mostly multiplication and division, a single formula (breakeven, payback) | Chained calculations, discounting (AF/CRF), scenarios, solving for "what must be true" |
| Second-order effects | Rarely needed | Required: competitor reaction, cannibalization, binding constraints (feedstock, capacity), ramp-up, customer behavior shifts |
| Judgment | Answer follows mechanically from the math | Math gives a number, but the recommendation needs judgment on risk, phasing and alternatives |
| Brainstorm | A simple list in 2-3 buckets | Creative, prioritized ideas with rough sizing |
| Synthesis | Restate the answer with 1-2 supporting facts | Partner-grade: decision, quantified rationale, key risks, conditions ("go if..."), next steps |
| Ambiguity | Objective stated clearly | Objective must be clarified (profit vs. share vs. strategic), or trade-offs between objectives |

**App design tip:** Tag each case with its difficulty *drivers* (e.g., `multi-stage`, `trap`, `second-order`, `messy-data`, `discounting`) rather than a single level. That lets users practice one dimension at a time, the way the Darden casebook's multi-part ratings do.

---

## 3. Case Bank (16 original cases)

Summary index:

| id | Title | Track | Difficulty | Setting | Type |
|---|---|---|---|---|---|
| S1 | Riyadh Specialty Coffee | strategy | entry | Riyadh, KSA | Market sizing |
| S2 | Bakery Chain Profit Squeeze | strategy | entry | Global (North America) | Profitability |
| S3 | Dubai Padel Club | strategy | entry | Dubai, UAE | Breakeven |
| S4 | Seat Selection Fees | strategy | entry | Global (Europe) | Pricing |
| S5 | Riyadh EV Fast-Charging Entry | strategy | advanced | Riyadh, KSA | Market entry |
| S6 | Plant-Based Dairy Acquisition | strategy | advanced | Global (Europe) | M&A |
| S7 | Quick-Commerce Losses | strategy | advanced | UAE | Profitability (unit economics) |
| S8 | Cement Price War | strategy | advanced | Saudi Arabia | Pricing / competitive response |
| T1 | Warehouse Rooftop Solar | technical | entry | Riyadh, KSA | Energy go/no-go (NPV/IRR) |
| T2 | Pumping Station Efficiency | technical | entry | Global (Mediterranean) | Plant efficiency |
| T3 | Hajj Nafrah Bus Fleet | technical | entry | Makkah, KSA | Operations / capacity / logistics |
| T4 | Resort Desalination Plant | technical | entry | Red Sea coast, KSA | CAPEX feasibility / LCOW |
| T5 | 1 GW Solar IPP Bid | technical | advanced | Saudi Arabia | Energy go/no-go (LCOE, "what must be true") |
| T6 | Jubail Polyethylene Debottleneck | technical | advanced | Jubail, KSA | Debottlenecking / constraints |
| T7 | District Cooling Concession | technical | advanced | Dubai, UAE | CAPEX go/no-go with ramp-up |
| T8 | Smelter Energy Retrofit | technical | advanced | UAE | Plant efficiency / option value |

---

### S1: Riyadh Specialty Coffee
- **id:** S1
- **title:** Riyadh Specialty Coffee
- **type:** Market sizing
- **track:** strategy
- **difficulty:** entry
- **setting:** Riyadh, Saudi Arabia

**Prompt:**
Our client is a regional specialty-coffee chain based in Kuwait. It is considering opening its first stores in Riyadh, where café culture has grown quickly alongside Vision 2030 entertainment and lifestyle reforms. Before looking at store locations, the CEO wants a quick view of the opportunity: how big is the annual market for café-bought specialty coffee in Riyadh, in number of cups and in Saudi riyals? Please walk me through how you would estimate it, then give me a number.

**Data exhibits (available on request):**
- Riyadh population: ~7.0 million (GASTAT 2022 census order of magnitude for the city; use 7.0 M)
- Share of population aged 15+: 75%
- Share of those who buy café specialty coffee regularly: 30%
- Average cups per regular buyer per week: 4
- Weeks per year: 52
- Average price per cup: SAR 15
- FX: SAR 3.75 = USD 1 (pegged)
- (Sanity check, bottom-up) Assume ~2,500 specialty cafés in Riyadh selling ~360 cups/day each.

**Hint:** Start from people and work to cups, then multiply by price. Segment before you apply a purchase frequency.

**Model structure:**
- Market value = Cups/yr × Avg price
  - Cups/yr = Relevant population × Buyer share × Cups/week × 52
    - Relevant population = Total population × share aged 15+
  - Avg price = blended ticket (hot/iced, size mix)
- Sanity check (supply-side): # cafés × cups/day × 365

**Model reasoning walkthrough:**
1. Relevant population = 7.0 M × 75% = 5.25 M.
2. Regular buyers = 5.25 M × 30% = 1.575 M.
3. Cups per week = 1.575 M × 4 = 6.3 M. Cups per year = 6.3 M × 52 = **327.6 M cups**.
4. Value = 327.6 M × SAR 15 = **SAR 4.914 bn** (≈ SAR 4.9 bn ≈ USD 1.31 bn).
5. Supply-side check: 2,500 × 360 × 365 = 328.5 M cups. This is within 1% of the demand-side figure, so the estimate is consistent.

**Answer:** About 330 M cups/yr, worth about SAR 4.9 bn (about USD 1.3 bn).

**Synthesis:** "Riyadh is roughly a SAR 5 bn specialty-coffee market, large enough that even a 2% share is about SAR 100 M a year, which is meaningful for a regional chain. Before committing, we should test how fast the buyer share is growing and how saturated prime districts already are, because the market is crowded with local and international brands."

**Frameworks used:** `market-sizing`, `top-down`, `supply-side-check`, `segmentation`

---

### S2: Bakery Chain Profit Squeeze
- **id:** S2
- **title:** Bakery Chain Profit Squeeze
- **type:** Profitability
- **track:** strategy
- **difficulty:** entry
- **setting:** Global (North American bakery-café chain)

**Prompt:**
Our client runs a chain of 120 bakery-cafés across the U.S. Midwest. Revenue actually grew last year, yet operating profit fell from $5 M to $2 M. The owner is puzzled: "We're selling more than ever, so why are we making less money?" She has asked us to find out what is driving the decline and what she should do about it.

**Data exhibits:**
| | Last year | This year |
|---|---|---|
| Items sold | 25 M | 26 M |
| Average price per item | $2.00 | $2.00 |
| Revenue | $50 M | $52 M |
| Ingredients | $18 M | $21 M |
| Labor | $15 M | $15.5 M |
| Rent | $8 M | $8.5 M |
| Other (utilities, marketing) | $4 M | $5 M |
| Total cost | $45 M | $50 M |
| Operating profit | $5 M | $2 M |
- Context: butter and wheat prices rose sharply during the year; competitors raised prices ~5-7%.

**Hint:** Split profit into revenue and cost, then express the biggest cost line per item sold.

**Model structure:**
- Profit = Revenue − Cost
  - Revenue = Price × Volume (price flat, volume +4%)
  - Costs
    - Variable: ingredients (per item), part of labor
    - Fixed: rent, other
  - Benchmark: competitor pricing

**Model reasoning walkthrough:**
1. Revenue +$2 M (+4%), all from volume (26 M vs 25 M items); price flat at $2.00.
2. Costs +$5 M. Ingredients contribute +$3 M (60% of the increase), labor +$0.5 M, rent +$0.5 M, other +$1 M.
3. Ingredient cost per item: $18 M/25 M = $0.72, now $21 M/26 M ≈ $0.81 (+12%). The per-unit input cost rose while price stayed flat.
4. Root cause: input inflation was not passed through, while competitors raised prices 5-7%.
5. Fix sizing: to restore $5 M profit, the chain needs +$3 M. That is $3 M/26 M items ≈ **$0.115 per item ≈ +6% price** (assuming no volume loss), which is in line with competitors' increases.

**Answer:** Profit fell because ingredient cost per item rose about 12% while prices stayed flat. A roughly 6% price increase (about $0.12/item) restores the $5 M profit.

**Synthesis:** "The problem isn't demand: volume is up. It's that you absorbed a 12% jump in ingredient costs per item while competitors passed theirs on. A price increase of about 6%, focused on items where you're most differentiated, gets you back to $5 M. We should pair it with a supplier review of butter and flour contracts to protect against the next spike."

**Frameworks used:** `profitability-tree`, `per-unit-analysis`, `price-vs-volume`, `competitor-benchmark`

---

### S3: Dubai Padel Club
- **id:** S3
- **title:** Dubai Padel Club
- **type:** Breakeven
- **track:** strategy
- **difficulty:** entry
- **setting:** Dubai, UAE

**Prompt:**
A Dubai-based sports entrepreneur wants to open an indoor, air-conditioned padel club with 6 courts in a warehouse conversion in Al Quoz. Padel has become one of the fastest-growing sports in the UAE. He will invest about AED 1.8 M in fit-out and courts. He wants to know how many court-hours he must sell each year to break even. Is that realistic, and if so, how long would it take to earn back his investment?

**Data exhibits:**
- Price per court-hour: AED 300
- Variable cost per court-hour (cooling electricity, cleaning, balls, booking-app fee): AED 40
- Annual fixed costs: rent AED 1.2 M; staff AED 0.9 M; marketing and other AED 0.24 M
- Capex AED 1.8 M, depreciated over 6 years (AED 0.3 M/yr)
- Opening hours: 15 h/day, 360 days/yr, 6 courts
- Expected utilization for a well-located club: ~40% of available hours

**Hint:** Find contribution per court-hour, then divide total annual fixed costs by it. Convert the answer into a utilization rate.

**Model structure:**
- Breakeven court-hours = Fixed costs ÷ Contribution per court-hour
  - Contribution = Price − Variable cost
  - Fixed costs = rent + staff + marketing + depreciation
- Feasibility: breakeven hours ÷ available hours vs. expected utilization
- Payback = Capex ÷ (annual profit + depreciation)

**Model reasoning walkthrough:**
1. Contribution per court-hour = 300 − 40 = AED 260.
2. Fixed costs = 1.2 + 0.9 + 0.24 + 0.3 = AED 2.64 M.
3. Breakeven = 2,640,000 ÷ 260 ≈ **10,154 court-hours/yr**.
4. Available = 6 × 15 × 360 = 32,400 court-hours. Breakeven utilization = 10,154/32,400 ≈ **31%**.
5. At 40% utilization: 12,960 hours × 260 = AED 3.37 M contribution, minus 2.64 M fixed = **AED 0.73 M profit**.
6. Operating cash flow = 0.73 + 0.3 (add back depreciation) = AED 1.03 M. Payback = 1.8/1.03 ≈ **1.75 years**.

**Answer:** Breakeven is about 10,150 court-hours/yr (31% utilization). At the expected 40%, profit is about AED 0.73 M/yr and payback is about 1.75 years.

**Synthesis:** "The club breaks even at about 31% utilization, and a well-located club should run around 40%, so the economics work with a payback under two years. The main risk is the gap between those two numbers: if new clubs keep opening nearby and utilization drops by 9 points, profit disappears. I'd lock in a rent-free fit-out period and pre-sell memberships or corporate leagues to secure off-peak hours."

**Frameworks used:** `breakeven`, `contribution-margin`, `utilization`, `payback`

---

### S4: Seat Selection Fees
- **id:** S4
- **title:** Seat Selection Fees
- **type:** Pricing
- **track:** strategy
- **difficulty:** entry
- **setting:** Global (European low-cost airline)

**Prompt:**
Our client is a European low-cost airline carrying 8 million passengers per year. Today, passengers are randomly assigned seats at no charge. Management wants to introduce a paid seat-selection option and has run a pricing survey. They have asked us: what price should they charge, and how much profit could this generate per year?

**Data exhibits:**
- Passengers: 8 M/yr
- Survey take rates (single-price option, share of passengers who would pay):
  - €5 → 30%
  - €8 → 18%
  - €12 → 10%
- Variable cost per paid selection (IT/distribution): €0.40
- Tiered option tested (take rates already net of cannibalization):
  - Standard seat €5 → 25% take
  - Extra-legroom seat €18 → 6% take (extra-legroom seats are ~8% of capacity, so capacity is not binding)

**Hint:** Compare options on profit per passenger, not on revenue or take rate. Then ask whether one price is the best you can do.

**Model structure:**
- Profit = Passengers × Σ (take rate × (price − variable cost))
  - Single-price options (€5 / €8 / €12)
  - Tiered option (standard + extra legroom)
- Qualitative: customer backlash, competitor norms, family seating rules

**Model reasoning walkthrough:**
1. Profit per passenger:
   - €5: (5 − 0.4) × 30% = €1.38
   - €8: (8 − 0.4) × 18% = €1.368
   - €12: (12 − 0.4) × 10% = €1.16
2. The best single price is €5, but €8 is almost equal. Profit is flat across that range, so take-rate uncertainty matters more than the choice of price.
3. Tiered: (5 − 0.4) × 25% + (18 − 0.4) × 6% = 1.15 + 1.056 = **€2.206 per passenger**.
4. Annual: tiered 8 M × 2.206 = **€17.6 M** vs. best single price 8 M × 1.38 = €11.0 M.

**Answer:** Launch a two-tier offer (€5 standard, €18 extra legroom) for about €17.6 M/yr of profit, about 60% more than the best single price.

**Synthesis:** "Segmenting by what customers value earns about 60% more than any single price. A €5 standard seat keeps the entry price low, and an €18 extra-legroom seat captures travelers who value comfort, for about €17.6 M a year. We should protect families traveling with children (free adjacent seating) to limit regulatory and reputation risk, and A/B test the €5 vs. €8 standard price, since profit is nearly flat between them."

**Frameworks used:** `pricing`, `value-based-pricing`, `price-tiering`, `profit-vs-revenue`

---

### S5: Riyadh EV Fast-Charging Entry
- **id:** S5
- **title:** Riyadh EV Fast-Charging Entry
- **type:** Market entry
- **track:** strategy
- **difficulty:** advanced
- **setting:** Riyadh, Saudi Arabia

**Prompt:**
Our client is a European operator of public DC fast-charging networks. Saudi Arabia has announced that 30% of vehicles in Riyadh should be electric by 2030. EVIQ, a PIF–Saudi Electricity Company joint venture, plans 5,000 fast chargers nationally by 2030. Our client is considering entering Riyadh with a network of 150 kW chargers. The board has asked: is the Riyadh market attractive enough to enter, and if so, how should they enter?

**Data exhibits** (some given only when asked; one exhibit is deliberately ambiguous):
- Riyadh light-vehicle fleet 2030 (assumption): 3.0 M
- EV share of fleet 2030 scenarios:
  - Official target: 30%
  - Analyst base case: 4% (EV sales share in KSA today is ~1-2%, and the fleet turns over slowly)
- Average EV distance: 15,000 km/yr; consumption 0.18 kWh/km
- Share of EV energy from public DC fast charging: 20% (most owners in villas charge at home)
- Charger: 150 kW; installed capex incl. grid connection SAR 400,000
- Retail price SAR 1.00/kWh; electricity cost SAR 0.30/kWh (commercial bracket incl. demand charges; SEC commercial tariff is 22-32 halalas/kWh)
- Opex per charger (site lease, maintenance, software): SAR 40,000/yr
- Client hurdle: 5-year simple payback per charger
- Competitor: EVIQ (state-backed) targets 5,000 chargers nationally by 2030, many in Riyadh; fuel stations are adding chargers
- *Distractor:* Riyadh Metro ridership figures

**Hint:** Size public-charging demand under both EV scenarios, work out what utilization one charger needs to hit the payback hurdle, then ask how many chargers the market can support compared with announced supply.

**Model structure:**
- Market attractiveness
  - Demand (kWh) = EVs × km × kWh/km × public-DC share (two scenarios)
  - Growth trajectory and policy support
- Unit economics per charger
  - Margin/kWh = price − energy cost
  - Required kWh = (Capex/payback years + opex) ÷ margin
  - Required utilization = required kWh ÷ max kWh
- Competitive supply vs. supportable chargers (demand ÷ required kWh per charger)
- Entry mode: organic / partnership (fleets, malls, fuel retailers) / JV with local player; phasing triggers

**Model reasoning walkthrough:**
1. Public DC energy per EV = 15,000 × 0.18 × 20% = 540 kWh/yr.
2. Demand in the base case: 3.0 M × 4% = 120,000 EVs, × 540 = **64.8 GWh/yr**. At the official target: 900,000 EVs, × 540 = **486 GWh/yr**.
3. Margin = 1.00 − 0.30 = SAR 0.70/kWh. Maximum output per charger = 150 kW × 8,760 h = 1,314,000 kWh/yr.
4. For a 5-year payback, gross margin must cover 400,000/5 + 40,000 = SAR 120,000/yr. Required energy = 120,000/0.70 ≈ **171,400 kWh/yr, or ~13% utilization**.
   - Check: at 10% utilization, margin 91,980 − 40,000 = SAR 51,980/yr, so payback ≈ 7.7 yrs. At 15%, margin SAR 97,970/yr, so payback ≈ 4.1 yrs.
5. Chargers the market can support at the hurdle: base case 64.8 GWh/171,400 ≈ **378 chargers**. Target case 486 GWh/171,400 ≈ **2,835 chargers**.
6. Supply: EVIQ alone plans 5,000 nationally. If even a third are in Riyadh (about 1,650), the base-case market is **oversupplied roughly 4×**. Only the official-target scenario leaves room for a new entrant.
7. Second-order effects: the state-backed competitor may price below cost to drive adoption. Utilization builds slowly. Summer heat affects battery performance and charging behavior.

**Answer:** Don't build a large standalone network now. In the base case Riyadh supports only about 380 hurdle-rate chargers against more than 1,000 announced. Enter in phases through partnerships, such as depots for ride-hailing and taxi fleets and government fleets with contracted utilization, plus highway corridors (Riyadh–Dammam). Scale up only if the EV fleet share passes about 10%.

**Synthesis:** "The attractiveness of Riyadh depends entirely on which EV forecast you believe. At the policy target the market supports nearly 3,000 chargers, but on a realistic trajectory it supports under 400, and a state-backed player is already building thousands. I'd enter through fleet and site-host partnerships where utilization is contracted, keep capex light, and set clear triggers (EV fleet share, EVIQ pricing) for a larger rollout."

**Frameworks used:** `market-entry`, `market-sizing`, `unit-economics`, `breakeven-utilization`, `scenario-analysis`, `competitive-response`, `entry-mode`

---

### S6: Plant-Based Dairy Acquisition
- **id:** S6
- **title:** Plant-Based Dairy Acquisition
- **type:** M&A
- **track:** strategy
- **difficulty:** advanced
- **setting:** Global (European food multinational)

**Prompt:**
Our client is a large European packaged-food company with strong distribution in 20 countries but little presence in plant-based dairy. A fast-growing oat- and almond-milk brand has put itself up for sale. The founders are asking for $900 M, and their banker's deck claims the category will "grow 15% a year for a decade". The CEO is enthusiastic, but the CFO is skeptical. You have 30 minutes: should we buy, and at what price?

**Data exhibits:**
- Target: revenue $400 M, EBITDA $40 M (10% margin), revenue growth last year 15%
- Asking price: $900 M (= 22.5× EBITDA)
- Recent comparable food/beverage deals: 14-18× EBITDA (use 16× midpoint)
- Category context: plant-based milk growth has slowed markedly in Europe and the U.S. since 2021 after the post-pandemic surge; private label gaining share
- Cost synergies (procurement, logistics, overhead): ~3% of target revenue = $12 M/yr at full run-rate (year 3)
- Revenue synergies: +$60 M sales via client distribution at 20% contribution margin = $12 M/yr; the team estimates a 50% probability of delivery
- One-time integration cost: $30 M
- Valuation convention for this case: capitalize synergies at 10× (discount to the 16× multiple for risk and delay)
- Alternative: organic brand launch estimated at $150 M over 4 years, with a lower chance of success

**Hint:** Value the target standalone first, then add risk-adjusted synergies net of integration costs. Compare that ceiling with the asking price.

**Model structure:**
- Strategic rationale: fill portfolio gap; buy vs. build vs. partner
- Standalone value: EBITDA × comparable multiple; sanity check growth claims
- Synergies
  - Cost synergies (high confidence)
  - Revenue synergies (probability-weighted)
  - − Integration costs
- Maximum price = standalone + net synergy value; premium vs. synergies
- Risks: category slowdown, brand/culture loss, founder retention

**Model reasoning walkthrough:**
1. Standalone value = $40 M × 16 = **$640 M**. The $900 M ask implies 22.5×, which only makes sense if the 15% growth claim holds for a decade; category data suggests growth is slowing.
2. Cost synergies: $12 M × 10 = $120 M.
3. Revenue synergies: $12 M × 10 × 50% = $60 M.
4. Integration: −$30 M. Net synergies = 120 + 60 − 30 = **$150 M**.
5. Maximum justifiable price = 640 + 150 = **$790 M**.
6. At $900 M the premium over standalone is $260 M, compared with $150 M of net synergies. The client would give the seller **more than 170% of the synergy value** and destroy about $110 M.
7. Alternatives: an organic launch costs $150 M but is slower and riskier. A minority stake with an option to acquire limits exposure to the category slowdown.

**Answer:** Don't pay $900 M. Walk-away price about $790 M; target a bid around $700-750 M so value is shared. Consider an earn-out tied to growth claims.

**Synthesis:** "The brand fits our portfolio, but at $900 M we'd be paying the founders for all our synergies and then some, about $110 M more than it's worth to us. I'd bid in the low-to-mid $700 millions, bridge the gap with an earn-out paid only if the claimed 15% growth materializes, and be ready to walk away, since an organic launch or a minority stake are credible fallbacks."

**Frameworks used:** `m-and-a`, `valuation-multiples`, `synergy-analysis`, `buy-vs-build`, `earn-out`, `risk-adjustment`

---

### S7: Quick-Commerce Losses
- **id:** S7
- **title:** Quick-Commerce Losses
- **type:** Profitability (unit economics, multi-lever)
- **track:** strategy
- **difficulty:** advanced
- **setting:** UAE (Dubai and Abu Dhabi)

**Prompt:**
Our client is a UAE quick-commerce grocery app promising 20-minute delivery from dark stores. Its investors are alarmed: order volume grew 67% and gross merchandise value (GMV) grew 37% this year, yet the operating loss grew from AED 8 M to AED 66 M. The next funding round depends on showing a credible path to breakeven within 18 months. What is going on, and what should management do?

**Data exhibits:**
| Per-order economics | Last year | This year |
|---|---|---|
| Orders | 6 M | 10 M |
| Average order value (AOV) | AED 85 | AED 70 |
| Gross margin on groceries | 22% | 22% |
| Last-mile delivery cost/order | AED 12 | AED 13 |
| Payment processing | 2% of AOV | 2% of AOV |
| Discounts/promos per order | AED 3.00 | AED 4.50 |
| Dark stores (fixed AED 1.2 M/store/yr) | 8 | 14 |
| HQ overhead | AED 10 M | AED 14 M |
- Mix note: 55% of new-customer orders this year were under AED 40 (minimum basket removed in Q1 to accelerate growth)
- Rider cost rose due to new minimum-pay rules and higher fuel prices
- Benchmark: global retail media (in-app ads) earns quick-commerce players ~1-2% of GMV
- Management estimate: reinstating an AED 50 minimum basket would cut orders ~20% but return AOV to ~AED 85
- 2 of the 14 dark stores run at under 40% of throughput capacity
- *Distractor:* app store rating trend

**Hint:** Build contribution per order before fixed costs and compare the two years. Then work out what contribution per order breakeven requires and which levers get there. Watch for how each lever changes order volume.

**Model structure:**
- EBIT = Orders × Contribution/order − Fixed costs (dark stores + HQ)
  - Contribution/order = AOV × GM% + other income − delivery − payment − discounts
    - AOV drivers: basket mix, minimum order policy
    - Delivery drivers: rider cost, batching, density
    - Discounts: acquisition vs. retention promos
  - Fixed: store count and utilization, HQ
- Levers: minimum basket or small-basket fee, discount discipline, batching, retail media, store consolidation
- Second-order: volume loss from minimum basket; store closures reduce coverage

**Model reasoning walkthrough:**
1. Contribution/order last year = 85 × 22% − 12 − 1.70 − 3.00 = 18.70 − 16.70 = **AED +2.00**. EBIT = 6 M × 2.00 − 9.6 M − 10 M = **−AED 7.6 M**.
2. This year = 70 × 22% − 13 − 1.40 − 4.50 = 15.40 − 18.90 = **AED −3.50**. EBIT = 10 M × (−3.50) − 16.8 M − 14 M = **−AED 65.8 M**.
3. Root cause: every additional order now loses money. Growth is making the losses worse. Drivers of the AED 5.50 swing per order:
   - Smaller baskets: −3.30 gross profit, partly offset by +0.30 lower payment fees
   - Higher discounts: −1.50
   - Higher delivery cost: −1.00
4. Breakeven at 10 M orders requires contribution = (16.8 + 14) M/10 M = **AED 3.08/order**.
5. Lever package:
   - AOV back to 85 (gross profit 18.70, payment 1.70)
   - Batching cuts delivery to AED 12
   - Discounts to AED 2.50
   - Retail media 1.5% × 85 = +AED 1.275
   - Contribution = 18.70 + 1.275 − 12 − 1.70 − 2.50 = **AED 3.775/order**
6. Naively at 10 M orders: 37.75 − 30.8 = +AED 6.95 M. But the minimum basket cuts orders about 20% (second-order effect): 8 M × 3.775 = 30.2 M − 30.8 M = **−AED 0.6 M**.
7. Also closing the 2 underutilized stores (−AED 2.4 M fixed) gives 30.2 − 28.4 = **+AED 1.8 M EBIT**. Some of their orders may shift to neighboring stores.

**Answer:** The company is losing AED 3.50 on every order because baskets shrank, discounts rose and delivery costs increased. A package of an AED 50 minimum basket, batching, discount discipline, retail media, and closing 2 stores reaches about AED +1.8 M EBIT, even after losing 20% of orders.

**Synthesis:** "Growth has been hiding a unit-economics problem: removing the minimum basket filled the funnel with small orders that lose money. Refocusing on AED 85 baskets, cutting promos, batching deliveries and launching in-app advertising lifts contribution to about AED 3.8 per order. With two underused stores closed, the business breaks even on 20% fewer orders. That's the story for investors: fewer, better orders, and growth only where store density supports it."

**Frameworks used:** `profitability-tree`, `unit-economics`, `contribution-margin`, `mix-analysis`, `second-order-effects`, `lever-sizing`

---

### S8: Cement Price War
- **id:** S8
- **title:** Cement Price War
- **type:** Pricing / competitive response
- **track:** strategy
- **difficulty:** advanced
- **setting:** Saudi Arabia

**Prompt:**
Our client is a listed Saudi cement producer with 8 Mt/yr of capacity, currently selling 5 Mt. Vision 2030 giga-projects boosted demand, but industry capacity has grown faster and several plants are running well below capacity. The sales director proposes cutting price 10% to "fill the kilns and take share". The CEO asks: will a price cut increase profit? If not, what should we do with our spare capacity?

**Data exhibits:**
- Saudi cement market: 50 Mt/yr; client share 10% (5 Mt); capacity 8 Mt
- Price: SAR 180/t; variable cost SAR 110/t; fixed costs SAR 250 M/yr
- Market elasticity: demand is driven by construction and is highly inelastic. A 10% industry-wide price drop raises total demand only ~2%.
- Competitor behavior: prices are transparent (distributors quote daily); in past episodes, rivals matched cuts within weeks
- If rivals do *not* react (unlikely), sales-team estimate: share rises to 13%
- Export option: FOB export price SAR 150/t; extra logistics SAR 20/t; up to 2 Mt/yr of export demand available (regional markets)
- Context: clinker/cement exports have at times required government licensing

**Hint:** Compute how much volume the cut would need just to keep profit flat, then test that against two scenarios: competitors match, or they don't.

**Model structure:**
- Current profit = Q × (P − VC) − FC
- Required volume after cut = current contribution ÷ new unit margin
- Scenarios
  - No competitor reaction → share gain
  - Competitors match → market elasticity only
- Alternatives for idle capacity: exports, cost reduction, capacity rationalization, value-added products
- Market structure: repeated game, signaling

**Model reasoning walkthrough:**
1. Current contribution = 5 Mt × (180 − 110) = SAR 350 M. Profit = 350 − 250 = **SAR 100 M**.
2. After a 10% cut: price SAR 162, margin SAR 52/t. Volume to keep contribution flat = 350/52 ≈ **6.73 Mt (+35%)**.
3. Scenario A, no reaction: 13% × 50 = 6.5 Mt, × 52 = 338 M. Profit = **SAR 88 M** (−12%). Even the best case loses money.
4. Scenario B, rivals match: market +2% gives 51 Mt × 10% = 5.1 Mt, × 52 = 265.2 M. Profit = **SAR 15.2 M** (−85%).
5. Export alternative at the current domestic price: margin = 150 − 20 − 110 = SAR 20/t. 2 Mt × 20 = **+SAR 40 M**, giving profit about SAR 140 M while filling capacity to 7 Mt without touching the domestic price.

**Answer:** No. A 10% cut lowers profit in every scenario (SAR 88 M at best, about SAR 15 M if matched). Hold domestic price and export up to 2 Mt (+SAR 40 M contribution), subject to export licensing.

**Synthesis:** "In a transparent commodity market with inelastic demand, a price cut is a gift to our customers, not a way to win share. Rivals will match it and our profit falls by up to 85%. The better use of our idle kilns is exports, which add about SAR 40 M. Longer term, we should push for industry capacity rationalization and cut our variable cost, since that is the lasting advantage in cement."

**Frameworks used:** `pricing`, `price-elasticity`, `competitive-response`, `game-theory`, `breakeven-volume`, `capacity-utilization`

---

### T1: Warehouse Rooftop Solar
- **id:** T1
- **title:** Warehouse Rooftop Solar
- **type:** Energy project go/no-go (NPV / IRR / payback)
- **track:** technical
- **difficulty:** entry
- **setting:** Riyadh, Saudi Arabia

**Prompt:**
A logistics company operates a large distribution warehouse in Riyadh's Second Industrial City with a flat roof of about 8,000 m² and high daytime electricity demand for cooling and conveyors. A contractor has quoted SAR 2.6 M to install a 1 MWp rooftop solar PV system. All generation would be consumed on-site, displacing grid electricity. The CFO asks: is this a good investment?

**Data exhibits:**
- System size: 1 MWp (1,000 kWp); installed capex SAR 2.6 M
- Specific yield: 1,800 kWh/kWp/yr (fixed tilt; Saudi Arabia's average PV potential is ~1,900 kWh/kWp)
- Avoided grid tariff (marginal commercial rate): SAR 0.30/kWh (SEC commercial tariff: 22 halalas up to 6,000 kWh/month, 32 above)
- O&M (cleaning for dust soiling, inspection, insurance): SAR 30,000/yr
- Project life: 25 years; discount rate 8%
- Annuity factor (8%, 25 yrs) = 10.675
- Optional sensitivity: module degradation 0.5%/yr

**Hint:** Turn the system size into annual kWh, then into riyals saved. Net off O&M and compare with capex using payback and NPV.

**Model structure:**
- Annual savings = kWp × yield × avoided tariff
- Net annual cash flow = savings − O&M
- Metrics
  - Simple payback = capex ÷ net cash flow
  - NPV = net cash flow × AF(8%, 25) − capex
  - IRR vs. 8% hurdle
- Risks: soiling, degradation, tariff changes, roof life, net-billing rules

**Model reasoning walkthrough:**
1. Generation = 1,000 kWp × 1,800 = 1,800,000 kWh/yr.
2. Savings = 1.8 M × 0.30 = SAR 540,000/yr. Net = 540,000 − 30,000 = **SAR 510,000/yr**.
3. Payback = 2.6 M/0.51 M ≈ **5.1 years**.
4. NPV = 510,000 × 10.675 − 2,600,000 ≈ 5.444 M − 2.6 M = **SAR +2.84 M**.
5. IRR ≈ **19.4%**, well above the 8% hurdle.
6. Sensitivity with 0.5%/yr degradation: NPV ≈ SAR 2.61 M, IRR ≈ 18.9%. The decision is robust.

**Answer:** Go. NPV about SAR +2.8 M, IRR about 19%, payback about 5 years.

**Synthesis:** "The rooftop system pays for itself in about five years and returns roughly 19% a year over its 25-year life, more than double our cost of capital. Even with realistic panel degradation the case holds. I'd approve it, specifying a regular cleaning contract (dust soiling is the biggest performance risk in Riyadh), and confirm the roof has 25 years of structural life left before installation."

**Frameworks used:** `npv`, `irr`, `payback`, `annuity-factor`, `energy-yield`, `sensitivity-analysis`

---

### T2: Pumping Station Efficiency
- **id:** T2
- **title:** Pumping Station Efficiency
- **type:** Plant efficiency / energy retrofit
- **track:** technical
- **difficulty:** entry
- **setting:** Global (Mediterranean municipal water utility)

**Prompt:**
A municipal water utility in southern Europe runs a transmission pumping station with 10 identical pumps. Electricity is its largest operating cost. An engineering review found the pumps are old and oversized, with a wire-to-water efficiency of only 62%. A vendor offers to replace them with high-efficiency pumps and variable-speed drives achieving 75%, for €3.0 M installed. The utility director asks: how much energy and money would we save, and is it worth it?

**Data exhibits:**
- Pumps: 10 × 500 kW electrical input each, all running
- Operating hours: 8,000 h/yr
- Current wire-to-water efficiency: 62%; proposed: 75%
- Water delivered (hydraulic duty) stays the same after the retrofit
- Electricity price: €0.15/kWh
- Retrofit capex: €3.0 M; asset life 15+ years
- (Optional) grid emission factor: 0.25 tCO₂/MWh

**Hint:** Hydraulic power (the useful work) doesn't change. Work out the useful output today, then the input power needed at the new efficiency.

**Model structure:**
- Current input energy = kW × hours
- Useful hydraulic power = input × current efficiency (held constant)
- New input power = hydraulic power ÷ new efficiency
- Savings = (old − new) energy × price
- Payback = capex ÷ annual savings; add CO₂ and reliability benefits

**Model reasoning walkthrough:**
1. Current input = 10 × 500 = 5,000 kW. Energy = 5,000 × 8,000 = **40,000 MWh/yr**.
2. Hydraulic power = 5,000 × 0.62 = 3,100 kW.
3. New input = 3,100/0.75 ≈ 4,133 kW. Energy ≈ 33,067 MWh/yr.
4. Savings ≈ 40,000 − 33,067 = **6,933 MWh/yr (−17%)**.
5. Cost savings = 6,933,000 kWh × €0.15 ≈ **€1.04 M/yr**.
6. Payback = 3.0/1.04 ≈ **2.9 years**. CO₂ avoided ≈ 6,933 × 0.25 ≈ 1,730 t/yr.
7. Check: savings % = 1 − 0.62/0.75 = 17.3%. Consistent.

**Answer:** Saves about 6,900 MWh and €1.04 M a year. Payback about 2.9 years. Go.

**Synthesis:** "Replacing the pumps cuts the station's electricity use by about 17%, saving roughly €1 M a year, so the €3 M investment pays back in under three years on an asset that lasts 15 or more. I'd proceed, and use the variable-speed drives to match pumping to real-time demand, which could push savings above this estimate since the old pumps are oversized."

**Frameworks used:** `energy-efficiency`, `wire-to-water-efficiency`, `payback`, `unit-conversion`

---

### T3: Hajj Nafrah Bus Fleet
- **id:** T3
- **title:** Hajj Nafrah Bus Fleet
- **type:** Operations / capacity / logistics
- **track:** technical
- **difficulty:** entry
- **setting:** Makkah (Holy Sites: Arafat → Muzdalifah), Saudi Arabia

**Prompt:**
During Hajj, after sunset on the Day of Arafah, pilgrims move from Arafat to Muzdalifah in a few hours, a movement known as the Nafrah. Hajj 2025 had about 1.67 M pilgrims. Some travel by the Mashaer train, some walk, and the rest go by bus. Our client, a transport operator, is responsible for moving 400,000 pilgrims by bus within a 6-hour window. The ministry wants to know: how many buses must the operator deploy?

**Data exhibits:**
- Pilgrims assigned to the operator: 400,000
- Window: 6 hours
- Bus capacity: 45 seated pilgrims (standing not permitted)
- Round-trip cycle time including loading, congested travel, unloading and return: 90 minutes
- Maintenance/breakdown reserve required: 10% of the active fleet
- Context: total Hajj 2025 pilgrims 1,673,230 (GASTAT)

**Hint:** Work out how many loads one bus can carry in the window, then divide the pilgrims by pilgrims per bus. Don't forget the reserve.

**Model structure:**
- Loads per bus = window ÷ cycle time
- Pilgrims per bus = loads × seats
- Active buses = pilgrims ÷ pilgrims per bus (round up)
- Total fleet = active × (1 + reserve)
- Risks: peak congestion, staging, drivers and shifts, heat

**Model reasoning walkthrough:**
1. Loads per bus = 6 h ÷ 1.5 h = 4.
2. Pilgrims per bus = 4 × 45 = 180.
3. Active buses = 400,000/180 ≈ 2,222.2, **rounded up to 2,223**.
4. With the 10% reserve: 2,222.2 × 1.1 ≈ 2,444, so **about 2,445 buses**.
5. Second thought (bonus): the last bus only needs a one-way trip, so real capacity is slightly higher. Congestion may stretch the cycle time: at 120 minutes (3 loads) the fleet would need 400,000/135 ≈ 2,963 active buses. Cycle time is the critical variable.

**Answer:** About 2,445 buses (2,223 active plus a 10% reserve).

**Synthesis:** "The operator needs roughly 2,450 buses, but the real lever is cycle time. If congestion stretches the round trip from 90 to 120 minutes, the requirement jumps by about a third. I'd invest in dedicated bus lanes, pre-assigned staging groups and real-time dispatch before buying or leasing extra buses."

**Frameworks used:** `capacity-planning`, `cycle-time`, `throughput`, `buffer-sizing`, `sensitivity-analysis`

---

### T4: Resort Desalination Plant
- **id:** T4
- **title:** Resort Desalination Plant
- **type:** CAPEX feasibility / levelized cost of water
- **track:** technical
- **difficulty:** entry
- **setting:** Red Sea coast, Saudi Arabia (luxury tourism giga-project)

**Prompt:**
A developer of a luxury island-resort destination on the Saudi Red Sea coast needs a reliable water supply for hotels, staff housing and landscaping. The alternative is trucking desalinated water from a distant utility plant. The developer's engineers propose building a dedicated 20,000 m³/day seawater reverse-osmosis (SWRO) plant powered largely by the project's own solar farm. The board asks: what will our water cost per cubic meter, and does building the plant make sense?

**Data exhibits:**
- Capacity: 20,000 m³/day; availability 95%
- Capex: USD 1,500 per m³/day of capacity (small-scale premium; large IWPs such as Jubail 3A were ~USD 1,100 per m³/day: USD 658 M for 600,000 m³/day)
- Specific energy consumption: 3.5 kWh/m³ (typical SWRO; Jubail benchmark)
- Power cost (solar + grid blend): USD 0.05/kWh
- Other opex (membranes, chemicals, labor, maintenance): USD 0.20/m³
- Financing: 8% over 25 years → capital recovery factor = 0.0937
- Alternative: trucked water ~USD 3.00/m³ delivered
- Benchmark: large Saudi IWP tariffs ~USD 0.40-0.55/m³ (Rabigh 3: ~0.55)

**Hint:** Levelized cost = annualized capital + operating cost per m³, divided by annual output. Use the capital recovery factor to annualize capex.

**Model structure:**
- LCOW = (Capex × CRF + annual opex) ÷ annual output
  - Output = capacity × 365 × availability
  - Capital charge per m³
  - Energy cost per m³ = SEC × power price
  - Other opex per m³
- Compare: trucked water, utility-scale tariffs
- Risks: brine discharge in a sensitive reef ecosystem, redundancy (N+1 trains), storage

**Model reasoning walkthrough:**
1. Annual output = 20,000 × 365 × 0.95 = **6,935,000 m³/yr**.
2. Capex = 20,000 × 1,500 = USD 30 M. Annual capital charge = 30 M × 0.0937 ≈ USD 2.81 M. Per m³ = 2.81 M/6.935 M ≈ **USD 0.405/m³**.
3. Energy = 3.5 × 0.05 = **USD 0.175/m³**.
4. Other opex = **USD 0.20/m³**.
5. LCOW = 0.405 + 0.175 + 0.20 ≈ **USD 0.78/m³**.
6. Compared with trucking at USD 3.00/m³, that saves about USD 2.2/m³, or about 2.22 × 6.935 M ≈ USD 15.4 M/yr. It is above utility-scale tariffs (USD 0.40-0.55), as expected at 1/30th of the scale.

**Answer:** LCOW about USD 0.78/m³, roughly a quarter of the cost of trucked water. Build it.

**Synthesis:** "A dedicated plant delivers water at about 78 cents per cubic meter, roughly a quarter of the cost of trucking, saving around USD 15 M a year. It costs more than giant utility plants because of its small scale, but that's the right comparison only if a pipeline connection exists, and here it doesn't. The design must include a brine-discharge solution that protects the reefs, since the resort's brand depends on them."

**Frameworks used:** `levelized-cost`, `capital-recovery-factor`, `capex-feasibility`, `benchmarking`, `make-vs-buy`

---

### T5: 1 GW Solar IPP Bid
- **id:** T5
- **title:** 1 GW Solar IPP Bid
- **type:** Energy go/no-go (LCOE, "what must be true")
- **track:** technical
- **difficulty:** advanced
- **setting:** Saudi Arabia (National Renewable Energy Program round)

**Prompt:**
Our client, an international developer, is preparing a bid for a 1,000 MW solar PV independent power project (IPP) under Saudi Arabia's National Renewable Energy Program, with a 25-year power purchase agreement. Recent Saudi awards have set world-record low tariffs: Shuaibah 1 at about 1.04 US¢/kWh, and 2025 projects at about 1.10-1.37¢. The client's internal model gives a tariff of almost 2¢ and management thinks the winners must be "buying the projects". Are they right? Should we bid, and at what conditions?

**Data exhibits:**
- Capacity 1,000 MWac; single-axis trackers + bifacial modules; capacity factor 30% (desert sites exceed 28% with trackers/bifacial)
- Client base case: capex USD 0.55 M/MW; opex USD 8 M/yr; WACC 6%; 25-yr life
- CRF(6%, 25) = 0.0782; CRF(5%, 25) = 0.0710
- Reference: Sudair 1.5 GW (reached COD 2023-24) cost ~USD 924 M ≈ USD 0.62 M/MW; module prices have since fallen substantially
- Winning consortia typically include a local/state-linked partner (e.g., PIF-backed), long-tenor bank debt at tight spreads, and very high leverage
- Target bid to be competitive: ~1.30 US¢/kWh
- Other considerations: land and grid connection provided by procurer, local-content requirements, curtailment and degradation risk

**Hint:** Compute the LCOE from the client's assumptions. Then reverse it: at the target tariff, what capex, opex and cost of capital would have to be true?

**Model structure:**
- LCOE = (Capex × CRF + opex) ÷ annual MWh
  - Energy = MW × 8,760 × capacity factor
  - Capital charge (depends on capex and WACC)
  - Opex
- Gap analysis vs. market tariff (≈1.30¢)
  - Capex lever (EPC, modules, trackers)
  - Financing lever (WACC, tenor, leverage)
  - Yield lever (CF, degradation, bifacial gain)
  - Opex lever (robotic cleaning, scale)
- Decision: bid / no bid / conditions; risks (curtailment, FX, local content)

**Model reasoning walkthrough:**
1. Energy = 1,000 × 8,760 × 0.30 = **2,628,000 MWh/yr**.
2. Base case: capital charge = 550 × 0.0782 ≈ USD 43.0 M. Plus opex 8 M = USD 51.0 M/yr. LCOE = 51.0 M/2.628 M MWh ≈ **USD 19.4/MWh ≈ 1.94 ¢/kWh**, about 50% above the competitive level.
3. Reverse-solve at 1.30¢ with a 5% WACC and opex of USD 6 M:
   - Revenue = 13 × 2,628,000 = USD 34.2 M
   - Allowed capital charge = 34.2 − 6 = 28.2 M
   - Capex = 28.2/0.0710 ≈ **USD 397 M, i.e., ~USD 0.40 M/MW**
4. So winners aren't necessarily "buying" projects. The bid is achievable if capex is about USD 0.40 M/MW (plausible given the fall in module prices since Sudair, plus huge scale), WACC is about 5% (concessional or state-linked long-tenor debt), and opex is about USD 6/kW-yr.
5. Second-order risks: at ultra-thin margins, a 1-2% curtailment or faster degradation wipes out the equity return. Local-content rules may raise capex.

**Answer:** At the client's current assumptions (1.94¢) the bid would lose. Bid only if EPC offers come in at or below USD 0.40 M/MW and financing at or below 5% WACC (e.g., by partnering with a local or state-linked sponsor). Otherwise, no-go.

**Synthesis:** "The record tariffs aren't irrational. They reflect capex around USD 0.40 M per MW and financing near 5%, which our current model doesn't assume. We should only bid if we can lock in EPC pricing at that level and bring in a partner that lowers our cost of capital. If we can't, we should stay out rather than win a project that destroys value."

**Frameworks used:** `lcoe`, `capital-recovery-factor`, `reverse-engineering`, `what-must-be-true`, `sensitivity-analysis`, `bid-strategy`

---

### T6: Jubail Polyethylene Debottleneck
- **id:** T6
- **title:** Jubail Polyethylene Debottleneck
- **type:** Debottlenecking / constrained capacity investment
- **track:** technical
- **difficulty:** advanced
- **setting:** Jubail Industrial City, Saudi Arabia

**Prompt:**
Our client runs an integrated petrochemical complex in Jubail: an ethane cracker feeding two polyethylene (PE) units and an ethylene glycol (EG) unit. PE margins are strong, and engineering has proposed a USD 120 M project to debottleneck the PE units by 150 kt/yr. The project sponsor's slide shows incremental margin of USD 105 M a year and a payback of just over a year. The CEO wants a second opinion before board approval.

**Data exhibits:**
- Cracker nameplate: 1,300 kt/yr ethylene; current production 1,250 kt/yr (limited by fixed ethane feedstock allocation)
- Ethylene consumers: PE units 1,000 kt/yr (running full); EG unit 250 kt/yr of ethylene
- Assume 1 t ethylene → 1 t PE for simplicity
- Value of ethylene in PE (PE price $1,100/t − conversion $150/t) = $950/t ethylene
- Value of ethylene in EG (netback after conversion) = $800/t ethylene
- Cash cost of ethane-based ethylene: $250/t (ethane is allocated at a regulated price and cannot be increased)
- Extra ethylene can be made by co-feeding propane in the cracker, up to the 50 kt/yr nameplate headroom, at a cash cost of $700/t ethylene
- Sponsor's calculation: 150 kt × ($950 − $250) = $105 M/yr
- EG is sold partly under term contracts (volume flexibility ~±40%)
- Discount rate 10%, project life 15 yrs; AF(10%, 15) = 7.606

**Hint:** Before valuing more PE, ask where the extra 150 kt of ethylene will come from, and what it costs or what it displaces.

**Model structure:**
- System mass balance: feedstock → cracker → PE / EG (find the binding constraint)
- Sources of incremental ethylene for 150 kt
  - Cracker headroom (50 kt) on propane → cost $700/t
  - Diversion from EG (100 kt) → opportunity cost $800/t
- Incremental margin by source; payback; NPV
- Risks: EG contracts, PE–EG spread volatility, propane price, execution
- Alternatives: smaller 50 kt project; seek additional ethane allocation

**Model reasoning walkthrough:**
1. Mass balance: 1,250 kt produced = 1,000 kt PE + 250 kt EG. Ethylene is fully used, and ethane supply is capped, so the **real constraint is feedstock, not PE capacity**. The sponsor's calculation assumes 150 kt of new ethylene at $250/t, which doesn't exist.
2. Source 1: 50 kt from cracker headroom on propane. Margin = (950 − 700) × 50 kt = **$12.5 M**.
3. Source 2: 100 kt diverted from EG to PE. Margin = (950 − 800) × 100 kt = **$15 M** (within the ±40% EG contract flexibility, since 100/250 = 40%).
4. True incremental margin = **$27.5 M/yr**, not $105 M. Payback = 120/27.5 ≈ **4.4 years**.
5. NPV = 27.5 × 7.606 − 120 ≈ **+$89 M**. Still positive, but it depends on the PE–EG spread ($150/t) and propane cost.
6. Sensitivity: if the PE–EG spread falls to $50/t, the diversion margin falls to $5 M and the total to $17.5 M, giving an NPV of about 17.5 × 7.606 − 120 ≈ +$13 M, close to marginal.

**Answer:** The sponsor overstates the benefit about 4×. The true margin is about $27.5 M/yr (payback 4.4 yrs, NPV about +$89 M at 10%). Approve conditionally, and pursue a larger ethane allocation or propane supply contract to firm up economics.

**Synthesis:** "The debottleneck is still worth doing, but it's a 4-year payback, not a 1-year one, because there's no spare ethane. Most of the extra PE comes from ethylene we'd otherwise sell as glycol, or from propane that costs almost three times as much as ethane. I'd approve it with a clear-eyed business case, lock in EG contract flexibility, and treat any future ethane allocation as the real prize."

**Frameworks used:** `debottlenecking`, `theory-of-constraints`, `mass-balance`, `opportunity-cost`, `npv`, `sensitivity-analysis`, `trap-detection`

---

### T7: District Cooling Concession
- **id:** T7
- **title:** District Cooling Concession
- **type:** CAPEX go/no-go with ramp-up and design sizing
- **track:** technical
- **difficulty:** advanced
- **setting:** Dubai, UAE

**Prompt:**
A utilities investor has been invited to build and operate a district cooling plant for a new waterfront mixed-use district in Dubai, under a 25-year concession. Buildings will contract 40,000 refrigeration tons (RT) of cooling capacity. The investor's engineers proposed an AED 572 M plant sized at 44,000 RT (contracted load plus 10%). The investment committee's hurdle rate is 8%. Is this a go? If not, what would make it work?

**Data exhibits:**
- Contracted (connected) capacity: 40,000 RT
- Diversity factor (buildings don't peak simultaneously): 0.80 → coincident peak 32,000 RT
- Redundancy standard: N+1, approximated as +10% over coincident peak
- All-in capex (plant, thermal storage, distribution network, energy transfer stations): AED 13,000 per installed RT (assumption for the case)
- Tariffs (in line with Dubai market practice, e.g., Empower): capacity charge AED 750/RT-yr on contracted RT; consumption charge AED 0.568/RTh
- Annual cooling delivered at full occupancy: 32,000 RT × 3,500 equivalent full-load hours = 112 M RTh
- Plant electricity: 0.95 kW/RT all-in × AED 0.35/kWh
- Cooling-tower make-up water: 0.0075 m³/RTh at AED 10/m³ (potable); treated sewage effluent (TSE) available at AED 4/m³
- Fixed O&M: AED 11 M/yr
- Occupancy ramp: 30% (yr 1), 55% (yr 2), 80% (yr 3), 100% (yr 4+); revenue and variable costs scale with occupancy
- Developer willing to pay a one-time connection fee of AED 3,000 per contracted RT (AED 120 M) if asked
- Plant can be built in two phases (60% now, 40% in year 3)

**Hint:** First check whether the plant is sized to the right load. Then model the ramp-up rather than assuming full occupancy on day one, and look for levers on capex, operating costs and upfront funding.

**Model structure:**
- Design sizing: contracted load × diversity × (1 + redundancy) vs. proposal
- Revenue: capacity charge (contracted RT) + consumption (RTh)
- Costs: electricity (kW/RT × RTh × tariff), water, fixed O&M
- Capex: installed RT × unit cost; phasing
- Returns: NPV/IRR at 8% under (a) steady-state, (b) ramp-up, (c) with levers
- Levers: right-sizing, phasing, TSE water, connection fee, TES for off-peak, efficiency

**Model reasoning walkthrough:**
1. **Sizing:** 40,000 × 0.80 × 1.10 = **35,200 RT**, not 44,000 RT. Capex = 35,200 × 13,000 = **AED 457.6 M** (vs. 572 M proposed), saving AED 114 M.
2. **Steady-state economics:**
   - Revenue: capacity 40,000 × 750 = AED 30.0 M; consumption 112 M × 0.568 = AED 63.6 M; total AED 93.6 M
   - Electricity: 112 M × 0.95 = 106.4 GWh × 0.35 = AED 37.2 M
   - Water: 840,000 m³ × 10 = AED 8.4 M
   - Fixed O&M: AED 11 M
   - EBITDA ≈ **AED 37.0 M/yr**
3. Right-sized, full load from year 1 (naive): simple payback 12.4 yrs, IRR ≈ 6.3%, NPV at 8% ≈ **−AED 63 M**.
4. With the realistic ramp-up: IRR ≈ 5.1%, NPV ≈ **−AED 120 M**. The oversized 44,000 RT proposal with ramp-up gives IRR ≈ 3.1% and NPV ≈ −AED 235 M.
5. **Levers:**
   - Switching to TSE raises variable margin at full load from AED 48.0 M to AED 53.0 M
   - Collecting the AED 120 M connection fee upfront
   - Phasing capex 60% now, 40% in year 3
   - Combined: IRR ≈ **11.2%**, NPV at 8% ≈ **+AED 85 M**
   - Fee plus TSE alone (no phasing): IRR ≈ 9.4%, NPV ≈ +AED 48 M

**Answer:** No-go as proposed (oversized, NPV about −AED 235 M). Go if: the plant is right-sized to 35,200 RT and phased, runs on TSE water, and the developer pays a connection fee. Then IRR is about 11% and NPV about +AED 85 M.

**Synthesis:** "As designed, this plant is 25% too big and assumes the district is full on day one, which destroys over AED 200 M of value. Sized to the real coincident peak, built in two phases as buildings fill up, running on treated sewage water, and with a connection fee from the developer, it clears our hurdle comfortably at about 11%. We should make the connection fee and phasing rights conditions of signing."

**Frameworks used:** `capex-go-no-go`, `npv`, `irr`, `design-sizing`, `diversity-factor`, `ramp-up`, `phasing`, `real-options`, `lever-sizing`

---

### T8: Smelter Energy Retrofit
- **id:** T8
- **title:** Smelter Energy Retrofit
- **type:** Plant efficiency / capital allocation between options
- **track:** technical
- **difficulty:** advanced
- **setting:** UAE (aluminium smelter with captive gas-fired power plant)

**Prompt:**
Our client operates a 1 Mt/yr primary aluminium smelter in the UAE with its own gas-fired power plant. Its pots use older technology at 14.5 MWh of electricity per tonne of aluminium; the best new cell technology reaches about 13-13.5 MWh/t. A USD 300 M cell-retrofit program would cut consumption to 13.5 MWh/t. The CFO sees two ways to use the freed-up power: sell it to the national grid, or invest another USD 80 M to raise amperage and produce more metal. Which should we choose, and how robust is that choice?

**Data exhibits:**
- Production: 1,000,000 t/yr aluminium; current specific consumption 14.5 MWh/t → 14.5 TWh/yr from the captive plant
- Retrofit capex: USD 300 M → 13.5 MWh/t
- Option A: sell surplus power to grid at USD 40/MWh under a long-term offtake (generation cost already incurred; no extra fuel)
- Option B: amperage increase (rectifiers, casthouse, potroom upgrades), extra capex USD 80 M. It uses all freed power to produce more metal at 13.5 MWh/t.
- Metal price assumption: LME USD 2,400/t + regional/product premium USD 200/t = USD 2,600/t realized
- Non-power cash cost per tonne (alumina ~1.9 t/t, carbon anodes, labor, other): USD 1,500/t
- Discount rate 10%, 20 yrs; AF(10%, 20) = 8.514
- Market note: GCC smelters export most output; value-added products (billets, alloys) earn higher premiums
- Benchmark: global primary aluminium smelting consumes ~13-15 MWh/t (IAI reports AC power consumption by region)

**Hint:** Work out how much power the retrofit frees, then value it two ways: as electricity sold, or as extra tonnes of metal. Then ask at what aluminium price the answer flips.

**Model structure:**
- Energy freed = production × (old − new specific consumption)
- Option A: MWh × grid price; NPV vs. USD 300 M
- Option B: extra tonnes = freed MWh ÷ new specific consumption; margin/t = realized price − non-power cost; NPV vs. USD 380 M
- Robustness: breakeven LME where NPV(B) = NPV(A)
- Second-order: market absorption of extra metal, CO₂ intensity per tonne, grid-offtake counterparty, execution risk of the amperage increase

**Model reasoning walkthrough:**
1. Energy freed = 1 Mt × (14.5 − 13.5) = **1,000,000 MWh/yr (1 TWh)**.
2. **Option A:** 1,000,000 × $40 = **$40 M/yr**. Payback 300/40 = 7.5 yrs. NPV = 40 × 8.514 − 300 ≈ **+$40.5 M**.
3. **Option B:**
   - Extra tonnes = 1,000,000/13.5 ≈ **74,074 t/yr**
   - Margin = 2,600 − 1,500 = $1,100/t, so cash flow = 74,074 × 1,100 ≈ **$81.5 M/yr**
   - Capex $380 M, payback ≈ 4.7 yrs
   - NPV = 81.5 × 8.514 − 380 ≈ **+$313.7 M**
4. Incremental B vs. A: +$41.5 M/yr for +$80 M capex, a payback of about 1.9 years on the increment.
5. Breakeven: B beats A as long as margin × 74,074 × 8.514 − 380 > 40.5, i.e., margin > **~$667/t**. That corresponds to LME ≈ 667 + 1,500 − 200 ≈ **$1,967/t**. LME has generally traded above ~$2,000/t in recent years, but has dipped near that level in downturns.
6. Second-order effects: 74 kt of additional exports is small relative to the global market (about 70 Mt/yr). Emissions per tonne fall with the retrofit, which supports low-carbon metal premiums.

**Answer:** Do the retrofit and choose Option B (produce more metal). NPV about +$314 M vs. about +$41 M for selling power. B stays better unless LME falls below about $1,970/t.

**Synthesis:** "The retrofit is worth doing, but the freed power is worth roughly twice as much turned into metal as sold to the grid, about $81 M versus $40 M a year, for only $80 M more capex. That holds unless aluminium prices fall below about $1,970 a tonne for a sustained period. I'd proceed with the amperage upgrade, and consider a partial grid-offtake contract as a hedge if the board wants downside protection."

**Frameworks used:** `energy-efficiency`, `option-comparison`, `npv`, `incremental-analysis`, `breakeven-price`, `sensitivity-analysis`, `capital-allocation`

---

### 3.1 Arithmetic verification log (script-checked)

| Case | Key check | Result |
|---|---|---|
| S1 | 7.0M×0.75×0.30×4×52 | 327.6 M cups; ×15 = SAR 4.914 bn |
| S3 | 2.64M/260; 12,960×260−2.64M; 1.8M/1.0296M | 10,153.8 h; AED 729,600; 1.75 yrs |
| S4 | 8M×(4.6×0.25+17.6×0.06) | €17.648 M |
| S5 | 120,000/0.7; 64.8e6/171,429; 486e6/171,429 | 171,429 kWh (13.0%); 378; 2,835 |
| S6 | 640 + (120+60−30) | $790 M |
| S7 | 8M×3.775 − 28.4M | +AED 1.8 M |
| S8 | 6.5×52−250; 5.1×52−250 | SAR 88 M; SAR 15.2 M |
| T1 | NPV/IRR, 25 yrs @8% | NPV SAR 2.844 M; IRR 19.4% (with degradation: 2.614 M; 18.9%) |
| T2 | 40,000 − 3,100/0.75×8 | 6,933 MWh; €1.04 M; 2.88 yrs |
| T3 | 400,000/180 ×1.1 | 2,222.2 → 2,444.4 |
| T4 | 30M×0.09368/6.935M + 0.375 | USD 0.780/m³ |
| T5 | (550×0.07823+8)/2.628M MWh; (34.164−6)/0.07095 | 1.94 ¢/kWh; USD 396.9 M |
| T6 | 12.5+15; 27.5×7.606−120 | $27.5 M; NPV $89.2 M |
| T7 | EBITDA; NPV/IRR scenarios | AED 36.98 M; naive −62.9 M/6.3%; ramp −120.1 M/5.1%; oversized −234.5 M/3.1%; levers +85.4 M/11.2%; fee+TSE +47.7 M/9.4% |
| T8 | 74,074×1,100; NPVs; breakeven | $81.5 M; +$40.5 M vs +$313.7 M; LME $1,967/t |

---

## 4. Sources

**Firm pages (official)**
- McKinsey: Interviewing at McKinsey (Problem Solving Interview + Personal Experience Interview): https://www.mckinsey.com/careers/interviewing
- BCG: Case interview preparation (candidate-led, what is assessed; Casey and written case example): https://careers.bcg.com/global/en/case-interview-preparation
- Bain: Interview prep: https://www.bain.com/careers/interview-prep/
- Strategy& Middle East: Business case prep: https://www.strategyand.pwc.com/m1/en/careers/apply/business-case-prep.html
- Strategy& report: Unlocking the potential of district cooling (GCC): https://www.strategyand.pwc.com/m1/en/reports/unlocking-the-potential-of-district-cooling.pdf

**Prep sites / guides**
- PrepLounge: Difficulty and evaluation criteria for intern vs. full-time UG vs. MBA: https://www.preplounge.com/consulting-forum/case-interview-difficultyevaluation-criteria-for-intern-vs-full-time-ug-vs-mba-23159
- PrepLounge: UG (AC/BA) vs master's (Associate) difficulty: https://www.preplounge.com/consulting-forum/how-does-case-interviews-difficulty-from-an-undergraduate-acba-differs-from-the-difficulty-from-a-masters-associate-891
- PrepLounge: Deloitte case interview guide: https://www.preplounge.com/en/blog/consulting/firms/deloitte
- PrepLounge: Roland Berger case interview guide: https://www.preplounge.com/en/blog/consulting/firms/roland-berger
- PrepLounge: Oliver Wyman guide: https://www.preplounge.com/en/blog/consulting/firms/oliver-wyman
- Hacking the Case Interview: MBA case interview: https://www.hackingthecaseinterview.com/pages/mba-case-interview
- Hacking the Case Interview: Case interview formats: https://www.hackingthecaseinterview.com/pages/case-interview-format
- Hacking the Case Interview: Kellogg casebook: https://www.hackingthecaseinterview.com/pages/kellogg-casebook
- Hacking the Case Interview: Darden casebook: https://www.hackingthecaseinterview.com/pages/darden-casebook
- Hacking the Case Interview: Strategy& case interview: https://www.hackingthecaseinterview.com/pages/pwc-strategyand-case-interview-prep
- Management Consulted: Case interview formulas: https://managementconsulted.com/case-interview-formulas/
- Management Consulted: BCG Online Case (Casey): https://managementconsulted.com/bcg-online-case/
- MyConsultingOffer: Case interview types: https://www.myconsultingoffer.org/case-study-interview-prep/types/
- MyConsultingOffer: Deloitte case interview: https://www.myconsultingoffer.org/case-study-interview-prep/deloitte-case-interview/
- MyConsultingOffer: Oliver Wyman case interview: https://www.myconsultingoffer.org/case-study-interview-prep/oliver-wyman-case-interview/
- Crafting Cases: Issue tree guide: https://www.craftingcases.com/issue-tree-guide/
- CaseInterview.com (Victor Cheng): Frameworks: https://caseinterview.com/case-interview-frameworks
- CaseInterview.com: Bain written case: https://caseinterview.com/bain-written-case-interview
- RoadToOffer: MECE principle / grading signals: https://www.roadtooffer.com/blog/mece-principle-explained
- RoadToOffer: Bain case interview guide: https://www.roadtooffer.com/blog/bain-case-interview-guide
- RoadToOffer: McKinsey Solve guide: https://www.roadtooffer.com/blog/mckinsey-solve-guide
- RoadToOffer: Free consulting casebooks: https://www.roadtooffer.com/resources/free-consulting-case-books
- IGotAnOffer: Written case interviews: https://igotanoffer.com/blogs/mckinsey-case-interview-blog/written-case-interview
- IGotAnOffer: Kearney case interview: https://igotanoffer.com/blogs/mckinsey-case-interview-blog/at-kearney-case-interview
- MConsultingPrep: Written case interview: https://mconsultingprep.com/written-case-interview
- CasesCoach: Roland Berger guide: https://casescoach.com/en/guides/roland-berger-case-interview-guide/

**Casebooks (university clubs; used for format reference only)**
- Wharton Consulting Club Casebook (2024-25, via Casebasix CDN): https://website-cdn.casebasix.com/Wharton%20Casebook%202024-2025.pdf
- Wharton Consulting Club Casebook (via CaseInterview.com): https://caseinterview.com/wp-content/uploads/2019/08/wharton.pdf
- Kellogg Consulting Club Casebook 2020: https://s3.amazonaws.com/kajabi-storefronts-production/file-uploads/sites/2148113698/themes/2155865139/downloads/4abbb3a-87f-34-d6da-ff3010421f75_MasterTheCase-Case-Interview-Casebooks-Kellogg-2020.pdf

**Benchmarks used in cases**
- Shuaibah solar record USD 0.0104/kWh (TaiyangNews): https://taiyangnews.info/markets/world-record-low-solar-bid-of-0-0104kwh-in-saudi-arabia
- Saudi solar record-low tariffs 2025 (Najran, Ad Darb, Al-Masaa): https://www.utilitybusinessmena.com/solar/saudi-arabia-signs-ppas-for-1-7gw-solar-projects-in-renewable-energy-push
- Sudair 1.5 GW solar (SAR 3.4 bn / USD 924 M): https://en.wikipedia.org/wiki/Sudair_Solar_PV_Project
- Saudi PV potential / tracker capacity factors: https://www.pvknowhow.com/solar-report/saudi-arabia/
- Rabigh 3 IWP tariff ~USD 0.55/m³ (Smart Water Magazine): https://smartwatermagazine.com/blogs/carlos-cosin/evolution-rates-desalination-part-i
- Largest Saudi desalination plants (Jubail 3A capex): https://www.blackridgeresearch.com/blog/latest-list-of-top-largest-biggest-desalination-desal-water-treatment-plants-projects-saudi-arabia-ksa-middle-east-gcc
- SWRO Jubail 3.5 kWh/m³ (ResearchGate): https://www.researchgate.net/publication/407466211_Solar-Powered_Seawater_Reverse_Osmosis_Desalination_in_Jubail_A_Comparative_Techno-Economic_Analysis_of_PV_and_CSP_Using_SAM
- Saudi desalination cost SAR 1.7/m³ (Desalination News): https://www.desalination-news.com/2025/12/12/saudi-arabia-cuts-desalination-costs-to-sar-1-7-per-cubic-meter/
- SEC / SERA consumption tariffs: https://www.se.com.sa/en/Ourservices/ColumnC/Bills-and-Consumption/ConsumptionTariffs/ and https://www.sera.gov.sa/en/consumer/electric-tariff/electric-tariff-categories/consumption-tariff
- EV charging: EVIQ 5,000 chargers by 2030 (The National): https://www.thenationalnews.com/business/economy/2023/10/09/saudi-arabia-sets-up-new-ev-infrastructure-company-and-plans-5000-chargers-by-2030/
- Saudi EV push / EVIQ (CNN): https://www.cnn.com/2025/07/03/business/saudi-arabia-electric-vehicles-eviq-hnk-spc
- Hajj 2025 pilgrims 1,673,230 (GASTAT): https://www.stats.gov.sa/en/w/news/49
- District cooling tariffs UAE (Empower AED 750/RT-yr, AED 0.568/RTh): https://utilitybilluae.com/district-cooling-cost-uae/
- Dubai RSB district cooling tariff regulation: https://rsbdubai.gov.ae/media/baufmpnp/rd10-tariffs-v14.pdf
- International Aluminium Institute: smelting power consumption: https://international-aluminium.org/statistics/primary-aluminium-smelting-power-consumption/
- Aluminum Association: energy in aluminium production: https://www.aluminum.org/policy-agenda/energy

**Case-bank caveats**
- Numbers marked "assumption" (e.g., Riyadh 2030 fleet, district cooling all-in capex per RT, bus cycle time, most per-unit costs) are illustrative and tuned for clean, consistent math. They are not market data.
- Tariffs and prices change. Re-verify SEC tariffs, IPP awards and LME prices before presenting any figure as current.
