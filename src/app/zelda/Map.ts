module zelda {
    'use strict';

    const HEADER: string = 'ZeldaMap';

    export interface MapData {
        header: string;
        screenData: ScreenData[][];
        tilesetData: TilesetData;
        music: string;
        row: number;
        col: number;
    }

    export class Map {

        private _screens: Screen[][];
        private _tileset: Tileset;
        private _music: string;
        private _curRow: number;
        private _curCol: number;

        constructor(rowCount: number = 8, colCount: number = 16) {

            this._screens = [];
            for (let row: number = 0; row < rowCount; row++) {
                this._screens.push(this._createEmptyScreenList(colCount));
            }

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

        private _createEmptyScreenList(colCount: number) {
            const colList: Screen[] = [];
            for (let col: number = 0; col < colCount; col++) {
                colList.push(new Screen(this));
            }
            return colList;
        }

        fromJson(json: MapData): Map {

            if (HEADER !== json.header) {
                throw new Error('Invalid map file: bad header: ' + json.header);
            }

            this._screens.length = 0;
            json.screenData.forEach((rowOfScreensData: ScreenData[]) => {
                const screenRow: Screen[] = [];
                rowOfScreensData.forEach((screenData: ScreenData) => {
                    screenRow.push(new Screen(this).fromJson(screenData));
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

        get currentScreenRow(): number {
            return this._curRow;
        }

        get music(): string {
            return this._music;
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

        load(data: any) {

            if (HEADER !== data.header) {
                throw new Error('Invalid map file: bad header: ' + data.header);
            }

            this._music = data.music;

            const mapData: any = data.mapData;
            mapData.forEach((rowData: any) => {

                const mapRow: Screen[] = [];
                rowData.forEach((screenData: any) => {
                    const screen: Screen = new Screen(this);
                    screen.load(screenData);
                    mapRow.push(screen);
                });

                this._screens.push(mapRow);
            });
        }

        setCurrentScreen(row: number, col: number) {
            if (this._curRow && this._curCol) {
                this.currentScreen.exit();
            }
            this._curRow = row;
            this._curCol = col;
            this.currentScreen.enter();
            return this.currentScreen;
        }

        toJson(): MapData {

            const screenRows: ScreenData[][] = [];
            this._screens.forEach((rowOfScreens: Screen[]) => {
                screenRows.push(rowOfScreens.map((screen: Screen) => { return screen.toJson(); }));
            });

            return {
                header: HEADER,
                screenData: screenRows,
                tilesetData: this._tileset.toJson(),
                music: this._music,
                row: this._curRow,
                col: this._curCol
            };
        }

    }
}