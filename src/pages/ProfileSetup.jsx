import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Calendar, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './ProfileSetup.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function ProfileSetup() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fatherName: '',
    motherName: '',
    dob: '',
    identityNumber: '', // Aadhar/PAN
    alternatePhone: '',
    gender: 'Male',
    stateResident: '',
    district: '',
    city: '',
    pincode: '',
    alternateEmail: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic required field validation (can be expanded)
    if (!formData.fatherName || !formData.dob || !formData.identityNumber || !formData.stateResident) {
      setError('Please fill out all the required fields (*).');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = await updateUser(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Failed to update profile.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgPattern} />

      <motion.div
        className={styles.card}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.branding} variants={itemVariants}>
          <div className={styles.iconWrapper}>
            <CheckCircle2 size={32} className={styles.successIcon} />
          </div>
          <h1 className={styles.brandTitle}>Registration Successful!</h1>
          <p className={styles.brandSubtitle}>
            Hi {user?.name?.split(' ')[0]}, please complete your personal profile to verify your account and start filing complaints.
          </p>
        </motion.div>

        {error && (
          <motion.div
            className={styles.errorBox}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <motion.h3 className={styles.sectionTitle} variants={itemVariants}>Personal Information</motion.h3>
          
          <div className={styles.grid}>
            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label className={styles.label}>Father's Name *</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  name="fatherName"
                  type="text"
                  placeholder="Father's Full Name"
                  className={styles.input}
                  value={formData.fatherName}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label className={styles.label}>Mother's Name</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  name="motherName"
                  type="text"
                  placeholder="Mother's Full Name"
                  className={styles.input}
                  value={formData.motherName}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
          </div>

          <div className={styles.grid}>
            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label className={styles.label}>Date of Birth *</label>
              <div className={styles.inputWrapper}>
                <Calendar size={16} className={styles.inputIcon} />
                <input
                  name="dob"
                  type="date"
                  className={styles.input}
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label className={styles.label}>Gender</label>
              <select
                name="gender"
                className={`${styles.input} ${styles.selectInput}`}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>
          </div>

          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label className={styles.label}>Aadhar Card / PAN Card Number *</label>
            <div className={styles.inputWrapper}>
              <CreditCard size={16} className={styles.inputIcon} />
              <input
                name="identityNumber"
                type="text"
                placeholder="XXXX-XXXX-XXXX"
                className={styles.input}
                value={formData.identityNumber}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          <motion.h3 className={styles.sectionTitle} variants={itemVariants} style={{ marginTop: '24px' }}>Contact & Address</motion.h3>

          <div className={styles.grid}>
            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label className={styles.label}>Alternate Mobile</label>
              <div className={styles.inputWrapper}>
                <Phone size={16} className={styles.inputIcon} />
                <input
                  name="alternatePhone"
                  type="tel"
                  placeholder="Alternate Phone"
                  className={styles.input}
                  value={formData.alternatePhone}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label className={styles.label}>Alternate Email</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  name="alternateEmail"
                  type="email"
                  placeholder="alt@example.com"
                  className={styles.input}
                  value={formData.alternateEmail}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
          </div>

          <div className={styles.grid}>
            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label className={styles.label}>State of Residence *</label>
              <div className={styles.inputWrapper}>
                <MapPin size={16} className={styles.inputIcon} />
                <input
                  name="stateResident"
                  type="text"
                  placeholder="State"
                  className={styles.input}
                  value={formData.stateResident}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label className={styles.label}>District *</label>
              <div className={styles.inputWrapper}>
                <MapPin size={16} className={styles.inputIcon} />
                <input
                  name="district"
                  type="text"
                  placeholder="District"
                  className={styles.input}
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
          </div>

          <div className={styles.grid}>
            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label className={styles.label}>City *</label>
              <div className={styles.inputWrapper}>
                <MapPin size={16} className={styles.inputIcon} />
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  className={styles.input}
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label className={styles.label}>Pincode *</label>
              <div className={styles.inputWrapper}>
                <MapPin size={16} className={styles.inputIcon} />
                <input
                  name="pincode"
                  type="text"
                  placeholder="Pincode"
                  className={styles.input}
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
          </div>

          <motion.button
            type="submit"
            className={styles.submitBtn}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                Complete Registration
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
