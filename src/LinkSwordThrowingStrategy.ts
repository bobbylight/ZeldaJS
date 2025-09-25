import { Link } from '@/Link';

type LinkSwordThrowingStrategy = (link: Link) => boolean;
type SwordThrowingStrategyName = 'always' | 'maxHearts';

const maxHeartsSwordThrowingStrategy: LinkSwordThrowingStrategy = (link) => link.getHealth() === link.getMaxHealth();
const alwaysSwordThrowingStrategy: LinkSwordThrowingStrategy = () => true;

const swordThrowingStrategyForName = (name: SwordThrowingStrategyName): LinkSwordThrowingStrategy => {
    switch (name) {
        case 'always':
            return alwaysSwordThrowingStrategy;
        case 'maxHearts':
            return maxHeartsSwordThrowingStrategy;
    }
};

export { alwaysSwordThrowingStrategy, maxHeartsSwordThrowingStrategy, LinkSwordThrowingStrategy,
    swordThrowingStrategyForName, SwordThrowingStrategyName };
