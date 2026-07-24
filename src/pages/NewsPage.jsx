import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import styles from './PortalPage.module.css';

const NEWS_ARTICLES = [
  {
    id: 1,
    tag: 'Policy',
    title: 'Swachh Bharat Mission Phase 3 Launched for Urban Areas',
    snippet: 'The Ministry of Housing and Urban Affairs has launched the next phase of the cleanliness drive focusing on deep waste segregation at the source.',
    date: '21 July 2026',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    tag: 'Technology',
    title: 'E-Panchayat Systems Integrate AI-Driven Grievance Routing',
    snippet: 'Rural areas will now see faster grievance redressal as the central E-Panchayat systems integrate AI-driven routing similar to modern urban civic apps.',
    date: '19 July 2026',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    tag: 'Infrastructure',
    title: 'Pre-Monsoon Drain Clearance Operations Reach 85% Completion',
    snippet: 'Major metropolitans report pre-monsoon desilting operations are mostly complete, aiming to prevent severe waterlogging.',
    date: '17 July 2026',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    tag: 'Digital India',
    title: 'NagarSeva AI Platform Crosses 12 Lakh Civic Complaints',
    snippet: 'The AI-powered platform has now processed over 12 lakh civic complaints across 750+ districts nationwide.',
    date: '15 July 2026',
    image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&h=400&fit=crop',
  },
  {
    id: 5,
    tag: 'Governance',
    title: 'Smart City Mission: 100 Cities Now Connected Digitally',
    snippet: 'India reaches a milestone with 100 smart cities now fully connected under the digital governance initiative.',
    date: '12 July 2026',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop',
  },
  {
    id: 6,
    tag: 'Environment',
    title: 'Green India Mission Plants 50 Crore Trees in 2026',
    snippet: 'The national afforestation project achieves its ambitious target six months ahead of schedule.',
    date: '10 July 2026',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
  },
];

export default function NewsPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Link to="/" className={styles.backBtn}><ArrowLeft size={18} /> Back to Portal</Link>
        <h1 className={styles.pageTitle}>
          <span className={styles.pageDot} style={{ background: '#e74c3c' }} />
          News & Updates
        </h1>
        <p className={styles.pageSubtitle}>Latest government announcements, policy updates, and civic news from across India.</p>
      </div>

      <div className={styles.contentGrid}>
        {NEWS_ARTICLES.map((article, i) => (
          <motion.div
            key={article.id}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <div className={styles.cardImage} style={{ backgroundImage: `url(${article.image})` }} />
            <div className={styles.cardBody}>
              <span className={styles.cardTag}>{article.tag}</span>
              <h3 className={styles.cardTitle}>{article.title}</h3>
              <p className={styles.cardSnippet}>{article.snippet}</p>
              <div className={styles.cardMeta}>
                <Clock size={12} />
                <span>{article.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
