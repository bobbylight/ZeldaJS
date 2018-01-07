import * as React from 'react';
import { ZeldaGame } from '../ZeldaGame';
import { EnemyInfo } from '../EnemyGroup';
import { LabelValuePair } from './label-value-pair';
import Select, { SelectOnChangeEvent } from './select';
import { EnemyStrength } from '../enemy/Enemy';

/**
 * Properties passed to the modal dialog.
 */
interface EditEnemyRowModalProps {
    game: ZeldaGame;
    submitButtonLabel: string;
    title: string;
    enemyChoices: LabelValuePair<string>[];
    selectedEnemy?: string | null;
    initialSelectedStrength: EnemyStrength;
    initialEnemyCount: number;
    okCallback: Function;
    visible: boolean;
}

/**
 * The internal state of the modal dialog.
 */
interface EditEnemyRowModalState {
    strengthChoices: EnemyStrength[];
    selectedEnemy: string;
    selectedStrength: EnemyStrength;
    enemyCount: number;
}

/**
 * Modal dialog allowing the user to edit a group of enemies on a screen.
 */
export default class EditEnemyRowModal extends React.Component<EditEnemyRowModalProps, EditEnemyRowModalState> {

    private currentlyShowing: boolean;

    constructor(props: EditEnemyRowModalProps) {
        super(props);

        this.currentlyShowing = false;

        this.enemyCountChanged = this.enemyCountChanged.bind(this);
        this.enemyChoiceChanged = this.enemyChoiceChanged.bind(this);
        this.enemyStrengthChanged = this.enemyStrengthChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentWillMount() {

        this.setState({
            strengthChoices: [ 'red', 'blue' ],
            // Assertion of non-null value is safe here
            selectedEnemy: this.props.selectedEnemy || this.props.enemyChoices[0].value!,
            selectedStrength: this.props.initialSelectedStrength,
            enemyCount: this.props.initialEnemyCount
        });
    }

    componentWillReceiveProps(newProps: EditEnemyRowModalProps) {

        // Clear the row selection if the new row set is empty
        this.setState({
            selectedEnemy: newProps.selectedEnemy || newProps.enemyChoices[0].value!,
            selectedStrength: newProps.initialSelectedStrength || 'red',
            enemyCount: newProps.initialEnemyCount
        });
    }

    private enemyCountChanged(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ enemyCount: parseInt(e.target.value, 10) });
    }

    private enemyChoiceChanged(e: /*string*/ SelectOnChangeEvent<string>) {
        console.log(`Enemy selected: ${JSON.stringify(e)}`);
        this.setState({ selectedEnemy: e.newValue! });
    }

    private enemyStrengthChanged(e: SelectOnChangeEvent<EnemyStrength>) {
        this.setState({ selectedStrength: e.newValue! });
    }

    private createSelectedEnemyInfo(): EnemyInfo {

        const args: string[] = [];
        // Don't push strength if it's the lowest (red), to save a little size in our JSON
        if (this.state.selectedStrength !== 'red') {
            args.push(this.state.selectedStrength);
        }

        return {
            type: this.state.selectedEnemy,
            args: args,
            count: this.state.enemyCount
        };
    }

    onSubmit() {
        console.log('submit clicked');
        if (this.props.okCallback) {
            this.props.okCallback(this.createSelectedEnemyInfo());
        }
    }

    onCancel() {
        console.log('cancel clicked');
        this.props.okCallback(null);
    }

    render() {

        console.log(`>>> ${this.props.visible} / ${this.currentlyShowing}`);

        if (this.props.visible !== this.currentlyShowing) {
            const modal: /*JQuery*/ any = $('.editRowModal');
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
                <div className="modal fade editRowModal" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title">{this.props.title}</h4>
                            </div>
                            <div className="modal-body">

                                <form name="enemyForm">
                                    <div className="form-group">
                                        <label>Type</label>
                                        <Select choices={this.props.enemyChoices}
                                                initialValue={this.props.selectedEnemy}
                                                onChange={this.enemyChoiceChanged}/>
                                    </div>

                                    <div className="form-group">
                                        <label>Color (Strength)</label>
                                        <Select choices={this.state.strengthChoices}
                                                initialValue={this.state.selectedStrength}
                                                onChange={this.enemyStrengthChanged}/>
                                    </div>

                                    <div className="form-group error">
                                        <label htmlFor="enemyCount">Count</label>
                                        <input type="number" className="form-control" id="enemyCount" placeholder="Count"
                                               value={this.state.enemyCount}
                                               onChange={this.enemyCountChanged} required min="1" max="8" step="1"/>
                                    </div>
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
