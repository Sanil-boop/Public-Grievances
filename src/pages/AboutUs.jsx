import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './InfoPages.module.css';

export default function AboutUs() {
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
      
      <h1 className={styles.title}>About Us</h1>
      <div className={styles.content}>
        <h2>Our Mission</h2>
        <p>At NagarSeva AI, our mission is to empower citizens and transform governance by bridging the gap between people and municipal authorities. We believe that reporting civic issues should be as simple as sending a text message or recording a quick voice note.</p>
        
        <h2>What We Do</h2>
        <p>We leverage cutting-edge Natural Language Processing (NLP) and Artificial Intelligence to automatically categorize, route, and track civic complaints. By eliminating manual sorting and bureaucratic bottlenecks, we help municipalities resolve issues faster and more efficiently.</p>

        <h2>Our Vision</h2>
        <p>We envision smart cities where civic maintenance is proactive, highly responsive, and transparent. We strive to create an ecosystem where every citizen's voice is heard, and every problem is addressed with accountability and speed.</p>
      </div>
    </motion.div>
  );
}
