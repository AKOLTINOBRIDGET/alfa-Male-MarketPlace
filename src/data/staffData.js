// Shared staff/tailor data — used by both ManageStaff and ManageOrders
// skills: array of keywords that match order item types for smart filtering

export const initialStaff = [
  {
    id: 'STF-01',
    name: 'Antonio Rossi',
    role: 'Master Tailor',
    email: 'antonio@alfamale.com',
    status: 'Available',
    assignedReqs: 2,
    skills: ['Bespoke', 'Suit', 'Jacket', 'Blazer', 'Tailoring'],
  },
  {
    id: 'STF-02',
    name: 'Elena Croft',
    role: 'Senior Stylist',
    email: 'elena@alfamale.com',
    status: 'In Appointment',
    assignedReqs: 4,
    skills: ['Alteration', 'Styling', 'Watch', 'Accessory', 'Belt'],
  },
  {
    id: 'STF-03',
    name: 'Marcus Chen',
    role: 'Fitting Specialist',
    email: 'marcus@alfamale.com',
    status: 'Available',
    assignedReqs: 1,
    skills: ['Fitting', 'Alteration', 'Trousers', 'Shirt', 'Suit'],
  },
  {
    id: 'STF-04',
    name: 'Yuki Tanaka',
    role: 'Master Tailor',
    email: 'yuki@alfamale.com',
    status: 'Available',
    assignedReqs: 0,
    skills: ['Bespoke', 'Suit', 'Coat', 'Jacket', 'Trousers'],
  },
];

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
