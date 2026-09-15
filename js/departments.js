// Client-side department metadata. Ids match api/_lib/personas.js.
// Ring order is chosen so neighbours stay distinguishable under colour-vision
// deficiency (validated: adjacent CVD ΔE ≥ 7.4, normal-vision ΔE ≥ 19.8 on #262B45).
// Names and icons always accompany the colour, so identity is never colour-alone.

export const DEPTS = [
  { id: 'finance', name: 'Finance', label: 'Finance', sub: 'fp&a · treasury · tax', color: '#B08A1A',
    icon: '<circle cx="12" cy="12" r="8"/><path d="M9 15l6-6"/><circle cx="9.3" cy="9.3" r="1"/><circle cx="14.7" cy="14.7" r="1"/>',
    agents: [
      { name: 'FP&A', watches: 'Builds the base and downside cases, and the tornado' },
      { name: 'Treasury', watches: 'Funding, leverage, covenant headroom, FX' },
      { name: 'Tax', watches: 'Zakat vs corporate tax, depreciation, incentives' },
      { name: 'Capital allocation', watches: 'What else this money could fund' },
    ] },
  { id: 'strategy', name: 'Strategy & Corp Dev', label: 'Strategy', sub: 'corp dev · m&a · portfolio', color: '#5A8BE8',
    icon: '<circle cx="12" cy="12" r="8"/><path d="M15 9l-2 4.5L8.5 15.5l2-4.5z"/>',
    agents: [
      { name: 'Corporate development', watches: 'Build, borrow or buy, and deal structure' },
      { name: 'Market intelligence', watches: 'Competitor moves and the closing window' },
      { name: 'Portfolio', watches: 'Fit with the rest of the business' },
      { name: 'Real options', watches: 'What this unlocks or forecloses' },
    ] },
  { id: 'legal', name: 'Legal & Risk', label: 'Legal', sub: 'risk · compliance · contracts', color: '#E0634C',
    icon: '<path d="M12 4v16M8 20h8M5 7.5h14M5 7.5L2.8 12.5a2.4 2.4 0 0 0 4.4 0L5 7.5zM19 7.5l-2.2 5a2.4 2.4 0 0 0 4.4 0L19 7.5z"/>',
    agents: [
      { name: 'Contracts', watches: 'Liability caps, indemnities, carve-outs' },
      { name: 'Regulatory', watches: 'Licences, approvals, conditions precedent' },
      { name: 'Compliance', watches: 'Sanctions, anti-bribery, counterparty screening' },
      { name: 'Data protection', watches: 'Personal data and cross-border transfers' },
    ] },
  { id: 'operations', name: 'Operations & Engineering', label: 'Operations', sub: 'engineering · projects · hse', color: '#2A9DAD',
    icon: '<circle cx="12" cy="12" r="3.3"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9L18 18M6 18l2.1-2.1M15.9 8.1L18 6"/>',
    agents: [
      { name: 'Projects', watches: 'FEL stage, estimate class, critical path' },
      { name: 'Plant operations', watches: 'Tie-ins, turnarounds, availability' },
      { name: 'HSE', watches: 'Process safety, permits, heat stress' },
      { name: 'Supply chain', watches: 'Long-lead items and single-source risk' },
    ] },
  { id: 'marketing', name: 'Marketing & Sales', label: 'Marketing', sub: 'accounts · pricing · brand', color: '#A274E6',
    icon: '<path d="M4 17l5-5 3 3 7-7"/><path d="M14.5 8H19v4.5"/>',
    agents: [
      { name: 'Key accounts', watches: 'What named customers actually asked for' },
      { name: 'Pricing', watches: 'Willingness to pay and competitor response' },
      { name: 'Brand', watches: 'Claims we can defend, and reputation' },
      { name: 'Pipeline', watches: 'Time to first revenue and coverage' },
    ] },
  { id: 'esg', name: 'Sustainability & ESG', label: 'Sustainability', sub: 'carbon · water · disclosure', color: '#389F62',
    icon: '<path d="M5.5 18.5C5.5 11 10 6 18.5 5.5 18 14 13 18.5 5.5 18.5z"/><path d="M5.5 18.5l6.5-6.5"/>',
    agents: [
      { name: 'Carbon & energy', watches: 'Scope 1, 2 and 3, and carbon lock-in' },
      { name: 'Water & waste', watches: 'Water intensity and circularity' },
      { name: 'Social', watches: 'Worker welfare and community impact' },
      { name: 'Disclosure', watches: 'IFRS S2 reporting and greenwashing risk' },
    ] },
  { id: 'hr', name: 'HR & Talent', label: 'Talent', sub: 'people · localization · change', color: '#D8649F',
    icon: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M15.5 6a2.6 2.6 0 0 1 0 5.1M17 14.2a4.6 4.6 0 0 1 3.5 4.8"/>',
    agents: [
      { name: 'Talent acquisition', watches: 'Time-to-fill and wage pressure' },
      { name: 'Localization', watches: 'Nitaqat band and Emiratisation targets' },
      { name: 'Change & OD', watches: 'Change load and the ADKAR barrier point' },
      { name: 'Reward', watches: 'Retention of the people who hold the value' },
    ] },
];

export const byId = Object.fromEntries(DEPTS.map(d => [d.id, d]));
export const idByName = name => {
  const n = String(name || '').toLowerCase();
  const hit = DEPTS.find(d => n === d.name.toLowerCase() || n.includes(d.label.toLowerCase()) || n.includes(d.id));
  if (hit) return hit.id;
  if (/hr|human|people/.test(n)) return 'hr';
  if (/sales|commercial/.test(n)) return 'marketing';
  if (/engineer|operat|hse/.test(n)) return 'operations';
  if (/risk|complian/.test(n)) return 'legal';
  if (/sustain|climate/.test(n)) return 'esg';
  if (/corp/.test(n)) return 'strategy';
  return null;
};

export const iconSvg = (d, size = 18) =>
  `<svg class="dept-icon" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" fill="none" stroke="${d.color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d.icon}</svg>`;

// Culture presets: how much each function sways the Brain.
export const CULTURES = [
  { id: 'balanced', name: 'Balanced', w: { finance: 1, strategy: 1, legal: 1, operations: 1, marketing: 1, esg: 1, hr: 1 } },
  { id: 'finance', name: 'Finance-driven', w: { finance: 2, strategy: 1, legal: 1.2, operations: 1, marketing: 0.7, esg: 0.5, hr: 0.6 } },
  { id: 'engineering', name: 'Engineering-driven', w: { finance: 1.2, strategy: 0.8, legal: 1, operations: 2, marketing: 0.6, esg: 0.8, hr: 0.8 } },
  { id: 'sustainability', name: 'Sustainability-first', w: { finance: 0.9, strategy: 1, legal: 1.1, operations: 1, marketing: 0.8, esg: 2, hr: 1 } },
  { id: 'growth', name: 'Growth-led', w: { finance: 0.8, strategy: 1.6, legal: 0.7, operations: 0.8, marketing: 2, esg: 0.6, hr: 0.7 } },
];
