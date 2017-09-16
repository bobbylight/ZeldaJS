import { AbstractItem } from './AbstractItem';
import { Actor } from '../Actor';

/**
 * Adds a single heart to Link's health.
 */
export class Heart extends AbstractItem {

    collidedWith(other: Actor): boolean {
        return false;
    }

    paint(ctx: CanvasRenderingContext2D): void {
    }

    update(): void {
    }
}
