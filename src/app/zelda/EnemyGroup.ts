module zelda {
    'use strict';

    export interface EnemyInfo {
        type: string;
        args?: any[];
        count?: number;
    }

    export class EnemyGroup {

        enemies: EnemyInfo[];
        spawnStyle: string; // TODO: String literal type when gulp-typescript moves up to 1.8

        constructor(spawnStyle: string = 'random', enemies: EnemyInfo[] = []) {
            this.spawnStyle = spawnStyle;
            this.enemies = enemies;
        }

        add(enemy: EnemyInfo) {
            this.enemies.push(enemy);
        }

        clear() {
            this.enemies.length = 0;
        }

        toString(): string {
            return '[EnemyGroup: ' +
                'size=' + this.enemies.length +
                ']';
        }
    }
}