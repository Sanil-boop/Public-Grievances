import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function TransportLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen'); // 'citizen' or 'department'
  const [secretCode, setSecretCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (role === 'department' && secretCode !== '2004') {
      setError('Invalid Department Secret Code.');
      return;
    }

    setLoading(true);
    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 400));

    const result = await login(email.trim(), password, role);
    if (result.success) {
      if (role === 'department') {
        navigate('/transport');
      } else {
        navigate('/transport');
      }
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      {/* Background pattern */}
      <div className={styles.bgPattern} />
      <div className={styles.bgMap} />

      {/* Back to Transport Portal */}
      <Link to="/transport" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Transport Portal
      </Link>

      <motion.div
        className={styles.card}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Branding */}
        <motion.div className={styles.branding} variants={itemVariants}>
          <span className={styles.brandEmoji}>🚌</span>
          <h1 className={styles.brandTitle}>Transport Seva Portal</h1>
          <p className={styles.brandSubtitle}>Sign in to file transport complaints.</p>
        </motion.div>

        {/* Role Toggle */}
        <motion.div className={styles.roleToggle} variants={itemVariants}>
          <button 
            className={`${styles.roleBtn} ${role === 'citizen' ? styles.roleBtnActive : ''}`}
            onClick={() => { setRole('citizen'); setError(''); }}
          >
            Citizen
          </button>
          <button 
            className={`${styles.roleBtn} ${role === 'department' ? styles.roleBtnActive : ''}`}
            onClick={() => { setRole('department'); setError(''); }}
          >
            Department
          </button>
        </motion.div>

        {/* Error Message */}
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
          {/* Email */}
          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label className={styles.label} htmlFor="login-email">Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label className={styles.label} htmlFor="login-password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
                <label className={styles.label} htmlFor="login-secret">Department Secret Code</label>
                <div className={styles.inputWrapper}>
                  <Key size={18} className={styles.inputIcon} />
                  <input
                    id="login-secret"
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
                <LogIn size={18} />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p className={styles.footer} variants={itemVariants}>
          Don&apos;t have an account?{' '}
          <Link to="/transport-signup" className={styles.footerLink}>
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
