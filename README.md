# Carousel Gallery Block

## Overview


### Key Features

## Requirements

- **WordPress**: 6.8 or higher
- **PHP**: 7.4 or higher

## Installation

### Development Installation

```bash
# Navigate to plugins directory
cd /path/to/wordpress/wp-content/plugins/

# Clone repository
git clone git@github.com:hamworks/carousel-gallery-block.git

# Install dependencies
cd carousel-gallery-block
npm install

# Build assets
npm run build
```

## Usage

### Basic Usage


### Detailed Instructions

## Technical Specifications

### Architecture

- **Frontend**: TypeScript + React (WordPress Gutenberg components)
- **Backend**: PHP 7.4+ (WordPress Plugin API)
- **Build Tools**: @wordpress/scripts (webpack + Babel)
- **CSS Implementation**: CSS object-position property + media queries

### File Structure

## Developer Information

### Development Environment Setup

#### Quick Start

```bash
# Clone repository
git clone git@github.com:hamworks/carousel-gallery-block.git
cd carousel-gallery-block

# Install dependencies
npm install
composer install

# Start development server
npm run start

# Setup WordPress environment (using wp-env)
npm run env start
```

### Available Scripts

```bash
# Development build (watch mode)
npm run start

# Production build
npm run build

# Code formatting
npm run format

# Run linter
npm run lint

# Run tests
npm run test           # Jest unit tests
npm run test:php       # PHPUnit
npm run test:e2e       # Playwright E2E tests

# Type checking
npm run type-check

# Create plugin ZIP
npm run plugin-zip
```

### Testing

### Contributing

#### Coding Standards

## Extensibility

### Current Implementation

### Future Extension Points


## FAQ

## Changelog

## License

This plugin is released under the GPL v2 or later license.
