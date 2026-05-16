export const POINTS = {
  base: { daily: 10, weekly: 25, monthly: 50 },
  evidenceBonus: { daily: 5, weekly: 10, monthly: 20 },
  submitBonus: { daily: 25, weekly: 50, monthly: 100 },
};

export function pointsFor(period, { evidenceRequired = false, hasEvidence = false } = {}) {
  const base = POINTS.base[period] ?? 0;
  const bonus = evidenceRequired && hasEvidence ? POINTS.evidenceBonus[period] ?? 0 : 0;
  return base + bonus;
}
