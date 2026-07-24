/**
 * DuplicateDetector.js
 * ────────────────────
 * Near-duplicate complaint detection using TF-IDF cosine similarity.
 * When a user submits a complaint, checks existing complaints in the
 * same area for similar content to prevent duplicate submissions.
 *
 * Uses a simplified version of the main classifier's TF-IDF engine
 * to compute pairwise similarity.
 */

import { preprocessText } from './preprocessor.js';

// ────────────────────────────────────────────────────────────────────────────
// TF-IDF HELPERS (lightweight, self-contained)
// ────────────────────────────────────────────────────────────────────────────

function computeTF(tokens) {
  const tf = new Map();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  const maxFreq = Math.max(...tf.values(), 1);
  for (const [term, count] of tf) {
    tf.set(term, 0.5 + 0.5 * (count / maxFreq));
  }
  return tf;
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;

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

// ────────────────────────────────────────────────────────────────────────────
// JACCARD SIMILARITY (for short texts)
// ────────────────────────────────────────────────────────────────────────────

function jaccardSimilarity(tokensA, tokensB) {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTION
// ────────────────────────────────────────────────────────────────────────────

/**
 * Similarity threshold for considering a complaint as a near-duplicate.
 */
const SIMILARITY_THRESHOLD = 0.55;

/**
 * Maximum age of existing complaints to check (7 days in ms).
 */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * findDuplicates
 *
 * Checks a new complaint against existing complaints for near-duplicates.
 * Filters by geographic proximity (same city) and recency (last 7 days).
 *
 * @param {string} newText — the new complaint text
 * @param {Object} newLocation — { state, district, city, area }
 * @param {Array} existingComplaints — array of complaint objects from AppContext
 * @returns {{
 *   hasDuplicates: boolean,
 *   duplicates: Array<{
 *     complaint: Object,
 *     similarity: number,
 *     matchType: string
 *   }>
 * }}
 */
export function findDuplicates(newText, newLocation, existingComplaints) {
  if (!newText || !existingComplaints || existingComplaints.length === 0) {
    return { hasDuplicates: false, duplicates: [] };
  }

  const newProcessed = preprocessText(newText);
  if (newProcessed.tokens.length < 3) {
    return { hasDuplicates: false, duplicates: [] };
  }

  const newTF = computeTF(newProcessed.tokens);
  const now = Date.now();
  const newCity = (newLocation?.city || '').toLowerCase();

  const duplicates = [];

  for (const complaint of existingComplaints) {
    // Skip old complaints
    const age = now - new Date(complaint.createdAt).getTime();
    if (age > MAX_AGE_MS) continue;

    // Filter by same city (if location available)
    if (newCity) {
      const compCity = (complaint.location?.city || '').toLowerCase();
      if (compCity && compCity !== newCity) continue;
    }

    // Preprocess existing complaint
    const existingProcessed = preprocessText(complaint.text);
    if (existingProcessed.tokens.length < 3) continue;

    // Compute similarities
    const existingTF = computeTF(existingProcessed.tokens);
    const cosSim = cosineSimilarity(newTF, existingTF);
    const jacSim = jaccardSimilarity(newProcessed.tokens, existingProcessed.tokens);

    // Blend: 60% cosine + 40% jaccard
    const blendedSim = 0.6 * cosSim + 0.4 * jacSim;

    // Same category bonus: if both would classify to same category, boost similarity
    let finalSim = blendedSim;
    if (complaint.category) {
      // We'll just use the blended score — category matching would need the classifier
      finalSim = blendedSim;
    }

    if (finalSim >= SIMILARITY_THRESHOLD) {
      let matchType = 'similar';
      if (finalSim >= 0.85) matchType = 'near-exact';
      else if (finalSim >= 0.7) matchType = 'highly-similar';

      duplicates.push({
        complaint,
        similarity: parseFloat(finalSim.toFixed(3)),
        matchType,
      });
    }
  }

  // Sort by similarity descending
  duplicates.sort((a, b) => b.similarity - a.similarity);

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates: duplicates.slice(0, 3), // Return top 3 matches
  };
}

export default findDuplicates;
