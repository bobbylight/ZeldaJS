import { v4 as uuidv4 } from 'uuid';
import { EnemyStrength } from '@/enemy/Enemy';

export interface EnemyInfo {
    id: string;
    type: string;
    strength?: EnemyStrength;
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

    /**
     * Clones this enemy group, optionally flattening it.
     *
     * @param flatten Whether the enemy list should be flattened.
     * @returns The clone of this enemy group.
     * @see flatten
     */
    clone(flatten: boolean = false): EnemyGroup {
        const newEnemyGroup: EnemyGroup = new EnemyGroup(this.spawnStyle, this.enemies);
        return flatten ? newEnemyGroup.flatten() : newEnemyGroup;
    }

    /**
     * Coverts any EnemyInfo instances in this group that contain multiple enemies into multiple EnemyInfo instances
     * representing a single enemy.
     *
     * @returns This enemy group.
     */
    flatten(): this {
        const flattenedEnemies: EnemyInfo[] = [];

        this.enemies.forEach((enemyGroup: EnemyInfo) => {
            const count: number = enemyGroup.count ?? 1;
            for (let i: number = 0; i < count; i++) {
                flattenedEnemies.push({
                    id: uuidv4(),
                    type: enemyGroup.type,
                    strength: enemyGroup.strength,
                    count: 1
                });
            }
        });

        this.enemies = flattenedEnemies;
        return this;
    }

    fromJson(json?: EnemyGroupData | null): this {
        if (json) { // Some maps may be empty
            this.spawnStyle = json.spawnStyle;
            this.enemies = json.enemies;

            // Old saves won't have 'id' properties
            this.enemies.forEach((ei: EnemyInfo) => {
                if (!ei.id) {
                    ei.id = uuidv4();
                }
            });
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
        return `[EnemyGroup: size=${this.enemies.length}]`;
    }
}

export interface EnemyGroupData {
    enemies: EnemyInfo[];
    spawnStyle: string;
}
