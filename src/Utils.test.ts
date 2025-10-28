import { describe, expect, it } from 'vitest';
import { Image, SpriteSheet } from 'gtp';
import { createRecoloredSpriteSheet } from '@/Utils';

describe('Utils', () => {
    describe('createRecoloredSpriteSheet', () => {
        it('works', () => {
            // Create a 2x1 canvas with 1 white and 1 black pixel
            const origCanvas = document.createElement('canvas');
            origCanvas.width = 2;
            origCanvas.height = 1;
            const origCtx = origCanvas.getContext('2d');
            if (!origCtx) {
                throw new Error('Could not get context');
            }
            const origPixelData = origCtx.getImageData(0, 0, 2, 1);
            origPixelData.data[0] = 0xff;
            origPixelData.data[1] = 0xff;
            origPixelData.data[2] = 0xff;
            origPixelData.data[3] = 0xff;
            origPixelData.data[4] = 0x00;
            origPixelData.data[5] = 0x00
            origPixelData.data[6] = 0x00;
            origPixelData.data[7] = 0xff;
            origCtx.putImageData(origPixelData, 0, 0);

            // Create a sprite sheet from that canvas
            const origImage = new Image(origCanvas);
            const origSS = new SpriteSheet(origImage, 1, 1);

            // Create a new sprite sheet from the original with inverted colors.
            // Render it to a new canvas
            const newSS = createRecoloredSpriteSheet(origSS, {
                fromR: 0xff, fromG: 0xff, fromB: 0xff, toR: 0x00, toG: 0x00, toB: 0x00,
            }, {
                fromR: 0x00, fromG: 0x00, fromB: 0x00, toR: 0xff, toG: 0xff, toB: 0xff,
            });
            const newSSCanvas = document.createElement('canvas');
            newSSCanvas.width = 2;
            newSSCanvas.height = 1;
            const newSSCtx = newSSCanvas.getContext('2d');
            if (!newSSCtx) {
                throw new Error('Could not get context');
            }
            newSS.gtpImage.draw(newSSCtx, 0, 0);

            // Verify the colors are inverted
            const newPixelData = newSSCtx.getImageData(0, 0, 2, 1);
            expect(newPixelData.data[0]).toEqual(0x00);
            expect(newPixelData.data[1]).toEqual(0x00);
            expect(newPixelData.data[2]).toEqual(0x00);
            expect(newPixelData.data[3]).toEqual(0xff);
            expect(newPixelData.data[4]).toEqual(0xff);
            expect(newPixelData.data[5]).toEqual(0xff);
        });
    });
});
