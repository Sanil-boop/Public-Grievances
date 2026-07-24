import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Layers,
  Sparkles,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import styles from './About.module.css';

const steps = [
  {
    emoji: '🎤',
    title: 'Speak or Type',
    desc: 'Describe your civic issue in your own words — in English or Hindi. You can speak using the microphone or type it out.',
  },
  {
    emoji: '🤖',
    title: 'Instant Classification',
    desc: 'Our smart system automatically understands your complaint and identifies the right category — water, roads, garbage, and more.',
  },
  {
    emoji: '🏢',
    title: 'Routed to Department',
    desc: 'Your complaint is instantly sent to the correct municipal department for fast action.',
  },
  {
    emoji: '📱',
    title: 'Track Your Complaint',
    desc: 'Get real-time updates on your complaint status — from Pending to In Progress to Resolved.',
  },
];

const features = [
  {
    emoji: '🎙️',
    title: 'Voice Complaints',
    desc: 'File complaints by simply speaking into your phone or computer. No typing needed!',
  },
  {
    emoji: '🌐',
    title: 'Hindi & English',
    desc: 'Speak or type in English, Hindi, or even Hinglish — our system understands all.',
  },
  {
    emoji: '⚡',
    title: 'Instant Results',
    desc: 'Get immediate classification and department routing — no waiting in queues.',
  },
  {
    emoji: '🔒',
    title: '100% Private',
    desc: 'Your complaint data stays on your device. Nothing is sent to any server.',
  },
  {
    emoji: '📊',
    title: 'Live Tracking',
    desc: 'Track all your complaints with status updates and analytics.',
  },
  {
    emoji: '🏛️',
    title: '12 Categories',
    desc: 'Covers water, roads, garbage, drainage, street lights, parks, and more.',
  },
];

const categories = [
  { emoji: '💧', name: 'Water Supply', id: 'water' },
  { emoji: '🛣️', name: 'Road Maintenance', id: 'roads' },
  { emoji: '🗑️', name: 'Garbage Collection', id: 'garbage' },
  { emoji: '💡', name: 'Street Lighting', id: 'streetlights' },
  { emoji: '🚰', name: 'Sewage & Drainage', id: 'drainage' },
  { emoji: '🏗️', name: 'Illegal Construction', id: 'illegal_construction' },
  { emoji: '🌳', name: 'Parks & Gardens', id: 'parks' },
  { emoji: '🐾', name: 'Stray Animals', id: 'stray_animals' },
  { emoji: '🔊', name: 'Noise Pollution', id: 'noise_pollution' },
  { emoji: '💰', name: 'Property Tax', id: 'property_tax' },
  { emoji: '🏥', name: 'Health & Sanitation', id: 'public_health' },
  { emoji: '📋', name: 'Other / General', id: 'other' },
];

const faqs = [
  {
    q: 'How do I file a complaint using voice?',
    a: 'Click the microphone button on the New Complaint page, speak clearly about your issue in English or Hindi, and the system will transcribe your words automatically. You can edit the text before submitting.',
  },
  {
    q: 'How long does it take to resolve a water supply complaint?',
    a: 'Water supply complaints are treated as high priority. Typically, the Water Works Department responds within 24-48 hours for urgent issues like no water supply, and 3-5 days for low-pressure or quality issues.',
  },
  {
    q: 'What happens after I submit my complaint?',
    a: 'Your complaint is instantly classified and routed to the appropriate municipal department. You can track its status (Pending → In Progress → Resolved) in the History section.',
  },
  {
    q: 'How long do road repair complaints take?',
    a: 'Pothole repairs and road damage complaints are usually addressed within 5-7 working days. Major road work may take 2-4 weeks depending on the scope.',
  },
  {
    q: 'Can I file complaints in Hindi?',
    a: 'Yes! You can type or speak your complaint in Hindi, English, or even a mix of both (Hinglish). The system understands all three.',
  },
  {
    q: 'Is my complaint data private?',
    a: 'Absolutely. All your data is stored locally on your device and is never uploaded to any server. Your privacy is fully protected.',
  },
  {
    q: 'What categories of complaints are supported?',
    a: 'We support 12 categories: Water Supply, Roads & Potholes, Garbage Collection, Street Lights, Drainage & Sewage, Illegal Construction, Parks & Trees, Stray Animals, Property Tax, Noise Pollution, Public Health, and General complaints.',
  },
  {
    q: 'How are garbage collection complaints handled?',
    a: 'Garbage and solid waste complaints are routed to the Sanitation Department. Regular collection issues are typically resolved within 24-48 hours. For overflowing bins or dump site issues, expect 2-3 days.',
  },
  {
    q: 'Can I track the status of my complaint?',
    a: 'Yes! Go to the History page to see all your filed complaints with their current status, category, department, and confidence score. You can search, filter, and sort them.',
  },
  {
    q: "What if my complaint doesn't fit any category?",
    a: 'If the system isn\'t confident about the category, it will classify it as "Other/General" and route it to General Administration, who will manually assign it to the right department.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <motion.div
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero */}
      <motion.div className={styles.hero} variants={itemVariants}>
        <span className={styles.heroEmoji}>🏛️</span>
        <h1 className={styles.heroTitle}>NagarSeva AI</h1>
        <p className={styles.heroTagline}>
          Your Voice Matters — Report Civic Issues Instantly
        </p>
        <p className={styles.heroDesc}>
          File civic complaints effortlessly using your voice or text — in English or Hindi.
          Our smart system classifies your issue, routes it to the right municipal department,
          and lets you track progress in real time.
        </p>
      </motion.div>

      {/* How to File a Complaint */}
      <motion.section className={styles.section} variants={itemVariants}>
        <h2 className={styles.sectionTitle}>
          <Zap size={20} className={styles.sectionTitleIcon} />
          How to File a Complaint
        </h2>
        <div className={styles.stepsGrid}>
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className={styles.stepCard}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <span className={styles.stepNumber}>{idx + 1}</span>
              <span className={styles.stepEmoji}>{step.emoji}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Key Features */}
      <motion.section className={styles.section} variants={itemVariants}>
        <h2 className={styles.sectionTitle}>
          <Sparkles size={20} className={styles.sectionTitleIcon} />
          Key Features
        </h2>
        <div className={styles.featuresGrid}>
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              className={styles.featureCard}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <span className={styles.featureEmoji}>{feat.emoji}</span>
              <h3 className={styles.featureTitle}>{feat.title}</h3>
              <p className={styles.featureDesc}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Supported Categories */}
      <motion.section className={styles.section} variants={itemVariants}>
        <h2 className={styles.sectionTitle}>
          <Layers size={20} className={styles.sectionTitleIcon} />
          Supported Categories
        </h2>
        <div className={styles.categoriesGrid}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className={styles.categoryLink}
            >
              <motion.div
                className={styles.categoryItem}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <span className={styles.categoryEmoji}>{cat.emoji}</span>
                <span className={styles.categoryName}>{cat.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section className={styles.section} variants={itemVariants}>
        <h2 className={styles.sectionTitle}>
          <HelpCircle size={20} className={styles.sectionTitleIcon} />
          Frequently Asked Questions
        </h2>
        <div className={styles.faqList}>
          {faqs.map((faq, idx) => (
            <div key={idx} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() =>
                  setOpenFaq(openFaq === idx ? null : idx)
                }
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`${styles.faqIcon} ${
                    openFaq === idx ? styles.faqIconOpen : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <motion.div
                  className={styles.faqAnswer}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.25 }}
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
