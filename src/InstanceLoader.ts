import * as EnemyTypes from './EnemyTypes';
import { EnemyStrength } from '@/enemy/Enemy';
import { ZeldaGame } from '@/ZeldaGame';

/* eslint-disable */
// TODO: Figure how how to remove this class
export class InstanceLoader {
    static create<T>(className: string, game: ZeldaGame, strength: EnemyStrength = 'red'): T {
        const clazz: any = (EnemyTypes as any)[className];
        return new (Function.prototype.bind.apply(clazz, [ null, game, strength ]));
    }
}
/* eslint-enable */
