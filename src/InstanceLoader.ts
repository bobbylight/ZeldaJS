import * as EnemyTypes from './EnemyTypes';
import { EnemyStrength } from '@/enemy/Enemy';

export class InstanceLoader {

    static create<T>(className: string, strength?: EnemyStrength): T {
        const instance: T = Object.create((EnemyTypes as any)[className].prototype);
        if (strength) {
            (instance as any).constructor.apply(instance, [ strength ]);
        }
        return instance;
    }
}
