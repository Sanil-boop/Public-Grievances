/**
 * router.js
 * ─────────
 * Department routing logic for classified civic complaints.
 * Maps a predicted category + confidence to the appropriate municipal
 * department, assigns a priority level, and computes an estimated
 * response time.
 *
 * Exports:
 *   routeToDepartment(category, confidence) → RoutingResult
 */

import { DEPARTMENTS, CATEGORY_MAP } from './categories.js';

// ────────────────────────────────────────────────────────────────────────────
// PRIORITY RULES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Categories that are inherently urgent regardless of confidence.
 * These involve immediate public safety or health risks.
 */
const URGENT_CATEGORIES = new Set([
  'water',
  'drainage',
  'public_health',
  'stray_animals',
]);

/**
 * Categories that are inherently high-priority.
 */
const HIGH_PRIORITY_CATEGORIES = new Set([
  'garbage',
  'streetlights',
  'noise_pollution',
]);

/**
 * Priority levels in order of severity.
 */
export const PRIORITY_LEVELS = {
  urgent: {
    label: 'Urgent',
    color: '#D32F2F',
    icon: '🔴',
    description: 'Requires immediate action within 12-24 hours',
  },
  high: {
    label: 'High',
    color: '#F57C00',
    icon: '🟠',
    description: 'Should be addressed within 24-48 hours',
  },
  normal: {
    label: 'Normal',
    color: '#1976D2',
    icon: '🔵',
    description: 'Standard processing within 3-7 days',
  },
  low: {
    label: 'Low',
    color: '#388E3C',
    icon: '🟢',
    description: 'Will be addressed in the next scheduled cycle',
  },
};

// ────────────────────────────────────────────────────────────────────────────
// PRIORITY COMPUTATION
// ────────────────────────────────────────────────────────────────────────────

/**
 * Determine the priority level based on the category and the classifier's
 * confidence score.
 *
 * Rules:
 *   1. Urgent categories with confidence ≥ 0.60 → urgent
 *   2. Urgent categories with lower confidence   → high
 *   3. High-priority categories with conf ≥ 0.70 → high
 *   4. High-priority categories with lower conf   → normal
 *   5. Everything else:
 *      - confidence ≥ 0.80 → normal
 *      - confidence < 0.80 → low
 *
 * @param {string} category
 * @param {number} confidence
 * @returns {'urgent' | 'high' | 'normal' | 'low'}
 */
function computePriority(category, confidence) {
  if (URGENT_CATEGORIES.has(category)) {
    return confidence >= 0.60 ? 'urgent' : 'high';
  }

  if (HIGH_PRIORITY_CATEGORIES.has(category)) {
    return confidence >= 0.70 ? 'high' : 'normal';
  }

  return confidence >= 0.80 ? 'normal' : 'low';
}

// ────────────────────────────────────────────────────────────────────────────
// RESPONSE TIME ESTIMATION
// ────────────────────────────────────────────────────────────────────────────

/**
 * Estimate a human-readable response time based on the department's
 * default SLA and the computed priority.
 *
 * Higher priority → shorter estimated response.
 *
 * @param {string} defaultResponseTime — e.g. "3-7 days"
 * @param {'urgent' | 'high' | 'normal' | 'low'} priority
 * @returns {string}
 */
function estimateResponseTime(defaultResponseTime, priority) {
  const responseMap = {
    urgent: {
      '12-24 hours': '6-12 hours',
      '24-48 hours': '12-24 hours',
      '3-7 days': '24-48 hours',
      '2-5 days': '12-24 hours',
      '5-15 days': '2-5 days',
      '7-15 days': '3-5 days',
      '24-72 hours': '12-24 hours',
    },
    high: {
      '12-24 hours': '12-24 hours',
      '24-48 hours': '24-48 hours',
      '3-7 days': '2-4 days',
      '2-5 days': '1-3 days',
      '5-15 days': '3-7 days',
      '7-15 days': '5-10 days',
      '24-72 hours': '24-48 hours',
    },
    normal: {},  // use default
    low: {
      '12-24 hours': '24-48 hours',
      '24-48 hours': '48-72 hours',
      '3-7 days': '5-10 days',
      '2-5 days': '3-7 days',
      '5-15 days': '7-20 days',
      '7-15 days': '10-20 days',
      '24-72 hours': '48-96 hours',
    },
  };

  const overrides = responseMap[priority];
  if (overrides && overrides[defaultResponseTime]) {
    return overrides[defaultResponseTime];
  }
  return defaultResponseTime;
}

// ────────────────────────────────────────────────────────────────────────────
// ROUTING REASON GENERATION
// ────────────────────────────────────────────────────────────────────────────

/**
 * Generate a short human-readable explanation of why this complaint was
 * routed to a particular department.
 *
 * @param {string} category
 * @param {number} confidence
 * @param {string} departmentName
 * @param {string} priority
 * @returns {string}
 */
function generateRoutingReason(category, confidence, departmentName, priority) {
  const catInfo = CATEGORY_MAP[category];
  const catName = catInfo ? catInfo.name : 'General';
  const pct = Math.round(confidence * 100);

  let reason = `Complaint classified as "${catName}" with ${pct}% confidence. `;
  reason += `Routed to ${departmentName}. `;

  if (priority === 'urgent') {
    reason += 'Marked URGENT — requires immediate attention due to public safety/health implications.';
  } else if (priority === 'high') {
    reason += 'Marked HIGH priority — should be addressed within 24-48 hours.';
  } else if (priority === 'normal') {
    reason += 'Standard priority — will be processed in the regular workflow.';
  } else {
    reason += 'Low priority — will be addressed in the next scheduled maintenance cycle.';
  }

  return reason;
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ────────────────────────────────────────────────────────────────────────────

/**
 * routeToDepartment
 *
 * Given a classified category and its confidence score, determine:
 *   • Which department handles it
 *   • What priority level it gets
 *   • Estimated response time (adjusted by priority)
 *   • Contact information
 *   • A human-readable routing reason
 *
 * @param {string} category — category ID (e.g. 'water', 'garbage')
 * @param {number} confidence — classifier confidence ∈ [0, 1]
 * @returns {{
 *   department: { name: string, contact: string, phone: string },
 *   priority: { level: string, label: string, color: string, icon: string, description: string },
 *   estimatedResponseTime: string,
 *   contactInfo: { email: string, phone: string },
 *   routingReason: string
 * }}
 */
export function routeToDepartment(category, confidence) {
  // Fall back to 'other' if category is unknown
  const dept = DEPARTMENTS[category] || DEPARTMENTS.other;
  const effectiveCategory = DEPARTMENTS[category] ? category : 'other';

  // Compute priority
  const priorityLevel = computePriority(effectiveCategory, confidence);
  const priorityInfo = PRIORITY_LEVELS[priorityLevel];

  // Estimate response time
  const estimatedTime = estimateResponseTime(dept.responseTime, priorityLevel);

  // Build routing reason
  const routingReason = generateRoutingReason(
    effectiveCategory,
    confidence,
    dept.name,
    priorityLevel
  );

  return {
    department: {
      name: dept.name,
      contact: dept.contact,
      phone: dept.phone,
    },
    priority: {
      level: priorityLevel,
      label: priorityInfo.label,
      color: priorityInfo.color,
      icon: priorityInfo.icon,
      description: priorityInfo.description,
    },
    estimatedResponseTime: estimatedTime,
    contactInfo: {
      email: dept.contact,
      phone: dept.phone,
    },
    routingReason,
  };
}

export default routeToDepartment;
