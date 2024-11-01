<template>
    <div>
        <div>
            <label>Music</label>
            <v-select :items="songs" v-model="music" @change="onMusicChanged"/>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Screen } from '@/Screen';

export default Vue.extend({

    name: 'ScreenMisc',

    data() {
        return {
            songs: [
                {text: '(default)', value: null},
                {text: 'No music', value: 'none'},
                {text: 'Overworld', value: 'overworldMusic'},
                {text: 'Labyrinth', value: 'labyrinthMusic'}
            ],
            music: null,//this.songs[0].value,
        };
    },

    mounted() {
        // Kick in the pants for initial value
        this.music = this.screen?.music ?? null;
    },

    methods: {
        onMusicChanged(newValue: string) {
            this.$store.commit('setCurrentScreenMusic', newValue);
        },
    },

    watch: {
        screen: function(newScreen: Screen) {
            // default to null so we render properly for undefined
            this.music = newScreen?.music ?? null;
        },
    },

    computed: {
        screen() {
            return this.$store.state.currentScreen;
        },
    },
});
</script>

<style lang="scss">

</style>
