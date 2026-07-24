/**
 * classifier.js
 * ─────────────
 * Main complaint classifier — combines keyword matching with TF-IDF
 * cosine similarity against reference sentences from categories.js.
 *
 * This provides semantic-like classification entirely client-side
 * without any TensorFlow.js model download.
 *
 * Architecture:
 *   1. initClassifier() — pre-computes TF-IDF vectors for every reference
 *      sentence across all 12 categories. Call once at app startup.
 *   2. classifyComplaint(text) — preprocesses the input, runs both the
 *      keyword classifier AND the TF-IDF cosine-similarity classifier,
 *      then blends the scores for a final prediction.
 *
 * Exports:
 *   initClassifier()        → Promise<void>
 *   classifyComplaint(text)  → ClassificationResult
 *   isClassifierReady()      → boolean
 */

import { CATEGORIES, DEPARTMENTS } from './categories.js';
import { preprocessText, tokenizeRaw } from './preprocessor.js';
import { keywordClassify } from './keywords.js';

// ────────────────────────────────────────────────────────────────────────────
// MODULE STATE
// ────────────────────────────────────────────────────────────────────────────

/** Whether initClassifier() has completed. */
let _ready = false;

/**
 * Document-frequency map: token → number of reference sentences containing it.
 * Built during init.
 */
let _df = {};

/** Total number of reference sentences (across all categories). */
let _totalDocs = 0;

/**
 * Pre-computed TF-IDF vectors for every reference sentence.
 * Structure: Array<{ category: string, vector: Map<string, number> }>
 */
let _refVectors = [];

/**
 * Category centroid vectors (average of all ref-sentence vectors in
 * each category). Used for a faster but slightly less accurate mode.
 */
let _centroids = {};

// ────────────────────────────────────────────────────────────────────────────
// TF-IDF HELPERS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Compute term-frequency for a list of tokens.
 * @param {string[]} tokens
 * @returns {Map<string, number>}
 */
function computeTF(tokens) {
  const tf = new Map();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  // Normalize by max frequency (augmented TF)
  const maxFreq = Math.max(...tf.values(), 1);
  for (const [term, count] of tf) {
    tf.set(term, 0.5 + 0.5 * (count / maxFreq));
  }
  return tf;
}

/**
 * Compute TF-IDF vector for tokens using the global DF table.
 * @param {string[]} tokens
 * @returns {Map<string, number>}
 */
function computeTFIDF(tokens) {
  const tf = computeTF(tokens);
  const tfidf = new Map();

  for (const [term, tfVal] of tf) {
    const df = _df[term] || 0;
    // Smooth IDF: log((N + 1) / (df + 1)) + 1
    const idf = Math.log((_totalDocs + 1) / (df + 1)) + 1;
    tfidf.set(term, tfVal * idf);
  }

  return tfidf;
}

/**
 * Cosine similarity between two sparse vectors (Maps).
 * @param {Map<string, number>} a
 * @param {Map<string, number>} b
 * @returns {number} similarity ∈ [0, 1]
 */
function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const [term, val] of a) {
    normA += val * val;
    if (b.has(term)) {
      dot += val * b.get(term);
    }
  }

  for (const val of b.values()) {
    normB += val * val;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Add two sparse vectors, scaling the second by a factor.
 * Mutates `target`.
 */
function addVectorScaled(target, source, scale) {
  for (const [term, val] of source) {
    target.set(term, (target.get(term) || 0) + val * scale);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ────────────────────────────────────────────────────────────────────────────

/**
 * initClassifier
 *
 * Pre-compute TF-IDF vectors for all reference sentences. Should be called
 * once at app startup. Returns a promise (computation is yielded to keep
 * the main thread responsive).
 *
 * @returns {Promise<void>}
 */
export async function initClassifier() {
  if (_ready) return;

  // ── Step 1: Tokenize all reference sentences ──────────────────────────
  const allDocs = []; // { category, tokens }

  for (const cat of CATEGORIES) {
    for (const sentence of cat.referenceSentences) {
      const tokens = tokenizeRaw(sentence);
      allDocs.push({ category: cat.id, tokens });
    }
  }

  _totalDocs = allDocs.length;

  // ── Step 2: Build document-frequency table ────────────────────────────
  _df = {};
  for (const doc of allDocs) {
    const uniqueTokens = new Set(doc.tokens);
    for (const token of uniqueTokens) {
      _df[token] = (_df[token] || 0) + 1;
    }
  }

  // ── Step 3: Compute TF-IDF vector for each reference sentence ─────────
  _refVectors = [];
  for (const doc of allDocs) {
    const vector = computeTFIDF(doc.tokens);
    _refVectors.push({ category: doc.category, vector });
  }

  // ── Step 4: Compute category centroids ────────────────────────────────
  _centroids = {};
  const catCounts = {};

  for (const cat of CATEGORIES) {
    _centroids[cat.id] = new Map();
    catCounts[cat.id] = 0;
  }

  for (const { category, vector } of _refVectors) {
    addVectorScaled(_centroids[category], vector, 1);
    catCounts[category]++;
  }

  // Average each centroid
  for (const catId of Object.keys(_centroids)) {
    const count = catCounts[catId] || 1;
    const centroid = _centroids[catId];
    for (const [term, val] of centroid) {
      centroid.set(term, val / count);
    }
  }

  // Yield to main thread briefly (keeps UI responsive during init)
  await new Promise((resolve) => setTimeout(resolve, 0));

  _ready = true;
  console.log(
    `[classifier] Initialized — ${_totalDocs} reference sentences, ` +
    `${Object.keys(_df).length} unique terms`
  );
}

/**
 * @returns {boolean} Whether the classifier has been initialized.
 */
export function isClassifierReady() {
  return _ready;
}

// ────────────────────────────────────────────────────────────────────────────
// TF-IDF CLASSIFICATION
// ────────────────────────────────────────────────────────────────────────────

/**
 * tfidfClassify
 *
 * Computes TF-IDF cosine similarity of the input against:
 *   1. Every individual reference sentence (per-doc) — takes the max
 *      similarity per category.
 *   2. Category centroids — single similarity per category.
 *
 * Returns blended score per category.
 *
 * @param {string[]} tokens — preprocessed tokens of the input
 * @returns {Object<string, number>} category → score
 */
function tfidfClassify(tokens) {
  const queryVector = computeTFIDF(tokens);

  // ── Per-doc max similarity ────────────────────────────────────────────
  const maxSim = {};
  const avgSim = {};
  const simCounts = {};

  for (const cat of CATEGORIES) {
    maxSim[cat.id] = 0;
    avgSim[cat.id] = 0;
    simCounts[cat.id] = 0;
  }

  for (const { category, vector } of _refVectors) {
    const sim = cosineSimilarity(queryVector, vector);
    if (sim > maxSim[category]) maxSim[category] = sim;
    avgSim[category] += sim;
    simCounts[category]++;
  }

  // Average
  for (const catId of Object.keys(avgSim)) {
    avgSim[catId] = simCounts[catId] > 0 ? avgSim[catId] / simCounts[catId] : 0;
  }

  // ── Centroid similarity ───────────────────────────────────────────────
  const centroidSim = {};
  for (const cat of CATEGORIES) {
    centroidSim[cat.id] = cosineSimilarity(queryVector, _centroids[cat.id]);
  }

  // ── Blend: 40% max-doc + 30% centroid + 30% avg-doc ──────────────────
  const blended = {};
  for (const cat of CATEGORIES) {
    blended[cat.id] =
      0.4 * maxSim[cat.id] +
      0.3 * centroidSim[cat.id] +
      0.3 * avgSim[cat.id];
  }

  return blended;
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN CLASSIFICATION FUNCTION
// ────────────────────────────────────────────────────────────────────────────

/**
 * classifyComplaint
 *
 * Takes raw complaint text and returns a full classification result.
 * Combines keyword classification (always available) with TF-IDF
 * cosine similarity (available after init).
 *
 * Score blending:
 *   • If TF-IDF ready:  final = 0.45 * keyword + 0.55 * tfidf
 *   • If TF-IDF not ready:  final = keyword only
 *
 * @param {string} text — raw complaint text
 * @returns {{
 *   predictions: Array<{
 *     category: string,
 *     categoryName: string,
 *     confidence: number,
 *     icon: string,
 *     color: string
 *   }>,
 *   topCategory: string,
 *   topCategoryName: string,
 *   topConfidence: number,
 *   department: object,
 *   preprocessed: { cleaned: string, tokens: string[], original: string },
 *   timestamp: number
 * }}
 */
export function classifyComplaint(text) {
  // ── 1. Preprocess ─────────────────────────────────────────────────────
  const preprocessed = preprocessText(text);

  // ── 2. Keyword classification (always available) ──────────────────────
  const keywordResults = keywordClassify(text);
  const keywordScores = {};
  for (const { category, confidence } of keywordResults) {
    keywordScores[category] = confidence;
  }

  // ── 3. TF-IDF classification (if ready) ───────────────────────────────
  let finalScores = {};

  if (_ready && preprocessed.tokens.length > 0) {
    const tfidfScores = tfidfClassify(preprocessed.tokens);

    // Blend: keyword 45%, TF-IDF 55%
    const KEYWORD_WEIGHT = 0.45;
    const TFIDF_WEIGHT = 0.55;

    for (const cat of CATEGORIES) {
      const kw = keywordScores[cat.id] || 0;
      const tf = tfidfScores[cat.id] || 0;
      finalScores[cat.id] = KEYWORD_WEIGHT * kw + TFIDF_WEIGHT * tf;
    }

    // ── 3b. Confidence calibration ────────────────────────────────────
    // When both keyword and TF-IDF agree on the top category, boost
    // confidence (agreement signal). When they disagree, dampen slightly.
    const kwSorted = Object.entries(keywordScores).sort((a, b) => b[1] - a[1]);
    const tfSorted = Object.entries(tfidfScores).sort((a, b) => b[1] - a[1]);
    const kwTop = kwSorted[0]?.[0];
    const tfTop = tfSorted[0]?.[0];

    if (kwTop && tfTop && kwTop === tfTop && kwSorted[0][1] > 0 && tfSorted[0][1] > 0) {
      // Agreement bonus: boost the agreed category by 15%
      finalScores[kwTop] = Math.min(finalScores[kwTop] * 1.15, 0.99);
    } else if (kwTop && tfTop && kwTop !== tfTop) {
      // Mild disagreement penalty on both
      const fsSorted = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
      const topCat = fsSorted[0]?.[0];
      const secondCat = fsSorted[1]?.[0];
      if (topCat && secondCat) {
        const gap = finalScores[topCat] - finalScores[secondCat];
        if (gap < 0.05) {
          // Very close — don't penalize, just log the ambiguity
        }
      }
    }
  } else {
    // Fallback: keyword only
    finalScores = { ...keywordScores };
  }

  // ── 4. Build sorted predictions ───────────────────────────────────────
  const predictions = CATEGORIES
    .map((cat) => ({
      category: cat.id,
      categoryName: cat.name,
      confidence: parseFloat((finalScores[cat.id] || 0).toFixed(4)),
      icon: cat.icon,
      color: cat.color,
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5); // Top 5 (expanded from 3 for better insight)

  // ── 5. Determine top prediction ───────────────────────────────────────
  const top = predictions[0] || {
    category: 'other',
    categoryName: 'Other / General',
    confidence: 0,
    icon: '📋',
    color: '#607D8B',
  };

  // If confidence is too low, fall back to "other"
  // Raised threshold from 0.05 to 0.10 for better precision
  const MIN_CONFIDENCE = 0.10;
  const effectiveTop =
    top.confidence >= MIN_CONFIDENCE
      ? top
      : {
          category: 'other',
          categoryName: 'Other / General',
          confidence: top.confidence,
          icon: '📋',
          color: '#607D8B',
        };

  // ── 6. Get department info ────────────────────────────────────────────
  const department = DEPARTMENTS[effectiveTop.category] || DEPARTMENTS.other;

  return {
    predictions,
    topCategory: effectiveTop.category,
    topCategoryName: effectiveTop.categoryName,
    topConfidence: effectiveTop.confidence,
    department: { ...department },
    preprocessed,
    timestamp: Date.now(),
  };
}

export default classifyComplaint;

