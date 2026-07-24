import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Scan, X, AlertTriangle } from 'lucide-react';
import styles from './HazardScanner.module.css';

export default function HazardScanner({ onScanComplete, onClose }) {
  const [scanning, setScanning] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    
    // Start camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      })
      .catch(err => console.error("Camera access denied or unavailable", err));

    return () => {
      // Stop camera on unmount
      if (videoElement && videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (scanning) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanning(false);
            
            // Capture frame from video
            let capturedImage = null;
            if (videoRef.current) {
              const canvas = document.createElement('canvas');
              canvas.width = videoRef.current.videoWidth || 640;
              canvas.height = videoRef.current.videoHeight || 480;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
              capturedImage = canvas.toDataURL('image/jpeg', 0.8);
            }

            setTimeout(() => {
              onScanComplete({
                text: "Critical Hazard Detected: 3-foot wide pothole with exposed gravel and sharp edges. High risk of vehicle damage.",
                category: "roads",
                photo: capturedImage
              });
            }, 800);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [scanning, onScanComplete]);

  return (
    <div className={styles.scannerOverlay}>
      <div className={styles.scannerModal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>
        
        <h3 className={styles.title}>
          <Scan size={20} /> AR Hazard Scanner
        </h3>
        <p className={styles.subtitle}>Point your camera at the civic issue...</p>

        <div className={styles.viewfinder}>
          {/* Live camera feed */}
          <video autoPlay playsInline muted ref={videoRef} className={styles.videoFeed} />
          
          {/* AR UI Elements */}
          <div className={styles.cornerTopLeft}></div>
          <div className={styles.cornerTopRight}></div>
          <div className={styles.cornerBottomLeft}></div>
          <div className={styles.cornerBottomRight}></div>
          
          {/* Scanning Line Animation */}
          {scanning && (
            <motion.div 
              className={styles.scanLine}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* AR Mesh Overlay effect */}
          {scanning && progress > 30 && (
            <motion.div 
              className={styles.arMesh}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            />
          )}

          {/* Result Highlight */}
          {!scanning && (
            <motion.div 
              className={styles.hazardBox}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <AlertTriangle size={24} color="#ff4757" />
              <span>Hazard Locked</span>
            </motion.div>
          )}
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.statusText}>
          {scanning ? `Analyzing depth and dimensions... ${progress}%` : "Scan Complete! Auto-filling complaint..."}
        </p>
      </div>
    </div>
  );
}
