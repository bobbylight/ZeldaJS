import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { FadeOutInState, SpriteSheet, Utils } from 'gtp';
import { CurtainOpeningState } from './CurtainOpeningState';
import { LoadingState } from './LoadingState';
import { ZeldaGame } from './ZeldaGame';

const mockImage = {
    draw: vi.fn(),
    height: 5,
    width: 5,
};

const mockSpriteSheet: SpriteSheet = {
    createRecoloredCopy: () => {
        return mockImage;
    },
    gtpImage: mockImage,
} as unknown as SpriteSheet;

describe('LoadingState', () => {
    let game: ZeldaGame;
    let state: LoadingState;

    beforeEach(() => {
        game = new ZeldaGame();
        state = new LoadingState(game);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('update()', () => {
        it('loads assets and sets assetsLoaded to true', () => {
            state.assetsLoaded = false;
            const addImageSpy = vi.spyOn(game.assets, 'addImage');
            const onLoadSpy = vi.spyOn(game.assets, 'onLoad');
            state.enter(game);
            state.update(16);
            expect(state.assetsLoaded).toEqual(true);
            expect(addImageSpy).toHaveBeenCalledWith('loading', 'res/loadingMessage.png');
            expect(onLoadSpy).toHaveBeenCalled();
        });

        it('does not reload assets if already loaded', () => {
            state.assetsLoaded = true;
            const addImageSpy = vi.spyOn(game.assets, 'addImage');
            state.enter(game);
            state.update(16);
            expect(addImageSpy).not.toHaveBeenCalled();
        });

        describe('when the loading image finishes loading', () => {
            let startNewGameSpy: MockInstance<ZeldaGame['startNewGame']>;
            let setStateSpy: MockInstance<ZeldaGame['setState']>;
            let addImageSpy: MockInstance<ZeldaGame['assets']['addImage']>;
            let addSpriteSheetSpy: MockInstance<ZeldaGame['assets']['addSpriteSheet']>;
            let addImageAtlasContentsSpy: MockInstance<ZeldaGame['assets']['addImageAtlasContents']>;
            let addJsonSpy: MockInstance<ZeldaGame['assets']['addJson']>;
            let addSoundSpy: MockInstance<ZeldaGame['assets']['addSound']>;

            beforeEach(() => {
                startNewGameSpy = vi.spyOn(game, 'startNewGame').mockImplementation(() => {
                });
                setStateSpy = vi.spyOn(game, 'setState').mockImplementation(() => {
                });
                addImageSpy = vi.spyOn(game.assets, 'addImage').mockImplementation(() => {});
                addSpriteSheetSpy = vi.spyOn(game.assets, 'addSpriteSheet').mockImplementation(() => {});
                addImageAtlasContentsSpy = vi.spyOn(game.assets, 'addImageAtlasContents').mockImplementation(() => {});
                addJsonSpy = vi.spyOn(game.assets, 'addJson').mockImplementation(() => Promise.resolve('{}'));
                addSoundSpy = vi.spyOn(game.assets, 'addSound').mockImplementation(() => Promise.resolve({} as unknown as ArrayBuffer));
                vi.spyOn(game.assets, 'get').mockImplementation(() => mockSpriteSheet);
                vi.spyOn(game.assets, 'onLoad').mockImplementation((callback) => {
                    callback();
                });
            });

            it('loads all game resources', () => {
                state.enter(game);
                state.update(16);

                expect(addImageSpy).toHaveBeenCalledWith('title', 'res/title.png');
                expect(addSpriteSheetSpy).toHaveBeenCalledWith('font', 'res/font.png', 9, 7, 0, 0);
                expect(addSpriteSheetSpy).toHaveBeenCalledWith('link', 'res/link.png', 16, 16, 1, 1, true);
                expect(addSpriteSheetSpy).toHaveBeenCalledWith('enemies', 'res/enemies.png', 16, 16, 1, 1, true);
                expect(addSpriteSheetSpy).toHaveBeenCalledWith('enemyDies', 'res/enemyDies.png', 16, 16, 1, 1, true);
                expect(addSpriteSheetSpy).toHaveBeenCalledWith('overworld', 'res/overworld.png', 16, 16);
                expect(addSpriteSheetSpy).toHaveBeenCalledWith('labyrinths', 'res/level1.png', 16, 16);
                expect(addImageAtlasContentsSpy).toHaveBeenCalledWith('treaureAtlas', 'res/treasures.png', expect.anything());
                expect(addImageAtlasContentsSpy).toHaveBeenCalledWith('npcAtlas', 'res/npcs.png', expect.anything());
                expect(addImageSpy).toHaveBeenCalledWith('hud', 'res/hud.png');
                expect(addJsonSpy).toHaveBeenCalledWith('overworldData', 'res/data/overworld.json');
                expect(addJsonSpy).toHaveBeenCalledWith('level1Data', 'res/data/level1.json');
                expect(addSoundSpy).toHaveBeenCalledWith('sword', 'res/sounds/sword.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('swordShoot', 'res/sounds/LOZ_Sword_Shoot.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('enemyDie', 'res/sounds/kill.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('enemyHit', 'res/sounds/LOZ_Hit.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('stairs', 'res/sounds/LOZ_Stairs.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('overworldMusic', 'res/sounds/02-overworld.ogg', 5.234);
                expect(addSoundSpy).toHaveBeenCalledWith('labyrinthMusic', 'res/sounds/04-labyrinth.ogg');
                expect(addSoundSpy).toHaveBeenCalledWith('linkDies', 'res/sounds/LOZ_Die.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('text', 'res/sounds/LOZ_Text.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('linkHurt', 'res/sounds/LOZ_Hurt.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('shield', 'res/sounds/LOZ_Shield.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('rupee', 'res/sounds/LOZ_Get_Rupee.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('heart', 'res/sounds/LOZ_Get_Heart.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('bombDrop', 'res/sounds/LOZ_Bomb_Drop.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('bombBlow', 'res/sounds/LOZ_Bomb_Blow.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('getItem', 'res/sounds/LOZ_Get_Item.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('refilling', 'res/sounds/rupees-changing-22050.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('rupeesDecreasingEnd',
                    'res/sounds/rupees-decreasing-end-22050.wav');
                expect(addSoundSpy).toHaveBeenCalledWith('secret', 'res/sounds/LOZ_Secret.wav');
            });

            [ 'true', 'anyValue', '' ].forEach((skipTitleParam) => {
                describe(`when query parameter to skip the title is '${skipTitleParam}'`, () => {
                    beforeEach(() => {
                        vi.spyOn(Utils, 'getRequestParam').mockReturnValue('true');
                    });

                    it('starts a new game', () => {
                        state.enter(game);
                        state.update(16);
                        expect(startNewGameSpy).toHaveBeenCalledOnce();
                    });

                    it('sets state to CurtainOpeningState with MainGameState', () => {
                        state.enter(game);
                        state.update(16);
                        expect(setStateSpy).toHaveBeenCalledOnce();
                        const arg = setStateSpy.mock.calls[0][0];
                        expect(arg).toBeInstanceOf(CurtainOpeningState);
                    });
                });
            });

            describe('when the query param to skip the title is not present', () => {
                it('does not start a new game directly', () => {
                    vi.spyOn(Utils, 'getRequestParam').mockReturnValue(null);
                    state.enter(game);
                    state.update(16);
                    expect(startNewGameSpy).not.toHaveBeenCalled();
                });

                it('sets state to FadeOutInState', () => {
                    vi.spyOn(Utils, 'getRequestParam').mockReturnValue(null);
                    state.enter(game);
                    state.update(16);
                    expect(setStateSpy).toHaveBeenCalled();
                    const arg = setStateSpy.mock.calls[0][0];
                    expect(arg).toBeInstanceOf(FadeOutInState);
                });
            });
        });
    });
});
