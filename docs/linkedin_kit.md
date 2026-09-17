# LinkedIn & CV kit: Capital Committee

Copy-ready text for your profile, a launch post and your CV. Nothing here is posted for you. You post it.
Voice: technical deep-dive, no emoji. Every block went through a humanizing pass: no em dashes, no AI-slop vocabulary, no stock structures. The scores come from local heuristics modelled on common AI-writing signals (sentence rhythm, specificity, slop words, typographic fingerprints, voice). They are **not** an AI detector and can't predict what GPTZero or similar tools will say.

Live site: https://aymankhayat.github.io/capital-committee/
Repo: https://github.com/aymankhayat/capital-committee
Case study: https://github.com/aymankhayat/capital-committee/blob/main/CASE_STUDY.md

**One honesty rule for all of this:** the two sample committees on the site were written for the demo. Don't describe them as what the AI concluded. The stories below are real engineering from the build.

---

## 1. Launch post

**Hooks considered**
1. #10 The Receipt / bug story: "I built an investment committee out of 8 AI calls. The bug that took longest had nothing to do with the AI." *(shipping this one: it names the project, the number is real, and the payoff is a testing lesson engineers and product people recognise)*
2. #3 Mistake Confession: "My unit test was wrong. The NPV engine was right." (the 8.9% vs 10.65% IRR expectation)
3. #10 The Receipt: "ΔE 3.3. That's how close two of my department colours were for colour-blind users."

**Attach:** `assets/og-card.png` or a 15-second screen recording of hovering and clicking a department. Upload natively.

```
I built an investment committee out of 8 AI calls. The bug that took longest had nothing to do with the AI.

Capital Committee puts a capital decision in front of 7 departments. Finance, Legal, ESG and 4 others each run as their own Claude call, with their own persona and blind spots. All 7 run in parallel, and a Company Brain rules once they've reported.

The committee lives in a three.js scene. Hover a department and the camera flies toward it. Click it and you meet its 4 specialist agents.

My interaction tests passed. Then I drove a real mouse through it, and 2 of 3 departments wouldn't open.

Hovering moved the camera. The hub, about 20 px wide at full zoom-out, slid out from under a still cursor, so the click hit empty space. Finance sits straight below the Brain and barely moved. Legal and Marketing drifted sideways.

My tests fired each click instantly at perfect coordinates. You don't click that fast.

The fix: keep the department selected until the pointer moves 40 px from where the hover began.

A test that clicks faster than a person only proves the code works for a robot.

How do you test interactions where timing matters as much as the target?

#EngineeringEconomics #AI #ProductDesign
```

**First comment (post it yourself right after publishing; links in the body get suppressed):**
```
Try it in the browser (demo mode, no key needed): https://aymankhayat.github.io/capital-committee/
Code and the full case study: https://github.com/aymankhayat/capital-committee
```

```
POST READY
hook: #10 The Receipt (bug story)
length: 1,218 characters
local humanizer checks: 76/100 PASS (burstiness 89, specificity 70, slop 100, fingerprint 100, voice 64)
```

### Follow-up posts (one a week; drafted on request)

| Week | Hook | Angle |
|---|---|---|
| 2 | #3 Mistake Confession: "My unit test was wrong. The NPV engine was right." | Expected a 10.65% IRR; NPV at 10% was already −$21, so it's 8.9%. Why you test finance code against an independent case. |
| 3 | #10 The Receipt: "ΔE 3.3. That's how close two department colours were under deuteranopia." | Reordering the ring instead of recolouring it, and why colour-coded identity needs names as a backup. |
| 4 | #18 The Unpopular Rule: "I don't let the model do the committee's arithmetic." | The weighted lean is code; the model writes judgement. Sliders cost nothing, re-convening costs one call. |

## 2. LinkedIn profile

### Projects section
**Name:** Capital Committee: an AI investment committee · **Date:** Sep 2026 · **URL:** the live site

```
A simulated investment committee for capital decisions. You describe a decision and 7 AI departments argue it from their own side: Finance from the hurdle rate, Legal from exposure, Operations from estimate maturity. A Company Brain then rules, names the one trade-off it hinges on and sets conditions with owners.

I wanted one place where engineering economics meets the way consultants structure a decision. Here's what I built:
- 8 Claude calls per committee: 7 departments in parallel, then the Brain, through a serverless proxy so your API key never reaches the browser
- An NPV, IRR and tornado calculator with 4 Gulf presets; its engine passes 5 of 5 tests against my research figures
- 16 original consulting cases, 12 set in the Gulf, with exhibits you request one at a time and model issue trees
- A three.js committee map where you fly into any department and meet its 4 specialist agents

It's live in demo mode, and every default I used traces back to research notes in the repo.
```
*Local humanizer checks: 75/100 PASS (burstiness 72, specificity 76, slop 100, fingerprint 100, voice 64).*

### Featured section (in this order)
1. **Link:** the live site (the share card shows automatically)
2. **Post:** your launch post, once it's live
3. **Link:** `CASE_STUDY.md` on GitHub, titled "Capital Committee case study"
4. **Link:** the GitHub repo

### Skills to add (pin the top 3 for the role you're applying to)
Financial Modeling · Engineering Economics · NPV / IRR Analysis · Sensitivity Analysis · Case Interviews · Market Sizing · LLM Application Development · Multi-Agent Systems · Claude API · JavaScript · three.js · Data Visualization

## 3. CV bullets (pick the block for the job)

*CV bullets drop "I" by convention, so the local "voice" heuristic scores them low (40). That's expected for this format; they pass the slop, fingerprint and specificity checks.*

**Strategy consulting**
- Built a simulated investment committee in which 7 AI departments argue a capital decision from their own functional biases and an executive layer resolves the conflicts into conditions, owners and kill criteria.
- Wrote 16 original consulting cases (market sizing, profitability, M&A, market entry) calibrated against public casebooks, with model issue trees and partner-style syntheses.

**Engineering consulting and energy**
- Built an engineering-economics calculator (NPV, IRR, MIRR, payback, LCOE, tornado sensitivity) with Gulf presets for rooftop solar, waste-heat-to-power and desalination energy recovery; engine verified against research sanity cases (solar NPV $1.71M at 8%, IRR 11.2%).
- Sourced every default from cost-of-capital, tariff and cost research, including Damodaran country risk premiums and SERA industrial tariffs.

**AI and product engineering**
- Designed a multi-agent Claude pipeline: 7 department calls in parallel through serverless functions, then a synthesis call, with schema-validated JSON output and the weighted scoring kept in deterministic code.
- Shipped a three.js interface with hover fly-in and click-to-inspect; real-mouse testing showed the camera moved hubs out from under the cursor, and I fixed the selection logic.

**Student / internship (one line)**
- Built and deployed Capital Committee, an AI investment-committee simulator with an NPV/IRR calculator and 16 consulting cases (aymankhayat.github.io/capital-committee).

## 4. Interview prep
Use [CASE_STUDY.md](../CASE_STUDY.md). Know these four stories cold: parallel orchestration and deterministic scoring, the colour-blind palette, the hover fly-in click bug, and the IRR test that caught your own mistake. For "what would you change?": the live AI path hasn't been run end to end yet, and the per-run cost is an estimate until it is.

## Posting notes
- Links go in the first comment, never the post body.
- After the site's share image changes, refresh LinkedIn's cache at https://www.linkedin.com/post-inspector/ (paste the site URL).
- Reply to real comments within the first hour, and answer questions in the reply itself, not in DMs.
