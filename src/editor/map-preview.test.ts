import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import MapPreview from './map-preview.vue';
import { createVuetify } from 'vuetify';

const vuetify = createVuetify();

const mockScreen = {
    paint: vi.fn(),
    paintTopLayer: vi.fn(),
};

const mocks = vi.hoisted(() => {
    const mockCommit = vi.fn();
    return {
        useStore: () => ({
            state: {
                currentScreen: mockScreen,
            },
            commit: mockCommit,
        }),
    };
});

vi.mock('vuex', () => ({
    useStore: mocks.useStore,
}));
const mockGame = {
    map: {
        rowCount: 2,
        colCount: 2,
        getScreen: vi.fn(() => mockScreen),
    },
};
const screenCount = mockGame.map.rowCount * mockGame.map.colCount;

describe('MapPreview', () => {
    beforeEach(() => {
        render(MapPreview, {
            global: {
                plugins: [ vuetify ],
            },
            props: {
                game: mockGame,
                map: mockGame.map,
                lastModified: 0,
            },
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
        vi.clearAllMocks();
    });

    it('paints the entire map on mount', () => {
        expect(mockGame.map.getScreen).toHaveBeenCalledTimes(screenCount);
        // In real life each screen returned is different, but since we're mocking things it isn't.
        // That's OK as we're just verifying that the method is called once for every screen in the map.
        const screen = mockGame.map.getScreen();
        expect(screen.paint).toHaveBeenCalledTimes(screenCount);
        expect(screen.paintTopLayer).toHaveBeenCalledTimes(screenCount);
    });

    it('repaints if the mouse moves around and arms a different screen', async() => {
        // Reset mock counts back to 0
        mockScreen.paint.mockClear();
        mockScreen.paintTopLayer.mockClear();
        expect(mockScreen.paint).not.toHaveBeenCalled();

        // Simulate the mouse being in one screen and moving to another
        const canvas = screen.getByLabelText('A preview of the map');
        await userEvent.pointer({
            target: canvas,
            coords: { x: 75, y: 42 },
        });
        await userEvent.pointer({
            target: canvas,
            coords: { x: 100, y: 100 },
        });

        expect(mockScreen.paint).toHaveBeenCalledTimes(screenCount);
        expect(mockScreen.paintTopLayer).toHaveBeenCalledTimes(screenCount);
    });

    it('fires an event if the selected screen changes', async() => {
        const canvas = screen.getByLabelText('A preview of the map');
        await userEvent.pointer({
            keys: '[MouseLeft]',
            target: canvas,
            coords: { x: 75, y: 42 },
        });

        expect(mocks.useStore().commit).toHaveBeenCalledWith('setCurrentScreen',
            { row: expect.any(Number) as number, col: expect.any(Number) as number });
    });
});
