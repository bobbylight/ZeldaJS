import {ComponentClass, connect, Dispatch, MapDispatchToProps, MapStateToProps} from 'react-redux';
import {State} from '../state';
import EventTable from '../event-editor';

const mapStateToProps: MapStateToProps<any, any> = (state: State, ownProps?: any): any => {

    return {
        game: state.game,
        events: state.game.map.currentScreen.events || []
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<number>, ownProps?: any): any => {
    return {
    };
};

const VisibleEventEditor: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(EventTable);
export default VisibleEventEditor;
