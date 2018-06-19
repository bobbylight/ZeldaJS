import { ComponentClass, connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { State } from '../state';
import EventEditor from '../event-editor';
import { Action } from 'redux-actions';

const mapStateToProps: MapStateToProps<any, any, State> = (state: State, ownProps?: any): any => {

    return {
        game: state.game,
        events: state.game.map.currentScreen.events || []
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<Action<any>>, ownProps?: any): any => {
    return {
    };
};

const VisibleEventEditor: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(EventEditor);
export default VisibleEventEditor;
