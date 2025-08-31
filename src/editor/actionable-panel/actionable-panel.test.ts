import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify/framework';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { render, screen } from '@testing-library/vue';
import ActionablePanel from '@/editor/actionable-panel/actionable-panel.vue';
import type { Component } from 'vue';

const vuetify = createVuetify({
    components,
    directives,
});

describe('ActionablePanel', () => {
    beforeEach(() => {
        const content = {
            template: '<actionable-panel title="Test Title">Hello world</actionable-panel>',
            components: { ActionablePanel: ActionablePanel as Component },
        };
        render(content, {
            global: {
                plugins: [ vuetify ],
            },
        });
    });

    afterEach(() => {
        // jsdom doesn't clean up between tests in the same file
        document.body.innerHTML = '';
    });

    it('renders the specified title', () => {
        expect(screen.getByText('Test Title'));
    });

    it('renders the child content', () => {
        expect(screen.getByText('Hello world'));
    });
});
