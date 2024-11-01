<template>
    <v-container>

        <v-layout>
            <v-col class="xs8">
                <actionable-panel :title="title">
                    <map-editor :game="game" :selected-tile-index="selectedTileIndex"/>
                </actionable-panel>

                <actionable-panel title="Map Preview" v-if="game">
                    <map-preview :game="game" :map="game.map" :last-modified="$store.state.lastModified"/>
                </actionable-panel>
            </v-col>

            <v-col class="xs4" v-if="$store.state.currentScreen">

                <v-card class="control-group-bottom-margin tabbed-pane-styles" elevation="1">

                    <v-tabs v-model="selectedTab" background-color="primary" dark>

                        <v-tabs-slider/>

                        <v-tab class="editor-tab" href="#tab-1">
                            Tile Palette
                        </v-tab>

                        <v-tab class="editor-tab" href="#tab-2">
                            Events
                        </v-tab>

                        <v-tab class="editor-tab" href="#tab-3">
                            Misc
                        </v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="selectedTab">

                        <v-tab-item key="tilePalette" value="tab-1">
                            <v-card flat outlined>
                                <v-card-text>
                                    <tile-palette :game="game" :tileset="game.map.tileset"
                                                  :selected-tile-index="selectedTileIndex"
                                                  @tileSelected="onTileSelected"/>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                        <v-tab-item key="eventEditor" value="tab-2">
                            <v-card flat outlined>
                                <v-card-text style="padding: 0">
                                    <event-editor :game="game" v-model="$store.state.currentScreen.events"/>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                        <v-tab-item key="screenMisc" value="tab-3">
                            <v-card flat outlined>
                                <v-card-text v-if="game">
                                    <screen-misc :screen="game.map.currentScreen"/>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>

                <actionable-panel title="Enemies" :padded="false">
                    <enemy-selector :game="game" v-model="$store.state.currentScreen.enemyGroup"/>
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

<script lang="ts">
import Vue from 'vue';
import MapEditor from '@/editor/map-editor.vue';
import { ZeldaGame } from '@/ZeldaGame';
import ScreenMisc from '@/editor/screen-misc.vue';
import TilePalette from '@/editor/tile-palette.vue';
import EventEditor from '@/editor/event-editor.vue';
import MapPreview from '@/editor/map-preview.vue';
import ActionablePanel from '@/editor/actionable-panel/actionable-panel.vue';
import CodeViewer from '@/editor/code-viewer.vue';
import EnemySelector from '@/editor/enemy-selector.vue';

export default Vue.extend({

    name: 'MainContent',
    components: {
        EnemySelector,
        ActionablePanel,
        CodeViewer,
        EventEditor,
        MapEditor,
        MapPreview,
        ScreenMisc,
        TilePalette,
    },

    data() {
        return {
            game: null, // ZeldaGame | null
            selectedTileIndex: 1,
            selectedTab: 'tab-1',
        };
    },

    computed: {
        title(): string {
            const curRow: number = this.$store.state.currentScreenRow;
            const curCol: number = this.$store.state.currentScreenCol;
            const rowCount: number = this.$store.state.game.map ? this.$store.state.game.map.rowCount - 1 : 0;
            const colCount: number = this.$store.state.game.map ? this.$store.state.game.map.colCount - 1 : 0;
            return `Screen (${curRow}, ${curCol}) / (${rowCount}, ${colCount})`;
        },
    },

    methods: {
        installKeyHandlers() {
            document.addEventListener('keydown', (e: KeyboardEvent) => {
                let row: number;
                let col: number;

                switch (e.which) {
                    case 37:
                        console.log('left');
                        row = this.$store.state.currentScreenRow;
                        col = this.$store.state.currentScreenCol;
                        if (col > 0) {
                            this.setCurrentScreen(row, col - 1);
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        break;

                    case 38:
                        console.log('up');
                        row = this.$store.state.currentScreenRow;
                        col = this.$store.state.currentScreenCol;
                        if (row > 0) {
                            this.setCurrentScreen(row - 1, col);
                        }
                        e.preventDefault();
                        break;

                    case 39:
                        console.log('right');
                        row = this.$store.state.currentScreenRow;
                        col = this.$store.state.currentScreenCol;
                        if (col < this.game!.map.colCount - 1) {
                            this.setCurrentScreen(row, col + 1);
                        }
                        e.preventDefault();
                        break;

                    case 40:
                        console.log('down');
                        row = this.$store.state.currentScreenRow;
                        col = this.$store.state.currentScreenCol;
                        if (row < this.game!.map.rowCount - 1) {
                            this.setCurrentScreen(row + 1, col);
                        }
                        e.preventDefault();
                        break;
                }
            });
        },

        onTileSelected(index: number) {
            (console as any).log('selected tile in palette: ' + index);
            this.selectedTileIndex = index;
        },

        setCurrentScreen(row: number, col: number) {
            this.$store.commit('setCurrentScreen', { row, col });
            // this.currentScreenChanged();
        },
    },

    mounted() {
        const game: ZeldaGame = (window as any).game;

        // This mimics what is loaded in LoadingState.
        // TODO: Share this code?
        game.assets.addImage('title', '/res/title.png');
        game.assets.addSpriteSheet('font', '/res/font.png', 9, 7, 0, 0);
        game.assets.addSpriteSheet('link', 'res/link.png', 16, 16, 1, 1, true);
        game.assets.addSpriteSheet('overworld', 'res/overworld.png', 16, 16);
        game.assets.addSpriteSheet('labyrinths', 'res/level1.png', 16, 16);
        game.assets.addImage('hud', 'res/hud.png');
        game.assets.addJson('overworldData', 'res/data/overworld.json');
        game.assets.addJson('level1Data', 'res/data/level1.json');

        game.assets.onLoad(() => {
            this.$nextTick(() => {
                game.startNewGame();
                this.game = game;

                this.setCurrentScreen(7, 6);
            });

            this.installKeyHandlers();
        //
        // this.setState({ loading: false,
        //     rowCount: game.map.rowCount - 1, colCount: game.map.colCount - 1,
        //     selectedTileIndex: 1 });
        });
    },
});
</script>

<style lang="scss" scoped>
.elevation-1.tabbed-pane-styles {
    box-shadow: none !important;
}

.editor-tab {
    // TODO: Match this with that used in the tabbed pane in actionable-panel
    font-size: 1rem;
    /*letter-spacing: normal;*/
    text-transform: none;
}
</style>
