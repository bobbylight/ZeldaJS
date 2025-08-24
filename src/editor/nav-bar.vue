<template>
    <v-app-bar
        absolute
        app
        color="primary"
        dark
    >
        <template v-slot:prepend>
            <v-img
                alt="Map Creator Logo"
                class="shrink mr-2"
                contain
                src="/res/crest.png"
                transition="scale-transition"
                width="40"
            />
        </template>

        <v-app-bar-title>
            Zelda Map Creator
        </v-app-bar-title>

        <template v-slot:append>
            <v-select ref="select" :items="maps" style="max-width: 8rem;" hide-details
                      v-model="selectedMap" @update:modelValue="onSelectedMapChanged"/>

            <v-btn
                href="https://github.com/vuetifyjs/vuetify/releases/latest"
                target="_blank">
                <span class="mr-2">About</span>
            </v-btn>
        </template>
    </v-app-bar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const selectedMap = ref<string | null>(null);
const maps = ref<{ title: string, value: string }[]>([]);
const select = ref();
const store = useStore();

function focusCanvas() {
    // // Cheap way to broadcast an event to other components
    // // Find a better way to do this, but the interested canvas is a distant sibling.
    // getCurrentInstance()?.proxy?.$root.$emit('focusCanvas');
}

function onSelectedMapChanged(newValue: string) {
    (select.value as any)?.blur();
    store.commit('setMap', newValue);
}

function preventFocus(e: FocusEvent) {
    e.preventDefault();
    if (e.relatedTarget) {
        (e.relatedTarget as HTMLElement).focus();
    } else {
        (e.currentTarget as HTMLElement).blur();
    }
}

onMounted(() => {
    maps.value.push({ title: 'Overworld', value: 'overworld' });
    for (let i = 1; i <= 1; i++) {
        maps.value.push({ title: `Level ${i}`, value: `level${i}` });
    }
    selectedMap.value = 'overworld'; // TODO: Get the real current map
});
</script>
