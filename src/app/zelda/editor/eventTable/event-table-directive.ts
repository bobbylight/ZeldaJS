module zeldaEditor {
    'use strict';

    export class EventTableController {

        headers: ModifiableTableHeader[];
        events: any; // TODO

        constructor() {

            this.headers = [
                { label: 'Type', cellKey: 'type' },
                { label: 'Description', cellKey: 'desc' }
            ];

            this.events = [
                { type: 'Warp', desc: 'Go to overworld (7, 6) (1, 4)' }
            ];
        }
    }
}

angular.module('editorDirectives')
.directive('eventTable', [ '$rootScope', '$uibModal', ($rootScope: ng.IRootScopeService, $uibModal: any) => {
    'use strict';

    return {
        restrict: 'E',
        //require: 'ngModel',
        templateUrl: 'js/zelda/editor/eventTable/event-table.html',

        controller: zeldaEditor.EventTableController,
        controllerAs: 'vm',

        scope: true,
        bindToController: {
            curScreen: '=screen'
        },

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: zeldaEditor.EventTableController) => {
        }
    };
}]);
