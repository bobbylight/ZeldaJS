import { ComponentClass, connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { State } from '../state';
import { currentScreenChanged } from '../actions';
import ToolBar from '../toolbar';
import { ZeldaGame } from '../../ZeldaGame';
import { Position } from '../../Position';

const mapStateToProps: MapStateToProps<any, any, State> = (state: State, ownProps?: any): any => {
    return {
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<number>, ownProps?: any): any => {
    return {
        currentScreenChanged: (mapName: string) => {

            // TODO: Need an "official" way to fetch the game
            const game: ZeldaGame = (window as any).game;

            const curScreenRow: number = game.map.currentScreenRow;
            const curScreenCol: number = game.map.currentScreenCol;
            const screen: Position = new Position(curScreenRow, curScreenCol);
            const pos: Position = new Position();

            game.setMap(mapName, screen, pos);
            dispatch(currentScreenChanged());
        }
    };
};

const VisibleToolBar: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(ToolBar);

export default VisibleToolBar;
