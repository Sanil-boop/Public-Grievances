import { motion } from 'framer-motion';
import { Sparkles, Building2 } from 'lucide-react';
import styles from './ClassificationResult.module.css';

const categoryIcons = {
  'Water Supply': '💧',
  'Road Maintenance': '🛣️',
  'Garbage Collection': '🗑️',
  'Street Lighting': '💡',
  'Sewage & Drainage': '🚰',
  'Public Safety': '🛡️',
  'Noise Pollution': '🔊',
  'Illegal Construction': '🏗️',
  'Public Transport': '🚌',
  'Property Tax': '💰',
  'Parks & Gardens': '🌳',
  'Health & Sanitation': '🏥',
};

function getPriorityFromConfidence(confidence) {
  if (confidence >= 0.85) return 'urgent';
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.5) return 'normal';
  return 'low';
}



export default function ClassificationResult({ result }) {
  if (!result || !result.predictions || result.predictions.length === 0) {
    return (
      <div className={styles.empty}>
        <Sparkles className={styles.emptyIcon} size={40} />
        <p className={styles.emptyText}>
          Start typing or speaking your complaint to see AI classification
          results here.
        </p>
      </div>
    );
  }

  const top3 = result.predictions.slice(0, 3);
  const topPrediction = top3[0];
  const priority = getPriorityFromConfidence(topPrediction.confidence);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Predictions */}
      <div>
        <h3 className={styles.sectionTitle}>
          <Sparkles size={16} /> Classification Results
        </h3>
        <div className={styles.predictions}>
          {top3.map((pred, idx) => (
            <motion.div
              key={pred.category}
              className={`${styles.predictionItem} ${
                idx === 0 ? styles.predictionItemTop : ''
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.35 }}
            >
              <div className={styles.predictionHeader}>
                <div className={styles.predictionLabel}>
                  <span className={styles.predictionIcon}>
                    {pred.icon || categoryIcons[pred.categoryName] || '📋'}
                  </span>
                  <span className={styles.predictionName}>{pred.categoryName || pred.category}</span>
                </div>
                <span className={styles.predictionConfidence}>
                  {(pred.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className={styles.confidenceBar}>
                <motion.div
                  className={styles.confidenceFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${pred.confidence * 100}%` }}
                  transition={{ delay: idx * 0.1 + 0.2, duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Department routing */}
      {result.department && (
        <motion.div
          className={styles.departmentCard}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
        >
          <span className={styles.departmentLabel}>
            <Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />
            Routed to Department
          </span>
          <span className={styles.departmentName}>
            {result.department?.name || result.department}
          </span>
          <span className={styles.departmentDesc}>
            This complaint will be forwarded to the appropriate municipal
            department for processing and resolution.
          </span>
        </motion.div>
      )}

      {/* Priority */}
      <motion.div
        className={styles.prioritySection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className={styles.priorityLabel}>Assessed Priority:</span>
        <span
          className={`${styles.priorityBadge} ${
            priority === 'urgent'
              ? styles.priorityUrgent
              : priority === 'high'
              ? styles.priorityHigh
              : priority === 'normal'
              ? styles.priorityNormal
              : styles.priorityLow
          }`}
        >
          {priority}
        </span>
      </motion.div>
    </motion.div>
  );
}
