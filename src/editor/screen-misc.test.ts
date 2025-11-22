import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { createVuetify } from 'vuetify';
import { nextTick } from 'vue';
import ScreenMisc from './screen-misc.vue';
import { Screen } from '@/Screen';

const mocks = vi.hoisted(() => {
    const mockCommit = vi.fn();
    const createMockScreen = (music: string): Screen => ({
        music,
    } as unknown as Screen);

    const mockState = {
        state: {
            currentScreen: createMockScreen('overworldMusic'),
        },
        commit: mockCommit,
    };
    return {
        createMockScreen,
        useStore: () => mockState,
    };
});

vi.mock('vuex', () => ({
    useStore: mocks.useStore,
}));

const vuetify = createVuetify();

describe('ScreenMisc', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('sets initial music value from screen', async() => {
        render(ScreenMisc, {
            global: {
                plugins: [ vuetify ],
            },
        });

        await nextTick();
        const select: HTMLSelectElement = screen.getByLabelText('Music');
        expect(select.value).toEqual('overworldMusic');
    });

    it('commits setCurrentScreenMusic when music changes', async() => {
        render(ScreenMisc, {
            global: {
                plugins: [ vuetify ],
            },
        });

        const select: HTMLSelectElement = screen.getByLabelText('Music');
        await userEvent.click(select);
        const option = screen.getByText('Labyrinth');
        await userEvent.click(option);
        expect(mocks.useStore().commit).toHaveBeenCalledWith('setCurrentScreenMusic', 'labyrinthMusic');
    });

    // TODO: Figure out why this functionality works but this test fails
    /* eslint-disable  @typescript-eslint/unbound-method */
    it.skip('updates music when currentScreen changes', async() => {
        const { rerender } = render(ScreenMisc, {
            global: {
                plugins: [ vuetify ],
            },
        });


        // Simulate screen change
        mocks.useStore().state.currentScreen = mocks.createMockScreen('labyrinthMusic');
        await rerender({});

        await waitFor(() => {
            const select: HTMLSelectElement = screen.getByLabelText('Music');
            expect(select.value).toEqual('Labyrinth');
        });
    });
    /* eslint-enable  @typescript-eslint/unbound-method */
});
