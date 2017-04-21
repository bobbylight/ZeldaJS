import * as React from 'react';
import MapEditor from './map-editor';

interface MainContentProps {

}

interface MainContentState {

}

export default class MainContent extends React.Component<MainContentProps, MainContentState> {

    state: MainContentState = {};

    render() {
        return (

            <div className="container">

                <div className="row">

                    <div className="col-md-8">

                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Screen ({{vm.getCurrentScreenRow()}}, {{vm.getCurrentScreenCol()}}) / ({{vm.rowCount}}, {{vm.colCount}})</h3>
                            </div>
                            <div className="panel-body">
                                <MapEditor game="vm.game" selected-tile-index="vm.state.selectedTileIndex"></MapEditor>
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Map Preview</h3>
                            </div>
                            <div className="panel-body">
                                <map-preview game="vm.game"></map-preview>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">

                        <uib-tabset active="activeFoo" className="panel panel-default">
                            <uib-tab index="0" heading="Tile Palette">

                                {/*<div className="panel panel-default">*/}
                                {/*<div className="panel-heading">*/}
                                {/*<h3 className="panel-title">Tile Palette</h3>*/}
                                {/*</div>*/}
                                <div className="panel-body">
                                    <tile-palette selected-index="vm.state.selectedTileIndex"></tile-palette>
                                </div>
                                {/*</div>*/}

                            </uib-tab>

                            <uib-tab index="1" heading="Events">

                                <div className="panel-body">
                                    <event-table></event-table>
                                </div>

                            </uib-tab>

                        </uib-tabset>

                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Enemies</h3>
                            </div>
                            <div className="panel-body">
                                <enemy-selector screen="vm.game.map.currentScreen"></enemy-selector>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <code-viewer map="vm.game.map"></code-viewer>
                </div>

            </div>
        );
    }
}
