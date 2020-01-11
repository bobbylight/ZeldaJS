<template>
    <div class="tile-palette">
        <canvas class="tile-palette-canvas" :width="width" :height="height"
                ref="canvas"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ZeldaGame } from '@/ZeldaGame';
import SpriteSheet from 'gtp/lib/gtp/SpriteSheet';
import { Constants } from '@/Constants';
import { Prop } from 'vue-property-decorator';

interface TilePaletteState {
    armedIndex: number;
    repaintHandle: number;
}

/**
 * A component that allows the user to select a tile to paint onto the current screen.
 */
@Component
export default class TilePalette extends Vue {

    @Prop({ required: true })
    game: ZeldaGame;

    @Prop({ required: true })
    tilesetName: string;

    @Prop({ required: true })
    selectedTileIndex: number;

    armedIndex: number = 0;

    private get colCount(): number {
        return this.game ? this.game.map.tileset.colCount : 0;
    }

    private _computeIndexFromXY(x: number, y: number): number {
//console.log('--- ' + x + ', ' + y);
//console.log('--- --- row/col === ' + Math.floor(y / 32) + ', ' + Math.floor(x / 32));
        const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement;
        const colCount: number = this.colCount;
        const tileWidth: number = canvas.clientWidth / colCount;
        const tileHeight: number = canvas.clientHeight / this.rowCount;
        (console as any).log('---> ' + colCount + ', ' + tileWidth + ', ' + tileHeight);
        return Math.floor(y / tileHeight) * colCount + Math.floor(x / tileWidth);
    }

    get height(): number {
        return this.rowCount * Constants.TILE_HEIGHT;
    }

    repaint() {

        if (!this.game) {
            return;
        }

        const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement;
        const tilesetName: string = this.tilesetName;
        const colCount: number = this.colCount;

        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        const ss: SpriteSheet = this.game.assets.get(tilesetName);
        if (!ss) {
            return;
        }
        ss.gtpImage.draw(ctx, 0, 0);

        ctx.strokeStyle = 'red';
        let row: number = Math.floor(this.selectedTileIndex / colCount);
        let col: number = this.selectedTileIndex % colCount;
        let x: number = col * 16;
        let y: number = row * 16;
        ctx.strokeRect(x, y, 16, 16);

        ctx.strokeStyle = 'blue';
        row = Math.floor(this.armedIndex / colCount);
        col = this.armedIndex % colCount;
        x = col * 16;
        y = row * 16;
        ctx.strokeRect(x, y, 16, 16);
    }

    mounted() {

        const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement;

        canvas.addEventListener('click', (e: MouseEvent) => {
            this.$emit('tileSelected', this._computeIndexFromXY(e.offsetX, e.offsetY));
            // Even though this updates our props, we must re-render our canvas manually
            this.repaint();
        });

        canvas.addEventListener('mousemove', (e: MouseEvent) => {
            this.armedIndex = this._computeIndexFromXY(e.offsetX, e.offsetY);
            this.repaint();
        });

        // Do an initial painting
        setTimeout(() => {
            this.$nextTick(() => {
                this.repaint();
            });
        }, 300);
    }

    private get rowCount(): number {
        return this.game ? this.game.map.tileset.rowCount : 0;
    }

    get width(): number {
        return this.colCount * Constants.TILE_WIDTH;
    }
}
</script>

<style lang="less">
.tile-palette {

    text-align: center;

    .tile-palette-canvas {
        width: 320px;
        height: 320px;
    }
}
</style>
