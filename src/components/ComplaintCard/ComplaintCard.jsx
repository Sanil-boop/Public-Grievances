import { motion } from 'framer-motion';
import { Building2, Share2, MapPin } from 'lucide-react';
import BeforeAfterSlider from '../BeforeAfterSlider/BeforeAfterSlider';
import styles from './ComplaintCard.module.css';

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getStatusClass(status) {
  const s = (status || '').toLowerCase().replace(/\s+/g, '');
  if (s === 'inprogress' || s === 'in-progress') return styles.statusInProgress;
  if (s === 'resolved') return styles.statusResolved;
  return styles.statusPending;
}

function getPriorityClass(priority) {
  const p = (priority || '').toLowerCase();
  if (p === 'urgent') return styles.priorityUrgent;
  if (p === 'high') return styles.priorityHigh;
  if (p === 'low') return styles.priorityLow;
  return styles.priorityNormal;
}

export default function ComplaintCard({ complaint, onClick }) {
  const {
    text,
    category,
    status = 'Pending',
    priority = 'Normal',
    department,
    createdAt,
  } = complaint;

  return (
    <motion.div
      className={styles.card}
      onClick={onClick}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.topRow}>
        <div className={styles.badges}>
          <span className={styles.categoryBadge}>{category}</span>
          <span className={`${styles.statusBadge} ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>
        {createdAt && (
          <span className={styles.timestamp}>{formatDate(createdAt)}</span>
        )}
      </div>

      <p className={styles.text}>{text}</p>

      {complaint.beforeImage && complaint.afterImage && status.toLowerCase() === 'resolved' && (
        <BeforeAfterSlider 
          beforeImage={complaint.beforeImage} 
          afterImage={complaint.afterImage} 
        />
      )}

      <div className={styles.bottomRow}>
        <div className={styles.metaGroup}>
          <span className={`${styles.priority} ${getPriorityClass(priority)}`}>
            {priority} priority
          </span>
          {department && (
            <span className={styles.department}>
              <Building2 size={12} /> {department}
            </span>
          )}
          {complaint.location?.area && (
            <span className={styles.location}>
              <MapPin size={10} /> {complaint.location.area}
            </span>
          )}
        </div>
        <button 
          className={styles.shareBtn} 
          onClick={(e) => {
            e.stopPropagation();
            const textToShare = `I just reported an issue via NagarSeva AI: "${text.substring(0, 50)}..." Track it and keep our city clean!`;
            window.open(`https://wa.me/?text=${encodeURIComponent(textToShare)}`, '_blank');
          }}
          title="Share to WhatsApp"
        >
          <Share2 size={12} /> Share
        </button>
      </div>
    </motion.div>
  );
}
