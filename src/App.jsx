import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import RightDrawer from './components/Layout/RightDrawer';
import BottomNav from './components/Layout/BottomNav';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import History from './pages/History';
import Analytics from './pages/Analytics';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import LandingPage from './pages/LandingPage';
import PortalHome from './pages/PortalHome';
import NewsPage from './pages/NewsPage';
import MultimediaPage from './pages/MultimediaPage';
import EducationPage from './pages/EducationPage';
import EmergencyServices from './pages/EmergencyServices';
import DefencePortal from './pages/DefencePortal';
import TransportPortal from './pages/TransportPortal';
import TransportComplaint from './pages/TransportComplaint';
import TransportLogin from './pages/TransportLogin';
import TransportSignup from './pages/TransportSignup';
import CategoryDetail from './pages/CategoryDetail';
import DepartmentDashboard from './pages/DepartmentDashboard';
import LocationSelector from './pages/LocationSelector';
import AiGuide from './pages/AiGuide';
import IncidentMap from './pages/IncidentMap';
import Chatbot from './components/Chatbot/Chatbot';
import { initClassifier } from './nlp/classifier';
import { initTransportClassifier } from './nlp/transportClassifier';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';
import PredictiveHeatmap from './pages/PredictiveHeatmap';
import WhatsAppBot from './components/WhatsAppBot/WhatsAppBot';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/Toast/Toast';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import './index.css';

const PAGE_TITLES = {
  '/': 'Public Grievances',
  '/dashboard': 'Dashboard',
  '/department': 'Department Portal',
  '/new': 'File New Complaint',
  '/history': 'Complaint History',
  '/analytics': 'Analytics',
  '/about': 'About',
  '/about-us': 'About Us',
  '/privacy': 'Privacy Policy',
  '/contact': 'Contact Us',
  '/login': 'Login to Civic Complaint Portal',
  '/signup': 'Sign Up to Civic Complaint Portal',
  '/profile-setup': 'Profile Setup',
  '/ai-guide': 'AI Guide',
  '/heatmap': 'Predictive Heatmap',
  '/whatsapp': 'WhatsApp Service',
  '/civic': 'Civic Complaint',
  '/news': 'News',
  '/multimedia': 'Multimedia',
  '/education': 'Education Portal',
  '/emergency': 'Emergency Services',
  '/defence': 'Defence',
  '/transport': 'Transport Complaint Portal',
  '/transport-login': 'Login to Transport Portal',
  '/transport-signup': 'Sign Up to Transport Portal',
};

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

// Pages that should NOT show sidebar/header
const FULL_WIDTH_PAGES = ['/', '/civic', '/news', '/multimedia', '/education', '/emergency', '/defence', '/transport', '/transport-login', '/transport-signup', '/login', '/signup', '/profile-setup', '/about-us', '/privacy', '/contact', '/whatsapp'];

function AnimatedRoutes({ classifierReady, onMenuClick, onDrawerOpen }) {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Public Grievances';
  const isFullPage = FULL_WIDTH_PAGES.includes(location.pathname);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <>
      {!isFullPage && (
        <Header
          title={pageTitle}
          modelLoaded={classifierReady}
          onMenuClick={onMenuClick}
          onDrawerOpen={onDrawerOpen}
        />
      )}
      <div className={isFullPage ? '' : 'page-content'}>
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/" element={<PortalHome />} />
              <Route path="/civic" element={<LandingPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/multimedia" element={<MultimediaPage />} />
              <Route path="/education" element={<EducationPage />} />
              
              {/* Protected Routes */}
              <Route path="/select-state" element={<ProtectedRoute><LocationSelector /></ProtectedRoute>} />
              <Route path="/select-district/:state" element={<ProtectedRoute><LocationSelector /></ProtectedRoute>} />
              <Route path="/select-city/:state/:district" element={<ProtectedRoute><LocationSelector /></ProtectedRoute>} />
              <Route path="/:state/:district/:city/new" element={<ProtectedRoute><NewComplaint /></ProtectedRoute>} />
              <Route path="/:state/:district/:city/department" element={<ProtectedRoute><DepartmentDashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><IncidentMap /></ProtectedRoute>} />
              <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
              <Route path="/ai-guide" element={<ProtectedRoute><AiGuide /></ProtectedRoute>} />
              <Route path="/heatmap" element={<ProtectedRoute><PredictiveHeatmap /></ProtectedRoute>} />
              <Route path="/category/:categoryId" element={<ProtectedRoute><CategoryDetail /></ProtectedRoute>} />

              {/* Public Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/emergency" element={<EmergencyServices />} />
              <Route path="/defence" element={<DefencePortal />} />
              <Route path="/transport" element={<TransportPortal />} />
              <Route path="/transport-login" element={<TransportLogin />} />
              <Route path="/transport-signup" element={<TransportSignup />} />
              <Route path="/:state/:district/:city/transport-complaint" element={<ProtectedRoute><TransportComplaint /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/whatsapp" element={<WhatsAppBot />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [classifierReady, setClassifierReady] = useState(false);
  const location = useLocation();
  const isFullPage = FULL_WIDTH_PAGES.includes(location.pathname);

  useEffect(() => {
    initClassifier()
      .then(() => {
        setClassifierReady(true);
        console.log('✅ NagarSeva AI classifier initialized');
      })
      .catch(err => {
        console.error('Classifier init error:', err);
        setClassifierReady(true);
      });

    initTransportClassifier()
      .then(() => {
        console.log('✅ Transport AI classifier initialized');
      })
      .catch(err => {
        console.error('Transport classifier init error:', err);
      });
  }, []);

  useEffect(() => {
    const noWatermarkRoutes = ['/', '/login', '/signup', '/profile-setup'];
    if (noWatermarkRoutes.includes(location.pathname)) {
      document.body.classList.add('no-watermark');
    } else {
      document.body.classList.remove('no-watermark');
    }
  }, [location.pathname]);

  return (
    <div className="app-layout">
      {!isFullPage && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <main className={isFullPage ? 'main-content-full' : 'main-content'}>
        <AnimatedRoutes
          classifierReady={classifierReady}
          onMenuClick={() => setSidebarOpen(true)}
          onDrawerOpen={() => setDrawerOpen(true)}
        />
      </main>
      {/* Right Drawer — always in DOM, visibility controlled internally */}
      <RightDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      {!isFullPage && <BottomNav />}
      <Chatbot />
      <ScrollToTop />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
