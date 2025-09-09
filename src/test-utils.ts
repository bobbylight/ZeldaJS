import { Animation } from '@/Animation';
import { SpriteSheet } from 'gtp';
import { ZeldaGame } from '@/ZeldaGame';
import { MAP_HEADER, MapData } from '@/Map';

const createAnimation = (game: ZeldaGame, sheet: SpriteSheet) => {
    const anim = new Animation(game);
    anim.addFrame({
        sheet,
        index: 0,
    },
    0,
    );
    return anim;
};

const createMapData = (data: Partial<MapData>): MapData => {
    return {
        col: 0,
        header: MAP_HEADER,
        music: 'overworld',
        name: 'testMap',
        row: 0,
        screenData: [
            [
                {
                    enemyGroup: null,
                    tiles: [],
                },
            ],
        ],
        tilesetData: {
            name: 'overworld',
        },
        ...data,
    };
};

export { createAnimation, createMapData };
