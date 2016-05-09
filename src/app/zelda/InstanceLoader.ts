module zelda {
    'use strict';

    export class InstanceLoader {

        static create<T>(className: string, ...args: any[]): T {
            const instance: T = Object.create((<any>zelda)[className].prototype);
            if (args) {
                instance.constructor.apply(instance, args);
            }
            return <T>instance;
        }
    }
}