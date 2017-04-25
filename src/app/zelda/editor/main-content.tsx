import * as React from 'react';
import VisibleMapEditor from './containers/visible-map-editor';
import {ZeldaGame} from '../ZeldaGame';
import {Map} from '../Map';
import VisibleMapPreview from './containers/visible-map-preview';

interface MainContentProps {
    game: ZeldaGame;
}

interface MainContentState {
    loading: boolean;
    row: number;
    col: number;
    rowCount: number;
    colCount: number;
    selectedTileIndex: number; // TODO: This should be in IState
}

export default class MainContent extends React.Component<MainContentProps, MainContentState> {

    state: MainContentState = { row: 0, col: 0, rowCount: 0, colCount: 0, selectedTileIndex: -1, loading: true };

    componentDidMount() {

        const game: ZeldaGame = this.props.game;

        // This mimics what is loaded in LoadingState.
        // TODO: Share this code?
        game.assets.addImage('title', 'res/title.png');
        game.assets.addSpriteSheet('font', 'res/font.png', 9, 7, 0, 0);
        game.assets.addSpriteSheet('link', 'res/link.png', 16, 16, 1, 1, true);
        game.assets.addSpriteSheet('overworld', 'res/overworld.png', 16, 16);
        game.assets.addImage('hud', 'res/hudMockup.png');
        game.assets.addJson('overworldData', 'res/data/overworld.json');

        const that: MainContent = this;
        game.assets.onLoad(() => {

            //vm.game = game;
            game.map = new Map();
            game.map.fromJson(game.assets.get('overworldData'));
            this._setCurrentScreen(7, 6);

            that._installKeyHandlers();

            that.setState({ loading: false,
                rowCount: game.map.rowCount - 1, colCount: game.map.colCount - 1,
                selectedTileIndex: 1 });
        });
    }

    private _installKeyHandlers() {

        document.addEventListener('keydown', (e: KeyboardEvent) => {

            let row: number;
            let col: number;

            switch (e.which) {

                case 37:
                    console.log('left');
                    row = this.props.game.map.currentScreenRow;
                    col = this.props.game.map.currentScreenCol;
                    if (col > 0) {
                        this._setCurrentScreen(row, col - 1);
                    }
                    e.preventDefault();
                    break;

                case 38:
                    console.log('up');
                    row = this.props.game.map.currentScreenRow;
                    col = this.props.game.map.currentScreenCol;
                    if (row > 0) {
                        this._setCurrentScreen(row - 1, col);
                    }
                    e.preventDefault();
                    break;

                case 39:
                    console.log('right');
                    row = this.props.game.map.currentScreenRow;
                    col = this.props.game.map.currentScreenCol;
                    if (col < this.props.game.map.colCount - 1) {
                        this._setCurrentScreen(row, col + 1);
                    }
                    e.preventDefault();
                    break;

                case 40:
                    console.log('down');
                    row = this.props.game.map.currentScreenRow;
                    col = this.props.game.map.currentScreenCol;
                    if (row < this.props.game.map.rowCount - 1) {
                        this._setCurrentScreen(row + 1, col);
                    }
                    e.preventDefault();
                    break;

            }
        });
    }

    private _setCurrentScreen(row: number, col: number) {
        this.props.game.map.setCurrentScreen(row, col);
        this.setState({ row: row, col: col });
    }

    render() {

        if (this.state.loading) {
            return (
                <span>Yo</span>
            );
        }

        return (

            <div className="container">

                <div className="row">

                    <div className="col-md-8">

                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    Screen ({this.state.row}, {this.state.col}) / ({this.state.rowCount}, {this.state.colCount})
                                </h3>
                            </div>
                            <div className="panel-body">
                                <VisibleMapEditor></VisibleMapEditor>
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Map Preview</h3>
                            </div>
                            <div className="panel-body">
                                <VisibleMapPreview></VisibleMapPreview>
                            </div>
                        </div>
                    </div>

                    {/*<div className="col-md-4">*/}

                        {/*<uib-tabset active="activeFoo" className="panel panel-default">*/}
                            {/*<uib-tab index="0" heading="Tile Palette">*/}

                                {/*/!*<div className="panel panel-default">*!/*/}
                                {/*/!*<div className="panel-heading">*!/*/}
                                {/*/!*<h3 className="panel-title">Tile Palette</h3>*!/*/}
                                {/*/!*</div>*!/*/}
                                {/*<div className="panel-body">*/}
                                    {/*<tile-palette selected-index="vm.state.selectedTileIndex"></tile-palette>*/}
                                {/*</div>*/}
                                {/*/!*</div>*!/*/}

                            {/*</uib-tab>*/}

                            {/*<uib-tab index="1" heading="Events">*/}

                                {/*<div className="panel-body">*/}
                                    {/*<event-table></event-table>*/}
                                {/*</div>*/}

                            {/*</uib-tab>*/}

                        {/*</uib-tabset>*/}

                        {/*<div className="panel panel-default">*/}
                            {/*<div className="panel-heading">*/}
                                {/*<h3 className="panel-title">Enemies</h3>*/}
                            {/*</div>*/}
                            {/*<div className="panel-body">*/}
                                {/*<enemy-selector screen="vm.game.map.currentScreen"></enemy-selector>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                </div>

                {/*<div className="row">*/}
                    {/*<code-viewer map="vm.game.map"></code-viewer>*/}
                {/*</div>*/}

            </div>
        );
    }
}
