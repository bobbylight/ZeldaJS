import { ComponentClass } from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import MapPreview, { MapPreviewProps } from '../map-preview';
import { State } from '../state';

const mapStateToProps: MapStateToProps<any, any, State> = (state: State, ownProps?: any): MapPreviewProps => {
    return {
        game: state.game,
        map: state.map,
        lastModified: state.lastModified
    };
};

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: Dispatch<any>, ownProps?: any): any => {
    return {
    };
};

const VisibleMapPreview: ComponentClass<any> = connect(mapStateToProps, mapDispatchToProps)(MapPreview);

export default VisibleMapPreview;
