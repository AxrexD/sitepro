'use client'

import { useState, useEffect } from 'react'
import styles from './SplashScreen.module.css'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Kısa bir gecikme sonrası prompt'u göster
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault()
        onComplete()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [onComplete])

  return (
    <div className={styles.splashScreen}>
      <div className={styles.content}>
        {showPrompt && (
          <div className={styles.prompt}>
            <div className={styles.promptText}>
              Lütfen <span className={styles.spaceKey}>SPACEBAR</span> tuşuna basınız
            </div>
            <div className={styles.promptHint}>
              Press <span className={styles.spaceKey}>SPACEBAR</span> to continue
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

