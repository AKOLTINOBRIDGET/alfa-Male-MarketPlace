// Shared staff/tailor utilities for ordering and matching skills

/**
 * Score a tailor against an order's items string.
 * Returns a higher number if their skills match order keywords.
 */
export function scoreTailorForOrder(tailor, itemsString) {
  const lower = itemsString.toLowerCase();
  return tailor.skills.reduce((score, skill) => {
    return lower.includes(skill.toLowerCase()) ? score + 1 : score;
  }, 0);
}

/**
 * Sort tailors for a given order:
 *  1. Only "Available" tailors float to top (unavailable shown dimmed but selectable)
 *  2. Among available, sort by skill match DESC, then workload (assignedReqs) ASC
 */
export function rankTailorsForOrder(tailors, itemsString) {
  return [...tailors].sort((a, b) => {
    const aAvail = a.status === 'Available' ? 0 : 1;
    const bAvail = b.status === 'Available' ? 0 : 1;
    if (aAvail !== bAvail) return aAvail - bAvail;

    const aScore = scoreTailorForOrder(a, itemsString);
    const bScore = scoreTailorForOrder(b, itemsString);
    if (bScore !== aScore) return bScore - aScore;   // higher match first

    return a.assignedReqs - b.assignedReqs;           // lower workload first
  });
}
