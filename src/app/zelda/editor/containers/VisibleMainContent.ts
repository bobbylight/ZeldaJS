import { ComponentClass, connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { State } from '../state';
import { currentScreenChanged } from '../actions';
import MainContent from '../main-content';

const mapStateToProps: MapStateToProps<any, any> = (state: State, ownProps?: any): any => {
    return {
        game: state.game,
        currentScreenRow: state.currentScreenRow,
        currentScreenCol: state.currentScreenCol
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<number>, ownProps?: any): any => {
    return {
        currentScreenChanged: () => {
            dispatch(currentScreenChanged());
        }
    };
};

const VisibleMainContent: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(MainContent);

export default VisibleMainContent;
