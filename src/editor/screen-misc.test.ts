import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import ScreenMisc from './screen-misc.vue';
import { createVuetify } from 'vuetify';
import { Screen } from '@/Screen';
import { nextTick } from 'vue';

const createMockScreen = (music: string): Screen => ({
    music,
} as unknown as Screen);
const mocks = vi.hoisted(() => {
    const mockCommit = vi.fn();
    return {
        useStore: () => ({
            state: {
                currentScreen: createMockScreen('overworldMusic'),
            },
            commit: mockCommit,
        }),
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
            props: {
                screen: createMockScreen('overworldMusic'),
            },
            global: {
                plugins: [ vuetify ],
            },
        });

        await nextTick();
        const select: HTMLSelectElement = screen.getByLabelText('Music');
        expect(select.value).toEqual('Overworld');
    });

    it('commits setCurrentScreenMusic when music changes', async() => {
        render(ScreenMisc, {
            props: {
                screen: createMockScreen('labyrinthMusic'),
            },
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

    // TODO: Enable this when this component removes the computed/prop double-up of screen
    /* eslint-disable  @typescript-eslint/unbound-method */
    it.skip('updates music when currentScreen changes', async() => {
        const { rerender } = render(ScreenMisc, {
            props: {
                screen: createMockScreen('overworldMusic'),
            },
            global: {
                plugins: [ vuetify ],
            },
        });


        // Simulate screen change
        const newScreen: Screen = { music: 'labyrinthMusic' } as unknown as Screen;

        await rerender({
            screen: newScreen,
        });

        await waitFor(() => {
            const select: HTMLSelectElement = screen.getByLabelText('Music');
            expect(select.value).toEqual('Labyrinth');
        });
    });
    /* eslint-enable  @typescript-eslint/unbound-method */
});
