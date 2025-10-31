import { Game, SpriteSheet } from 'gtp';
import { GameArgs } from 'gtp/lib/gtp/Game';
import { Link } from './Link';
import { Actor } from './Actor';
import { Animation } from './Animation';
import { Map } from './Map';
import { ItemDropStrategy } from './item/ItemDropStrategy';
import { RupeeIncrementor } from '@/RupeeIncrementor';
import { createEnemyDiesAnimation } from '@/Animations';
import { Enemy } from '@/enemy/Enemy';
import { Hud } from '@/Hud';
import { RowColumnPair } from '@/RowColumnPair';

type MapMap = Record<string, Map>;

export class ZeldaGame extends Game {
    maps: MapMap;
    map: Map;
    link: Link;
    itemDropStrategy: ItemDropStrategy;
    private animations: Animation[];
    private readonly editMode: boolean;
    private paintHitBoxes: boolean;
    private readonly rupeeIncrementor: RupeeIncrementor;
    private readonly hud: Hud;

    constructor(args?: GameArgs & { editMode?: boolean }) {
        super(args);
        this.itemDropStrategy = new ItemDropStrategy();
        this.animations = [];
        this.editMode = args?.editMode ?? false;
        this.paintHitBoxes = false;
        this.rupeeIncrementor = new RupeeIncrementor();
        this.hud = new Hud(this);
    }

    addAnimation(animation: Animation | undefined) {
        if (animation) {
            this.animations.push(animation);
        }
    }

    addEnemyDiesAnimation(source: Enemy) {
        this.animations.push(createEnemyDiesAnimation(this, source, source.x, source.y));
    }

    paintAnimations(ctx: CanvasRenderingContext2D) {
        this.animations.forEach((anim: Animation) => {
            anim.paint(ctx);
        });
    }

    drawStringRed(x: number, y: number, text: string | number,
        ctx?: CanvasRenderingContext2D ) {
        this.drawStringImpl(x, y, text, ctx, 'fontRed');
    }

    drawString(x: number, y: number, text: string | number,
        ctx?: CanvasRenderingContext2D ) {
        this.drawStringImpl(x, y, text, ctx, 'font');
    }

    // TODO: Convert to a gtp BitmapFont
    drawStringImpl(x: number, y: number, text: string | number,
        ctx: CanvasRenderingContext2D = this.getRenderingContext(),
        fontResource: string) {
        const str: string = text.toString(); // Allow us to pass in stuff like numerics

        // Note we have a gtp.SpriteSheet, not a gtp.BitmapFont, so our
        // calculation of what sub-image to draw is a little convoluted
        const fontImage: SpriteSheet = this.assets.get(fontResource);
        const alphaOffs: number = 'A'.charCodeAt(0);
        const numericOffs: number = '0'.charCodeAt(0);
        let index: number;

        for (let i = 0; i < str.length; i++) {
            const ch: string = str[i];
            const chCharCode: number = str.charCodeAt(i);
            if (ch >= 'A' && ch <= 'Z') {
                index = fontImage.colCount + (chCharCode - alphaOffs);
            }
            else if (ch >= '0' && ch <= '9') {
                index = chCharCode - numericOffs;
            }
            else {
                switch (ch) {
                    case '-':
                        index = 10;
                        break;
                    case '.':
                        index = 11;
                        break;
                    case '>':
                        index = 12;
                        break;
                    case '@':
                        index = 13;
                        break;
                    case '!':
                        index = 14;
                        break;
                    default:
                        index = 15; // whitespace
                        break;
                }
            }
            fontImage.drawByIndex(ctx, x, y, index);
            x += 8; // CHAR_WIDTH
        }
    }

    getHud(): Hud {
        return this.hud;
    }

    isWalkable(actor: Actor, x: number, y: number): boolean {
        return this.map.currentScreen.isWalkable(actor, x, y);
    }

    linkDied() {
        if (!this.editMode) {
            this.audio.playMusic('linkDies', false);
        }
    }

    private loadMaps() {
        this.maps = {
            overworld: new Map(this, 'overworld').fromJson(this.assets.get('overworldData')),
            level1: new Map(this, 'level1').fromJson(this.assets.get('level1Data')),
        };

        if (this.editMode) {
            for (const name in this.maps) {
                this.maps[name].showEvents = true;
            }
        }
    }

    getPaintHitBoxes(): boolean {
        return this.paintHitBoxes;
    }

    getRenderingContext(): CanvasRenderingContext2D {
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D rendering context from canvas.');
        }
        return ctx;
    }

    incRupees(rupeeCount: number) {
        this.rupeeIncrementor.increment(this, rupeeCount);
    }

    resumeMusic() {
        if (!this.editMode) {
            const music: string | null | undefined = this.map.currentScreenMusic;
            if (music && music !== 'none') {
                this.audio.playMusic(music, true);
            }
        }
    }

    setMap(name: string, destScreen: RowColumnPair, destPos: RowColumnPair, immediatelyStartMusic = true) {
        this.map = this.maps[name];
        this.map.setCurrentScreen(destScreen.row, destScreen.col);
        this.link.setLocation(destPos.col * 16, destPos.row * 16);

        if (immediatelyStartMusic) {
            this.resumeMusic();
        }
    }

    startNewGame(initLink = true) {
        this.loadMaps();
        this.map = this.maps.overworld;
        this.map.setCurrentScreen(3, 6);
        if (initLink) {
            this.link = new Link(this);
            this.link.setLocation(100, 100);
        }
    }

    togglePaintHitBoxes(): boolean {
        return this.paintHitBoxes = !this.paintHitBoxes;
    }

    updateAnimations() {
        if (!this.link.done && this.animations.length > 0) {
            const newAnimations: Animation[] = [];
            this.animations.forEach((anim: Animation) => {
                anim.update();
                if (!anim.isDone()) {
                    newAnimations.push(anim);
                }
            });
            this.animations = newAnimations;
        }
    }

    updateRupees(delta: number) {
        this.rupeeIncrementor.updateRupees(this, delta);
    }
}
