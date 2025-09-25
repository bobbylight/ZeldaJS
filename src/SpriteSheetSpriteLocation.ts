import { SpriteSheet } from 'gtp';

/**
 * Reference to a specific image in a sprite sheet.
 */
export interface SpriteSheetSpriteLocation {
    sheet: SpriteSheet;
    row: number;
    col: number;
}
