<template>
    <actionable-panel :title="title">

        <div class="map-editor">

            <!-- 256x176 + 16-pixel buffer on all sides -->
            <canvas class="screen-canvas" width="288" height="208"
                    ref="canvas"/>
        </div>
    </actionable-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Constants } from '@/Constants';
import { Map } from '../Map';
import { Prop } from 'vue-property-decorator';
import { Screen } from '../Screen';
import { ZeldaGame } from '@/ZeldaGame';
import ActionablePanel from '@/editor/actionable-panel/actionable-panel.vue';

@Component({ components: { ActionablePanel } })
export default class MapEditor extends Vue {

    @Prop({ required: true })
    game: ZeldaGame;

    @Prop({ required: true })
    selectedTileIndex: number;

    armedRow: number = 0;
    armedCol: number = 0;

    private _mouseDown: boolean = false;

    setArmedTile(e: MouseEvent | null) {
        const screen: Screen = this.game.map.currentScreen;
        const selectedTileIndex: number = this.selectedTileIndex;
        screen.setTile(this.armedRow, this.armedCol, selectedTileIndex);
        //$rootScope.$broadcast('mapChanged', screen); // TODO: Formalize an event for this and make it specific
        this.$store.commit('updateLastModified');
    }

    get title(): string {
        const curRow: number = this.$store.state.currentScreenRow;
        const curCol: number = this.$store.state.currentScreenCol;
        const rowCount: number = this.$store.state.game.map ? this.$store.state.game.map.rowCount - 1 : 0;
        const colCount: number = this.$store.state.game.map ? this.$store.state.game.map.colCount - 1 : 0;
        return `Screen (${curRow}, ${curCol}) / (${rowCount}, ${colCount})`;
    }

    static inMainScreen(x: number, y: number) {
        return x >= 32 && x < Constants.SCREEN_WIDTH * 2 + 32 &&
            y >= 32 && y < Constants.SCREEN_HEIGHT * 2 + 32;
    }

    private paintScreenAbovePart(ctx: CanvasRenderingContext2D) {
        const map: Map = this.game.map;
        if (map && map.currentScreenRow > 0) {
            ctx.translate(16, 0);
            const screen: Screen = map.getScreen(map.currentScreenRow - 1, map.currentScreenCol);
            screen.paintRow(ctx, Constants.SCREEN_ROW_COUNT - 1, 0);
            ctx.translate(-16, 0);
        }
        else {
            ctx.fillStyle = 'darkgray';
            ctx.fillRect(16, 0, Constants.SCREEN_WIDTH, 16);
        }
    }

    private paintScreenRightPart(ctx: CanvasRenderingContext2D) {
        const map: Map = this.game.map;
        if (map && map.currentScreenCol < map.colCount - 1) {
            ctx.translate(0, 16);
            const screen: Screen = map.getScreen(map.currentScreenRow, map.currentScreenCol + 1);
            screen.paintCol(ctx, 0, Constants.SCREEN_WIDTH + 16);
            ctx.translate(0, -16);
        }
        else {
            ctx.fillStyle = 'darkgray';
            const x: number = Constants.SCREEN_WIDTH + 16;
            ctx.fillRect(x, 16, 16, Constants.SCREEN_HEIGHT);
        }
    }

    private paintScreenBelowPart(ctx: CanvasRenderingContext2D) {
        const map: Map = this.game.map;
        if (map && map.currentScreenRow < map.rowCount - 1) {
            ctx.translate(16, 0);
            const screen: Screen = map.getScreen(map.currentScreenRow + 1, map.currentScreenCol);
            screen.paintRow(ctx, 0, Constants.SCREEN_HEIGHT + 16);
            ctx.translate(-16, 0);
        }
        else {
            ctx.fillStyle = 'darkgray';
            const y: number = Constants.SCREEN_HEIGHT + 16;
            ctx.fillRect(16, y, Constants.SCREEN_WIDTH, 16);
        }
    }

    private paintScreenLeftPart(ctx: CanvasRenderingContext2D) {
        const map: Map = this.game.map;
        if (map && map.currentScreenCol > 0) {
            ctx.translate(0, 16);
            const screen: Screen = map.getScreen(map.currentScreenRow, map.currentScreenCol - 1);
            screen.paintCol(ctx, Constants.SCREEN_COL_COUNT - 1, 0);
            ctx.translate(0, -16);
        }
        else {
            ctx.fillStyle = 'darkgray';
            ctx.fillRect(0, 16, 16, Constants.SCREEN_HEIGHT);
        }
    }

    private possiblyPaintArmedTile(ctx: CanvasRenderingContext2D) {
        const armedRow: number = this.armedRow;
        const armedCol: number = this.armedCol;
        if (armedRow > -1 && armedCol > -1) {
            const x: number = armedCol * 16 + 16;
            const y: number = armedRow * 16 + 16;
            ctx.globalAlpha = 0.5;
            this.game.map.tileset.paintTile(ctx, this.selectedTileIndex, x, y);
            ctx.globalAlpha = 1;
        }
    }

    paintScreen() {

        if (this.game) {

            const map: Map = this.game.map;
            const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement;
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

            // Clear needed for translucent parts
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.globalAlpha = 0.5;
            this.paintScreenAbovePart(ctx);
            this.paintScreenRightPart(ctx);
            this.paintScreenBelowPart(ctx);
            this.paintScreenLeftPart(ctx);
            ctx.globalAlpha = 1;

            ctx.translate(16, 16);
            map.currentScreen.paint(ctx);
            map.currentScreen.paintTopLayer(ctx);
            ctx.translate(-16, -16);

            this.possiblyPaintArmedTile(ctx);
        }
    }

    mounted() {

        const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement;
        canvas.addEventListener('mousemove', (e: MouseEvent) => {

            let x: number = e.offsetX;
            let y: number = e.offsetY;

            if (MapEditor.inMainScreen(x, y)) {
                x -= 32;
                y -= 32;
                this.armedRow = Math.floor(y / 32);
                this.armedCol = Math.floor(x / 32);
                console.log('armed tile: ' + this.armedRow, this.armedCol);
                if (this._mouseDown) {
                    this.setArmedTile(null);
                }
            }
            else {
                this.armedRow = this.armedCol = -1;
            }
        });

        canvas.addEventListener('mousedown', (e: MouseEvent) => {
            this._mouseDown = true;
        });
        const mouseUpHandler: EventListener = (e: MouseEvent) => {
            this._mouseDown = false;
        };
        canvas.addEventListener('mouseup', mouseUpHandler);
        canvas.addEventListener('mouseleave', mouseUpHandler);

        canvas.addEventListener('click', this.setArmedTile);

        setInterval(this.paintScreen, 50);

        this.$root.$on('focusCanvas', () => {
            canvas.focus();
        });
    }
}
</script>

<style lang="less" scoped>
.map-editor {

    text-align: center;

    .screen-canvas {
        /* 256x176 + 16-pixel buffer on all sides */
        width: 576px;
        height: 416px;
    }
}
</style>
