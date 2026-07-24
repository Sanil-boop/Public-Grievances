import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  ArrowRight,
  MessageSquare,
  Clock,
  Building2,
  Mail,
  Phone,
  Send,
  AlertTriangle,
  Info,
  ArrowLeft,
  List,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ComplaintCard from '../components/ComplaintCard/ComplaintCard';
import styles from './CategoryDetail.module.css';

/* ════════════════════════════════════════════════════════════════════════════
   CATEGORY DATA — Complete realistic data for all 12 categories
   ════════════════════════════════════════════════════════════════════════════ */

const CATEGORY_DATA = {
  /* ── Water Supply ─────────────────────────────────────────────────────── */
  water: {
    id: 'water',
    name: 'Water Supply',
    emoji: '💧',
    color: '#2196F3',
    description:
      'Report issues related to water supply disruptions, pipeline leaks, contamination, and tanker requests in your area.',
    department: 'Water Works Department',
    deptEmail: 'water@nagarseva.gov.in',
    deptPhone: '1800-XXX-1002',
    urgentTime: '12–24 hours',
    normalTime: '3–5 days',
    about:
      'The Water Supply category covers all issues related to the municipal water distribution system. This includes disruptions in regular water supply, low water pressure, contaminated or discolored water coming from taps, pipeline leaks and bursts, water tanker requests during shortages, faulty water meters, and applications for new water connections. If you notice water wastage from broken pipelines or receive water that smells or looks unsafe, file a complaint here for swift action.',
    topics: [
      'Supply disruptions',
      'Low pressure',
      'Contaminated water',
      'Pipeline leaks',
      'Tanker requests',
      'Meter issues',
      'New connections',
      'Billing disputes',
    ],
    commonComplaints: [
      'No water supply since morning in our colony',
      'Water pressure is very low, takes 1 hour to fill a bucket',
      'Brown and dirty water coming from the tap',
      'Pipeline burst on main road, water wasting for 2 days',
      'Water tanker has not come this week despite request',
      'Water smells like sewage, children are falling sick',
      'Water meter showing wrong reading, bill is too high',
      'No water connection given to our new house since 3 months',
    ],
    relatedCategories: ['drainage', 'public_health', 'garbage'],
  },

  /* ── Garbage / Solid Waste ────────────────────────────────────────────── */
  garbage: {
    id: 'garbage',
    name: 'Garbage / Solid Waste',
    emoji: '🗑️',
    color: '#8B4513',
    description:
      'Report garbage collection failures, overflowing bins, illegal dumping, and street sweeping issues.',
    department: 'Solid Waste Management Department',
    deptEmail: 'swm@nagarseva.gov.in',
    deptPhone: '1800-XXX-1001',
    urgentTime: '24–48 hours',
    normalTime: '3–5 days',
    about:
      'The Garbage / Solid Waste category covers all complaints related to solid waste management in your area. This includes irregular or missed garbage collection, overflowing community dustbins, illegal dumping of waste on roads or vacant plots, poor street sweeping, burning of garbage causing air pollution, and removal of dead animals from public areas. If your area is not receiving regular waste pickup or you spot large piles of uncollected garbage, report it here.',
    topics: [
      'Missed collection',
      'Overflowing bins',
      'Illegal dumping',
      'Street sweeping',
      'Dead animal removal',
      'Garbage burning',
      'Waste segregation',
      'Construction debris',
    ],
    commonComplaints: [
      'Garbage not collected from our lane since one week',
      'Community dustbin is overflowing, garbage spilling on road',
      'Someone is dumping construction debris on the footpath',
      'Street sweeping not happening, leaves and trash piling up',
      'Dead animal body lying near park gate since 3 days',
      'People burning garbage in the open, causing breathing issues',
      'Garbage truck comes at random times, we keep missing it',
      'Plastic waste scattered all around the children\'s playground',
    ],
    relatedCategories: ['public_health', 'drainage', 'stray_animals'],
  },

  /* ── Roads & Potholes ─────────────────────────────────────────────────── */
  roads: {
    id: 'roads',
    name: 'Roads & Potholes',
    emoji: '🚧',
    color: '#FF9800',
    description:
      'Report potholes, damaged roads, broken footpaths, speed breaker issues, and missing road markings.',
    department: 'Public Works Department (Roads)',
    deptEmail: 'roads@nagarseva.gov.in',
    deptPhone: '1800-XXX-1003',
    urgentTime: '2–3 days',
    normalTime: '7–15 days',
    about:
      'The Roads & Potholes category handles complaints about the condition of municipal roads and related infrastructure. This includes potholes and craters on roads, completely broken or damaged road surfaces, damaged or encroached footpaths, improperly built speed breakers, faded or missing road markings and signage, road waterlogging due to poor design, and abandoned road construction work. If you encounter dangerous road conditions that risk accidents, please report them immediately.',
    topics: [
      'Potholes',
      'Broken roads',
      'Speed bumps needed',
      'Road markings',
      'Footpath damage',
      'Waterlogged roads',
      'Road construction delays',
      'Missing signage',
    ],
    commonComplaints: [
      'Huge pothole on main road near market, causing accidents daily',
      'Road completely broken after monsoon, no repairs done',
      'Speed breaker too high, vehicles getting damaged',
      'Footpath tiles broken, senior citizens falling regularly',
      'Road construction abandoned midway, half-dug road is dangerous',
      'No road markings at busy junction, frequent near-misses',
      'Road caves in near drainage, sinkhole forming rapidly',
      'Newly laid road already cracking, poor quality tar used',
    ],
    relatedCategories: ['streetlights', 'drainage', 'illegal_construction'],
  },

  /* ── Street Lights ────────────────────────────────────────────────────── */
  streetlights: {
    id: 'streetlights',
    name: 'Street Lights',
    emoji: '💡',
    color: '#FFC107',
    description:
      'Report non-functional street lights, flickering bulbs, dark spots, and new light installation requests.',
    department: 'Electrical & Street Lighting Department',
    deptEmail: 'lights@nagarseva.gov.in',
    deptPhone: '1800-XXX-1004',
    urgentTime: '2–4 days',
    normalTime: '5–10 days',
    about:
      'The Street Lights category covers all issues related to public street lighting across the municipality. This includes non-functional or fused street light bulbs, flickering lights that need repair, leaning or damaged electric poles, dark stretches on roads that are unsafe at night, requests for new street light installations in underserved areas, faulty automatic timers or sensors, and exposed wiring that poses electrocution risk. Proper lighting is critical for safety — report issues promptly.',
    topics: [
      'Broken lights',
      'Flickering bulbs',
      'New light requests',
      'Dark spots',
      'Damaged poles',
      'Faulty timers',
      'Exposed wiring',
      'Solar light issues',
    ],
    commonComplaints: [
      'Street light not working in our lane since 2 weeks',
      'All lights in our colony are off, entire area is dark at night',
      'Street light pole is leaning dangerously, may fall on cars',
      'Light flickers all night, very disturbing for residents',
      'No street light near school, children walk in dark mornings',
      'Wires from street light are hanging loose, electric shock risk',
      'New LED lights were installed but never switched on',
      'Street lights stay on during daytime, wasting electricity',
    ],
    relatedCategories: ['roads', 'noise_pollution', 'parks'],
  },

  /* ── Drainage / Sewage ────────────────────────────────────────────────── */
  drainage: {
    id: 'drainage',
    name: 'Drainage / Sewage',
    emoji: '🌊',
    color: '#00BCD4',
    description:
      'Report blocked drains, sewage overflow, open manholes, waterlogging, and clogged gutters.',
    department: 'Drainage & Sewerage Department',
    deptEmail: 'drainage@nagarseva.gov.in',
    deptPhone: '1800-XXX-1005',
    urgentTime: '12–48 hours',
    normalTime: '3–7 days',
    about:
      'The Drainage / Sewage category addresses all complaints about the underground and surface drainage systems. This includes blocked or choked drains causing sewage overflow, open or broken manhole covers posing fall hazards, waterlogging during monsoon due to poor drainage, clogged roadside gutters, sewage water mixing with drinking water lines, mosquito breeding in stagnant drain water, and the need for pre-monsoon drain cleaning. These issues directly impact public health and safety.',
    topics: [
      'Blocked drains',
      'Sewage overflow',
      'Open manholes',
      'Waterlogging',
      'Clogged gutters',
      'Mosquito breeding',
      'Drain cleaning',
      'Sewage mixing',
    ],
    commonComplaints: [
      'Drain completely blocked, sewage overflowing on road',
      'Open manhole on main road, children playing nearby at risk',
      'Waterlogging in our colony every time it rains heavily',
      'Sewage smell is unbearable, cannot open windows',
      'Gutter water entering our house during heavy rainfall',
      'Mosquitoes breeding in stagnant drain water, dengue risk',
      'Drain cleaning not done before monsoon season started',
      'Sewage water mixing into drinking water pipeline',
    ],
    relatedCategories: ['water', 'public_health', 'roads'],
  },

  /* ── Illegal Construction ─────────────────────────────────────────────── */
  illegal_construction: {
    id: 'illegal_construction',
    name: 'Illegal Construction',
    emoji: '🏗️',
    color: '#F44336',
    description:
      'Report unauthorized building, encroachment on public land, building code violations, and commercial activity in residential zones.',
    department: 'Town Planning & Building Department',
    deptEmail: 'planning@nagarseva.gov.in',
    deptPhone: '1800-XXX-1006',
    urgentTime: '3–5 days',
    normalTime: '10–20 days',
    about:
      'The Illegal Construction category deals with unauthorized building activities and encroachment. This includes construction without proper municipal approval or building permits, adding extra floors beyond sanctioned plans, encroachment on government land or public pathways, running commercial operations in residential-zoned areas, violating setback rules and building safety norms, fire safety violations in commercial buildings, and dumping construction debris on public roads. Report violations early to prevent permanent encroachment.',
    topics: [
      'Unauthorized building',
      'Encroachment',
      'Safety violations',
      'Commercial in residential',
      'Extra floors',
      'Setback violations',
      'Fire safety issues',
      'Construction debris',
    ],
    commonComplaints: [
      'Neighbor building extra floor without any permission',
      'Shop being built on government footpath, blocking walkway',
      'Commercial godown running in residential area',
      'New building violating setback rules, no space left',
      'Construction debris dumped on main road for weeks',
      'Building constructed without fire safety exits',
      'Illegal encroachment on park land by local builder',
      'Night-time construction causing disturbance, no permit shown',
    ],
    relatedCategories: ['noise_pollution', 'roads', 'parks'],
  },

  /* ── Parks & Trees ────────────────────────────────────────────────────── */
  parks: {
    id: 'parks',
    name: 'Parks & Trees',
    emoji: '🌳',
    color: '#4CAF50',
    description:
      'Report damaged park equipment, tree-related hazards, park maintenance issues, and unauthorized use of green spaces.',
    department: 'Horticulture & Parks Department',
    deptEmail: 'parks@nagarseva.gov.in',
    deptPhone: '1800-XXX-1007',
    urgentTime: '2–5 days',
    normalTime: '7–15 days',
    about:
      'The Parks & Trees category handles all complaints about public parks, gardens, playgrounds, and urban trees. This includes broken or rusted playground equipment that is dangerous for children, trees at risk of falling on buildings or roads, poor park maintenance and cleanliness, unauthorized encroachment or commercial use of park land, overgrown grass or bushes, damaged walking tracks and benches, lack of lighting in parks making them unsafe after dark, and requests for new tree planting or garden development.',
    topics: [
      'Damaged equipment',
      'Falling tree risk',
      'Park cleanliness',
      'Unauthorized use',
      'Overgrown grass',
      'Bench repair',
      'Park lighting',
      'Tree planting requests',
    ],
    commonComplaints: [
      'Park swings and slides are rusted and broken, kids got hurt',
      'Large tree leaning towards building, may fall in next storm',
      'Park not cleaned for weeks, garbage scattered everywhere',
      'Vendors have encroached the jogging track area',
      'Grass in the park is overgrown, snakes have been spotted',
      'Park benches are all broken, nowhere for seniors to sit',
      'No lights in the park, antisocial elements gather at night',
      'Someone illegally cut 5 trees in our colony park',
    ],
    relatedCategories: ['stray_animals', 'streetlights', 'garbage'],
  },

  /* ── Stray Animals ────────────────────────────────────────────────────── */
  stray_animals: {
    id: 'stray_animals',
    name: 'Stray Animals',
    emoji: '🐕',
    color: '#795548',
    description:
      'Report stray dog menace, cattle on roads, animal cruelty, dead animal removal, and animal rescue needs.',
    department: 'Animal Husbandry & Control Department',
    deptEmail: 'animals@nagarseva.gov.in',
    deptPhone: '1800-XXX-1008',
    urgentTime: '24–48 hours',
    normalTime: '3–7 days',
    about:
      'The Stray Animals category covers all animal-related civic issues within the municipality. This includes aggressive stray dogs attacking residents or chasing schoolchildren, stray cattle sitting on roads and causing traffic jams, dead animal carcasses that need removal from public areas, requests for animal birth control (ABC) programs, dog bite incidents requiring emergency response and vaccination camps, stray pigs roaming residential areas, and reports of animal cruelty or injured animals needing rescue.',
    topics: [
      'Stray dogs',
      'Cattle on roads',
      'Animal cruelty',
      'Dead animal removal',
      'Dog bite incidents',
      'ABC program',
      'Animal rescue',
      'Wild animal sighting',
    ],
    commonComplaints: [
      'Pack of stray dogs attacking people walking in the morning',
      'Stray cattle blocking the main road every evening',
      'Dead cow lying on the highway since 2 days, nobody removing it',
      'Dog bit a child in our colony, need vaccination camp urgently',
      'Stray dogs barking all night, entire colony cannot sleep',
      'Pigs roaming in residential area, creating hygiene issues',
      'Injured stray dog near market, needs medical attention',
      'Monkeys entering houses and stealing food, causing damage',
    ],
    relatedCategories: ['public_health', 'garbage', 'parks'],
  },

  /* ── Property Tax / Billing ───────────────────────────────────────────── */
  property_tax: {
    id: 'property_tax',
    name: 'Property Tax / Billing',
    emoji: '🧾',
    color: '#9C27B0',
    description:
      'Report incorrect tax bills, payment portal issues, assessment disputes, and property record corrections.',
    department: 'Revenue & Tax Department',
    deptEmail: 'tax@nagarseva.gov.in',
    deptPhone: '1800-XXX-1009',
    urgentTime: '5–7 days',
    normalTime: '15–30 days',
    about:
      'The Property Tax / Billing category handles all issues related to municipal property taxation and billing systems. This includes incorrect or inflated property tax bills, problems with the online payment portal, disputes over property assessment values, name or ownership changes in tax records, applying for senior citizen or other tax exemptions, penalty charges despite timely payments, double billing errors, requests for tax clearance certificates, and mutation of property not reflecting in official records.',
    topics: [
      'Wrong tax bill',
      'Payment issues',
      'New assessment',
      'Name change',
      'Tax exemptions',
      'Penalty disputes',
      'Double billing',
      'Clearance certificates',
    ],
    commonComplaints: [
      'Property tax bill is double the actual amount, calculation error',
      'Online payment portal shows error, cannot pay tax on time',
      'Property assessment done wrongly, small house taxed as commercial',
      'Need to change name on property tax after ownership transfer',
      'Penalty charged even though I paid before the deadline',
      'Senior citizen exemption not applied despite submitting documents',
      'Received duplicate bills for same property from two wards',
      'Tax clearance certificate not issued despite paying all dues',
    ],
    relatedCategories: ['water', 'other', 'garbage'],
  },

  /* ── Noise / Pollution ────────────────────────────────────────────────── */
  noise_pollution: {
    id: 'noise_pollution',
    name: 'Noise / Pollution',
    emoji: '📢',
    color: '#E91E63',
    description:
      'Report loud music disturbance, construction noise, factory pollution, and loudspeaker violations.',
    department: 'Environment & Pollution Control Department',
    deptEmail: 'environment@nagarseva.gov.in',
    deptPhone: '1800-XXX-1010',
    urgentTime: '24–48 hours',
    normalTime: '5–10 days',
    about:
      'The Noise / Pollution category covers all complaints about noise nuisance and environmental pollution in your area. This includes loud music from banquet halls, DJ systems, or parties beyond permitted hours, construction noise during restricted timings, factory smoke and industrial emissions affecting residential areas, illegal use of loudspeakers, vehicle honking in silence zones near hospitals and schools, burning of waste creating toxic smoke, and dust pollution from ongoing construction or crusher plants.',
    topics: [
      'Loud music',
      'Construction noise',
      'Factory noise',
      'Loudspeaker complaints',
      'Vehicle honking',
      'Air pollution',
      'Waste burning',
      'Dust pollution',
    ],
    commonComplaints: [
      'DJ playing at wedding till 3 AM, entire colony cannot sleep',
      'Construction work happening at night, violating rules',
      'Factory chimney releasing black smoke, breathing problems',
      'Loudspeaker blaring since early morning, beyond legal limit',
      'Constant honking near hospital, patients are disturbed',
      'Garbage burning in open plot, toxic smoke entering houses',
      'Generator noise from commercial building runs all night',
      'Crusher plant dust covering our entire residential area',
    ],
    relatedCategories: ['illegal_construction', 'public_health', 'stray_animals'],
  },

  /* ── Public Health / Sanitation ───────────────────────────────────────── */
  public_health: {
    id: 'public_health',
    name: 'Public Health / Sanitation',
    emoji: '🏥',
    color: '#009688',
    description:
      'Report health hazards including open defecation, dirty public toilets, disease outbreaks, and food safety violations.',
    department: 'Public Health & Sanitation Department',
    deptEmail: 'health@nagarseva.gov.in',
    deptPhone: '1800-XXX-1011',
    urgentTime: '12–24 hours',
    normalTime: '3–5 days',
    about:
      'The Public Health / Sanitation category addresses all civic issues related to public health hazards and sanitation. This includes open defecation in public areas, filthy or unusable public toilets, mosquito and pest breeding that leads to disease outbreaks like dengue and malaria, contaminated food being sold at unhygienic roadside stalls, lack of fogging or pest control activities, dirty water tanks causing waterborne diseases, and the need for public health awareness camps or free health check-up drives in underserved wards.',
    topics: [
      'Open defecation',
      'Dirty public toilets',
      'Disease outbreak',
      'Food safety',
      'Mosquito fogging',
      'Pest control',
      'Health camps',
      'Water tank cleaning',
    ],
    commonComplaints: [
      'Open defecation happening near the school boundary wall',
      'Public toilet is extremely dirty, doors broken, no water',
      'Dengue cases increasing, no fogging done in our ward',
      'Roadside food stall selling food in very unhygienic conditions',
      'Rats everywhere in the market area, need pest control',
      'Stagnant water near hospital breeding mosquitoes',
      'Community water tank not cleaned in months, kids falling sick',
      'Expired food items being sold at local grocery shops',
    ],
    relatedCategories: ['water', 'drainage', 'garbage'],
  },

  /* ── Other / General ──────────────────────────────────────────────────── */
  other: {
    id: 'other',
    name: 'Other / General',
    emoji: '📋',
    color: '#607D8B',
    description:
      'File queries about birth/death certificates, general civic issues, suggestions, and complaints that don\'t fit other categories.',
    department: 'General Administration Department',
    deptEmail: 'admin@nagarseva.gov.in',
    deptPhone: '1800-XXX-1000',
    urgentTime: '5–7 days',
    normalTime: '15–30 days',
    about:
      'The Other / General category is a catch-all for civic complaints and queries that don\'t fit neatly into the specific categories above. This includes questions about birth and death certificate processes, marriage registration, ration card issues, general municipal office service quality, ward councillor accessibility, e-governance portal problems, pension payment delays, community hall bookings, and general infrastructure suggestions for your ward. Use this category when your issue spans multiple departments or is administrative in nature.',
    topics: [
      'Birth/death certificates',
      'General queries',
      'Suggestions',
      'Ration card issues',
      'Marriage registration',
      'Ward councillor',
      'E-governance portal',
      'Pension issues',
    ],
    commonComplaints: [
      'Birth certificate not issued after 3 months of application',
      'Municipal office staff is rude and unhelpful',
      'Ration card name correction pending since 6 months',
      'E-governance portal always shows errors, cannot file anything',
      'Ward councillor not available for public meetings',
      'Death certificate delayed, causing legal problems for family',
      'Suggestion: install CCTV cameras at major junctions',
      'Community hall booking process is overly complicated',
    ],
    relatedCategories: ['property_tax', 'public_health', 'water'],
  },
};

/* ════════════════════════════════════════════════════════════════════════════
   Animation Variants
   ════════════════════════════════════════════════════════════════════════════ */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
};

/* ════════════════════════════════════════════════════════════════════════════
   How-to-file steps (static)
   ════════════════════════════════════════════════════════════════════════════ */

const HOW_TO_STEPS = [
  {
    emoji: '📝',
    title: 'Go to New Complaint',
    desc: 'Click "File Complaint" or navigate to the New Complaint page from the sidebar.',
  },
  {
    emoji: '🎤',
    title: 'Speak or Type',
    desc: 'Describe your issue naturally in English or Hindi — use voice or keyboard.',
  },
  {
    emoji: '🚀',
    title: 'Submit & Track',
    desc: 'Review the AI classification, confirm details, and track your complaint status.',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   CategoryDetail Component
   ════════════════════════════════════════════════════════════════════════════ */

export default function CategoryDetail() {
  const { categoryId: id } = useParams();
  const { state } = useApp();
  const data = CATEGORY_DATA[id];

  const categoryComplaints = state.complaints.filter(c => c.category === id);

  /* ── Category Not Found ─────────────────────────────────────────────── */
  if (!data) {
    return (
      <motion.div
        className={styles.page}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.notFound}>
          <span className={styles.notFoundEmoji}>🔍</span>
          <h1 className={styles.notFoundTitle}>Category Not Found</h1>
          <p className={styles.notFoundDesc}>
            The category &ldquo;{id}&rdquo; does not exist. Please check the URL or
            browse all available categories.
          </p>
          <Link to="/about" className={styles.notFoundLink}>
            <ArrowLeft size={16} />
            Back to About
          </Link>
        </div>
      </motion.div>
    );
  }

  /* ── Resolve related categories ─────────────────────────────────────── */
  const relatedCats = data.relatedCategories
    .map((rid) => CATEGORY_DATA[rid])
    .filter(Boolean);

  return (
    <motion.div
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <motion.div
        className={styles.hero}
        variants={itemVariants}
        style={{
          '--cat-color': data.color,
          background: `linear-gradient(145deg, ${data.color}10 0%, rgba(18,18,26,0.95) 50%, ${data.color}08 100%)`,
          borderColor: `${data.color}18`,
        }}
      >
        <div className={styles.heroGlow} />
        <span className={styles.heroEmoji}>{data.emoji}</span>
        <h1 className={styles.heroTitle} style={{ color: data.color }}>
          {data.name}
        </h1>
        <p className={styles.heroDesc}>{data.description}</p>
        <Link
          to="/new"
          className={styles.heroBtn}
          style={{
            background: `linear-gradient(135deg, ${data.color}, ${data.color}cc)`,
          }}
        >
          <FileText size={18} />
          File a Complaint
        </Link>
      </motion.div>

      {/* ── About This Category ─────────────────────────────────────────── */}
      <motion.section className={styles.section} variants={itemVariants}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Info size={20} />
          </div>
          <h2 className={styles.sectionTitle}>About This Category</h2>
        </div>
        <div className={styles.aboutCard}>
          <p className={styles.aboutText}>{data.about}</p>
          <p className={styles.aboutText} style={{ marginBottom: 0, color: '#8888a0' }}>
            <strong style={{ color: '#c0c0d0' }}>Topics covered:</strong>
          </p>
          <div className={styles.topicsList}>
            {data.topics.map((topic) => (
              <span
                key={topic}
                className={styles.topicTag}
                style={{ borderColor: `${data.color}25` }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Common Complaints ───────────────────────────────────────────── */}
      <motion.section className={styles.section} variants={itemVariants}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <MessageSquare size={20} />
          </div>
          <h2 className={styles.sectionTitle}>Common Complaints</h2>
        </div>
        <motion.div
          className={styles.complaintsGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {data.commonComplaints.map((complaint, idx) => (
            <motion.div
              key={idx}
              className={styles.complaintCard}
              variants={cardVariants}
              whileHover={{ y: -3 }}
            >
              <div
                className={styles.complaintBubble}
                style={{ background: `${data.color}15`, color: data.color }}
              >
                💬
              </div>
              <p className={styles.complaintText}>{complaint}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Expected Response Time ──────────────────────────────────────── */}
      <motion.section className={styles.section} variants={itemVariants}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Clock size={20} />
          </div>
          <h2 className={styles.sectionTitle}>Expected Response Time</h2>
        </div>

        <div className={styles.responseGrid}>
          <motion.div className={styles.responseUrgent} variants={cardVariants}>
            <span className={styles.responseLabel}>
              <span className={styles.responseDotUrgent} />
              Urgent Complaints
            </span>
            <span className={styles.responseTime}>{data.urgentTime}</span>
          </motion.div>
          <motion.div className={styles.responseNormal} variants={cardVariants}>
            <span className={styles.responseLabel}>
              <span className={styles.responseDotNormal} />
              Normal Complaints
            </span>
            <span className={styles.responseTime}>{data.normalTime}</span>
          </motion.div>
        </div>

        <motion.div className={styles.deptCard} variants={cardVariants}>
          <span className={styles.deptName}>
            <Building2 size={18} className={styles.deptNameIcon} />
            {data.department}
          </span>
          <div className={styles.deptContactRow}>
            <span className={styles.deptContact}>
              <Mail size={14} />
              {data.deptEmail}
            </span>
            <span className={styles.deptContact}>
              <Phone size={14} />
              {data.deptPhone}
            </span>
          </div>
        </motion.div>
      </motion.section>

      {/* ── Actual Filed Complaints ──────────────────────────────────────── */}
      {categoryComplaints.length > 0 && (
        <motion.section className={styles.section} variants={itemVariants}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <List size={20} />
            </div>
            <h2 className={styles.sectionTitle}>Recent Complaints in this Category</h2>
          </div>
          
          <div className={styles.realComplaintsList}>
            {categoryComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        </motion.section>
      )}

      {/* ── How to File ─────────────────────────────────────────────────── */}
      <motion.section className={styles.section} variants={itemVariants}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Send size={20} />
          </div>
          <h2 className={styles.sectionTitle}>How to File a Complaint</h2>
        </div>

        <motion.div
          className={styles.stepsRow}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {HOW_TO_STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              className={styles.stepCard}
              variants={cardVariants}
              whileHover={{ y: -4 }}
            >
              <span className={styles.stepNum}>{idx + 1}</span>
              <span className={styles.stepEmoji}>{step.emoji}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.fileBtnWrap}>
          <Link to="/new" className={styles.fileBtn}>
            File Complaint Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.section>

      {/* ── Related Categories ──────────────────────────────────────────── */}
      {relatedCats.length > 0 && (
        <motion.section className={styles.section} variants={itemVariants}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <AlertTriangle size={20} />
            </div>
            <h2 className={styles.sectionTitle}>Related Categories</h2>
          </div>
          <div className={styles.relatedScroll}>
            {relatedCats.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={styles.relatedCard}
                style={{ borderColor: `${cat.color}15` }}
              >
                <span className={styles.relatedEmoji}>{cat.emoji}</span>
                <span className={styles.relatedName}>{cat.name}</span>
                <span className={styles.relatedDesc}>{cat.description}</span>
                <span className={styles.relatedArrow}>
                  View details <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
