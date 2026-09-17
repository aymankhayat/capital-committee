# Case study: Capital Committee

**Ayman Khayat** · [LinkedIn](https://www.linkedin.com/in/ayman-khayat-350b4b335) · [Source](https://github.com/aymankhayat/capital-committee)

## Brief

Build one tool that bridges capital-project decisions with the analysis consultants use: a simulated investment committee that argues a decision from seven functional points of view, an engineering-economics calculator grounded in real Gulf figures, and case-interview practice calibrated against public casebooks. No invented numbers, and no API key in the browser.

## Outcome at a glance

| Metric | Value |
|---|---|
| Agents | 7 department personas + 1 Company Brain (8 Claude calls per committee) |
| Serverless functions | 4 (`department`, `brain`, `coach`, `health`) |
| Case bank | 16 original cases (8 strategy, 8 technical), 12 set in the Gulf, 10 framework notes |
| Calculator | 4 sourced presets, up to 8 tornado drivers, NPV / IRR / MIRR / payback / PI / LCOE |
| Research | 3 dossiers in `docs/research` (about 180 KB) |
| Verification | 5/5 finance-engine tests; colour palette checked with a CVD validator |
| Front end | about 4,300 lines of HTML, CSS and JavaScript (excluding generated case data), no build step |
| Cost per committee | about $0.41 on Opus 5, **estimated** from token budgets, not yet measured on a live run |

---

## Challenge 1: seven departments without eight waits

**Problem.** A committee needs seven independent opinions and then one ruling. Running them in sequence would multiply latency by eight, and a single long serverless function would risk the platform timeout.

**Approach.**
- Each department is its own `POST /api/department`, fired from the browser at once, so each runs in its own serverless invocation and its card appears as soon as it finishes.
- `POST /api/brain` runs only after all seven requests settle. It receives the verdicts, the culture weights, a veto list and a precomputed weighted score.
- The weighted lean (support +1, conditional +0.35, oppose −1, times confidence and weight) is plain arithmetic in `js/score.js`. Models are unreliable at weighted sums across seven inputs, so the Brain writes the judgement and the code does the maths.
- A Legal red line, or a high-severity Legal or Operations flag, caps the lean below a plain "go", mirroring the RAPID "Agree" role.

**Result.** A committee is two waits, not eight in a row. Moving a culture slider updates the lean instantly for free; re-convening only the Brain is a single extra call.

## Challenge 2: a colour-coded ring that colour-blind users can read

**Problem.** Seven departments share one ring, and each needs a stable colour across the map, the cards and the sliders. The first palette put blue Strategy next to violet Marketing.

**Approach.** Ran every candidate palette through a colour validator on the real background (lightness band, chroma floor, contrast, and colour-vision-deficiency separation between neighbours), then reordered the ring rather than inventing new hues.

**Result.** The worst neighbouring pair under deuteranopia went from **ΔE 3.3 to 7.4**, and the worst normal-vision pair from 8.2 to 19.8. The remaining pair sits in the band that is only acceptable with secondary encoding, so every hub, card and slider also carries the department's name and icon.

## Challenge 3: a 3D committee that fails loudly and clicks reliably

**Problem.** Three separate bugs showed up while building the three.js scene:
1. A leftover constant threw a `ReferenceError` on load. The fallback caught it and swapped in the flat SVG map, so the hero went black with no visible error.
2. At full zoom-out a department hub is only about 20 px wide on screen, so real clicks missed it.
3. The hero was `100svh` tall but started below a sticky header, so its bottom 145 px (at a narrow width) fell off-screen, hiding three departments behind the prompt bar.

**Approach.**
- The fallback now logs why it fired, and interactions are verified by dispatching pointer events at real CSS coordinates instead of guessing from scaled screenshots.
- Each hub got an invisible 1.6-unit pick sphere, so hovering and clicking are forgiving.
- The camera distance is computed from the panel's height **and** width, so the whole ring fits on a phone.
- The render loop pauses whenever the scene is off-screen or the tab is hidden.

**Result.** Hover fly-in, click-to-agents (4 agents per department) and Escape-to-close were verified in the browser, and a replayed committee updates all seven hubs and the Brain's decision stamp.

## Challenge 4: numbers you can check

**Problem.** A calculator on a portfolio site is only credible if its outputs match an independent calculation.

**Approach.** Preset inputs come from the research dossiers (Damodaran country risk premiums, SERA tariff reports via secondary sources, IRENA and Lazard costs). The engine is tested against the research's own sanity cases.

**Result.** The solar preset reproduces the research case: **NPV +$1.71M at 8%, IRR 11.2%**, and the waste-heat preset returns NPV +$1.88M and IRR 12.6%. Writing the tests also exposed my own mistake: I had expected a textbook IRR of 10.65%, but NPV at 10% is already −$21, so the correct IRR is **8.9%**. The engine was right; the expectation was fixed.

---

## Decisions worth discussing in an interview

- **Why personas keep their biases.** Finance underweights option value and Strategy overweights it. Correcting bias is the Brain's job, as in a real committee. Neutral personas converge on the same bland answer.
- **Why arithmetic lives in code.** The lean is deterministic and instant, so sliders cost nothing; the model is used only where judgement matters.
- **Why the ring is reordered, not recoloured.** Department colours are identity. Changing them per screen would break recognition, so accessibility had to come from order and labels.
- **Honest limits.**
  - The live Claude path has not been exercised end to end yet, because no API key was available during the build.
  - The per-run cost is an estimate.
  - Some Gulf tariffs come from secondary sources and are flagged as such.
  - The boardroom concept image garbles small on-screen text, so it is shown at a size where that text is not legible and is labelled as AI.

## Tools

Claude API (Opus 5, Sonnet 5, structured outputs, adaptive thinking) · Vercel serverless functions · three.js (r170) · vanilla ES modules · Node test runner · headless Edge (screenshots and OG card) · Higgsfield (two concept images made from real renders)
