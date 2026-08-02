import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Type,
  Send,
  CheckCircle,
  Globe,
  Sparkles,
  Camera,
  MapPin,
  Scan,
  AlertTriangle,
  Shield,
  Copy,
  Train,
} from 'lucide-react';
import VoiceRecorder from '../components/VoiceRecorder/VoiceRecorder';
import PhotoUploader from '../components/PhotoUploader/PhotoUploader';
import HazardScanner from '../components/HazardScanner/HazardScanner';
import ClassificationResult from '../components/ClassificationResult/ClassificationResult';
import ConfidenceMeter from '../components/ConfidenceMeter/ConfidenceMeter';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { classifyTransportComplaint } from '../nlp/transportClassifier';
import { analyzePriority } from '../nlp/SmartPriority';
import { analyzeSentiment } from '../nlp/SentimentAnalyzer';
import { findDuplicates } from '../nlp/DuplicateDetector';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES } from '../utils/constants';
import styles from './NewComplaint.module.css';

const MAX_CHARS = 1000;

export default function TransportComplaint() {
  const { state: paramState, district, city } = useParams();
  const { state: appState, actions } = useApp();
  const { isAuthenticated, addKarma } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-IN');
  const selectedLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const [area, setArea] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [result, setResult] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [priorityInfo, setPriorityInfo] = useState(null);
  const [sentimentInfo, setSentimentInfo] = useState(null);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [dismissedDuplicates, setDismissedDuplicates] = useState(false);
  const debounceRef = useRef(null);

  // Debounced classification using TRANSPORT classifier
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim() || text.trim().length < 10) {
      setResult(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      // Simulate Translation delay if regional language
      if (language !== 'en-IN' && language !== 'hi-IN' && language !== 'hi-EN') {
        setIsTranslating(true);
        await new Promise(r => setTimeout(r, 1200));
        setIsTranslating(false);
      }

      setIsClassifying(true);
      try {
        const classification = classifyTransportComplaint(text);
        setResult(classification);

        // Smart Priority analysis
        const defaultPriority = classification.department?.priority || 'normal';
        const priority = analyzePriority(text, defaultPriority);
        setPriorityInfo(priority);

        // Sentiment analysis
        const sentiment = analyzeSentiment(text);
        setSentimentInfo(sentiment);

        // Duplicate detection
        const location = { state: paramState, district, city, area };
        const transportComplaints = (appState.complaints || []).filter(c => c.portal === 'transport');
        const dupes = findDuplicates(text, location, transportComplaints);
        setDuplicateInfo(dupes);
        if (!dupes.hasDuplicates) setDismissedDuplicates(false);
      } catch {
        setResult(null);
      } finally {
        setIsClassifying(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, language, appState.complaints, paramState, district, city, area]);

  const handleVoiceTranscript = useCallback((transcript) => {
    setText((prev) => {
      const combined = prev ? `${prev} ${transcript}` : transcript;
      return combined.slice(0, MAX_CHARS);
    });
  }, []);

  const handlePhotoText = useCallback((extractedText) => {
    setText((prev) => {
      const combined = prev ? `${prev} ${extractedText}` : extractedText;
      return combined.slice(0, MAX_CHARS);
    });
  }, []);

  const handleScanComplete = useCallback((scanData) => {
    setText(scanData.text);
    if (scanData.photo) {
      setCapturedPhoto(scanData.photo);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isAuthenticated) {
      if (window.confirm('You must be signed in to file a transport complaint. Go to Login page?')) {
        navigate('/transport-login');
      }
      return;
    }

    if (!text.trim() || !result) return;

    const topPred = result.predictions[0];
    const priority = priorityInfo?.suggestedPriority
      || (result.department?.priority
        ? result.department.priority.charAt(0).toUpperCase() + result.department.priority.slice(1)
        : 'Normal');

    await actions.addComplaint({
      text: text.trim(),
      category: result.topCategory,
      categoryName: result.topCategoryName,
      icon: topPred.icon,
      department: result.department?.name || 'Regional Transport Office',
      priority,
      confidence: result.topConfidence,
      sentiment: sentimentInfo || analyzeSentiment(text.trim()),
      predictions: result.predictions,
      language,
      beforeImage: capturedPhoto,
      portal: 'transport',
      vehicleNumber: vehicleNumber.trim(),
      routeNumber: routeNumber.trim(),
      location: {
        state: paramState,
        district: district,
        city: city,
        area: area.trim()
      }
    });

    if (addKarma) {
      addKarma(10);
    }

    setShowSuccess(true);
  }, [text, result, sentimentInfo, language, paramState, district, city, area, actions, addKarma, isAuthenticated, navigate, priorityInfo?.suggestedPriority, capturedPhoto, vehicleNumber, routeNumber]);

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setText('');
    setResult(null);
    setVehicleNumber('');
    setRouteNumber('');
  };

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Transport Portal Header Badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 16px', marginBottom: '20px',
        borderRadius: '12px',
        background: 'rgba(255, 152, 0, 0.08)',
        border: '1px solid rgba(255, 152, 0, 0.2)',
      }}>
        <Train size={20} style={{ color: '#ff9800' }} />
        <span style={{ fontWeight: 700, color: '#ff9800', fontSize: '1rem' }}>
          Transport Complaint Portal
        </span>
        <span style={{ color: '#a0a0b0', fontSize: '0.85rem', marginLeft: 'auto' }}>
          AI-Powered Classification
        </span>
      </div>

      <div className={styles.layout}>
        {/* Left - Input Section */}
        <div className={styles.inputSection}>
          {/* Language Selector */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Globe size={16} className={styles.cardTitleIcon} />
              Select Language
            </h3>
            <div className={styles.langSelector}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`${styles.langOption} ${
                    language === lang.code ? styles.langOptionActive : ''
                  }`}
                  onClick={() => setLanguage(lang.code)}
                  title={lang.label}
                >
                  <span className={styles.langFlag}>{lang.flag}</span>
                  <span className={styles.langLabel}>{lang.label}</span>
                  <span className={styles.langShort}>{lang.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Recorder */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Mic size={16} className={styles.cardTitleIcon} />
              Voice Input
            </h3>
            <VoiceRecorder
              onTranscript={handleVoiceTranscript}
              language={language === 'hi-EN' ? 'hi-IN' : language}
            />
          </div>

          {/* Photo Upload & AR Scanner */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className={styles.card} style={{ marginBottom: 0 }}>
              <h3 className={styles.cardTitle}>
                <Camera size={16} className={styles.cardTitleIcon} />
                Photo to Text
              </h3>
              <PhotoUploader
                onTextExtracted={handlePhotoText}
                onImageCaptured={setCapturedPhoto}
                language={language}
                ocrLang={selectedLang.ocrLang}
              />
            </div>
            <div className={styles.card} style={{ marginBottom: 0 }}>
              <h3 className={styles.cardTitle}>
                <Scan size={16} className={styles.cardTitleIcon} />
                AR Scanner
              </h3>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: '#a0a0b0', marginBottom: '16px' }}>
                  Auto-detect issue dimensions
                </p>
                <button 
                  onClick={() => setShowScanner(true)}
                  style={{
                    background: 'rgba(255, 152, 0, 0.1)',
                    border: '1px solid #ff9800',
                    color: '#ff9800',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    fontWeight: 500
                  }}
                >
                  <Scan size={16} /> Scan Hazard
                </button>
              </div>
            </div>
          </div>

          {/* Transport-Specific Fields */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Train size={16} className={styles.cardTitleIcon} />
              Transport Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input
                type="text"
                placeholder="Vehicle / Bus Number (Optional)"
                className={styles.locInput}
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Route Number (Optional)"
                className={styles.locInput}
                value={routeNumber}
                onChange={(e) => setRouteNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Location Details */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <MapPin size={16} className={styles.cardTitleIcon} />
              Location Details
            </h3>
            <div className={styles.locationInfo}>
              <p>Filing for: <strong>{city}, {district}, {paramState}</strong></p>
              <Link to="/select-state" className={styles.changeLocLink}>Change Location</Link>
            </div>
            <div className={styles.locationGrid}>
              <input type="text" placeholder="Stop / Station / Landmark (Optional)" className={styles.locInput} value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
          </div>

          {/* Text Input */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Type size={16} className={styles.cardTitleIcon} />
              Describe Your Transport Issue
            </h3>
            <div className={styles.textAreaWrapper}>
              <textarea
                className={styles.textArea}
                value={text}
                onChange={(e) =>
                  setText(e.target.value.slice(0, MAX_CHARS))
                }
                placeholder={
                  language === 'hi'
                    ? 'अपनी परिवहन शिकायत यहाँ लिखें...'
                    : 'Describe your transport complaint here... (e.g., bus was 30 min late, auto refused meter)'
                }
                maxLength={MAX_CHARS}
              />
              <span
                className={`${styles.charCount} ${
                  text.length > MAX_CHARS * 0.9 ? styles.charCountWarn : ''
                }`}
              >
                {text.length}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Smart Priority Badge */}
          {priorityInfo && result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: priorityInfo.upgraded
                  ? 'rgba(225, 112, 85, 0.12)'
                  : 'rgba(255, 152, 0, 0.1)',
                border: `1px solid ${priorityInfo.upgraded ? 'rgba(225, 112, 85, 0.3)' : 'rgba(255, 152, 0, 0.2)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.85rem',
              }}
            >
              <Shield size={16} style={{ color: priorityInfo.upgraded ? '#e17055' : '#ff9800', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, color: priorityInfo.upgraded ? '#e17055' : '#ff9800' }}>
                  AI Priority: {priorityInfo.suggestedPriority}
                </span>
                {priorityInfo.upgraded && (
                  <span style={{ color: '#a0a0b0', marginLeft: '8px', fontSize: '0.8rem' }}>
                    ⬆ Upgraded from {result.department?.priority || 'normal'}
                  </span>
                )}
                <div style={{ color: '#8888a0', fontSize: '0.75rem', marginTop: '2px' }}>
                  {priorityInfo.reason}
                </div>
              </div>
            </motion.div>
          )}

          {/* Sentiment Badge */}
          {sentimentInfo && sentimentInfo.sentiment !== 'calm' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: `${sentimentInfo.color}15`,
                border: `1px solid ${sentimentInfo.color}40`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{sentimentInfo.emoji}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: sentimentInfo.color, fontWeight: 600, fontSize: '0.85rem' }}>
                  {sentimentInfo.label} {sentimentInfo.isCritical && '(Critical)'}
                </span>
                {sentimentInfo.isCritical && (
                  <span style={{ color: '#a0a0b0', fontSize: '0.75rem' }}>
                    This complaint has been flagged as critical priority.
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Duplicate Warning */}
          {duplicateInfo?.hasDuplicates && !dismissedDuplicates && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'rgba(253, 203, 110, 0.1)',
                border: '1px solid rgba(253, 203, 110, 0.3)',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertTriangle size={16} style={{ color: '#fdcb6e', flexShrink: 0 }} />
                <span style={{ fontWeight: 600, color: '#fdcb6e' }}>
                  Similar Complaint Found
                </span>
              </div>
              {duplicateInfo.duplicates.slice(0, 2).map((dup, i) => (
                <div key={i} style={{
                  padding: '8px 10px',
                  marginBottom: '6px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ color: '#d0d0e0', fontSize: '0.8rem', lineHeight: 1.4 }}>
                    <Copy size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    "{dup.complaint.text?.slice(0, 80)}..."
                  </div>
                  <div style={{ color: '#8888a0', fontSize: '0.72rem', marginTop: '3px' }}>
                    {Math.round(dup.similarity * 100)}% similar · {dup.matchType} · Filed {new Date(dup.complaint.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setDismissedDuplicates(true)}
                style={{
                  background: 'rgba(253, 203, 110, 0.15)',
                  border: '1px solid rgba(253, 203, 110, 0.3)',
                  color: '#fdcb6e',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  marginTop: '4px',
                }}
              >
                File Anyway
              </button>
            </motion.div>
          )}

          {/* Photo Preview */}
          {capturedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '10px',
                borderRadius: '12px',
                background: 'rgba(255, 152, 0, 0.06)',
                border: '1px solid rgba(255, 152, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <img
                src={capturedPhoto}
                alt="Attached evidence"
                style={{ width: 56, height: 56, borderRadius: '8px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, fontSize: '0.82rem', color: '#a0a0b0' }}>
                📎 Photo evidence attached
              </div>
              <button
                onClick={() => setCapturedPhoto(null)}
                style={{ background: 'none', border: 'none', color: '#e17055', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Remove
              </button>
            </motion.div>
          )}

          {/* Submit */}
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!text.trim() || !result || isClassifying || isTranslating}
            style={{
              background: (!text.trim() || !result || isClassifying || isTranslating)
                ? undefined
                : 'linear-gradient(135deg, #ff9800, #f57c00)'
            }}
          >
            <Send size={18} />
            {isTranslating ? `Translating from ${selectedLang.label} to English...` : isClassifying ? 'Classifying…' : 'Submit Transport Complaint'}
          </button>
        </div>

        {/* Right - Results Section */}
        <div className={styles.resultsSection}>
          {/* Confidence Meter */}
          {result && (
            <motion.div
              className={`${styles.card} ${styles.meterCard}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              <ConfidenceMeter
                confidence={result.topConfidence || result.predictions[0]?.confidence || 0}
                size={160}
                label="Top Prediction"
              />
            </motion.div>
          )}

          {/* Classification Results */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Sparkles size={16} className={styles.cardTitleIcon} />
              AI Transport Classification
            </h3>
            <ClassificationResult result={result} />
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className={styles.successOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseSuccess}
          >
            <motion.div
              className={styles.successCard}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.successIcon}>
                <CheckCircle size={36} />
              </div>
              <h2 className={styles.successTitle}>Transport Complaint Filed!</h2>
              <p className={styles.successDesc}>
                Your transport complaint has been classified by AI and routed to the appropriate
                transport authority. You can track its progress in the History section.
              </p>
              <button
                className={styles.successBtn}
                onClick={handleCloseSuccess}
              >
                File Another
              </button>
            </motion.div>
          </motion.div>
        )}

        {showScanner && (
          <HazardScanner 
            onClose={() => setShowScanner(false)} 
            onScanComplete={(data) => {
              setShowScanner(false);
              handleScanComplete(data);
            }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
