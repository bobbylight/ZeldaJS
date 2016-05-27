module zelda {
    'use strict';

    export interface EnemyInfo {
        type: string;
        args?: any[];
        count?: number;
    }

    export class EnemyGroup {

        spawnStyle: string; // TODO: String literal type when gulp-typescript moves up to 1.8
        enemies: EnemyInfo[];

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

        fromJson(json: EnemyGroupData): EnemyGroup {
            if (json) { // Some screens may be empty
                this.spawnStyle = json.spawnStyle;
                this.enemies = json.enemies;
            }
            return this;
        }

        toJson(): EnemyGroupData {
            return {
                spawnStyle: this.spawnStyle,
                enemies: this.enemies
            };
        }

        toString(): string {
            return '[EnemyGroup: ' +
                'size=' + this.enemies.length +
                ']';
        }
    }

    export interface EnemyGroupData {
        enemies: EnemyInfo[];
        spawnStyle: string;
    }
}