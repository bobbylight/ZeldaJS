import * as React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import VisibleMapEditor from './containers/visible-map-editor';
import VisibleMapPreview from './containers/visible-map-preview';
import VisibleTilePalette from './containers/visible-tile-palette';
import { ZeldaGame } from '../ZeldaGame';
import { Map } from '../Map';
import CodeViewer from './code-viewer';
import EventEditor from './event-editor';
import VisibleEnemySelector from './containers/visible-enemy-selector';

interface MainContentProps {
    game: ZeldaGame;
    currentScreenRow: number;
    currentScreenCol: number;
    currentScreenChanged: (game: ZeldaGame) => void;
}

interface MainContentState {
    loading: boolean;
    rowCount: number;
    colCount: number;
    selectedTileIndex: number; // TODO: This should be in IState
}

export default class MainContent extends React.Component<MainContentProps, MainContentState> {

    state: MainContentState = { rowCount: 0, colCount: 0, selectedTileIndex: -1, loading: true };

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
                    row = this.props.currentScreenRow;
                    col = this.props.currentScreenCol;
                    if (col > 0) {
                        this._setCurrentScreen(row, col - 1);
                    }
                    e.preventDefault();
                    break;

                case 38:
                    console.log('up');
                    row = this.props.currentScreenRow;
                    col = this.props.currentScreenCol;
                    if (row > 0) {
                        this._setCurrentScreen(row - 1, col);
                    }
                    e.preventDefault();
                    break;

                case 39:
                    console.log('right');
                    row = this.props.currentScreenRow;
                    col = this.props.currentScreenCol;
                    if (col < this.props.game.map.colCount - 1) {
                        this._setCurrentScreen(row, col + 1);
                    }
                    e.preventDefault();
                    break;

                case 40:
                    console.log('down');
                    row = this.props.currentScreenRow;
                    col = this.props.currentScreenCol;
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
        this.props.currentScreenChanged(this.props.game);
    }

    render() {

        if (this.state.loading) {
            return (
                <span>Yo</span>
            );
        }

        const currentScreenRow: number = this.props.currentScreenRow;
        const currentScreenCol: number = this.props.currentScreenCol;

        return (

            <div className="container">

                <div className="row">

                    <div className="col-md-8">

                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    Screen ({currentScreenRow}, {currentScreenCol}) / ({this.state.rowCount}, {this.state.colCount})
                                </h3>
                            </div>
                            <div className="panel-body">
                                <VisibleMapEditor/>
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Map Preview</h3>
                            </div>
                            <div className="panel-body">
                                <VisibleMapPreview/>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">

                        <Tabs id="tabSet1" defaultActiveKey={0} className="panel panel-default">
                            <Tab eventKey={0} title="Tile Palette">

                                <div className="panel panel-default">
                                <div className="panel-heading">
                                <h3 className="panel-title">Tile Palette</h3>
                                </div>
                                <div className="panel-body">
                                    <VisibleTilePalette/>
                                </div>
                                </div>

                            </Tab>

                            <Tab eventKey={1} title="Events">

                                <div className="panel-body">
                                    <EventEditor game={this.props.game}
                                                 events={this.props.game.map.currentScreen.events} />
                                </div>

                            </Tab>

                        </Tabs>

                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Enemies</h3>
                            </div>
                            <div className="panel-body">
                                <VisibleEnemySelector/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <CodeViewer game={this.props.game} />
                </div>

            </div>
        );
    }
}
