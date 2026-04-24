# Code Review Standards

## Overview

This file defines the coding standards and review criteria for the World Cup 2026 project.

## TypeScript & JavaScript

### Naming Conventions
- Use `camelCase` for variables, functions, and methods
- Use `PascalCase` for classes, components, and types
- Use `UPPER_SNAKE_CASE` for constants
- Prefix interfaces with `I` only when necessary (e.g., `User`, not `IUser`)

### Code Style
- Use semicolons consistently
- Use single quotes for strings
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation

### TypeScript Specific
- Always define return types for functions
- Use explicit types instead of `any`
- Prefer interfaces over types for object shapes
- Use `readonly` for immutable arrays and objects

## React

### Component Structure
- Use functional components with hooks
- Name components descriptively (e.g., `MatchCard`, `TeamBadge`)
- Order hooks alphabetically or by category
- Extract reusable logic into custom hooks

### Props
- Define prop types using TypeScript interfaces
- Use `Optional` suffix for optional props (e.g., `MatchOptionalProps`)
- Destructure props in component signature

### State Management
- Use `useState` for local component state
- Use `useContext` for shared state across few components
- Consider `useReducer` for complex state logic

## Error Handling

- Always handle async errors with try/catch or .catch()
- Display user-friendly error messages
- Log errors for debugging (when appropriate)
- Never expose sensitive information in error messages

## Performance

- Use `useMemo` for expensive calculations
- Use `useCallback` for function props to prevent re-renders
- Avoid inline arrow functions in JSX
- Lazy load components when appropriate

## Accessibility

- Use semantic HTML elements
- Include `alt` text for images
- Use `aria-*` attributes for interactive elements
- Ensure keyboard navigation works

## Git Conventions

### Commit Messages
- Use conventional commits format
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep subject line under 72 characters
- Example: `feat: add match scheduling component`

### Branch Naming
- Use lowercase with hyphens
- Format: `type/ticket-description`
- Examples: `feature/match-results`, `bugfix/date-format`