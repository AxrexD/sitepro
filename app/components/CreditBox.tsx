'use client'

import { useState, useEffect } from 'react'
import { Heart, Instagram } from 'lucide-react'
import styles from './CreditBox.module.css'

export default function CreditBox() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [fps, setFps] = useState(0)
  const [gpu, setGpu] = useState('Unknown')

  useEffect(() => {
    // Get GPU info
    const getGPUInfo = () => {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
      
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          
          // Extract GPU model name (RTX, RX, etc.)
          if (renderer) {
            // Remove common prefixes and suffixes
            let gpuName = renderer
              .replace(/^.*(NVIDIA|AMD|Intel)\s*/i, '') // Remove brand prefix
              .replace(/\s*\/.*$/, '') // Remove everything after /
              .replace(/\s*\(.*\)$/, '') // Remove parentheses content
              .trim()
            
            // If it's too long, try to extract just the model (RTX, RX, etc.)
            if (gpuName.length > 30) {
              // Try to find RTX, RX, GTX, etc.
              const modelMatch = gpuName.match(/(RTX|RX|GTX|Radeon|GeForce|Arc)\s*\d+/i)
              if (modelMatch) {
                gpuName = modelMatch[0]
              } else {
                // Take first meaningful part
                gpuName = gpuName.split(/\s+/).slice(0, 3).join(' ')
              }
            }
            
            setGpu(gpuName || 'Unknown')
          } else {
            setGpu('Unknown')
          }
        } else {
          setGpu('WebGL Available')
        }
      } else {
        setGpu('WebGL Not Available')
      }
    }

    getGPUInfo()

    // Calculate FPS
    let lastTime = performance.now()
    let frameCount = 0
    let fpsInterval = 0

    const calculateFPS = () => {
      frameCount++
      const currentTime = performance.now()
      fpsInterval = currentTime - lastTime

      if (fpsInterval >= 1000) {
        setFps(Math.round((frameCount * 1000) / fpsInterval))
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(calculateFPS)
    }

    calculateFPS()
  }, [])

  const handleAxrexClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleInstagramClick = () => {
    window.open('https://instagram.com/yigit.skyline', '_blank')
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsBox}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>FPS:</span>
          <span className={styles.statValue}>{fps}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>GPU:</span>
          <span className={styles.statValue} title={gpu}>
            {gpu.length > 20 ? gpu.substring(0, 20) + '...' : gpu}
          </span>
        </div>
      </div>
      <div className={`${styles.creditBox} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.content}>
          <span className={styles.text}>
            made by{' '}
            <span className={styles.axrex} onClick={handleAxrexClick}>
              axrex
            </span>
            <Heart className={styles.heart} size={14} />
          </span>
          {isExpanded && (
            <div className={styles.instagramSection}>
              <button className={styles.instagramButton} onClick={handleInstagramClick}>
                <Instagram size={18} />
                <span>yigit.skyline</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

