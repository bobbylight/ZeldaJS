import {combineReducers, Reducer} from 'redux';
import {handleActions, Action} from 'redux-actions';
import {ACTION_TYPE} from './actions';
import {State} from './state';
import {ZeldaGame} from '../ZeldaGame';
import {Constants} from '../Constants';
import {Map} from '../Map';

// Initialize the game declared in zelda.ts
// TODO: Do game initialization in a service?
let parent: HTMLDivElement = document.createElement('div');
(<any>window).game = new ZeldaGame({
    assetRoot: undefined,
    height: Constants.CANVAS_HEIGHT,
    keyRefreshMillis: 300,
    parent: parent,
    targetFps: 60,
    width: Constants.CANVAS_WIDTH
});

const gameReducer: Reducer<ZeldaGame> = (state: ZeldaGame = (<any>window).game, action: Action<any>) => {
    return state;
};

const mapChangedReducer: Reducer<Map | null> = (state: Map | null = null, action: Action<Map>) => {
    return state;
};

const selectedTileIndexReducer: Reducer<number> = (state: number = 1, action: Action<number>) => {
    if (action.type === 'TILE_SELECTED') {
        return action.payload ? action.payload : state;
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
    selectedTileIndex: selectedTileIndexReducer,
    lastModified: lastModifiedReducer
});

export default rootReducer;
