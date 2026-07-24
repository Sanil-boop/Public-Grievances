import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogIn, UserPlus, LogOut, ArrowRight, LayoutDashboard, Globe, MapPin, X, Shield, Zap, Smartphone, BarChart3, Mail, MessageCircle, Hash, Rss } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TypewriterText from '../components/Animations/TypewriterText';
import GlitchText from '../components/Animations/GlitchText';
import RedactedText from '../components/Animations/RedactedText';
import styles from './LandingPage.module.css';



export default function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`${styles.container} ufo-grid-bg`}>
      {/* Background styling layers removed - now using global ufo-grid-bg */}
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/ashok-stambh.png" alt="Ashok Stambh" className={styles.logoImg} />
          <span className={styles.logoText}>NagarSeva AI</span>
        </div>
        
        <div className={styles.govBanner}>
          <img src="/indian-flag.png" alt="Indian Flag" />
          <span className={styles.govText}>Government of India</span>
        </div>

        <div className={styles.headerActions}>
          <a 
            href="https://www.myneta.info/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.politicianBtn}
            title="Know your Politician"
          >
            <span className={styles.politicianIcon}>👥</span>
            <span className={styles.btnText}>Know your Politician</span>
          </a>

          <div className={styles.notificationWrapper}>
            <button 
              className={styles.iconBtn}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              <span className={styles.badge}>2</span>
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  className={styles.notificationDropdown}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <h4>Civic Alerts</h4>
                  <div className={styles.notifItem}>
                    <div className={styles.notifDot} />
                    <p>Heavy rainfall expected tomorrow. Avoid waterlogged areas.</p>
                  </div>
                  <div className={styles.notifItem}>
                    <div className={styles.notifDot} />
                    <p>Scheduled power cut in Sector 4 from 2 PM - 4 PM.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isAuthenticated ? (
            <>
              <span className={styles.welcomeText}>
                Welcome, {user?.name.split(' ')[0]}
              </span>
              <button className={styles.navBtn} onClick={() => navigate('/dashboard')}>
                <LayoutDashboard size={18} /> <span className={styles.btnText}>Dashboard</span>
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={18} /> <span className={styles.btnText}>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navBtn}>
                <LogIn size={18} /> <span className={styles.btnText}>Sign In</span>
              </Link>
              <Link to="/signup" className={styles.signupBtn}>
                <UserPlus size={18} /> <span className={styles.btnText}>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <motion.h1 
            className={`${styles.heroTitle} ufo-header`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TypewriterText text="EMPOWERING CITIZENS." speed={40} /><br/>
            <GlitchText text="TRANSFORMING GOVERNANCE." className={styles.highlight} />
          </motion.h1>
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TypewriterText text="Report civic issues instantly using AI voice and photo recognition." delay={1000} speed={20} />
            <br />
            <RedactedText text="Track your complaints in real-time and help build a better community." />
          </motion.p>
          <motion.div 
            className={styles.heroCta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isAuthenticated ? (
              <button className={styles.primaryBtn} onClick={() => navigate('/select-state')}>
                File a Complaint <ArrowRight size={18} />
              </button>
            ) : (
              <button className={styles.primaryBtn} onClick={() => navigate('/login')}>
                Get Started Now <ArrowRight size={18} />
              </button>
            )}
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className={styles.featuresSection}>
          <div className={styles.newsHeader}>
            <h2>National Civic Impact</h2>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3 style={{ fontSize: '3rem', color: 'var(--accent-primary)', margin: '10px 0' }}>1,245,678</h3>
              <h3>Total Cases Reported</h3>
              <p>Across all municipalities</p>
            </div>
            <div className={styles.featureCard}>
              <h3 style={{ fontSize: '3rem', color: 'var(--accent-primary)', margin: '10px 0' }}>1,102,450</h3>
              <h3>Total Resolved</h3>
              <p>88.5% Resolution Rate</p>
            </div>
            <div className={styles.featureCard}>
              <h3 style={{ fontSize: '3rem', color: 'var(--accent-primary)', margin: '10px 0' }}>45,210</h3>
              <h3>Active Personnel</h3>
              <p>Civic workers on ground</p>
            </div>
          </div>
        </section>
        {/* Features / More Info Section */}
        <section className={styles.featuresSection}>
          <div className={styles.newsHeader}>
            <h2>Why Choose NagarSeva AI?</h2>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><Zap size={24} /></div>
              <h3>Instant AI Routing</h3>
              <p>Our advanced Natural Language Processing engine understands your complaint and instantly routes it to the correct municipal department without human intervention.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><Smartphone size={24} /></div>
              <h3>Voice & Photo Input</h3>
              <p>Just speak into your microphone or upload a photo of the problem. We transcribe audio in Hindi or English and extract text from images automatically.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><Shield size={24} /></div>
              <h3>100% Privacy</h3>
              <p>All AI classification happens directly on your device. Your sensitive voice data and personal information are never sent to external AI servers.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><BarChart3 size={24} /></div>
              <h3>Real-time Tracking</h3>
              <p>Get complete transparency with a live dashboard showing the exact status of your complaint, department SLAs, and historical analytics.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logoContainer}>
              <img src="/ashok-stambh.png" alt="Ashok Stambh" className={styles.logoImg} />
              <span className={styles.logoText}>NagarSeva AI</span>
            </div>
            <p>Empowering citizens and transforming governance through AI-driven civic solutions.</p>
          </div>
          <div className={styles.footerLinks}>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about-us">About Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/contact">Contact Support</Link>
          </div>
          <div className={styles.footerConnect}>
            <h4>Connect With Us</h4>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Social 1"><Hash size={20} /></a>
              <a href="#" aria-label="Social 2"><MessageCircle size={20} /></a>
              <a href="#" aria-label="Social 3"><Rss size={20} /></a>
              <a href="mailto:contact@nagarseva.ai" aria-label="Email"><Mail size={20} /></a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.nationalEmblem}>
            <img src="/ashok-stambh.png" alt="Ashok Stambh" className={styles.stambhImg} />
            <span className={styles.satyamevaQuote}>सत्यमेव जयते</span>
            <span className={styles.satyamevaSubQuote}>Truth Alone Triumphs</span>
          </div>
          <p>&copy; {new Date().getFullYear()} NagarSeva AI. All rights reserved.</p>
        </div>
      </footer>


    </div>
  );
}
