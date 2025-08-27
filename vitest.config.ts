/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import { defineConfig } from 'vitest/config';

export default defineConfig( {
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: [ './tests/setup.ts' ],
		coverage: {
			enabled: true,
			reporter: [ 'text', 'html', 'lcov' ],
			include: [ 'src/**/*.{ts,tsx}' ],
			exclude: [
				'src/**/*.d.ts',
				'src/**/*.test.{ts,tsx}',
				'src/**/*.spec.{ts,tsx}',
			],
			thresholds: {
				global: {
					branches: 80,
					functions: 80,
					lines: 80,
					statements: 80,
				},
			},
		},
		testTimeout: 10000,
		// Separate test directories by type
		include: [
			'tests/**/*.{test,spec}.{ts,tsx}',
			'src/**/*.{test,spec}.{ts,tsx}',
		],
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/.{idea,git,cache,output,temp}/**',
			'**/playwright-tests/**',
		],
	},
} );
