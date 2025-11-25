<template>
    <v-container>
        <v-layout>
            <v-col class="xs8">
                <actionable-panel :title="title">
                    <div v-if="game">
                        <map-editor
                            :game="game"
                            :selected-tile-index="selectedTileIndex"
                        />
                    </div>
                </actionable-panel>

                <actionable-panel title="Map Preview">
                    <div v-if="game">
                        <map-preview
                            :game="game"
                            :map="game.map"
                            :last-modified="store.state.lastModified"
                        />
                    </div>
                </actionable-panel>
            </v-col>

            <v-col
                v-if="game && store.state.currentScreen"
                class="xs4"
            >
                <v-card
                    class="control-group-bottom-margin tabbed-pane-styles"
                    outlined
                >
                    <v-tabs
                        v-model="selectedTab"
                        bg-color="primary"
                    >
                        <v-tab
                            class="editor-tab"
                            value="tab-1"
                        >
                            Tile Palette
                        </v-tab>

                        <v-tab
                            class="editor-tab"
                            value="tab-2"
                        >
                            Events
                        </v-tab>

                        <v-tab
                            class="editor-tab"
                            value="tab-3"
                        >
                            Misc
                        </v-tab>
                    </v-tabs>

                    <v-tabs-window v-model="selectedTab">
                        <v-tabs-window-item
                            key="tilePalette"
                            value="tab-1"
                        >
                            <v-card
                                flat
                                outlined
                            >
                                <v-card-text v-if="game">
                                    <tile-palette
                                        :game="game"
                                        :tileset="game.map.getTileset()"
                                        :selected-tile-index="selectedTileIndex"
                                        @tile-selected="onTileSelected"
                                    />
                                </v-card-text>
                            </v-card>
                        </v-tabs-window-item>

                        <v-tabs-window-item
                            key="eventEditor"
                            value="tab-2"
                        >
                            <v-card
                                flat
                                outlined
                            >
                                <v-card-text style="padding: 0">
                                    <event-editor
                                        v-model="store.state.currentScreen.events"
                                        :game="game"
                                    />
                                </v-card-text>
                            </v-card>
                        </v-tabs-window-item>

                        <v-tabs-window-item
                            key="screenMisc"
                            value="tab-3"
                        >
                            <v-card
                                flat
                                outlined
                            >
                                <v-card-text v-if="game">
                                    <screen-misc />
                                </v-card-text>
                            </v-card>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </v-card>

                <actionable-panel
                    title="Enemies"
                    :padded="false"
                >
                    <enemy-selector
                        v-model="store.state.currentScreen.enemyGroup"
                        :game="game"
                        @change="handleEnemyGroupChanged"
                    />
                </actionable-panel>
            </v-col>
        </v-layout>

        <v-layout>
            <v-col class="xs12">
                <actionable-panel title="Map JSON">
                    <code-viewer :game="game" />
                </actionable-panel>
            </v-col>
        </v-layout>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Store, useStore } from 'vuex';
import { ImageAtlasInfo } from 'gtp';
import MapEditor from '@/editor/map-editor.vue';
import { ZeldaGame } from '@/ZeldaGame';
import ScreenMisc from '@/editor/screen-misc.vue';
import TilePalette from '@/editor/tile-palette.vue';
import EventEditor from '@/editor/event-editor.vue';
import MapPreview from '@/editor/map-preview.vue';
import ActionablePanel from '@/editor/actionable-panel/actionable-panel.vue';
import CodeViewer from '@/editor/code-viewer.vue';
import EnemySelector from '@/editor/enemy-selector.vue';
import { EditorState } from '@/editor/editor';

const store: Store<EditorState> = useStore();

const game = ref<ZeldaGame>();
const selectedTileIndex = ref(1);
const selectedTab = ref('tab-1');

const title = computed(() => {
    if (!game.value) {
        return 'Loading...';
    }
    const curRow: number = store.state.currentScreenRow;
    const curCol: number = store.state.currentScreenCol;
    const rowCount: number = game.value.map.rowCount - 1;
    const colCount: number = game.value.map.colCount - 1;
    return `Screen (${curRow}, ${curCol}) / (${rowCount}, ${colCount})`;
});

function onTileSelected(index: number) {
    selectedTileIndex.value = index;
}

function setCurrentScreen(row: number, col: number) {
    store.commit('setCurrentScreen', { row, col });
}

function handleEnemyGroupChanged() {
    if (game.value) { // Should always be true
        store.state.currentScreen?.reload(game.value);
    }
}

function installKeyHandlers() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        let row: number;
        let col: number;
        if (!game.value) return;

        /* eslint-disable @typescript-eslint/no-deprecated */
        switch (e.which) {
            /* eslint-enable @typescript-eslint/no-deprecated */
            case 37: // left
                row = store.state.currentScreenRow;
                col = store.state.currentScreenCol;
                if (col > 0) {
                    setCurrentScreen(row, col - 1);
                }
                e.preventDefault();
                e.stopPropagation();
                break;
            case 38: // up
                row = store.state.currentScreenRow;
                col = store.state.currentScreenCol;
                if (row > 0) {
                    setCurrentScreen(row - 1, col);
                }
                e.preventDefault();
                break;
            case 39: // right
                row = store.state.currentScreenRow;
                col = store.state.currentScreenCol;
                if (col < game.value.map.colCount - 1) {
                    setCurrentScreen(row, col + 1);
                }
                e.preventDefault();
                break;
            case 40: // down
                row = store.state.currentScreenRow;
                col = store.state.currentScreenCol;
                if (row < game.value.map.rowCount - 1) {
                    setCurrentScreen(row + 1, col);
                }
                e.preventDefault();
                break;
        }
    });
}

onMounted(() => {
    // TODO: Share resource loading with LoadingState.ts
    const npcAtlasInfo: ImageAtlasInfo = {
        prefix: 'npcs.',
        firstPixelIsTranslucent: true,
        images: [
            { id: 'oldMan1', x: 1, y: 11, w: 16, h: 16 },
            { id: 'oldMan2', x: 18, y: 11, w: 16, h: 16 },
            { id: 'merchant', x: 126, y: 11, w: 16, h: 16 },
        ],
    };
    const treasureAtlasInfo: ImageAtlasInfo = {
        prefix: 'treasures.',
        firstPixelIsTranslucent: true,
        images: [

            { id: 'fullHeart', x: 0, y: 0, s: 8 },
            { id: 'halfHeart', x: 8, y: 0, s: 8 },
            { id: 'emptyHeart', x: 16, y: 0, s: 8 },
            { id: 'blueHeart', x: 0, y: 8, s: 8 },

            { id: 'yellowRupee', x: 72, y: 0, w: 8, h: 16 },
            { id: 'blueRupee', x: 72, y: 16, w: 8, h: 16 },

            { id: 'bomb', x: 136, y: 0, w: 8, h: 14 },
        ],
    };

    const g: ZeldaGame = store.state.game;

    g.assets.addImage('title', '/res/title.png');
    g.assets.addSpriteSheet('font', '/res/font.png', 9, 7, 0, 0);
    g.assets.addSpriteSheet('link', 'res/link.png', 16, 16, 1, 1, true);
    g.assets.addSpriteSheet('enemies', 'res/enemies.png', 16, 16, 1, 1, true);
    g.assets.addSpriteSheet('overworld', 'res/overworld.png', 16, 16);
    g.assets.addSpriteSheet('labyrinths', 'res/level1.png', 16, 16);
    g.assets.addImageAtlasContents('treaureAtlas', 'res/treasures.png', treasureAtlasInfo);
    g.assets.addImageAtlasContents('npcAtlas', 'res/npcs.png', npcAtlasInfo);
    g.assets.addImage('hud', 'res/hud.png');
    void g.assets.addJson('overworldData', 'res/data/overworld.json');
    void g.assets.addJson('level1Data', 'res/data/level1.json');

    g.assets.onLoad(() => {
        game.value = g;
        g.startNewGame();
        setCurrentScreen(7, 6);
        installKeyHandlers();
    });
});
</script>

<style scoped>
.elevation-1.tabbed-pane-styles {
    box-shadow: none !important;
}

.editor-tab {
    /* TODO: Match this with that used in the tabbed pane in actionable-panel */
    font-size: 1rem;
    /*letter-spacing: normal;*/
    text-transform: none;
}
</style>
