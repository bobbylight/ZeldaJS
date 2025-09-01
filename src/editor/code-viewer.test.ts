import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { type Plugin } from 'vue';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import CodeViewer from '../../src/editor/code-viewer.vue';
import { ZeldaGame } from '@/ZeldaGame';
import { Map } from '@/Map';

const mapData = { tiles: [ 1, 2, 3 ], other: 'data' };
const mockMap = {
    toJson: vi.fn(() => mapData),
};

const mockGame = new ZeldaGame();
mockGame.map = mockMap as unknown as Map;

describe('CodeViewer', () => {
    let vuetify: Plugin;
    let user: UserEvent;

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
        render(CodeViewer, {
            props: { game: mockGame },
            global: { plugins: [ vuetify ] },
        });
        // Besides simulating user actions, userData.setup() installs clipboard read/write mocks
        user = userEvent.setup();
    });

    afterEach(() => {
        // jsdom doesn't clean up between tests in the same file
        document.body.innerHTML = '';
    });

    it('renders buttons and code element', () => {
        expect(screen.getByText('Refresh')).toBeTruthy();
        expect(screen.getByText('Copy')).toBeTruthy();
        expect(screen.getByTestId('code').textContent).toEqual('');
    });

    it('updates the code section when Refresh is clicked', async() => {
        const codeDiv = screen.getByTestId('code');
        const origLength = codeDiv.textContent.length;
        await user.click(screen.getByText('Refresh'));
        expect(codeDiv.textContent.length).toBeGreaterThan(origLength);
    });

    it('can copy code to the clipboard', async() => {
        await user.click(screen.getByText('Refresh'));
        await user.click(screen.getByText('Copy'));
        const clipboardContent = await navigator.clipboard.readText();
        expect(JSON.parse(clipboardContent)).toEqual(mapData);
    });
});
