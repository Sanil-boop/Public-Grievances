import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogIn, UserPlus, LogOut, ArrowRight, ArrowLeft, LayoutDashboard, Zap, Smartphone, BarChart3, Mail, MessageCircle, Hash, Rss, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TypewriterText from '../components/Animations/TypewriterText';
import GlitchText from '../components/Animations/GlitchText';
import RedactedText from '../components/Animations/RedactedText';
import styles from './TransportPortal.module.css';

export default function TransportPortal() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/transport');
  };

  return (
    <div className={`${styles.container} ufo-grid-bg`}>
      {/* Background styling layers removed - now using global ufo-grid-bg */}
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            Main Page
          </Link>
          <img src="/ashok-stambh.png" alt="Ashok Stambh" className={styles.logoImg} />
          <span className={styles.logoText}>🚌 Transport Seva</span>
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
                  <h4>Transport Alerts</h4>
                  <div className={styles.notifItem}>
                    <div className={styles.notifDot} />
                    <p>Metro Line 3 is experiencing delays. Plan accordingly.</p>
                  </div>
                  <div className={styles.notifItem}>
                    <div className={styles.notifDot} />
                    <p>New AC bus route started in your area!</p>
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
              <Link to="/transport-login" className={styles.navBtn}>
                <LogIn size={18} /> <span className={styles.btnText}>Sign In</span>
              </Link>
              <Link to="/transport-signup" className={styles.signupBtn}>
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
            <TypewriterText text="TRANSFORMING PUBLIC TRANSPORT." speed={40} /><br/>
            <GlitchText text="EMPOWERING COMMUTERS." className={styles.highlight} />
          </motion.h1>
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TypewriterText text="Report transport issues instantly using our AI-powered complaint system." delay={1000} speed={20} />
            <br />
            <RedactedText text="Track your buses and complaints in real-time for a better commute." />
          </motion.p>
          <motion.div 
            className={styles.heroCta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isAuthenticated ? (
              <button className={styles.primaryBtn} onClick={() => navigate('/select-state?type=transport')}>
                File a Complaint <ArrowRight size={18} />
              </button>
            ) : (
              <button className={styles.primaryBtn} onClick={() => navigate('/transport-login')}>
                Get Started Now <ArrowRight size={18} />
              </button>
            )}
          </motion.div>
        </section>

        {/* News Section */}
        <section className={styles.newsSection}>
          <div className={styles.newsHeader}>
            <h2>Latest Transport Updates</h2>
          </div>
          <div className={styles.newsGrid}>
            <div className={styles.newsCard}>
              <div className={styles.newsCardHeader}>
                <span className={styles.newsSource}>MoRTH Update</span>
                <span>2 Hours Ago</span>
              </div>
              <h3 className={styles.newsTitle}>10,000 New Electric Buses Added</h3>
              <p className={styles.newsSnippet}>The Ministry of Road Transport and Highways has rolled out thousands of e-buses for greener cities.</p>
              <button className={styles.readMoreBtn}>Read More</button>
            </div>
            <div className={styles.newsCard}>
              <div className={styles.newsCardHeader}>
                <span className={styles.newsSource}>Smart City News</span>
                <span>5 Hours Ago</span>
              </div>
              <h3 className={styles.newsTitle}>Unified Transport App Launched</h3>
              <p className={styles.newsSnippet}>Commuters can now track public transit in real-time across multiple metropolitan networks.</p>
              <button className={styles.readMoreBtn}>Read More</button>
            </div>
            <div className={styles.newsCard}>
              <div className={styles.newsCardHeader}>
                <span className={styles.newsSource}>Transit Authority</span>
                <span>1 Day Ago</span>
              </div>
              <h3 className={styles.newsTitle}>Metro Expansion Phase 3 Approved</h3>
              <p className={styles.newsSnippet}>The cabinet has cleared the next phase of rapid transit expansion covering key suburban routes.</p>
              <button className={styles.readMoreBtn}>Read More</button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.newsHeader}>
            <h2>Why Choose Transport Seva?</h2>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><Zap size={24} /></div>
              <h3>AI Smart Routing</h3>
              <p>Our advanced engine understands your complaint and instantly routes it to the correct transport department without delays.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><Smartphone size={24} /></div>
              <h3>Voice & Photo Input</h3>
              <p>Just speak into your microphone or upload a photo of the transport issue. We support multiple languages for ease of access.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><Shield size={24} /></div>
              <h3>100% Privacy</h3>
              <p>Your location and identity are secure. Data is only used to resolve your reported transport problems efficiently.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><BarChart3 size={24} /></div>
              <h3>Real-time Tracking</h3>
              <p>Get complete transparency with a live dashboard showing the exact status of your complaint and resolution metrics.</p>
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
              <span className={styles.logoText}>Transport Seva</span>
            </div>
            <p>Empowering commuters and transforming public transport through AI-driven solutions.</p>
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
              <a href="mailto:contact@transportseva.ai" aria-label="Email"><Mail size={20} /></a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.nationalEmblem}>
            <img src="/ashok-stambh.png" alt="Ashok Stambh" className={styles.stambhImg} />
            <span className={styles.satyamevaQuote}>सत्यमेव जयते</span>
            <span className={styles.satyamevaSubQuote}>Truth Alone Triumphs</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Transport Seva AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
