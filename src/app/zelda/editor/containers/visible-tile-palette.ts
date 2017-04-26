import {ComponentClass, connect, Dispatch, MapDispatchToProps, MapStateToProps} from 'react-redux';
import {State} from '../state';
import {tileSelected} from '../actions';
import TilePalette from '../tile-palette';

const mapStateToProps: MapStateToProps<any, any> = (state: State, ownProps?: any): any => {
    return {
        game: state.game,
        selectedTileIndex: state.selectedTileIndex
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<number>, ownProps?: any): any => {
    return {
        onTileSelected: (selectedTileIndex: number) => {
            dispatch(tileSelected(selectedTileIndex));
        }
    };
};

const VisibleTilePalette: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(TilePalette);

export default VisibleTilePalette;
