import {ModifiableTableHeader} from '../modifiableTable/modifiable-table-directive';
import {LabelValuePair} from '../select-directive';
import {EnemyGroup, EnemyInfo} from '../../EnemyGroup';
import {EditorRowModalController} from './edit-row-modal-directive';
import {Screen} from '../../Screen';
import {Utils} from 'gtp';
import * as angular from 'angular';

export class EnemySelectorController {

    // spawnStyles: LabelValuePair[];
    // spawnStyle: LabelValuePair;
    curScreen: Screen;
    choices: LabelValuePair[];
    enemyGroup: EnemyGroup;

    headers: ModifiableTableHeader[];

    _openModal: Function;

    static $inject: string[] = [ '$scope' ];

    constructor($scope: ng.IScope) {

        this.choices = [
            {label: 'Octoroks', value: 'octoroks'},
            {label: 'Moblins', value: 'moblins'},
            {label: 'Tektites', value: 'tektites'}
        ];

        this.enemyGroup = new EnemyGroup('random');

        $scope.$watch('vm.curScreen', (newValue: Screen, oldValue: Screen) => {
            if (newValue) {
                const screenEnemyGroup: EnemyGroup | undefined | null = newValue.enemyGroup;
                this._setEnemyGroup(screenEnemyGroup);
            }
        });

        this.headers = [
            { label: 'Enemy', cellKey: 'type' },
            { label: 'Strength', cellKey: 'args' },
            { label: 'Count', cellKey: 'count' }
        ];
    }

    addOrEditRow() {
        console.log('yeah yeah');
        this._openModal((value: EnemyInfo) => { Utils.hitch(this, this.addOrEditRowOkCallback)(value); });
    }

    addOrEditRowOkCallback(newEnemy: EnemyInfo) {
        this.enemyGroup.add(newEnemy);
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
        this.enemyGroup.clear();
        enemies.forEach((enemy: EnemyInfo) => {
            this.enemyGroup.add(enemy);
        });
    }

    private _setEnemyGroup(newEnemyGroup: EnemyGroup | null = new EnemyGroup()) {

        // Determine which of our hard-coded choices corresponds to their enemy group
        // console.log('<<< <<< ' + JSON.stringify(newEnemyGroup ? newEnemyGroup.enemies[0] : null));

        this.enemyGroup = newEnemyGroup || new EnemyGroup();
        // if (!newEnemyGroup) {
        //     this.enemyGroup.clear()
        // }
        // else if (newEnemyGroup.enemies[0].type === 'Octorok') {
        //     this.enemyGroup.clear();
        //     for (let i: number = 0; i < 4; i++) {
        //         this.enemyGroup.add({ type: 'Octorok', args: [ (i % 2) === 0 ], count: 1 });
        //     }
        // }
        // else if (newEnemyGroup.enemies[0].type === 'Moblin') {
        //     this.enemyGroup.clear();
        //     for (let i: number = 0; i < 4; i++) {
        //         this.enemyGroup.add({ type: 'Moblin', args: [ (i % 2) === 0 ], count: 1 });
        //     }
        // }
        // else if (newEnemyGroup.enemies[0].type === 'Tektite') {
        //     this.enemyGroup.clear();
        //     for (let i: number = 0; i < 4; i++) {
        //         this.enemyGroup.add({ type: 'Tektite', args: [ (i % 2) === 0 ], count: 1 });
        //     }
        // }
    }
}

angular.module('editorDirectives')
.directive('enemySelector', [ '$rootScope', '$uibModal', ($rootScope: ng.IRootScopeService, $uibModal: any) => {
    'use strict';

    const openModal: Function = (okCallback: Function) => {

        const scope: any = $rootScope.$new();
        scope.okCallback = okCallback;

        $uibModal.open({
            templateUrl: 'zelda/editor/enemySelector/edit-row-modal.html',
            controller: EditorRowModalController,
            controllerAs: 'vm',
            bindToController: true,
            scope: scope,
            // scope: {
            //     okCallback: function() {
            //         console.log('We did it: ');
            //     }
            // },
            size: 'lg',
            resolve: {
                // items: function () {
                //     return $scope.items;
                // }
            }
        });
    };

    return {
        restrict: 'E',
        //require: 'ngModel',
        templateUrl: 'zelda/editor/enemySelector/enemy-selector.html',

        controller: EnemySelectorController,
        controllerAs: 'vm',

        scope: true,
        bindToController: {
            curScreen: '=screen'
        },

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: EnemySelectorController) => {

            controller._openModal = openModal;
        }
    };
}]);
