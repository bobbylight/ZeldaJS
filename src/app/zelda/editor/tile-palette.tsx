import { ZeldaGame } from '../ZeldaGame';
import * as React from 'react';
import SpriteSheet from 'gtp/lib/gtp/SpriteSheet';
import { Constants } from '../Constants';

/**
 * Properties passed to the tile palette component.
 */
export interface TilePaletteProps {
    game?: ZeldaGame;
    selectedTileIndex: number;
    onTileSelected: (selectedTileIndex: number) => void;
}

interface TilePaletteState {
    armedIndex: number;
    repaintHandle: number;
}

/**
 * A component that allows the user to select a tile to paint onto the current screen.
 */
export default class TilePalette extends React.Component<TilePaletteProps, TilePaletteState> {

    private canvas: HTMLCanvasElement;

    state: TilePaletteState = { armedIndex: 0, repaintHandle: 0 };

    constructor(props: TilePaletteProps) {
        super(props);

        this.repaint = this.repaint.bind(this);
    }

    private colCount(): number {
        return this.props.game!.map.tileset.colCount;
    }

    repaint() {

        const canvas: HTMLCanvasElement = this.canvas;
        const tilesetName: string = this.props.game!.map.getTilesetName();
        const colCount: number = this.colCount();

        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        const ss: SpriteSheet = this.props.game!.assets.get(tilesetName);
        ss.gtpImage.draw(ctx, 0, 0);

        ctx.strokeStyle = 'red';
        let row: number = Math.floor(this.props.selectedTileIndex / colCount);
        let col: number = this.props.selectedTileIndex % colCount;
        let x: number = col * 16;
        let y: number = row * 16;
        ctx.strokeRect(x, y, 16, 16);

        ctx.strokeStyle = 'blue';
        row = Math.floor(this.state.armedIndex / colCount);
        col = this.state.armedIndex % colCount;
        x = col * 16;
        y = row * 16;
        ctx.strokeRect(x, y, 16, 16);
    }

    componentDidMount() {

        this.canvas.addEventListener('click', (e: MouseEvent) => {
            this.props.onTileSelected(this._computeIndexFromXY(e.offsetX, e.offsetY));
            // Even though this updates our props, we must re-render our canvas manually
            this.repaint();
        });

        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            this.setState({ armedIndex: this._computeIndexFromXY(e.offsetX, e.offsetY) });
            this.repaint();
        });

        //this.repaintHandle = setInterval(this.repaint, 100);
        this.repaint();
    }

    private _computeIndexFromXY(x: number, y: number): number {
        //console.log('--- ' + x + ', ' + y);
        //console.log('--- --- row/col === ' + Math.floor(y / 32) + ', ' + Math.floor(x / 32));
        const colCount: number = this.colCount();
        const tileWidth: number = this.canvas.clientWidth / colCount;
        const tileHeight: number = this.canvas.clientHeight / this.rowCount();
        (console as any).log('---> ' + colCount + ', ' + tileWidth + ', ' + tileHeight);
        return Math.floor(y / tileHeight) * colCount + Math.floor(x / tileWidth);
    }

    render() {

        const width: number = this.colCount() * Constants.TILE_WIDTH;
        const height: number = this.rowCount() * Constants.TILE_HEIGHT;

        return (
            <div className="tile-palette">
                <canvas className="tile-palette-canvas" width={width} height={height}
                        ref={(canvas: HTMLCanvasElement) => { this.canvas = canvas; }} />
            </div>
        );
    }

    private rowCount(): number {
        return this.props.game!.map.tileset.rowCount;
    }
}
