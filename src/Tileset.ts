import { ZeldaGame } from './ZeldaGame';
import { SpriteSheet } from 'gtp';
declare let game: ZeldaGame;

/**
 * A set of tiles used by a map.
 */
export class Tileset {
    private name: string;
    private tiles: SpriteSheet;

    fromJson(json: TilesetData): this {
        this.load(json.name);
        return this;
    }

    get colCount(): number {
        return this.tiles.colCount;
    }

    get imageCount(): number {
        return this.tiles.size;
    }

    getName(): string {
        return this.name;
    }

    get rowCount(): number {
        return this.tiles.rowCount;
    }

    isDoorway(tile: number): boolean {
        if (this.name === 'overworld') {
            return tile === 61; // The single "door" tile
        }
        return false;
    }

    /**
     * Loads a tile set.
     *
     * @param name The name of the tileset.  This should be the resource name,
     *        as loaded by the game's resource loader.
     */
    load(name: string) {
        this.name = name;
        this.tiles = game.assets.get(name);
    }

    paintTile(ctx: CanvasRenderingContext2D, tile: number, x: number, y: number) {
        this.tiles.drawByIndex(ctx, x, y, tile);
    }

    toJson(): TilesetData {
        return {
            name: this.name
        };
    }
}

export interface TilesetData {
    name: string;
}
