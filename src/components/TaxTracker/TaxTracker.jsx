import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip as RechartsTooltip } from 'recharts';
import { IndianRupee, Info } from 'lucide-react';
import styles from './TaxTracker.module.css';

const BUDGET_DATA = [
  { name: 'Roads & Infrastructure', size: 400, color: '#6c5ce7' },
  { name: 'Sanitation & Waste', size: 250, color: '#00b894' },
  { name: 'Public Health', size: 150, color: '#ff7675' },
  { name: 'Parks & Greenery', size: 100, color: '#00cec9' },
  { name: 'Street Lighting', size: 60, color: '#fdcb6e' },
  { name: 'Admin & Others', size: 40, color: '#a0a0b0' },
];

const COLORS = ['#6c5ce7', '#00b894', '#ff7675', '#00cec9', '#fdcb6e', '#a0a0b0'];

const CustomizedContent = (props) => {
  const { x, y, width, height, index, name, value, color } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color || COLORS[index % COLORS.length],
          stroke: '#1e1e28',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      {width > 50 && height > 30 ? (
        <text x={x + 8} y={y + 18} fill="#fff" fontSize={12} fontWeight="bold">
          {name}
        </text>
      ) : null}
      {width > 50 && height > 50 ? (
        <text x={x + 8} y={y + 36} fill="rgba(255,255,255,0.7)" fontSize={11}>
          ₹{value} Cr
        </text>
      ) : null}
    </g>
  );
};

export default function TaxTracker() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <IndianRupee size={24} color="#00cec9" />
          <div>
            <h2>Where Do My Taxes Go?</h2>
            <p>Q2 2026 Municipal Budget Allocation (in Crores)</p>
          </div>
        </div>
        <div className={styles.totalBadge}>
          <span>Total Budget</span>
          <strong>₹1,000 Cr</strong>
        </div>
      </div>

      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height={350}>
          <Treemap
            data={BUDGET_DATA}
            dataKey="size"
            ratio={4 / 3}
            stroke="#fff"
            content={<CustomizedContent />}
          >
            <RechartsTooltip 
              contentStyle={{ background: 'rgba(30,30,40,0.9)', border: 'none', borderRadius: '8px', color: 'white' }}
              itemStyle={{ color: '#00cec9' }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>

      <div className={styles.footer}>
        <Info size={14} />
        <span>This data is linked with the civic resolution metrics in your district. High complaint areas (like Roads) received a 15% budget increase this quarter.</span>
      </div>
    </div>
  );
}
