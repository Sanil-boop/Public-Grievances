import React from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import styles from './IncidentMap.module.css';

// Fix Leaflet's default icon path issues with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A custom red icon for Urgent complaints
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function IncidentMap() {
  const { state } = useApp();
  const { complaints } = state;

  // New Delhi center roughly
  const defaultCenter = [28.6139, 77.2090]; 

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Live Incident Map</h1>
        <p className={styles.subtitle}>Viewing all active civic issues across the region.</p>
      </div>

      <div className={styles.mapContainer}>
        <MapContainer 
          center={defaultCenter} 
          zoom={12} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', borderRadius: '16px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {complaints.map((c, i) => {
            // Generating a random offset for demo purposes around New Delhi
            // In a real app, this would use exact lat/lng from the complaint location
            const latOffset = (Math.random() - 0.5) * 0.1;
            const lngOffset = (Math.random() - 0.5) * 0.1;
            const position = [defaultCenter[0] + latOffset, defaultCenter[1] + lngOffset];
            
            const isUrgent = c.priority?.toLowerCase() === 'urgent';

            return (
              <Marker 
                key={c.id || i} 
                position={position}
                icon={isUrgent ? redIcon : new L.Icon.Default()}
              >
                <Popup className={styles.customPopup}>
                  <div className={styles.popupContent}>
                    <strong>{c.categoryName || c.category}</strong>
                    <br />
                    <span>Priority: {c.priority}</span>
                    <br />
                    <span className={styles.popupText}>{c.text.substring(0, 50)}...</span>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </motion.div>
  );
}
