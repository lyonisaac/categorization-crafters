# Color System Documentation

This document outlines the color system used throughout the application, including core colors, their usage patterns, and implementation guidelines.

## Core Colors

### Primary Colors
- **Background Blue**
  - Hex: `#f1f6ff`
  - Usage: Main background color for the application
  - CSS Variable: `app-background`

- **White**
  - Hex: `#ffffff`
  - Usage: Content areas, text, and card backgrounds
  - CSS Variable: `app-white`

- **Main Button Blue**
  - Hex: `#1e56ff`
  - Inactive: `#8a9cff`
  - Usage: Primary actions and navigation
  - CSS Variables: `app-blue`, `app-blue-inactive`

### State Colors

- **Success Green**
  - Hex: `#4db057`
  - Inactive: `#a6d8ab`
  - Usage: Success states, confirmations, positive actions
  - CSS Variables: `app-success`, `app-success-inactive`

- **Warning Yellow**
  - Hex: `#fbbf24`
  - Inactive: `#d9c89d`
  - Usage: Warnings, attention-needed states
  - CSS Variables: `app-warning`, `app-warning-inactive`

- **Negative Red**
  - Hex: `#96413e`
  - Inactive: `#c8a09e`
  - Usage: Errors, deletions, negative actions
  - CSS Variables: `app-delete`, `app-delete-inactive`

### Utility Colors

- **Muted Gray**
  - HSL: `215.4 16.3% 46.9%`
  - Inactive: `215.4 16.3% 76.9%`
  - Usage: Disabled states, secondary text, borders
  - CSS Variables: `app-muted`, `app-muted-inactive`

## Implementation Guidelines

### Button States
```tsx
// Primary buttons
bg-app-blue text-white

// Hover state
hover:bg-app-blue/90

// Inactive/disabled state
bg-app-blue-inactive text-white/80
```

### Status Indicators
```tsx
// Success/Active
bg-app-success/20 text-app-success border-app-success/30

// Warning/Inactive
bg-app-warning/20 text-app-warning border-app-warning/30

// Error/Delete
bg-app-delete/20 text-app-delete border-app-delete/30

// Muted/Pending
bg-app-muted/20 text-app-muted border-app-muted/30
```

### Backgrounds
```tsx
// Main background
bg-app-background

// Card background
bg-app-card or bg-app-white
```

### Text Colors
```tsx
// Primary text
@apply text-foreground

// Secondary text
@apply text-app-muted

// Accent text
@apply text-app-blue
```

### Borders and Outlines
```tsx
// Standard borders
@apply border-border

// Accent borders
@apply border-app-blue/30
```

## Dark Mode Considerations
- Primary blue and destructive red colors remain consistent across light and dark modes
- Muted colors maintain consistent HSL values but adjust brightness for better contrast
- All color variables automatically adapt to dark mode through CSS variables

## Usage Examples

### Button Component
```tsx
<button className="bg-app-blue text-white hover:bg-app-blue/90 disabled:bg-app-blue-inactive disabled:text-white/80">
  Primary Action
</button>
```

### Status Badge
```tsx
<div className="bg-app-success/20 text-app-success border-app-success/30">
  Active
</div>
```

### Card Component
```tsx
<div className="bg-app-card border-border">
  <p className="text-foreground">Primary content</p>
  <p className="text-app-muted">Secondary content</p>
</div>
```

## Color Variable Reference

All colors are defined in two locations:
1. `tailwind.config.ts` - For component-level styling
2. `src/index.css` - For CSS variable definitions

When adding new components or modifying existing ones, refer to this documentation to ensure consistent color usage.
