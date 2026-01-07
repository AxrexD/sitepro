'use client'

import { useEffect, useRef, useState } from 'react'
import CreditBox from './components/CreditBox'
import ContentContainer from './components/ContentContainer'
import MusicPlayer from './components/MusicPlayer'
import SplashScreen from './components/SplashScreen'
import ViewCounter from './components/ViewCounter'
import styles from './page.module.css'

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
}

export default function Home() {
  const [showContent, setShowContent] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Create particles
    const particleCount = 200
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
      })
    }

    // Animation loop
    let animationId: number
    let time = 0
    const maxDistance = 120

    // Rainbow color function using HSL
    const getRainbowColor = (hue: number, alpha: number = 1) => {
      const h = hue % 360
      const s = 100
      const l = 50
      
      // Convert HSL to RGB
      const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100)
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
      const m = l / 100 - c / 2

      let r = 0, g = 0, b = 0

      if (h >= 0 && h < 60) {
        r = c; g = x; b = 0
      } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0
      } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x
      } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c
      } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c
      } else if (h >= 300 && h < 360) {
        r = c; g = 0; b = x
      }

      r = Math.round((r + m) * 255)
      g = Math.round((g + m) * 255)
      b = Math.round((b + m) * 255)

      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    const animate = () => {
      time += 0.3 // Slower, smoother color transitions

      // Clear canvas
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
        if (particle.z < 0) particle.z = 1000
        if (particle.z > 1000) particle.z = 0

        // Calculate 2D position with perspective
        const scale = 200 / (200 + particle.z)
        const size = scale * 2

        // Calculate rainbow color based on time and particle index
        // Each particle has a different starting hue offset for smooth gradient
        const hue = (time + index * 1.2) % 360
        const color = getRainbowColor(hue, Math.max(0.3, scale))

        // Draw particle
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw connections based on distance only
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]
          const p2 = particles[j]

          // Calculate 2D distance
          const dx = p2.x - p1.x
          const dy = p2.y - p1.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Draw line if particles are close enough
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.5
            // Use average hue of the two particles for smooth line color
            const hue1 = (time + i * 1.2) % 360
            const hue2 = (time + j * 1.2) % 360
            const avgHue = (hue1 + hue2) / 2
            const lineColor = getRainbowColor(avgHue, opacity)
            
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      resizeCanvas()
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className={styles.container} />
      {!showContent && <SplashScreen onComplete={() => setShowContent(true)} />}
      {showContent && (
        <>
          <MusicPlayer />
          <ContentContainer />
          <CreditBox />
          <ViewCounter />
        </>
      )}
    </>
  )
}
