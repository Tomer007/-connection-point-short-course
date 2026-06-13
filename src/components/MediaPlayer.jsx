// נגן מדיה בטוח: וידאו / אודיו לפי הנתונים ב-videos.json.
// אם אין url או שהוא לא תקין - מציג placeholder יפה ולא שובר את הקורס.

function isValidUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') return false
  try {
    const u = new URL(url, window.location.origin)
    return ['http:', 'https:'].includes(u.protocol) || url.startsWith('/')
  } catch {
    return false
  }
}

// המרת קישור יוטיוב רגיל לקישור הטמעה. לא ממציאים קישור - רק ממירים את מה שניתן.
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

function Placeholder() {
  return null
}

export default function MediaPlayer({ media }) {
  if (!media || !isValidUrl(media.url)) {
    return (
      <div className="media">
        <Placeholder />
      </div>
    )
  }

  const { type, provider, url, title } = media

  if (type === 'audio') {
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
    if (!embed) {
      return (
        <div className="media">
          <Placeholder />
        </div>
      )
    }
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

  // וידאו מקומי או חיצוני (קובץ mp4 וכו')
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
