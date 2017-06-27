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

    constructor(props: EventTableProps) {

        super(props);

        this.addOrEditRow = this.addOrEditRow.bind(this);
        this.reorderOrRemoveRow = this.reorderOrRemoveRow.bind(this);
    }

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

    reorderOrRemoveRow(newEnemies: any[]) {
        console.log('TODO: Implement EventTable.reorderOrRemoveRow');
    }

    render() {

        return (
            <div>

                <ModifiableTable headers={this.state.headers}
                                 rows={this.state.events}
                                 addEditDialogFn={this.addOrEditRow}
                                 reorderOrRemoveFn={this.reorderOrRemoveRow}>
                </ModifiableTable>

            </div>
        );
    }
}
