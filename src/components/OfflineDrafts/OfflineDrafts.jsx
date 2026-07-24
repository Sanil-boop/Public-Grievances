import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Upload, Trash2, FileText, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDrafts, deleteDraft, clearDrafts } from './DraftUtils';
import styles from './OfflineDrafts.module.css';

/* ── Component ──────────────────────────────────────────────── */

const itemVariants = {
  initial: { opacity: 0, x: -16, scale: 0.96 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: 16, scale: 0.96, transition: { duration: 0.2 } },
};

export default function OfflineDrafts() {
  const { dispatch } = useApp();
  const [drafts, setDrafts] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadDrafts = useCallback(() => {
    setDrafts(getDrafts());
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const handleDelete = (id) => {
    deleteDraft(id);
    setDrafts(getDrafts());
  };

  const handleSyncAll = async () => {
    if (drafts.length === 0 || syncing) return;
    setSyncing(true);

    for (const draft of drafts) {
      dispatch({
        type: 'ADD_COMPLAINT',
        payload: {
          text: draft.text,
          category: draft.category || 'other',
          categoryName: draft.category || 'Other',
          confidence: 0,
          department: 'General',
          priority: 'Medium',
          predictions: [],
          location: { area: draft.area },
          beforeImage: draft.photo,
        },
      });
      /* Small stagger so the user perceives progress */
      await new Promise((r) => setTimeout(r, 200));
    }

    clearDrafts();
    setDrafts([]);
    setSyncing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  function formatTimestamp(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  if (showSuccess) {
    return (
      <div className={styles.card}>
        <motion.div
          className={styles.successOverlay}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className={styles.successCheckmark}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
          >
            <CheckCircle size={24} />
          </motion.div>
          <div className={styles.successMessage}>All drafts synced successfully!</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.icon}>
            <WifiOff size={18} />
          </div>
          <span className={styles.title}>
            Offline Drafts
            {drafts.length > 0 && <span className={styles.badge}>{drafts.length}</span>}
          </span>
        </div>
        {drafts.length > 0 && (
          <button className={styles.syncButton} onClick={handleSyncAll} disabled={syncing}>
            <Upload size={14} />
            {syncing ? 'Syncing...' : 'Sync All'}
          </button>
        )}
      </div>

      {/* Draft List */}
      {drafts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FileText size={20} />
          </div>
          <div className={styles.emptyText}>
            No offline drafts. Drafts are saved automatically when you&apos;re offline.
          </div>
        </div>
      ) : (
        <div className={styles.draftList}>
          <AnimatePresence initial={false}>
            {drafts.map((draft) => (
              <motion.div
                key={draft.id}
                className={styles.draftItem}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                <div className={styles.draftIcon}>
                  <FileText size={16} />
                </div>
                <div className={styles.draftContent}>
                  <div className={styles.draftText}>{draft.text}</div>
                  <div className={styles.draftMeta}>
                    {draft.category && <span className={styles.draftCategory}>{draft.category}</span>}
                    {draft.area && <span>{draft.area}</span>}
                    <span>{formatTimestamp(draft.timestamp)}</span>
                  </div>
                </div>
                <button className={styles.deleteButton} onClick={() => handleDelete(draft.id)} aria-label="Delete draft">
                  <Trash2 size={15} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
