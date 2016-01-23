module zelda {
    'use strict';

    export class Constants {

        static SCREEN_ROW_COUNT: number	= 11;

        static SCREEN_COL_COUNT: number	= 16;

        static TILE_HEIGHT: number = 16;

        static TILE_WIDTH: number = 16;

        static HUD_HEIGHT: number = 64;

        static SCREEN_HEIGHT: number = Constants.SCREEN_ROW_COUNT * Constants.TILE_WIDTH;

        static SCREEN_HEIGHT_WITH_HUD: number = Constants.SCREEN_HEIGHT + Constants.HUD_HEIGHT;

        static SCREEN_WIDTH: number = Constants.SCREEN_COL_COUNT * Constants.TILE_WIDTH;

        static  MUSIC_OVERWORLD: string = '02-overworld.ogg';

        static WALKABLE: number[] = [
            1, 0, 0, 2, 3, 0, 0, 0, 0, 0,
            1, 0, 0, 4, 5, 0, 0, 0, 0, 0,
            1, 0, 0, 2, 3, 0, 0, 0, 0, 0,
            1, 0, 0, 4, 5, 0, 0, 0, 0, 0,
            1, 0, 0, 2, 3, 0, 0, 0, 0, 0,
            1, 0, 0, 4, 5, 0, 0, 0, 0, 0,
            1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
    }
}