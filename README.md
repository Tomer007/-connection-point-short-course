# Connection Point Course

Digital course app for "נקודת חיבור" (Connection Point) — a guided journey through body, emotion, thought, and energy to shift from fear to love.

## About

"מפחד לאהבה בארבעה רבדים" (From Fear to Love in Four Layers) is a Hebrew digital course by Anna Ben Yehuda and Yael Rapaport. Six short lessons with audio guidance, interactive exercises, and daily practice tools.

## Tech Stack

- React 18
- Vite 5
- Static site (no backend)
- localStorage for progress tracking

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build & Deploy

```bash
npm run build
```

The `dist/` folder is ready for static hosting. Configured for Render via `render.yaml`.

## Project Structure

```
src/
├── App.jsx              # Main app with routing and auth
├── components/
│   ├── Login.jsx        # Email + code login gate
│   ├── Home.jsx         # Landing page with team bios
│   ├── Lesson.jsx       # Lesson view with content + audio
│   ├── MediaPlayer.jsx  # Audio/video player
│   ├── Sidebar.jsx      # Navigation sidebar
│   ├── Practice.jsx     # Personal practice journal
│   ├── Completion.jsx   # Course completion screen
│   └── exercises/       # Interactive lesson exercises
├── data/course.js       # Course content and structure
├── hooks/               # Custom React hooks
└── styles.css           # All styles
public/
├── media/               # Audio lessons + video
├── team/                # Team photos
├── brand/               # Logo and icons
└── data/videos.json     # Media configuration
```

## License

Private — All rights reserved. Anna & Yael, Connection Point.
