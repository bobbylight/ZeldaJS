module zeldaEditor {
    'use strict';

    export class EnemySelectorController {

        // spawnStyles: LabelValuePair[];
        // spawnStyle: LabelValuePair;
        curScreen: zelda.Screen;
        choices: LabelValuePair[];
        enemyGroup: zelda.EnemyGroup;

        headers: ModifiableTableHeader[];

        static $inject: string[] = [ '$scope' ];

        constructor($scope: ng.IScope) {

            this.choices = [
                {label: 'Octoroks', value: 'octoroks'},
                {label: 'Moblins', value: 'moblins'},
                {label: 'Tektites', value: 'tektites'}
            ];

            this.enemyGroup = new zelda.EnemyGroup('random');
            console.log(' >>> >>> >>> ' + this.curScreen);

            $scope.$watch('vm.curScreen', (newValue: zelda.Screen, oldValue: zelda.Screen) => {
                if (newValue) {
                    const screenEnemyGroup: zelda.EnemyGroup = newValue.enemyGroup;
                    this._setEnemyGroup(screenEnemyGroup);
                }
            });

            this.headers = [
                { label: 'Enemy', cellKey: 'type' },
                { label: 'Strength', cellKey: 'args' },
                { label: 'Count', cellKey: 'count' }
            ];
        }

        selectedEnemyGroupChanged(newGroup: string) {

            const enemies: zelda.EnemyInfo[] = [];

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

            //this.curScreen.enemyGroup = new zelda.EnemyGroup('random', enemies);
            this.enemyGroup.clear();
            enemies.forEach((enemy: zelda.EnemyInfo) => {
                this.enemyGroup.add(enemy);
            });
        }

        private _setEnemyGroup(newEnemyGroup: zelda.EnemyGroup) {

            // Determine which of our hard-coded choices corresponds to their enemy group
            // console.log('<<< <<< ' + JSON.stringify(newEnemyGroup ? newEnemyGroup.enemies[0] : null));

            this.enemyGroup = newEnemyGroup;
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
}

angular.module('editorDirectives')
.directive('enemySelector', [ () => {
    'use strict';

    return {
        restrict: 'E',
        //require: 'ngModel',
        templateUrl: 'js/zelda/editor/enemySelector/enemySelector.html',

        controller: zeldaEditor.EnemySelectorController,
        controllerAs: 'vm',

        scope: true,
        bindToController: {
            curScreen: '=screen'
        },

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: zeldaEditor.EnemySelectorController) => {
        }
    };
}]);
