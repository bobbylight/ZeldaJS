import {defineConfig} from 'vite'
import {resolve} from 'path';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src/"),
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                editor: resolve(__dirname, 'editor.html'),
            },
        },
    },
    plugins: [
        vue(),
        vuetify({ autoImport: true }),
    ],
    test: {
        environment: 'jsdom',
        deps: {
            inline: ['vuetify'],
        },
        setupFiles: [ resolve(__dirname, './src/setupTests.ts') ],
    },
});
