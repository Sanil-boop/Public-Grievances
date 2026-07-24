import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Search,
  Mail,
  Phone,
  MapPin,
  Download,
  MessageSquare,
  HelpCircle,
  Shield,
  FileText,
  ExternalLink,
  ChevronRight,
  Star,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './RightDrawer.module.css';

export default function RightDrawer({ isOpen, onClose }) {
  const { state } = useApp();
  const navigate = useNavigate();
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const drawerRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Track complaint by email or ID
  const handleTrack = () => {
    setTrackError('');
    setTrackResult(null);

    if (!trackInput.trim()) {
      setTrackError('Please enter an email or complaint ID');
      return;
    }

    const complaints = state?.complaints || [];
    const input = trackInput.trim().toLowerCase();

    // Search by email match or complaint text match
    const found = complaints.filter(
      (c) =>
        c.text?.toLowerCase().includes(input) ||
        c.id?.toString().includes(input) ||
        c.createdAt?.includes(input)
    );

    if (found.length > 0) {
      setTrackResult(found);
    } else {
      setTrackError('No complaints found. Try a different search term or file a new complaint.');
    }
  };

  // Download complaints as CSV
  const handleExport = () => {
    const complaints = state?.complaints || [];
    if (complaints.length === 0) {
      alert('No complaints to export.');
      return;
    }

    const headers = ['#', 'Category', 'Status', 'Priority', 'Department', 'Text', 'Date'];
    const rows = complaints.map((c, i) => [
      i + 1,
      c.categoryName || c.category,
      c.status,
      c.priority,
      c.department,
      `"${(c.text || '').replace(/"/g, '""')}"`,
      c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '',
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NagarSeva_Complaints_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Feedback submit
  const handleFeedback = () => {
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setFeedbackText('');
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  const goToPage = (path) => {
    navigate(path);
    onClose?.();
  };

  const HELPLINES = [
    { name: 'Municipal Helpline', number: '1800-XXX-1234', icon: Phone },
    { name: 'Water Emergency', number: '1800-XXX-5678', icon: AlertTriangle },
    { name: 'Electricity Emergency', number: '1800-XXX-9012', icon: AlertTriangle },
    { name: 'Police Control Room', number: '100', icon: Shield },
    { name: 'Fire Department', number: '101', icon: Phone },
    { name: 'Women Helpline', number: '1091', icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          >
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <div>
                <h2 className={styles.drawerTitle}>Quick Actions</h2>
                <p className={styles.drawerSubtitle}>Tools & Services</p>
              </div>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* ── Track Complaint ── */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Search size={15} />
                  Track Your Complaint
                </h3>
                <p className={styles.sectionDesc}>
                  Search by email, keyword, or complaint ID
                </p>
                <div className={styles.trackRow}>
                  <input
                    className={styles.trackInput}
                    type="text"
                    placeholder="Enter email / keyword / ID..."
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                  />
                  <button className={styles.trackBtn} onClick={handleTrack}>
                    Search
                  </button>
                </div>
                {trackError && (
                  <p className={styles.trackError}>{trackError}</p>
                )}
                {trackResult && (
                  <div className={styles.trackResults}>
                    <p className={styles.trackFound}>
                      Found {trackResult.length} complaint(s)
                    </p>
                    {trackResult.slice(0, 3).map((c, i) => (
                      <div key={i} className={styles.trackCard}>
                        <div className={styles.trackCardTop}>
                          <span className={styles.trackCategory}>
                            {c.icon} {c.categoryName || c.category}
                          </span>
                          <span
                            className={`${styles.trackStatus} ${
                              styles['trackStatus_' + (c.status || 'pending')]
                            }`}
                          >
                            {c.status || 'Pending'}
                          </span>
                        </div>
                        <p className={styles.trackText}>
                          {(c.text || '').slice(0, 80)}
                          {(c.text || '').length > 80 ? '…' : ''}
                        </p>
                      </div>
                    ))}
                    {trackResult.length > 3 && (
                      <button
                        className={styles.viewAllBtn}
                        onClick={() => goToPage('/history')}
                      >
                        View All in History
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                )}
              </section>

              {/* ── Quick Links ── */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <ExternalLink size={15} />
                  Quick Links
                </h3>
                <div className={styles.quickLinks}>
                  <button className={styles.quickLink} onClick={() => goToPage('/new')}>
                    <FileText size={16} />
                    <span>File New Complaint</span>
                    <ChevronRight size={14} className={styles.qlArrow} />
                  </button>
                  <button className={styles.quickLink} onClick={() => goToPage('/history')}>
                    <Clock size={16} />
                    <span>View All Complaints</span>
                    <ChevronRight size={14} className={styles.qlArrow} />
                  </button>
                  <button className={styles.quickLink} onClick={() => goToPage('/analytics')}>
                    <Star size={16} />
                    <span>Analytics Dashboard</span>
                    <ChevronRight size={14} className={styles.qlArrow} />
                  </button>
                  <button className={styles.quickLink} onClick={handleExport}>
                    <Download size={16} />
                    <span>Export as CSV</span>
                    <ChevronRight size={14} className={styles.qlArrow} />
                  </button>
                  <button className={styles.quickLink} onClick={() => goToPage('/about')}>
                    <HelpCircle size={16} />
                    <span>FAQs & Help</span>
                    <ChevronRight size={14} className={styles.qlArrow} />
                  </button>
                </div>
              </section>

              {/* ── Emergency Helplines ── */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Phone size={15} />
                  Emergency Helplines
                </h3>
                <div className={styles.helplines}>
                  {HELPLINES.map((h, i) => (
                    <div key={i} className={styles.helplineItem}>
                      <h.icon size={14} className={styles.helplineIcon} />
                      <span className={styles.helplineName}>{h.name}</span>
                      <a href={`tel:${h.number}`} className={styles.helplineNumber}>
                        {h.number}
                      </a>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Contact Us ── */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Mail size={15} />
                  Contact Us
                </h3>
                <div className={styles.contactItems}>
                  <div className={styles.contactItem}>
                    <Mail size={14} />
                    <span>support@nagarseva.gov.in</span>
                  </div>
                  <div className={styles.contactItem}>
                    <Phone size={14} />
                    <span>1800-XXX-0000 (Toll Free)</span>
                  </div>
                  <div className={styles.contactItem}>
                    <MapPin size={14} />
                    <span>Municipal Corporation HQ, City Center</span>
                  </div>
                </div>
              </section>

              {/* ── Feedback ── */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <MessageSquare size={15} />
                  Send Feedback
                </h3>
                {feedbackSent ? (
                  <div className={styles.feedbackSuccess}>
                    ✅ Thank you for your feedback!
                  </div>
                ) : (
                  <>
                    <textarea
                      className={styles.feedbackInput}
                      placeholder="Tell us how we can improve..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={3}
                    />
                    <button
                      className={styles.feedbackBtn}
                      onClick={handleFeedback}
                      disabled={!feedbackText.trim()}
                    >
                      Submit Feedback
                    </button>
                  </>
                )}
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
