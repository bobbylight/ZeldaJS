import * as React from 'react';
import { ZeldaGame } from '../ZeldaGame';
import ModifiableTable, { ModifiableTableHeader, ModifiableTableRow } from './modifiable-table/modifiable-table';
import { EnemyGroup, EnemyInfo } from '../EnemyGroup';
import { LabelValuePair } from './label-value-pair';
import EditEnemyRowModal from './edit-enemy-row-modal';
import { ModifiableTableEventHandler } from './modifiable-table/modifiable-table-event-handler';
import { Enemy } from '../enemy/Enemy';

interface EnemySelectorProps {
    game: ZeldaGame;
    enemyGroup: EnemyGroup;
}

interface EnemySelectorState {
    // spawnStyles: LabelValuePair[];
    // spawnStyle: LabelValuePair;
    choices: LabelValuePair<string>[];
    headers: ModifiableTableHeader[];
    modalTitle: string;
    editRowModalVisible: boolean;
}

export default class EnemySelector extends React.Component<EnemySelectorProps, EnemySelectorState>
        implements ModifiableTableEventHandler {

    constructor(props: EnemySelectorProps) {
        super(props);

        this.addOrEditRowOkCallback = this.addOrEditRowOkCallback.bind(this);
    }

    componentWillMount() {

        this.setState({
            choices: [
                { label: 'Octoroks', value: 'octoroks' },
                { label: 'Moblins', value: 'moblins' },
                { label: 'Tektites', value: 'tektites' }
            ],
            headers: [
                { label: 'Enemy', cellKey: 'type' },
                { label: 'Strength', cellKey: 'args' },
                { label: 'Count', cellKey: 'count' }
            ],
            editRowModalVisible: false
        });
    }

    addOrEditTableRow(row: number, rowData: ModifiableTableRow | null) {
        //this.openModal((value: EnemyInfo) => { Utils.hitch(this, this.addOrEditRowOkCallback)(value); });
        this.setState({
            modalTitle: row === -1 ? 'Add Enemy' : 'Edit Enemy',
            editRowModalVisible: true
        });
    }

    addOrEditRowOkCallback(newEnemy: EnemyInfo) {
        if (newEnemy) {
            this.props.enemyGroup.add(newEnemy);
        }
        this.setState({ editRowModalVisible: false });
    }

    moveTableRow(row: number, delta: number) {
        const temp: EnemyInfo = this.props.enemyGroup.enemies[row + delta];
        this.props.enemyGroup.enemies[row + delta] = this.props.enemyGroup.enemies[row];
        this.props.enemyGroup.enemies[row] = temp;
        this.forceUpdate();
    }

    removeTableRow(index: number) {
        this.props.enemyGroup.enemies.splice(index, 1);
        this.forceUpdate();
    }

    selectedEnemyGroupChanged(newGroup: string) {

        const enemies: EnemyInfo[] = [];

        switch (newGroup) {
            case 'octoroks':
                enemies.push({ type: 'Octorok', args: [ 'blue' ], count: 2 });
                enemies.push({ type: 'Octorok', count: 2 });
                break;
            case 'moblins':
                enemies.push({ type: 'Moblin', args: [ 'blue' ], count: 2 });
                enemies.push({ type: 'Moblin', count: 2 });
                break;
            case 'tektites':
                enemies.push({ type: 'Tektite', args: [ 'blue' ], count: 2 });
                enemies.push({ type: 'Tektite', count: 2 });
                break;
        }

        //this.curScreen.enemyGroup = new EnemyGroup('random', enemies);
        this.props.enemyGroup.clear();
        enemies.forEach((enemy: EnemyInfo) => {
            this.props.enemyGroup.add(enemy);
        });
    }

    render() {

        console.log('re-rendering enemy-selector...' + Date.now() + ', ' + this.props.enemyGroup);

        return (

            <div>
                {/*<!--Spawn style:-->*/}
                {/*<!--<zelda-select choices="vm.spawnStyles" selection="vm.spawnStyle"></zelda-select>-->*/}

                Enemy group:
                {/*<zelda-select choices="vm.choices" selection="vm.selectedEnemyGroup" none-option="true"*/}
                              {/*on-change="vm.selectedEnemyGroupChanged(newValue)"></zelda-select>*/}

                <ModifiableTable headers={this.state.headers}
                                 rows={this.props.enemyGroup.enemies}
                                 eventHandler={this}/>

                <EditEnemyRowModal game={this.props.game}
                        submitButtonLabel="Add"
                        title={this.state.modalTitle}
                        enemyChoices={this.state.choices}
                        selectedEnemy={null}
                        initialEnemyCount={this.props.enemyGroup.enemies.length}
                        okCallback={this.addOrEditRowOkCallback}
                        visible={this.state.editRowModalVisible}/>
            </div>
        );
    }
}
