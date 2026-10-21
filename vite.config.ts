import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const isProd = mode === 'production';
  const basePort = Number(env.VITE_BASE_PORT || 5173);

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    base: '/',
    server: {
      port: basePort,
      strictPort: true,
      open: !isProd,
      proxy: !isProd && env.VITE_API_BASE
        ? {
            '/api': {
              target: env.VITE_API_BASE,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
    define: {
      __APP_NAME__: JSON.stringify(env.VITE_APP_NAME || 'App'),
      __BUILD_MODE__: JSON.stringify(mode || ''),
    },
    build: {
      outDir: 'dist',            // 빌드 결과물 경로 (기본값도 'dist')
      sourcemap: !isProd,        // 개발/스테이징 디버깅용, 운영에서는 보통 false
    },
    preview: { port: 4173, strictPort: true },
    envPrefix: 'VITE_',
  };
});
