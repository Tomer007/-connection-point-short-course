import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// אתר סטטי, ללא backend. הבנייה יוצאת אל dist/ (publish directory ב-Render).
export default defineConfig({
  plugins: [react()],
  base: './',
})
