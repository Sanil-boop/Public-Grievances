import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, FileImage, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';
import styles from './PhotoUploader.module.css';

export default function PhotoUploader({ onTextExtracted, onImageCaptured, ocrLang = 'eng' }) {

  const [preview, setPreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processImage = useCallback(async (file) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setError('');
    setImage(file);
    setExtractedText('');

    // Create preview and process image
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      if (onImageCaptured) onImageCaptured(dataUrl);

      // Advanced Canvas Preprocessing for High Accuracy OCR
      const img = new Image();
      img.onload = async () => {
        setIsProcessing(true);
        setProgress(0);
        setError('');

        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          // Scale down if image is too large (improves speed & stability)
          const MAX_DIM = 2000;
          let width = img.width;
          let height = img.height;

          if (width > MAX_DIM || height > MAX_DIM) {
            const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          // Draw the resized image
          ctx.drawImage(img, 0, 0, width, height);

          // Apply High-Contrast Grayscale Filter
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Perceptual luminance
            let gray = 0.299 * r + 0.587 * g + 0.114 * b;
            
            // Boost contrast (thresholding magic number 128)
            const contrast = 1.5; // increase contrast by 50%
            gray = ((gray / 255 - 0.5) * contrast + 0.5) * 255;
            
            // Clamp values
            gray = Math.max(0, Math.min(255, gray));

            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
            // data[i+3] is alpha, keep unchanged
          }
          ctx.putImageData(imageData, 0, 0);

          // Get processed image data URL
          const processedDataUrl = canvas.toDataURL('image/jpeg', 0.9);

          // Pass the heavily optimized image to Tesseract
          const result = await Tesseract.recognize(processedDataUrl, ocrLang, {
            logger: (info) => {
              if (info.status === 'recognizing text') {
                setProgress(Math.round(info.progress * 100));
              }
            },
          });

          const text = result.data.text.trim();

          if (text) {
            setExtractedText(text);
            onTextExtracted?.(text);
          } else {
            setError('No text could be detected in this image. Please try a clearer photo.');
          }
        } catch (err) {
          console.error('OCR Error:', err);
          setError('Failed to process image. Please try again with a clearer photo.');
        } finally {
          setIsProcessing(false);
          setProgress(0);
        }
      };
      
      // Trigger image load
      img.onerror = () => {
        setError('Failed to load image for processing.');
        setIsProcessing(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [ocrLang, onTextExtracted, onImageCaptured]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImage(file);
  }, [processImage]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    setExtractedText('');
    setError('');
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className={styles.container}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className={styles.hiddenInput}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className={styles.hiddenInput}
      />

      {!preview ? (
        /* Upload Area */
        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dropZoneActive : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className={styles.dropZoneIcon}>
            <FileImage size={32} />
          </div>
          <p className={styles.dropZoneTitle}>Upload a Photo of Your Complaint</p>
          <p className={styles.dropZoneDesc}>
            Take a photo or upload an image — our AI will read the text from it
          </p>
          <div className={styles.uploadButtons}>
            <button
              className={styles.uploadBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              Upload Photo
            </button>
            <button
              className={styles.cameraBtn}
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera size={16} />
              Take Photo
            </button>
          </div>
          <p className={styles.dropZoneHint}>
            Supports JPG, PNG • Max 10MB • Drag & drop also works
          </p>
        </div>
      ) : (
        /* Preview & Results */
        <motion.div
          className={styles.previewSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Image Preview */}
          <div className={styles.previewWrapper}>
            <img src={preview} alt="Uploaded complaint" className={styles.previewImage} />
            <button className={styles.clearBtn} onClick={clearImage} title="Remove image">
              <X size={16} />
            </button>
          </div>

          {/* Processing State */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                className={styles.processingCard}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div className={styles.processingHeader}>
                  <Loader size={18} className={styles.spinner} />
                  <span>Reading text from image...</span>
                </div>
                <div className={styles.progressBar}>
                  <motion.div
                    className={styles.progressFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className={styles.progressText}>{progress}% complete</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Extracted Text */}
          <AnimatePresence>
            {extractedText && !isProcessing && (
              <motion.div
                className={styles.resultCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className={styles.resultHeader}>
                  <CheckCircle size={16} className={styles.successIcon} />
                  <span>Text Extracted Successfully</span>
                </div>
                <div className={styles.resultText}>{extractedText}</div>
                <button
                  className={styles.useTextBtn}
                  onClick={() => onTextExtracted?.(extractedText)}
                >
                  Use This Text for Complaint
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {error && !isProcessing && (
              <motion.div
                className={styles.errorCard}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
