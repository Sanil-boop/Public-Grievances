import { Award, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './CivicProfile.module.css';

export default function CivicProfile() {
  const { user } = useAuth();
  
  if (!user) return null;

  const points = user.karmaPoints || 0;
  const badges = user.badges || [];

  return (
    <div className={styles.profileCard}>
      <div className={styles.pointsSection}>
        <div className={styles.pointsIcon}>
          <Star size={24} fill="#fdcb6e" color="#fdcb6e" />
        </div>
        <div className={styles.pointsInfo}>
          <h4>Civic Karma</h4>
          <span className={styles.pointsValue}>{points} <span>pts</span></span>
        </div>
      </div>
      
      <div className={styles.badgesSection}>
        <h4>Earned Badges</h4>
        {badges.length === 0 ? (
          <p className={styles.noBadges}>Submit complaints to earn badges!</p>
        ) : (
          <div className={styles.badgesList}>
            {badges.map((badge, idx) => (
              <div key={idx} className={styles.badge}>
                <Award size={14} />
                {badge}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
