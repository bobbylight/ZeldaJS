import { createApp } from 'vue';
import vuetify from './editor/vuetify-plugin.ts';
import App from './editor/app.vue';
import store from './editor/store';
import '@/editor/editor.scss';

const app = createApp(App)
    .use(store)
    .use(vuetify);
app.mount('#app');
