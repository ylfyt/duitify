import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import Icons from 'unplugin-icons/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return {
        plugins: [react(), Icons({ compiler: 'jsx', jsx: 'react' })],
        server: {
            host: '0.0.0.0',
            port: 4000,
        },
        base: process.env.NODE_ENV === 'production' ? '/app' : '/',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
    };
});
