import {createAction, Action} from 'redux-actions';

export type ACTION_TYPE = 'SCREEN_MODIFIED' | 'TILE_SELECTED';

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
