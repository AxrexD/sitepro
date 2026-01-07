'use client'

import styles from './BannerBox.module.css'

export default function BannerBox() {
  return (
    <div className={styles.bannerBox}>
      <div className={styles.videoContainer}>
        <video
          className={styles.bannerVideo}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.videoOverlay} />
      </div>
    </div>
  )
}

