module zeldaEditor {
    'use strict';

    export class EnemySelectorController {

        spawnStyles: LabelValuePair[];
        spawnStyle: LabelValuePair;

        constructor() {

            this.spawnStyles = [
                { label: 'One', value: 'one' },
                { label: 'Two', value: 'two' }
            ];

            this.spawnStyle = null;
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
