import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { SpriteSheet } from 'gtp';
import MainContent from './main-content.vue';
import { EnemyGroup } from '@/EnemyGroup';
import { Map } from '@/Map';
import { ZeldaGame } from '@/ZeldaGame';

const mocks = vi.hoisted(() => {
    const mockCommit = vi.fn();
    return {
        useStore: () => ({
            state: {
                currentScreen: mockScreen,
                currentScreenCol: 1,
                currentScreenRow: 1,
                game: mockGame,
                lastModified: 0,
            },
            commit: mockCommit,
        }),
    };
});

vi.mock('vuex', () => ({
    useStore: mocks.useStore,
}));

const mockScreen = {
    enemyGroup: new EnemyGroup(),
    paint: vi.fn(),
    paintCol: vi.fn(),
    paintRow: vi.fn(),
    paintTopLayer: vi.fn(),
};

const gtpImageDraw = vi.fn();
const mockSpriteSheet: SpriteSheet = {
    gtpImage: {
        draw: gtpImageDraw,
    },
} as unknown as SpriteSheet;

const mockTileset = {
    getName: vi.fn(),
    paintTile: vi.fn(),
};
const mockGame = new ZeldaGame();

const vuetify = createVuetify({
    components,
    directives,
});

describe('MainContent', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(mockGame.assets, 'get').mockReturnValue(mockSpriteSheet);
        vi.spyOn(mockGame.assets, 'addImage').mockImplementation(() => {});
        vi.spyOn(mockGame.assets, 'addJson').mockImplementation(() => ({}));
        vi.spyOn(mockGame.assets, 'addSpriteSheet').mockImplementation(() => {});
        vi.spyOn(mockGame.assets, 'addSound').mockImplementation(() => {});
        /* eslint-disable @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-unsafe-call */
        vi.spyOn(mockGame.assets, 'onLoad').mockImplementation((callback: Function) => {
            callback();
        });
        /* eslint-enable @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-unsafe-call */
        vi.spyOn(mockGame, 'startNewGame').mockImplementation(() => {});
        mockGame.map = {
            currentScreen: mockScreen,
            currentScreenRow: 1,
            currentScreenCol: 1,
            rowCount: 10,
            colCount: 10,
            getScreen: vi.fn(() => mockScreen),
            getTileset: () => mockTileset,
            tileset: mockTileset,
        } as unknown as Map;

        render(MainContent, {
            global: {
                plugins: [ vuetify ],
            },
        });
    });

    afterEach(() => {
        // jsdom doesn't clean up between tests in the same file
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
        vi.clearAllTimers();
    });

    it('renders the map editor', () => {
        expect(screen.getByText(/Screen \(\d+, \d+\) \/ \(\d+, \d+\)/));
    });

    it('renders tab labels for the Tile Palette/Events/Misc pane', () => {
        expect(screen.getByText(/Tile Palette/i)).toBeTruthy();
        expect(screen.getByText(/Events/i)).toBeTruthy();
        expect(screen.getByText(/Misc/i)).toBeTruthy();
    });

    it('shows the Tile Palette by default', () => {
        expect(screen.getByText('Tile Palette'));
    });

    it('renders the map preview', () => {
        expect(screen.getByText('Map Preview'));
    });

    it('renders the code viewer', () => {
        expect(screen.getByText('Map JSON'));
    });

    describe('when the left arrow key is pressed', () => {
        beforeEach(async() => {
            const e = {key: 'ArrowLeft', which: 37, code: 'ArrowLeft'};
            await fireEvent(document, new KeyboardEvent('keydown', e));
        });

        it('moves the current screen one to the left', () => {
            // Initial loading, then from the keypress
            expect(mocks.useStore().commit).toHaveBeenLastCalledWith('setCurrentScreen', {row: 1, col: 0});
        });
    });

    describe('when the right arrow key is pressed', () => {
        beforeEach(async() => {
            const e = {key: 'ArrowRight', which: 39, code: 'ArrowRight'};
            await fireEvent(document, new KeyboardEvent('keydown', e));
        });

        it('moves the current screen one to the right', () => {
            // Initial loading, then from the keypress
            expect(mocks.useStore().commit).toHaveBeenLastCalledWith('setCurrentScreen', { row: 1, col: 2 });
        });
    });

    describe('when the up arrow key is pressed', () => {
        beforeEach(async() => {
            const e = {key: 'ArrowUp', which: 38, code: 'ArrowUp'};
            await fireEvent(document, new KeyboardEvent('keydown', e));
        });

        it('moves the current screen one to the right', () => {
            // Initial loading, then from the keypress
            expect(mocks.useStore().commit).toHaveBeenLastCalledWith('setCurrentScreen', { row: 0, col: 1 });
        });
    });

    describe('when the down arrow key is pressed', () => {
        beforeEach(async() => {
            const e = {key: 'ArrowDown', which: 40, code: 'ArrowDown'};
            await fireEvent(document, new KeyboardEvent('keydown', e));
        });

        it('moves the current screen one to the right', () => {
            // Initial loading, then from the keypress
            expect(mocks.useStore().commit).toHaveBeenLastCalledWith('setCurrentScreen', { row: 2, col: 1 });
        });
    });
});
