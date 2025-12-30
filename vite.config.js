import { defineConfig } from 'vite'

export default defineConfig({
    // base: '/OpenFlix/', // Removed for Vercel
    root: './',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
    server: {
        port: 3000,
        open: true
    }
})
