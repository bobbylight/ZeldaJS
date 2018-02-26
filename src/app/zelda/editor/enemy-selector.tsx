import * as React from 'react';
import { ZeldaGame } from '../ZeldaGame';
import ModifiableTable, { ModifiableTableHeader, ModifiableTableRow } from './modifiable-table/modifiable-table';
import { EnemyGroup, EnemyInfo } from '../EnemyGroup';
import { LabelValuePair } from './label-value-pair';
import EditEnemyRowModal from './edit-enemy-row-modal';
import { ModifiableTableEventHandler } from './modifiable-table/modifiable-table-event-handler';
import { Enemy, EnemyStrength } from '../enemy/Enemy';

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
    selectedEnemyInfo: ModifiableTableRow | null;
    selectedEnemyInfoIndex: number;
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
                { label: 'Octorok', value: 'Octorok' },
                { label: 'Moblin', value: 'Moblin' },
                { label: 'Tektite', value: 'Tektite' },
                { label: 'Lynel', value: 'Lynel' },
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
            selectedEnemyInfo: rowData,
            selectedEnemyInfoIndex: row,
            editRowModalVisible: true
        });
    }

    addOrEditRowOkCallback(newEnemy: EnemyInfo) {

        const newState: any = { editRowModalVisible: false, selectedEnemyInfoIndex: -1, selectedEnemyInfo: null };

        if (newEnemy) {
            if (this.state.selectedEnemyInfoIndex === -1) {
                this.props.enemyGroup.add(newEnemy);
            }
            else {
                this.props.enemyGroup.enemies[this.state.selectedEnemyInfoIndex] = newEnemy;
            }
        }

        this.setState(newState);
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
            case 'Octorok':
                enemies.push({ type: 'Octorok', args: [ 'blue' ], count: 2 });
                enemies.push({ type: 'Octorok', count: 2 });
                break;
            case 'Moblin':
                enemies.push({ type: 'Moblin', args: [ 'blue' ], count: 2 });
                enemies.push({ type: 'Moblin', count: 2 });
                break;
            case 'Tektite':
                enemies.push({ type: 'Tektite', args: [ 'blue' ], count: 2 });
                enemies.push({ type: 'Tektite', count: 2 });
                break;
            case 'Lynel':
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

        const enemyType: string = this.state.selectedEnemyInfo ? this.state.selectedEnemyInfo.type : null;
        const enemyStrength: EnemyStrength = this.state.selectedEnemyInfo && this.state.selectedEnemyInfo.args.length ?
            this.state.selectedEnemyInfo.args[0] : 'red';
        const enemyCount: number = this.state.selectedEnemyInfo ? this.state.selectedEnemyInfo.count : 1;

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
                        submitButtonLabel={this.state.selectedEnemyInfoIndex === -1 ? 'Add' : 'OK'}
                        title={this.state.modalTitle}
                        enemyChoices={this.state.choices}
                        selectedEnemy={enemyType}
                        initialSelectedStrength={enemyStrength}
                        initialEnemyCount={enemyCount}
                        okCallback={this.addOrEditRowOkCallback}
                        visible={this.state.editRowModalVisible}/>
            </div>
        );
    }
}
