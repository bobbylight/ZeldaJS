import { ModifiableTableRow } from './modifiable-table';

/**
 * Allows consumers of <code>ModifiableTable</code> to style cells differently than <code>value.toString()</code>.
 */
export interface ColumnRenderer {

    /**
     * Converts a cell value to a display value.  Other values in the row are provided for context.
     *
     * @param cellValue The value in the cell.
     * @param rowData The value of all cells in the row.
     * @returns The value to display.
     */
    (cellValue: any, rowData: ModifiableTableRow): any;
}
