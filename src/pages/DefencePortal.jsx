import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Camera } from 'lucide-react';
import html2canvas from 'html2canvas';
import styles from './DefencePortal.module.css';

export default function DefencePortal() {
  const [videoHovered, setVideoHovered] = useState(false);
  const pageRef = useRef(null);

  const takeScreenshot = async () => {
    if (pageRef.current) {
      try {
        const canvas = await html2canvas(pageRef.current, {
          useCORS: true,
          scale: 2
        });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'defence-portal-screenshot.png';
        link.click();
      } catch (error) {
        console.error('Screenshot failed:', error);
      }
    }
  };

  // Assets downloaded to public/images folder
  const assets = {
    modLogo: "/images/mod-logo.svg",
    heroImage: "/images/hero-image.jpg", 
    featuredNews: "/images/featured-news.jpg", 
    news1: "/images/news1.jpg",
    news2: "/images/news2.jpg",
    news3: "/images/news3.jpg",
    spotlight: "/images/spotlight.jpg", 
    visualStory: "/images/visual-story.jpg",
    videoThumbnail: "/images/video-thumb.jpg",
    video: "/images/defence-video.mp4", 
    sealArmy: "/images/army-logo.svg",
    sealNavy: "/images/navy-logo.svg",
    sealAirforce: "/images/airforce-logo.svg",
    armyChief: "/images/army-chief.jpg",
    navyChief: "/images/navy-chief.jpg",
    airforceChief: "/images/airforce-chief.jpg",
    memorial: "/images/war-memorial.jpg"
  };

  return (
    <div className={styles.pageContainer} ref={pageRef}>
      
      {/* ═══ Top Navigation Bar ═══ */}
      <nav className={styles.topNav}>
        <Link to="/" className={styles.logoArea}>
          <img src={assets.modLogo} alt="MoD Logo" className={styles.modLogo} />
          <span className={styles.brandText}>Ministry of Defence</span>
        </Link>
        <div className={styles.navLinks}>
          <Link to="#">News</Link>
          <Link to="#">Multimedia</Link>
          <Link to="#">Spotlights</Link>
          <Link to="#">About</Link>
          <Link to="#">Resources</Link>
          <Link to="#">UFO</Link>
          <button onClick={takeScreenshot} className={styles.screenshotBtn} title="Take Screenshot">
            <Camera size={20} />
          </button>
          <Search size={20} className={styles.searchIcon} />
        </div>
        
        {/* Mobile controls */}
        <div className={styles.mobileControls}>
          <button onClick={takeScreenshot} className={styles.screenshotBtnMobile} title="Take Screenshot">
            <Camera size={20} />
          </button>
        </div>
      </nav>

      {/* ═══ Hero Section ═══ */}
      <section className={styles.heroSection}>
        <img src={assets.heroImage} alt="Hero" className={styles.heroImage} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroMeta}>News | 18 Hours Ago</div>
          <h1 className={styles.heroTitle}>INDIAN AIR FORCE COMPLETES LATEST EXERCISE GAGAN SHAKTI</h1>
          <button className={styles.heroBtn}>Story</button>
        </div>
      </section>

      {/* ═══ Armed Forces Leadership ═══ */}
      <section className={styles.leadershipSection}>
        <div className={styles.leadershipHeader}>
          <h2>Armed Forces Leadership</h2>
          <p>The Chiefs of Staff commanding the Indian Armed Forces</p>
        </div>
        <div className={styles.leadershipGrid}>
          <div className={styles.leaderCard}>
            <div className={styles.leaderImageWrap}>
              <img src={assets.armyChief} alt="Chief of Army Staff" />
            </div>
            <div className={styles.leaderInfo}>
              <div className={styles.leaderRole}>Chief of Army Staff</div>
              <h3 className={styles.leaderName}>Gen Upendra Dwivedi</h3>
              <p className={styles.leaderDesc}>Leading the Indian Army with a vision for modern land warfare.</p>
            </div>
          </div>
          <div className={styles.leaderCard}>
            <div className={styles.leaderImageWrap}>
              <img src={assets.navyChief} alt="Chief of Naval Staff" />
            </div>
            <div className={styles.leaderInfo}>
              <div className={styles.leaderRole}>Chief of Naval Staff</div>
              <h3 className={styles.leaderName}>Adm Dinesh K Tripathi</h3>
              <p className={styles.leaderDesc}>Commanding the Indian Navy to secure maritime borders and interests.</p>
            </div>
          </div>
          <div className={styles.leaderCard}>
            <div className={styles.leaderImageWrap}>
              <img src={assets.airforceChief} alt="Chief of Air Staff" />
            </div>
            <div className={styles.leaderInfo}>
              <div className={styles.leaderRole}>Chief of Air Staff</div>
              <h3 className={styles.leaderName}>ACM Amar Preet Singh</h3>
              <p className={styles.leaderDesc}>Directing the Indian Air Force towards superior aerospace power.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ News Layout ═══ */}
      <section className={styles.contentWrap}>
        <div className={styles.twoColumnGrid}>
          {/* Featured News */}
          <div className={styles.featuredNews}>
            <img src={assets.featuredNews} alt="Featured" />
            <div className={styles.featuredOverlay}>
              <span className={styles.featuredTag}>News</span>
              <h2 className={styles.featuredTitle}>Nation's Leaders Honor the Fallen During Dignified Transfer at National War Memorial</h2>
            </div>
          </div>
          
          {/* News List */}
          <div className={styles.newsList}>
            <div className={styles.newsListItem}>
              <img src={assets.news1} alt="News 1" className={styles.newsListImg} />
              <div className={styles.newsListContent}>
                <span className={styles.newsListTag}>Feature</span>
                <h3 className={styles.newsListTitle}>Maintainers Work Quietly Behind Scenes Ensuring Global Power</h3>
              </div>
            </div>
            <div className={styles.newsListItem}>
              <img src={assets.news2} alt="News 2" className={styles.newsListImg} />
              <div className={styles.newsListContent}>
                <span className={styles.newsListTag}>News</span>
                <h3 className={styles.newsListTitle}>Navy Nurse Receives Award for Pediatric Trauma Care Research, Improvements</h3>
              </div>
            </div>
            <div className={styles.newsListItem}>
              <img src={assets.news3} alt="News 3" className={styles.newsListImg} />
              <div className={styles.newsListContent}>
                <span className={styles.newsListTag}>News</span>
                <h3 className={styles.newsListTitle}>Defense Ministry Testifies in Support of Supplemental Budget Request</h3>
              </div>
            </div>
            <div className={styles.newsListItem}>
              <img src={assets.spotlight} alt="News 4" className={styles.newsListImg} />
              <div className={styles.newsListContent}>
                <span className={styles.newsListTag}>News</span>
                <h3 className={styles.newsListTitle}>DRDO to Host Rapid Tech Innovation Event in Bengaluru</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Spotlight Section ═══ */}
      <section className={styles.spotlightWrapper}>
        <div className={styles.spotlightContainer}>
          <div className={styles.spotlightImageWrap}>
            <img src={assets.spotlight} alt="Spotlight" />
          </div>
          <div className={styles.spotlightCard}>
            <div className={styles.spotlightTag}>
              <span style={{color: '#e74c3c'}}>📍</span> Spotlight
            </div>
            <h2 className={styles.spotlightTitle}>FY 2027 Defense Budget</h2>
            <p className={styles.spotlightText}>
              The fiscal year 2027 budget builds the nation's arsenal without compromising readiness to ensure we remain the world's premier fighting force, we protect the homeland, and we create peace through strength now and into the future.
            </p>
            <button className={styles.spotlightBtn}>See More</button>
          </div>
        </div>
        <button className={styles.spotlightAllBtn}>All Spotlights</button>
      </section>

      {/* ═══ Press & Services ═══ */}
      <section className={styles.contentWrap}>
        <div className={styles.pressGrid}>
          
          {/* Press Products */}
          <div>
            <h2 className={styles.sectionHeader}>PRESS PRODUCTS</h2>
            <div className={styles.pressItem}>
              <div className={styles.pressMeta}>Release | 11 hours ago</div>
              <h3 className={styles.pressTitle}>MoD Awards a Nearly $7 Billion Oracle Agreement to Accelerate the Arsenal of Freedom</h3>
            </div>
            <div className={styles.pressItem}>
              <div className={styles.pressMeta}>Advisory | 17 hours ago</div>
              <h3 className={styles.pressTitle}>Media Invitation Announced for Joint Military Pretrial Hearing</h3>
            </div>
            <div className={styles.pressItem}>
              <div className={styles.pressMeta}>Release | 18 hours ago</div>
              <h3 className={styles.pressTitle}>Defence Department Releases Updated List of Foreign Institutions Engaging in Problematic Activities</h3>
            </div>
            <button className={styles.allPressBtn}>All Press Products</button>
          </div>

          {/* From the Services */}
          <div>
            <h2 className={styles.sectionHeader}>FROM THE SERVICES</h2>
            <div 
              className={styles.servicesVideo}
              onMouseEnter={() => setVideoHovered(true)}
              onMouseLeave={() => setVideoHovered(false)}
            >
              {videoHovered ? (
                <video src={assets.video} autoPlay loop muted />
              ) : (
                <img src={assets.videoThumbnail} alt="Video Thumbnail" />
              )}
              <div className={styles.videoOverlay}>
                <div className={styles.videoBadge}>
                  <img src={assets.sealArmy} alt="Army Badge" /> INDIAN ARMY
                </div>
                <div className={styles.playBtn}><Play size={20} fill="white" /></div>
                <h3 className={styles.videoTitle}>Soldier Exceeds Standards, Sets National Powerlifting Records</h3>
              </div>
            </div>
            <div className={styles.sealsContainer}>
              <img src={assets.sealArmy} alt="Army" className={styles.seal} />
              <img src={assets.sealNavy} alt="Navy" className={styles.seal} />
              <img src={assets.sealAirforce} alt="Air Force" className={styles.seal} />
            </div>
          </div>

        </div>
      </section>

      {/* ═══ Visual Story ═══ */}
      <section className={styles.visualStory}>
        <div className={styles.visualContainer}>
          <div className={styles.visualText}>
            <span className={styles.visualTag}>Visual Story</span>
            <h2 className={styles.visualTitle}>We Prepare. You Should, Too.</h2>
            <p className={styles.visualDesc}>
              Service members train and prepare year-round so when disasters strike, troops are ready to help those in harm's way. Learn how you can prepare, too.
            </p>
          </div>
          <div className={styles.visualImageWrap}>
            <img src={assets.visualStory} alt="Visual Story" />
          </div>
        </div>
        <div className={styles.carouselDots}>
          <div className={`${styles.dot} ${styles.active}`} />
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </div>
      </section>

      {/* ═══ National War Memorial ═══ */}
      <section className={styles.memorialSection}>
        <div className={styles.memorialContainer}>
          <div className={styles.memorialImage}>
            <img src={assets.memorial} alt="National War Memorial" />
          </div>
          <div className={styles.memorialContent}>
            <h2>National War Memorial</h2>
            <p>
              Dedicated to the Armed Forces of India, the National War Memorial stands as a symbol of gratitude 
              for the soldiers who made the supreme sacrifice defending our nation.
            </p>
            <ul>
              <li><strong>Inaugurated:</strong> 25 February 2019</li>
              <li><strong>Location:</strong> India Gate, New Delhi</li>
              <li><strong>Significance:</strong> Honors martyrs of post-independence wars.</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
