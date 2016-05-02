module zeldaEditor {
    'use strict';

    export class SelectController {

        buttonId: string;
        choices: LabelValuePair[];
        selection: any;

        static $inject: string[] = [ '$scope' ];
        
        constructor($scope: ng.IScope) {
            
            if (!this.buttonId) {
                this.buttonId = this.createUniqueId();
            }
        }

        private createUniqueId(): string {
            return 'select-' + new Date().getTime();
        }

        getSelectedLabel(): string {
            return this.selection != null ? this.selection : '(none)';
        }

        onClick(choice: LabelValuePair) {
            this.selection = choice.value;
        }
    }

    export interface LabelValuePair {
        label: string;
        value: any;
    }
}

angular.module('editorDirectives')
.directive('zeldaSelect', [ () => {

    return {
        restrict: 'E',
        //require: 'ngModel',
        templateUrl: 'js/zelda/editor/templates/select.html',

        controller: zeldaEditor.SelectController,
        controllerAs: 'vm',

        scope: true,
        bindToController: {
            buttonId: '@id',
            choices: '=',
            selection: '='
        },

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: zeldaEditor.SelectController) => {
        }
    };
}]);
