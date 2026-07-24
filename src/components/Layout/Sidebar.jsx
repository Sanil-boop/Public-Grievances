import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  ClipboardList,
  BarChart3,
  Info,
  ChevronLeft,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Users,
  Bot,
  MapPin,
  Flame,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

// navItems moved inside component to access user role
export default function Sidebar({ isOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/login');
  };

  const navItems = [
    ...(user?.role === 'department' ? [
      { to: '/select-state', label: 'Department Portal', icon: LayoutDashboard }
    ] : [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/select-state', label: 'New Complaint', icon: Plus },
    ]),
    { to: '/history', label: 'History', icon: ClipboardList },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/map', label: 'Incident Map', icon: MapPin },
    { to: '/heatmap', label: 'Heatmap', icon: Flame },
    { to: '/whatsapp', label: 'WhatsApp Mode', icon: MessageSquare },
    { to: '/about', label: 'About', icon: Info },
    { href: 'https://www.myneta.info/', label: 'Know your Politician', icon: Users, isExternal: true },
    { to: '/ai-guide', label: 'AI Guide', icon: Bot },
  ];

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}

      <aside
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${
          isOpen ? styles.sidebarOpen : ''
        }`}
      >
        {/* Branding */}
        <div className={styles.brandSection}>
          <img src="/ashok-stambh.png" alt="Ashok Stambh" className={styles.brandImg} />
          <div
            className={`${styles.brandText} ${
              collapsed ? styles.brandTextHidden : ''
            }`}
          >
            <span className={styles.brandTitle}>NagarSeva AI</span>
            <span className={styles.brandSubtitle}>Civic Platform</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map(({ to, href, label, icon: Icon, isExternal }) => {
            if (isExternal) {
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  <Icon className={styles.navIcon} size={20} />
                  <span
                    className={`${styles.navLabel} ${
                      collapsed ? styles.navLabelHidden : ''
                    }`}
                  >
                    {label}
                  </span>
                </a>
              );
            }
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <Icon className={styles.navIcon} size={20} />
                <span
                  className={`${styles.navLabel} ${
                    collapsed ? styles.navLabelHidden : ''
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Auth Section */}
        <div className={styles.authSection}>
          {isAuthenticated ? (
            <>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <User size={16} />
                </div>
                <div
                  className={`${styles.userDetails} ${
                    collapsed ? styles.brandTextHidden : ''
                  }`}
                >
                  <span className={styles.userName}>{user?.name || 'User'}</span>
                  <span className={styles.userEmail}>{user?.email || ''}</span>
                </div>
              </div>
              <button
                className={styles.authBtn}
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={18} />
                <span
                  className={`${styles.navLabel} ${
                    collapsed ? styles.navLabelHidden : ''
                  }`}
                >
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={onClose}
                className={({ isActive }) =>
                  `${styles.authBtn} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <LogIn size={18} />
                <span
                  className={`${styles.navLabel} ${
                    collapsed ? styles.navLabelHidden : ''
                  }`}
                >
                  Login
                </span>
              </NavLink>
              <NavLink
                to="/signup"
                onClick={onClose}
                className={({ isActive }) =>
                  `${styles.authBtnSignup} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <UserPlus size={18} />
                <span
                  className={`${styles.navLabel} ${
                    collapsed ? styles.navLabelHidden : ''
                  }`}
                >
                  Sign Up
                </span>
              </NavLink>
            </>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((prev) => !prev)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={18}
            className={`${styles.collapseIcon} ${
              collapsed ? styles.collapseIconRotated : ''
            }`}
          />
        </button>
      </aside>
    </>
  );
}
