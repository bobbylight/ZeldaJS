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

<script lang="ts">
export default {

    name: 'NavBar',

    data() {
        return {
            selectedMap: null, // string | null
            maps: [], // any[]
        };
    },

    methods: {
        focusCanvas() {
            // // Cheap way to broadcast an event to other components
            // // Find a better way to do this, but the interested canvas is a distant sibling.
            // this.$root.$emit('focusCanvas');
        },

        onSelectedMapChanged(newValue: string) {
            // // Cheap way to broadcast an event to other components
            // // Find a better way to do this, but the interested canvas is a distant sibling.
            (this.$refs.select as HTMLSelectElement).blur();
            // this.$root.$emit('focusCanvas');

            this.$store.commit('setMap', newValue);
        },

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
        },
    },

    mounted() {
        this.maps.push({ title: 'Overworld', value: 'overworld' });
        for (let i: number = 1; i <= 1; i++) {
            this.maps.push({ title: `Level ${i}`, value: `level${i}` });
        }

        this.selectedMap = 'overworld'; // TODO: Get the real current map
    },
}
</script>
