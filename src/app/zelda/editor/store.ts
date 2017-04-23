import {createStore, StoreEnhancer, Store} from 'redux';
import rootReducer from './reducers';
import {State} from './state';
import {Constants} from '../Constants';
import {ZeldaGame} from '../ZeldaGame';

const configureStore: () => Store<State> = (): Store<State> => {

    const enhancer: StoreEnhancer<State> | undefined = undefined;

    const store: Store<State> = createStore(rootReducer, enhancer);

    //enableHotLoader(store);
    return store;
};

export default configureStore;
