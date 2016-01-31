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
            vm.state = {
                selectedTileIndex: 0
            };

            $scope.$watch('vm.loading', (newVal: boolean, oldVal: boolean) => {
                console.log('yee-haw: ' + newVal + ', ' + oldVal);
                vm.name = 'Robert';
                vm.x = 7;
                vm.game = game;
                vm.game.map = new zelda.Map();

                vm.state.selectedTileIndex = 1;
                vm.loading = false;
            });
            resourceService.load(function() {
                $scope.$apply('vm.loading = false');
            });

        }

        getSelectedTileIndex(): any {
            console.log('Returning: ' + this.state.selectedTileIndex);
            return this.state.selectedTileIndex;
        }

    }
}

const controllers: ng.IModule = angular.module('editorControllers', []);
controllers.controller('MainCtrl', zeldaEditor.MainController);
