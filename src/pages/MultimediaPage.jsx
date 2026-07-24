import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Image, FileVideo } from 'lucide-react';
import styles from './PortalPage.module.css';

const MEDIA_ITEMS = [
  {
    id: 1,
    type: 'video',
    title: 'Digital India: Transforming Governance Through Technology',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    duration: '12:34',
  },
  {
    id: 2,
    type: 'gallery',
    title: 'Swachh Bharat Mission — Photo Gallery 2026',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
    count: '24 Photos',
  },
  {
    id: 3,
    type: 'video',
    title: 'How AI is Revolutionizing Civic Complaint Resolution',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    duration: '8:15',
  },
  {
    id: 4,
    type: 'gallery',
    title: 'Smart City Infrastructure — Before & After',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
    count: '36 Photos',
  },
  {
    id: 5,
    type: 'video',
    title: 'PM Address: National Governance Summit 2026',
    thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop',
    duration: '45:20',
  },
  {
    id: 6,
    type: 'gallery',
    title: 'Green India Mission — Plantation Drive Highlights',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
    count: '18 Photos',
  },
];

export default function MultimediaPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Link to="/" className={styles.backBtn}><ArrowLeft size={18} /> Back to Portal</Link>
        <h1 className={styles.pageTitle}>
          <span className={styles.pageDot} style={{ background: '#f39c12' }} />
          Multimedia
        </h1>
        <p className={styles.pageSubtitle}>Videos, photo galleries, and visual content from government initiatives and events.</p>
      </div>

      <div className={styles.contentGrid}>
        {MEDIA_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <div className={styles.cardImage} style={{ backgroundImage: `url(${item.thumbnail})` }}>
              <div className={styles.mediaOverlay}>
                {item.type === 'video' ? <Play size={40} /> : <Image size={40} />}
              </div>
              <span className={styles.mediaBadge}>
                {item.type === 'video' ? (
                  <><FileVideo size={12} /> {item.duration}</>
                ) : (
                  <><Image size={12} /> {item.count}</>
                )}
              </span>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cardTag}>{item.type === 'video' ? 'Video' : 'Gallery'}</span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
