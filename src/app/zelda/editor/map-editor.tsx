import * as React from 'react';
import { ZeldaGame } from '../ZeldaGame';
import { Constants } from '../Constants';
import { Map } from '../Map';
import { Screen } from '../Screen';
import { screenModified } from './actions';
import { MouseEventHandler } from 'react';

export interface MapEditorProps {
    game: ZeldaGame;
    selectedTileIndex: number;
    onChange: (row: number, col: number) => void;
}

interface MapEditorState {
    _mouseDown: boolean;
    armedRow: number;
    armedCol: number;
}

export default class MapEditor extends React.Component<MapEditorProps, MapEditorState> {

    state: MapEditorState = { _mouseDown: false, armedRow: -1, armedCol: -1 };
    private canvas: HTMLCanvasElement;

    constructor(props: MapEditorProps) {

        super(props);

        this.setArmedTile = this.setArmedTile.bind(this);
        this.paintScreen = this.paintScreen.bind(this);
    }

    setArmedTile(e: MouseEvent | null) {
        const screen: Screen = this.props.game.map.currentScreen;
        const selectedTileIndex: number = this.props.selectedTileIndex;
        screen.setTile(this.state.armedRow, this.state.armedCol, selectedTileIndex);
        //$rootScope.$broadcast('mapChanged', screen); // TODO: Formalize an event for this and make it specific
        this.props.onChange(this.state.armedRow, this.state.armedCol);
    }

    static inMainScreen(x: number, y: number) {
        return x >= 32 && x < Constants.SCREEN_WIDTH * 2 + 32 &&
            y >= 32 && y < Constants.SCREEN_HEIGHT * 2 + 32;
    }

    private paintScreenAbovePart(ctx: CanvasRenderingContext2D) {
        const map: Map = this.props.game.map;
        if (map && map.currentScreenRow > 0) {
            ctx.translate(16, 0);
            const screen: Screen = map.getScreen(map.currentScreenRow - 1, map.currentScreenCol);
            screen.paintRow(ctx, Constants.SCREEN_ROW_COUNT - 1, 0);
            ctx.translate(-16, 0);
        }
        else {
            ctx.fillStyle = 'darkgray';
            ctx.fillRect(16, 0, Constants.SCREEN_WIDTH, 16);
        }
    }

    private paintScreenRightPart(ctx: CanvasRenderingContext2D) {
        const map: Map = this.props.game.map;
        if (map && map.currentScreenCol < map.colCount - 1) {
            ctx.translate(0, 16);
            const screen: Screen = map.getScreen(map.currentScreenRow, map.currentScreenCol + 1);
            screen.paintCol(ctx, 0, Constants.SCREEN_WIDTH + 16);
            ctx.translate(0, -16);
        }
        else {
            ctx.fillStyle = 'darkgray';
            const x: number = Constants.SCREEN_WIDTH + 16;
            ctx.fillRect(x, 16, 16, Constants.SCREEN_HEIGHT);
        }
    }

    private paintScreenBelowPart(ctx: CanvasRenderingContext2D) {
        const map: Map = this.props.game.map;
        if (map && map.currentScreenRow < map.rowCount - 1) {
            ctx.translate(16, 0);
            const screen: Screen = map.getScreen(map.currentScreenRow + 1, map.currentScreenCol);
            screen.paintRow(ctx, 0, Constants.SCREEN_HEIGHT + 16);
            ctx.translate(-16, 0);
        }
        else {
            ctx.fillStyle = 'darkgray';
            const y: number = Constants.SCREEN_HEIGHT + 16;
            ctx.fillRect(16, y, Constants.SCREEN_WIDTH, 16);
        }
    }

    private paintScreenLeftPart(ctx: CanvasRenderingContext2D) {
        const map: Map = this.props.game.map;
        if (map && map.currentScreenCol > 0) {
            ctx.translate(0, 16);
            const screen: Screen = map.getScreen(map.currentScreenRow, map.currentScreenCol - 1);
            screen.paintCol(ctx, Constants.SCREEN_COL_COUNT - 1, 0);
            ctx.translate(0, -16);
        }
        else {
            ctx.fillStyle = 'darkgray';
            ctx.fillRect(0, 16, 16, Constants.SCREEN_HEIGHT);
        }
    }

    private possiblyPaintArmedTile(ctx: CanvasRenderingContext2D) {
        const armedRow: number = this.state.armedRow;
        const armedCol: number = this.state.armedCol;
        if (armedRow > -1 && armedCol > -1) {
            let x: number = armedCol * 16 + 16;
            let y: number = armedRow * 16 + 16;
            ctx.globalAlpha = 0.5;
            this.props.game.map.tileset.paintTile(ctx, this.props.selectedTileIndex, x, y);
            ctx.globalAlpha = 1;
        }
    }

    paintScreen() {

        const map: Map = this.props.game.map;
        if (map) {

            const canvas: HTMLCanvasElement = this.canvas;
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

            // Clear needed for translucent parts
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.globalAlpha = 0.5;
            this.paintScreenAbovePart(ctx);
            this.paintScreenRightPart(ctx);
            this.paintScreenBelowPart(ctx);
            this.paintScreenLeftPart(ctx);
            ctx.globalAlpha = 1;

            ctx.translate(16, 16);
            map.currentScreen.paint(ctx);
            ctx.translate(-16, -16);

            this.possiblyPaintArmedTile(ctx);
        }
    }

    componentDidMount() {

        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {

            let x: number = e.offsetX;
            let y: number = e.offsetY;

            if (MapEditor.inMainScreen(x, y)) {
                x -= 32;
                y -= 32;
                this.setState({ armedRow: Math.floor(y / 32), armedCol: Math.floor(x / 32) });
                console.log('armed tile: ' + this.state.armedRow, this.state.armedCol);
                if (this.state._mouseDown) {
                    this.setArmedTile(null);
                }
            }
            else {
                this.setState({ armedRow: -1, armedCol: -1 });
            }
        });

        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            this.setState({ _mouseDown: true });
        });
        const mouseUpHandler: EventListener = (e: MouseEvent) => {
            this.setState({ _mouseDown: false });
        };
        this.canvas.addEventListener('mouseup', mouseUpHandler);
        this.canvas.addEventListener('mouseleave', mouseUpHandler);

        this.canvas.addEventListener('click', this.setArmedTile);

        setInterval(this.paintScreen, 50);
    }

    render() {
        return (

            <div className="map-editor">

                {/* 256x176 + 16-pixel buffer on all sides */}
                <canvas className="screen-canvas" width="288" height="208"
                    ref={(canvas: HTMLCanvasElement) => { this.canvas = canvas; }}/>

            </div>
        );
    }
}
