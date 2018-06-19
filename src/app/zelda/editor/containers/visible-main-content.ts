import { ComponentClass, connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { State } from '../state';
import { currentScreenChanged } from '../actions';
import MainContent from '../main-content';
import { Action } from 'redux-actions';
import { Map } from '../../Map';

const mapStateToProps: MapStateToProps<any, any, State> = (state: State, ownProps?: any): any => {
    return {
        game: state.game,
        map: state.map,
        currentScreenRow: state.currentScreenRow,
        currentScreenCol: state.currentScreenCol
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<Action<Map>>, ownProps?: any): any => {
    return {
        currentScreenChanged: () => {
            dispatch(currentScreenChanged());
        }
    };
};

const VisibleMainContent: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(MainContent);

export default VisibleMainContent;
