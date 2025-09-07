import { Screen, ScreenData } from './Screen';
import { Tileset, TilesetData } from './Tileset';
import { EnemyGroup } from './EnemyGroup';
import { WALKABILITY_LEVEL, WALKABILITY_OVERWORLD } from './Constants';
import { ZeldaGame } from '@/ZeldaGame';

const HEADER = 'ZeldaMap';

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
    private readonly screens: Screen[][];
    private readonly tileset: Tileset;
    private readonly walkability: number[];
    private readonly labyrinth: boolean;
    private music: string;
    private curRow: number;
    private curCol: number;

    /**
     * A debug flag that, if set, causes value to be shown when rendering.
     */
    showEvents: boolean;

    constructor(private readonly game: ZeldaGame, name: string, rowCount = 8, colCount = 16) {
        this.name = name;
        this.screens = [];
        for (let row = 0; row < rowCount; row++) {
            this.screens.push(this.createEmptyScreenList(colCount));
        }
        this.labyrinth = this.name.startsWith('level');
        this.walkability = this.labyrinth ? WALKABILITY_LEVEL : WALKABILITY_OVERWORLD;

        this.tileset = new Tileset(game);
        this.tileset.load('overworld');

        this.curRow = this.curCol = 0;
    }

    addRow(row: number) {
        this.screens.splice(row, 0, this.createEmptyScreenList(this.colCount));
    }

    changeScreensHorizontally(inc: number) {
        this.currentScreen.exit();
        // Add a width of the map to prevent '-1' issues
        const colCount: number = this.colCount;
        this.curCol = (this.curCol + inc + colCount) % colCount;
        this.currentScreen.enter(this.game);
    }

    changeScreensVertically(inc: number) {
        this.currentScreen.exit();
        // Add a height of the map to prevent '-1' issues
        const rowCount: number = this.rowCount;
        this.curRow = (this.curRow + inc + rowCount) % rowCount;
        this.currentScreen.enter(this.game);
    }

    private static createDefaultEnemyGroup(): EnemyGroup {
        return new EnemyGroup();
    }

    private createEmptyScreenList(colCount: number) {
        const colList: Screen[] = [];
        for (let col = 0; col < colCount; col++) {
            colList.push(new Screen(this, Map.createDefaultEnemyGroup()));
        }
        return colList;
    }

    fromJson(json: MapData): this {
        if (HEADER !== json.header) {
            throw new Error(`Invalid map file: bad header: ${json.header}`);
        }

        this.screens.length = 0;
        json.screenData.forEach((rowOfScreensData: (ScreenData | null)[]) => {
            const screenRow: Screen[] = [];
            rowOfScreensData.forEach((screenData: ScreenData | null) => {
                let screen: Screen = new Screen(this);
                if (screenData) {
                    screen = screen.fromJson(screenData);
                }
                screenRow.push(screen);
            });
            this.screens.push(screenRow);
        });

        this.tileset.fromJson(json.tilesetData);
        this.music = json.music;
        this.curRow = json.row;
        this.curCol = json.col;
        return this;
    }

    get colCount(): number {
        return this.screens[0].length;
    }

    get currentScreen(): Screen {
        return this.getScreen(this.curRow, this.curCol);
    }

    get currentScreenCol(): number {
        return this.curCol;
    }

    /**
     * Returns the music to play for a particular screen in this map.  Optional per-screen music will
     * override the map-wide music.
     *
     * @returns The music to play.
     * @see music
     */
    get currentScreenMusic(): string | null | undefined {
        return this.currentScreen.music ?? this.music;
    }

    get currentScreenRow(): number {
        return this.curRow;
    }

    /**
     * Returns the standard music to play for this map.  This does not take into account per-screen music.
     *
     * @returns The music to play.
     * @see currentScreenMusic
     */
    getMusic(): string {
        return this.music;
    }

    getName(): string {
        return this.name;
    }

    get rowCount(): number {
        return this.screens.length;
    }

    getScreen(row: number, col: number) {
        return this.screens[row][col];
    }

    getTileset(): Tileset {
        return this.tileset;
    }

    getTilesetName(): string {
        return this.tileset.getName();
    }

    getTileTypeWalkability(tileType: number): number {
        return this.walkability[tileType];
    }

    isLabyrinth(): boolean {
        return this.labyrinth;
    }

    setCurrentScreen(row: number, col: number) {
        if (this.curRow && this.curCol) {
            this.currentScreen.exit();
        }

        if (row < this.rowCount && col < this.colCount) {
            this.curRow = row;
            this.curCol = col;
        }
        else {
            this.curRow = this.curCol = 0;
        }

        this.currentScreen.enter(this.game);
        return this.currentScreen;
    }

    toJson(): MapData {
        const screenRows: (ScreenData | null)[][] = [];
        this.screens.forEach((rowOfScreens: Screen[]) => {
            screenRows.push(rowOfScreens.map((screen: Screen) => {
                return screen.toJson();
            }));
        });

        return {
            header: HEADER,
            name: this.name,
            screenData: screenRows,
            tilesetData: this.tileset.toJson(),
            music: this.music,
            row: this.curRow,
            col: this.curCol,
        };
    }
}
