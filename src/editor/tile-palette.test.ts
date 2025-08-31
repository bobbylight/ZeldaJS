import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, RenderResult, screen } from '@testing-library/vue';
import userEvent, { UserEvent } from '@testing-library/user-event';
import TilePalette from './tile-palette.vue';
import { createVuetify } from 'vuetify';
import { nextTick } from 'vue';
import { ZeldaGame } from '@/ZeldaGame';
import SpriteSheet from 'gtp/lib/gtp/SpriteSheet';
import { Tileset } from '@/Tileset';

const vuetify = createVuetify();

function createTilesetMock(): Tileset {
    return {
        getName: () => 'tileset1',
        colCount: 2,
        rowCount: 2,
    } as unknown as Tileset;
}

const gtpImageDraw = vi.fn();
function createMockSpriteSheet(): SpriteSheet {
    return {
        gtpImage: {
            draw: gtpImageDraw,
        },
    } as unknown as SpriteSheet;
}

function createMockGame(spriteSheet: SpriteSheet): ZeldaGame {
    return {
        assets: {
            get: vi.fn(() => spriteSheet),
        },
    } as unknown as ZeldaGame;
}

describe('TilePalette', () => {
    let mockSpriteSheet: SpriteSheet;
    let mockGame: ZeldaGame;
    let wrapper: RenderResult;
    let user: UserEvent;

    beforeEach(() => {
        mockSpriteSheet = createMockSpriteSheet();
        mockGame = createMockGame(mockSpriteSheet);
        vi.useFakeTimers();
        user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        wrapper = render(TilePalette, {
            global: {
                plugins: [ vuetify ],
            },
            props: {
                game: mockGame,
                tileset: createTilesetMock(),
                selectedTileIndex: 1,
            },
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
        vi.clearAllTimers();
    });

    it('renders after a delay on mount', async() => {
        expect(gtpImageDraw).not.toHaveBeenCalledOnce();
        vi.advanceTimersByTime(300);
        await nextTick();
        expect(gtpImageDraw).toHaveBeenCalledOnce();
    });

    it('emits tileSelected and repaints on canvas click', async() => {
        const canvas = screen.getByLabelText('Tile palette');
        await user.click(canvas);
        expect(wrapper.emitted()).toHaveProperty('tileSelected');
    });
});
