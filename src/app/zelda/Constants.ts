export class Constants {

    //static TILE_SIZE = 8;//16;

    static readonly CANVAS_WIDTH: number = 256;
    static readonly CANVAS_HEIGHT: number = 240;

    static readonly SCREEN_ROW_COUNT: number	= 11;

    static readonly SCREEN_COL_COUNT: number	= 16;

    static readonly TILE_HEIGHT: number = 16;

    static readonly TILE_WIDTH: number = 16;

    static readonly HUD_HEIGHT: number = 64;

    static readonly SCREEN_HEIGHT: number = Constants.SCREEN_ROW_COUNT * Constants.TILE_WIDTH;

    static readonly SCREEN_HEIGHT_WITH_HUD: number = Constants.SCREEN_HEIGHT + Constants.HUD_HEIGHT;

    static readonly SCREEN_WIDTH: number = Constants.SCREEN_COL_COUNT * Constants.TILE_WIDTH;

    static readonly MUSIC_OVERWORLD: string = '02-overworld.ogg';

    static readonly MUSIC_LEVEL: string = '04-labyrinth.ogg';

    static readonly WALKABILITY_LEVEL: number[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    static readonly WALKABILITY_OVERWORLD: number[] = [
        1, 0, 0, 2, 3, 0, 0, 0, 0, 0,
        1, 0, 0, 4, 5, 0, 0, 0, 0, 0,
        1, 0, 0, 2, 3, 0, 0, 0, 0, 0,
        1, 0, 0, 4, 5, 0, 0, 0, 0, 0,
        1, 0, 0, 2, 3, 0, 0, 0, 0, 0,
        1, 0, 0, 4, 5, 0, 0, 0, 0, 0,
        1, 6, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 0, 0, 0, 0, 1, 0, 0, 0
    ];
}
