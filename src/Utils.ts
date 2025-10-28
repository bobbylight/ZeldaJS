import { Image, SpriteSheet } from 'gtp';

interface ColorChange {
    fromR: number;
    fromG: number;
    fromB: number;
    toR: number;
    toG: number;
    toB: number;
}

// TODO: Move this into gtp!
/**
 * Returns a recolored version of the sprite sheet.
 * @param ss The sprite sheet to create a recolored copy of.
 * @param colorChanges The changes to make.
 * @returns The recolored sprite sheet.
 */
function createRecoloredSpriteSheet(ss: SpriteSheet, ...colorChanges: ColorChange[]): SpriteSheet {
    const image = ss.gtpImage;

    const newCanvas = document.createElement('canvas');
    newCanvas.width = image.width;
    newCanvas.height = image.height;
    const newCtx = newCanvas.getContext('2d');
    if (!newCtx) {
        throw new Error('Could not render to a temporary canvas!');
    }
    image.draw(newCtx, 0, 0);

    const imageData = newCtx.getImageData(0, 0, newCanvas.width, newCanvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        for (const colorChange of colorChanges) {
            if (r === colorChange.fromR && g === colorChange.fromG && b === colorChange.fromB) {
                pixels[i] = colorChange.toR;
                pixels[i + 1] = colorChange.toG;
                pixels[i + 2] = colorChange.toB;
                break;
            }
        }
    }

    newCtx.putImageData(imageData, 0, 0);
    const newImage = new Image(newCanvas);
    return new SpriteSheet(newImage, ss.cellW, ss.cellH, ss.spacingX, ss.spacingY);
}

export { ColorChange, createRecoloredSpriteSheet };
