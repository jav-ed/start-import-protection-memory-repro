import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    tanstackStart({
      // IMPORT_PROTECTION=off disables the check, to compare memory with and without it.
      importProtection: { enabled: process.env.IMPORT_PROTECTION !== 'off' },
    }),
    react(),
  ],
})
