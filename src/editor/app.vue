<template>
    <v-app>

        <nav-bar/>

        <v-main>
            <main-content/>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import NavBar from '@/editor/nav-bar.vue';
import MainContent from '@/editor/main-content.vue';

export default {
    name: 'App',

    components: {
        NavBar,
        MainContent
    },

    data: () => ({
    //
    })
}
</script>
