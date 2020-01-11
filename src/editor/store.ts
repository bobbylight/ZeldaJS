import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { EditorState } from '@/editor/editor';
import { ZeldaGame } from '@/ZeldaGame';
import { Constants } from '@/Constants';
import { Position } from '@/Position';

Vue.use(Vuex);

interface Point {
    row: number;
    col: number;
}

// Initialize the game declared in zelda.ts
const createGame: () => ZeldaGame = () => {
    const parent: HTMLDivElement = document.createElement('div');
    return (window as any).game = new ZeldaGame({
        assetRoot: undefined,
        height: Constants.CANVAS_HEIGHT,
        keyRefreshMillis: 300,
        parent: parent,
        targetFps: 60,
        width: Constants.CANVAS_WIDTH,
        editMode: true
    });
};

const store: Store<EditorState> = new Store({
    state: {
        game: createGame(),
        currentScreen: null,
        currentScreenRow: -1,
        currentScreenCol: -1,
        lastModified: 0
    },
    mutations: {
        setCurrentScreen(state: EditorState, screen: Point) {
            state.game.map.setCurrentScreen(screen.row, screen.col);
            state.currentScreen = state.game.map.currentScreen;
            state.currentScreenRow = screen.row;
            state.currentScreenCol = screen.col;
        },
        setCurrentScreenMusic(state: EditorState, music: string | null) {
            state.currentScreen.music = music;
        },
        setMap(state: EditorState, map: string) {
            const destScreen: Position = new Position(state.game.map.currentScreenRow, state.game.map.currentScreenCol);
            const destPos: Position = new Position(state.currentScreenRow, state.currentScreenCol);
            state.game.setMap(map, destScreen, destPos);
            state.lastModified = Date.now();
        },
        updateLastModified(state: EditorState) {
            state.lastModified = Date.now();
        }
    },
    actions: {},
    modules: {}
});

export default store;
