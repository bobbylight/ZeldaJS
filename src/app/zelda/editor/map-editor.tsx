import * as React from 'react';

interface MapEditorProps {

}

interface MapEditorState {

}

export default class MapEditor extends React.Component<MapEditorProps, MapEditorState> {

    state: MapEditorState = {};

    render() {
        return (

            <div className="map-editor">

                {/* 256x176 + 16-pixel buffer on all sides */}
                <canvas className="screen-canvas" width="288" height="208"></canvas>

            </div>
        );
    }
}
