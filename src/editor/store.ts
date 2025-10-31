import { Store, createStore } from 'vuex';
import { EditorState } from '@/editor/editor';
import { ZeldaGame } from '@/ZeldaGame';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/Constants';
import { RowColumnPair } from '@/RowColumnPair';

// Initialize the game declared in zelda.ts
const createGame: () => ZeldaGame = () => {
    const parent: HTMLDivElement = document.createElement('div');
    return window.game = new ZeldaGame({
        assetRoot: undefined,
        height: CANVAS_HEIGHT,
        keyRefreshMillis: 300,
        parent: parent,
        targetFps: 60,
        width: CANVAS_WIDTH,
        editMode: true,
    });
};

const store: Store<EditorState> = createStore({
    state: {
        game: createGame(),
        currentScreen: null,
        currentScreenRow: -1,
        currentScreenCol: -1,
        lastModified: 0,
    },
    mutations: {
        setCurrentScreen(state: EditorState, screen: RowColumnPair) {
            state.game.map.setCurrentScreen(screen.row, screen.col);
            state.currentScreen = state.game.map.currentScreen;
            state.currentScreenRow = screen.row;
            state.currentScreenCol = screen.col;
        },
        setCurrentScreenMusic(state: EditorState, music: string | null) {
            if (state.currentScreen) {
                state.currentScreen.music = music;
            }
        },
        setMap(state: EditorState, map: string) {
            const destScreen = { row: state.currentScreenRow, col: state.currentScreenCol };
            const destPos = { row: 0, col: 0 };
            state.game.setMap(map, destScreen, destPos);

            // When moving from a larger map to a smaller one, we may not have been able to preserve
            // the current screen.  In that case setMap() will have ensured the current screen is
            // some valid location
            state.currentScreenRow = state.game.map.currentScreenRow;
            state.currentScreenCol = state.game.map.currentScreenCol;

            state.lastModified = Date.now();
        },
        updateLastModified(state: EditorState) {
            state.lastModified = Date.now();
        },
    },
    actions: {},
    modules: {},
});

export { store };
