// Time-of-day palettes, each a vertical gradient sky → river
// oklch-based, same chroma family

window.PALETTES = {
  dawn: {
    name: 'Amanecer',
    sky: ['oklch(0.78 0.09 60)', 'oklch(0.82 0.07 40)', 'oklch(0.86 0.05 25)'],
    river: ['oklch(0.52 0.07 230)', 'oklch(0.40 0.06 240)'],
    ink: 'oklch(0.22 0.04 40)',
    inkSoft: 'oklch(0.35 0.03 40)',
    paper: 'oklch(0.97 0.015 60)',
    accent: 'oklch(0.65 0.14 40)', // terracota
    bg: 'oklch(0.96 0.015 60)',
    card: 'oklch(0.99 0.01 60)',
    border: 'oklch(0.88 0.02 60)',
  },
  day: {
    name: 'Día',
    sky: ['oklch(0.88 0.06 230)', 'oklch(0.92 0.04 220)', 'oklch(0.96 0.02 210)'],
    river: ['oklch(0.58 0.09 220)', 'oklch(0.45 0.08 230)'],
    ink: 'oklch(0.20 0.02 230)',
    inkSoft: 'oklch(0.45 0.02 230)',
    paper: 'oklch(0.98 0.005 220)',
    accent: 'oklch(0.62 0.14 215)',
    bg: 'oklch(0.97 0.008 220)',
    card: 'oklch(1 0 0)',
    border: 'oklch(0.90 0.015 220)',
  },
  dusk: {
    name: 'Atardecer',
    sky: ['oklch(0.55 0.13 30)', 'oklch(0.65 0.11 45)', 'oklch(0.78 0.09 60)'],
    river: ['oklch(0.35 0.07 260)', 'oklch(0.25 0.06 270)'],
    ink: 'oklch(0.18 0.03 30)',
    inkSoft: 'oklch(0.38 0.03 30)',
    paper: 'oklch(0.95 0.02 40)',
    accent: 'oklch(0.58 0.16 30)',
    bg: 'oklch(0.94 0.02 40)',
    card: 'oklch(0.98 0.012 40)',
    border: 'oklch(0.85 0.025 40)',
  },
  night: {
    name: 'Noche',
    sky: ['oklch(0.22 0.06 260)', 'oklch(0.16 0.05 265)', 'oklch(0.12 0.04 270)'],
    river: ['oklch(0.18 0.04 250)', 'oklch(0.10 0.03 255)'],
    ink: 'oklch(0.95 0.01 230)',
    inkSoft: 'oklch(0.70 0.02 230)',
    paper: 'oklch(0.14 0.03 260)',
    accent: 'oklch(0.70 0.12 220)',
    bg: 'oklch(0.10 0.02 260)',
    card: 'oklch(0.16 0.025 260)',
    border: 'oklch(0.24 0.03 260)',
  },
};
