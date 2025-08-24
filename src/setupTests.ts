import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Vuetify requires some extra mocking that jsdom doesn't provide
vi.stubGlobal('visualViewport', new EventTarget());

vi.stubGlobal('ResizeObserver', vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
})));
