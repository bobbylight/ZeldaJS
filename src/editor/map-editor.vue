<template>
    <div class="map-editor">

        <!-- 256x176 + 16-pixel buffer on all sides -->
        <canvas class="screen-canvas" width="288" height="208"
                aria-label="The current screen editor"
                ref="canvas"/>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import debounce from 'debounce';
import { SCREEN_COL_COUNT, SCREEN_HEIGHT, SCREEN_ROW_COUNT, SCREEN_WIDTH } from '@/Constants';
import { ZeldaGame } from '@/ZeldaGame';

const props = defineProps<{
    game: ZeldaGame,
    selectedTileIndex: number,
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const armedRow = ref(0);
const armedCol = ref(0);
const mouseDown = ref(false);
const store = useStore();

function inMainScreen(x: number, y: number) {
    return x >= 32 && x < SCREEN_WIDTH * 2 + 32 &&
        y >= 32 && y < SCREEN_HEIGHT * 2 + 32;
}

function mapChanged(e: MouseEvent | null) {
    const screen = props.game.map.currentScreen;
    const selectedTileIndex = props.selectedTileIndex;
    screen.setTile(armedRow.value, armedCol.value, selectedTileIndex);
    updateLastModified();
}

function paintScreenAbovePart(ctx: CanvasRenderingContext2D) {
    const map = props.game.map;
    if (map.currentScreenRow > 0) {
        ctx.translate(16, 0);
        const screen = map.getScreen(map.currentScreenRow - 1, map.currentScreenCol);
        screen.paintRow(ctx, SCREEN_ROW_COUNT - 1, 0);
        ctx.translate(-16, 0);
    }
    else {
        ctx.fillStyle = 'darkgray';
        ctx.fillRect(16, 0, SCREEN_WIDTH, 16);
    }
}

function paintScreenRightPart(ctx: CanvasRenderingContext2D) {
    const map = props.game.map;
    if (map.currentScreenCol < map.colCount - 1) {
        ctx.translate(0, 16);
        const screen = map.getScreen(map.currentScreenRow, map.currentScreenCol + 1);
        screen.paintCol(ctx, 0, SCREEN_WIDTH + 16);
        ctx.translate(0, -16);
    }
    else {
        ctx.fillStyle = 'darkgray';
        const x = SCREEN_WIDTH + 16;
        ctx.fillRect(x, 16, 16, SCREEN_HEIGHT);
    }
}

function paintScreenBelowPart(ctx: CanvasRenderingContext2D) {
    const map = props.game.map;
    if (map.currentScreenRow < map.rowCount - 1) {
        ctx.translate(16, 0);
        const screen = map.getScreen(map.currentScreenRow + 1, map.currentScreenCol);
        screen.paintRow(ctx, 0, SCREEN_HEIGHT + 16);
        ctx.translate(-16, 0);
    }
    else {
        ctx.fillStyle = 'darkgray';
        const y = SCREEN_HEIGHT + 16;
        ctx.fillRect(16, y, SCREEN_WIDTH, 16);
    }
}

function paintScreenLeftPart(ctx: CanvasRenderingContext2D) {
    const map = props.game.map;
    if (map.currentScreenCol > 0) {
        ctx.translate(0, 16);
        const screen = map.getScreen(map.currentScreenRow, map.currentScreenCol - 1);
        screen.paintCol(ctx, SCREEN_COL_COUNT - 1, 0);
        ctx.translate(0, -16);
    }
    else {
        ctx.fillStyle = 'darkgray';
        ctx.fillRect(0, 16, 16, SCREEN_HEIGHT);
    }
}

function possiblyPaintArmedTile(ctx: CanvasRenderingContext2D) {
    if (armedRow.value > -1 && armedCol.value > -1) {
        const x = armedCol.value * 16 + 16;
        const y = armedRow.value * 16 + 16;
        ctx.globalAlpha = 0.5;
        props.game.map.getTileset().paintTile(ctx, props.selectedTileIndex, x, y);
        ctx.globalAlpha = 1;
    }
}

function paintScreen() {
    const ctx = canvas.value?.getContext('2d');
    if (ctx) {
        const map = props.game.map;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.globalAlpha = 0.5;
        paintScreenAbovePart(ctx);
        paintScreenRightPart(ctx);
        paintScreenBelowPart(ctx);
        paintScreenLeftPart(ctx);
        ctx.globalAlpha = 1;

        ctx.translate(16, 16);
        map.currentScreen.paint(ctx);
        map.currentScreen.paintTopLayer(ctx);
        ctx.translate(-16, -16);

        possiblyPaintArmedTile(ctx);
    }
}

const updateLastModified = debounce(() => {
    store.commit('updateLastModified');
}, 100);

onMounted(() => {
    const el = canvas.value;
    if (!el) { // Never happens, needed for eslint
        throw new Error('Canvas element not found!');
    }

    el.addEventListener('mousemove', (e: MouseEvent) => {
        let x = e.offsetX;
        let y = e.offsetY;

        if (inMainScreen(x, y)) {
            x -= 32;
            y -= 32;
            armedRow.value = Math.floor(y / 32);
            armedCol.value = Math.floor(x / 32);
            if (mouseDown.value) {
                mapChanged(null);
            }
        }
        else {
            armedRow.value = armedCol.value = -1;
        }
    });

    el.addEventListener('mousedown', () => {
        mouseDown.value = true;
    });
    const mouseUpHandler = () => {
        mouseDown.value = false;
    };
    el.addEventListener('mouseup', mouseUpHandler);
    el.addEventListener('mouseleave', mouseUpHandler);

    el.addEventListener('click', mapChanged);

    setInterval(paintScreen, 50);
});
</script>

<style scoped>
.map-editor {
    text-align: center;

    .screen-canvas {
        /* 256x176 + 16-pixel buffer on all sides */
        width: 576px;
        height: 416px;
    }
}
</style>
