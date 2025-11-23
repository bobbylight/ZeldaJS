import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import ResizeObserver from 'resize-observer-polyfill';

// Vuetify requires some extra mocking that jsdom doesn't provide
vi.stubGlobal('visualViewport', new EventTarget());
window.ResizeObserver = ResizeObserver;
