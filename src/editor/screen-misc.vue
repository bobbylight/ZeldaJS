<template>
    <div>
        <div>
            <v-select label="Music" :items="songs" v-model="music" @update:modelValue="onMusicChanged"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { Store, useStore } from 'vuex';
import { Screen } from '@/Screen';
import { EditorState } from '@/editor/editor';

const store: Store<EditorState> = useStore();

const songs = [
    { title: '(default)', value: null },
    { title: 'No music', value: 'none' },
    { title: 'Overworld', value: 'overworldMusic' },
    { title: 'Labyrinth', value: 'labyrinthMusic' },
];

defineProps<{
    screen: Screen,
}>();


const music = ref<string | null>(null);

const screen = computed<Screen | null>(() => store.state.currentScreen);

function onMusicChanged(newValue: string | null) {
    store.commit('setCurrentScreenMusic', newValue);
}

onMounted(() => {
    music.value = screen.value?.music ?? null;
});

watch(screen, (newScreen) => {
    music.value = newScreen?.music ?? null;
});
</script>

<style>

</style>
