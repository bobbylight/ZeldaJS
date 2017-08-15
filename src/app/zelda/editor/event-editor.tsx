import * as React from 'react';
import {ZeldaGame} from '../ZeldaGame';
import ModifiableTable, {ModifiableTableHeader, ModifiableTableRow} from './modifiable-table';
import EditScreenEventModal from './edit-screen-event-modal';
import {Event} from '../event/Event';
import {GoDownStairsEvent} from '../event/GoDownStairsEvent';

interface EventEditorProps {
    game: ZeldaGame;
    events: Event[];
}

interface EventEditorState {
    headers: ModifiableTableHeader[];
    eventTableRows: EventTableRow[];
    selectedEvent: Event | null;
    editRowModalVisible: boolean;
}

interface EventTableRow {
    type: string;
    desc: string;
    event: Event;
}

export default class EventEditor extends React.Component<EventEditorProps, EventEditorState> {

    constructor(props: EventEditorProps) {

        super(props);

        this.addOrEditRow = this.addOrEditRow.bind(this);
        this.addOrEditRowOkCallback = this.addOrEditRowOkCallback.bind(this);
        this.reorderOrRemoveRow = this.reorderOrRemoveRow.bind(this);
    }

    componentWillMount() {

        let eventTableRows: EventTableRow[] = this.props.events.map((e: Event) => {
            return this.eventToEventTableRow(e);
        });

        this.setState({
            headers: [
                { label: 'Type', cellKey: 'type' },
                { label: 'Description', cellKey: 'desc' }
            ],
            eventTableRows: eventTableRows,
            selectedEvent: null,
            editRowModalVisible: false
        });
    }

    addOrEditRow(selectedRowData: EventTableRow | null) {
        console.log('here: ' + JSON.stringify(selectedRowData));
        const selectedEvent: Event | null = selectedRowData ? selectedRowData.event : null;
        this.setState({ editRowModalVisible: true, selectedEvent: selectedEvent });
    }

    addOrEditRowOkCallback(newEvent: any) {
        if (newEvent) {
            console.log('TODO: Add new event: ' + newEvent);
        }
        this.setState({ editRowModalVisible: false, selectedEvent: null });
    }

    private eventToEventTableRow(e: Event): EventTableRow {

        let type: string;
        let desc: string;

        if (e instanceof GoDownStairsEvent) {
            const gdse: GoDownStairsEvent = e as GoDownStairsEvent;
            type = 'GoDownStairs';
            desc = `Down at ${gdse.getTile()} to ${gdse.destMap}, screen ${gdse.destScreen}, tile ${gdse.destPos}`;
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

    reorderOrRemoveRow(newEnemies: any[]) {
        console.log('TODO: Implement EventEditor.reorderOrRemoveRow');
    }

    render() {

        return (
            <div>

                <ModifiableTable headers={this.state.headers}
                                 rows={this.state.eventTableRows}
                                 addEditDialogFn={this.addOrEditRow}
                                 reorderOrRemoveFn={this.reorderOrRemoveRow}>
                </ModifiableTable>

                <EditScreenEventModal game={this.props.game}
                                      submitButtonLabel="Add"
                                      title="Add Event"
                                      selectedEvent={this.state.selectedEvent}
                                      okCallback={this.addOrEditRowOkCallback}
                                      visible={this.state.editRowModalVisible}/>
            </div>
        );
    }
}
