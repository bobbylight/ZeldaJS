import {createAction, Action} from 'redux-actions';
import {Map} from '../Map';
//import {Action} from 'redux';

export type ACTION_TYPE = 'temp' | 'MAP_CHANGED';

export function mapChanged(map: Map): Action<Map> {
    return {
        type: 'MAP_CHANGED',
        payload: map
    }
}
