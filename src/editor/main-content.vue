<template>
    <v-container>

        <v-layout>
            <v-col class="xs8">
                <actionable-panel :title="title">
                    <map-editor :game="game" :selected-tile-index="selectedTileIndex"/>
                </actionable-panel>

                <actionable-panel title="Map Preview" v-if="game">
                    <map-preview :game="game" :map="game.map" :last-modified="store.state.lastModified"/>
                </actionable-panel>
            </v-col>

            <v-col class="xs4" v-if="game && store.state.currentScreen">

                <v-card class="control-group-bottom-margin tabbed-pane-styles" outlined>

                    <v-tabs v-model="selectedTab" bg-color="primary">

                        <v-tab class="editor-tab" value="tab-1">
                            Tile Palette
                        </v-tab>

                        <v-tab class="editor-tab" value="tab-2">
                            Events
                        </v-tab>

                        <v-tab class="editor-tab" value="tab-3">
                            Misc
                        </v-tab>
                    </v-tabs>

                    <v-tabs-window v-model="selectedTab">

                        <v-tabs-window-item key="tilePalette" value="tab-1">
                            <v-card flat outlined>
                                <v-card-text>
                                    <tile-palette :game="game" :tileset="game.map.tileset"
                                                  :selected-tile-index="selectedTileIndex"
                                                  @tileSelected="onTileSelected"/>
                                </v-card-text>
                            </v-card>
                        </v-tabs-window-item>

                        <v-tabs-window-item key="eventEditor" value="tab-2">
                            <v-card flat outlined>
                                <v-card-text style="padding: 0">
                                    <event-editor :game="game" v-model="store.state.currentScreen.events"/>
                                </v-card-text>
                            </v-card>
                        </v-tabs-window-item>

                        <v-tabs-window-item key="screenMisc" value="tab-3">
                            <v-card flat outlined>
                                <v-card-text v-if="game">
                                    <screen-misc :screen="game.map.currentScreen"/>
                                </v-card-text>
                            </v-card>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </v-card>

                <actionable-panel title="Enemies" :padded="false">
                    <enemy-selector :game="game" v-model="store.state.currentScreen.enemyGroup"/>
                </actionable-panel>
            </v-col>
        </v-layout>

        <v-layout>
            <v-col class="xs12">

                <actionable-panel title="Map JSON">
                    <code-viewer :game="game"/>
                </actionable-panel>
            </v-col>
        </v-layout>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import MapEditor from '@/editor/map-editor.vue';
import { ZeldaGame } from '@/ZeldaGame';
import ScreenMisc from '@/editor/screen-misc.vue';
import TilePalette from '@/editor/tile-palette.vue';
import EventEditor from '@/editor/event-editor.vue';
import MapPreview from '@/editor/map-preview.vue';
import ActionablePanel from '@/editor/actionable-panel/actionable-panel.vue';
import CodeViewer from '@/editor/code-viewer.vue';
import EnemySelector from '@/editor/enemy-selector.vue';

const store = useStore();

const game = ref<ZeldaGame | null>(null);
const selectedTileIndex = ref(1);
const selectedTab = ref('tab-1');

const title = computed(() => {
    const curRow: number = store.state.currentScreenRow;
    const curCol: number = store.state.currentScreenCol;
    const rowCount: number = store.state.game.map ? store.state.game.map.rowCount - 1 : 0;
    const colCount: number = store.state.game.map ? store.state.game.map.colCount - 1 : 0;
    return `Screen (${curRow}, ${curCol}) / (${rowCount}, ${colCount})`;
});

function onTileSelected(index: number) {
    (console as any).log('selected tile in palette: ' + index);
    selectedTileIndex.value = index;
}

function setCurrentScreen(row: number, col: number) {
    store.commit('setCurrentScreen', { row, col });
}

function installKeyHandlers() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        let row: number;
        let col: number;

        switch (e.which) {
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
                if (col < game.value!.map.colCount - 1) {
                    setCurrentScreen(row, col + 1);
                }
                e.preventDefault();
                break;
            case 40: // down
                row = store.state.currentScreenRow;
                col = store.state.currentScreenCol;
                if (row < game.value!.map.rowCount - 1) {
                    setCurrentScreen(row + 1, col);
                }
                e.preventDefault();
                break;
        }
    });
}

onMounted(() => {
    const g: ZeldaGame = store.state.game;

    g.assets.addImage('title', '/res/title.png');
    g.assets.addSpriteSheet('font', '/res/font.png', 9, 7, 0, 0);
    g.assets.addSpriteSheet('link', 'res/link.png', 16, 16, 1, 1, true);
    g.assets.addSpriteSheet('overworld', 'res/overworld.png', 16, 16);
    g.assets.addSpriteSheet('labyrinths', 'res/level1.png', 16, 16);
    g.assets.addImage('hud', 'res/hud.png');
    g.assets.addJson('overworldData', 'res/data/overworld.json');
    g.assets.addJson('level1Data', 'res/data/level1.json');

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
