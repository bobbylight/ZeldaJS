import * as React from 'react';
import {ZeldaGame} from '../ZeldaGame';
import ModifiableTable, {ModifiableTableHeader} from './modifiable-table';

interface EventTableProps {
    game: ZeldaGame;
}

interface EventTableState {
    headers: ModifiableTableHeader[];
    events: any; // TODO
}

export default class EventTable extends React.Component<EventTableProps, EventTableState> {

    state: EventTableState = { headers: [], events: null };

    componentDidMount() {

        this.setState({
            headers: [
                { label: 'Type', cellKey: 'type' },
                { label: 'Description', cellKey: 'desc' }
            ],
            events: [
                { type: 'Warp', desc: 'Go to overworld (7, 6) (1, 4)' }
            ]
        });
    }

    addOrEditRow() {
        console.log('TODO: Implement EventTable.addOrEditRow');
    }

    render() {

        return (
            <div>

                <ModifiableTable headers={this.state.headers}
                                 rows={this.state.events}
                                 addEditDialogFn={this.addOrEditRow}>
                </ModifiableTable>

            </div>
        );
    }
}
