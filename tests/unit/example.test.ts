import { describe, it, expect } from 'vitest';

describe( 'Vitest Basic Setup', () => {
	it( 'should work correctly', () => {
		expect( 1 + 1 ).toBe( 2 );
	} );

	it( 'should have global WordPress mocks', () => {
		expect( window.wp ).toBeDefined();
		expect( window.wp.i18n.__ ).toBeDefined();
		expect( window.wp.i18n.__( 'Hello World' ) ).toBe( 'Hello World' );
	} );

	it( 'should have vi mock functions available', () => {
		const mockFn = vi.fn();
		mockFn( 'test' );
		expect( mockFn ).toHaveBeenCalledWith( 'test' );
	} );
} );
