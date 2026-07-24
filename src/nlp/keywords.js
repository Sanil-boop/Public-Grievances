/**
 * keywords.js
 * ───────────
 * Keyword-based fallback classifier for civic complaints.
 * Used as the primary fast classifier and as a fallback when the TF-IDF
 * engine hasn't finished initializing.
 *
 * Each category has 30+ weighted keywords (English + Hindi transliterated).
 * Keywords are scored by specificity:
 *   • weight 3 — highly specific to only one category
 *   • weight 2 — moderately specific, may appear in 2-3 categories
 *   • weight 1 — general but still relevant
 *
 * Exports:
 *   keywordClassify(text) → [{ category, confidence, matchedKeywords }]
 */

import { preprocessText } from './preprocessor.js';

// ────────────────────────────────────────────────────────────────────────────
// KEYWORD DICTIONARIES
// Each keyword maps to a weight (1-3).
// ────────────────────────────────────────────────────────────────────────────

const KEYWORD_DICTS = {
  garbage: {
    garbage: 3, kachra: 3, kachara: 3, kachre: 3, kooda: 3, kuda: 3,
    'solid waste': 3, dustbin: 3, litter: 3, littering: 3, dumping: 3,
    trash: 3, rubbish: 3, waste: 2, 'garbage truck': 3, 'kachra gadi': 3,
    sweeping: 2, jhadu: 2, safai: 2, cleaning: 2, 'waste management': 3,
    segregation: 3, 'dry waste': 3, 'wet waste': 3, compost: 2,
    debris: 2, dump: 2, overflowing: 2, bins: 2, pickup: 2,
    collection: 2, 'not collected': 3, stink: 2, stinking: 2,
    recycle: 2, municipal: 1, sanitation: 1, 'safai karmchari': 3,
    pile: 2, scattered: 1, burning: 1, 'open dumping': 3,
    plastic: 1, 'bio waste': 3, smell: 1,
  },

  water: {
    water: 3, paani: 3, pani: 3, jal: 3, supply: 2, pipeline: 3,
    pipe: 2, leak: 2, leaking: 2, leakage: 3, tap: 2, nal: 2,
    nalka: 2, tanker: 3, 'water tanker': 3, 'water supply': 3,
    pressure: 2, contaminated: 2, dirty: 1, ganda: 1,
    'drinking water': 3, 'peene ka paani': 3, bore: 2, borewell: 3,
    'bore well': 3, handpump: 3, pump: 2, meter: 2, 'water meter': 3,
    connection: 2, flooding: 1, 'water bill': 2, 'broken pipe': 3,
    'pipeline burst': 3, 'pipeline leak': 3, 'no water': 3,
    'water cut': 3, 'paani band': 3, 'paani nahi': 3,
    insects: 1, worms: 1, keede: 1, 'water connection': 3,
    yellow: 1, 'bad taste': 2, 'bad smell': 1,
  },

  roads: {
    road: 3, sadak: 3, sarak: 3, pothole: 3, potholes: 3, gaddha: 3,
    gadha: 3, gaddhe: 3, highway: 2, footpath: 2, pavement: 2,
    'speed breaker': 3, divider: 2, asphalt: 3, tar: 2, cement: 1,
    crack: 2, cracks: 2, broken: 1, repair: 1, resurfacing: 3,
    'road repair': 3, construction: 1, 'road construction': 3,
    eroded: 2, damaged: 1, 'traffic signal': 2, signal: 1,
    'zebra crossing': 3, marking: 2, lane: 1, bridge: 2,
    'road safety': 3, accident: 2, 'manhole open': 2, sinkhole: 3,
    caved: 3, waterlogged: 2, 'road light': 2,
    'kharab sadak': 3, 'tuti sadak': 3, 'sadak toot': 3,
    encroachment: 1, pedestrian: 2, rasta: 2, barrier: 2,
  },

  streetlights: {
    'street light': 3, streetlight: 3, 'street lamp': 3, lamp: 2,
    light: 2, batti: 3, bulb: 2, LED: 2, lighting: 2,
    dark: 2, darkness: 2, andhera: 3, pole: 2, khamba: 3,
    khambha: 3, electric: 1, bijli: 2, 'not working': 1,
    'band hai': 1, fuse: 2, 'fuse ho gaya': 3, flickering: 3,
    wiring: 2, wire: 1, taar: 1, solar: 2, 'solar light': 3,
    sensor: 2, timer: 2, 'night safety': 2, unsafe: 1,
    'light band': 3, 'light nahi': 3, 'batti band': 3,
    'gali ki light': 3, 'colony light': 3,
    leaning: 2, tilted: 2, tedha: 2, 'bijli ka khamba': 3,
    maintenance: 1, 'raat ko': 1, night: 1,
    installed: 1, 'not installed': 2, 'light kharab': 3,
  },

  drainage: {
    drain: 3, drainage: 3, nali: 3, naali: 3, naala: 3, sewer: 3,
    sewar: 3, sewage: 3, gutter: 3, gatar: 3, manhole: 2,
    overflow: 2, overflowing: 2, clogged: 3, blocked: 2, choked: 3,
    waterlogging: 3, 'water logging': 3, 'jal bharav': 3, flooding: 2,
    stagnant: 2, 'stagnant water': 3, 'ruka paani': 3,
    stench: 2, badbu: 3, smell: 1, stink: 2,
    'nali band': 3, 'drain block': 3, 'gutter overflow': 3,
    'sewage overflow': 3, monsoon: 1, rain: 1, baarish: 1,
    basement: 1, 'drain cover': 3, 'drain cleaning': 3,
    'naali safai': 3, 'storm drain': 3, 'sewage treatment': 3,
    mosquito: 1, machhar: 1, breeding: 1,
    'ganda paani': 2, 'paani bhar': 2,
  },

  illegal_construction: {
    illegal: 3, unauthorized: 3, 'illegal construction': 3,
    encroachment: 3, kabza: 3, 'bina permission': 3, 'without permission': 3,
    'building permission': 3, 'building plan': 3, violation: 3,
    'fire safety': 2, setback: 3, 'boundary wall': 2,
    'extra floor': 3, 'additional floor': 3, manzil: 2,
    'commercial building': 2, residential: 1, zoning: 3,
    'town planning': 3, builder: 2, construction: 2,
    demolish: 3, demolition: 3, 'unauthorized construction': 3,
    approval: 2, permission: 2, notice: 1,
    basement: 1, cellar: 2, parking: 1,
    'rainwater harvesting': 2, 'bina approval': 3,
    'building rules': 3, 'building code': 3, nirman: 2,
    imarat: 2, 'illegal building': 3, 'illegal extension': 3,
    'footpath encroachment': 3, structure: 1,
  },

  parks: {
    park: 3, garden: 3, bagicha: 3, baag: 3, tree: 3, ped: 3,
    pedh: 3, darakht: 3, plant: 2, plants: 2, paudha: 2,
    paudhe: 2, grass: 2, ghaas: 2, green: 1, sapling: 2,
    'tree cutting': 3, 'ped katai': 3, 'tree trimming': 3,
    'fallen tree': 3, 'dead tree': 3, branches: 2, daali: 2,
    bench: 2, swing: 2, jhula: 2, jhule: 2, playground: 3,
    'jogging track': 3, 'walking track': 3, flower: 2,
    horticulture: 3, nursery: 2, 'park maintenance': 3,
    'park light': 2, encroached: 2, vendor: 1,
    'green space': 3, 'open space': 2, roots: 2,
    'tree roots': 3, trimming: 2, pruning: 3,
    'sookha ped': 3, 'ped gir': 3, 'ped laga': 3,
  },

  stray_animals: {
    stray: 3, aawara: 3, dog: 3, dogs: 3, kutta: 3, kutte: 3,
    kutton: 3, cattle: 3, cow: 2, cows: 2, gaay: 3, gaaye: 3,
    bull: 2, ox: 2, bail: 2, monkey: 3, monkeys: 3, bandar: 3,
    pig: 2, pigs: 2, suwar: 2, suar: 2, snake: 2, saanp: 2,
    rat: 1, rats: 1, chuhe: 1, chuha: 1, bite: 3, 'dog bite': 3,
    barking: 3, 'bhaukte hain': 3, aggressive: 2, attack: 2,
    attacking: 2, hamla: 2, carcass: 2, 'dead animal': 3,
    'mara hua janwar': 3, rabies: 3, vaccination: 2,
    'animal control': 3, 'birth control': 2, nasbandi: 3,
    'animal shelter': 3, rescue: 2, injured: 1,
    chasing: 2, roaming: 2, 'stray animal': 3,
    janwar: 2, janwaron: 2, 'aawara kutte': 3,
    'aawara gaay': 3, wild: 2, 'jungle se': 2,
  },

  property_tax: {
    tax: 3, property: 2, 'property tax': 3, bill: 2, billing: 3,
    payment: 2, 'online payment': 2, receipt: 2, raseed: 2,
    assessment: 3, 'tax assessment': 3, mutation: 3,
    exemption: 3, 'senior citizen': 1, penalty: 2,
    'double billing': 3, 'wrong bill': 3, 'galat bill': 3,
    refund: 2, rebate: 2, cess: 2, 'garbage cess': 2,
    clearance: 2, 'clearance certificate': 3, revenue: 2,
    'tax office': 3, 'tax record': 3, commercial: 1,
    'vacant land': 2, arrears: 3, 'tax bill': 3,
    'bill zyada': 3, 'tax zyada': 3, 'galat reading': 2,
    kist: 2, bhugtan: 2, 'water bill': 2,
    'meter reading': 2, correction: 2, objection: 2,
    'tax rate': 3, 'property record': 3,
  },

  noise_pollution: {
    noise: 3, shor: 3, loud: 2, loudspeaker: 3, speaker: 2,
    DJ: 3, music: 2, honking: 3, horn: 2, pollution: 3,
    'noise pollution': 3, 'air pollution': 3, smoke: 2,
    dhuaan: 2, dhuan: 2, factory: 2, industrial: 2,
    emission: 3, fumes: 3, chemical: 2, dust: 2, dhool: 2,
    firecrackers: 3, pataakhe: 3, patakhe: 3, crackers: 2,
    generator: 3, 'generator noise': 3, blasting: 3,
    vibration: 2, 'banquet hall': 3, 'late night': 2,
    midnight: 2, 'raat ko': 1, party: 1, wedding: 1,
    shaadi: 1, crusher: 3, quarry: 3, pradushan: 3,
    'tez awaaz': 3, 'shor sharaba': 3, silencer: 3,
    nuisance: 2, disturbance: 2, 'construction noise': 2,
  },

  public_health: {
    health: 3, 'public health': 3, sanitation: 3, hygiene: 3,
    mosquito: 3, machhar: 3, machchhar: 3, dengue: 3, malaria: 3,
    disease: 2, bimari: 2, bimaari: 2, epidemic: 3,
    'pest control': 3, fogging: 3, toilet: 3, 'public toilet': 3,
    latrine: 3, 'open defecation': 3, 'shauch': 3,
    unhygienic: 3, contaminated: 2, diarrhea: 3, dast: 3,
    vomiting: 2, fever: 1, bukhar: 1, infection: 2,
    'food safety': 3, 'expired food': 3, 'food stall': 2,
    'meat shop': 2, hospital: 1, aspatal: 1, clinic: 1,
    'health camp': 3, 'checkup camp': 3, vaccination: 2,
    'hand wash': 2, disinfection: 3, 'rat infestation': 2,
    'health hazard': 3, 'safai abhiyan': 3, 'swachh': 3,
    breeding: 2, stagnant: 1, sewage: 1,
  },

  health_care: {
    health: 3, care: 2, 'health care': 3, hospital: 3, aspatal: 3, 
    clinic: 3, doctor: 3, nurse: 2, medical: 3, ambulance: 3,
    emergency: 3, 'emergency ward': 3, medicine: 3, dawai: 3,
    patient: 3, mareez: 3, treatment: 3, ilaj: 3,
    admit: 3, 'not taking': 2, 'shortage': 2, kami: 2,
    injured: 2, ghayal: 2, 'medical help': 3,
    bed: 2, beds: 2, 'bed shortage': 3, 'no bed': 3, 'bed nahi': 3,
    'blood bank': 3, 'khoon': 2, 'blood': 2, specialist: 3, 'specialist doctor': 3,
    'xray': 2, 'x-ray': 3, laboratory: 2, lab: 2, 'lab test': 3,
    ward: 2, 'general ward': 3, 'ICU': 3, 'icu bed': 3,
    'waiting time': 2, queue: 2, 'long queue': 3, 'lambi line': 3,
    operation: 3, surgery: 3, 'operation theatre': 3, OT: 3,
    'staff behavior': 2, 'rude staff': 3, neglect: 2,
    pharmacy: 3, 'dawai ki dukaan': 3, dispensary: 3,
    'health center': 3, 'primary health center': 3, PHC: 3,
    cleanliness: 1, dirty: 1, ganda: 1,
  },

  road_accident: {
    accident: 3, crash: 3, collision: 3, collided: 3, takkar: 3,
    'road accident': 3, highway: 2, 'fatal accident': 3,
    skidded: 3, fisal: 3, 'traffic block': 2, jam: 1,
    ambulance: 2, 'emergency response': 3, victim: 3,
    injured: 3, ghayal: 3, dead: 2, maut: 2,
    bike: 1, car: 1, gaadi: 1,
    'hit and run': 3, 'hit-and-run': 3, 'bhag gaya': 3,
    pedestrian: 3, 'paidal': 3, 'paidal yatri': 3,
    'drunk driving': 3, 'sharab': 2, 'nasha': 2,
    'school zone': 3, 'school ke paas': 3,
    pileup: 3, 'pile up': 3, 'chain accident': 3,
    'two wheeler': 2, 'auto': 2, 'rickshaw': 2,
    'bus accident': 3, 'truck accident': 3,
    'accident black spot': 3, 'khatarnak mod': 3,
    overturned: 3, 'palat gayi': 3, 'ulat gayi': 3,
    'no guardrail': 3, 'no barrier': 3, railing: 2,
    'signal kharab': 2, 'red light': 2, 'signal malfunction': 3,
    speeding: 3, 'tez raftar': 3, 'over speed': 3,
    'road rage': 3, 'death': 2, 'mrityu': 2,
  },

  other: {
    certificate: 2, 'birth certificate': 3, 'death certificate': 3,
    'marriage registration': 3, 'ration card': 3, aadhaar: 2,
    'e-governance': 3, portal: 2, website: 2, online: 1,
    scheme: 2, yojana: 2, yojnaon: 2, pension: 3,
    councillor: 3, 'ward councillor': 3, municipality: 1,
    'nagar palika': 2, 'nagar nigam': 2, office: 1,
    staff: 1, 'not helpful': 2, rude: 2, information: 1,
    'community hall': 3, library: 3, 'public library': 3,
    infrastructure: 1, complaint: 1, shikayat: 1,
    general: 1, miscellaneous: 2, apply: 1,
    registration: 2, 'government hospital': 2,
    'sarkari hospital': 2, form: 1, document: 1,
    'no response': 2, 'koi jawab nahi': 2, delayed: 1,
    'id card': 2, 'voter id': 2, help: 1, madad: 1,
  },
};

// ────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Build a flat lookup: token → [{ category, weight }]
 * Multi-word keywords are handled by checking bigrams / trigrams.
 */
function buildLookup() {
  const single = {};   // single-word → [{ category, weight }]
  const multi = [];     // { tokens: string[], category, weight }

  for (const [category, keywords] of Object.entries(KEYWORD_DICTS)) {
    for (const [keyword, weight] of Object.entries(keywords)) {
      const parts = keyword.toLowerCase().split(/\s+/);
      if (parts.length === 1) {
        if (!single[parts[0]]) single[parts[0]] = [];
        single[parts[0]].push({ category, weight });
      } else {
        multi.push({ tokens: parts, category, weight });
      }
    }
  }

  return { single, multi };
}

const LOOKUP = buildLookup();



// ────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ────────────────────────────────────────────────────────────────────────────

/**
 * keywordClassify
 *
 * Scores a complaint against every category keyword dictionary and returns
 * results sorted by descending confidence.
 *
 * @param {string} text — raw complaint text
 * @returns {Array<{ category: string, confidence: number, matchedKeywords: string[] }>}
 */
export function keywordClassify(text) {
  const { tokens } = preprocessText(text);
  if (tokens.length === 0) {
    return Object.keys(KEYWORD_DICTS).map((category) => ({
      category,
      confidence: 0,
      matchedKeywords: [],
    }));
  }

  // Raw scores + matched keywords per category
  const scores = {};
  const matched = {};
  for (const cat of Object.keys(KEYWORD_DICTS)) {
    scores[cat] = 0;
    matched[cat] = new Set();
  }

  // ── Single-word matches ────────────────────────────────────────────────
  for (const token of tokens) {
    const entries = LOOKUP.single[token];
    if (entries) {
      for (const { category, weight } of entries) {
        scores[category] += weight;
        matched[category].add(token);
      }
    }
  }

  // ── Multi-word (bigram/trigram) matches ────────────────────────────────
  const joined = tokens.join(' ');
  for (const { tokens: kwTokens, category, weight } of LOOKUP.multi) {
    const phrase = kwTokens.join(' ');
    if (joined.includes(phrase)) {
      scores[category] += weight;
      matched[category].add(phrase);
    }
  }

  // ── Normalize to 0–1 confidence ────────────────────────────────────────
  // We use a softer normalization:
  //   confidence = 1 - e^(-rawScore / dampingFactor)
  // This maps any positive score into (0, 1) with diminishing returns,
  // avoiding unrealistically low confidence when the max possible score
  // is very large (hundreds of keywords).
  const DAMPING = 6; // tuned so that a score of ~8 → ~0.74, ~12 → ~0.86

  const results = Object.keys(KEYWORD_DICTS).map((category) => ({
    category,
    confidence: scores[category] > 0
      ? parseFloat((1 - Math.exp(-scores[category] / DAMPING)).toFixed(4))
      : 0,
    matchedKeywords: [...matched[category]],
  }));

  // Sort descending by confidence
  results.sort((a, b) => b.confidence - a.confidence);

  return results;
}

/**
 * Expose the keyword dictionaries for use by the TF-IDF engine.
 */
export { KEYWORD_DICTS };

export default keywordClassify;
