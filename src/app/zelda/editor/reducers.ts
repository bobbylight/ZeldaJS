import { combineReducers, Reducer } from 'redux';
import { Action } from 'redux-actions';
import { State } from './state';
import { ZeldaGame } from '../ZeldaGame';
import { Constants } from '../Constants';
import { Map } from '../Map';

declare let game: ZeldaGame;

// Initialize the game declared in zelda.ts
const parent: HTMLDivElement = document.createElement('div');
(window as any).game = new ZeldaGame({
    assetRoot: undefined,
    height: Constants.CANVAS_HEIGHT,
    keyRefreshMillis: 300,
    parent: parent,
    targetFps: 60,
    width: Constants.CANVAS_WIDTH,
    editMode: true
});

const gameReducer: Reducer<ZeldaGame> = (state: ZeldaGame = (window as any).game, action: Action<any>) => {
    return state;
};

const mapChangedReducer: Reducer<Map> = (state: Map = game.map || null, action: Action<Map>) => {
    if (action.type === 'CURRENT_SCREEN_CHANGED') {
        return action.payload!;
    }
    return state;
};

const currentScreenRowReducer: Reducer<number> = (state: number = 0, action: Action<Map>) => {
    if (action.type === 'CURRENT_SCREEN_CHANGED') {
        return action.payload!.currentScreenRow;
    }
    return state;
};

const currentScreenColReducer: Reducer<number> = (state: number = 0, action: Action<Map>) => {
    if (action.type === 'CURRENT_SCREEN_CHANGED') {
        return action.payload!.currentScreenCol;
    }
    return state;
};

const selectedTileIndexReducer: Reducer<number> = (state: number = 1, action: Action<number>) => {
    if (action.type === 'TILE_SELECTED') {
        console.log(`Tile selected: ${action.payload}`);
        const selectedTileIndex: number = typeof action.payload !== 'undefined' ? action.payload : -1;
        return selectedTileIndex !== -1 ? selectedTileIndex : state;
    }
    return state;
};

const lastModifiedReducer: Reducer<number> = (state: number = Date.now(), action: Action<number>) => {
    if (action.type === 'SCREEN_MODIFIED') {
        return action.payload ? action.payload : state;
    }
    return state;
};

const rootReducer: Reducer<State> = combineReducers<State>({
    game: gameReducer,
    map: mapChangedReducer,
    currentScreenRow: currentScreenRowReducer,
    currentScreenCol: currentScreenColReducer,
    selectedTileIndex: selectedTileIndexReducer,
    lastModified: lastModifiedReducer
});

export default rootReducer;
