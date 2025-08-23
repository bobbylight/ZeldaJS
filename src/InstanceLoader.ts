import * as EnemyTypes from './EnemyTypes';
import { EnemyStrength } from '@/enemy/Enemy';

/* eslint-disable */
// TODO: Figure how how to remove this class
export class InstanceLoader {
    static create<T>(className: string, strength: EnemyStrength = 'red'): T {
        const clazz: any = (EnemyTypes as any)[className];
        return new (Function.prototype.bind.apply(clazz, [ null, strength ]));
    }
}
/* eslint-enable */
