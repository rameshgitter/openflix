import { defineConfig } from 'vite'

export default defineConfig({
    base: '/OpenFlix/', // Required for GitHub Pages
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
