import { ComponentClass, connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { State } from '../state';
import EnemySelector from '../enemy-selector';
import { EnemyGroup } from '../../EnemyGroup';

const mapStateToProps: MapStateToProps<any, any, State> = (state: State, ownProps?: any): any => {

    return {
        game: state.game,
        enemyGroup: state.game.map.currentScreen.enemyGroup || new EnemyGroup()
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<number>, ownProps?: any): any => {
    return {
    };
};

const VisibleEnemySelector: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(EnemySelector);
export default VisibleEnemySelector;
