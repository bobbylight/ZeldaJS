import { SpriteSheet } from 'gtp';

/**
 * A tuple representing a specific image in a sprite sheet.
 */
export interface SpriteSheetAndIndex {
    sheet: SpriteSheet;
    index: number;
}
