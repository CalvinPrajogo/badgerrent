# Frontend Folder Structure

## Overview
This document outlines the organization of the React frontend codebase.

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Header, Footer, Button, etc.)
│   ├── property/       # Property-related components (PropertyCard, PropertyDetails, etc.)
│   └── search/         # Search-related components (SearchBar, Filters, etc.)
├── pages/              # Top-level page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and helpers
├── services/           # API calls and external services
├── context/            # React Context providers
└── assets/             # Static assets (images, icons, etc.)
```

## Naming Conventions

- **Components**: PascalCase (e.g., `PropertyCard.jsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Folders**: lowercase with hyphens if needed

## Component Organization

### components/common/
- Header.jsx
- Footer.jsx
- Button.jsx
- Modal.jsx
- Loading.jsx
- etc.

### components/property/
- PropertyCard.jsx
- PropertyList.jsx
- PropertyDetails.jsx
- PropertyGallery.jsx
- etc.

### components/search/
- SearchBar.jsx
- FilterPanel.jsx
- SearchResults.jsx
- etc.

### pages/
- Home.jsx
- Search.jsx
- PropertyDetail.jsx
- About.jsx
- etc.

## Best Practices

1. Each component should have its own file
2. Include PropTypes or TypeScript for type checking
3. Export components as named exports when possible
4. Keep components small and focused on a single responsibility
5. Use custom hooks for shared stateful logic