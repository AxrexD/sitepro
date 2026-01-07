'use client'

import { useEffect, useState } from 'react'
import { User, Activity } from 'lucide-react'
import styles from './ProfileBox.module.css'

interface DiscordData {
  discord_user: {
    username: string
    discriminator: string
    avatar: string
    id: string
    public_flags: number
    bot: boolean
    premium_type?: number
    display_name?: string
    global_name?: string
    avatar_decoration_data?: {
      asset: string
      sku_id: string
    } | null
  }
  discord_status: string
  activities: Array<{
    name: string
    type: number
    state?: string
    details?: string
    assets?: {
      large_image?: string
      large_text?: string
      small_image?: string
      small_text?: string
    }
    timestamps?: {
      start?: number
      end?: number
    }
    application_id?: string
  }>
  spotify?: {
    track_id: string
    timestamps: {
      start: number
      end: number
    }
    song: string
    artist: string
    album_art_url: string
  } | null
  listening_to_spotify: boolean
  active_on_discord_web: boolean
  active_on_discord_desktop: boolean
  active_on_discord_mobile: boolean
  active_on_discord_embedded: boolean
  kv?: Record<string, any>
}

export default function ProfileBox() {
  const [discordData, setDiscordData] = useState<DiscordData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Discord User ID
  const DISCORD_USER_ID = '1402933633869676554'

  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
        const data = await response.json()
        
        if (data.success) {
          setDiscordData(data.data)
        } else {
          setError('Discord verisi alınamadı')
        }
      } catch (err) {
        setError('Bağlantı hatası')
      } finally {
        setLoading(false)
      }
    }

    fetchDiscordData()
    
    // Her 5 saniyede bir güncelle
    const interval = setInterval(fetchDiscordData, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#43b581'
      case 'idle':
        return '#faa61a'
      case 'dnd':
        return '#f04747'
      default:
        return '#747f8d'
    }
  }

  const getActivityType = (type: number) => {
    switch (type) {
      case 0:
        return 'Oynuyor'
      case 1:
        return 'Yayınlıyor'
      case 2:
        return 'Dinliyor'
      case 3:
        return 'İzliyor'
      case 4:
        return 'Özel'
      case 5:
        return 'Yarışıyor'
      default:
        return 'Oynuyor'
    }
  }

  const getBadges = (flags: number) => {
    const badges: string[] = []
    if (flags & (1 << 0)) badges.push('DISCORD_EMPLOYEE')
    if (flags & (1 << 1)) badges.push('PARTNERED_SERVER_OWNER')
    if (flags & (1 << 2)) badges.push('HYPESQUAD_EVENTS')
    if (flags & (1 << 3)) badges.push('BUG_HUNTER_LEVEL_1')
    if (flags & (1 << 6)) badges.push('HOUSE_BRAVERY')
    if (flags & (1 << 7)) badges.push('HOUSE_BRILLIANCE')
    if (flags & (1 << 8)) badges.push('HOUSE_BALANCE')
    if (flags & (1 << 9)) badges.push('EARLY_SUPPORTER')
    if (flags & (1 << 10)) badges.push('TEAM_USER')
    if (flags & (1 << 12)) badges.push('SYSTEM')
    if (flags & (1 << 14)) badges.push('BUG_HUNTER_LEVEL_2')
    if (flags & (1 << 16)) badges.push('VERIFIED_BOT')
    if (flags & (1 << 17)) badges.push('EARLY_VERIFIED_DEVELOPER')
    if (flags & (1 << 18)) badges.push('DISCORD_CERTIFIED_MODERATOR')
    if (flags & (1 << 19)) badges.push('BOT_HTTP_INTERACTIONS')
    if (flags & (1 << 22)) badges.push('ACTIVE_DEVELOPER')
    return badges
  }

  const getPremiumType = (type?: number) => {
    switch (type) {
      case 1:
        return 'Nitro Classic'
      case 2:
        return 'Nitro'
      case 3:
        return 'Nitro Basic'
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className={styles.profileBox}>
        <div className={styles.loading}>Yükleniyor...</div>
      </div>
    )
  }

  if (error || !discordData) {
    return (
      <div className={styles.profileBox}>
        <div className={styles.error}>
          {error || 'Discord verisi bulunamadı'}
        </div>
      </div>
    )
  }

  const { discord_user, discord_status, activities, spotify, listening_to_spotify, active_on_discord_web, active_on_discord_desktop, active_on_discord_mobile } = discordData
  
  const displayName = discord_user.display_name || discord_user.global_name || discord_user.username
  const avatarUrl = discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(discord_user.discriminator) % 5}.png`
  
  const avatarDecorationUrl = discord_user.avatar_decoration_data
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${discord_user.avatar_decoration_data.asset}.png`
    : null

  const badges = getBadges(discord_user.public_flags || 0)
  const premiumType = getPremiumType(discord_user.premium_type)
  const nonSpotifyActivities = activities.filter(a => a.type !== 2 || !listening_to_spotify)
  
  const activeClients = []
  if (active_on_discord_web) activeClients.push('Web')
  if (active_on_discord_desktop) activeClients.push('Desktop')
  if (active_on_discord_mobile) activeClients.push('Mobile')

  return (
    <div className={styles.profileBox}>
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
          <img src={avatarUrl} alt={displayName} className={styles.avatar} />
          {avatarDecorationUrl && (
            <img src={avatarDecorationUrl} alt="Decoration" className={styles.avatarDecoration} />
          )}
          <div 
            className={styles.statusIndicator} 
            style={{ backgroundColor: getStatusColor(discord_status) }}
          />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.username}>
            {displayName}
            {discord_user.discriminator !== '0' && (
              <span className={styles.discriminator}>#{discord_user.discriminator}</span>
            )}
            {discord_user.username !== displayName && (
              <span className={styles.originalUsername}>@{discord_user.username}</span>
            )}
          </div>
          <div className={styles.status}>
            {discord_status === 'online' && 'Çevrimiçi'}
            {discord_status === 'idle' && 'Boşta'}
            {discord_status === 'dnd' && 'Rahatsız Etmeyin'}
            {discord_status === 'offline' && 'Çevrimdışı'}
            {activeClients.length > 0 && (
              <span className={styles.activeClients}> • {activeClients.join(', ')}</span>
            )}
          </div>
        </div>
      </div>

      {(badges.length > 0 || premiumType) && (
        <div className={styles.badgesSection}>
          {premiumType && (
            <div className={styles.premiumBadge}>
              <span className={styles.premiumIcon}>✨</span>
              <span>{premiumType}</span>
            </div>
          )}
          {badges.length > 0 && (
            <div className={styles.badgesList}>
              {badges.slice(0, 5).map((badge, index) => (
                <div key={index} className={styles.badge}>
                  {badge.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {listening_to_spotify && spotify && (
        <div className={styles.spotifyActivity}>
          <div className={styles.spotifyHeader}>
            <Activity size={16} />
            <span>Spotify'da dinliyor</span>
          </div>
          <div className={styles.spotifyInfo}>
            <div className={styles.spotifySong}>{spotify.song}</div>
            <div className={styles.spotifyArtist}>{spotify.artist}</div>
          </div>
        </div>
      )}

      {nonSpotifyActivities.length > 0 && (
        <div className={styles.activities}>
          {nonSpotifyActivities.map((activity, index) => {
            const activityImage = activity.assets?.large_image
              ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
              : null

            return (
              <div key={index} className={styles.activity}>
                {activityImage && (
                  <img src={activityImage} alt={activity.name} className={styles.activityImage} />
                )}
                {!activityImage && <Activity size={14} />}
                <div className={styles.activityInfo}>
                  <div className={styles.activityType}>{getActivityType(activity.type)}</div>
                  <div className={styles.activityName}>{activity.name}</div>
                  {activity.details && (
                    <div className={styles.activityDetails}>{activity.details}</div>
                  )}
                  {activity.state && (
                    <div className={styles.activityState}>{activity.state}</div>
                  )}
                  {activity.assets?.large_text && (
                    <div className={styles.activityText}>{activity.assets.large_text}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

