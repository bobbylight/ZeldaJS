import {ComponentClass, connect, Dispatch, MapDispatchToProps, MapStateToProps} from 'react-redux';
import {State} from '../state';
import {screenModified} from '../actions';
import MapEditor from '../map-editor';

const mapStateToProps: MapStateToProps<any, any> = (state: State, ownProps?: any): any => {
    return {
        game: state.game,
        selectedTileIndex: state.selectedTileIndex
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<number>, ownProps?: any): any => {
    return {
        onChange: (row: number, col: number) => {
            dispatch(screenModified(row, col));
        }
    };
};

const VisibleMapEditor: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(MapEditor);

export default VisibleMapEditor;
