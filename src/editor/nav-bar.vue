<template>
    <v-app-bar
        absolute
        app
        color="primary"
        dark
    >
        <div class="d-flex align-center">
            <v-img
                alt="Map Creator Logo"
                class="shrink mr-2"
                contain
                src="/res/crest.png"
                transition="scale-transition"
                width="40"
            />
            Zelda Map Creator
        </div>

        <v-spacer/>

        <v-select ref="select" :items="maps" style="max-width: 8rem;" hide-details
                  v-model="selectedMap" @focus="preventFocus" @change="onSelectedMapChanged"/>

        <v-btn
            href="https://github.com/vuetifyjs/vuetify/releases/latest"
            target="_blank" text>
            <span class="mr-2">About</span>
        </v-btn>
    </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class NavBar extends Vue {
    selectedMap: string | null = null;
    maps: any[] = [];

    focusCanvas() {
        // Cheap way to broadcast an event to other components
        // Find a better way to do this, but the interested canvas is a distant sibling.
        this.$root.$emit('focusCanvas');
    }

    mounted() {
        this.maps.push({ text: 'Overworld', value: 'overworld' });
        for (let i: number = 1; i <= 1; i++) {
            this.maps.push({ text: `Level ${i}`, value: `level${i}` });
        }

        this.selectedMap = 'overworld'; // TODO: Get the real current map
    }

    onSelectedMapChanged(newValue: string) {
        // Cheap way to broadcast an event to other components
        // Find a better way to do this, but the interested canvas is a distant sibling.
        (this.$refs.select as HTMLSelectElement).blur();
        this.$root.$emit('focusCanvas');

        this.$store.commit('setMap', newValue);
    }

    /**
     * Prevents the select from gaining focus.  If we don't do this, the
     * user pressing the up or down arrow keys will also navigate through
     * the select's options, besides just changing screens in the nmap
     * editor.
     *
     * @param e The focus event.
     */
    preventFocus(e: FocusEvent) {
        e.preventDefault();
        if (e.relatedTarget) {
        // Revert focus back to previous blurring element
            (e.relatedTarget as HTMLElement).focus();
        }
        else {
        // No previous focus target, blur instead
            (e.currentTarget as HTMLElement).blur();
        }
    }
}
</script>
