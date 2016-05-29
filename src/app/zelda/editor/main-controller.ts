module zeldaEditor {
    'use strict';

    export class MainController {

        static $inject: string[] = [ '$scope', 'resourceService' ];

        x: number;
        state: any;
        name: string;
        loading: boolean;
        game: zelda.ZeldaGame;

        constructor(private $scope: any, private resourceService: zeldaEditor.ResourceService) {

            this.x = 777;
            this.name = 'Teddy Roosevelt xxx';

            // Initialize the game declared in zelda.ts
            // TODO: Do game initialization in a service?
            let parent: HTMLDivElement = document.createElement('div');
            game = new zelda.ZeldaGame({
                assetRoot: undefined,
                height: CANVAS_HEIGHT,
                keyRefreshMillis: 300,
                parent: parent,
                targetFps: 60,
                width: CANVAS_WIDTH
            });

            // Resource service needs to run before the map is created
            const vm: MainController = this;
            vm.loading = true;
            vm.state = {
                selectedTileIndex: 0,
                screenRow: 0,
                screenCol: 0
            };

            $scope.$watch(() => { return vm.loading; }, (newVal: boolean, oldVal: boolean) => {
                if (newVal !== oldVal) {
                    console.log('DEBUG: watch called: ' + newVal + ', ' + oldVal);
                    vm.name = 'Robert';
                    vm.x = 7;
                    vm.game = game;
                    vm.game.map = new zelda.Map();
                    vm.game.map.fromJson(vm.game.assets.get('overworldData'));
                    vm.game.map.setCurrentScreen(7, 6);

                    vm.state.selectedTileIndex = 1;
                    vm.loading = false;

                    vm._installKeyHandlers($scope);
                }
            });
            resourceService.load(() => {
                //this.loading = false;
                console.log('DEBUG: resourceService.load() callback called');
                $scope.$apply('vm.loading = false;');
            });

        }

        getCurrentScreenCol(): number {
            return this.game ? this.game.map.currentScreenCol : 0;
        }

        getCurrentScreenRow(): number {
            return this.game ? this.game.map.currentScreenRow : 0;
        }

        get colCount(): number {
            return this.game ? this.game.map.colCount - 1 : 0;
        }

        get rowCount(): number {
            return this.game ? this.game.map.rowCount - 1 : 0;
        }

        private _installKeyHandlers(scope: ng.IScope) {

            scope.$on('keypress:37', () => {
                console.log('left');
                const row: number = this.game.map.currentScreenRow;
                const col: number = this.game.map.currentScreenCol;
                if (col > 0) {
                    this._setCurrentScreen(row, col - 1);
                }
            });
            scope.$on('keypress:38', () => {
                console.log('up');
                const row: number = this.game.map.currentScreenRow;
                const col: number = this.game.map.currentScreenCol;
                if (row > 0) {
                    this._setCurrentScreen(row - 1, col);
                }
            });
            scope.$on('keypress:39', () => {
                console.log('right');
                const row: number = this.game.map.currentScreenRow;
                const col: number = this.game.map.currentScreenCol;
                if (col < this.game.map.colCount - 1) {
                    this._setCurrentScreen(row, col + 1);
                }
            });
            scope.$on('keypress:40', () => {
                console.log('down');
                const row: number = this.game.map.currentScreenRow;
                const col: number = this.game.map.currentScreenCol;
                if (row < this.game.map.rowCount - 1) {
                    this._setCurrentScreen(row + 1, col);
                }
            });
        }

        private _setCurrentScreen(row: number, col: number) {
            this.game.map.setCurrentScreen(row, col);
        }
    }
}

const controllers: ng.IModule = angular.module('editorControllers', []);
controllers.controller('MainCtrl', zeldaEditor.MainController);
