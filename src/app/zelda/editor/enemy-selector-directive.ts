module zeldaEditor {
    'use strict';
    import EnemyGroup = zelda.EnemyGroup;

    export class EnemySelectorController {

        // spawnStyles: LabelValuePair[];
        // spawnStyle: LabelValuePair;
        curScreen: zelda.Screen;
        choices: LabelValuePair[];
        selectedEnemyGroup: string;
        
        static $inject: string[] = [ '$scope' ];
        
        constructor($scope: ng.IScope) {

            this.choices = [
                { label: 'Octoroks', value: 'octoroks' },
                { label: 'Moblins', value: 'moblins' },
                { label: 'Tektites', value: 'tektites' }
            ];

            this.selectedEnemyGroup = null;
            console.log(' >>> >>> >>> ' + this.curScreen);
            
            $scope.$watch('vm.curScreen', (newValue: zelda.Screen, oldValue: zelda.Screen) => {
                if (newValue) {
                    const screenEnemyGroup: zelda.EnemyGroup = newValue.enemyGroup;
                    this._setEnemyGroup(screenEnemyGroup);
                }
            });
        }

        selectedEnemyGroupChanged(newGroup: string) {
            console.log('yes sir: ' + newGroup + ', ' + this.selectedEnemyGroup);

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

            this.curScreen.enemyGroup = new zelda.EnemyGroup('random', enemies);
        }

        private _setEnemyGroup(screenEnemyGroup: EnemyGroup) {

            // Determine which of our hard-coded choices corresponds to their enemy group
            // console.log('<<< <<< ' + JSON.stringify(screenEnemyGroup ? screenEnemyGroup.enemies[0] : null));

            if (!screenEnemyGroup) {
                this.selectedEnemyGroup = null;
            }
            else if (screenEnemyGroup.enemies[0].type === 'Octorok') {
                this.selectedEnemyGroup = 'octoroks';
            }
            else if (screenEnemyGroup.enemies[0].type === 'Moblin') {
                this.selectedEnemyGroup = 'moblins';
            }
            else if (screenEnemyGroup.enemies[0].type === 'Tektite') {
                this.selectedEnemyGroup = 'tektites';
            }
        }
    }
}

angular.module('editorDirectives')
    .directive('enemySelector', [ () => {

    return {
        restrict: 'E',
        //require: 'ngModel',
        templateUrl: 'js/zelda/editor/templates/enemySelector.html',

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
