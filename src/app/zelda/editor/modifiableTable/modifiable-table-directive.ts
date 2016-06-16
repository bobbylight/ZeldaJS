module zeldaEditor {
    'use strict';

    export interface ModifiableTableHeader {
        label: string;
        cellKey: string;
    }

    export class ModifiableTableController {

        headers: ModifiableTableHeader[];
        rows: { [ key: string ]: any }[];
        _highlightSelectedRow: Function;
        selectedRow: number;
        addEditDialogFn: Function;

        constructor() {
            this.selectedRow = -1;
        }

        addRow() {
            this.addEditDialogFn();
        }

        isDownDisabled(): boolean {
            return this.selectedRow === -1 || this.selectedRow === this.rows.length;
        }
        isUpDisabled(): boolean {
            return this.selectedRow <= 1;
        }

        moveRowDown() {
            console.log('moveRowDown() called');
        }

        moveRowUp() {
            console.log('moveRowUp() called');
        }

        removeRow() {
            console.log('removeRow() called');
        }

        setPrimary(e: JQueryEventObject) {
            console.log('--- ' + e);
            this.selectedRow = this._highlightSelectedRow(e);
        }
    }

}

angular.module('editorDirectives')
.directive('modifiableTable', [ () => {
    'use strict';

    function highlightSelectedRow(element: JQuery, e: JQueryEventObject): number {

        $(element).find('tr').removeClass('bg-info');

        const closestTableRow: JQuery = $(e.target).closest('tr');
        closestTableRow.addClass('bg-info');
        return (<HTMLTableRowElement>e.target.parentElement).rowIndex;
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
            addEditDialogFn: '&'
        },

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: zeldaEditor.ModifiableTableController) => {

            controller._highlightSelectedRow = (e: JQueryEventObject): number => {
                return highlightSelectedRow(element, e);
            };
        }
    };
}]);
