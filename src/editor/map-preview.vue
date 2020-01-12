<template>
    <canvas :width="canvasStyleWidth" :height="canvasStyleHeight"
            style="width: 100%; height: 300px" ref="canvas" />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ZeldaGame } from '../ZeldaGame';
import { Constants } from '../Constants';
import { Map } from '../Map';
import { Screen } from '../Screen';

@Component
export default class MapPreview extends Vue {

    @Prop({ required: true })
    game!: ZeldaGame;

    @Prop({ required: true })
    map!: Map;

    @Prop({ required: true })
    lastModified: number;

    repaint() {

        const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement;

        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        ctx.save();

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, Constants.SCREEN_WIDTH * Constants.SCREEN_COL_COUNT,
            Constants.SCREEN_HEIGHT * Constants.SCREEN_ROW_COUNT);

        const map: Map = this.game!.map;
        for (let row: number = 0; row < map.rowCount; row++) {

            for (let col: number = 0; col < map.colCount; col++) {
                const screen: Screen = map.getScreen(row, col);
                screen.paint(ctx);
                screen.paintTopLayer(ctx);
                ctx.translate(Constants.SCREEN_WIDTH, 0);
            }

            const xToZero: number = -Constants.SCREEN_WIDTH * map.colCount;
            ctx.translate(xToZero, Constants.SCREEN_HEIGHT);
        }

        ctx.restore();
        console.log('Painting complete');
    }

    @Watch('lastModified')
    onMapEditorUpdated() {
        this.repaint();
    }

    mounted() {
        this.repaint();
    }

    get canvasStyleHeight(): number {
        return Constants.SCREEN_HEIGHT * Constants.SCREEN_ROW_COUNT;
    }

    get canvasStyleWidth(): number {
        return Constants.SCREEN_WIDTH * Constants.SCREEN_COL_COUNT;
    }
}
</script>

<style lang="less" scoped>
</style>
