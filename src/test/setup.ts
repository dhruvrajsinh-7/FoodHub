import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock('@/components/ui/sheet', async () => {
  const React = (await import('react')).default;

  return {
    Sheet: ({ children }: any) => React.createElement('div', { 'data-testid': 'sheet' }, children),
    SheetContent: ({ children }: any) =>
      React.createElement('div', { 'data-testid': 'sheet-content' }, children),
    SheetHeader: ({ children }: any) =>
      React.createElement('div', { 'data-testid': 'sheet-header' }, children),
    SheetTitle: ({ children }: any) =>
      React.createElement('h2', { 'data-testid': 'sheet-title' }, children),
    SheetFooter: ({ children }: any) =>
      React.createElement('div', { 'data-testid': 'sheet-footer' }, children),
  };
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  // Clean up any portal containers
  const portals = document.querySelectorAll('[data-radix-portal]');
  portals.forEach(portal => portal.remove());
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
(globalThis as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;
