import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Search, ArrowRight, LogIn, UserPlus, LogOut, LayoutDashboard,
  X, Hash, MessageCircle, Rss, Menu, ChevronDown, ChevronLeft, ChevronRight,
  Shield, Droplets, Zap, Building2, GraduationCap, HeartPulse,
  Leaf, Train, Globe, Phone, FileText, Users, TrendingUp, MapPin,
  AlertTriangle, CheckCircle2, Clock, Star, ExternalLink, Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './PortalHome.module.css';

/* ════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════ */

const NAV_ITEMS = [
  { id: 'news', label: 'News', path: '/news' },
  { id: 'multimedia', label: 'Multimedia', path: '/multimedia' },
  { id: 'spotlights', label: 'Spotlights', path: '#' },
  { id: 'about', label: 'About', path: '/about-us' },
  { id: 'resources', label: 'Resources', path: '#' },
  { id: 'civic', label: 'Civic Complaint', path: '/civic' },
];

const HERO_SLIDES = [
  {
    tag: 'VISION OF INDIA',
    title: 'FIXING NATIONAL CHALLENGES: A UNITED VISION FOR A BETTER TOMORROW',
    image: '/images/indian-flag-hero.jpg',
    link: '/news',
    btnText: 'Read the Vision',
  },
  {
    tag: 'SMART CITIES MISSION',
    title: 'BUILDING INTELLIGENT CITIES WITH AI, IOT & SUSTAINABLE INFRASTRUCTURE',
    image: '/images/smart-city.jpg',
    link: '/news',
    btnText: 'Explore Mission',
  },
  {
    tag: 'GREEN ENERGY REVOLUTION',
    title: 'POWERING 1.4 BILLION PEOPLE WITH CLEAN, RENEWABLE ENERGY SOURCES',
    image: '/images/green-energy.jpg',
    link: '/news',
    btnText: 'Learn More',
  },
];

const STATS = [
  { label: 'Civic Complaints Resolved', value: 12_40_000, suffix: '+', icon: CheckCircle2 },
  { label: 'Smart Cities in Progress', value: 100, suffix: '+', icon: Building2 },
  { label: 'Districts Covered', value: 739, suffix: '', icon: MapPin },
  { label: 'Citizens Empowered', value: 85_00_000, suffix: '+', icon: Users },
];

const QUICK_SERVICES = [
  { icon: FileText, label: 'File Complaint', desc: 'Report civic issues instantly', path: '/civic', color: '#e74c3c' },
  { icon: Phone, label: 'Helpline 112', desc: 'Emergency services', path: '/emergency', color: '#2ecc71' },
  { icon: GraduationCap, label: 'Education Portal', desc: 'Scholarships & courses', path: '/education', color: '#3498db' },
  { icon: HeartPulse, label: 'Health Services', desc: 'Hospitals & schemes', path: '#', color: '#e91e63' },
  { icon: Train, label: 'Transport', desc: 'Rail, road & metro updates', path: '/transport', color: '#ff9800' },
  { icon: Shield, label: 'Defence News', desc: 'Latest defence updates', path: '/defence', color: '#607d8b' },
];

const NATIONAL_PROBLEMS = [
  {
    id: 1,
    tag: 'Healthcare',
    title: 'Bridging the Rural Medical Gap',
    desc: 'Through telemedicine and AI diagnostics, India is tackling the shortage of doctors in rural areas — ensuring every citizen has access to life-saving healthcare.',
    image: '/images/healthcare.jpg',
    stat: '60%',
    statLabel: 'Rural areas now have telemedicine access',
    icon: HeartPulse,
  },
  {
    id: 2,
    tag: 'Urban Congestion',
    title: 'Decongesting Metros with Smart Transit',
    desc: 'Rapid urbanization causes severe traffic and pollution. New autonomous transit pilots and expanding metro networks are clearing the air and the roads.',
    image: '/images/smart-city.jpg',
    stat: '100+',
    statLabel: 'Cities with smart transit plans',
    icon: Building2,
  },
  {
    id: 3,
    tag: 'Energy Security',
    title: 'Overcoming Power Deficits with Renewables',
    desc: 'Transitioning from coal dependency to massive solar and wind projects to solve power shortages and combat climate change simultaneously.',
    image: '/images/green-energy.jpg',
    stat: '500GW',
    statLabel: 'Renewable capacity target by 2030',
    icon: Zap,
  },
  {
    id: 4,
    tag: 'Water Crisis',
    title: 'Clean Water for Every Household',
    desc: 'The Jal Jeevan Mission is connecting millions of rural homes to piped water, solving decades of drought and clean water scarcity across the nation.',
    image: '/images/water-crisis.jpg',
    stat: '14Cr+',
    statLabel: 'Tap water connections delivered',
    icon: Droplets,
  },
  {
    id: 5,
    tag: 'Pollution',
    title: 'Winning the War on Air Pollution',
    desc: 'From the National Clean Air Programme to EV mandates and industrial emission caps — India is fighting back against toxic air quality.',
    image: '/images/pollution.jpg',
    stat: '131',
    statLabel: 'Cities under Clean Air Programme',
    icon: Leaf,
  },
];

const KEY_INITIATIVES = [
  { title: 'Digital India', desc: 'Transforming governance through technology', image: '/images/digital-india.jpg', link: '/news' },
  { title: 'Skill India', desc: 'Training youth for the jobs of tomorrow', image: '/images/skilling.jpg', link: '/education' },
  { title: 'Space Programme', desc: 'ISRO\'s journey to the stars', image: '/images/space.jpg', link: '/news' },
  { title: 'Clean Energy', desc: 'Solar & wind revolution', image: '/images/green-energy.jpg', link: '/news' },
];

const LATEST_NEWS = [
  { id: 'ln1', tag: 'Policy', title: 'Swachh Bharat Mission Phase 3 Launched for Urban Areas', date: '23 July 2026' },
  { id: 'ln2', tag: 'Technology', title: 'E-Panchayat Systems Integrate AI-Driven Grievance Routing', date: '22 July 2026' },
  { id: 'ln3', tag: 'Infrastructure', title: 'Pre-Monsoon Drain Clearance Operations Reach 85% Completion', date: '21 July 2026' },
  { id: 'ln4', tag: 'Digital India', title: 'NagarSeva AI Platform Crosses 12 Lakh Civic Complaints Filed', date: '20 July 2026' },
  { id: 'ln5', tag: 'Defence', title: 'INS Arighat: India\'s Second Nuclear Submarine Commissioned', date: '19 July 2026' },
  { id: 'ln6', tag: 'Economy', title: 'India GDP Growth Forecast Revised Upward to 7.2% for FY27', date: '18 July 2026' },
];

const PRESS_ITEMS = [
  { id: 1, type: 'Release', date: 'Today', title: 'New "Vision India" Committee Formed to Tackle Urban Poverty' },
  { id: 2, type: 'Release', date: 'July 22, 2026', title: 'National Task Force Proposes AI Solutions for Agricultural Yield Problems' },
  { id: 3, type: 'Release', date: 'July 20, 2026', title: 'Ministry Announces Major Subsidies for Pollution-Control Technologies' },
  { id: 4, type: 'Report', date: 'July 18, 2026', title: 'Annual Civic Infrastructure Performance Index Released — Top 10 Cities Named' },
];

/* ════════════════════════════════════════════
   ANIMATED COUNTER HOOK
   ════════════════════════════════════════════ */
function useCounter(end, duration = 2000, startTrigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startTrigger) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, startTrigger]);
  return count;
}

function StatCard({ stat, inView }) {
  const count = useCounter(stat.value, 2000, inView);
  const Icon = stat.icon;
  const formatted = count >= 100000 ? (count / 100000).toFixed(1) + 'L' : count.toLocaleString('en-IN');
  return (
    <motion.div className={styles.statCard}
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Icon size={28} className={styles.statIcon} />
      <span className={styles.statValue}>{formatted}{stat.suffix}</span>
      <span className={styles.statLabel}>{stat.label}</span>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */
export default function PortalHome() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [problemIdx, setProblemIdx] = useState(0);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(p => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance problems
  useEffect(() => {
    const t = setInterval(() => setProblemIdx(p => (p + 1) % NATIONAL_PROBLEMS.length), 7000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const curProblem = NATIONAL_PROBLEMS[problemIdx];
  const ProblemIcon = curProblem.icon;

  return (
    <div className={styles.portal}>
      {/* ═══ GOV BANNER ═══ */}
      <div className={styles.govStrip}>
        <div className={styles.govStripInner}>
          <img src="/indian-flag.png" alt="Flag" className={styles.flagIcon} />
          <span>An official website of the <strong>Government of India</strong></span>
          <span className={styles.govKnow}>Here's how you know <ChevronDown size={14} /></span>
        </div>
        <div className={styles.govStripSocials}>
          <a href="#">𝕏</a>
          <a href="#">f</a>
          <a href="#">in</a>
        </div>
      </div>

      {/* ═══ NAVBAR ═══ */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.navLogo}>
            <img src="/emblem.svg" alt="State Emblem of India" className={styles.navLogoImg} />
            <span className={styles.navLogoText}>Gov of India</span>
          </Link>
          <div className={styles.navLinks}>
            {NAV_ITEMS.map(item => (
              <Link key={item.id} to={item.path}
                className={styles.navLink}
                onClick={e => item.path === '#' && e.preventDefault()}>
                {item.label}
              </Link>
            ))}
            <button className={styles.navSearchBtn} onClick={() => setSearchOpen(!searchOpen)}><Search size={18} /></button>
            {isAuthenticated ? (
              <div className={styles.navAuthBtns}>
                <Link to="/dashboard" className={styles.navAuthBtn}><LayoutDashboard size={16} /> Dashboard</Link>
                <button onClick={handleLogout} className={styles.navAuthBtn}><LogOut size={16} /> Logout</button>
              </div>
            ) : (
              <div className={styles.navAuthBtns}>
                <Link to="/login" className={styles.navAuthBtn}><LogIn size={16} /> Login</Link>
                <Link to="/signup" className={styles.navAuthBtnPrimary}><UserPlus size={16} /> Sign Up</Link>
              </div>
            )}
          </div>
          <button className={styles.hamburger} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div className={styles.searchBar} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <div className={styles.searchInner}>
                <Search size={18} style={{ color: '#fff' }} />
                <input type="text" placeholder="Search government services, schemes, news..." autoFocus />
                <button onClick={() => setSearchOpen(false)}><X size={18} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div className={styles.mobileMenu} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {NAV_ITEMS.map(item => (
                <Link key={item.id} to={item.path} className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link to="/login" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/signup" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ 1. HERO CAROUSEL ═══ */}
      <section className={styles.heroSection}>
        <AnimatePresence mode="wait">
          <motion.img key={heroIdx} src={HERO_SLIDES[heroIdx].image} alt="Hero"
            className={styles.heroImg}
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
        </AnimatePresence>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <AnimatePresence mode="wait">
              <motion.div key={heroIdx}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <span className={styles.heroTag}>{HERO_SLIDES[heroIdx].tag}</span>
                <h1 className={styles.heroTitle}>{HERO_SLIDES[heroIdx].title}</h1>
                <Link to={HERO_SLIDES[heroIdx].link} className={styles.heroBtn}>
                  {HERO_SLIDES[heroIdx].btnText} <ArrowRight size={18} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {/* Hero dots */}
        <div className={styles.heroDots}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`${styles.heroDot} ${i === heroIdx ? styles.heroDotActive : ''}`}
              onClick={() => setHeroIdx(i)} />
          ))}
        </div>
      </section>

      {/* ═══ 2. STATS BAR ═══ */}
      <section className={styles.statsSection} ref={statsRef}>
        <div className={styles.statsGrid}>
          {STATS.map((stat, i) => <StatCard key={i} stat={stat} inView={statsInView} />)}
        </div>
      </section>

      {/* ═══ 3. QUICK SERVICES ═══ */}
      <section className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Quick Access Services</h2>
          <p className={styles.sectionSubtitle}>Access essential government services at your fingertips</p>
        </div>
        <div className={styles.servicesGrid}>
          {QUICK_SERVICES.map((svc, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              <Link to={svc.path} className={styles.serviceCard}>
                <div className={styles.serviceIconWrap} style={{ background: svc.color + '15', color: svc.color }}>
                  <svc.icon size={28} />
                </div>
                <h3 className={styles.serviceLabel}>{svc.label}</h3>
                <p className={styles.serviceDesc}>{svc.desc}</p>
                <ArrowRight size={16} className={styles.serviceArrow} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ 4. NATIONAL PROBLEMS SPOTLIGHT ═══ */}
      <section className={styles.problemsSection}>
        <div className={styles.problemsBgText}>CHALLENGES</div>
        <div className={styles.sectionHeader} style={{ position: 'relative', zIndex: 1 }}>
          <h2 className={styles.sectionTitleLight}>National Challenges & Solutions</h2>
          <p className={styles.sectionSubtitleLight}>Addressing India's biggest problems with innovative, data-driven solutions</p>
        </div>
        <div className={styles.problemsContainer}>
          <button className={styles.problemArrow} onClick={() => setProblemIdx(p => (p - 1 + NATIONAL_PROBLEMS.length) % NATIONAL_PROBLEMS.length)}>
            <ChevronLeft size={28} />
          </button>
          <div className={styles.problemContent}>
            <AnimatePresence mode="wait">
              <motion.div key={curProblem.id} className={styles.problemSlide}
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}>
                <div className={styles.problemImgWrap}>
                  <img src={curProblem.image} alt={curProblem.title} />
                  <div className={styles.problemStatBadge}>
                    <span className={styles.problemStatValue}>{curProblem.stat}</span>
                    <span className={styles.problemStatLabel}>{curProblem.statLabel}</span>
                  </div>
                </div>
                <div className={styles.problemCard}>
                  <div className={styles.problemTagRow}>
                    <ProblemIcon size={18} />
                    <span>{curProblem.tag}</span>
                  </div>
                  <h2 className={styles.problemTitle}>{curProblem.title}</h2>
                  <p className={styles.problemDesc}>{curProblem.desc}</p>
                  <button className={styles.problemBtn}>Learn More <ArrowRight size={16} /></button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <button className={styles.problemArrow} onClick={() => setProblemIdx(p => (p + 1) % NATIONAL_PROBLEMS.length)}>
            <ChevronRight size={28} />
          </button>
        </div>
        {/* Problem indicator dots */}
        <div className={styles.problemDots}>
          {NATIONAL_PROBLEMS.map((_, i) => (
            <button key={i} className={`${styles.problemDot} ${i === problemIdx ? styles.problemDotActive : ''}`}
              onClick={() => setProblemIdx(i)} />
          ))}
        </div>
      </section>

      {/* ═══ 5. KEY INITIATIVES GRID ═══ */}
      <section className={styles.initiativesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Key Government Initiatives</h2>
          <p className={styles.sectionSubtitle}>Transformative programmes shaping India's future</p>
        </div>
        <div className={styles.initiativesGrid}>
          {KEY_INITIATIVES.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              <Link to={item.link} className={styles.initiativeCard}>
                <img src={item.image} alt={item.title} />
                <div className={styles.initiativeOverlay}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span className={styles.initiativeLink}>Explore <ArrowRight size={14} /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ 6. PRESS + TRIBUTE ═══ */}
      <section className={styles.pressSection}>
        <div className={styles.pressGrid}>
          <div className={styles.pressLeft}>
            <h2 className={styles.pressHeading}>Latest Press Releases</h2>
            {PRESS_ITEMS.map(item => (
              <div key={item.id} className={styles.pressItem}>
                <span className={styles.pressDate}>{item.type} | {item.date}</span>
                <a href="#" className={styles.pressLink}>{item.title}</a>
              </div>
            ))}
            <button className={styles.outlineBtn}>All Press Releases <ArrowRight size={14} /></button>
          </div>
          <div className={styles.pressRight}>
            <h2 className={styles.pressHeading}>Tribute</h2>
            <div className={styles.tributeCard}>
              <img src="/images/ratan-tata.jpg" alt="Tribute" className={styles.tributeImg} />
              <div className={styles.tributeContent}>
                <span className={styles.tributeBadge}>IN MEMORIAM</span>
                <h3 className={styles.tributeName}>Ratan Naval Tata</h3>
                <p className={styles.tributeYears}>1937 — 2024</p>
                <p className={styles.tributeDesc}>
                  Visionary industrialist, beloved philanthropist, and the man who put India on the global business map. 
                  His legacy of compassion and innovation continues to inspire millions.
                </p>
                <div className={styles.tributeQuote}>
                  "I don't believe in taking right decisions. I take decisions and then make them right."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. NEWS TICKER ═══ */}
      <section className={styles.newsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Updates</h2>
          <Link to="/news" className={styles.viewAllLink}>View All News <ArrowRight size={14} /></Link>
        </div>
        <div className={styles.newsGrid}>
          {LATEST_NEWS.map((news, i) => (
            <motion.div key={news.id} className={styles.newsCard}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <span className={styles.newsTag}>{news.tag}</span>
              <h3 className={styles.newsTitle}>{news.title}</h3>
              <span className={styles.newsDate}><Clock size={12} /> {news.date}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ 8. MEDIA CATEGORIES ═══ */}
      <section className={styles.mediaCats}>
        <Link to="/civic" className={styles.mediaCatItem}>
          <img src="/images/pollution.jpg" alt="Civic Complaint" />
          <div className={styles.mediaCatOverlay} />
          <div className={styles.mediaCatContent}>
            <AlertTriangle size={32} />
            <span className={styles.mediaCatLabel}>File a Complaint</span>
            <span className={styles.mediaCatSub}>Report civic issues in your area</span>
          </div>
        </Link>
        <Link to="/multimedia" className={styles.mediaCatItem}>
          <img src="/images/education.jpg" alt="Multimedia" />
          <div className={styles.mediaCatOverlay} />
          <div className={styles.mediaCatContent}>
            <Play size={32} />
            <span className={styles.mediaCatLabel}>Multimedia</span>
            <span className={styles.mediaCatSub}>Photos, videos & galleries</span>
          </div>
        </Link>
        <Link to="/education" className={styles.mediaCatItem}>
          <img src="/images/skilling.jpg" alt="Education" />
          <div className={styles.mediaCatOverlay} />
          <div className={styles.mediaCatContent}>
            <GraduationCap size={32} />
            <span className={styles.mediaCatLabel}>Education Portal</span>
            <span className={styles.mediaCatSub}>Scholarships, courses & resources</span>
          </div>
        </Link>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <img src="/ashok-stambh.jpg" alt="Emblem" className={styles.footerEmblemImg} />
            <div>
              <h4 className={styles.footerBrandName}>Government of India</h4>
              <p className={styles.footerBrandDesc}>Building a stronger, more inclusive, and innovative nation for every citizen.</p>
            </div>
          </div>
          <div className={styles.footerSocials}>
            <a href="#" className={styles.footerSocialBtn}>𝕏</a>
            <a href="#" className={styles.footerSocialBtn}>f</a>
            <a href="#" className={styles.footerSocialBtn}>in</a>
            <a href="#" className={styles.footerSocialBtn}>▶</a>
          </div>
        </div>
        <div className={styles.footerContent}>
          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>PORTAL</h4>
            <Link to="/">Home</Link>
            <Link to="/news">News</Link>
            <Link to="/civic">Civic Complaint</Link>
            <Link to="/about-us">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>SERVICES</h4>
            <a href="#">File a Complaint</a>
            <a href="#">Track Complaint</a>
            <a href="#">RTI Portal</a>
            <a href="#">e-Governance</a>
            <a href="#">Data Portal</a>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>INITIATIVES</h4>
            <a href="#">Digital India</a>
            <a href="#">Smart Cities</a>
            <a href="#">Swachh Bharat</a>
            <a href="#">Make in India</a>
            <a href="#">Skill India</a>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>RESOURCES</h4>
            <a href="#">Press Releases</a>
            <a href="#">Careers</a>
            <a href="#">Help Center</a>
            <a href="#">Official Gazette</a>
            <a href="#">Annual Report</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 Government of India. All Rights Reserved.</p>
          <div className={styles.footerBottomLinks}>
            <Link to="/privacy">Privacy Policy</Link>
            <a href="#">Terms of Service</a>
            <a href="#">Accessibility</a>
            <a href="#">Site Map</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
