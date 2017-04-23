import {createAction} from 'redux-actions';

type ACTION_TYPE = 'temp';

const fooAction = createAction(
    'temp',
    (text: string) => ({ text: text })
);

export {
    ACTION_TYPE,
    fooAction
};
