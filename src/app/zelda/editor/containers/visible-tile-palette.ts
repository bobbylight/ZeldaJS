import { ComponentClass } from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from '../state';
import { tileSelected } from '../actions';
import TilePalette from '../tile-palette';
import { Action } from 'redux-actions';

const mapStateToProps: MapStateToProps<any, any, State> = (state: State, ownProps?: any): any => {
    return {
        game: state.game,
        tilesetName: state.game ? state.game.map.getTilesetName() : null,
        selectedTileIndex: state.selectedTileIndex
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<Action<any>>, ownProps?: any): any => {
    return {
        onTileSelected: (selectedTileIndex: number) => {
            dispatch(tileSelected(selectedTileIndex));
        }
    };
};

const VisibleTilePalette: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(TilePalette);

export default VisibleTilePalette;
