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
HTMLCanvasElement.prototype.getContext = vi.fn( () => null );

// Mock window.matchMedia for responsive components with proper types
const matchMediaFn: Window[ 'matchMedia' ] = ( q ) => createMatchMediaMock( q );
Object.defineProperty( window, 'matchMedia', {
	writable: true,
	value: vi.fn( matchMediaFn ),
} );

// Mock IntersectionObserver with proper types
global.IntersectionObserver = vi.fn( createIntersectionObserverMock );

// Mock ResizeObserver with proper types
global.ResizeObserver = vi.fn( createResizeObserverMock );

// Enable auto cleanup after each test

afterEach( () => {
	cleanup();
} );
