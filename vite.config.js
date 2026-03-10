import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
        proxy: {
            '/api': {
                target: process.env.API_URL,
                changeOrigin: true,
            },
        },
    },
});
