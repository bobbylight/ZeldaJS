import {ZeldaGame} from '../ZeldaGame';
import * as React from 'react';
import {Constants} from '../Constants';
import {Map} from '../Map';
import {Screen} from '../Screen';

interface MapPreviewProps {
    game: ZeldaGame;
}

interface MapPreviewState {
    repaintHandle: number;}

export default class MapPreview extends React.Component<MapPreviewProps, MapPreviewState> {

    private canvas: HTMLCanvasElement;
    private repaintHandle: number; // Outside of state since we're actively rendering

    constructor(props: MapPreviewProps) {
        super(props);

        this.repaint = this.repaint.bind(this);
    }

    repaint() {

        const canvas: HTMLCanvasElement = this.canvas;

        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        ctx.save();

        const map: Map = this.props.game.map;
        for (let row: number = 0; row < map.rowCount; row++) {

            for (let col: number = 0; col < map.colCount; col++) {
                const screen: Screen = map.getScreen(row, col);
                screen.paint(ctx);
                ctx.translate(Constants.SCREEN_WIDTH, 0);
            }

            const xToZero: number = -Constants.SCREEN_WIDTH * map.colCount;
            ctx.translate(xToZero, Constants.SCREEN_HEIGHT);
        }

        ctx.restore();
        console.log('Painting complete');
        this.setState({ repaintHandle: 0 });
    }

    componentDidMount() {

        $rootScope.$on('mapChanged', () => {
            if (this.repaintHandle) {
                console.log('Clearing repaint handle');
                clearTimeout(this.repaintHandle);
            }
            this.repaintHandle = window.setTimeout(() => { // Explicitly "window." to avoid TS type declaration issue
                console.log('Setting repaint handle');
                this.repaint();
            }, 200);
        });

        setTimeout(this.repaint, 1000);
    }

    render() {

        const canvasStyleWidth: number = Constants.SCREEN_WIDTH * Constants.SCREEN_COL_COUNT;
        const canvasStyleHeight: number = Constants.SCREEN_HEIGHT * Constants.SCREEN_ROW_COUNT;

        return (
            <canvas width={canvasStyleWidth} height={canvasStyleHeight}
                    style={{width: '100%', height: '300px'}}
                    ref={(canvas: HTMLCanvasElement) => { this.canvas = canvas; }} />
        );
    }
}
