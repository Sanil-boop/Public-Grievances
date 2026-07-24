import { useMemo } from 'react';
import { Newspaper, ChevronRight, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import styles from './DailyNews.module.css';

const NEWS_DB = [
  { id: 1, type: 'info', title: 'New Metro Line 3 Construction Begins in Andheri', source: 'Civic Times', time: '2 hours ago', icon: Info },
  { id: 2, type: 'alert', title: 'Heavy Rainfall Warning: Avoid low-lying areas in Hindmata', source: 'BMC Alerts', time: '4 hours ago', icon: AlertTriangle },
  { id: 3, type: 'trend', title: 'Pothole complaints drop by 15% after new road laying', source: 'NagarSeva Analytics', time: '6 hours ago', icon: TrendingUp },
  { id: 4, type: 'info', title: 'Property Tax Payment Deadline Extended to Aug 31', source: 'Municipal Corp', time: '12 hours ago', icon: Info },
  { id: 5, type: 'trend', title: 'Waste Segregation drive sees 40% more participation', source: 'Green City Initiative', time: '1 day ago', icon: TrendingUp },
  { id: 6, type: 'alert', title: 'Water Supply Cut in K-West Ward on Friday', source: 'Water Dept', time: '1 day ago', icon: AlertTriangle },
  { id: 7, type: 'info', title: 'Public Parks to undergo renovation starting next week', source: 'Parks & Rec', time: '2 days ago', icon: Info },
  { id: 8, type: 'trend', title: 'Solar panel installations double in residential societies', source: 'Energy Board', time: '2 days ago', icon: TrendingUp },
  { id: 9, type: 'alert', title: 'Traffic Diversion at S.V. Road due to flyover repair', source: 'Traffic Police', time: '3 days ago', icon: AlertTriangle },
  { id: 10, type: 'info', title: 'New Electric Buses added to city transit fleet', source: 'Transport Dept', time: '3 days ago', icon: Info },
];

export default function DailyNews() {
  // Use the current day of the year to seed the daily selection
  const dailyNews = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Pick 3 news items based on the day of the year
    const startIdx = dayOfYear % (NEWS_DB.length - 2);
    return NEWS_DB.slice(startIdx, startIdx + 3);
  }, []);

  return (
    <div className={styles.container}>
      {dailyNews.map((news) => {
        const Icon = news.icon;
        return (
          <div key={news.id} className={styles.newsItem}>
            <div className={`${styles.iconWrapper} ${styles[news.type]}`}>
              <Icon size={16} />
            </div>
            <div className={styles.content}>
              <h4 className={styles.title}>{news.title}</h4>
              <div className={styles.meta}>
                <span className={styles.source}>{news.source}</span>
                <span className={styles.dot}>•</span>
                <span className={styles.time}>{news.time}</span>
              </div>
            </div>
            <button className={styles.readMore}>
              <ChevronRight size={16} />
            </button>
          </div>
        );
      })}
      <button className={styles.viewAllBtn}>
        <Newspaper size={14} /> View All Updates
      </button>
    </div>
  );
}
