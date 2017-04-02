import {ZeldaGame} from '../ZeldaGame';

declare let game: ZeldaGame;

export class ResourceService {

    load(loadCallback: Function) {

        // This mimics what is loaded in LoadingState.
        // TODO: Share this code?
        game.assets.addImage('title', 'res/title.png');
        game.assets.addSpriteSheet('font', 'res/font.png', 9, 7, 0, 0);
        game.assets.addSpriteSheet('link', 'res/link.png', 16, 16, 1, 1, true);
        game.assets.addSpriteSheet('overworld', 'res/overworld.png', 16, 16);
        game.assets.addImage('hud', 'res/hudMockup.png');
        game.assets.addJson('overworldData', 'res/data/overworld.json');

        game.assets.onLoad(loadCallback);
    }
}

angular.module('editorServices', [])
    .service('resourceService', ResourceService);
