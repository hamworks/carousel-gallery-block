import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import {
	createWpMock,
	createMatchMediaMock,
	createIntersectionObserverMock,
	createResizeObserverMock,
} from './mocks/wordpress';

// WordPress global mock setup with proper types
Object.defineProperty( window, 'wp', {
	value: createWpMock(),
	writable: true,
	configurable: true,
} );

// Mock HTMLCanvasElement.getContext for jsdom environment
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = vi.fn( function (
	this: HTMLCanvasElement,
	contextId: string
) {
	if ( contextId === '2d' ) {
		return {} as CanvasRenderingContext2D;
	}
	return null;
} ) as typeof originalGetContext;

// Mock window.matchMedia for responsive components with proper types
Object.defineProperty( window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation( createMatchMediaMock ),
} );

// Mock IntersectionObserver with proper types
global.IntersectionObserver = vi.fn( createIntersectionObserverMock );

// Mock ResizeObserver with proper types
global.ResizeObserver = vi.fn( createResizeObserverMock );

// Enable auto cleanup after each test

afterEach( () => {
	cleanup();
} );
