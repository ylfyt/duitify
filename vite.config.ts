import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { COLOR_SCHEMES } from './src/constants/color-schemes';

export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    const BASE_URL = process.env.NODE_ENV === 'production' ? '/duitify' : '';

    return {
        plugins: [
            react(),
            Icons({ compiler: 'jsx', jsx: 'react' }),
            VitePWA({
                registerType: 'autoUpdate',
                devOptions: {
                    enabled: true,
                },
                manifest: {
                    name: 'Duitify',
                    short_name: 'Duitify',
                    start_url: BASE_URL,
                    description: 'Manage your finances easily',
                    theme_color: COLOR_SCHEMES.light.primary,
                    display: 'standalone',
                    orientation: 'portrait',
                    icons: [
                        {
                            src: BASE_URL + '/icons/icon-192x192.png',
                            sizes: '192x192',
                            type: 'image/png',
                        },
                        {
                            src: BASE_URL + '/icons/icon-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                        },
                    ],
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,xml,ttf,otf,woff,woff2}'],
                },
            }),
        ],
        server: {
            host: '0.0.0.0',
            port: 4000,
        },
        base: BASE_URL,
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
    };
});
