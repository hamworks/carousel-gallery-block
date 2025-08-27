import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import {
	createWpMock,
	createMatchMediaMock,
	createObserverMock,
} from './mocks/wordpress';

// WordPress global mock setup with proper types
Object.defineProperty( window, 'wp', {
	value: createWpMock(),
	writable: true,
	configurable: true,
} );

// Mock HTMLCanvasElement.getContext for jsdom environment
HTMLCanvasElement.prototype.getContext =
	vi.fn() as unknown as typeof HTMLCanvasElement.prototype.getContext;

// Mock window.matchMedia for responsive components with proper types
Object.defineProperty( window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation( createMatchMediaMock ),
} );

// Mock IntersectionObserver with proper types
global.IntersectionObserver = vi
	.fn()
	.mockImplementation(
		createObserverMock
	) as unknown as typeof IntersectionObserver;

// Mock ResizeObserver with proper types
global.ResizeObserver = vi
	.fn()
	.mockImplementation(
		createObserverMock
	) as unknown as typeof ResizeObserver;

// Enable auto cleanup after each test

afterEach( () => {
	cleanup();
} );
