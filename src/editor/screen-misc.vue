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
import Component from 'vue-class-component';
import { Screen } from '@/Screen';
import { Watch } from 'vue-property-decorator';

@Component
export default class ScreenMisc extends Vue {
    private readonly songs: any[] = [
        { text: '(default)', value: null },
        { text: 'No music', value: 'none' },
        { text: 'Overworld', value: 'overworldMusic' },
        { text: 'Labyrinth', value: 'labyrinthMusic' }
    ];

    private music: string | null = this.songs[0].value;

    mounted() {
        // Kick in the pants for initial value
        this.onScreenChanged(this.screen);
    }

    onMusicChanged(newValue: string) {
        this.$store.commit('setCurrentScreenMusic', newValue);
    }

    @Watch('screen')
    onScreenChanged(newScreen: Screen) {
        // "|| null" so we properly render for undefined
        this.music = newScreen ? newScreen.music || null : null;
    }

    get screen(): Screen {
        return this.$store.state.currentScreen;
    }
}
</script>

<style lang="scss">

</style>
