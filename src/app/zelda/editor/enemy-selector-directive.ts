module zeldaEditor {
    'use strict';

    export class EnemySelectorController {

        constructor() {
        }
    }
}

angular.module('editorDirectives')
    .directive('enemySelector', [ () => {

    return {
        restrict: 'E',
        //require: 'ngModel',
        templateUrl: 'js/zelda/editor/templates/enemySelector.html',

        controller: zeldaEditor.EnemySelectorController,
        controllerAs: 'vm',

        scope: true,
        bindToController: {
        },

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: zeldaEditor.EnemySelectorController): void => {
        }
    };
}]);
