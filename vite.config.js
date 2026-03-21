import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // single API base / gateway used in development
  const apiBase = env.VITE_API_BASE_URL || 'http://localhost:8080';

  return {
    plugins: [react()],
    server: {
      proxy: {
        // forward API paths to the API gateway (or direct service if you prefer)
        '/auth': {
          target: apiBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth/, '/auth'),
        },
        '/hotels': {
          target: apiBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/hotels/, '/hotels'),
        },
        '/bookings': {
          target: apiBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/bookings/, '/bookings'),
        },
        '/payments': {
          target: apiBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/payments/, '/payments'),
        },
      },
    },
  };
});
