import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EnemyGroup, EnemyInfo } from './EnemyGroup';

describe('EnemyGroup', () => {
    let group: EnemyGroup;

    beforeEach(() => {
        group = new EnemyGroup('random', [
            { id: '1', type: 'Octorok', count: 2 },
            { id: '2', type: 'Moblin', strength: 'red', count: 1 },
        ]);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('add()', () => {
        it('adds an enemy to the group', () => {
            const enemy: EnemyInfo = { id: '3', type: 'Keese', count: 1 };
            group.add(enemy);
            expect(group.enemies).toEqual([
                { id: '1', type: 'Octorok', count: 2 },
                { id: '2', type: 'Moblin', strength: 'red', count: 1 },
                { id: '3', type: 'Keese', count: 1 },
            ]);
        });
    });

    describe('clear()', () => {
        it('removes all enemies from the group', () => {
            group.clear();
            expect(group.enemies).toEqual([]);
        });
    });

    describe('clone()', () => {
        it('returns a new EnemyGroup with the same properties', () => {
            const clone = group.clone();
            expect(clone).not.toBe(group);
            expect(clone.spawnStyle).toEqual(group.spawnStyle);
            expect(clone.enemies).toEqual(group.enemies);
        });

        it('returns a flattened group when flatten is true', () => {
            const clone = group.clone(true);
            expect(clone.enemies.every((e) => e.count === 1)).toEqual(true);
            expect(clone.enemies.length).toEqual(3); // 2 Octorok + 1 Moblin
        });
    });

    describe('flatten()', () => {
        it('flattens enemies with count > 1 into multiple entries', () => {
            group.flatten();
            expect(group.enemies.length).toEqual(3);
            expect(group.enemies.every((e) => e.count === 1)).toEqual(true);
        });
    });

    describe('fromJson()', () => {
        it('loads group data from JSON', () => {
            const json = {
                spawnStyle: 'fixed',
                enemies: [
                    { id: 'a', type: 'Stalfos', count: 2 },
                    { id: 'b', type: 'Darknut', count: 1 },
                ],
            };
            group.fromJson(json);
            expect(group.spawnStyle).toEqual('fixed');
            expect(group.enemies[0].id).toEqual('a');
            expect(group.enemies[0].type).toEqual('Stalfos');
            expect(group.enemies[0].count).toEqual(2);
            expect(group.enemies[1].id).toEqual('b');
            expect(group.enemies[1].type).toEqual('Darknut');
            expect(group.enemies[1].count).toEqual(1);
        });

        it('does nothing if json is null or undefined', () => {
            const prev = {
                spawnStyle: group.spawnStyle,
                enemies: [ ...group.enemies ],
            };
            group.fromJson(null);
            expect(group.spawnStyle).toEqual(prev.spawnStyle);
            expect(group.enemies).toEqual(prev.enemies);
        });
    });

    describe('toJson()', () => {
        it('returns a JSON representation of the group', () => {
            const json = group.toJson();
            expect(json).toEqual({
                spawnStyle: 'random',
                enemies: [
                    { id: '1', type: 'Octorok', count: 2 },
                    { id: '2', type: 'Moblin', strength: 'red', count: 1 },
                ],
            });
        });
    });

    describe('toString()', () => {
        it('returns a string summary of the group', () => {
            expect(group.toString()).toEqual('[EnemyGroup: size=2]');
        });
    });
});
