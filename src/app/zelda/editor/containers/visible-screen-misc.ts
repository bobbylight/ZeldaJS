import { ComponentClass, connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { State } from '../state';
import ScreenMisc, { ScreenMiscProps } from '../screen-misc';
import { Action } from 'redux-actions';

const mapStateToProps: MapStateToProps<any, any, State> = (state: State, ownProps?: any): ScreenMiscProps => {
    console.log('Setting to: ' + (state.map ? state.map.currentScreen : null));
    return {
        screen: state.map ? state.map.currentScreen : null
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<Action<any>>, ownProps?: any): any => {
    return {
        // onTileSelected: (selectedTileIndex: number) => {
        //     dispatch(tileSelected(selectedTileIndex));
        // }
    };
};

const VisibleScreenMisc: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(ScreenMisc);
export default VisibleScreenMisc;
