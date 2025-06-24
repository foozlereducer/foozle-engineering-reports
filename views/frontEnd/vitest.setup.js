// vitest.setup.js
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Optional: silence console errors for cleaner test output
vi.spyOn(console, 'error').mockImplementation(() => {})
