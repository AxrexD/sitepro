'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react'
import styles from './MusicPlayer.module.css'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(50)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Auto play on load
    audio.play().catch(() => {
      setIsPlaying(false)
    })

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const updateDuration = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume / 100
  }, [volume])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
      if (audioRef.current) {
        audioRef.current.muted = false
      }
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isVisible) return null

  return (
    <div className={styles.musicPlayer}>
      <audio
        ref={audioRef}
        src="/y.mp3"
        loop
        autoPlay
      />
      
      <div className={styles.header}>
        <div className={styles.songInfo}>
          <div className={styles.songName}>y.mp3</div>
          <div className={styles.timeInfo}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        <button
          className={styles.closeButton}
          onClick={() => setIsVisible(false)}
          title="Kapat"
        >
          <X size={16} />
        </button>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.playButton}
          onClick={togglePlay}
          title={isPlaying ? 'Durdur' : 'Oynat'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <div className={styles.volumeControl}>
          <button
            className={styles.muteButton}
            onClick={toggleMute}
            title={isMuted ? 'Sesi Aç' : 'Sessize Al'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
          />
          <span className={styles.volumeValue}>{volume}%</span>
        </div>
      </div>
    </div>
  )
}

