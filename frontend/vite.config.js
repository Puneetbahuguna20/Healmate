import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Load env files from the project root so both apps share the same .env
  envDir: '../',
  plugins: [react(),  tailwindcss(),],
})

