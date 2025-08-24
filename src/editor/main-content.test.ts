import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/vue';
import MainContent from './main-content.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { EnemyGroup } from '@/EnemyGroup';
import { fireEvent } from '@testing-library/vue';

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
            commit: mockCommit
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

const mockGame = {
    assets: {
        addImage: vi.fn(),
        addJson: vi.fn(),
        addSpriteSheet: vi.fn(),
        get: vi.fn(),
        onLoad: vi.fn((callback: () => void) => {
            callback();
        }),
    },
    map: {
        currentScreen: mockScreen,
        currentScreenRow: 1,
        currentScreenCol: 1,
        rowCount: 10,
        colCount: 10,
        getScreen: vi.fn(() => mockScreen),
        tileset: {
            getName: vi.fn(),
            paintTile: vi.fn(),
        },
    },
    startNewGame: vi.fn(),
};

const vuetify = createVuetify({
    components,
    directives,
});

describe('MainContent', () => {
    beforeEach(() => {
        render(MainContent, {
            global: {
                plugins: [vuetify],
            },
        });
    });

    afterEach(() => {
        // jsdom doesn't clean up between tests in the same file
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('renders the map editor', () => {
        expect(screen.getByText(/Screen \(\d+, \d+\) \/ \(\d+, \d+\)/));
    });

    it('renders tab labels for the Tile Palette/Events/Misc pane', async() => {
        await waitFor(() => {
            expect(screen.getByText(/Tile Palette/i)).toBeTruthy();
            expect(screen.getByText(/Events/i)).toBeTruthy();
            expect(screen.getByText(/Misc/i)).toBeTruthy();
        });
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
