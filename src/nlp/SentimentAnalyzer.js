/**
 * SentimentAnalyzer.js
 * ────────────────────
 * Detects emotional tone from civic complaint text.
 * Uses weighted keyword dictionaries (English + Hindi) to classify
 * sentiment into: panic, angry, frustrated, distressed, or calm.
 *
 * Returns a structured result with score, emoji, color, and
 * a critical flag for emergency-level panic complaints.
 */

// ────────────────────────────────────────────────────────────────────────────
// SENTIMENT KEYWORD DICTIONARIES
// Each category maps keywords/phrases to a weight.
// Higher weight = stronger signal for that sentiment.
// ────────────────────────────────────────────────────────────────────────────

const SENTIMENT_KEYWORDS = {
  panic: {
    weight: 5,
    words: [
      'help', 'bachao', 'emergency', 'dying', 'save', 'jaan',
      'collapse', 'trapped', 'drowning', 'fire', 'aag', 'flood',
      'explosion', 'life threatening', 'life-threatening', 'electrocution',
    ],
  },
  angry: {
    weight: 3,
    words: [
      'worst', 'bakwaas', 'useless', 'incompetent', 'corrupt', 'fraud',
      'dhokha', 'beimaan', 'scam', 'cheat', 'loot', 'waste',
      'pathetic', 'disgusting', 'shameful',
    ],
  },
  frustrated: {
    weight: 2,
    words: [
      'again', 'phir se', 'still', 'abhi tak', 'no response', 'ignored',
      'baar baar', 'repeated', 'weeks', 'months', 'mahino', 'hafton',
      'complaint before', 'koi sunwai nahi', 'nothing done',
    ],
  },
  distressed: {
    weight: 2,
    words: [
      'please', 'kripya', 'request', 'helpless', 'suffering', 'pareshaan',
      'dukhi', 'worried', 'scared', 'dar', 'unable', 'majboor',
      'children sick', 'bachche bimar', 'old parents',
    ],
  },
};

// ────────────────────────────────────────────────────────────────────────────
// SENTIMENT METADATA
// ────────────────────────────────────────────────────────────────────────────

const SENTIMENT_META = {
  panic:      { emoji: '🚨', label: 'Panic / Emergency', color: '#ff4757' },
  angry:      { emoji: '😡', label: 'Angry',             color: '#e17055' },
  frustrated: { emoji: '😤', label: 'Frustrated',        color: '#fdcb6e' },
  distressed: { emoji: '😟', label: 'Distressed',        color: '#74b9ff' },
  calm:       { emoji: '😌', label: 'Calm',              color: '#00b894' },
};

// ────────────────────────────────────────────────────────────────────────────
// CORE ANALYSIS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Analyze the emotional sentiment of a complaint text.
 *
 * @param {string} text – The raw complaint string.
 * @returns {{
 *   sentiment: 'panic'|'angry'|'frustrated'|'distressed'|'calm',
 *   score: number,
 *   emoji: string,
 *   label: string,
 *   matchedWords: string[],
 *   isCritical: boolean,
 *   color: string
 * }}
 */
export function analyzeSentiment(text) {
  if (!text || typeof text !== 'string') {
    return buildResult('calm', 0, []);
  }

  const normalized = text.toLowerCase().trim();

  // Accumulate weighted hits per category
  const scores = {};
  const matched = {};

  for (const [category, { weight, words }] of Object.entries(SENTIMENT_KEYWORDS)) {
    scores[category] = 0;
    matched[category] = [];

    for (const keyword of words) {
      if (normalized.includes(keyword)) {
        scores[category] += weight;
        matched[category].push(keyword);
      }
    }
  }

  // Determine the dominant sentiment (highest weighted score)
  let dominant = 'calm';
  let maxScore = 0;

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      dominant = category;
    }
  }

  // Normalize score to 0-1 range.
  // Max reasonable score = weight × word-count for the category.
  const { weight, words } = SENTIMENT_KEYWORDS[dominant] || { weight: 1, words: [] };
  const maxPossible = weight * words.length;
  const normalizedScore = maxPossible > 0
    ? Math.min(maxScore / maxPossible, 1)
    : 0;

  // Apply a minimum threshold — below this, default to calm
  const THRESHOLD = 0.05;
  if (normalizedScore < THRESHOLD) {
    return buildResult('calm', 0, []);
  }

  return buildResult(dominant, normalizedScore, matched[dominant] || []);
}

/**
 * Build the final result object.
 */
function buildResult(sentiment, score, matchedWords) {
  const meta = SENTIMENT_META[sentiment];
  const roundedScore = Math.round(score * 100) / 100;

  return {
    sentiment,
    score: roundedScore,
    emoji: meta.emoji,
    label: meta.label,
    matchedWords,
    isCritical: sentiment === 'panic' && roundedScore >= 0.7,
    color: meta.color,
  };
}
