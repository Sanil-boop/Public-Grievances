import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plus, ClipboardList, User } from 'lucide-react';
import styles from './BottomNav.module.css';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
  const { user } = useAuth();

  const navItems = [
    { to: user?.role === 'department' ? '/select-state' : '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/select-state', label: 'New', icon: Plus, highlight: true },
    { to: '/history', label: 'History', icon: ClipboardList },
    { to: '/profile-setup', label: 'Profile', icon: User },
  ];

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {navItems.map(({ to, label, icon: Icon, highlight }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ''} ${highlight ? styles.highlightItem : ''}`
            }
          >
            <div className={`${styles.iconWrapper} ${highlight ? styles.highlightWrapper : ''}`}>
              <Icon size={highlight ? 24 : 20} className={styles.icon} />
            </div>
            <span className={styles.label}>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
