import {defineConfig} from 'vite'
import {resolve} from 'path';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import pkg from './package.json';

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
    define: {
        'import.meta.env.VITE_BUILD_VERSION': JSON.stringify(pkg.version),
        'import.meta.env.VITE_BUILD_DATE': JSON.stringify(new Date().toLocaleString()),
    },
    plugins: [
        vue(),
        vuetify({ autoImport: true }),
    ],
    test: {
        environment: 'jsdom',
        globals: true,
        server: {
            deps: {
                inline: ['vuetify'],
            },
        },
        setupFiles: [ resolve(__dirname, './src/setupTests.ts') ],
        //disableConsoleIntercept: true,
    },
});
