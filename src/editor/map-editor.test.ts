import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent, { UserEvent } from '@testing-library/user-event';
import MapEditor from './map-editor.vue';
import { createVuetify } from 'vuetify';

const mocks = vi.hoisted(() => {
    const mockCommit = vi.fn();
    return {
        useStore: () => ({
            commit: mockCommit,
        }),
    };
});

vi.mock('vuex', () => ({
    useStore: mocks.useStore,
}));

const vuetify = createVuetify();

const mockScreen = {
    paint: vi.fn(),
    paintCol: vi.fn(),
    paintRow: vi.fn(),
    paintTopLayer: vi.fn(),
    setTile: vi.fn(),
};
const mockTileset = {
    paintTile: vi.fn(),
};
const mockMap = {
    currentScreen: mockScreen,
    currentScreenRow: 1,
    currentScreenCol: 1,
    rowCount: 3,
    colCount: 3,
    getScreen: vi.fn(() => mockScreen),
    getTileset: () => mockTileset,
};

describe('MapEditor', () => {
    let mockGame = { map: mockMap };
    let user: UserEvent;

    beforeEach(() => {
        vi.useFakeTimers();
        user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
        vi.clearAllTimers();
    });

    it('renders the canvas after a short delay', () => {
        render(MapEditor, {
            global: {
                plugins: [ vuetify ],
            },
            props: {
                game: mockGame,
                selectedTileIndex: 1,
            },
        });

        vi.advanceTimersByTime(50);

        // The current screen is painted
        expect(mockScreen.paint).toHaveBeenCalledOnce();

        // Top, bottom, left and right screens have 1 row/column painted
        expect(mockScreen.paintRow).toHaveBeenCalledTimes(2);
        expect(mockScreen.paintCol).toHaveBeenCalledTimes(2);

        // The armed tile is painted
        expect(mockMap.getTileset().paintTile).toHaveBeenCalledOnce();
    });

    describe('when viewing the top-left screen', () => {
        it('renders the canvas after a short delay', () => {
            mockGame = {
                map: {
                    ...mockGame.map,
                    currentScreenRow: 0,
                    currentScreenCol: 0,
                },
            };

            render(MapEditor, {
                global: {
                    plugins: [ vuetify ],
                },
                props: {
                    game: mockGame,
                    selectedTileIndex: 1,
                },
            });

            vi.advanceTimersByTime(50);

            // The current screen is painted
            expect(mockScreen.paint).toHaveBeenCalledOnce();

            // Only the bottom and right screens have 1 row/column painted
            expect(mockScreen.paintRow).toHaveBeenCalledTimes(1);
            expect(mockScreen.paintCol).toHaveBeenCalledTimes(1);

            // The armed tile is painted
            expect(mockMap.getTileset().paintTile).toHaveBeenCalledOnce();
        });
    });

    describe('when viewing the bottom-right screen', () => {
        it('renders the canvas after a short delay', () => {
            mockGame = {
                map: {
                    ...mockGame.map,
                    currentScreenRow: 2,
                    currentScreenCol: 2,
                },
            };

            render(MapEditor, {
                global: {
                    plugins: [ vuetify ],
                },
                props: {
                    game: mockGame,
                    selectedTileIndex: 1,
                },
            });

            vi.advanceTimersByTime(50);

            // The current screen is painted
            expect(mockScreen.paint).toHaveBeenCalledOnce();

            // Only the bottom and right screens have 1 row/column painted
            expect(mockScreen.paintRow).toHaveBeenCalledTimes(1);
            expect(mockScreen.paintCol).toHaveBeenCalledTimes(1);

            // The armed tile is painted
            expect(mockMap.getTileset().paintTile).toHaveBeenCalledOnce();
        });
    });

    describe('if the mouse moves around in the screen', () => {
        it('rerenders', async() => {
            render(MapEditor, {
                global: {
                    plugins: [ vuetify ],
                },
                props: {
                    game: mockGame,
                    selectedTileIndex: 1,
                },
            });

            // Simulate the mouse being in one screen and moving to another
            const canvas = screen.getByLabelText('The current screen editor');
            await user.pointer({
                target: canvas,
                coords: { x: 75, y: 42 },
            });
            await user.pointer({
                target: canvas,
                coords: { x: 100, y: 100 },
            });
        });
    });

    describe('if the mouse updates some tiles on the screen', () => {
        it('rerenders', async() => {
            render(MapEditor, {
                global: {
                    plugins: [ vuetify ],
                },
                props: {
                    game: mockGame,
                    selectedTileIndex: 1,
                },
            });

            // Simulate the click and dragging from one tile to another
            const canvas = screen.getByLabelText('The current screen editor');
            await user.pointer({
                keys: '[MouseLeft>]',
                target: canvas,
                coords: { x: 75, y: 42 },
            });
            await user.pointer({
                keys: '[/MouseLeft]',
                target: canvas,
                coords: { x: 100, y: 100 },
            });
        });
    });
});
