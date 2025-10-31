import { beforeEach, describe, expect, it, vi } from 'vitest';
import store from './store';
import { Screen } from '@/Screen';
import { ZeldaGame } from '@/ZeldaGame';

const mockScreen = {
    music: 'fakeMusic',
};

const mockMap = {
    currentScreen: mockScreen,
    currentScreenRow: 1,
    currentScreenCol: 1,
    rowCount: 3,
    colCount: 3,
    getScreen: vi.fn(() => mockScreen),
    setCurrentScreen: vi.fn(),
};

const mockGame = {
    map: mockMap,
    setMap: vi.fn(),
};

describe('store', () => {
    beforeEach(() => {
        store.replaceState({
            game: mockGame as unknown as ZeldaGame,
            currentScreen: mockMap.currentScreen as unknown as Screen,
            currentScreenRow: -1,
            currentScreenCol: -1,
            lastModified: 0,
        });
    });

    it('setCurrentScreen updates screen and coordinates', () => {
        const pair = { row: 2, col: 3 };
        store.commit('setCurrentScreen', pair);
        expect(mockMap.setCurrentScreen).toHaveBeenCalledExactlyOnceWith(2, 3);
        expect(store.state.currentScreenRow).toBe(2);
        expect(store.state.currentScreenCol).toBe(3);
    });

    it('setCurrentScreenMusic sets music on currentScreen', () => {
        expect(store.state.currentScreen?.music).not.toEqual('overworldMusic');
        store.commit('setCurrentScreenMusic', 'overworldMusic');
        expect(store.state.currentScreen?.music).toEqual('overworldMusic');
    });

    it('setMap updates map and coordinates', () => {
        store.commit('setMap', 'level1');
        expect(mockGame.setMap).toHaveBeenCalledWith(
            'level1',
            expect.objectContaining({ row: -1, col: -1 }),
            expect.objectContaining({ row: 0, col: 0 }),
        );
    });

    it('updateLastModified sets lastModified to current time', () => {
        const before = store.state.lastModified;
        store.commit('updateLastModified');
        expect(store.state.lastModified).toBeGreaterThanOrEqual(before);
    });
});
