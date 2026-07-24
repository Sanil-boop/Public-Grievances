import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, ArrowLeft, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Signup.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen'); // 'citizen' or 'department'
  const [secretCode, setSecretCode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (phone.trim().length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'department' && secretCode !== '2004') {
      setError('Invalid Department Secret Code.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const result = await signup(name.trim(), email.trim(), phone.trim(), password, role);
    if (result.success) {
      if (role === 'department') {
        navigate('/select-state');
      } else {
        navigate('/profile-setup');
      }
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      {/* Background pattern */}
      <div className={styles.bgPattern} />
      <div className={styles.bgMap} />

      {/* Back to Main Page */}
      <Link to="/" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Main Page
      </Link>

      <motion.div
        className={styles.card}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Branding */}
        <motion.div className={styles.branding} variants={itemVariants}>
          <span className={styles.brandEmoji}>🏛️</span>
          <h1 className={styles.brandTitle}>NagarSeva AI</h1>
          <p className={styles.brandSubtitle}>Create your account to get started.</p>
        </motion.div>

        {/* Role Toggle */}
        <motion.div className={styles.roleToggle} variants={itemVariants}>
          <button 
            type="button"
            className={`${styles.roleBtn} ${role === 'citizen' ? styles.roleBtnActive : ''}`}
            onClick={() => { setRole('citizen'); setError(''); }}
          >
            Citizen
          </button>
          <button 
            type="button"
            className={`${styles.roleBtn} ${role === 'department' ? styles.roleBtnActive : ''}`}
            onClick={() => { setRole('department'); setError(''); }}
          >
            Department
          </button>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            className={styles.errorBox}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Full Name / Department Name */}
          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label className={styles.label} htmlFor="signup-name">
              {role === 'citizen' ? 'Full Name' : 'Department Name / ID'}
            </label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label className={styles.label} htmlFor="signup-email">Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label className={styles.label} htmlFor="signup-phone">Phone Number</label>
            <div className={styles.inputWrapper}>
              <Phone size={18} className={styles.inputIcon} />
              <input
                id="signup-phone"
                type="tel"
                placeholder="+91 98765 43210"
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label className={styles.label} htmlFor="signup-password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          {/* Confirm Password */}
          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label className={styles.label} htmlFor="signup-confirm">Confirm Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="signup-confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          {/* Secret Code (Department Only) */}
          <AnimatePresence>
            {role === 'department' && (
              <motion.div 
                className={styles.inputGroup} 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className={styles.label} htmlFor="signup-secret">Department Secret Code</label>
                <div className={styles.inputWrapper}>
                  <Key size={18} className={styles.inputIcon} />
                  <input
                    id="signup-secret"
                    type="password"
                    placeholder="Enter secret code"
                    className={styles.input}
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
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
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p className={styles.footer} variants={itemVariants}>
          Already have an account?{' '}
          <Link to="/login" className={styles.footerLink}>
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
