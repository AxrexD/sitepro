'use client'

import ProfileBox from './ProfileBox'
import ProjectBox from './ProjectBox'
import BannerBox from './BannerBox'
import styles from './ContentContainer.module.css'

export default function ContentContainer() {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <ProfileBox />
        <ProjectBox />
      </div>
      <BannerBox />
    </div>
  )
}

