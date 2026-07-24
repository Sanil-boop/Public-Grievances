import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './InfoPages.module.css';

export default function PrivacyPolicy() {
  return (
    <motion.div 
      className={styles.pageContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Link to="/" className={styles.backLink}>
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <h1 className={styles.title}>Privacy Policy</h1>
      <div className={styles.content}>
        <p>Last updated: July 2026</p>
        
        <h2>1. Information We Collect</h2>
        <p>We only collect the information necessary to process your civic complaints. This includes:</p>
        <ul>
          <li>Your name and contact information (if you create an account)</li>
          <li>Location data associated with your complaints</li>
          <li>Audio recordings and text transcriptions for voice complaints</li>
          <li>Photos and images uploaded as evidence</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>Your data is used strictly for the purpose of routing and resolving civic issues. We process AI classifications (like voice-to-text) securely. We do not sell your personal data to third parties.</p>

        <h2>3. Data Security and Privacy</h2>
        <p>NagarSeva AI is committed to 100% privacy. Whenever technically feasible, AI classification and processing happen locally on your device to minimize data transmission. Any data sent to servers is encrypted in transit and at rest.</p>

        <h2>4. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information at any time through your Profile Settings. You can also withdraw your consent for location tracking in your browser settings.</p>
      </div>
    </motion.div>
  );
}
