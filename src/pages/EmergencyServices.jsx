import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Phone, Shield, Flame, Heart, UserCheck, Baby,
  AlertTriangle, Users, Car, Brain, Eye, Monitor, Train, Zap,
  ChevronDown, ChevronUp, MapPin, Navigation, Droplets
} from 'lucide-react';
import EmergencyBroadcast from '../components/EmergencyBroadcast/EmergencyBroadcast';
import SosButton from '../components/SosButton/SosButton';
import styles from './EmergencyServices.module.css';

/* ════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════ */

const HELPLINES = [
  { id: '112', name: 'National Emergency', number: '112', icon: Phone },
  { id: '100', name: 'Police', number: '100', icon: Shield },
  { id: '101', name: 'Fire Brigade', number: '101', icon: Flame },
  { id: '102', name: 'Ambulance', number: '102', icon: Heart },
  { id: '108', name: 'Medical Emergency', number: '108', icon: Heart },
  { id: '1091', name: 'Women Helpline', number: '1091 / 181', icon: UserCheck },
  { id: '1098', name: 'Child Helpline', number: '1098', icon: Baby },
  { id: '1078', name: 'Disaster Management', number: '1078', icon: AlertTriangle },
  { id: '14567', name: 'Senior Citizen', number: '14567', icon: Users },
  { id: '1073', name: 'Road Accident', number: '1073', icon: Car },
  { id: 'mental', name: 'Mental Health (Kiran)', number: '1800-599-0019', icon: Brain },
  { id: '1064', name: 'Anti-Corruption', number: '1064', icon: Eye },
  { id: '1930', name: 'Cyber Crime', number: '1930', icon: Monitor },
  { id: '139', name: 'Railway Emergency', number: '139', icon: Train },
  { id: '1906', name: 'LPG Leak', number: '1906', icon: Zap },
];

const FIRST_AID_GUIDE = [
  {
    id: 'cpr',
    title: 'CPR (Cardiopulmonary Resuscitation)',
    icon: Heart,
    content: (
      <ul>
        <li>Check the scene for safety, then check the person (tap shoulder and shout).</li>
        <li>Call 112 immediately or ask someone else to call.</li>
        <li>Place the heel of one hand on the center of the chest, other hand on top, lace fingers.</li>
        <li>Push hard and fast (at least 2 inches deep, 100-120 compressions per minute).</li>
        <li>Do not stop until medical help arrives or the person starts breathing.</li>
      </ul>
    )
  },
  {
    id: 'choking',
    title: 'Choking (Heimlich Maneuver)',
    icon: AlertTriangle,
    content: (
      <ul>
        <li>Stand behind the person and wrap your arms around their waist.</li>
        <li>Make a fist with one hand and place the thumb side just above their navel.</li>
        <li>Grasp your fist with your other hand.</li>
        <li>Give quick, upward thrusts into the abdomen as if trying to lift the person up.</li>
        <li>Continue until the object is dislodged.</li>
      </ul>
    )
  },
  {
    id: 'burns',
    title: 'Severe Burns',
    icon: Flame,
    content: (
      <ul>
        <li>Remove the person from the heat source immediately.</li>
        <li>Cool the burn with cool (not ice cold) running water for 10-20 minutes.</li>
        <li>Remove rings, tight items, and clothing from the burned area before it swells.</li>
        <li>Cover the burn loosely with a sterile, non-stick bandage or clean cloth.</li>
        <li>Do not apply butter, ointments, or pop blisters. Seek medical help.</li>
      </ul>
    )
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    icon: Droplets, // Using AlertTriangle as fallback if Droplets not imported, wait we have Droplets? Let's use AlertTriangle just in case, wait I imported it. Wait, I didn't import Droplets in this file. Let me use AlertTriangle.
    content: (
      <ul>
        <li>Ensure your own safety first (use gloves if available).</li>
        <li>Apply direct, firm pressure to the wound with a clean cloth or sterile dressing.</li>
        <li>Maintain pressure constantly for at least 5-10 minutes without peeking.</li>
        <li>Elevate the injured area above the heart if possible.</li>
        <li>If blood soaks through, do not remove the cloth; add more layers on top.</li>
      </ul>
    )
  },
];

const SAFETY_TIPS = [
  {
    title: 'Fire Safety',
    icon: Flame,
    desc: 'Install smoke alarms, plan an escape route, and stay low to the ground if navigating through smoke. Never use elevators during a fire.'
  },
  {
    title: 'Earthquake Preparedness',
    icon: AlertTriangle,
    desc: 'Drop to your hands and knees, Cover your head and neck under a sturdy table, and Hold On until the shaking stops.'
  },
  {
    title: 'Personal Safety',
    icon: Shield,
    desc: 'Stay aware of your surroundings, share your live location with family during late travel, and keep emergency numbers on speed dial.'
  },
  {
    title: 'Flood Warnings',
    icon: AlertTriangle,
    desc: 'Move to higher ground immediately. Do not walk, swim, or drive through floodwaters (Turn Around, Don’t Drown).'
  }
];

const NEARBY_SERVICES = [
  {
    type: 'Police Station',
    name: 'Central City Police Station',
    distance: '1.2 km',
    address: 'Mahatma Gandhi Marg, Sector 4',
    icon: Shield,
    color: '#3498db',
    phone: '100'
  },
  {
    type: 'Hospital',
    name: 'City General Hospital',
    distance: '2.5 km',
    address: 'Health City Blvd, Sector 9',
    icon: Heart,
    color: '#e74c3c',
    phone: '108'
  },
  {
    type: 'Fire Station',
    name: 'North District Fire Dept',
    distance: '3.1 km',
    address: 'Industrial Area Phase 1',
    icon: Flame,
    color: '#f39c12',
    phone: '101'
  }
];

/* ════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════ */

export default function EmergencyServices() {
  const [openAccordion, setOpenAccordion] = useState('cpr');

  return (
    <div className={styles.pageContainer}>
      {/* ═══ Header ═══ */}
      <div className={styles.pageHeader}>
        <Link to="/" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Portal
        </Link>
        <h1 className={styles.pageTitle}>
          <span className={styles.pageDot} style={{ background: '#e74c3c' }} />
          Emergency Services
        </h1>
        <p className={styles.pageSubtitle}>
          Immediate access to national helplines, first aid guides, and active emergency broadcasts. 
          In a critical situation, prioritize your safety first.
        </p>
      </div>

      <div className={styles.contentWrap}>
        {/* ═══ Emergency Broadcasts ═══ */}
        <div style={{ marginBottom: '40px' }}>
          <EmergencyBroadcast />
        </div>

        {/* ═══ SOS Hero Section ═══ */}
        <section className={styles.sosHero}>
          <a href="tel:112" className={styles.sosButton}>
            SOS
            <span>DIAL 112</span>
          </a>
          <h2 className={styles.sosText}>National Emergency Number</h2>
          <p className={styles.sosSubtext}>One tap to connect with Police, Fire, and Ambulance services anywhere in India.</p>
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            {/* Reusing existing SosButton component for advanced GPS dispatch if needed */}
            <SosButton />
          </div>
        </section>

        {/* ═══ Helplines Directory ═══ */}
        <h2 className={styles.sectionTitle}>
          <Phone size={24} className={styles.sectionTitleIcon} />
          Helpline Directory
        </h2>
        <div className={styles.directoryGrid}>
          {HELPLINES.map((helpline, i) => {
            const Icon = helpline.icon;
            // Clean number for tel link (remove spaces, slashes, etc.)
            const telNumber = helpline.number.split('/')[0].replace(/[^0-9]/g, '');
            return (
              <motion.a 
                key={helpline.id} 
                href={`tel:${telNumber}`}
                className={styles.helplineCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={styles.helplineIconWrap}>
                  <Icon size={24} />
                </div>
                <div className={styles.helplineInfo}>
                  <h3 className={styles.helplineName}>{helpline.name}</h3>
                  <p className={styles.helplineNumber}>{helpline.number}</p>
                </div>
                <Phone size={20} className={styles.callIcon} />
              </motion.a>
            );
          })}
        </div>

        <div className={styles.twoColGrid}>
          {/* ═══ First Aid Guide ═══ */}
          <div>
            <h2 className={styles.sectionTitle}>
              <Heart size={24} className={styles.sectionTitleIcon} />
              First Aid Guide
            </h2>
            <div className={styles.accordionContainer}>
              {FIRST_AID_GUIDE.map((item) => {
                const Icon = item.icon;
                const isOpen = openAccordion === item.id;
                return (
                  <div key={item.id} className={styles.accordionItem}>
                    <button 
                      className={styles.accordionHeader}
                      onClick={() => setOpenAccordion(isOpen ? '' : item.id)}
                    >
                      <div className={styles.accordionTitle}>
                        <Icon size={20} className={styles.accordionIcon} />
                        {item.title}
                      </div>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className={styles.accordionContent}>
                            {item.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══ Safety Tips ═══ */}
          <div>
            <h2 className={styles.sectionTitle}>
              <Shield size={24} className={styles.sectionTitleIcon} style={{ color: '#ff9800' }} />
              Safety Tips
            </h2>
            <div className={styles.safetyGrid}>
              {SAFETY_TIPS.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <div key={i} className={styles.safetyCard}>
                    <div className={styles.safetyIcon}>
                      <Icon size={20} />
                    </div>
                    <h3>{tip.title}</h3>
                    <p>{tip.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ Nearby Services (Simulated) ═══ */}
        <h2 className={styles.sectionTitle}>
          <MapPin size={24} className={styles.sectionTitleIcon} style={{ color: '#3498db' }} />
          Nearby Emergency Services
        </h2>
        <div className={styles.nearbyGrid}>
          {NEARBY_SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div key={i} className={styles.nearbyCard}>
                <div className={styles.nearbyHeader}>
                  <div className={styles.nearbyIcon} style={{ background: `${svc.color}15`, color: svc.color }}>
                    <Icon size={20} />
                  </div>
                  <div className={styles.nearbyDistance}>
                    <Navigation size={12} /> {svc.distance}
                  </div>
                </div>
                <h3 className={styles.nearbyName}>{svc.name}</h3>
                <p className={styles.nearbyAddress}>
                  <MapPin size={14} style={{ flexShrink: 0, marginTop: 3 }} />
                  {svc.address}
                </p>
                <div className={styles.nearbyActions}>
                  <a href={`tel:${svc.phone}`} className={`${styles.nearbyActionBtn} ${styles.btnPrimary}`}>
                    <Phone size={16} /> Call {svc.phone}
                  </a>
                  <a href="#" className={`${styles.nearbyActionBtn} ${styles.btnSecondary}`}>
                    <Navigation size={16} /> Directions
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
