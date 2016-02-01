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

                    vm.state.selectedTileIndex = 1;
                    vm.loading = false;
                }
            });
            resourceService.load(function() {
                //vm.loading = false;
                console.log('DEBUG: resourceService.load() callback called');
                $scope.$apply('vm.loading = false;');
            });

        }

    }
}

const controllers: ng.IModule = angular.module('editorControllers', []);
controllers.controller('MainCtrl', zeldaEditor.MainController);
