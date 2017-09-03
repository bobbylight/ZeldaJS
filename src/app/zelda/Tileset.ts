import { ZeldaGame } from './ZeldaGame';
import { SpriteSheet } from 'gtp';
declare let game: ZeldaGame;

/**
 * A set of tiles used by a map.
 */
export class Tileset {

    private _name: string;
    private _tiles: SpriteSheet;

    fromJson(json: TilesetData): Tileset {
        this.load(json.name);
        return this;
    }

    get colCount(): number {
        return this._tiles.colCount;
    }

    get imageCount(): number {
        return this._tiles.size;
    }

    get name(): string {
        return this._name;
    }

    get rowCount(): number {
        return this._tiles.rowCount;
    }

    isDoorway(tile: number): boolean {
        if ('overworld' === this._name) {
            return tile === 61; // The single "door" tile
        }
        return false;
    }

    /**
     * Loads a tile set.
     *
     * @param {string} name The name of the tileset.  This should be the resource name,
     *        as loaded by the game's resource loader.
     */
    load(name: string) {
        this._name = name;
        this._tiles = game.assets.get(name) as SpriteSheet;
    }

    paintTile(ctx: CanvasRenderingContext2D, tile: number, x: number, y: number) {
        this._tiles.drawByIndex(ctx, x, y, tile);
    }

    toJson(): TilesetData {
        return {
            name: this._name
        };
    }
}

export interface TilesetData {
    name: string;
}
