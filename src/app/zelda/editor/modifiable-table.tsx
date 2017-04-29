import * as React from 'react';
import {MouseEvent} from 'react';

interface ModifiableTableProps {
    headers: ModifiableTableHeader[];
    rows: ModifiableTableRow[];
    addEditDialogFn: Function;
}

interface ModifiableTableState {
    selectedRow: number;
}

export interface ModifiableTableHeader {
    label: string;
    cellKey: string;
}

interface ModifiableTableRow {
    [ key: string ]: any;
}

export default class ModifiableTable extends React.Component<ModifiableTableProps, ModifiableTableState> {

    state: ModifiableTableState = { selectedRow: -1 };
    private tableElem: HTMLTableElement;

    constructor(props: ModifiableTableProps) {
        super(props);

        this.addRow = this.addRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.moveRowUp = this.moveRowUp.bind(this);
        this.moveRowDown = this.moveRowDown.bind(this);
        this.setPrimary = this.setPrimary.bind(this);
    }

    addRow() {
        this.props.addEditDialogFn();
    }

    highlightSelectedRow(e: MouseEvent<HTMLTableRowElement>) {

        const rows: NodeListOf<HTMLTableRowElement> = this.tableElem.querySelectorAll('tr');
        for (let i: number = 0; i < rows.length; i++) {
            rows[i].classList.remove('bg-info');
        }

        const closestTableRow: HTMLTableRowElement = ModifiableTable.getClosestTableRow(e.target as HTMLElement);
        closestTableRow.classList.add('bg-info');
        //return (<HTMLTableRowElement>e.target.parentElement).rowIndex;
        return closestTableRow.rowIndex - 1;
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
        const destRow: number = this.state.selectedRow + 1;
        const newRows: ModifiableTableRow[] = this.props.rows.slice();
        newRows.splice(destRow, 0, newRows.splice(this.state.selectedRow, 1)[0]);
        this.props.rows.length = 0;
        this.props.rows.concat(newRows);
        this.setState({ selectedRow: destRow });
    }

    moveRowUp() {
        console.log('moveRowUp() called');
        const destRow: number = this.state.selectedRow - 1;
        const newRows: ModifiableTableRow[] = this.props.rows.slice();
        newRows.splice(destRow, 0, newRows.splice(this.state.selectedRow, 1)[0]);
        this.props.rows.length = 0;
        this.props.rows.concat(newRows);
        this.setState({ selectedRow: destRow });
    }

    removeRow() {
        console.log('removeRow() called');
        const newRows: ModifiableTableRow[] = this.props.rows.slice();
        newRows.splice(this.state.selectedRow, 1);
        this.props.rows.length = 0;
        this.props.rows.concat(newRows);
        // TODO: Figure out how to highlight the row at selectedRow, if row count still > 0
        this.setState({ selectedRow: -1 });
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
        const rows: JSX.Element[] = this.props.rows ? this.props.rows.map((row: ModifiableTableRow) => {

            const tds: JSX.Element[] = this.props.headers.map((header: ModifiableTableHeader) => {
                return ( <td key={key++}>{row[header.cellKey]}</td> );
            });

            return (
                <tr onClick={this.setPrimary} key={key++}>{tds}</tr>
            );
        }) : [];

        return (
            <div className="modifiable-table">

                <div className="modifiable-table-tool-bar">
                    <div className="btn-group" role="group" aria-label="Table Actions">
                        <button className="btn btn-default" onClick={this.addRow} data-toggle="tooltip" title="Add row">
                            <i className="fa fa-plus" aria-hidden="true"/>
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
