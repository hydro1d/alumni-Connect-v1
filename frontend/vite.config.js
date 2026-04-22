import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        dashboard: './src/dashboard.html',
        alumni: './src/alumni.html',
        profile: './src/profile.html',
        jobs: './src/jobs.html'
      }
    }
  }
});
