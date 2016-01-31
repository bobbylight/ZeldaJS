module zelda {
    'use strict';

    export class MainGameState extends _BaseState {

        enter(game: gtp.Game) {
            super.enter(game);
            //game.inputManager.setResetKeyStateOnPoll(false);
            game.audio.playMusic(this.getGame().map.music, true);
        }

        render(ctx: CanvasRenderingContext2D) {

            ctx.save();
            ctx.translate(0, 64);

            const screen: Screen = game.map.currentScreen;
            screen.paint(ctx);
            screen.paintActors(ctx);
            game.link.paint(ctx);

            ctx.restore();

            const hudMockup: gtp.Image = <gtp.Image>game.assets.get('hud');
            hudMockup.draw(ctx, 0, 0);
        }

        update(delta: number) {

            super.update(delta);

            game.link.handleInput(game.inputManager);
            game.link.update();
        }
    }
}