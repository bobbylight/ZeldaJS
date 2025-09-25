// static TILE_SIZE = 8;//16;

export const CANVAS_WIDTH = 256;
export const CANVAS_HEIGHT = 240;

export const SCREEN_ROW_COUNT = 11;

export const SCREEN_COL_COUNT = 16;

export const TILE_HEIGHT = 16;

export const TILE_WIDTH = 16;

export const HUD_HEIGHT = 64;

export const SCREEN_HEIGHT: number = SCREEN_ROW_COUNT * TILE_HEIGHT;

export const SCREEN_HEIGHT_WITH_HUD: number = SCREEN_HEIGHT + HUD_HEIGHT;

export const SCREEN_WIDTH: number = SCREEN_COL_COUNT * TILE_WIDTH;

export const MUSIC_OVERWORLD = '02-overworld.ogg';

export const MUSIC_LEVEL = '04-labyrinth.ogg';

export const WALKABILITY_LEVEL: number[] = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    9, 8, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0,
    9, 8, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    9, 8, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

export const WALKABILITY_OVERWORLD: number[] = [
    1, 0, 0, 2, 3, 0, 0, 0, 0, 0,
    1, 0, 0, 4, 5, 0, 0, 0, 0, 0,
    1, 0, 0, 2, 3, 0, 0, 0, 0, 0,
    1, 0, 0, 4, 5, 0, 0, 0, 0, 0,
    1, 0, 0, 2, 3, 0, 0, 0, 0, 0,
    1, 0, 0, 4, 5, 0, 0, 0, 0, 0,
    1, 6, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 0, 0, 0, 0, 1, 0, 0, 0,
];
