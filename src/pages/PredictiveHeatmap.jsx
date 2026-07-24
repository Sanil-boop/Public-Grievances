import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MapPin,
  Flame,
  Droplets,
  Zap,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import styles from './PredictiveHeatmap.module.css';

/* ── Area grid (6×6 = 36 zones) ─────────────────────────────── */

const AREA_NAMES = [
  'Bandra West', 'Andheri East', 'Powai', 'Dadar', 'Borivali', 'Juhu',
  'Kurla', 'Chembur', 'Malad West', 'Goregaon', 'Thane West', 'Vashi',
  'Colaba', 'Lower Parel', 'Worli', 'Santacruz', 'Vikhroli', 'Ghatkopar',
  'Wadala', 'Sion', 'Mulund', 'Airoli', 'Panvel', 'Kandivali',
  'Versova', 'Matunga', 'Byculla', 'Prabhadevi', 'Khar', 'Vileparle',
  'Mankhurd', 'Govandi', 'Deonar', 'Bhandup', 'Nahur', 'Kanjurmarg',
];

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'water', label: 'Water', icon: Droplets },
  { id: 'roads', label: 'Roads', icon: null },
  { id: 'electricity', label: 'Electricity', icon: Zap },
  { id: 'sanitation', label: 'Sanitation', icon: Trash2 },
  { id: 'drainage', label: 'Drainage', icon: Droplets },
];

const PREDICTED_ALERTS = [
  {
    id: 'alert-1',
    text: '⚠️ Water complaints in Bandra West trending up 40% — predicted surge next week',
    severity: 'warning',
  },
  {
    id: 'alert-2',
    text: '🔴 Road damage expected to increase in Andheri East post-monsoon',
    severity: 'danger',
  },
  {
    id: 'alert-3',
    text: '✅ Electricity complaints in Powai declining 25% — improvements working',
    severity: 'success',
  },
  {
    id: 'alert-4',
    text: '🔵 Drainage issues in Kurla stabilizing — monitoring recommended',
    severity: 'info',
  },
];

function getCellColor(count, maxCount) {
  if (maxCount === 0) return 'rgba(45, 27, 105, 0.5)';
  const ratio = count / maxCount;
  if (ratio > 0.7) return 'rgba(255, 71, 87, 0.7)';
  if (ratio > 0.4) return 'rgba(225, 112, 85, 0.55)';
  if (ratio > 0.15) return 'rgba(108, 92, 231, 0.45)';
  return 'rgba(45, 27, 105, 0.35)';
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function PredictiveHeatmap() {
  const { state } = useApp();
  const { complaints } = state;
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredCell, setHoveredCell] = useState(null);

  /* ── Compute area data ─────────────────────────────────────── */
  const areaData = useMemo(() => {
    const filtered = activeFilter === 'all'
      ? complaints
      : complaints.filter((c) => c.category === activeFilter);

    /* Count complaints per area */
    const areaCountMap = {};
    const areaCategoryMap = {};

    for (const c of filtered) {
      const area = c.location?.area || 'Unknown';
      areaCountMap[area] = (areaCountMap[area] || 0) + 1;
      if (!areaCategoryMap[area]) areaCategoryMap[area] = {};
      const cat = c.category || 'other';
      areaCategoryMap[area][cat] = (areaCategoryMap[area][cat] || 0) + 1;
    }

    /* Map to grid cells */
    return AREA_NAMES.map((name) => {
      const count = areaCountMap[name] || 0;
      const cats = areaCategoryMap[name] || {};
      const topCategory = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
      /* Mock trend data */
      const trend = Math.round((Math.random() - 0.4) * 60);
      return { name, count, topCategory, trend };
    });
  }, [complaints, activeFilter]);

  const maxCount = useMemo(() => Math.max(...areaData.map((a) => a.count), 1), [areaData]);

  /* ── Top 3 hotspots ────────────────────────────────────────── */
  const hotspots = useMemo(() => {
    return [...areaData]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((area, idx) => ({
        ...area,
        rank: idx + 1,
        change: area.trend,
        topIssue: area.topCategory,
      }));
  }, [areaData]);

  return (
    <motion.div
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className={styles.pageHeader} variants={itemVariants}>
        <div className={styles.headerIcon}>
          <Flame size={22} />
        </div>
        <div>
          <div className={styles.pageTitle}>Predictive Complaint Heatmap</div>
          <div className={styles.pageSubtitle}>AI-powered hotspot analysis across zones</div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div className={styles.filterTabs} variants={itemVariants}>
        {FILTER_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              className={`${styles.filterTab} ${activeFilter === cat.id ? styles.filterTabActive : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {Icon && <Icon size={14} />}
              {cat.label}
            </button>
          );
        })}
      </motion.div>

      {/* Heatmap Grid */}
      <motion.div className={styles.heatmapSection} variants={itemVariants}>
        <div className={styles.heatmapTitle}>Zone Density Grid</div>
        <div className={styles.heatmapGrid}>
          {areaData.map((cell, idx) => (
            <div
              key={cell.name}
              className={styles.heatCell}
              style={{ background: getCellColor(cell.count, maxCount), '--cell-color': getCellColor(cell.count, maxCount) }}
              onMouseEnter={() => setHoveredCell(idx)}
              onMouseLeave={() => setHoveredCell(null)}
            >
              <span className={styles.cellCount}>{cell.count}</span>
              <span className={styles.cellLabel}>{cell.name}</span>

              {hoveredCell === idx && (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipName}>
                    <MapPin size={12} /> {cell.name}
                  </div>
                  <div className={styles.tooltipRow}>
                    <span className={styles.tooltipLabel}>Complaints</span>
                    <span className={styles.tooltipValue}>{cell.count}</span>
                  </div>
                  <div className={styles.tooltipRow}>
                    <span className={styles.tooltipLabel}>Top Category</span>
                    <span className={styles.tooltipValue}>{cell.topCategory}</span>
                  </div>
                  <div className={styles.tooltipRow}>
                    <span className={styles.tooltipLabel}>Trend</span>
                    <span className={cell.trend >= 0 ? styles.tooltipTrendUp : styles.tooltipTrendDown}>
                      {cell.trend >= 0 ? `↑ +${cell.trend}%` : `↓ ${cell.trend}%`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.legend}>
          <span className={styles.legendLabel}>Low</span>
          <div className={styles.legendBar} />
          <span className={styles.legendLabel}>High</span>
        </div>
      </motion.div>

      {/* Hotspot Analysis */}
      <motion.div variants={itemVariants}>
        <div className={styles.sectionTitle}>
          <Flame size={18} className={styles.sectionIcon} />
          Hotspot Analysis
        </div>
        <div className={styles.hotspotGrid}>
          {hotspots.map((spot) => (
            <motion.div
              key={spot.name}
              className={styles.hotspotCard}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.hotspotRank}>#{spot.rank} Hotspot</div>
              <div className={styles.hotspotName}>{spot.name}</div>
              <div className={styles.hotspotStats}>
                <div className={styles.hotspotStatRow}>
                  <span className={styles.hotspotStatLabel}>Complaints</span>
                  <span className={styles.hotspotStatValue}>{spot.count}</span>
                </div>
                <div className={styles.hotspotStatRow}>
                  <span className={styles.hotspotStatLabel}>Trend</span>
                  {spot.change >= 0 ? (
                    <span className={styles.trendUp}>
                      <TrendingUp size={14} />
                      +{spot.change}%
                    </span>
                  ) : (
                    <span className={styles.trendDown}>
                      <TrendingDown size={14} />
                      {spot.change}%
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.hotspotIssue}>
                <span className={styles.hotspotIssueLabel}>Top Issue: </span>
                {spot.topIssue}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Predicted Alerts */}
      <motion.div className={styles.alertsSection} variants={itemVariants}>
        <div className={styles.sectionTitle}>
          <AlertTriangle size={18} className={styles.sectionIcon} />
          Predicted Alerts
        </div>
        <div className={styles.alertList}>
          {PREDICTED_ALERTS.map((alert) => (
            <motion.div
              key={alert.id}
              className={`${styles.alertCard} ${styles[`alert${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}`]}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className={`${styles.alertIcon} ${styles[`alertIcon${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}`]}`}>
                {alert.severity === 'warning' && <AlertTriangle size={18} />}
                {alert.severity === 'danger' && <TrendingUp size={18} />}
                {alert.severity === 'success' && <TrendingDown size={18} />}
                {alert.severity === 'info' && <Droplets size={18} />}
              </div>
              <div className={styles.alertContent}>
                <div className={styles.alertText}>{alert.text}</div>
                <div className={styles.alertMeta}>AI Prediction · Updated today</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
