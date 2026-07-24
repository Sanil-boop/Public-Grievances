import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';

import TaxTracker from '../components/TaxTracker/TaxTracker';
import styles from './Analytics.module.css';

const COLORS = [
  '#6c5ce7',
  '#00cec9',
  '#fdcb6e',
  '#e17055',
  '#00b894',
  '#a29bfe',
  '#fab1a0',
  '#81ecec',
  '#ffeaa7',
  '#dfe6e9',
  '#fd79a8',
  '#55efc4',
];

const PRIORITY_COLORS = {
  Urgent: '#e17055',
  High: '#fdcb6e',
  Normal: '#00cec9',
  Low: '#8888a0',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(18,18,26,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '10px 16px',
        color: '#f0f0f5',
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 600 }}>{label || payload[0].name}</div>
      <div style={{ color: '#8888a0', marginTop: 2 }}>
        {payload[0].value} complaint{payload[0].value !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Analytics() {
  const { state } = useApp();
  const { complaints, stats } = state;

  const categoryData = useMemo(() => {
    const counts = {};
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [complaints]);

  const priorityData = useMemo(() => {
    const counts = { Urgent: 0, High: 0, Normal: 0, Low: 0 };
    complaints.forEach((c) => {
      const p = c.priority || 'Normal';
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      fill: PRIORITY_COLORS[name] || '#8888a0',
    }));
  }, [complaints]);

  if (complaints.length === 0) {
    return (
      <motion.div
        className={styles.page}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <BarChart3 size={36} />
          </div>
          <h2 className={styles.emptyTitle}>No Data Yet</h2>
          <p className={styles.emptyDesc}>
            Analytics will appear once you start filing complaints. Head over to
            the &quot;New Complaint&quot; page to get started.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Status Summary */}
      <motion.div className={styles.statsRow} variants={itemVariants}>
        <div className={styles.statItem}>
          <div className={styles.statValue} style={{ color: '#fdcb6e' }}>
            {stats.pending}
          </div>
          <div className={styles.statLabel}>Pending</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue} style={{ color: '#00cec9' }}>
            {stats.inProgress}
          </div>
          <div className={styles.statLabel}>In Progress</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue} style={{ color: '#00b894' }}>
            {stats.resolved}
          </div>
          <div className={styles.statLabel}>Resolved</div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Category Distribution Pie */}
        <motion.div className={styles.chartCard} variants={itemVariants}>
          <h3 className={styles.chartTitle}>Category Distribution</h3>
          <p className={styles.chartSubtitle}>
            Complaints grouped by category
          </p>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  dataKey="value"
                  paddingAngle={3}
                  stroke="none"
                >
                  {categoryData.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Priority Distribution Bar */}
        <motion.div className={styles.chartCard} variants={itemVariants}>
          <h3 className={styles.chartTitle}>Priority Distribution</h3>
          <p className={styles.chartSubtitle}>
            Complaints by assessed priority level
          </p>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={priorityData} barSize={40}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#8888a0', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#8888a0', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Categories Bar */}
        <motion.div className={styles.chartCard} variants={itemVariants}>
          <h3 className={styles.chartTitle}>Top Categories</h3>
          <p className={styles.chartSubtitle}>
            Most reported complaint categories
          </p>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={categoryData.slice(0, 6)}
                layout="vertical"
                barSize={18}
              >
                <XAxis
                  type="number"
                  tick={{ fill: '#8888a0', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#8888a0', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {categoryData.slice(0, 6).map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Department Workload */}
        <motion.div className={styles.chartCard} variants={itemVariants}>
          <h3 className={styles.chartTitle}>Department Workload</h3>
          <p className={styles.chartSubtitle}>
            Complaints per department
          </p>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={(() => {
                    const deptCounts = {};
                    complaints.forEach((c) => {
                      const d = c.department || 'Unassigned';
                      deptCounts[d] = (deptCounts[d] || 0) + 1;
                    });
                    return Object.entries(deptCounts).map(([name, value]) => ({
                      name,
                      value,
                    }));
                  })()}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  paddingAngle={2}
                  stroke="none"
                  label={({ name, percent }) =>
                    `${name.slice(0, 12)} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* SLA Dashboard */}
        <motion.div className={styles.chartCard} variants={itemVariants}>
          <h3 className={styles.chartTitle}>Department SLA (Resolution Time)</h3>
          <p className={styles.chartSubtitle}>
            Average days to resolve a complaint
          </p>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={[
                  { name: 'Water & Sewage', days: 2.1 },
                  { name: 'Electricity', days: 1.4 },
                  { name: 'Roads & Traffic', days: 5.2 },
                  { name: 'Health & Sanitation', days: 1.8 },
                  { name: 'Public Safety', days: 0.9 },
                ]}
                barSize={30}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#8888a0', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#8888a0', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div
                        style={{
                          background: 'rgba(18,18,26,0.95)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 10,
                          padding: '10px 16px',
                          color: '#f0f0f5',
                          fontSize: 13,
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{label}</div>
                        <div style={{ color: '#8888a0', marginTop: 2 }}>
                          {payload[0].value} days avg resolution
                        </div>
                      </div>
                    );
                  }} 
                />
                <Bar dataKey="days" radius={[6, 6, 0, 0]}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <TaxTracker />
    </motion.div>
  );
}
