import {combineReducers, Reducer} from 'redux';
import {handleActions, Action} from 'redux-actions';
import {fooAction} from './actions';
import {State} from './state';
import {ZeldaGame} from '../ZeldaGame';
import {Constants} from '../Constants';

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

const tempReducer: Reducer<string> = (state: string = 'initialValue', action: Action<any>) => {
    return state;
};

const gameReducer: Reducer<ZeldaGame> = (state: ZeldaGame = (<any>window).game, action: Action<any>) => {
    return state;
};

const rootReducer: Reducer<State> = combineReducers<State>({
    temp: tempReducer,
    game: gameReducer
});

export default rootReducer;
