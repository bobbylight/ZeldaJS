import * as EnemyTypes from './EnemyTypes';

export class InstanceLoader {

    static create<T>(className: string, ...args: any[]): T {
        const instance: T = Object.create((EnemyTypes as any)[className].prototype);
        if (args) {
            instance.constructor.apply(instance, args);
        }
        return instance;
    }
}
