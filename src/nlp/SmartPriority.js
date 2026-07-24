/**
 * SmartPriority.js
 * ────────────────
 * AI-powered smart priority assignment for civic complaints.
 * Analyzes complaint text for urgency indicators and automatically
 * suggests a priority level (urgent/high/normal/low).
 *
 * Goes beyond the department's default priority by detecting
 * emergency language, danger words, and time-sensitive phrases.
 */

// ────────────────────────────────────────────────────────────────────────────
// URGENCY INDICATOR DICTIONARIES
// Each word/phrase has a score from 1 (mild urgency) to 5 (critical)
// ────────────────────────────────────────────────────────────────────────────

const URGENCY_INDICATORS = {
  // Critical / Life-threatening (score: 5-8)
  'emergency': 5, 'life threatening': 5, 'life-threatening': 5,
  'death': 5, 'maut': 5, 'died': 5, 'mar gaya': 5, 'fatal': 5,
  'collapse': 5, 'collapsed': 5, 'gir gaya': 5,
  'electrocution': 5, 'karent laga': 5, 'current laga': 5,
  'drowning': 5, 'doob raha': 5, 'flood': 4,
  'fire': 5, 'aag': 5, 'aag lagi': 5,
  'trapped': 5, 'phas gaya': 5, 'buried': 5,
  'explosion': 5, 'blast': 5, 'dhamaka': 5,
  'accident': 8, 'hadsa': 8, 'durghatna': 8, // Elevated to 8 to instantly trigger Urgent

  // Danger / Immediate risk (score: 4)
  'danger': 4, 'dangerous': 4, 'khatarnak': 4, 'khatra': 4,
  'injured': 4, 'ghayal': 4, 'zakhmi': 4,
  'ambulance': 4, 'hospital': 3, 'aspatal': 3,
  'attack': 4, 'hamla': 4, 'bite': 4, 'kaata': 4,
  'sinkhole': 4, 'cave in': 4, 'caved': 4,
  'toxic': 4, 'zehreela': 4, 'poisonous': 4,
  'electric shock': 4, 'exposed wire': 4, 'live wire': 4,

  // Urgent / Time-sensitive (score: 3)
  'urgent': 3, 'urgently': 3, 'turant': 3, 'jaldi': 3, 'foran': 3,
  'immediately': 3, 'right now': 3, 'abhi': 3,
  'critical': 3, 'severe': 3, 'serious': 3, 'gambhir': 3,
  'epidemic': 3, 'outbreak': 3, 'failna': 3,
  'contaminated': 3, 'poisoned': 3,
  'children': 3, 'bachche': 3, 'kids': 3, 'school': 2,
  'elderly': 3, 'senior citizen': 3, 'buzurg': 3,
  'pregnant': 3, 'garbhvati': 3,
  'disabled': 3, 'viklang': 3,
  'night': 2, 'raat': 2, 'dark': 2, 'andhera': 2,

  // Moderate urgency (score: 2)
  'broken': 2, 'tuta': 2, 'toota': 2,
  'blocked': 2, 'band': 2, 'choked': 2,
  'overflow': 2, 'overflowing': 2,
  'leaking': 2, 'leak': 2,
  'not working': 2, 'kaam nahi': 2,
  'since days': 2, 'kai dino se': 2, 'hafton se': 2,
  'since weeks': 2, 'mahino se': 2, 'months': 2,
  'repeated': 2, 'baar baar': 2,
  'no response': 2, 'koi jawab nahi': 2,

  // Mild urgency (score: 1)
  'request': 1, 'please': 1, 'kripya': 1,
  'need': 1, 'chahiye': 1, 'zaroorat': 1,
  'problem': 1, 'issue': 1, 'samasya': 1,
};

// ────────────────────────────────────────────────────────────────────────────
// PRIORITY THRESHOLDS
// ────────────────────────────────────────────────────────────────────────────

const PRIORITY_THRESHOLDS = {
  urgent: 8,   // Total urgency score >= 8 → Urgent
  high: 5,     // >= 5 → High
  normal: 2,   // >= 2 → Normal
  // Below 2 → Low
};

// ────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTION
// ────────────────────────────────────────────────────────────────────────────

/**
 * analyzePriority
 *
 * Analyzes complaint text for urgency indicators and returns
 * a suggested priority with confidence and matched indicators.
 *
 * @param {string} text — raw complaint text
 * @param {string} defaultPriority — the department's default priority
 * @returns {{
 *   suggestedPriority: string,
 *   urgencyScore: number,
 *   matchedIndicators: string[],
 *   upgraded: boolean,
 *   reason: string
 * }}
 */
export function analyzePriority(text, defaultPriority = 'normal') {
  if (!text || typeof text !== 'string') {
    return {
      suggestedPriority: defaultPriority,
      urgencyScore: 0,
      matchedIndicators: [],
      upgraded: false,
      reason: 'No text to analyze',
    };
  }

  const lowerText = text.toLowerCase();
  let totalScore = 0;
  const matchedIndicators = [];

  // Check each urgency indicator
  for (const [indicator, score] of Object.entries(URGENCY_INDICATORS)) {
    if (lowerText.includes(indicator)) {
      totalScore += score;
      matchedIndicators.push(indicator);
    }
  }

  // Boost: multiple danger signals compound
  if (matchedIndicators.length >= 4) {
    totalScore = Math.round(totalScore * 1.2);
  }

  // Determine suggested priority
  let suggestedPriority;
  if (totalScore >= PRIORITY_THRESHOLDS.urgent) {
    suggestedPriority = 'Urgent';
  } else if (totalScore >= PRIORITY_THRESHOLDS.high) {
    suggestedPriority = 'High';
  } else if (totalScore >= PRIORITY_THRESHOLDS.normal) {
    suggestedPriority = 'Normal';
  } else {
    suggestedPriority = 'Low';
  }

  // Check if we're upgrading from the department default
  const priorityRank = { urgent: 4, high: 3, normal: 2, low: 1 };
  const suggestedRank = priorityRank[suggestedPriority.toLowerCase()] || 2;
  const defaultRank = priorityRank[defaultPriority.toLowerCase()] || 2;
  const upgraded = suggestedRank > defaultRank;

  // Build reason
  let reason = '';
  if (upgraded) {
    reason = `Priority upgraded from ${defaultPriority} to ${suggestedPriority} — detected: ${matchedIndicators.slice(0, 3).join(', ')}`;
  } else if (matchedIndicators.length > 0) {
    reason = `Priority confirmed as ${suggestedPriority} — detected: ${matchedIndicators.slice(0, 3).join(', ')}`;
  } else {
    reason = `Using department default priority: ${defaultPriority}`;
    suggestedPriority = defaultPriority.charAt(0).toUpperCase() + defaultPriority.slice(1);
  }

  return {
    suggestedPriority,
    urgencyScore: totalScore,
    matchedIndicators,
    upgraded,
    reason,
  };
}

export default analyzePriority;
