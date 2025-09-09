<template>
    <canvas :width="canvasStyleWidth" :height="canvasStyleHeight"
            aria-label="A preview of the map"
            class="map-preview-canvas" ref="canvas"
            @mousemove="updateArmedScreen"
            @mouseleave="clearArmedScreen"
            @click="updateSelectedScreen"/>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { Store, useStore } from 'vuex';
import debounce from 'debounce';
import { SCREEN_COL_COUNT, SCREEN_HEIGHT, SCREEN_ROW_COUNT, SCREEN_WIDTH } from '@/Constants';
import { Map } from '@/Map';
import { ZeldaGame } from '@/ZeldaGame';
import { EditorState } from '@/editor/editor';

const props = defineProps<{
    game: ZeldaGame,
    map: Map,
    lastModified: number,
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const armedScreenRow = ref(-1);
const armedScreenCol = ref(-1);
const debouncedRepaint = ref<(() => void) | null>(null);

const store: Store<EditorState> = useStore();

const currentScreen = computed(() => store.state.currentScreen);

const canvasStyleHeight = computed(() => SCREEN_HEIGHT * SCREEN_ROW_COUNT);
const canvasStyleWidth = computed(() => SCREEN_WIDTH * SCREEN_COL_COUNT);

function clearArmedScreen() {
    armedScreenRow.value = armedScreenCol.value = -1;
    repaint();
}

function repaint() {
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;
    ctx.save();

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, SCREEN_WIDTH * SCREEN_COL_COUNT, SCREEN_HEIGHT * SCREEN_ROW_COUNT);

    const map = props.game.map;
    for (let row = 0; row < map.rowCount; row++) {
        for (let col = 0; col < map.colCount; col++) {
            const screen = map.getScreen(row, col);
            screen.paint(ctx);
            screen.paintTopLayer(ctx);

            const currentScreenRow = store.state.currentScreenRow;
            const currentScreenCol = store.state.currentScreenCol;
            possiblyOutlineScreen(ctx, row, col, currentScreenRow, currentScreenCol, 'red');
            possiblyOutlineScreen(ctx, row, col, armedScreenRow.value, armedScreenCol.value, 'blue');

            ctx.translate(SCREEN_WIDTH, 0);
        }
        ctx.translate(-SCREEN_WIDTH * map.colCount, SCREEN_HEIGHT);
    }

    ctx.restore();
    // console.log('Done repainting');
}

function mouseEventToScreen(e: MouseEvent) {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const el = canvas.value;
    if (!el) { // Never happens
        return { row: 0, col: 0 };
    }
    const canvasWidth = el.clientWidth;
    const canvasHeight = el.clientHeight;

    const virtualScreenWidth = canvasWidth / SCREEN_COL_COUNT;
    const virtualScreenHeight = canvasHeight / SCREEN_ROW_COUNT;

    const row = Math.floor(y / virtualScreenHeight);
    const col = Math.floor(x / virtualScreenWidth);

    return { row, col };
}

function possiblyOutlineScreen(ctx: CanvasRenderingContext2D, row: number, col: number,
    targetRow: number, targetCol: number, style: string) {
    if (row === targetRow && col === targetCol) {
        ctx.strokeStyle = style;
        ctx.lineWidth = 10;
        ctx.strokeRect(0, 0, SCREEN_WIDTH - 10, SCREEN_HEIGHT - 10);
    }
}

function updateArmedScreen(e: MouseEvent) {
    const { row, col } = mouseEventToScreen(e);
    if (row !== armedScreenRow.value || col !== armedScreenCol.value) {
        armedScreenRow.value = row;
        armedScreenCol.value = col;
        repaint();
    }
}

function updateSelectedScreen(e: MouseEvent) {
    const { row, col } = mouseEventToScreen(e);
    store.commit('setCurrentScreen', { row, col });
}

watch(() => props.lastModified, () => {
    repaint();
});

watch(currentScreen, () => {
    debouncedRepaint.value?.();
});

onMounted(() => {
    debouncedRepaint.value = debounce(repaint, 100);
    repaint();
});
</script>

<style>
.map-preview-canvas {
    width: 100%;
    height: 300px;
    cursor: pointer;
}
</style>
