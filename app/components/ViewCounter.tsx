'use client'

import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import styles from './ViewCounter.module.css'

export default function ViewCounter() {
  const [viewCount, setViewCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const registerView = async () => {
      try {
        // Kullanıcı ID'si oluştur (localStorage'da sakla)
        let userId = localStorage.getItem('viewUserId')
        if (!userId) {
          userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem('viewUserId', userId)
        }

        // View sayısını al
        const countResponse = await fetch('/api/views')
        const countData = await countResponse.json()
        setViewCount(countData.count || 0)

        // Eğer bu kullanıcı daha önce görüntüleme yapmadıysa, view sayısını artır
        const viewResponse = await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        })

        const viewData = await viewResponse.json()
        setViewCount(viewData.count || 0)
      } catch (error) {
        console.error('View counter error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    registerView()
  }, [])

  return (
    <div className={styles.viewCounter}>
      <Eye size={16} className={styles.icon} />
      <span className={styles.count}>
        {isLoading ? '...' : viewCount.toLocaleString()}
      </span>
      <span className={styles.label}>Views</span>
    </div>
  )
}

