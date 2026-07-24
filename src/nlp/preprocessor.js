/**
 * preprocessor.js
 * ───────────────
 * Text preprocessing pipeline for civic complaints.
 * Handles English, Hindi (transliterated), and Hinglish (mixed) text.
 *
 * Exports:
 *   preprocessText(text) → { cleaned, tokens, original }
 */

// ────────────────────────────────────────────────────────────────────────────
// ENGLISH STOPWORDS
// ────────────────────────────────────────────────────────────────────────────

const ENGLISH_STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
  'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she',
  'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
  'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that',
  'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
  'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of',
  'at', 'by', 'for', 'with', 'about', 'against', 'between', 'through',
  'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then',
  'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both',
  'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can',
  'will', 'just', 'don', 'should', 'now', 'could', 'would', 'shall',
]);

// ────────────────────────────────────────────────────────────────────────────
// HINDI (transliterated) STOPWORDS
// ────────────────────────────────────────────────────────────────────────────

const HINDI_STOPWORDS = new Set([
  'hai', 'hain', 'ho', 'tha', 'thi', 'the', 'ka', 'ki', 'ke', 'ko', 'se',
  'me', 'mein', 'par', 'pe', 'ne', 'ye', 'yeh', 'woh', 'wo', 'jo', 'aur',
  'ya', 'lekin', 'magar', 'phir', 'bhi', 'kya', 'kab', 'kahan', 'kaise',
  'kaun', 'kitna', 'kitni', 'kitne', 'ek', 'do', 'teen', 'char', 'kuch',
  'sab', 'koi', 'iska', 'iski', 'iske', 'uska', 'uski', 'uske', 'unka',
  'unki', 'unke', 'apna', 'apni', 'apne', 'is', 'us', 'jab', 'tab', 'ab',
  'agar', 'toh', 'to', 'na', 'nahi', 'naa', 'mat', 'hi', 'sirf', 'bas',
  'bahut', 'bohot', 'bohut', 'zyada', 'jyada', 'kam', 'liye', 'wala', 'wali',
  'wale', 'vale', 'vali', 'vale', 'raha', 'rahi', 'rahe', 'hota', 'hoti',
  'hote', 'karta', 'karti', 'karte', 'kar', 'karo', 'karein', 'kijiye',
  'dijiye', 'de', 'do', 'dena', 'diya', 'lena', 'liya', 'le', 'lo',
  'jaata', 'jaati', 'jaate', 'aata', 'aati', 'aate', 'sakta', 'sakti',
  'sakte', 'chahiye', 'padta', 'padti', 'padte', 'wahan', 'yahan', 'idhar',
  'udhar', 'sath', 'saath', 'dwara', 'zaroorat', 'hum', 'tum', 'main',
  'mera', 'meri', 'mere', 'tera', 'teri', 'tere', 'hamara', 'hamari',
  'hamare', 'tumhara', 'tumhari', 'tumhare',
]);

// ────────────────────────────────────────────────────────────────────────────
// HINGLISH TRANSLITERATION MAP
// Maps common Hindi transliterations to their English equivalents so the
// downstream classifier can work with a normalized vocabulary.
// ────────────────────────────────────────────────────────────────────────────

const TRANSLITERATION_MAP = {
  // Water-related
  paani: 'water',
  pani: 'water',
  jal: 'water',
  nalkaa: 'tap',
  nalka: 'tap',
  nal: 'tap',
  nala: 'drain',
  pipeline: 'pipeline',
  tanker: 'tanker',

  // Road-related
  sadak: 'road',
  sarak: 'road',
  rasta: 'road',
  gaddha: 'pothole',
  gadha: 'pothole',
  gaddhe: 'potholes',
  pul: 'bridge',
  chauraaha: 'intersection',
  chauraha: 'intersection',

  // Garbage / waste
  kachra: 'garbage',
  kachara: 'garbage',
  kuda: 'garbage',
  kooda: 'garbage',
  safai: 'cleaning',
  safaai: 'cleaning',
  jhadu: 'sweeping',
  dustbin: 'dustbin',
  kachra_gadi: 'garbage_truck',
  kachre: 'garbage',

  // Electricity / lights
  bijli: 'electricity',
  bijlee: 'electricity',
  batti: 'light',
  bulb: 'bulb',
  khamba: 'pole',
  khambha: 'pole',
  taar: 'wire',
  wire: 'wire',

  // Drainage / sewage
  nali: 'drain',
  naali: 'drain',
  naala: 'drain',
  gutter: 'gutter',
  gatar: 'gutter',
  manhole: 'manhole',
  sewer: 'sewer',
  sewar: 'sewer',
  badbu: 'stench',

  // Trees / parks
  ped: 'tree',
  pedh: 'tree',
  darakht: 'tree',
  paudha: 'plant',
  paudhe: 'plants',
  ghaas: 'grass',
  park: 'park',
  bagicha: 'garden',
  baag: 'garden',
  jhula: 'swing',
  jhule: 'swings',

  // Animals
  kutta: 'dog',
  kutte: 'dogs',
  kutton: 'dogs',
  gaay: 'cow',
  gaaye: 'cows',
  bail: 'ox',
  saanp: 'snake',
  samp: 'snake',
  bandar: 'monkey',
  suwar: 'pig',
  suar: 'pig',
  chuha: 'rat',
  chuhe: 'rats',
  machhar: 'mosquito',
  machchhar: 'mosquito',
  janwar: 'animal',
  janwaron: 'animals',
  aawara: 'stray',

  // Construction
  nirman: 'construction',
  imarat: 'building',
  makan: 'house',
  ghar: 'house',
  manzil: 'floor',
  malaaba: 'debris',
  cement: 'cement',
  kabza: 'encroachment',

  // Noise / pollution
  shor: 'noise',
  shohor: 'noise',
  dhwani: 'sound',
  dhuaan: 'smoke',
  dhuan: 'smoke',
  dhua: 'smoke',
  pradushan: 'pollution',
  dhool: 'dust',
  dhul: 'dust',
  pataakhe: 'firecrackers',
  patakhe: 'firecrackers',

  // Health
  bimari: 'disease',
  bimaari: 'disease',
  bimar: 'sick',
  sehat: 'health',
  swasthya: 'health',
  dawai: 'medicine',
  aspatal: 'hospital',
  dengue: 'dengue',
  malaria: 'malaria',
  dast: 'diarrhea',
  bukhar: 'fever',

  // Tax / billing
  tax: 'tax',
  kar: 'tax',
  bill: 'bill',
  kist: 'installment',
  bhugtan: 'payment',
  raseed: 'receipt',

  // General
  shikayat: 'complaint',
  samasyaa: 'problem',
  samasya: 'problem',
  dikkat: 'problem',
  pareshani: 'problem',
  mushkil: 'difficulty',
  khatarnak: 'dangerous',
  khatra: 'danger',
  turant: 'urgent',
  jaldi: 'quickly',
  madad: 'help',
  sarkari: 'government',
  nagar_palika: 'municipality',
  nagar_nigam: 'municipal_corporation',
  ward: 'ward',
  mohalla: 'neighborhood',
  mohalle: 'neighborhood',
  colony: 'colony',
  ilaka: 'area',
  area: 'area',

  // Healthcare additions
  davaakhana: 'dispensary',
  davakhana: 'dispensary', 
  chikitsa: 'treatment',
  chikitsalaya: 'hospital',
  rog: 'disease',
  mareez: 'patient',
  ilaj: 'treatment',
  dawakhana: 'pharmacy',
  khoon: 'blood',
  
  // Accident additions
  durghatna: 'accident',
  hadsa: 'accident',
  takkar: 'collision',
  palatna: 'overturn',
  fisal: 'skid',
  raftar: 'speed',
  
  // General civic
  nagar: 'municipal',
  nigam: 'corporation',
  panchayat: 'council',
  vikas: 'development',
  suraksha: 'safety',
  suvidha: 'facility',
  vyavastha: 'system',
  sampark: 'contact',
};

// ────────────────────────────────────────────────────────────────────────────
// COMMON SPELLING CORRECTIONS
// ────────────────────────────────────────────────────────────────────────────

const SPELLING_CORRECTIONS = {
  pothoal: 'pothole', pothoale: 'pothole', pothoales: 'potholes',
  gargage: 'garbage', grabage: 'garbage', garbge: 'garbage',
  sewege: 'sewage', sewige: 'sewage',
  drinage: 'drainage', drainge: 'drainage',
  maintanance: 'maintenance', maintenence: 'maintenance',
  complant: 'complaint', complaine: 'complaint',
  dangarous: 'dangerous', dangrous: 'dangerous',
  hosptial: 'hospital', hospitl: 'hospital',
  ambulence: 'ambulance', amblance: 'ambulance',
  accidant: 'accident', acident: 'accident',
  electricty: 'electricity', electrcity: 'electricity',
  footpaht: 'footpath', footpth: 'footpath',
  constructon: 'construction', construcion: 'construction',
  pollusion: 'pollution', polution: 'pollution',
  watarlogging: 'waterlogging', waterloging: 'waterlogging',
  mosquitos: 'mosquitoes', moskito: 'mosquito',
  stret: 'street', stree: 'street',
  vehical: 'vehicle', vehicel: 'vehicle',
  immediat: 'immediate', imediately: 'immediately',
  urgant: 'urgent', emergancy: 'emergency',
};

/**
 * Basic English stemmer — handles common suffixes.
 * Not a full Porter stemmer but covers the most impactful civic complaint terms.
 */
function simpleStem(token) {
  if (token.length < 4) return token;
  
  // Plural: potholes -> pothole, lights -> light, pipes -> pipe
  if (token.endsWith('ies') && token.length > 4) return token.slice(0, -3) + 'y';
  if (token.endsWith('es') && token.length > 4) return token.slice(0, -2);
  if (token.endsWith('s') && !token.endsWith('ss') && token.length > 3) return token.slice(0, -1);
  
  // Gerund/present: leaking -> leak, overflowing -> overflow
  if (token.endsWith('ing') && token.length > 5) {
    const base = token.slice(0, -3);
    if (base.endsWith(base.charAt(base.length - 1)) && base.length > 2) {
      return base.slice(0, -1); // running -> run
    }
    return base;
  }
  
  // Past tense: damaged -> damage, blocked -> block  
  if (token.endsWith('ed') && token.length > 4) {
    const base = token.slice(0, -2);
    if (base.endsWith(base.charAt(base.length - 1)) && base.length > 2) {
      return base.slice(0, -1); // blocked -> block
    }
    return base;
  }
  
  return token;
}

// ────────────────────────────────────────────────────────────────────────────
// PREPROCESSING PIPELINE
// ────────────────────────────────────────────────────────────────────────────

/**
 * preprocessText
 *
 * Full preprocessing pipeline for civic complaint text:
 *   1. Lowercase
 *   2. Strip special characters (preserve Hindi Unicode + alphanumeric)
 *   3. Normalize whitespace
 *   4. Apply Hinglish transliteration
 *   5. Remove English + Hindi stopwords
 *   6. Return { cleaned, tokens, original }
 *
 * @param {string} text - Raw complaint text
 * @returns {{ cleaned: string, tokens: string[], original: string }}
 */
export function preprocessText(text) {
  if (!text || typeof text !== 'string') {
    return { cleaned: '', tokens: [], original: text || '' };
  }

  const original = text.trim();

  // Step 1 — lowercase
  let processed = original.toLowerCase();

  // Step 2 — remove special chars but keep:
  //   • a-z, 0-9, spaces
  //   • Indian scripts Unicode ranges: Devanagari, Bengali, Gurmukhi, Gujarati, Tamil, Telugu, Kannada, Malayalam
  processed = processed.replace(/[^a-z0-9\s\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/g, ' ');

  // Step 3 — normalize whitespace
  processed = processed.replace(/\s+/g, ' ').trim();

  // Step 4 — tokenize
  let tokens = processed.split(' ').filter(Boolean);

  // Step 5 — apply transliteration map
  tokens = tokens.map((token) => TRANSLITERATION_MAP[token] || token);

  // Step 5b — apply spelling corrections
  tokens = tokens.map((token) => SPELLING_CORRECTIONS[token] || token);

  // Step 5c — apply basic stemming
  tokens = tokens.map(simpleStem);

  // Step 6 — remove stopwords (both English and Hindi)
  tokens = tokens.filter(
    (token) => !ENGLISH_STOPWORDS.has(token) && !HINDI_STOPWORDS.has(token) && token.length > 1
  );

  const cleaned = tokens.join(' ');

  return { cleaned, tokens, original };
}

/**
 * Utility: tokenize without stopword removal (used for reference sentence
 * processing where we want full vocabulary for TF-IDF).
 *
 * @param {string} text
 * @returns {string[]}
 */
export function tokenizeRaw(text) {
  if (!text || typeof text !== 'string') return [];

  let processed = text.toLowerCase();
  processed = processed.replace(/[^a-z0-9\s\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/g, ' ');
  processed = processed.replace(/\s+/g, ' ').trim();

  let tokens = processed.split(' ').filter(Boolean);
  tokens = tokens.map((token) => TRANSLITERATION_MAP[token] || token);
  tokens = tokens.map((token) => SPELLING_CORRECTIONS[token] || token);
  tokens = tokens.map(simpleStem);

  return tokens.filter((t) => t.length > 1);
}

export default preprocessText;
