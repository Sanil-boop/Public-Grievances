import { TRANSPORT_CATEGORIES, TRANSPORT_DEPARTMENTS } from './transportCategories.js';
import { preprocessText, tokenizeRaw } from './preprocessor.js';

let _ready = false;
let _df = {};
let _totalDocs = 0;
let _refVectors = [];
let _centroids = {};

const TRANSPORT_KEYWORD_DICTS = {
  'bus_delay': {
    'bus': 2, 'late': 3, 'delay': 3, 'cancel': 4, 'skip': 3, 'wait': 2, 'time': 2, 'schedule': 3,
    'route': 2, 'stop': 2, 'aayi': 3, 'roz': 2, 'wait': 2, 'kab': 2, 'arrive': 3, 'timing': 3,
    'buses': 2, 'irregular': 4, 'never': 2, 'miss': 3, 'hour': 2, 'minute': 2, 'ghante': 2,
    'subah': 1, 'office': 1, 'phir': 1, 'hamesha': 3, 'kisi': 1, 'bina': 2, 'bataye': 2
  },
  'ticket_fare': {
    'ticket': 4, 'fare': 4, 'charge': 3, 'overcharge': 4, 'extra': 3, 'refund': 4, 'invalid': 3,
    'e-ticket': 4, 'conductor': 3, 'machine': 3, 'paise': 3, 'double': 3, 'smart': 2, 'card': 2,
    'change': 3, 'money': 2, 'deduct': 3, 'kat': 2, 'diya': 1, 'le': 1, 'liye': 1, 'zyada': 3,
    'kharab': 2, 'scan': 3, 'issue': 2, 'paper': 2, 'price': 3, 'cost': 2, 'amount': 2, 'pay': 2
  },
  'driver_conduct': {
    'driver': 4, 'conduct': 3, 'rude': 4, 'rash': 4, 'drive': 3, 'smoke': 4, 'phone': 3,
    'abuse': 4, 'refuse': 3, 'behavior': 4, 'speed': 3, 'gaali': 4, 'battameezi': 4, 'beedi': 4,
    'tez': 3, 'chala': 2, 'darr': 3, 'staff': 3, 'unprofessional': 4, 'reckless': 4, 'panic': 3,
    'shout': 4, 'ladies': 3, 'harass': 4, 'bad': 2, 'gali': 4, 'galoch': 4, 'signal': 2, 'tod': 2,
    'overtake': 3, 'ignore': 3, 'request': 2
  },
  'metro_rail': {
    'metro': 5, 'train': 4, 'ac': 4, 'escalator': 4, 'platform': 4, 'coach': 3, 'breakdown': 4,
    'station': 3, 'door': 3, 'tunnel': 4, 'announcement': 3, 'bheed': 3, 'garmi': 3, 'ruk': 3,
    'khul': 2, 'late': 2, 'crowd': 4, 'overcrowd': 4, 'rush': 3, 'lift': 4, 'recharge': 3,
    'frequency': 3, 'breathe': 3, 'stuck': 4, 'counter': 3, 'close': 2, 'band': 3, 'out': 2
  },
  'auto_cab': {
    'auto': 5, 'cab': 5, 'taxi': 5, 'meter': 5, 'surge': 4, 'price': 3, 'tamper': 4,
    'refuse': 4, 'cancel': 3, 'ride': 4, 'cash': 3, 'online': 3, 'payment': 3, 'ola': 4, 'uber': 4,
    'mana': 4, 'fast': 3, 'double': 3, 'paise': 3, 'maang': 3, 'battameezi': 3, 'demand': 4,
    'offline': 3, 'rig': 4, 'stand': 3, 'plate': 3, 'number': 2, 'manmani': 4, 'go': 2, 'destination': 3
  },
  'road_traffic': {
    'road': 4, 'traffic': 5, 'pothole': 5, 'signal': 4, 'jam': 5, 'sign': 4, 'intersection': 4,
    'streetlight': 4, 'light': 3, 'broken': 3, 'gaddhaa': 5, 'chauraha': 4, 'phanse': 3,
    'highway': 4, 'baarish': 2, 'toot': 3, 'police': 3, 'red': 3, 'zebra': 4, 'crossing': 4,
    'accident': 4, 'congestion': 4, 'vip': 3, 'roundabout': 4, 'repair': 3, 'dangerous': 3,
    'night': 2, 'daily': 2, 'condition': 3, 'management': 3
  },
  'vehicle_condition': {
    'seat': 4, 'condition': 3, 'dirty': 4, 'broken': 3, 'window': 4, 'unsafe': 4, 'ventilation': 5,
    'leak': 4, 'roof': 4, 'engine': 4, 'noise': 3, 'handle': 4, 'tuti': 4, 'gandi': 4, 'badboodar': 5,
    'sheeshe': 4, 'pani': 3, 'khatara': 5, 'hawa': 3, 'hygiene': 4, 'unhygienic': 4, 'glass': 3,
    'unfit': 4, 'exhaust': 4, 'fan': 3, 'cover': 3, 'torn': 4, 'smoke': 4, 'black': 3, 'rain': 2
  },
  'parking': {
    'park': 5, 'parking': 5, 'tow': 5, 'challan': 5, 'space': 4, 'double': 3, 'mafia': 5,
    'block': 4, 'fee': 3, 'zone': 4, 'footpath': 4, 'galat': 3, 'jagah': 4, 'raasta': 3,
    'aage': 2, 'ticket': 3, 'infrastructure': 3, 'haphazard': 4, 'goon': 4, 'collect': 3,
    'driveway': 4, 'multi-level': 4, 'home': 2, 'illegal': 4, 'valid': 3, 'online': 2, 'spot': 3
  }
};

function computeTF(tokens) {
  const tf = {};
  tokens.forEach(t => {
    tf[t] = (tf[t] || 0) + 1;
  });
  const max = Math.max(...Object.values(tf), 1);
  for (let t in tf) {
    tf[t] = tf[t] / max;
  }
  return tf;
}

function computeTFIDF(tf) {
  const tfidf = {};
  for (let t in tf) {
    let idf = 0;
    if (_df[t]) {
      idf = Math.log(_totalDocs / _df[t]);
    }
    tfidf[t] = tf[t] * idf;
  }
  return tfidf;
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let key in vecA) {
    if (vecB[key]) {
      dotProduct += vecA[key] * vecB[key];
    }
    normA += vecA[key] ** 2;
  }
  
  for (let key in vecB) {
    normB += vecB[key] ** 2;
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function initTransportClassifier() {
  _df = {};
  _refVectors = [];
  _totalDocs = 0;
  _centroids = {};

  const allTokensList = [];

  TRANSPORT_CATEGORIES.forEach(cat => {
    cat.referenceSentences.forEach(sentence => {
      const tokens = preprocessText(sentence);
      allTokensList.push({ catId: cat.id, tokens });
      _totalDocs++;
      
      const uniqueTokens = [...new Set(tokens)];
      uniqueTokens.forEach(t => {
        _df[t] = (_df[t] || 0) + 1;
      });
    });
  });

  const catVectors = {};

  allTokensList.forEach(item => {
    const tf = computeTF(item.tokens);
    const tfidf = computeTFIDF(tf);
    _refVectors.push({ catId: item.catId, vector: tfidf });
    
    if (!catVectors[item.catId]) {
      catVectors[item.catId] = [];
    }
    catVectors[item.catId].push(tfidf);
  });

  for (let catId in catVectors) {
    const vectors = catVectors[catId];
    const centroid = {};
    vectors.forEach(vec => {
      for (let term in vec) {
        centroid[term] = (centroid[term] || 0) + vec[term];
      }
    });
    for (let term in centroid) {
      centroid[term] /= vectors.length;
    }
    _centroids[catId] = centroid;
  }

  _ready = true;
  return Promise.resolve();
}

export function classifyTransportComplaint(text) {
  if (!_ready) {
    throw new Error('Transport Classifier not initialized. Call initTransportClassifier() first.');
  }

  const tokens = preprocessText(text);
  const tf = computeTF(tokens);
  const inputVector = computeTFIDF(tf);

  const keywordScores = {};
  TRANSPORT_CATEGORIES.forEach(cat => { keywordScores[cat.id] = 0; });

  tokens.forEach(token => {
    for (let catId in TRANSPORT_KEYWORD_DICTS) {
      if (TRANSPORT_KEYWORD_DICTS[catId][token]) {
        keywordScores[catId] += TRANSPORT_KEYWORD_DICTS[catId][token];
      }
    }
  });

  let maxKeywordScore = Math.max(...Object.values(keywordScores), 1);
  const normalizedKeywordScores = {};
  for (let catId in keywordScores) {
    normalizedKeywordScores[catId] = keywordScores[catId] / maxKeywordScore;
  }

  const tfidfScores = {};
  TRANSPORT_CATEGORIES.forEach(cat => {
    let maxSim = 0;
    _refVectors.filter(rv => rv.catId === cat.id).forEach(rv => {
      const sim = cosineSimilarity(inputVector, rv.vector);
      if (sim > maxSim) maxSim = sim;
    });
    const centroidSim = cosineSimilarity(inputVector, _centroids[cat.id]);
    tfidfScores[cat.id] = (maxSim + centroidSim) / 2;
  });

  const finalScores = [];
  TRANSPORT_CATEGORIES.forEach(cat => {
    const kScore = normalizedKeywordScores[cat.id] || 0;
    const tScore = tfidfScores[cat.id] || 0;
    const finalConf = (kScore * 0.45) + (tScore * 0.55);
    
    finalScores.push({
      category: cat.id,
      categoryName: cat.name,
      confidence: finalConf,
      icon: cat.icon,
      color: cat.color
    });
  });

  finalScores.sort((a, b) => b.confidence - a.confidence);
  
  const topMatch = finalScores[0];
  const department = TRANSPORT_DEPARTMENTS[topMatch.category] || null;

  return {
    predictions: finalScores,
    topCategory: topMatch.category,
    topCategoryName: topMatch.categoryName,
    topConfidence: topMatch.confidence,
    department,
    preprocessed: {
      cleaned: tokens.join(' '),
      tokens,
      original: text
    },
    timestamp: Date.now()
  };
}

export function isTransportClassifierReady() {
  return _ready;
}
