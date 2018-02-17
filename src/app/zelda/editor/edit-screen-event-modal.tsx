import * as React from 'react';
import { ZeldaGame } from '../ZeldaGame';
import Select, { SelectOnChangeEvent } from './select';
import { Event } from '../event/Event';
import { LabelValuePair } from './label-value-pair';
import { ChangeScreenWarpEventGenerator, EventGenerator, GoDownStairsEventGenerator } from './event-generators';
import { GoDownStairsEvent } from '../event/GoDownStairsEvent';
import { Position } from '../Position';
import { ChangeScreenWarpEvent } from '../event/ChangeScreenWarpEvent';

interface EditScreenEventModalProps {
    game: ZeldaGame;
    submitButtonLabel: string;
    verb: string;
    selectedEvent: Event<any> | null;
    okCallback: Function;
    visible: boolean;
}

interface EditScreenEventModalState {
    selectedEvent: Event<any> | null;
    selectedEventGenerator: EventGenerator<any>;
}

export default class EditScreenEventModal
        extends React.Component<EditScreenEventModalProps, EditScreenEventModalState> {

    private currentlyShowing: boolean;
    private readonly generators: LabelValuePair<EventGenerator<any>>[];
    private readonly maps: string[];
    private readonly rows: number[];
    private readonly cols: number[];
    private readonly screenRows: number[];
    private readonly screenCols: number[];

    constructor(props: EditScreenEventModalProps) {
        super(props);

        this.currentlyShowing = false;

        this.generators = [
            { label: 'Go Down Stairs', value: new GoDownStairsEventGenerator() },
            { label: 'Warp on Screen Change', value: new ChangeScreenWarpEventGenerator() }
        ];

        this.maps = [ 'overworld', 'level1' ];
        this.rows = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
        this.cols = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ];
        this.screenRows = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
        this.screenCols = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ];

        this.changeScreenWarpDestTileColChanged = this.changeScreenWarpDestTileColChanged.bind(this);
        this.changeScreenWarpDestTileRowChanged = this.changeScreenWarpDestTileRowChanged.bind(this);
        this.changeScreenWarpMapChanged = this.changeScreenWarpMapChanged.bind(this);
        this.changeScreenWarpScreenColChanged = this.changeScreenWarpScreenColChanged.bind(this);
        this.changeScreenWarpScreenRowChanged = this.changeScreenWarpScreenRowChanged.bind(this);
        this.eventGeneratorChanged = this.eventGeneratorChanged.bind(this);
        this.goDownStairsDestTileColChanged = this.goDownStairsDestTileColChanged.bind(this);
        this.goDownStairsDestTileRowChanged = this.goDownStairsDestTileRowChanged.bind(this);
        this.goDownStairsMapChanged = this.goDownStairsMapChanged.bind(this);
        this.goDownStairsScreenColChanged = this.goDownStairsScreenColChanged.bind(this);
        this.goDownStairsScreenRowChanged = this.goDownStairsScreenRowChanged.bind(this);
        this.goDownStairsStartColChanged = this.goDownStairsStartColChanged.bind(this);
        this.goDownStairsStartRowChanged = this.goDownStairsStartRowChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props, null);
    }

    componentWillReceiveProps(nextProps: Readonly<EditScreenEventModalProps>, nextContext: any) {

        let selectedEvent: Event<any> | null = nextProps.selectedEvent;
        console.log('-------------------> ' + selectedEvent);
        let selectedEventGenerator: EventGenerator<any>;

        if (selectedEvent instanceof GoDownStairsEvent) {
            selectedEventGenerator = this.generators[0].value as GoDownStairsEventGenerator;
            selectedEvent = selectedEvent.clone();
        }
        else if (selectedEvent instanceof ChangeScreenWarpEvent) {
            selectedEventGenerator = this.generators[0].value as ChangeScreenWarpEventGenerator;
            selectedEvent = selectedEvent.clone();
        }
        else {
            // Fallback to appease tsc compiler
            selectedEventGenerator = this.generators[0].value as GoDownStairsEventGenerator;
            selectedEvent = new GoDownStairsEvent(new Position(), 'overworld', new Position(),
                new Position(), true, false);
        }

        this.setState({
            // Assertion of non-null value is safe here
            selectedEvent: selectedEvent,
            selectedEventGenerator: selectedEventGenerator
        });
    }

    private changeScreenWarpDestTileColChanged(e: SelectOnChangeEvent<number>) {
        const event: ChangeScreenWarpEvent = this.state.selectedEvent as ChangeScreenWarpEvent;
        event.destPos.col = e.newValue!;
    }

    private changeScreenWarpDestTileRowChanged(e: SelectOnChangeEvent<number>) {
        const event: ChangeScreenWarpEvent = this.state.selectedEvent as ChangeScreenWarpEvent;
        event.destPos.row = e.newValue!;
    }

    private changeScreenWarpMapChanged(e: SelectOnChangeEvent<string>) {
        const event: ChangeScreenWarpEvent = this.state.selectedEvent as ChangeScreenWarpEvent;
        event.destMap = e.newValue!;
    }

    private changeScreenWarpScreenColChanged(e: SelectOnChangeEvent<number>) {
        const event: ChangeScreenWarpEvent = this.state.selectedEvent as ChangeScreenWarpEvent;
        event.destScreen.col = e.newValue!;
    }

    private changeScreenWarpScreenRowChanged(e: SelectOnChangeEvent<number>) {
        const event: ChangeScreenWarpEvent = this.state.selectedEvent as ChangeScreenWarpEvent;
        event.destScreen.row = e.newValue!;
    }

    private createSelectedEventGeneratorForm(): JSX.Element {

        let markup: JSX.Element;

        const eventGenerator: EventGenerator<any> = this.state.selectedEventGenerator;
        const indentStyle: React.CSSProperties = {
            margin: '0 3rem'
        };

        if (eventGenerator instanceof GoDownStairsEventGenerator) {

            const event: GoDownStairsEvent = this.state.selectedEvent as GoDownStairsEvent;
            const startTileRow: number = event.getTile().row;
            const startTileCol: number = event.getTile().col;
            const screenRow: number = event ? event.destScreen.row : 0;
            const screenCol: number = event ? event.destScreen.col : 0;
            const destTileRow: number = event ? event.destPos.row : 0;
            const destTileCol: number = event ? event.destPos.col : 0;
            console.log('>>> ' + screenRow + ', ' + screenCol);

            markup = <div>
                <div className="form-group">
                    <label>Source Tile</label>
                    <div className="form-inline" style={indentStyle}>
                        <div className="form-group row-col-buffer">
                            <label>Row:</label>
                            <Select choices={this.screenRows}
                                    initialValue={startTileRow}
                                    onChange={this.goDownStairsStartRowChanged}
                                    display="inline-block"/>
                        </div>
                        <div className="form-group row-col-buffer">
                            <label>Col:</label>
                            <Select choices={this.screenCols}
                                    initialValue={startTileCol}
                                    onChange={this.goDownStairsStartColChanged}
                                    display="inline-block"/>
                        </div>
                    </div>
                </div>
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
                            <Select buttonId="select-destScreenRow"
                                    choices={this.rows}
                                    initialValue={screenRow}
                                    onChange={this.goDownStairsScreenRowChanged}
                                    display="inline-block"/>
                        </div>
                        <div className="form-group row-col-buffer">
                            <label>Col:</label>
                            <Select buttonId="select-destScreenCol"
                                    choices={this.cols}
                                    initialValue={screenCol}
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
                            <Select buttonId="select-destTileRow"
                                    choices={this.screenRows}
                                    initialValue={destTileRow}
                                    onChange={this.goDownStairsDestTileRowChanged}
                                    display="inline-block"/>
                        </div>
                        <div className="form-group row-col-buffer">
                            <label>Col:</label>
                            <Select buttonId="select-destTileCol"
                                    choices={this.screenCols}
                                    initialValue={destTileCol}
                                    onChange={this.goDownStairsDestTileColChanged}
                                    display="inline-block"/>
                        </div>
                    </div>
                </div>
            </div>;
        }

        else if (eventGenerator instanceof ChangeScreenWarpEventGenerator) {

            const event: ChangeScreenWarpEvent = this.state.selectedEvent as ChangeScreenWarpEvent;
            const startTileRow: number = event.getTile().row;
            const startTileCol: number = event.getTile().col;
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
                            onChange={this.changeScreenWarpMapChanged}/>
                </div>
                <div className="form-group">
                    <label>Destination Screen</label>
                    <div className="form-inline" style={indentStyle}>
                        <div className="form-group row-col-buffer">
                            <label>Row:</label>
                            <Select choices={this.rows}
                                    initialValue={screenRow}
                                    onChange={this.changeScreenWarpScreenRowChanged}
                                    display="inline-block"/>
                        </div>
                        <div className="form-group row-col-buffer">
                            <label>Col:</label>
                            <Select choices={this.cols}
                                    initialValue={screenCol}
                                    onChange={this.changeScreenWarpScreenColChanged}
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
                                    initialValue={destTileRow}
                                    onChange={this.changeScreenWarpDestTileRowChanged}
                                    display="inline-block"/>
                        </div>
                        <div className="form-group row-col-buffer">
                            <label>Col:</label>
                            <Select choices={this.screenCols}
                                    initialValue={destTileCol}
                                    onChange={this.changeScreenWarpDestTileColChanged}
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
     * @param e The event.
     */
    eventGeneratorChanged(e: SelectOnChangeEvent<EventGenerator<any>>) {

        console.log(`Event selected: ${JSON.stringify(e)}`);
        const selectedEventGenerator: EventGenerator<any> = e.newValue!;
        const event: Event<any> = selectedEventGenerator.generate() as Event<any>;

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

    private goDownStairsStartColChanged(e: SelectOnChangeEvent<number>) {
        const gdse: GoDownStairsEvent = this.state.selectedEvent as GoDownStairsEvent;
        gdse.getTile().col = e.newValue!;
    }

    private goDownStairsStartRowChanged(e: SelectOnChangeEvent<number>) {
        const gdse: GoDownStairsEvent = this.state.selectedEvent as GoDownStairsEvent;
        gdse.getTile().row = e.newValue!;
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
                                <h4 className="modal-title">{this.props.verb} Event</h4>
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
                                <button type="button" className="btn btn-primary" onClick={this.onCancel}>
                                        Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
