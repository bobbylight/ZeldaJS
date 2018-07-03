import * as React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import VisibleMapEditor from './containers/visible-map-editor';
import VisibleMapPreview from './containers/visible-map-preview';
import VisibleTilePalette from './containers/visible-tile-palette';
import { ZeldaGame } from '../ZeldaGame';
import CodeViewer from './code-viewer';
import EventEditor from './event-editor';
import VisibleEnemySelector from './containers/visible-enemy-selector';
import ActionablePanel from './actionable-panel/actionable-panel';
import { ActionablePanelAction } from './actionable-panel/actionable-panel-action';
import VisibleScreenMisc from './containers/visible-screen-misc';
import { Screen } from '../Screen';
import { Map } from '../Map';

interface MainContentProps {
    game: ZeldaGame;
    map: Map;
    currentScreenRow: number;
    currentScreenCol: number;
    currentScreenChanged: () => void;
}

interface MainContentState {
    loading: boolean;
    rowCount: number;
    colCount: number;
    selectedTileIndex: number; // TODO: This should be in IState
}

const LEVEL_ROOM_TEMPLATE: number[][] = [
    [ 12, 13, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15 ],
    [ 28, 29, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26, 30, 31 ],
    [ 44, 45, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 46, 47 ],
    [ 60, 61, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 62, 63 ],
    [ 76, 77, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 78, 79 ],
    [ 92, 93, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 94, 95 ],
    [ 108, 109, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 110, 111 ],
    [ 124, 125, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 126, 127 ],
    [ 140, 141, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 142, 143 ],
    [ 156, 157, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 158, 159 ],
    [ 172, 173, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 174, 175 ]
];

export default class MainContent extends React.Component<MainContentProps, MainContentState> {

    state: MainContentState = { rowCount: 0, colCount: 0, selectedTileIndex: -1, loading: true };

    constructor(props: MainContentProps) {
        super(props);

        this.convertToDungeonRoom = this.convertToDungeonRoom.bind(this);
    }

    componentDidMount() {

        const game: ZeldaGame = this.props.game;

        // This mimics what is loaded in LoadingState.
        // TODO: Share this code?
        game.assets.addImage('title', 'res/title.png');
        game.assets.addSpriteSheet('font', 'res/font.png', 9, 7, 0, 0);
        game.assets.addSpriteSheet('link', 'res/link.png', 16, 16, 1, 1, true);
        game.assets.addSpriteSheet('overworld', 'res/overworld.png', 16, 16);
        game.assets.addSpriteSheet('labyrinths', 'res/level1.png', 16, 16);
        game.assets.addImage('hud', 'res/hud.png');
        game.assets.addJson('overworldData', 'res/data/overworld.json');
        game.assets.addJson('level1Data', 'res/data/level1.json');

        game.assets.onLoad(() => {

            game.startNewGame();
            this._setCurrentScreen(7, 6);

            this._installKeyHandlers();

            this.setState({ loading: false,
                rowCount: game.map.rowCount - 1, colCount: game.map.colCount - 1,
                selectedTileIndex: 1 });
        });
    }

    componentWillReceiveProps(nextProps: MainContentProps, nextContext: any) {

        const game: ZeldaGame = nextProps.game;

        this.setState({
            rowCount: nextProps.map.rowCount - 1,
            colCount: nextProps.map.colCount - 1
        });
    }

    private convertToDungeonRoom() {

        if (this.props.game.map.getName().indexOf('level') !== 0) {
            alert('Converting to a dungeon room is only supported when editing a level');
            return;
        }

        const screen: Screen = this.props.game.map.currentScreen;

        for (let row: number = 0; row < LEVEL_ROOM_TEMPLATE.length; row++) {
            for (let col: number = 0; col < LEVEL_ROOM_TEMPLATE[row].length; col++) {
                screen.setTile(row, col, LEVEL_ROOM_TEMPLATE[row][col]);
            }
        }
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
                    e.stopPropagation();
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
        this.props.currentScreenChanged();
    }

    render() {

        if (this.state.loading) {
            return (
                <span>Loading...</span>
            );
        }

        const currentScreenRow: number = this.props.currentScreenRow;
        const currentScreenCol: number = this.props.currentScreenCol;
        const title: string =
            `Screen (${currentScreenRow}, ${currentScreenCol}) / (${this.state.rowCount}, ${this.state.colCount})`;
        const actions: ActionablePanelAction[] = [
            { iconClass: 'bolt', title: 'Toggle Event visibility',
                toggle: true, pressed: this.props.game.map.showEvents,
                callback: (pressed: boolean) => { this.props.game.map.showEvents = pressed; } },
            { iconClass: 'bolt', title: 'Menu test',
                menu: [
                    {
                        label: 'Dungeon Room',
                        action: this.convertToDungeonRoom
                    }
                ]
            }
        ];

        const panelClass: string = 'card';

        return (

            <div className="container">

                <div className="row">

                    <div className="col-md-8">

                        <ActionablePanel title={title} panelClass="primary" actions={actions}>
                            <VisibleMapEditor/>
                        </ActionablePanel>

                        <div className={panelClass}>
                            <div className="card-header">
                                <h5 className="card-title">Map Preview</h5>
                            </div>
                            <div className="card-body">
                                <VisibleMapPreview/>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">

                        <Tabs id="tabSet1" defaultActiveKey={0} className={panelClass}>

                            <Tab eventKey={0} title="Tile Palette">
                                <VisibleTilePalette/>
                            </Tab>

                            <Tab eventKey={1} title="Events">
                                <div className="card-body">
                                    <EventEditor game={this.props.game}
                                                 events={this.props.game.map.currentScreen.events} />
                                </div>
                            </Tab>

                            <Tab eventKey={2} title="Misc">
                                <div className="card-body">
                                    <VisibleScreenMisc/>
                                </div>
                            </Tab>
                        </Tabs>

                        <div className={panelClass}>
                            <div className="card-header bg-primary">
                                <h5 className="card-title">Enemies</h5>
                            </div>
                            <div className="card-body">
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
