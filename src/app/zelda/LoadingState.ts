import {CurtainOpeningState} from './CurtainOpeningState';
import {MainGameState} from './MainGameState';
import {TitleState} from './TitleState';
import {BaseState} from './BaseState';
import {Game, BaseStateArgs, Utils, FadeOutInState} from 'gtp';
import {ImageAtlasInfo} from 'gtp/lib/gtp/ImageAtlas';

export class LoadingState extends BaseState {

    assetsLoaded: boolean;
    _loadingImage: any;

    /**
     * State that renders while resources are loading.
     * @constructor
     */
    constructor(args?: Game | BaseStateArgs) {
        super(args);
    }

    update(delta: number) {

        this.handleDefaultKeys();

        if (!this.assetsLoaded) {

            const treasureAtlasInfo: ImageAtlasInfo = {
                prefix: 'treasures.',
                firstPixelIsTranslucent: true,
                images: [
                    { id: 'fullHeart',  x: 0, y: 0, s: 8 },
                    { id: 'halfHeart',  x: 8, y: 0, s: 8 },
                    { id: 'emptyHeart', x: 16, y: 0, s: 8 },
                    { id: 'blueHeart',  x: 0, y: 8, s: 8 }
                ]
            };

            this.assetsLoaded = true;
            const game: Game = this.game;

            // Load assets used by this state first
            game.assets.addImage('loading', 'res/loadingMessage.png');
            game.assets.onLoad(() => {

                this._loadingImage = game.assets.get('loading');

                game.assets.addImage('title', 'res/title.png');
                game.assets.addSpriteSheet('font', 'res/font.png', 9, 7, 0, 0);
                game.assets.addSpriteSheet('link', 'res/link.png', 16, 16, 1, 1, true);
                game.assets.addSpriteSheet('enemies', 'res/enemies.png', 16, 16, 1, 1, true);
                game.assets.addSpriteSheet('enemyDies', 'res/enemyDies.png', 16, 16, 1, 1, true);
                game.assets.addSpriteSheet('overworld', 'res/overworld.png', 16, 16);
                game.assets.addImageAtlasContents('treaureAtlas', 'res/treasures.png', treasureAtlasInfo);
                game.assets.addImage('hud', 'res/hud.png');
                game.assets.addJson('overworldData', 'res/data/overworld.json');
                game.assets.addSound('sword', 'res/sounds/sword.wav');
                game.assets.addSound('enemyDie', 'res/sounds/kill.wav');
                game.assets.addSound('enemyHit', 'res/sounds/LOZ_Hit.wav');
                game.assets.addSound('stairs', 'res/sounds/LOZ_Stairs.wav');
                game.assets.addSound('overworldMusic', 'res/sounds/02-overworld.ogg', 5.234);
                game.assets.addSound('linkDies', 'res/sounds/LOZ_Die.wav');
                game.assets.addSound('text', 'res/sounds/LOZ_Text.wav');
                game.assets.addSound('linkHurt', 'res/sounds/LOZ_Hurt.wav');
                game.assets.addSound('shield', 'res/sounds/LOZ_Shield.wav');
                //game.assets.addImage('sprites', 'res/sprite_tiles.png', true);
                //game.assets.addSpriteSheet('mapTiles', 'res/map_tiles.png', 8,8, 0,0);
                //game.assets.addSpriteSheet('points', 'res/points.png', 18,9, 0,0);
                //game.assets.addJson('levels', 'res/levelData.json');
                //game.assets.addSound(pacman.Sounds.CHASING_GHOSTS, 'res/sounds/chasing_ghosts.wav');
                //game.assets.addSound(pacman.Sounds.CHOMP_1, 'res/sounds/chomp_1.wav');
                //game.assets.addSound(pacman.Sounds.CHOMP_2, 'res/sounds/chomp_2.wav');
                //game.assets.addSound(pacman.Sounds.DIES, 'res/sounds/dies.wav');
                //game.assets.addSound(pacman.Sounds.EATING_FRUIT, 'res/sounds/eating_fruit.wav');
                //game.assets.addSound(pacman.Sounds.EATING_GHOST, 'res/sounds/eating_ghost.wav');
                //game.assets.addSound(pacman.Sounds.EXTRA_LIFE, 'res/sounds/extra_life.wav');
                //game.assets.addSound(pacman.Sounds.EYES_RUNNING, 'res/sounds/eyes_running.wav');
                //game.assets.addSound(pacman.Sounds.INTERMISSION, 'res/sounds/intermission.wav');
                //game.assets.addSound(pacman.Sounds.OPENING, 'res/sounds/opening.wav');
                //game.assets.addSound(pacman.Sounds.SIREN, 'res/sounds/siren.wav');
                //game.assets.addSound(pacman.Sounds.TOKEN, 'res/sounds/token.wav');
                game.assets.onLoad(() => {

                    const skipTitle: string | null = Utils.getRequestParam('skipTitle');
                    if (skipTitle !== null) { // Allow empty strings
                        this.getGame().startNewGame();
                        game.setState(new CurtainOpeningState(new MainGameState()));
                    }
                    else {
                        game.setState(new FadeOutInState(this, new TitleState()));
                    }
                });

            });

        }

    }

}
