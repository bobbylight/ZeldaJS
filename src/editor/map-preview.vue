<template>
    <canvas :width="canvasStyleWidth" :height="canvasStyleHeight"
            class="map-preview-canvas" ref="canvas"
            @mousemove="updateArmedScreen"
            @mouseleave="clearArmedScreen"
            @click="updateSelectedScreen"/>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ZeldaGame } from '@/ZeldaGame';
import { Constants } from '@/Constants';
import { Map } from '@/Map';
import { Screen } from '@/Screen';
import RowColumnPair from '@/RowColumnPair';
import { debounce } from 'debounce';

@Component
export default class MapPreview extends Vue {

    @Prop({ required: true })
    game!: ZeldaGame;

    @Prop({ required: true })
    map!: Map;

    @Prop({ required: true })
    lastModified!: number;

    armedScreenRow: number = -1;
    armedScreenCol: number = -1;

    debouncedRepaint: Function | null = null;

    clearArmedScreen() {
        this.armedScreenRow = this.armedScreenCol = -1;
        this.repaint();
    }

    get currentScreen(): Screen | null {
        return this.$store.state.currentScreen;
    }

    repaint() {

        const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement;

        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        ctx.save();

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, Constants.SCREEN_WIDTH * Constants.SCREEN_COL_COUNT,
            Constants.SCREEN_HEIGHT * Constants.SCREEN_ROW_COUNT);

        const map: Map = this.game.map;
        for (let row: number = 0; row < map.rowCount; row++) {

            for (let col: number = 0; col < map.colCount; col++) {

                const screen: Screen = map.getScreen(row, col);
                screen.paint(ctx);
                screen.paintTopLayer(ctx);

                const currentScreenRow: number = this.$store.state.currentScreenRow;
                const currentScreenCol: number = this.$store.state.currentScreenCol;
                MapPreview.possiblyOutlineScreen(ctx, row, col, currentScreenRow, currentScreenCol, 'red');
                MapPreview.possiblyOutlineScreen(ctx, row, col, this.armedScreenRow, this.armedScreenCol, 'blue');

                ctx.translate(Constants.SCREEN_WIDTH, 0);
            }

            const xToZero: number = -Constants.SCREEN_WIDTH * map.colCount;
            ctx.translate(xToZero, Constants.SCREEN_HEIGHT);
        }

        ctx.restore();
        console.log('Done repainting');
    }

    @Watch('lastModified')
    onMapEditorUpdated() {
        this.repaint();
    }

    mounted() {
        this.debouncedRepaint = debounce(this.repaint, 100);
        this.repaint();
    }

    get canvasStyleHeight(): number {
        return Constants.SCREEN_HEIGHT * Constants.SCREEN_ROW_COUNT;
    }

    get canvasStyleWidth(): number {
        return Constants.SCREEN_WIDTH * Constants.SCREEN_COL_COUNT;
    }

    private mouseEventToScreen(e: MouseEvent): RowColumnPair {

        // e = Mouse click event.
        const rect: DOMRect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const x: number = e.clientX - rect.left;
        const y: number = e.clientY - rect.top;

        const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement;
        const canvasWidth: number = canvas.clientWidth;
        const canvasHeight: number = canvas.clientHeight;

        const virtualScreenWidth: number = canvasWidth / Constants.SCREEN_COL_COUNT;
        const virtualScreenHeight: number = canvasHeight / Constants.SCREEN_ROW_COUNT;

        const row: number = Math.floor(y / virtualScreenHeight);
        const col: number = Math.floor(x / virtualScreenWidth);

        return { row, col };
    }

    @Watch('currentScreen')
    onCurrentScreenChanged() {
        this.debouncedRepaint!();
    }

    private static possiblyOutlineScreen(ctx: CanvasRenderingContext2D, row: number, col: number,
                                  targetRow: number, targetCol: number, style: string) {
        if (row === targetRow && col === targetCol) {
            ctx.strokeStyle = style;
            ctx.lineWidth = 10;
            ctx.strokeRect(0, 0, Constants.SCREEN_WIDTH - 10, Constants.SCREEN_HEIGHT - 10);
        }
    }

    updateArmedScreen(e: MouseEvent) {

        const { row, col } = this.mouseEventToScreen(e);

        // Only repaint if armed screen changes since the repaint is expensive
        if (row !== this.armedScreenRow || col !== this.armedScreenCol) {
            this.armedScreenRow = row;
            this.armedScreenCol = col;
            this.repaint();
        }
    }

    updateSelectedScreen(e: MouseEvent) {
        const { row, col } = this.mouseEventToScreen(e);
        this.$store.commit('setCurrentScreen', { row, col });
    }
}
</script>

<style lang="less" scoped>
.map-preview-canvas {
    width: 100%;
    height: 300px;
    cursor: pointer;
}
</style>
