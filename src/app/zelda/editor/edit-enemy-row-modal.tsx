import * as React from 'react';
import { ZeldaGame } from '../ZeldaGame';
import { EnemyInfo } from '../EnemyGroup';
import { LabelValuePair } from './label-value-pair';
import { ChangeEvent } from 'react';
import Select, { SelectOnChangeEvent } from './select';

/**
 * Properties passed to the modal dialog.
 */
interface EditEnemyRowModalProps {
    game: ZeldaGame;
    submitButtonLabel: string;
    title: string;
    enemyChoices: LabelValuePair<string>[];
    selectedEnemy?: string | null;
    initialEnemyCount: number;
    okCallback: Function;
    visible: boolean;
}

/**
 * The internal state of the modal dialog.
 */
interface EditEnemyRowModalState {
    selectedEnemy: string;
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
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentWillMount() {

        this.setState({
            // Assertion of non-null value is safe here
            selectedEnemy: this.props.selectedEnemy || this.props.enemyChoices[0].value!,
            enemyCount: this.props.initialEnemyCount
        });
    }

    private enemyCountChanged(e: ChangeEvent<HTMLInputElement>) {
        this.setState({ enemyCount: parseInt(e.target.value, 10) });
    }

    enemyChoiceChanged(result: /*string*/ SelectOnChangeEvent<string>) {
        console.log(`Enemy selected: ${JSON.stringify(result)}`);
        this.setState({ selectedEnemy: result.newValue! });
    }

    private createSelectedEnemyInfo(): EnemyInfo {

        // TODO: Do this the right way
        const conversions: any = {};
        conversions.moblins = 'Moblin';
        conversions.octoroks = 'Octorok';
        conversions.tektites = 'Tektite';

        return {
            type: conversions[this.state.selectedEnemy],
            args: [],
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
