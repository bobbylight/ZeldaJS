module zeldaEditor {
    'use strict';

    export class MapEditorController {

        game: zelda.ZeldaGame;
        private testText: string;

        constructor() {

            const vm: MapEditorController = this;
            vm.testText = 'Roberto kicks ass';
            vm.game = game;
        }

    }

}

angular.module('editorDirectives')
.directive('mapEditor', [ '$interval', ($interval: ng.IIntervalService) => {

    return {
        restrict: 'E',
        //require: 'ngModel',
        templateUrl: 'js/zelda/editor/templates/mapEditor.html',
        replace: true,

        controller: zeldaEditor.MapEditorController,
        controllerAs: 'vm',

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: zeldaEditor.MapEditorController): void => {

            function paintScreen() {

                let canvas: HTMLCanvasElement = <HTMLCanvasElement>element.find('.screen-canvas').get(0);
                let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
                controller.game.map.currentScreen.paint(ctx);

            }
            $interval(paintScreen, 500);
        }
    };
}]);
