<template>
    <div class="tile-palette">
        <canvas :style="canvasStyle" :width="width" :height="height"
                aria-label="Tile palette"
                ref="canvas"/>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { TILE_HEIGHT, TILE_WIDTH } from '@/Constants';
import SpriteSheet from 'gtp/lib/gtp/SpriteSheet';
import { Tileset } from '@/Tileset';
import { ZeldaGame } from '@/ZeldaGame';

const props = defineProps<{
    game: ZeldaGame,
    tileset: Tileset,
    selectedTileIndex: number,
}>();

const emit = defineEmits<(e: 'tileSelected', index: number) => void>();

const canvas = ref<HTMLCanvasElement>();
const canvasStyle = ref('');
const armedIndex = ref(0);

const colCount = computed(() => props.tileset.colCount);
const rowCount = computed(() => props.tileset.rowCount);
const width = computed(() => colCount.value * TILE_WIDTH);
const height = computed(() => rowCount.value * TILE_HEIGHT);

function computeIndexFromXY(el: HTMLCanvasElement, x: number, y: number): number {
    const tileWidth = el.clientWidth / colCount.value;
    const tileHeight = el.clientHeight / rowCount.value;
    return Math.floor(y / tileHeight) * colCount.value + Math.floor(x / tileWidth);
}

function repaint() {
    const el = canvas.value;
    const ctx = el?.getContext('2d');
    if (!ctx) return; // Unit tests
    const ss: SpriteSheet = props.game.assets.get(props.tileset.getName());
    ss.gtpImage.draw(ctx, 0, 0);

    ctx.strokeStyle = 'red';
    let row = Math.floor(props.selectedTileIndex / colCount.value);
    let col = props.selectedTileIndex % colCount.value;
    let x = col * TILE_WIDTH;
    let y = row * TILE_HEIGHT;
    ctx.strokeRect(x, y, TILE_WIDTH, TILE_HEIGHT);

    ctx.strokeStyle = 'blue';
    row = Math.floor(armedIndex.value / colCount.value);
    col = armedIndex.value % colCount.value;
    x = col * TILE_WIDTH;
    y = row * TILE_HEIGHT;
    ctx.strokeRect(x, y, TILE_WIDTH, TILE_HEIGHT);
}

function updateCanvasStyle(tileset: Tileset) {
    const canvasWidth = tileset.colCount * TILE_WIDTH * 2;
    const canvasHeight = tileset.rowCount * TILE_HEIGHT * 2;
    canvasStyle.value = `width: ${canvasWidth}px; height: ${canvasHeight}px;`;
}

onMounted(() => {
    const el = canvas.value;
    if (!el) { // Needed to appease eslint
        throw new Error('Canvas element not found!');
    }
    updateCanvasStyle(props.tileset);

    el.addEventListener('click', (e: MouseEvent) => {
        emit('tileSelected', computeIndexFromXY(el, e.offsetX, e.offsetY));
        repaint();
    });

    el.addEventListener('mousemove', (e: MouseEvent) => {
        armedIndex.value = computeIndexFromXY(el, e.offsetX, e.offsetY);
        repaint();
    });

    setTimeout(() => {
        void nextTick(() => {
            repaint();
        });
    }, 300);
});

watch(() => props.tileset, (newTileset) => {
    updateCanvasStyle(newTileset);
    void nextTick(() => {
        repaint();
    });
});
</script>

<style>
.tile-palette {

    text-align: center;

    .tile-palette-canvas {
        width: 320px;
        height: 320px;
    }
}
</style>
