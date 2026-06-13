import { useState, useRef, useEffect } from 'react'

// נגן מדיה בטוח: וידאו / אודיו לפי הנתונים ב-videos.json.

function isValidUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') return false
  try {
    const u = new URL(url, window.location.origin)
    return ['http:', 'https:'].includes(u.protocol) || url.startsWith('/')
  } catch {
    return false
  }
}

function toYouTubeEmbed(url) {
  try {
    const u = new URL(url)
    let id = ''
    if (u.hostname.includes('youtu.be')) {
      id = u.pathname.slice(1)
    } else if (u.searchParams.get('v')) {
      id = u.searchParams.get('v')
    } else if (u.pathname.includes('/embed/')) {
      return url
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  } catch {
    return null
  }
}

function useAudioResume(audioRef, media) {
  const storageKey = `cp_audio_pos_${media.url}`
  const intervalRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // שחזור מיקום שמור בעת טעינה
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const pos = parseFloat(saved)
      if (pos > 0 && isFinite(pos)) {
        audio.currentTime = pos
      }
    }

    function handlePlay() {
      // שמירת מיקום כל 5 שניות
      intervalRef.current = setInterval(() => {
        if (audio && !audio.paused) {
          localStorage.setItem(storageKey, String(audio.currentTime))
        }
      }, 5000)
    }

    function handlePause() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (audio) {
        localStorage.setItem(storageKey, String(audio.currentTime))
      }
    }

    function handleEnded() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      localStorage.removeItem(storageKey)
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [audioRef, storageKey])
}

function AudioWithThumbnail({ media }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useAudioResume(audioRef, media)

  function handlePlay() {
    setPlaying(true)
    setTimeout(() => {
      if (audioRef.current) {
        // שחזור מיקום שמור לפני הפעלה
        const saved = localStorage.getItem(`cp_audio_pos_${media.url}`)
        if (saved) {
          const pos = parseFloat(saved)
          if (pos > 0 && isFinite(pos)) {
            audioRef.current.currentTime = pos
          }
        }
        audioRef.current.play()
      }
    }, 100)
  }

  if (!playing) {
    return (
      <div className="media media-audio-thumb" onClick={handlePlay} role="button" tabIndex={0}
        aria-label={`להפעלת ${media.title || 'אודיו'}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlay() }}
      >
        <img className="media-thumb-img" src={media.thumbnail} alt={media.title || ''} />
        <div className="media-play-overlay">
          <div className="media-play-btn" aria-hidden="true">▶</div>
        </div>
        {media.title && <div className="media-thumb-title">{media.title}</div>}
      </div>
    )
  }

  return (
    <div className="media media-audio">
      {media.thumbnail && <img className="media-audio-banner" src={media.thumbnail} alt="" />}
      {media.title && <div className="media-title">{media.title}</div>}
      <audio ref={audioRef} controls preload="auto" src={media.url}>
        הדפדפן שלך אינו תומך בנגן האודיו.
      </audio>
    </div>
  )
}

export default function MediaPlayer({ media }) {
  if (!media || !isValidUrl(media.url)) {
    return null
  }

  const { type, provider, url, title } = media

  if (type === 'audio') {
    if (media.thumbnail) {
      return <AudioWithThumbnail media={media} />
    }
    return (
      <div className="media media-audio">
        {title && <div className="media-title">{title}</div>}
        <audio controls preload="none" src={url}>
          הדפדפן שלך אינו תומך בנגן האודיו.
        </audio>
      </div>
    )
  }

  // וידאו
  if (provider === 'youtube') {
    const embed = toYouTubeEmbed(url)
    if (!embed) return null
    return (
      <div className="media">
        <div className="media-frame">
          <iframe
            src={embed}
            title={title || 'סרטון השיעור'}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    )
  }

  // וידאו מקומי
  return (
    <div className="media">
      <div className="media-frame">
        <video controls preload="none" src={url}>
          הדפדפן שלך אינו תומך בנגן הווידאו.
        </video>
      </div>
    </div>
  )
}
