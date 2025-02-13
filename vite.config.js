import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@udecode/plate-common', '@udecode/plate-basic-marks', '@udecode/plate-basic-elements']
  }
})
