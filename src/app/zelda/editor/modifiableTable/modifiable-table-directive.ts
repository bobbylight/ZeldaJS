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

        isDeleteDisabled(): boolean {
            return this.selectedRow < 0 || this.selectedRow >= this.rows.length;
        }

        isDownDisabled(): boolean {
            return this.selectedRow === -1 || this.selectedRow === this.rows.length - 1;
        }

        isUpDisabled(): boolean {
            return this.selectedRow <= 0;
        }

        moveRowDown() {
            console.log('moveRowDown() called');
            const destRow: number = this.selectedRow + 1;
            this.rows.splice(destRow, 0, this.rows.splice(this.selectedRow, 1)[0]);
            this.selectedRow = destRow;
        }

        moveRowUp() {
            console.log('moveRowUp() called');
            const destRow: number = this.selectedRow - 1;
            this.rows.splice(destRow, 0, this.rows.splice(this.selectedRow, 1)[0]);
            this.selectedRow = destRow;
        }

        removeRow() {
            console.log('removeRow() called');
            this.rows.splice(this.selectedRow, 1);
            // TODO: Figure out how to highlight the row at selectedRow, if row count still > 0
            this.selectedRow = -1;
        }

        setPrimary(e: JQueryEventObject) {
            this.selectedRow = this._highlightSelectedRow(e);
            console.log('--- selectedRow === ' + this.selectedRow);
        }
    }

}

angular.module('editorDirectives')
.directive('modifiableTable', [ () => {
    'use strict';

    const highlightSelectedRow: Function = (element: JQuery, e: JQueryEventObject): number => {

        $(element).find('tr').removeClass('bg-info');

        const closestTableRow: JQuery = $(e.target).closest('tr');
        closestTableRow.addClass('bg-info');
        return (<HTMLTableRowElement>e.target.parentElement).rowIndex;
    };

    return {
        restrict: 'E',
        //require: 'ngModel',
        templateUrl: 'js/zelda/editor/modifiableTable/modifiable-table.html',

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
                return highlightSelectedRow(element, e) - 1;
            };
        }
    };
}]);
