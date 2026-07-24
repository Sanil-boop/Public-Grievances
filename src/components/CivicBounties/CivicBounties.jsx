import React from 'react';
import { Target, Gift } from 'lucide-react';
import styles from './CivicBounties.module.css';

const MOCK_BOUNTIES = [
  { id: 1, title: 'Report 5 Illegal Dumping Sites', reward: 50, progress: 2, total: 5 },
  { id: 2, title: 'Verify 3 Resolved Potholes', reward: 30, progress: 3, total: 3 },
];

export default function CivicBounties() {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        <Target size={18} className={styles.icon} />
        Active Bounties
      </h3>
      <div className={styles.list}>
        {MOCK_BOUNTIES.map((bounty) => (
          <div key={bounty.id} className={styles.item}>
            <div className={styles.header}>
              <h4>{bounty.title}</h4>
              <span className={styles.reward}>
                <Gift size={14} /> {bounty.reward} XP
              </span>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressText}>
                {bounty.progress} / {bounty.total} Completed
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.fill} 
                  style={{ 
                    width: `${(bounty.progress / bounty.total) * 100}%`,
                    background: bounty.progress === bounty.total ? '#00b894' : '#6c5ce7' 
                  }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
