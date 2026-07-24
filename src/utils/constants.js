// App-wide constants for NagarSeva AI

export const APP_NAME = 'NagarSeva AI';
export const APP_TAGLINE = 'AI-Powered Civic Complaint Classifier';
export const APP_VERSION = '1.0.0';

export const LANGUAGES = [
  { code: 'en-IN', label: 'English', short: 'EN', flag: '🇬🇧', ocrLang: 'eng' },
  { code: 'hi-IN', label: 'हिन्दी', short: 'HI', flag: '🇮🇳', ocrLang: 'hin+eng' },
  { code: 'hi-EN', label: 'Hinglish', short: 'HN', flag: '🇮🇳', ocrLang: 'hin+eng' },
  { code: 'gu-IN', label: 'ગુજરાતી', short: 'GU', flag: '🇮🇳', ocrLang: 'guj+eng' },
  { code: 'mr-IN', label: 'मराठी', short: 'MR', flag: '🇮🇳', ocrLang: 'mar+eng' },
  { code: 'ta-IN', label: 'தமிழ்', short: 'TA', flag: '🇮🇳', ocrLang: 'tam+eng' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ', short: 'KN', flag: '🇮🇳', ocrLang: 'kan+eng' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', short: 'PA', flag: '🇮🇳', ocrLang: 'pan+eng' },
  { code: 'bn-IN', label: 'বাংলা', short: 'BN', flag: '🇮🇳', ocrLang: 'ben+eng' },
  { code: 'ml-IN', label: 'മലയാളം', short: 'ML', flag: '🇮🇳', ocrLang: 'mal+eng' },
  { code: 'te-IN', label: 'తెలుగు', short: 'TE', flag: '🇮🇳', ocrLang: 'tel+eng' },
  { code: 'fr-FR', label: 'Français', short: 'FR', flag: '🇫🇷', ocrLang: 'fra+eng' },
  { code: 'de-DE', label: 'Deutsch', short: 'DE', flag: '🇩🇪', ocrLang: 'deu+eng' },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

export const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low' },
];

export const STATUS_COLORS = {
  pending: { bg: 'rgba(253, 203, 110, 0.2)', color: '#fdcb6e' },
  'in-progress': { bg: 'rgba(116, 185, 255, 0.2)', color: '#74b9ff' },
  resolved: { bg: 'rgba(0, 184, 148, 0.2)', color: '#00b894' },
};

export const PRIORITY_COLORS = {
  urgent: { bg: 'rgba(225, 112, 85, 0.2)', color: '#e17055' },
  high: { bg: 'rgba(253, 203, 110, 0.2)', color: '#fdcb6e' },
  normal: { bg: 'rgba(116, 185, 255, 0.2)', color: '#74b9ff' },
  low: { bg: 'rgba(136, 136, 160, 0.2)', color: '#8888a0' },
};

export const CHART_COLORS = [
  '#6c5ce7', '#00cec9', '#e17055', '#fdcb6e',
  '#00b894', '#74b9ff', '#a29bfe', '#55efc4',
  '#fab1a0', '#ffeaa7', '#81ecec', '#dfe6e9',
];
