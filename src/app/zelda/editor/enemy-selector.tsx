import * as React from 'react';
import {ZeldaGame} from '../ZeldaGame';
import ModifiableTable, {ModifiableTableHeader} from './modifiable-table';
import {EnemyGroup, EnemyInfo} from '../EnemyGroup';
import {LabelValuePair} from './label-value-pair';
import EditEnemyRowModal from './edit-enemy-row-modal';

interface EnemySelectorProps {
    game: ZeldaGame;
    enemyGroup: EnemyGroup;
}

interface EnemySelectorState {
    // spawnStyles: LabelValuePair[];
    // spawnStyle: LabelValuePair;
    choices: LabelValuePair<string>[];
    headers: ModifiableTableHeader[];
    editRowModalVisible: boolean;
}

export default class EnemySelector extends React.Component<EnemySelectorProps, EnemySelectorState> {

    constructor(props: EnemySelectorProps) {
        super(props);

        this.addOrEditRow = this.addOrEditRow.bind(this);
        this.addOrEditRowOkCallback = this.addOrEditRowOkCallback.bind(this);
        this.reorderOrRemoveRow = this.reorderOrRemoveRow.bind(this);
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

    addOrEditRow() {
        console.log('yeah yeah');
        //this.openModal((value: EnemyInfo) => { Utils.hitch(this, this.addOrEditRowOkCallback)(value); });
        this.setState({ editRowModalVisible: true });
    }

    addOrEditRowOkCallback(newEnemy: EnemyInfo) {
        if (newEnemy) {
            this.props.enemyGroup.add(newEnemy);
        }
        this.setState({ editRowModalVisible: false });
    }

    reorderOrRemoveRow(newEnemies: EnemyInfo[]) {
        this.props.enemyGroup.enemies.length = 0;
        this.props.enemyGroup.enemies.push.apply(this.props.enemyGroup.enemies, newEnemies);
    }

    selectedEnemyGroupChanged(newGroup: string) {

        const enemies: EnemyInfo[] = [];

        switch (newGroup) {
            case 'octoroks':
                enemies.push({ type: 'Octorok', args: [ true ], count: 2 });
                enemies.push({ type: 'Octorok', count: 2 });
                break;
            case 'moblins':
                enemies.push({ type: 'Moblin', args: [ true ], count: 2 });
                enemies.push({ type: 'Moblin', count: 2 });
                break;
            case 'tektites':
                enemies.push({ type: 'Tektite', args: [ true ], count: 2 });
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
                                 addEditDialogFn={this.addOrEditRow}
                                 reorderOrRemoveFn={this.reorderOrRemoveRow}/>

                <EditEnemyRowModal game={this.props.game}
                        submitButtonLabel="Add"
                        title="Add Enemy"
                        enemyChoices={this.state.choices}
                        selectedEnemy={null}
                        initialEnemyCount={this.props.enemyGroup.enemies.length}
                        okCallback={this.addOrEditRowOkCallback}
                        visible={this.state.editRowModalVisible}/>
            </div>
        );
    }
}
