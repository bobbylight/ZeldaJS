import * as EnemyTypes from './EnemyTypes';
import { EnemyStrength } from '@/enemy/Enemy';

export class InstanceLoader {

    static create<T>(className: string, strength: EnemyStrength = 'red'): T {
        const instance: T = Object.create((EnemyTypes as any)[className].prototype);
        (instance as any).constructor.apply(instance, [ strength ]);
        return instance;
    }
}
