import { NpcType } from '@/Npc';

/**
 * A screen with a seller offering Link one or more items for sale.
 */
interface ShopScreenInteraction {
    type: 'shop' | 'moneyMakingGame' | 'sword' | 'doorRepairCharge';

    greeting: string;
    seller: NpcType;
    items: [
        {
            type: string;
            price: number;
        },
    ];
}

type ScreenInteraction = ShopScreenInteraction;

export { ScreenInteraction, ShopScreenInteraction };
