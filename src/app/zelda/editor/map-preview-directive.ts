angular.module('editorDirectives')
    .directive('mapPreview', [ '$document', '$rootScope', ($document: ng.IDocumentService, $rootScope: ng.IRootScopeService) => {
        'use strict';

        let repaintHandle: number;

        const repaint: Function = (element: JQuery, game: zelda.ZeldaGame) => {

            const canvas: HTMLCanvasElement = <HTMLCanvasElement>element.find('canvas')[0];

            const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
            ctx.save();

            const map: zelda.Map = game.map;
            for (let row: number = 0; row < map.rowCount; row++) {

                for (let col: number = 0; col < map.colCount; col++) {
                    const screen: zelda.Screen = map.getScreen(row, col);
                    screen.paint(ctx);
                    ctx.translate(zelda.Constants.SCREEN_WIDTH, 0);
                }

                const xToZero: number = -zelda.Constants.SCREEN_WIDTH * map.colCount;
                ctx.translate(xToZero, zelda.Constants.SCREEN_HEIGHT);
            }

            ctx.restore();
            console.log('Painting complete');
            repaintHandle = 0;
        };

        const canvasStyleWidth: number = zelda.Constants.SCREEN_WIDTH * zelda.Constants.SCREEN_COL_COUNT;
        const canvasStyleHeight: number = zelda.Constants.SCREEN_HEIGHT * zelda.Constants.SCREEN_ROW_COUNT;

        return {

            restrict: 'E',
            template: '<canvas width=' + canvasStyleWidth + ' height=' + canvasStyleHeight +
                            ' style="width: 100%; height: 300px"></canvas>',

            scope: {
                game: '='
            },

            link: (scope: /*zelda.MapPreviewScope*/any, element: JQuery, attributes: ng.IAttributes) => {

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
                repaint(element, scope.game);
            }
        };

    }]);
