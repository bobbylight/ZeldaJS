import {defineConfig} from 'vite'
import path from 'path';
import {resolve} from 'path';
import vue from '@vitejs/plugin-vue2';
import Components from 'unplugin-vue-components/vite';
import {VuetifyResolver} from "unplugin-vue-components/resolvers";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/"),
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
        Components({
            resolvers: [VuetifyResolver()],
        }),
    ],
});
