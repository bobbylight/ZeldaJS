import { ModifiableTableRow } from './modifiable-table';

/**
 * An instance of this interface must be passed to any <code>ModifiableTable</code> instance.  This contains
 * all of the callbacks that should actually modify the table's row data.
 */
export interface ModifiableTableEventHandler {

    /**
     * Called when the user decides to create or edit a row.  Typically you'll display a modal allowing the user to
     * define the row contents.
     *
     * @param {number} row The row index.  This will be <code>-1</code> if a new row is being created.
     * @param {ModifiableTableRow} rowData The existing row data, or <code>null</code> if this is a new row.
     */
    addOrEditTableRow(row: number, rowData: ModifiableTableRow | null): void;

    /**
     * Called when the user wants to move a row up or down.
     *
     * @param {number} row The index of the row to move, <code>0</code>-based.
     * @param {number} delta Whether to move up (<code>-1</code>) or down (<code>1</code>).
     */
    moveTableRow(row: number, delta: number): void;

    /**
     * Called when the user wants to remove a row.
     *
     * @param {number} index The row to remove.
     */
    removeTableRow(index: number): void;
}
