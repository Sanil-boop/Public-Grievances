import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './InfoPages.module.css';

export default function ContactUs() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Message sent successfully! We will get back to you soon.');
    e.target.reset();
  };

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

      <h1 className={styles.title}>Contact Us</h1>
      <div className={styles.content}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <h2>Get In Touch</h2>
            <p>Have a question, feedback, or need support? Reach out to our team.</p>
            
            <div className={styles.contactItem}>
              <h3>Email</h3>
              <p>support@nagarseva.ai</p>
            </div>
            
            <div className={styles.contactItem}>
              <h3>Office</h3>
              <p>123 Smart City Tech Park,<br/>Block C, 4th Floor,<br/>New Delhi, India 110001</p>
            </div>

            <div className={styles.contactItem}>
              <h3>Phone</h3>
              <p>1800-123-4567 (Toll Free)</p>
            </div>
          </div>

          <div className={styles.contactForm}>
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input type="text" required placeholder="Your full name" />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" required placeholder="Your email address" />
              </div>
              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea rows="5" required placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>Send Message</button>
              {status && <p style={{ color: '#00b894', marginTop: '16px', fontWeight: '500' }}>{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
