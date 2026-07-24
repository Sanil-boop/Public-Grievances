import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import styles from './EmergencyBroadcast.module.css';

// ────────────────────────────────────────────────────────────────────────────
// SEVERITY CONFIG
// ────────────────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertTriangle,
    className: 'critical',
  },
  warning: {
    icon: AlertCircle,
    className: 'warning',
  },
  info: {
    icon: Info,
    className: 'info',
  },
};

// ────────────────────────────────────────────────────────────────────────────
// RELATIVE TIME HELPER
// ────────────────────────────────────────────────────────────────────────────

function formatRelativeTime(timestamp) {
  if (!timestamp) return '';

  const now = Date.now();
  const then = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'Just now';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

// ────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────────────────────────────────

/**
 * EmergencyBroadcast
 * ──────────────────
 * Stack of dismissible, color-coded alert banners.
 * Critical alerts pulse, warnings glow orange, info shines blue.
 */
export default function EmergencyBroadcast({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className={styles.stack}>
      <AnimatePresence initial={false}>
        {alerts.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
          const Icon = config.icon;
          const severityClass = styles[config.className] || '';

          return (
            <motion.div
              key={alert.id}
              className={`${styles.banner} ${severityClass}`}
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              layout
            >
              <div className={styles.iconWrap}>
                <Icon size={20} />
              </div>

              <div className={styles.content}>
                <div className={styles.header}>
                  <h4 className={styles.title}>{alert.title}</h4>
                  {alert.area && (
                    <span className={styles.areaTag}>{alert.area}</span>
                  )}
                </div>
                <p className={styles.message}>{alert.message}</p>
                {alert.timestamp && (
                  <span className={styles.time}>
                    {formatRelativeTime(alert.timestamp)}
                  </span>
                )}
              </div>

              <button
                className={styles.dismissBtn}
                onClick={() => onDismiss?.(alert.id)}
                aria-label={`Dismiss ${alert.title}`}
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
