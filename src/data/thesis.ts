// The master's thesis block on the home page.
// The numbers come from papers.ts; check them against the PDF before publishing.
export const thesis = {
  eyebrow: "/ master's thesis · SICK IVP × Linköping University · 2026",
  // PLACEHOLDER (handoff §7.4): Jonatan to confirm the claim sentence and the three numbers.
  claim:
    "Recovered geometry didn't beat photographs at finding scratches, but it kept working when the material changed.",
  title: 'Inverse Rendering for Industry Inspections',
  question:
    'Are surface scratches easier to find in SVBRDF maps recovered by inverse rendering than in the photographs themselves?',
  pdf: '/papers/inverse-rendering-masters-thesis.pdf',
  stats: [
    { value: '407', label: 'scratches, all found from near-field image input, which beat even ground-truth normal maps' },
    { value: '≈50%', label: "higher score for normal maps when only the material's appearance changes" },
    { value: '30 hp', label: 'Jan–Jun 2026, hosted by SICK IVP in Linköping' },
  ],
};
