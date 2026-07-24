import { useEffect, useState } from 'react';
import styles from './ConfidenceMeter.module.css';

function getColor(confidence) {
  if (confidence >= 0.75) return '#00b894';
  if (confidence >= 0.5) return '#fdcb6e';
  return '#e17055';
}

export default function ConfidenceMeter({
  confidence = 0,
  size = 140,
  label,
}) {
  const [offset, setOffset] = useState(0);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getColor(confidence);
  const percentage = Math.round(confidence * 100);
  const fontSize = size * 0.2;

  useEffect(() => {
    // Small delay so animation is visible
    const timer = setTimeout(() => {
      setOffset(circumference - confidence * circumference);
    }, 100);
    return () => clearTimeout(timer);
  }, [confidence, circumference]);

  return (
    <div className={styles.container}>
      <div className={styles.meterWrapper}>
        <svg
          className={styles.svgMeter}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            className={styles.bgCircle}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className={styles.fgCircle}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={styles.centerLabel}>
          <span className={styles.percentage} style={{ fontSize }}>
            {percentage}%
          </span>
          <span className={styles.subLabel}>Confidence</span>
        </div>
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
