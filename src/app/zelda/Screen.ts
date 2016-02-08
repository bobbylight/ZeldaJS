module zelda {
    'use strict';

    export class Screen {

        private _parent: Map;
        private _tiles: number[][];
        private _actors: Actor[];
        //private _events: Event[];

        constructor(parent: Map, tiles?: number[][]) {

            this._parent = parent;

            if (!tiles) {
                tiles = this._createEmptyTiles();
            }
            this._tiles = tiles;

            this._actors = [];
            //this._events = [];
        }

        addActor(actor: Actor) {
            this._actors.push(actor);
        }

        private _createEmptyTiles(): number[][] {
            const tiles: number[][] = [];
            for (let row: number = 0; row < Constants.SCREEN_ROW_COUNT; row++) {
                const rowData: number[] = [];
                for (let col: number = 0; col < Constants.SCREEN_COL_COUNT; col++) {
                    rowData.push(0);
                }
                tiles.push(rowData);
            }
            return tiles;
        }

        enter() {
            //for (let i: number = 0; i < 3; i++) {
            //    const enemy: Octorok = new Octorok(false);
            //    this._locateSpawnPoitn(enemy);
            //    this._actors.push(enemy);
            //}
        }

        exit() {
            this._actors = [];
        }

        fromJson(json: ScreenData): Screen {
            this._tiles = json.tiles;
            this._actors.length = 0;
            //json.actors.forEach((actorData: ActorData) => {
            //    this._actors.push(new Actor().fromJson(actorData));
            //});
            return this;
        }

        getTile(row: number, col: number): number {
            return this._tiles[row][col];
        }

        isWalkable(actor: Actor, x: number, y: number): boolean {

            const row: number = y / 16;
            const col: number = x / 16;

            if (row < 0 || row >= Constants.SCREEN_ROW_COUNT ||
                    col < 0 || col >= Constants.SCREEN_COL_COUNT) {
                return false;
            }

            const tileType: number = this.getTile(row, col);
            const walkability: number = Constants.WALKABLE[tileType];
            const x0: number = x % 16;
            const y0: number = 15 - (y % 16);

            if (actor instanceof Link) {
                let walkabilityStr: string;
                switch (walkability) {
                    case 1:
                        walkabilityStr = 'true';
                        break;
                    case 2:
                        walkabilityStr = (y0 > 16 - x0).toString();
                        break;
                    case 3:
                        walkabilityStr = (y0 > x0).toString();
                        break;
                    case 4:
                        walkabilityStr = (y0 < x0).toString();
                        break;
                    case 5:
                        walkabilityStr = (y0 < 16 - x0).toString();
                        break;
                    default:
                        walkabilityStr = '???';
                        break;
                }
                console.log(walkability + ' (' + row + ', ' + col + ') - ' + x0 + ', ' + y0 + ': ' + walkabilityStr);
            }

            return walkability === 1 ||
                (walkability === 2 && y0 > 16 - x0) || // Top "\"
                (walkability === 3 && y0 > x0) || // Top "/"
                (walkability === 4 && y0 < x0) || // Bottom "/"
                (walkability === 5 && y0 < 16 - x0); // Bottom "\"
        }

        private _locateSpawnPoint(actor: Actor) {
            while (true) {
                const x: number = game.randomInt(Constants.SCREEN_ROW_COUNT) * 16;
                const y: number = game.randomInt(Constants.SCREEN_COL_COUNT) * 16;
                if (this.isWalkable(actor, x, y)) {
                    actor.setLocation(x, y);
                    return;
                }
            }
        }

        load(data: any) {

            for (let row: number = 0; row < this._tiles.length; row++) {
                for (let col: number = 0; col < this._tiles[row].length; col++) {
                    this._tiles[row][col] = data[row][col];
                }
            }

            // TODO: Load these, don't hard-code them
            for (let row: number = 0; row < this._tiles.length; row++) {
                for (let col: number = 0; col < this._tiles[row].length; col++) {
                    const tile: number = this._tiles[row][col];
                    if (this._parent.tileset.isDoorway(tile)) {
                        const tilePos: Position = new Position(row, col);
                        //this._events.push(new GoDownStairsEvent(tilePos, true, 'overworld',
                        //        new Position(7, 6), new Position(8, 8)));
                    }
                }
            }
        }

        paint(ctx: CanvasRenderingContext2D) {

            const paintWalkability: boolean = false;
            let walkabilityColor: string;
            if (paintWalkability) {
                walkabilityColor = 'red'; //new Color(192,192,255, 192);
                //p = new Polygon();
            }

            for (let row: number = 0; row < this._tiles.length; row++) {
                const y: number = row * Constants.TILE_HEIGHT;
                this.paintRow(ctx, row, y, paintWalkability);
            }
        }

        paintActors(ctx: CanvasRenderingContext2D) {
            this._actors.forEach(function(actor: Actor) {
                actor.paint(ctx);
            });
        }

        /**
         * Paints a specific column of this screen.  Used by the tile editor.
         *
         * @param {CanvasRenderingContext2D} The rendering context.
         * @param {number} col The column to paint.
         * @param {number} y The y-index at which to paint.
         * @param {boolean} paintWalkability Whether to paint a walkability indicator for each tile.
         */
        paintCol(ctx: CanvasRenderingContext2D, col: number, x: number, paintWalkability: boolean = false) {

            const tileset: Tileset = this._parent.tileset;

            for (let row: number = 0; row < this._tiles.length; row++) {

                const y: number = row * Constants.TILE_HEIGHT;
                const tile: number = this._tiles[row][col];
                tileset.paintTile(ctx, tile, x,  y);

                if (paintWalkability) {
                    // TODO: Implement me
                }
            }
        }

        /**
         * Paints a specific row of this screen.  Used by the tile editor.
         *
         * @param {CanvasRenderingContext2D} The rendering context.
         * @param {number} row The row to paint.
         * @param {number} y The y-index at which to paint.
         * @param {boolean} paintWalkability Whether to paint a walkability indicator for each tile.
         */
        paintRow(ctx: CanvasRenderingContext2D, row: number, y: number, paintWalkability: boolean = false) {

            const tileset: Tileset = this._parent.tileset;

            for (let col: number = 0; col < this._tiles[row].length; col++) {

                const x: number = col * Constants.TILE_WIDTH;
                const tile: number = this._tiles[row][col];
                tileset.paintTile(ctx, tile, x, y);

                if (paintWalkability) {
                    // TODO: Implement me
                }
            }
        }

        save() {
            // TODO: Implement me
        }

        setTile(row: number, col: number, tile: number) {
            this._tiles[row][col] = tile;
        }

        toJson(): ScreenData {

            const actorData: ActorData[] = [];
            this._actors.forEach((actor: Actor) => {
                actorData.push(actor.toJson());
            });

            return {
                tiles: this._tiles,
                actors: actorData
            };
        }

        update() {
            this._updateActors();
            this._updateActions();
        }

        private _updateActions() {
            // TODO: Implement me
        }

        private _updateActors() {

            // Handle collisions between actors.  This is really crude, but due
            // to the low number of actors per screen, this works
            for (let i: number = 0; i < this._actors.length; i++) {
                const actor1: Actor = this._actors[i];
                for (let j: number = i + 1; j < this._actors.length; j++) {
                    const actor2: Actor = this._actors[j];
                    if (actor1.intersects(actor2)) {
                        actor1.collidedWith(actor2);
                        actor2.collidedWith(actor1);
                    }
                }
            }

            for (let i: number = 0; i < this._actors.length; i++) {
                const actor: Actor = this._actors[i];
                actor.update();
                if (actor.done) {
                    this._actors.splice(i, 1);
                    i--;
                }
            }
        }
    }

    export interface ScreenData {
        tiles: number[][];
        actors: ActorData[];
    }
}