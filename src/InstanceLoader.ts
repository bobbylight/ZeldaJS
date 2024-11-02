import * as EnemyTypes from './EnemyTypes';
import { EnemyStrength } from '@/enemy/Enemy';

export class InstanceLoader {
    static create<T>(className: string, strength: EnemyStrength = 'red'): T {
        const clazz: any = (EnemyTypes as any)[className];
        return new (Function.prototype.bind.apply(clazz, [ null, strength ]));
    }
}
