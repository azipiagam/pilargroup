import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget = mode === 'development'
    ? env.VITE_API_PROXY_TARGET || 'http://localhost:8000'
    : env.VITE_API_PROXY_TARGET

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      allowedHosts: [
      'rational-gertie-acquiescently.ngrok-free.dev',
      ],
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
      watch: {
        usePolling: true,
        interval: 300,
      },
    },
  }
})
