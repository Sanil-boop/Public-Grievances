import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './StatsCard.module.css';

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = '#6c5ce7',
  trend,
}) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter
  useEffect(() => {
    const target = typeof value === 'number' ? value : parseInt(value, 10) || 0;
    if (target === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 800;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      current = Math.round(Math.min(increment * step, target));
      setDisplayValue(current);
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [value]);

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendClass =
    trend === 'up'
      ? styles.trendUp
      : trend === 'down'
      ? styles.trendDown
      : styles.trendNeutral;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={styles.gradientTop}
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
        }}
      />

      <div className={styles.topRow}>
        <div
          className={styles.iconWrapper}
          style={{ color }}
        >
          {Icon && <Icon size={22} />}
        </div>
        {trend && (
          <div className={`${styles.trend} ${trendClass}`}>
            <TrendIcon size={14} />
          </div>
        )}
      </div>

      <div className={styles.value}>{displayValue}</div>
      <div className={styles.title}>{title}</div>
    </motion.div>
  );
}
