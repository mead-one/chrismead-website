import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        useRecommendedBuildConfig: false,
        // modulePreload: {
        //     polyfill: false
        // },
        rollupOptions: {
            input: {
                'brick-arch': resolve(__dirname, 'assets/ts/brick-arch.ts'),
            },
            output: {
                dir: resolve(__dirname, 'assets/js'),
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                format: 'iife', // Use IIFE for better Hugo compatibility
                name: '[name].[ext]' // Global variable name
            }
        },
        outDir: '../../assets/js',
        emptyOutDir: false, // Don't clear other compiled JS
        copyPublicDir: false,
        minify: false // Let Hugo handle minification
    },
    publicDir: false,
    server: {
        port: 3000
    }
})
