import {ComponentClass, connect, Dispatch, MapDispatchToProps, MapStateToProps} from 'react-redux';
import MapPreview, {MapPreviewProps} from '../map-preview';
import {State} from '../state';

const mapStateToProps: MapStateToProps<any, any> = (state: State, ownProps?: any): MapPreviewProps => {
    return {
        game: state.game,
        lastModified: state.lastModified
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<any>, ownProps?: any): any => {
    return {
    };
};

const VisibleMapPreview: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(MapPreview);

export default VisibleMapPreview;
