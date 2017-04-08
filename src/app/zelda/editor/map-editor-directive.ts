import {Constants} from '../Constants';
import {ZeldaGame} from '../ZeldaGame';
import {Screen} from '../Screen';
import {Map} from '../Map';
import * as angular from 'angular';

export class MapEditorController {

    game: ZeldaGame;
    selectedTileIndex: number;
    _armedRow: number;
    _armedCol: number;
    _mouseDown: boolean;

    constructor() {
        this._mouseDown = false;
    }
}

angular.module('editorDirectives')
.directive('mapEditor', [ '$rootScope', '$interval', ($rootScope: ng.IRootScopeService, $interval: ng.IIntervalService) => {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'zelda/editor/templates/map-editor.html',

        scope: {},
        controller: MapEditorController,
        controllerAs: 'vm',
        bindToController: {
            game: '=',
            selectedTileIndex: '='
        },

        link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, controller: MapEditorController): void => {

            const setArmedTile: (e: JQueryEventObject | null) => void = (e: JQueryEventObject | null): void => {
                const screen: Screen = controller.game.map.currentScreen;
                const selectedTileIndex: number = controller.selectedTileIndex;
                screen.setTile(controller._armedRow, controller._armedCol, selectedTileIndex);
                $rootScope.$broadcast('mapChanged', screen); // TODO: Formalize an event for this and make it specific
            };

            const inMainScreen: Function = (x: number, y: number, canvas: HTMLCanvasElement) => {
                return x >= 32 && x < Constants.SCREEN_WIDTH * 2 + 32 &&
                    y >= 32 && y < Constants.SCREEN_HEIGHT * 2 + 32;
            };

            const paintScreenAbovePart: Function = (ctx: CanvasRenderingContext2D) => {
                const map: Map = controller.game.map;
                if (map && map.currentScreenRow > 0) {
                    ctx.translate(16, 0);
                    const screen: Screen = map.getScreen(map.currentScreenRow - 1, map.currentScreenCol);
                    screen.paintRow(ctx, Constants.SCREEN_ROW_COUNT - 1, 0);
                    ctx.translate(-16, 0);
                }
                else {
                    ctx.fillStyle = 'darkgray';
                    ctx.fillRect(16, 0, Constants.SCREEN_WIDTH, 16);
                }
            };

            const paintScreenRightPart: Function = (ctx: CanvasRenderingContext2D) => {
                const map: Map = controller.game.map;
                if (map && map.currentScreenCol < map.colCount - 1) {
                    ctx.translate(0, 16);
                    const screen: Screen = map.getScreen(map.currentScreenRow, map.currentScreenCol + 1);
                    screen.paintCol(ctx, 0, Constants.SCREEN_WIDTH + 16);
                    ctx.translate(0, -16);
                }
                else {
                    ctx.fillStyle = 'darkgray';
                    const x: number = Constants.SCREEN_WIDTH + 16;
                    ctx.fillRect(x, 16, 16, Constants.SCREEN_HEIGHT);
                }
            };

            const paintScreenBelowPart: Function = (ctx: CanvasRenderingContext2D) => {
                const map: Map = controller.game.map;
                if (map && map.currentScreenRow < map.rowCount - 1) {
                    ctx.translate(16, 0);
                    const screen: Screen = map.getScreen(map.currentScreenRow + 1, map.currentScreenCol);
                    screen.paintRow(ctx, 0, Constants.SCREEN_HEIGHT + 16);
                    ctx.translate(-16, 0);
                }
                else {
                    ctx.fillStyle = 'darkgray';
                    const y: number = Constants.SCREEN_HEIGHT + 16;
                    ctx.fillRect(16, y, Constants.SCREEN_WIDTH, 16);
                }
            };

            const paintScreenLeftPart: Function = (ctx: CanvasRenderingContext2D) => {
                const map: Map = controller.game.map;
                if (map && map.currentScreenCol > 0) {
                    ctx.translate(0, 16);
                    const screen: Screen = map.getScreen(map.currentScreenRow, map.currentScreenCol - 1);
                    screen.paintCol(ctx, Constants.SCREEN_COL_COUNT - 1, 0);
                    ctx.translate(0, -16);
                }
                else {
                    ctx.fillStyle = 'darkgray';
                    ctx.fillRect(0, 16, 16, Constants.SCREEN_HEIGHT);
                }
            };

            const possiblyPaintArmedTile: Function = (ctx: CanvasRenderingContext2D) => {
                const armedRow: number = controller._armedRow;
                const armedCol: number = controller._armedCol;
                if (armedRow > -1 && armedCol > -1) {
                    let x: number = armedCol * 16 + 16;
                    let y: number = armedRow * 16 + 16;
                    ctx.globalAlpha = 0.5;
                    controller.game.map.tileset.paintTile(ctx, controller.selectedTileIndex, x, y);
                    ctx.globalAlpha = 1;
                }
            };

            element.on('mousemove', (e: JQueryEventObject) => {

                const source: HTMLCanvasElement = <HTMLCanvasElement>e.target;
                let x: number = e.offsetX;
                let y: number = e.offsetY;

                if (inMainScreen(x, y, source)) {
                    x -= 32;
                    y -= 32;
                    controller._armedCol = Math.floor(x / 32);
                    controller._armedRow = Math.floor(y / 32);
                    console.log('armed tile: ' + controller._armedRow, controller._armedCol);
                    if (controller._mouseDown) {
                        setArmedTile(null);
                    }
                }
                else {
                    controller._armedRow = controller._armedCol = -1;
                }
            });

            element.on('mousedown', () => { controller._mouseDown = true; });
            element.on('mouseup mouseleave', () => { controller._mouseDown = false; });

            element.on('click', setArmedTile);

            const paintScreen: Function = () => {

                const map: Map = controller.game.map;
                if (map) {

                    const canvas: HTMLCanvasElement = <HTMLCanvasElement>element.find('.screen-canvas').get(0);
                    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

                    // Clear needed for translucent parts
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                    ctx.globalAlpha = 0.5;
                    paintScreenAbovePart(ctx);
                    paintScreenRightPart(ctx);
                    paintScreenBelowPart(ctx);
                    paintScreenLeftPart(ctx);
                    ctx.globalAlpha = 1;

                    ctx.translate(16, 16);
                    map.currentScreen.paint(ctx);
                    ctx.translate(-16, -16);

                    possiblyPaintArmedTile(ctx);
                }
            };
            $interval(paintScreen, 50);
        }
    };
}]);
