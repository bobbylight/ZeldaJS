<template>
    <v-app>

        <nav-bar/>

        <v-content>
            <main-content/>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import NavBar from '@/editor/nav-bar.vue';
import MainContent from '@/editor/main-content.vue';

export default Vue.extend({
    name: 'App',

    components: {
        NavBar,
        MainContent
    },

    data: () => ({
        //
    })
});
</script>
