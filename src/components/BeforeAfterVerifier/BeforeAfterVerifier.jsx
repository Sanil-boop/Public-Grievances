import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import styles from './BeforeAfterVerifier.module.css';

/**
 * BeforeAfterVerifier
 * ────────────────────
 * Draggable slider that reveals before/after images side-by-side.
 * Includes citizen verification and dispute controls.
 */
export default function BeforeAfterVerifier({
  beforeImage,
  afterImage,
  complaintId,
  isVerified = false,
  isDisputed = false,
  onVerify,
  onDispute,
}) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // ── Drag logic ────────────────────────────────────────────────────────────

  const getPositionFromEvent = useCallback((clientX) => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = (x / rect.width) * 100;
    return Math.max(0, Math.min(100, pct));
  }, []);

  const handlePointerDown = useCallback((e) => {
    isDragging.current = true;
    setSliderPos(getPositionFromEvent(e.clientX));
    containerRef.current?.setPointerCapture(e.pointerId);
  }, [getPositionFromEvent]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    setSliderPos(getPositionFromEvent(e.clientX));
  }, [getPositionFromEvent]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // ── Placeholder state ────────────────────────────────────────────────────

  if (!beforeImage || !afterImage) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>📷</span>
          <p className={styles.placeholderText}>
            Before &amp; After images are not yet available for complaint
            {complaintId ? ` #${complaintId}` : ''}.
          </p>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div className={styles.wrapper}>
      {/* Badge row */}
      {(isVerified || isDisputed) && (
        <div className={styles.badgeRow}>
          {isVerified && (
            <span className={styles.verifiedBadge}>
              <CheckCircle2 size={14} /> Verified by Citizen
            </span>
          )}
          {isDisputed && (
            <span className={styles.disputedBadge}>
              <XCircle size={14} /> Resolution Disputed
            </span>
          )}
        </div>
      )}

      {/* Slider container */}
      <div
        className={styles.sliderContainer}
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* After image (full background) */}
        <img
          className={styles.afterImg}
          src={afterImage}
          alt="After resolution"
          draggable={false}
        />

        {/* Before image (clipped by slider) */}
        <div
          className={styles.beforeClip}
          style={{ width: `${sliderPos}%` }}
        >
          <img
            className={styles.beforeImg}
            src={beforeImage}
            alt="Before resolution"
            draggable={false}
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
          />
        </div>

        {/* Labels */}
        <span className={`${styles.label} ${styles.labelBefore}`}>BEFORE</span>
        <span className={`${styles.label} ${styles.labelAfter}`}>AFTER</span>

        {/* Slider handle */}
        <div
          className={styles.handle}
          style={{ left: `${sliderPos}%` }}
        >
          <div className={styles.handleBar} />
        </div>
      </div>

      {/* Action buttons */}
      {!isVerified && !isDisputed && (
        <div className={styles.actions}>
          <motion.button
            className={styles.verifyBtn}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onVerify?.(complaintId)}
          >
            Citizen Verified ✓
          </motion.button>
          <motion.button
            className={styles.disputeBtn}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onDispute?.(complaintId)}
          >
            Dispute Resolution ✗
          </motion.button>
        </div>
      )}
    </div>
  );
}
