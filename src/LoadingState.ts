import { FadeOutInState, Game, ImageAtlasInfo, SpriteSheet, Utils } from 'gtp';
import { CurtainOpeningState } from './CurtainOpeningState';
import { MainGameState } from './MainGameState';
import { TitleState } from './TitleState';
import { BaseState } from './BaseState';

/**
 * State that renders while resources are loading.
 */
export class LoadingState extends BaseState {
    assetsLoaded: boolean;

    override update(delta: number) {
        this.handleDefaultKeys();

        if (!this.assetsLoaded) {
            const npcAtlasInfo: ImageAtlasInfo = {
                prefix: 'npcs.',
                firstPixelIsTranslucent: true,
                images: [
                    { id: 'oldMan1', x: 1, y: 11, s: 16 },
                    { id: 'oldMan2', x: 18, y: 11, s: 16 },
                    { id: 'fire1', x: 51, y: 11, s: 16 },
                    { id: 'fire2', x: 68, y: 11, s: 16 },
                    { id: 'merchant', x: 126, y: 11, s: 16 },
                ],
            };
            const treasureAtlasInfo: ImageAtlasInfo = {
                prefix: 'treasures.',
                firstPixelIsTranslucent: true,
                images: [

                    { id: 'fullHeart', x: 0, y: 0, s: 8 },
                    { id: 'halfHeart', x: 8, y: 0, s: 8 },
                    { id: 'emptyHeart', x: 16, y: 0, s: 8 },
                    { id: 'blueHeart', x: 0, y: 8, s: 8 },

                    { id: 'yellowRupee', x: 72, y: 0, w: 8, h: 16 },
                    { id: 'blueRupee', x: 72, y: 16, w: 8, h: 16 },

                    { id: 'bomb', x: 136, y: 0, w: 8, h: 14 },
                ],
            };

            this.assetsLoaded = true;
            const game: Game = this.game;

            // Load assets used by this state first
            game.assets.addImage('loading', 'res/loadingMessage.png');
            game.assets.onLoad(() => {
                game.assets.addImage('title', 'res/title.png');
                game.assets.addSpriteSheet('font', 'res/font.png', 9, 7, 0, 0);
                game.assets.addSpriteSheet('link', 'res/link.png', 16, 16, 1, 1, true);
                game.assets.addSpriteSheet('enemies', 'res/enemies.png', 16, 16, 1, 1, true);
                game.assets.addSpriteSheet('enemyDies', 'res/enemyDies.png', 16, 16, 1, 1, true);
                game.assets.addSpriteSheet('overworld', 'res/overworld.png', 16, 16);
                game.assets.addSpriteSheet('labyrinths', 'res/level1.png', 16, 16);
                game.assets.addImageAtlasContents('treaureAtlas', 'res/treasures.png', treasureAtlasInfo);
                game.assets.addImageAtlasContents('npcAtlas', 'res/npcs.png', npcAtlasInfo);
                game.assets.addImage('hud', 'res/hud.png');
                game.assets.addJson('overworldData', 'res/data/overworld.json');
                game.assets.addJson('level1Data', 'res/data/level1.json');
                game.assets.addSound('sword', 'res/sounds/sword.wav');
                game.assets.addSound('swordShoot', 'res/sounds/LOZ_Sword_Shoot.wav');
                game.assets.addSound('enemyDie', 'res/sounds/kill.wav');
                game.assets.addSound('enemyHit', 'res/sounds/LOZ_Hit.wav');
                game.assets.addSound('stairs', 'res/sounds/LOZ_Stairs.wav');
                game.assets.addSound('overworldMusic', 'res/sounds/02-overworld.ogg', 5.234);
                game.assets.addSound('labyrinthMusic', 'res/sounds/04-labyrinth.ogg');
                game.assets.addSound('linkDies', 'res/sounds/LOZ_Die.wav');
                game.assets.addSound('text', 'res/sounds/LOZ_Text.wav');
                game.assets.addSound('linkHurt', 'res/sounds/LOZ_Hurt.wav');
                game.assets.addSound('shield', 'res/sounds/LOZ_Shield.wav');
                game.assets.addSound('rupee', 'res/sounds/LOZ_Get_Rupee.wav');
                game.assets.addSound('heart', 'res/sounds/LOZ_Get_Heart.wav');
                game.assets.addSound('bombDrop', 'res/sounds/LOZ_Bomb_Drop.wav');
                game.assets.addSound('bombBlow', 'res/sounds/LOZ_Bomb_Blow.wav');
                game.assets.addSound('getItem', 'res/sounds/LOZ_Get_Item.wav');
                // Used for both rupees and hearts? TBD? If it doesn't work for hearts, LOZ_Refill_Loop.wav will
                game.assets.addSound('refilling', 'res/sounds/rupees-changing-22050.wav');
                game.assets.addSound('rupeesDecreasingEnd', 'res/sounds/rupees-decreasing-end-22050.wav');
                game.assets.addSound('secret', 'res/sounds/LOZ_Secret.wav');
                game.assets.onLoad(() => {
                    // Generate a red version of the font
                    const ss: SpriteSheet = game.assets.get('font');
                    game.assets.set('fontRed', ss.createRecoloredCopy({
                        fromR: 0xf8, fromG: 0xf8, fromB: 0xf8, toR: 0xa2, toG: 0x3a, toB: 0x2a,
                    }));

                    const skipTitle: string | null = Utils.getRequestParam('skipTitle');
                    if (skipTitle !== null) { // Allow empty strings
                        this.game.startNewGame();
                        game.setState(new CurtainOpeningState(this.game, new MainGameState(this.game)));
                    }
                    else {
                        game.setState(new FadeOutInState(this, new TitleState(this.game)));
                    }
                });
            });
        }
    }
}
