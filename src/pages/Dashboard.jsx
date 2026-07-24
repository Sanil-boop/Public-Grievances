import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  Loader,
  CheckCircle2,
  Plus,
  Inbox,
  MapPin,
  BarChart3,
  Activity,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/StatsCard/StatsCard';
import ComplaintCard from '../components/ComplaintCard/ComplaintCard';
import CivicProfile from '../components/CivicProfile/CivicProfile';
import PollWidget from '../components/PollWidget/PollWidget';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import CivicBounties from '../components/CivicBounties/CivicBounties';
import DailyNews from '../components/DailyNews/DailyNews';
import EmergencyBroadcast from '../components/EmergencyBroadcast/EmergencyBroadcast';
import OfflineDrafts from '../components/OfflineDrafts/OfflineDrafts';
import styles from './Dashboard.module.css';

const CHART_COLORS = [
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
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
      <div style={{ fontWeight: 600 }}>{data.name}</div>
      <div style={{ color: '#8888a0', marginTop: 2 }}>
        {data.value} complaint{data.value !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const { complaints, stats, emergencyAlerts } = state;

  const recentComplaints = useMemo(
    () =>
      [...complaints]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [complaints]
  );

  // Recent activity — last 5 status changes across all complaints
  const recentActivity = useMemo(() => {
    const activities = [];
    complaints.forEach((c) => {
      // Add complaint creation as an activity
      activities.push({
        id: c.id + '-created',
        text: c.text?.slice(0, 50) + (c.text?.length > 50 ? '...' : ''),
        category: c.categoryName || c.category,
        icon: c.icon,
        action: 'filed',
        status: 'pending',
        createdAt: c.createdAt,
      });
      // Add updates as activities
      if (c.updates?.length) {
        c.updates.forEach((u, i) => {
          activities.push({
            id: c.id + '-update-' + i,
            text: u.message?.slice(0, 50) + (u.message?.length > 50 ? '...' : ''),
            category: c.categoryName || c.category,
            icon: c.icon,
            action: u.status === 'resolved' ? 'resolved' : 'updated',
            status: u.status,
            createdAt: u.createdAt,
          });
        });
      }
    });
    return activities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [complaints]);

  const categoryData = useMemo(() => {
    const counts = {};
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  if (complaints.length === 0) {
    return (
      <motion.div
        className={styles.page}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <CivicProfile />
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Inbox size={36} color="#6c5ce7" />
          </div>
          <h2 className={styles.emptyTitle}>Welcome to NagarSeva AI</h2>
          <p className={styles.emptyDesc}>
            No complaints filed yet. Start by filing your first civic complaint
            and our AI will classify and route it to the appropriate department.
          </p>
          <Link to="/select-state" className={styles.emptyAction}>
            <Plus size={18} /> File New Complaint
          </Link>
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
      {/* Emergency Broadcasts */}
      <EmergencyBroadcast
        alerts={emergencyAlerts}
        onDismiss={(id) => dispatch({ type: 'DISMISS_ALERT', payload: id })}
      />

      {/* Civic Profile */}
      <motion.div variants={itemVariants}>
        <CivicProfile />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className={styles.quickActionsGrid}>
        <Link to="/select-state" className={`${styles.quickActionCard} ${styles.actionCardPurple}`}>
          <Plus size={18} className={styles.quickActionIcon} />
          <span className={styles.quickActionTitle}>File Complaint</span>
          <ArrowRight size={14} className={styles.quickActionArrow} />
        </Link>
        <Link to="/map" className={`${styles.quickActionCard} ${styles.actionCardTeal}`}>
          <MapPin size={18} className={styles.quickActionIcon} />
          <span className={styles.quickActionTitle}>Incident Map</span>
          <ArrowRight size={14} className={styles.quickActionArrow} />
        </Link>
        <Link to="/analytics" className={`${styles.quickActionCard} ${styles.actionCardYellow}`}>
          <BarChart3 size={18} className={styles.quickActionIcon} />
          <span className={styles.quickActionTitle}>Analytics</span>
          <ArrowRight size={14} className={styles.quickActionArrow} />
        </Link>
        <Link to="/whatsapp" className={`${styles.quickActionCard} ${styles.actionCardGreen}`}>
          <MessageSquare size={18} className={styles.quickActionIcon} />
          <span className={styles.quickActionTitle}>WhatsApp Mode</span>
          <ArrowRight size={14} className={styles.quickActionArrow} />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className={styles.statsGrid} variants={itemVariants}>
        <StatsCard
          title="Total Complaints"
          value={stats.total}
          icon={FileText}
          color="#6c5ce7"
          trend="up"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="#fdcb6e"
          trend="neutral"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Loader}
          color="#00cec9"
          trend="up"
        />
        <StatsCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
          color="#00b894"
          trend="up"
        />
      </motion.div>

      {/* Recent Activity Feed */}
      {recentActivity.length > 0 && (
        <motion.div variants={itemVariants} style={{
          padding: '16px 20px',
          borderRadius: '14px',
          background: 'var(--glass-bg, rgba(255,255,255,0.03))',
          border: '1px solid var(--glass-border, rgba(255,255,255,0.06))',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Activity size={16} style={{ color: '#6366f1' }} />
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#e0e0f0' }}>Recent Activity</h3>
          </div>
          {recentActivity.map((act) => (
            <div key={act.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{act.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', color: '#c0c0d0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {act.text}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8888a0', marginTop: '2px' }}>
                  {act.category}
                </div>
              </div>
              <span style={{
                fontSize: '0.72rem',
                padding: '4px 8px',
                borderRadius: '6px',
                background: act.action === 'resolved' ? 'rgba(0,184,148,0.15)' : act.action === 'updated' ? 'rgba(116,185,255,0.15)' : 'rgba(253,203,110,0.15)',
                color: act.action === 'resolved' ? '#00b894' : act.action === 'updated' ? '#74b9ff' : '#fdcb6e',
                fontWeight: 500,
                textTransform: 'capitalize',
                flexShrink: 0,
              }}>
                {act.action}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#6a6a80', flexShrink: 0, minWidth: '60px', textAlign: 'right' }}>
                {timeAgo(act.createdAt)}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Sections Row */}
      <motion.div className={styles.sectionsRow} variants={itemVariants}>
        {/* Offline Drafts Panel */}
        <div className={styles.section} style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
          <OfflineDrafts />
        </div>

        {/* Recent Complaints */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Complaints</h2>
            <Link to="/history" className={styles.viewAll}>
              View All →
            </Link>
          </div>
          <div className={styles.complaintsList}>
            {recentComplaints.map((c) => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Category Distribution</h2>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={3}
                  stroke="none"
                >
                  {categoryData.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Community Polls */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Have Your Say</h2>
          </div>
          <PollWidget />
        </div>

        {/* Daily Civic News */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Daily Civic News</h2>
          </div>
          <DailyNews />
        </div>

        {/* Civic Bounties */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Civic Action</h2>
          </div>
          <CivicBounties />
        </div>

        {/* Neighborhood Leaderboard */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Community Rank</h2>
          </div>
          <Leaderboard />
        </div>
      </motion.div>
    </motion.div>
  );
}
