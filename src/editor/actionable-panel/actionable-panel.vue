<template>

    <v-card class="actionable-panel control-group-bottom-margin" outlined>

        <v-card-title class="primary actionable-panel-title">
            {{title}}
        </v-card-title>

        <v-card-text class="actionable-panel-content" :class="{ 'actionable-panel-not-padded': !padded }">
            <slot/>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({

    name: 'ActionablePanel',

    props: {
        title: String,
        padded: {
            type: Boolean,
            default: true,
        },
    },
});
</script>

<style lang="scss" scoped>
.actionable-panel {

    // Better match tabbed panes in size
    .actionable-panel-title {
        color: white;
        padding-top: 8px;
        padding-bottom: 8px;
        font-size: 1rem;
        /*text-transform: uppercase;*/
    }

    .actionable-panel-not-padded {
        padding: 0 !important;
    }

    .actionable-panel-content {
        padding: 16px; // By default there is no top padding
    }
}
</style>
