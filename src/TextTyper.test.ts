import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { AudioSystem } from 'gtp';
import { TextTyper } from './TextTyper';
import { ZeldaGame } from './ZeldaGame';
import { SCREEN_WIDTH, TILE_HEIGHT } from '@/Constants';

const mockAudio = {
    playSound: vi.fn(),
};

describe('TextTyper', () => {
    let game: ZeldaGame;
    let drawStringSpy: MockInstance<ZeldaGame['drawString']>;

    beforeEach(() => {
        game = new ZeldaGame();
        drawStringSpy = vi.spyOn(game, 'drawString').mockImplementation(() => {});
        game.audio = mockAudio as unknown as AudioSystem;
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor()', () => {
        it('marks as done when game is in edit mode', () => {
            vi.spyOn(game, 'isEditMode').mockReturnValue(true);
            const typer = new TextTyper(game, 'hello');
            expect(typer.isDone()).toEqual(true);
        });

        it('is not done when game is not in edit mode', () => {
            vi.spyOn(game, 'isEditMode').mockReturnValue(false);
            const typer = new TextTyper(game, 'hello');
            expect(typer.isDone()).toEqual(false);
        });
    });

    describe('isDone()', () => {
        it('returns true after finishing via update()', () => {
            vi.spyOn(game, 'isEditMode').mockReturnValue(false);
            const typer = new TextTyper(game, 'a', 1);
            // One update with delta >= delay should finish a single-char text
            expect(typer.update(1)).toEqual(true);
        });
    });

    describe('paint()', () => {
        it('does not call drawString when no characters have been revealed', () => {
            vi.spyOn(game, 'isEditMode').mockReturnValue(false);
            const typer = new TextTyper(game, 'hello');
            const ctx = game.getRenderingContext();
            typer.paint(ctx);
            expect(drawStringSpy).not.toHaveBeenCalled();
        });

        it('calls drawString with an increasing number of characters after updates', () => {
            const text = 'hey';
            vi.spyOn(game, 'isEditMode').mockReturnValue(false);
            const typer = new TextTyper(game, text, 1);
            const ctx = game.getRenderingContext();
            const expectedX = (SCREEN_WIDTH - text.length * 8) / 2;
            const expectedY = TILE_HEIGHT * 3 - 10;

            typer.paint(ctx);
            expect(drawStringSpy).not.toHaveBeenCalled();

            typer.update(1);
            typer.paint(ctx);
            expect(drawStringSpy).toHaveBeenLastCalledWith(expectedX, expectedY, 'h', ctx);

            typer.update(1);
            typer.paint(ctx);
            expect(drawStringSpy).toHaveBeenLastCalledWith(expectedX, expectedY, 'he', ctx);

            typer.update(1);
            typer.paint(ctx);
            expect(drawStringSpy).toHaveBeenLastCalledWith(expectedX, expectedY, 'hey', ctx);
            expect(typer.isDone()).toEqual(true);
        });

        it('calls drawString with the full text when in edit mode', () => {
            const text = 'hey';
            vi.spyOn(game, 'isEditMode').mockReturnValue(true);
            const typer = new TextTyper(game, text);
            const ctx = game.getRenderingContext();
            const expectedX = (SCREEN_WIDTH - text.length * 8) / 2;
            const expectedY = TILE_HEIGHT * 3 - 10;
            typer.paint(ctx);
            expect(drawStringSpy).toHaveBeenCalledExactlyOnceWith(expectedX, expectedY, text, ctx);
        });
    });

    describe('update()', () => {
        it('does not play sound when delta is less than delay', () => {
            vi.spyOn(game, 'isEditMode').mockReturnValue(false);
            const typer = new TextTyper(game, 'hello', 50);
            const result = typer.update(10);
            expect(result).toEqual(false);
            expect(mockAudio.playSound).not.toHaveBeenCalled();
        });

        it('plays sound and returns true when finishing the text', () => {
            vi.spyOn(game, 'isEditMode').mockReturnValue(false);
            const typer = new TextTyper(game, 'x', 1);
            const result = typer.update(1);
            expect(result).toEqual(true);
            expect(mockAudio.playSound).toHaveBeenCalledExactlyOnceWith('text');
        });

        it('plays sound each time a character is advanced until done', () => {
            vi.spyOn(game, 'isEditMode').mockReturnValue(false);
            const typer = new TextTyper(game, 'abc', 1);
            expect(typer.update(1)).toEqual(false); // 1st char
            expect(mockAudio.playSound).toHaveBeenCalledExactlyOnceWith('text');
            expect(typer.update(1)).toEqual(false); // 2nd char
            expect(mockAudio.playSound).toHaveBeenCalledTimes(2);
            expect(typer.update(1)).toEqual(true); // 3rd char -> done
            expect(mockAudio.playSound).toHaveBeenCalledTimes(3);
        });
    });
});
