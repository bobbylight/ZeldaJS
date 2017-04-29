import {ZeldaGame} from '../ZeldaGame';
import {Map} from '../Map';

export type State = {
    game: ZeldaGame;
    map: Map;
    selectedTileIndex: number;
    lastModified: number;
    currentScreenRow: number;
    currentScreenCol: number;
};
