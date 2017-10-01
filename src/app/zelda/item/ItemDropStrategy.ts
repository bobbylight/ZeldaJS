import { Enemy } from '../enemy/Enemy';
import { AbstractItem } from './AbstractItem';
import { Heart } from './Heart';
import { Rupee } from './Rupee';

type EnemyClass = 'A' | 'B' | 'C' | 'D' | 'X';

/**
 * Decides what item an enemy should drop according to the algorithm used by the game.
 * http://www.zeldaspeedruns.com/loz/generalknowledge/item-drops-chart
 */
export class ItemDropStrategy {

    private enemyTypeToEnemyClassMap: { [ name: string ]: EnemyClass };
    private itemDropTable: { [ enemyClass: string /*EnemyClass*/ ]: (string | null)[] };
    private counter: number;

    constructor() {

        this.counter = 0;

        this.enemyTypeToEnemyClassMap = {
            redOctorok: 'A',
            redTektite: 'A',
            redMoblin: 'A',

            blueOctorok: 'B',
            blueMoblin: 'B',

            blueTektite: 'C'
        };

        this.itemDropTable = {
            'A': [ 'rupee', 'heart', 'rupee', null, 'rupee', 'heart', 'heart', 'rupee', 'rupee', 'heart' ],
            'B': [ null, 'rupee', null, 'rupee', 'heart', null, 'rupee', null, 'heart', 'heart' ],
            'C': [ 'rupee', 'heart', 'rupee', 'blueRupee', 'heart', null, 'rupee', 'rupee', 'rupee', 'blueRupee' ],
            'D': [ 'heart', null, 'rupee', 'heart', null, 'heart', 'heart', 'heart', 'rupee', 'heart' ]
        };
    }

    itemDropped(enemy: Enemy): AbstractItem | null {

        let item: AbstractItem | null = null;
        console.log(enemy.enemyName);

        let enemyClass: EnemyClass | null = this.enemyTypeToEnemyClassMap[enemy.enemyName];
        if (!enemyClass) {
            console.error(`Enemy class not known to ItemDropStrategy: ${enemy.enemyName}`);
            enemyClass = 'A';
        }

        if (enemyClass !== 'X') {
            const itemDropRow: (string | null)[] = this.itemDropTable[enemyClass];
            const itemName: string | null | undefined = itemDropRow[this.counter];
            if (itemName) {
                item = this.createItem(enemy, itemName);
            }
        }

        this.counter = (this.counter + 1) % 10;
        return item;
    }

    /**
     * Creates an item by name.
     *
     * @param enemy
     * @param itemName
     * @returns {AbstractItem|null}
     */
    // TODO: Perhaps this could be a factory?
    private createItem(enemy: Enemy, itemName: string): AbstractItem | null {

        let item: AbstractItem | null = null;

        switch (itemName) {

            case 'heart':
                item = new Heart(enemy.x, enemy.y);
                break;

            case 'rupee':
                item = new Rupee(enemy.x, enemy.y, 'yellow');
                break;

            case 'blueRupee':
                item = new Rupee(enemy.x, enemy.y, 'blue');
                break;

            default:
                console.error(`Don't know how to create item named ${itemName}`);
                break;
        }

        return item;
    }
}
