module zeldaEditor {
    'use strict';

    export class MapEditorController {

        game: zelda.ZeldaGame;
        selectedTileIndex: number;
        _armedRow: number;
        _armedCol: number;

        constructor() {
        }

    }

}

angular.module('editorDirectives')
.directive('mapEditor', [ '$interval', ($interval: ng.IIntervalService) => {

    return {
        restrict: 'E',
        templateUrl: 'js/zelda/editor/templates/mapEditor.html',

        scope: {},
        controller: zeldaEditor.MapEditorController,
        controllerAs: 'vm',
        bindToController: {
            game: '=',
            selectedTileIndex: '@'
        },

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: zeldaEditor.MapEditorController): void => {

            element.on('mousemove', (e: MouseEvent) => {
                controller._armedRow = Math.floor(e.offsetY / 32);
                controller._armedCol = Math.floor(e.offsetX / 32);
            });

            function paintScreen() {

                if (controller.game.map) {

                    const canvas: HTMLCanvasElement = <HTMLCanvasElement>element.find('.screen-canvas').get(0);
                    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
                    controller.game.map.currentScreen.paint(ctx);

                    const armedRow: number = controller._armedRow;
                    const armedCol: number = controller._armedCol;
                    if (armedRow > -1 && armedCol > -1) {
                        let x: number = armedCol * 16;
                        let y: number = armedRow * 16;
                        controller.game.map.tileset.paintTile(ctx, controller.selectedTileIndex, x, y);
                    }
                }
            }
            $interval(paintScreen, 50);
        }
    };
}]);
