import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import styles from './Leaderboard.module.css';

const MOCK_LEADERBOARD = [
  { id: 1, name: 'Vasant Kunj', score: 95, label: 'Resolution Rate' },
  { id: 2, name: 'Bandra West', score: 92, label: 'Resolution Rate' },
  { id: 3, name: 'Koramangala', score: 88, label: 'Resolution Rate' },
];

export default function Leaderboard() {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        <Trophy size={18} className={styles.icon} />
        Neighborhood Leaderboard
      </h3>
      <div className={styles.list}>
        {MOCK_LEADERBOARD.map((item, index) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.rank}>
              {index === 0 && <Medal size={20} color="#ffd700" />}
              {index === 1 && <Medal size={20} color="#c0c0c0" />}
              {index === 2 && <Medal size={20} color="#cd7f32" />}
            </div>
            <div className={styles.details}>
              <h4>{item.name}</h4>
              <p>{item.score}% {item.label}</p>
            </div>
            <div className={styles.scoreBar}>
              <div 
                className={styles.fill} 
                style={{ width: `${item.score}%`, background: index === 0 ? '#00b894' : '#74b9ff' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
