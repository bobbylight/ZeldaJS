import * as React from 'react';
import { MouseEvent } from 'react';
import { ModifiableTableEventHandler } from './modifiable-table-event-handler';
import { ColumnRenderer } from './modifiable-table-column-renderer';

interface ModifiableTableProps {
    headers: ModifiableTableHeader[];
    rows: ModifiableTableRow[];
    eventHandler: ModifiableTableEventHandler;
}

interface ModifiableTableState {
    selectedRow: number;
}

export interface ModifiableTableHeader {
    label: string;
    cellKey: string;
    columnRenderer?: ColumnRenderer;
}

export interface ModifiableTableRow {
    [ key: string ]: any;
}

export default class ModifiableTable extends React.Component<ModifiableTableProps, ModifiableTableState> {

    state: ModifiableTableState = { selectedRow: -1 };
    private tableElem: HTMLTableElement;

    constructor(props: ModifiableTableProps) {
        super(props);

        this.addRow = this.addRow.bind(this);
        this.editRow = this.editRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.moveRowUp = this.moveRowUp.bind(this);
        this.moveRowDown = this.moveRowDown.bind(this);
        this.setPrimary = this.setPrimary.bind(this);
    }

    addRow() {
        this.props.eventHandler.addOrEditTableRow(-1, null);
    }

    componentWillReceiveProps(newProps: ModifiableTableProps) {

        // Clear the row selection if the new row set is empty
        if (!newProps.rows || !newProps.rows.length) {
            this.setState({ selectedRow: -1 });
        }
    }

    editRow() {
        const selectedRow: number = this.state.selectedRow;
        const selectedRowData: ModifiableTableRow = this.props.rows[selectedRow];
        this.props.eventHandler.addOrEditTableRow(selectedRow, selectedRowData);
    }

    highlightSelectedRow(e: MouseEvent<HTMLTableRowElement>) {

        const rows: NodeListOf<HTMLTableRowElement> = this.tableElem.querySelectorAll('tr');
        for (let i: number = 0; i < rows.length; i++) {
            rows[i].classList.remove('bg-info');
        }

        const closestTableRow: HTMLTableRowElement = ModifiableTable.getClosestTableRow(e.target as HTMLElement);
        //const rowIndex: number = (<HTMLTableRowElement>e.target.parentElement).rowIndex;
        const rowIndex: number = closestTableRow.rowIndex - 1;

        // ctrl+clicking on the selected row clears the selection
        if (e.ctrlKey && rowIndex === this.state.selectedRow) {
            return -1;
        }

        closestTableRow.classList.add('bg-info');
        return rowIndex;
    }

    private static getClosestTableRow(e: HTMLElement | null): HTMLTableRowElement {
        while (e && e.tagName.toLowerCase() !== 'tr') {
            e = e.parentElement;
        }
        return e as HTMLTableRowElement;
    }

    isDeleteDisabled(): boolean {
        return this.state.selectedRow < 0 || this.state.selectedRow >= this.props.rows.length;
    }

    isDownDisabled(): boolean {
        return this.state.selectedRow === -1 || this.state.selectedRow === this.props.rows.length - 1;
    }

    isUpDisabled(): boolean {
        return this.state.selectedRow <= 0;
    }

    moveRowDown() {
        console.log('moveRowDown() called');
        this.props.eventHandler.moveTableRow(this.state.selectedRow, 1);
        // We're assuming the event handler will reorder rows appropriately, and adjusting the selection accordingly
        if (this.state.selectedRow < this.props.rows.length - 1) {
            this.setState({
                selectedRow: this.state.selectedRow + 1
            });
        }
    }

    moveRowUp() {
        console.log('moveRowUp() called');
        this.props.eventHandler.moveTableRow(this.state.selectedRow, -1);
        // We're assuming the event handler will reorder rows appropriately, and adjusting the selection accordingly
        if (this.state.selectedRow > 0) {
            this.setState({
                selectedRow: this.state.selectedRow - 1
            });
        }
    }

    removeRow() {
        console.log('removeRow() called');
        this.props.eventHandler.removeTableRow(this.state.selectedRow);
    }

    setPrimary(e: MouseEvent<HTMLTableRowElement>) {
        this.setState({ selectedRow: this.highlightSelectedRow(e) });
        console.log('--- selectedRow === ' + this.state.selectedRow);
    }

    render() {

        let key: number = 0;
        const headers: JSX.Element[] = this.props.headers.map((header: ModifiableTableHeader) => {
            return ( <th key={key++}>{header.label}</th> );
        });

        key = 0;
        const rows: JSX.Element[] = this.props.rows ? this.props.rows.map((row: ModifiableTableRow, rowIndex: number) => {

            const tds: JSX.Element[] = this.props.headers.map((header: ModifiableTableHeader) => {
                let value: any = row[header.cellKey];
                if (header.columnRenderer) {
                    value = header.columnRenderer(value, row);
                }
                return ( <td key={key++}>{value}</td> );
            });

            // Only add class="bg-info" to the selected row, if any
            const extraProps: any = {};
            if (this.state.selectedRow === rowIndex) {
                extraProps.className = 'bg-info';
            }

            return (
                <tr onClick={this.setPrimary} key={key++} {...extraProps}>{tds}</tr>
            );
        }) : [];

        return (
            <div className="modifiable-table">

                <div className="modifiable-table-tool-bar">
                    <div className="btn-group" role="group" aria-label="Table Actions">
                        <button className="btn btn-default" onClick={this.addRow} data-toggle="tooltip"
                                title="Add row">
                            <i className="fa fa-plus" aria-hidden/>
                        </button>
                        <button className="btn btn-default" onClick={this.editRow} data-toggle="tooltip"
                                title="Edit selected row" disabled={this.state.selectedRow === -1}>
                            <i className="fa fa-pencil" aria-hidden="true"/>
                        </button>
                        <button className="btn btn-default" onClick={this.removeRow} data-toggle="tooltip"
                                title="Remove selected row" disabled={this.isDeleteDisabled()}>
                            <i className="fa fa-times" aria-hidden="true"/>
                        </button>
                        <button className="btn btn-default" onClick={this.moveRowUp} data-toggle="tooltip"
                                title="Move selected row up" disabled={this.isUpDisabled()}>
                            <i className="fa fa-arrow-up" aria-hidden="true"/>
                        </button>
                        <button className="btn btn-default" onClick={this.moveRowDown}
                                data-toggle="tooltip" title="Move selected row down" disabled={this.isDownDisabled()}>
                            <i className="fa fa-arrow-down" aria-hidden="true"/>
                        </button>
                    </div>
                </div>

                <table className="table table-bordered table-condensed"
                        ref={(element: HTMLTableElement) => { this.tableElem = element; }}>
                    <thead>
                    <tr>
                        {headers}
                    </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>

            </div>
        );
    }
}
