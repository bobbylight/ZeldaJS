import * as React from 'react';
import { ZeldaGame } from '../ZeldaGame';
import Select, { SelectOnChangeEvent } from './select';
import { Event } from '../event/Event';
import { LabelValuePair } from './label-value-pair';
import { EventGenerator, GoDownStairsEventGenerator } from './event-generators';
import { GoDownStairsEvent } from '../event/GoDownStairsEvent';
import { CSSProperties } from 'react';
import { Position } from '../Position';

interface EditScreenEventModalProps {
    game: ZeldaGame;
    submitButtonLabel: string;
    title: string;
    selectedEvent: Event | null;
    okCallback: Function;
    visible: boolean;
}

interface EditScreenEventModalState {
    selectedEvent: Event | null;
    selectedEventGenerator: EventGenerator<any>;
}

export default class EditScreenEventModal extends React.Component<EditScreenEventModalProps, EditScreenEventModalState> {

    private currentlyShowing: boolean;
    private generators: LabelValuePair<EventGenerator<any>>[];
    private maps: string[];
    private rows: string[];
    private cols: string[];
    private screenRows: string[];
    private screenCols: string[];

    constructor(props: EditScreenEventModalProps) {
        super(props);

        this.currentlyShowing = false;

        this.generators = [
            { label: 'Go Down Stairs', value: new GoDownStairsEventGenerator() }
        ];

        this.maps = [ 'overworld' ];
        this.rows = [ '0', '1', '2', '3', '4', '5', '6', '7' ];
        this.cols = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15' ];
        this.screenRows = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11' ];
        this.screenCols = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15' ];

        this.eventGeneratorChanged = this.eventGeneratorChanged.bind(this);
        this.goDownStairsDestTileColChanged = this.goDownStairsDestTileColChanged.bind(this);
        this.goDownStairsDestTileRowChanged = this.goDownStairsDestTileRowChanged.bind(this);
        this.goDownStairsMapChanged = this.goDownStairsMapChanged.bind(this);
        this.goDownStairsScreenColChanged = this.goDownStairsScreenColChanged.bind(this);
        this.goDownStairsScreenRowChanged = this.goDownStairsScreenRowChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props, null);
    }

    componentWillReceiveProps(nextProps: Readonly<EditScreenEventModalProps>, nextContext: any) {

        let selectedEvent: Event | null = nextProps.selectedEvent;
        console.log('-------------------> ' + selectedEvent);
        let selectedEventGenerator: EventGenerator<any>;

        if (selectedEvent instanceof GoDownStairsEvent) {
            selectedEventGenerator = this.generators[0].value as GoDownStairsEventGenerator;
            selectedEvent = selectedEvent.clone();
        }
        else {
            // Fallback to appease tsc compiler
            selectedEventGenerator = this.generators[0].value as GoDownStairsEventGenerator;
            selectedEvent = new GoDownStairsEvent(new Position(), true, 'overworld', new Position(),
                new Position());
        }

        this.setState({
            // Assertion of non-null value is safe here
            selectedEvent: selectedEvent,
            selectedEventGenerator: selectedEventGenerator
        });
    }

    private createSelectedEventGeneratorForm(): JSX.Element {

        let markup: JSX.Element;

        const eventGenerator: EventGenerator<any> = this.state.selectedEventGenerator;
        const indentStyle: CSSProperties = {
            margin: '0 3rem'
        };

        if (eventGenerator instanceof GoDownStairsEventGenerator) {

            const event: GoDownStairsEvent = this.state.selectedEvent as GoDownStairsEvent;
            const screenRow: number = event ? event.destScreen.row : 0;
            const screenCol: number = event ? event.destScreen.col : 0;
            const destTileRow: number = event ? event.destPos.row : 0;
            const destTileCol: number = event ? event.destPos.col : 0;
            console.log('>>> ' + screenRow + ', ' + screenCol);

            markup = <div>
                <div className="form-group">
                    <label>Destination Map</label>
                    <Select choices={this.maps}
                            initialValue="overworld"
                            onChange={this.goDownStairsMapChanged}/>
                </div>
                <div className="form-group">
                    <label>Destination Screen</label>
                    <div className="form-inline" style={indentStyle}>
                        <div className="form-group row-col-buffer">
                            <label>Row:</label>
                            <Select choices={this.rows}
                                    initialValue={screenRow.toString()}
                                    onChange={this.goDownStairsScreenRowChanged}
                                    display="inline-block"/>
                        </div>
                        <div className="form-group row-col-buffer">
                            <label>Col:</label>
                            <Select choices={this.cols}
                                    initialValue={screenCol.toString()}
                                    onChange={this.goDownStairsScreenColChanged}
                                    display="inline-block"/>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Destination Tile</label>
                    <div className="form-inline" style={indentStyle}>
                        <div className="form-group row-col-buffer">
                            <label>Row:</label>
                            <Select choices={this.screenRows}
                                    initialValue={destTileRow.toString()}
                                    onChange={this.goDownStairsDestTileRowChanged}
                                    display="inline-block"/>
                        </div>
                        <div className="form-group row-col-buffer">
                            <label>Col:</label>
                            <Select choices={this.screenCols}
                                    initialValue={destTileCol.toString()}
                                    onChange={this.goDownStairsDestTileColChanged}
                                    display="inline-block"/>
                        </div>
                    </div>
                </div>
            </div>;
        }

        else {
            markup = <div>Error: Unknown event generator</div>;
        }

        return  markup;
    }

    /**
     * Called when the user selects a new event generator.
     *
     * @param {SelectOnChangeEvent<EventGenerator<any>>} e The event.
     */
    eventGeneratorChanged(e: SelectOnChangeEvent<EventGenerator<any>>) {

        console.log(`Event selected: ${JSON.stringify(e)}`);
        const selectedEventGenerator: EventGenerator<any> = e.newValue!;
        const event: Event = selectedEventGenerator.generate() as Event;

        this.setState({ selectedEvent: event, selectedEventGenerator: selectedEventGenerator });
    }

    private goDownStairsDestTileColChanged(e: SelectOnChangeEvent<number>) {
        const gdse: GoDownStairsEvent = this.state.selectedEvent as GoDownStairsEvent;
        gdse.destPos.col = e.newValue!;
    }

    private goDownStairsDestTileRowChanged(e: SelectOnChangeEvent<number>) {
        const gdse: GoDownStairsEvent = this.state.selectedEvent as GoDownStairsEvent;
        gdse.destPos.row = e.newValue!;
    }

    private goDownStairsMapChanged(e: SelectOnChangeEvent<string>) {
        const gdse: GoDownStairsEvent = this.state.selectedEvent as GoDownStairsEvent;
        gdse.destMap = e.newValue!;
    }

    private goDownStairsScreenColChanged(e: SelectOnChangeEvent<number>) {
        const gdse: GoDownStairsEvent = this.state.selectedEvent as GoDownStairsEvent;
        gdse.destScreen.col = e.newValue!;
    }

    private goDownStairsScreenRowChanged(e: SelectOnChangeEvent<number>) {
        const gdse: GoDownStairsEvent = this.state.selectedEvent as GoDownStairsEvent;
        gdse.destScreen.row = e.newValue!;
    }

    onSubmit() {
        console.log('submit clicked');
        if (this.props.okCallback) {
            this.props.okCallback(this.state.selectedEvent);
        }
    }

    onCancel() {
        console.log('cancel clicked');
        this.props.okCallback(null);
    }

    render(): JSX.Element {

        console.log('>>> ' + this.props.visible + ' / ' + this.currentlyShowing);

        if (this.props.visible !== this.currentlyShowing) {
            const modal: /*JQuery*/ any = $('.editEventModal');
            if (this.props.visible) {
                setTimeout(() => {
                    modal.modal('show');
                    modal.one('hidden.bs.modal', () => {
                        this.onCancel();
                    });
                }, 1);
            }
            else {
                modal.modal('hide');
            }
            this.currentlyShowing = this.props.visible;
        }

        return (

            <div>
                <div className="modal fade editEventModal" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title">{this.props.title}</h4>
                            </div>
                            <div className="modal-body">

                                <form name="eventForm">
                                    <div className="form-group">
                                        <label>Type</label>
                                        <Select choices={this.generators}
                                                initialValue={this.state.selectedEventGenerator}
                                                onChange={this.eventGeneratorChanged}/>
                                    </div>

                                    {this.createSelectedEventGeneratorForm()}
                                </form>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" onClick={this.onSubmit}
                                        disabled={false} data-dismiss="modal">{this.props.submitButtonLabel}</button>
                                <button type="button" className="btn btn-primary" onClick={this.onCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
