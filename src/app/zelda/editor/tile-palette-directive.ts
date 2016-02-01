module zeldaEditor {
    'use strict';

    export class TilePaletteController {

        armedIndex: number;
        selectedIndex: number;

        constructor() {
        }

        get selectedTileCol(): number {
            return this.selectedIndex % 10;
        }

        get selectedTileRow(): number {
            return Math.floor(this.selectedIndex / 10);
        }

        setArmedIndex(x: number, y: number) {
            this.armedIndex = this._computeIndexFromXY(x, y);
        }

        setSelectedIndex(x: number, y: number) {
            this.selectedIndex = this._computeIndexFromXY(x, y);
        }

        private _computeIndexFromXY(x: number, y: number): number {
            console.log('--- ' + x + ', ' + y);
            console.log('--- --- row/col === ' + Math.floor(y / 32) + ', ' + Math.floor(x / 32));
            return Math.floor(y / 32) * 10 + Math.floor(x / 32);
        }
    }
}

angular.module('editorDirectives')
    .directive('tilePalette', [ '$interval', ($interval: ng.IIntervalService) => {

    return {
        restrict: 'E',
        //require: 'ngModel',
        templateUrl: 'js/zelda/editor/templates/tilePalette.html',

        controller: zeldaEditor.TilePaletteController,
        controllerAs: 'vm',

        scope: true,
        bindToController: {
            selectedIndex: '='
        },

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: zeldaEditor.TilePaletteController): void => {

            element.on('click', (e: MouseEvent) => {
                controller.setSelectedIndex(e.offsetX, e.offsetY);
            });

            element.on('mousemove', (e: MouseEvent) => {
                controller.setArmedIndex(e.offsetX, e.offsetY);
            });

            function paintScreen() {

                const canvas: HTMLCanvasElement = <HTMLCanvasElement>element.find('.tile-palette-canvas').get(0);
                const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
                const ss: gtp.SpriteSheet = <gtp.SpriteSheet>game.assets.get('overworld');
                ss.gtpImage.draw(ctx, 0, 0);

                ctx.strokeStyle = 'red';
                let row: number = Math.floor(controller.selectedIndex / 10);
                let col: number = controller.selectedIndex % 10;
                let x: number = col * 16;
                let y: number = row * 16;
                ctx.strokeRect(x, y, 16, 16);

                ctx.strokeStyle = 'blue';
                row = Math.floor(controller.armedIndex / 10);
                col = controller.armedIndex % 10;
                x = col * 16;
                y = row * 16;
                ctx.strokeRect(x, y, 16, 16);
            }
            $interval(paintScreen, 50);
        }
    };
}]);
