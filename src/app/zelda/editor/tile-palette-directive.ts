module zeldaEditor {
    'use strict';

    export class TilePaletteController {

        selRow: number;
        selCol: number;
        private text: string;
        private selectedIndex: string;

        constructor() {
            this.text = 'Hello there, ';
            this.selRow = this.selCol = 1;
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

            function paintScreen() {

                let canvas: HTMLCanvasElement = <HTMLCanvasElement>element.find('.tile-palette-canvas').get(0);
                let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
                const ss: gtp.SpriteSheet = <gtp.SpriteSheet>game.assets.get('overworld');
                ss.gtpImage.draw(ctx, 0, 0);

                ctx.strokeStyle = 'red';
                const x: number = controller.selRow * 16;
                const y: number = controller.selCol * 16;
                ctx.strokeRect(x, y, 16, 16);
            }
            $interval(paintScreen, 500);
        }
    };
}]);
