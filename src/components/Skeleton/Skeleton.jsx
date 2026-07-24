import styles from './Skeleton.module.css';

export function SkeletonBox({ width, height, borderRadius = '12px', style }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

export function SkeletonText({ lines = 3, width = '100%' }) {
  return (
    <div className={styles.textGroup} style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{
            height: '12px',
            width: i === lines - 1 ? '60%' : '100%',
            borderRadius: '6px',
          }}
        />
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className={styles.statsCard}>
      <div className={styles.statsTop}>
        <SkeletonBox width="44px" height="44px" borderRadius="12px" />
        <SkeletonBox width="48px" height="24px" borderRadius="20px" />
      </div>
      <SkeletonBox width="80px" height="36px" borderRadius="8px" style={{ marginBottom: '8px' }} />
      <SkeletonBox width="120px" height="12px" borderRadius="6px" />
    </div>
  );
}

export function ComplaintCardSkeleton() {
  return (
    <div className={styles.complaintCard}>
      <div className={styles.complaintTop}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <SkeletonBox width="70px" height="22px" borderRadius="20px" />
          <SkeletonBox width="60px" height="22px" borderRadius="20px" />
        </div>
        <SkeletonBox width="80px" height="12px" borderRadius="6px" />
      </div>
      <SkeletonText lines={2} />
      <div className={styles.complaintBottom}>
        <SkeletonBox width="90px" height="12px" borderRadius="6px" />
        <SkeletonBox width="60px" height="28px" borderRadius="8px" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className={styles.dashboardSkeleton}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map(i => <StatsCardSkeleton key={i} />)}
      </div>
      {/* Content */}
      <div className={styles.contentGrid}>
        <div className={styles.section}>
          <SkeletonBox width="160px" height="18px" borderRadius="6px" style={{ marginBottom: '16px' }} />
          {[1, 2, 3].map(i => <ComplaintCardSkeleton key={i} />)}
        </div>
        <div className={styles.section}>
          <SkeletonBox width="180px" height="18px" borderRadius="6px" style={{ marginBottom: '16px' }} />
          <SkeletonBox width="100%" height="260px" borderRadius="14px" />
        </div>
      </div>
    </div>
  );
}
