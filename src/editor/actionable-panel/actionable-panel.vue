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
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class ActionablePanel extends Vue {
    @Prop({ required: true })
    title!: string;

    @Prop({ default: true })
    padded!: boolean;
}
</script>

<style lang="less" scoped>
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
