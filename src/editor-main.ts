import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './editor/app.vue';
import store from './editor/store';
import '@/editor/editor.less';

Vue.config.productionTip = false;

new Vue({
    store,
    vuetify,
    render: (h: Function) => h(App)
} as any).$mount('#app');
