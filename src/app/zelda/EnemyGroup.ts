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
    flatten(): EnemyGroup {

        const flattenedEnemies: EnemyInfo[] = [];

        this.enemies.forEach((enemyGroup: EnemyInfo) => {
            const count: number = enemyGroup.count || 1;
            for (let i: number = 0; i < count; i++) {
                flattenedEnemies.push({ type: enemyGroup.type, args: enemyGroup.args, count: 1 });
            }
        });

        this.enemies = flattenedEnemies;
        return this;
    }

    fromJson(json?: EnemyGroupData | null): EnemyGroup {
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
