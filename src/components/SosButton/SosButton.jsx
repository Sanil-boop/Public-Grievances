import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Phone, MapPin, CheckCircle2, X } from 'lucide-react';
import styles from './SosButton.module.css';

export default function SosButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, dispatching, success

  const handleSos = () => {
    setStatus('dispatching');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div 
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {status === 'idle' && (
              <>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                  <X size={20} />
                </button>
                <div className={styles.iconWrapper}>
                  <AlertOctagon size={48} color="#ff4757" />
                </div>
                <h2 className={styles.title}>Critical Emergency</h2>
                <p className={styles.desc}>
                  Are you reporting a life-threatening civic hazard? (e.g. fallen live wire, major structural collapse)
                </p>
                
                <div className={styles.infoBox}>
                  <div className={styles.infoRow}>
                    <MapPin size={16} color="#a0a0b0" />
                    <span>Fetching exact GPS coordinates...</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Phone size={16} color="#a0a0b0" />
                    <span>Will alert local authorities & politicians</span>
                  </div>
                </div>

                <button className={styles.dispatchBtn} onClick={handleSos}>
                  Slide to Dispatch SOS
                </button>
                <button className={styles.cancelBtn} onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
              </>
            )}

            {status === 'dispatching' && (
              <div className={styles.dispatchingState}>
                <div className={styles.pulseRing}></div>
                <AlertOctagon size={48} color="#ff4757" className={styles.pulseIcon} />
                <h3>Dispatching Emergency Alert...</h3>
                <p>Contacting nearest quick-response team.</p>
              </div>
            )}

            {status === 'success' && (
              <div className={styles.successState}>
                <CheckCircle2 size={48} color="#00b894" />
                <h3>Help is on the way</h3>
                <p>Authorities have been notified with your coordinates.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button className={styles.sosTrigger} onClick={() => setIsOpen(true)}>
        <AlertOctagon size={16} /> <span className={styles.sosText}>SOS</span>
      </button>

      {createPortal(modalContent, document.body)}
    </>
  );
}
