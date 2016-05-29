module zeldaEditor {
    'use strict';

    export interface ModifiableTableHeader {
        label: string;
        cellKey: string;
    }

    export class ModifiableTableController {

        headers: ModifiableTableHeader[];
        rows: any[][];
        _highlightSelectedRow: Function;

        constructor() {
        }

        setPrimary(e: JQueryEventObject) {
            console.log('--- ' + e);
            this._highlightSelectedRow(e);
        }
    }

}

angular.module('editorDirectives')
.directive('modifiableTable', [ () => {
    'use strict';

    function highlightSelectedRow(element: JQuery, e: JQueryEventObject) {

        $(element).find('tr').removeClass('bg-info');

        const closestTableRow: JQuery = $(e.target).closest('tr');
        closestTableRow.addClass('bg-info');
    }

    return {
        restrict: 'E',
        //require: 'ngModel',
        templateUrl: 'js/zelda/editor/modifiableTable/modifiableTable.html',

        controller: zeldaEditor.ModifiableTableController,
        controllerAs: 'vm',

        scope: true,
        bindToController: {
            headers: '=',
            rows: '=',
        },

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: zeldaEditor.ModifiableTableController) => {

            controller._highlightSelectedRow = (e: JQueryEventObject) => {
                highlightSelectedRow(element, e);
            };
        }
    };
}]);
