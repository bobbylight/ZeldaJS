import * as React from 'react';
import {ZeldaGame} from '../ZeldaGame';
import ModifiableTable, {ModifiableTableHeader} from './modifiable-table';
import {EnemyGroup, EnemyInfo} from '../EnemyGroup';
import {Utils} from 'gtp/lib';
import {LabelValuePair} from './select-directive';

interface EnemySelectorProps {
    game: ZeldaGame;
    enemyGroup: EnemyGroup;
}

interface EnemySelectorState {
    // spawnStyles: LabelValuePair[];
    // spawnStyle: LabelValuePair;
    choices: LabelValuePair[];
    enemyGroup: EnemyGroup;
    headers: ModifiableTableHeader[];
}

export default class EnemySelector extends React.Component<EnemySelectorProps, EnemySelectorState> {

    constructor(props: EnemySelectorProps) {
        super(props);

        this.addOrEditRow = this.addOrEditRow.bind(this);
    }

    componentWillMount() {

        this.setState({
            choices: [
                {label: 'Octoroks', value: 'octoroks'},
                {label: 'Moblins', value: 'moblins'},
                {label: 'Tektites', value: 'tektites'}
            ],
            enemyGroup: new EnemyGroup('random'),
            headers: [
                { label: 'Enemy', cellKey: 'type' },
                { label: 'Strength', cellKey: 'args' },
                { label: 'Count', cellKey: 'count' }
            ]
        });
    }

    addOrEditRow() {
        console.log('yeah yeah');
        this.openModal((value: EnemyInfo) => { Utils.hitch(this, this.addOrEditRowOkCallback)(value); });
    }

    addOrEditRowOkCallback(newEnemy: EnemyInfo) {
        this.state.enemyGroup.add(newEnemy);
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
        this.state.enemyGroup.clear();
        enemies.forEach((enemy: EnemyInfo) => {
            this.state.enemyGroup.add(enemy);
        });
    }

    private openModal(okCallback: Function) {

        //const scope: any = $rootScope.$new();
        //scope.okCallback = okCallback;
		//
        //$uibModal.open({
        //    templateUrl: 'zelda/editor/enemySelector/edit-row-modal.html',
        //    controller: EditorRowModalController,
        //    controllerAs: 'vm',
        //    bindToController: true,
        //    scope: scope,
        //    // scope: {
        //    //     okCallback: function() {
        //    //         console.log('We did it: ');
        //    //     }
        //    // },
        //    size: 'lg',
        //    resolve: {
        //        // items: function () {
        //        //     return $scope.items;
        //        // }
        //    }
        //});
    }

    render() {

        console.log('re-rendering enemy-selector...' + Date.now());

        return (

            <div>
                {/*<!--Spawn style:-->*/}
                {/*<!--<zelda-select choices="vm.spawnStyles" selection="vm.spawnStyle"></zelda-select>-->*/}

                Enemy group:
                {/*<zelda-select choices="vm.choices" selection="vm.selectedEnemyGroup" none-option="true"*/}
                              {/*on-change="vm.selectedEnemyGroupChanged(newValue)"></zelda-select>*/}

                <ModifiableTable headers={this.state.headers}
                                 rows={this.state.enemyGroup.enemies}
                                 addEditDialogFn={this.addOrEditRow}/>
            </div>
        );
    }
}
