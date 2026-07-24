import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES, getDistricts, getCities } from '../data/locations';
import styles from './LocationSelector.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function LocationSelector() {
  const { state, district } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDepartment = user?.role === 'department';

  let step = 1;
  let title = 'Select your State';
  let subtitle = 'Choose a state to view available regions.';
  let options = [];
  let backLink = null;

  if (!state) {
    step = 1;
    options = INDIAN_STATES.map(s => s.name);
    backLink = '/dashboard';
  } else if (!district) {
    step = 2;
    title = `Select District in ${state}`;
    subtitle = 'Choose your district to narrow down the location.';
    options = getDistricts(state).map(d => d.name);
    backLink = '/select-state';
  } else {
    step = 3;
    title = `Select City in ${district}`;
    subtitle = 'Choose your city to proceed.';
    options = getCities(state, district);
    backLink = `/select-district/${state}`;
  }

  const handleSelect = (selection) => {
    if (step === 1) {
      navigate(`/select-district/${selection}`);
    } else if (step === 2) {
      navigate(`/select-city/${state}/${selection}`);
    } else if (step === 3) {
      if (isDepartment) {
        navigate(`/${state}/${district}/${selection}/department`);
      } else {
        navigate(`/${state}/${district}/${selection}/new`);
      }
    }
  };

  return (
    <motion.div 
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        {backLink && (
          <Link to={backLink} className={styles.backBtn}>
            <ArrowLeft size={20} /> Back
          </Link>
        )}
        <div className={styles.progressIndicator}>
          <div className={`${styles.dot} ${step >= 1 ? styles.dotActive : ''}`} />
          <div className={`${styles.line} ${step >= 2 ? styles.lineActive : ''}`} />
          <div className={`${styles.dot} ${step >= 2 ? styles.dotActive : ''}`} />
          <div className={`${styles.line} ${step >= 3 ? styles.lineActive : ''}`} />
          <div className={`${styles.dot} ${step >= 3 ? styles.dotActive : ''}`} />
        </div>
      </div>

      <div className={styles.content}>
        <motion.div className={styles.titleSection} variants={itemVariants}>
          <div className={styles.iconWrapper}>
            <MapPin size={32} />
          </div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </motion.div>

        <motion.div className={styles.grid} variants={itemVariants}>
          {options.length > 0 ? (
            options.map((option, i) => (
              <button 
                key={i} 
                className={styles.optionCard}
                onClick={() => handleSelect(option)}
              >
                <span>{option}</span>
                <ChevronRight size={18} className={styles.arrowIcon} />
              </button>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No options available for this selection.</p>
              <button onClick={() => navigate('/select-state')} className={styles.resetBtn}>Start Over</button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
