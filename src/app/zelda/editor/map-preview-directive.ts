import {Constants} from '../Constants';
import {ZeldaGame} from '../ZeldaGame';
import {Screen} from '../Screen';
import {Map} from '../Map';

angular.module('editorDirectives')
    .directive('mapPreview', [ '$document', '$rootScope', '$timeout',
        ($document: ng.IDocumentService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService) => {

        'use strict';

        let repaintHandle: number;

        const repaint: Function = (element: JQuery, game: ZeldaGame) => {

            const canvas: HTMLCanvasElement = <HTMLCanvasElement>element.find('canvas')[0];

            const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
            ctx.save();

            const map: Map = game.map;
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
            repaintHandle = 0;
        };

        const canvasStyleWidth: number = Constants.SCREEN_WIDTH * Constants.SCREEN_COL_COUNT;
        const canvasStyleHeight: number = Constants.SCREEN_HEIGHT * Constants.SCREEN_ROW_COUNT;

        return {

            restrict: 'E',
            template: '<canvas width=' + canvasStyleWidth + ' height=' + canvasStyleHeight +
                            ' style="width: 100%; height: 300px"></canvas>',

            scope: {
                game: '='
            },

            link: (scope: /*MapPreviewScope*/any, element: JQuery, attributes: ng.IAttributes) => {

                $rootScope.$on('mapChanged', () => {
                    if (repaintHandle) {
                        console.log('Clearing repaint handle');
                        clearTimeout(repaintHandle);
                    }
                    repaintHandle = window.setTimeout(() => { // Explicitly "window." to avoid TS type declaration issue
                        console.log('Setting repaint handle');
                        repaint(element, scope.game);
                    }, 200);
                });

                $timeout(() => {
                    repaint(element, scope.game);
                }, 1000);
            }
        };

    }]);
