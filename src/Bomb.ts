import { Image, Rectangle } from 'gtp';
import { Actor } from './Actor';
import { ZeldaGame } from './ZeldaGame';
import { Link } from './Link';
import { BombSmoke } from '@/BombSmoke';
import { HERO_HITBOX_STYLE } from '@/Constants';

/**
 * A bomb Link has dropped, waiting to explode.
 */
export class Bomb extends Actor {
    private frame: number;

    // Bomb is visible for 60 frames == 1 second before exploding
    private static readonly MAX_FRAME: number = 60;

    constructor(game: ZeldaGame) {
        super(game);

        const link: Link = game.link;
        this.dir = link.dir;
        this.frame = Bomb.MAX_FRAME;

        switch (this.dir) {
            case 'DOWN':
                this.x = link.x + 4;
                this.y = link.y + 16;
                break;

            case 'LEFT':
                this.x = link.x - 16 + 4;
                this.y = link.y;
                break;

            case 'UP':
                this.x = link.x + 4;
                this.y = link.y - 16;
                break;

            case 'RIGHT':
                this.x = link.x + 16 + 4;
                this.y = link.y;
                break;
        }

        this.hitBox = new Rectangle();
    }

    collidedWith(other: Actor): boolean {
        // Do nothing
        return false;
    }

    private explode() {
        const game = this.game;
        game.audio.playSound('bombBlow');

        game.map.currentScreen.addActor(new BombSmoke(this.game, this.dir, this.x, this.y));
    }

    override getHitBoxStyle(): string {
        return HERO_HITBOX_STYLE;
    }

    override paintImpl(ctx: CanvasRenderingContext2D) {
        if (this.frame < Bomb.MAX_FRAME - 2) { // First two frames, we aren't painted
            const image: Image = this.game.assets.get('treasures.bomb');
            image.draw(ctx, this.x, this.y);
        }
    }

    override update() {
        super.update();
        const link: Link = this.game.link;
        this.frame--;

        // This "16" magic number matches how long Link is frozen swinging his sword.
        // Not sure if that matches the game or not...
        if (this.frame === Bomb.MAX_FRAME - 16) {
            link.frozen = false;
            link.step = Link.FRAME_STILL;
        }
        else if (this.frame === 0) {
            this.explode();
            this.done = true;
        }
    }
}
