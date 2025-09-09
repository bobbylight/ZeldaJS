import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify/framework';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { Component, Plugin } from 'vue';
import { render, screen } from '@testing-library/vue';
import NavBar from '@/editor/nav-bar.vue';
import userEvent, { UserEvent } from '@testing-library/user-event';

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

describe('NavBar', () => {
    let vuetify: Plugin;
    let user: UserEvent;

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
        const vuetifyAppWrapper = {
            template: '<v-app><NavBar/></v-app>',
            components: { NavBar: NavBar as Component },
        };
        render(vuetifyAppWrapper, {
            props: {},
            global: {
                plugins: [ vuetify ],
            },
        });
        user = userEvent.setup();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
        vi.clearAllMocks();
    });

    it('renders app bar and title', () => {
        expect(screen.getByText('Zelda Map Creator')).toBeInTheDocument();
    });

    it('updates the map when the level dropdown is updated', async() => {
        const select: HTMLSelectElement = screen.getByText('Overworld');
        await user.click(select);
        await user.click(screen.getByText('Level 1'));
        expect(mocks.useStore().commit).toHaveBeenCalledExactlyOnceWith('setMap', 'level1');
    });
});
