import { Screen, ScreenData } from './Screen';
import { Tileset, TilesetData } from './Tileset';
import { EnemyGroup } from './EnemyGroup';
import { Constants } from './Constants';

const HEADER: string = 'ZeldaMap';

export interface MapData {
    header: string;
    name: string;
    screenData: (ScreenData | null)[][];
    tilesetData: TilesetData;
    music: string;
    row: number;
    col: number;
}

export class Map {
    private readonly name: string;
    private readonly _screens: Screen[][];
    private readonly _tileset: Tileset;
    private readonly walkability: number[];
    private readonly labyrinth: boolean;
    private _music: string;
    private _curRow: number;
    private _curCol: number;

    /**
     * A debug flag that, if set, causes value to be shown when rendering.
     */
    showEvents: boolean;

    constructor(name: string, rowCount: number = 8, colCount: number = 16) {
        this.name = name;
        this._screens = [];
        for (let row: number = 0; row < rowCount; row++) {
            this._screens.push(this._createEmptyScreenList(colCount));
        }
        this.labyrinth = !!this.name.match(/level/);
        this.walkability = this.labyrinth ? Constants.WALKABILITY_LEVEL : Constants.WALKABILITY_OVERWORLD;

        this._tileset = new Tileset();
        this._tileset.load('overworld');

        this._curRow = this._curCol = 0;
    }

    addRow(row: number) {
        this._screens.splice(row, 0, this._createEmptyScreenList(this.colCount));
    }

    changeScreensHorizontally(inc: number) {
        this.currentScreen.exit();
        // Add a width of the map to prevent '-1' issues
        const colCount: number = this.colCount;
        this._curCol = (this._curCol + inc + colCount) % colCount;
        this.currentScreen.enter();
    }

    changeScreensVertically(inc: number) {
        this.currentScreen.exit();
        // Add a height of the map to prevent '-1' issues
        const rowCount: number = this.rowCount;
        this._curRow = (this._curRow + inc + rowCount) % rowCount;
        this.currentScreen.enter();
    }

    private static _createDefaultEnemyGroup(): EnemyGroup | null {
        return null;
    }

    private _createEmptyScreenList(colCount: number) {
        const colList: Screen[] = [];
        for (let col: number = 0; col < colCount; col++) {
            colList.push(new Screen(this, Map._createDefaultEnemyGroup()));
        }
        return colList;
    }

    fromJson(json: MapData): Map {
        if (HEADER !== json.header) {
            throw new Error(`Invalid map file: bad header: ${json.header}`);
        }

        this._screens.length = 0;
        json.screenData.forEach((rowOfScreensData: (ScreenData | null)[]) => {
            const screenRow: Screen[] = [];
            rowOfScreensData.forEach((screenData: ScreenData | null) => {
                let screen: Screen = new Screen(this);
                if (screenData) {
                    screen = screen.fromJson(screenData);
                }
                screenRow.push(screen);
            });
            this._screens.push(screenRow);
        });

        this._tileset.fromJson(json.tilesetData);
        this._music = json.music;
        this._curRow = json.row;
        this._curCol = json.col;
        return this;
    }

    get colCount(): number {
        return this._screens[0].length;
    }

    get currentScreen(): Screen {
        return this.getScreen(this._curRow, this._curCol);
    }

    get currentScreenCol(): number {
        return this._curCol;
    }

    /**
     * Returns the music to play for a particular screen in this map.  Optional per-screen music will
     * override the map-wide music.
     *
     * @returns The music to play.
     * @see music
     */
    get currentScreenMusic(): string | null | undefined {
        return this.currentScreen.music ? this.currentScreen.music : this.music;
    }

    get currentScreenRow(): number {
        return this._curRow;
    }

    /**
     * Returns the standard music to play for this map.  This does not take into account per-screen music.
     *
     * @returns The music to play.
     * @see currentScreenMusic
     */
    get music(): string {
        return this._music;
    }

    getName(): string {
        return this.name;
    }

    get rowCount(): number {
        return this._screens.length;
    }

    getScreen(row: number, col: number) {
        return this._screens[row][col];
    }

    get tileset(): Tileset {
        return this._tileset;
    }

    getTilesetName(): string {
        return this._tileset.name;
    }

    getTileTypeWalkability(tileType: number): number {
        return this.walkability[tileType];
    }

    isLabyrinth(): boolean {
        return this.labyrinth;
    }

    setCurrentScreen(row: number, col: number) {
        if (this._curRow && this._curCol) {
            this.currentScreen.exit();
        }

        if (row < this.rowCount && col < this.colCount) {
            this._curRow = row;
            this._curCol = col;
        }
        else {
            this._curRow = this._curCol = 0;
        }

        this.currentScreen.enter();
        return this.currentScreen;
    }

    toJson(): MapData {
        const screenRows: (ScreenData | null)[][] = [];
        this._screens.forEach((rowOfScreens: Screen[]) => {
            screenRows.push(rowOfScreens.map((screen: Screen) => {
                return screen.toJson();
            }));
        });

        return {
            header: HEADER,
            name: this.name,
            screenData: screenRows,
            tilesetData: this._tileset.toJson(),
            music: this._music,
            row: this._curRow,
            col: this._curCol
        };
    }
}
