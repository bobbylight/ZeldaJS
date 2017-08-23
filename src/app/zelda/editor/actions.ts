import { Action } from 'redux-actions';
import { ZeldaGame } from '../ZeldaGame';
import { Screen } from '../Screen';
import { Map } from '../Map';

export type ACTION_TYPE = 'SCREEN_MODIFIED' | 'TILE_SELECTED' | 'CURRENT_SCREEN_CHANGED';

export const screenModified: (row: number, col: number) => Action<number> = (row: number, col: number): Action<number> => {
    return {
        type: 'SCREEN_MODIFIED',
        payload: Date.now()
    };
};

export const tileSelected: (index: number) => Action<number> = (index: number): Action<number> => {
    return {
        type: 'TILE_SELECTED',
        payload: index
    };
};

export const currentScreenChanged: (game: ZeldaGame) => Action<Map> = (game: ZeldaGame): Action<Map> => {
    return {
        type: 'CURRENT_SCREEN_CHANGED',
        payload: game.map
    };
};
