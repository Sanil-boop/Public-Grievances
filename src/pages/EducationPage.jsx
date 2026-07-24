import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, BookOpen, GraduationCap, Award, FileText } from 'lucide-react';
import styles from './PortalPage.module.css';

const EDU_SERVICES = [
  {
    id: 1,
    icon: GraduationCap,
    title: 'National Scholarship Portal',
    desc: 'Apply for central and state government scholarships. Track application status and disbursement details online.',
    link: '#',
  },
  {
    id: 2,
    icon: BookOpen,
    title: 'DIKSHA — Digital Learning',
    desc: 'Access free digital textbooks, interactive courses, and teacher training resources for K-12 education.',
    link: '#',
  },
  {
    id: 3,
    icon: Award,
    title: 'Exam Results & Certificates',
    desc: 'View board examination results, download mark sheets, and request duplicate certificates from education boards.',
    link: '#',
  },
  {
    id: 4,
    icon: FileText,
    title: 'School Registration',
    desc: 'Register new schools, access UDISE+ data, and manage school recognition and affiliation processes.',
    link: '#',
  },
  {
    id: 5,
    icon: GraduationCap,
    title: 'Higher Education Portal',
    desc: 'University admissions, UGC recognition verification, and access to SWAYAM online degree programs.',
    link: '#',
  },
  {
    id: 6,
    icon: BookOpen,
    title: 'Mid-Day Meal Scheme',
    desc: 'Monitor mid-day meal distribution data, report quality issues, and access nutritional guidelines.',
    link: '#',
  },
];

export default function EducationPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Link to="/" className={styles.backBtn}><ArrowLeft size={18} /> Back to Portal</Link>
        <h1 className={styles.pageTitle}>
          <span className={styles.pageDot} style={{ background: '#27ae60' }} />
          Education Portal
        </h1>
        <p className={styles.pageSubtitle}>Access educational services, scholarships, digital learning resources, and examination portals.</p>
      </div>

      <div className={styles.serviceGrid}>
        {EDU_SERVICES.map((service, i) => {
          const IconComp = service.icon;
          return (
            <motion.a
              key={service.id}
              href={service.link}
              className={styles.serviceCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={(e) => service.link === '#' && e.preventDefault()}
            >
              <div className={styles.serviceIcon}>
                <IconComp size={28} />
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDesc}>{service.desc}</p>
              <span className={styles.serviceLink}>
                {service.link === '#' ? 'Coming Soon' : 'Visit Portal'} <ExternalLink size={13} />
              </span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
