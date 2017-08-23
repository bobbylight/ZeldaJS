import * as React from 'react';
import { ZeldaGame } from '../ZeldaGame';
import ModifiableTable, { ModifiableTableHeader, ModifiableTableRow } from './modifiable-table/modifiable-table';
import EditScreenEventModal from './edit-screen-event-modal';
import { Event } from '../event/Event';
import { GoDownStairsEvent } from '../event/GoDownStairsEvent';
import { ModifiableTableEventHandler } from './modifiable-table/modifiable-table-event-handler';
import { Position } from '../Position';

interface EventEditorProps {
    game: ZeldaGame;
    events: Event[];
}

interface EventEditorState {
    headers: ModifiableTableHeader[];
    eventTableRows: EventTableRow[];
    selectedEvent: Event | null;
    selectedEventIndex: number;
    modalTitle: string;
    editRowModalVisible: boolean;
}

interface EventTableRow extends ModifiableTableRow {
    type: string;
    desc: string;
    event: Event;
}

export default class EventEditor extends React.Component<EventEditorProps, EventEditorState>
        implements ModifiableTableEventHandler {

    constructor(props: EventEditorProps) {

        super(props);

        this.addOrEditRowOkCallback = this.addOrEditRowOkCallback.bind(this);
    }

    componentWillMount() {

        this.setState({
            headers: [
                { label: 'Type', cellKey: 'type' },
                { label: 'Description', cellKey: 'desc', columnRenderer: this.descColumnRenderer }
            ],
            eventTableRows: this.regenerateEventTableRows(),
            selectedEvent: null,
            selectedEventIndex: -1,
            editRowModalVisible: false
        });
    }

    descColumnRenderer(cellValue: Event, rowData: ModifiableTableRow): any {

        if (cellValue instanceof GoDownStairsEvent) {

            const sourceTile: Position = cellValue.getTile();
            const map: string = cellValue.destMap;
            const screen: Position = cellValue.destScreen;
            const destPos: Position = cellValue.destPos;

            return `(${sourceTile.row}, ${sourceTile.col}) to ${map}, screen (${screen.row}, ${screen.col}), ` +
                `pos (${destPos.row}, ${destPos.col})`;
        }

        return cellValue.toString();
    }

    private regenerateEventTableRows(): EventTableRow[] {
        return this.props.events.map((e: Event) => {
            return this.eventToEventTableRow(e);
        });
    }

    addOrEditTableRow(index: number, selectedRowData: EventTableRow | null) {

        console.log('here: ' + JSON.stringify(selectedRowData));
        const selectedEvent: Event | null = selectedRowData ? selectedRowData.event : null;

        this.setState({
            editRowModalVisible: true,
            selectedEventIndex: index,
            modalTitle: index === -1 ? 'Add Event' : 'Edit Event',
            selectedEvent: selectedEvent
        });
    }

    addOrEditRowOkCallback(newEvent: Event) {

        const newState: any = { editRowModalVisible: false, selectedEventIndex: -1, selectedEvent: null };

        if (newEvent) {
            if (this.state.selectedEventIndex === -1) {
                this.props.events.push(newEvent);
            }
            else {
                this.props.events[this.state.selectedEventIndex] = newEvent;
            }
            newState.eventTableRows = this.regenerateEventTableRows();
        }

        this.setState(newState);
    }

    private eventToEventTableRow(e: Event): EventTableRow {

        let type: string;
        let desc: any;

        if (e instanceof GoDownStairsEvent) {
            const gdse: GoDownStairsEvent = e;
            type = 'GoDownStairs';
            desc = gdse;
        }
        else {
            type = 'Unknown';
            desc = 'Unknown';
        }

        return {
            type: type,
            desc: desc,
            event: e
        };
    }

    moveTableRow(row: number, delta: number) {
        const temp: EventTableRow = this.state.eventTableRows[row + delta];
        this.state.eventTableRows[row + delta] = this.state.eventTableRows[row];
        this.state.eventTableRows[row] = temp;
        this.forceUpdate();
    }

    removeTableRow(index: number) {
        this.props.events.splice(index, 1);
        this.setState({ eventTableRows: this.regenerateEventTableRows() });
        this.forceUpdate();
    }

    render() {

        return (
            <div>

                <ModifiableTable headers={this.state.headers}
                                 rows={this.state.eventTableRows}
                                 eventHandler={this}/>

                <EditScreenEventModal game={this.props.game}
                                      submitButtonLabel="Add"
                                      title={this.state.modalTitle}
                                      selectedEvent={this.state.selectedEvent}
                                      okCallback={this.addOrEditRowOkCallback}
                                      visible={this.state.editRowModalVisible}/>
            </div>
        );
    }
}
