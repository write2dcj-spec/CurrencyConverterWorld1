import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
    loader: { '.js': 'jsx' }  // Force .js files to be treated as JSX
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'  // Also for dependencies
      }
    }
  }
})
