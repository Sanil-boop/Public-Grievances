import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Globe,
  Search,
  Bell,
  MoreVertical,
  X,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../utils/constants';
import SosButton from '../SosButton/SosButton';
import styles from './Header.module.css';

export default function Header({
  title = 'Dashboard',
  onMenuClick,
  onDrawerOpen,
}) {
  const { state } = useApp();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const langRef = useRef(null);
  const searchRef = useRef(null);

  const pendingCount = (state?.complaints || []).filter(
    (c) => c.status === 'pending'
  ).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setLangOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={styles.header}>
      {/* Left side */}
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      {/* Middle Banner */}
      <div className={styles.govBanner}>
        <img src="/indian-flag.png" alt="Indian Flag" />
        <span className={styles.govText}>Government of India</span>
      </div>

      {/* Right side */}
      <div className={styles.right}>
        {/* Search */}
        <div ref={searchRef} className={styles.searchWrapper}>
          <button
            className={styles.iconBtn}
            onClick={() => setSearchOpen(!searchOpen)}
            title="Search complaints"
          >
            <Search size={17} />
          </button>
          {searchOpen && (
            <form className={styles.searchDropdown} onSubmit={handleSearch}>
              <Search size={14} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className={styles.searchClose}
                onClick={() => setSearchOpen(false)}
              >
                <X size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Language Selector */}
        <div ref={langRef} className={styles.langWrapper}>
          <button
            className={styles.langTrigger}
            onClick={() => setLangOpen(!langOpen)}
            title="Change language"
          >
            <Globe size={14} />
            <span className={styles.langTriggerLabel}>
              {selectedLang.flag} {selectedLang.short}
            </span>
            <ChevronDown
              size={12}
              className={`${styles.langChevron} ${langOpen ? styles.langChevronOpen : ''}`}
            />
          </button>
          {langOpen && (
            <div className={styles.langDropdown}>
              <div className={styles.langDropdownTitle}>Select Language</div>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`${styles.langItem} ${
                    selectedLang.code === lang.code ? styles.langItemActive : ''
                  }`}
                  onClick={() => handleLangSelect(lang)}
                >
                  <span className={styles.langItemFlag}>{lang.flag}</span>
                  <span className={styles.langItemLabel}>{lang.label}</span>
                  <span className={styles.langItemShort}>{lang.short}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Know your Politician */}
        <a 
          href="https://www.myneta.info/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.politicianBtn}
          title="Know your Politician"
        >
          <span className={styles.politicianIcon}>👥</span>
          <span className={styles.politicianText}>Know your Politician</span>
        </a>

        {/* SOS Emergency Button */}
        <SosButton />

        {/* Notifications */}
        <button
          className={styles.iconBtn}
          onClick={() => navigate('/history')}
          title="Notifications"
        >
          <Bell size={17} />
          {pendingCount > 0 && (
            <span className={styles.badge}>{pendingCount > 9 ? '9+' : pendingCount}</span>
          )}
        </button>



        {/* Drawer trigger (3-dot) */}
        <button
          className={styles.drawerTrigger}
          onClick={onDrawerOpen}
          title="Quick Actions & Tools"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </header>
  );
}
