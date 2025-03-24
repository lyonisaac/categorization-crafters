# Component Architecture

## Overview

The Categorization Crafters application follows a modular component architecture that separates concerns and promotes maintainability. This document outlines the key architectural decisions and patterns used in the component structure.

## Component Hierarchy

```
src/
├── components/
│   ├── form/
│   │   ├── RuleForm/
│   │   │   ├── RuleForm.tsx
│   │   │   ├── RuleCriteriaForm.tsx
│   │   │   └── RuleFormNavigation.tsx
│   ├── layout/
│   │   └── Layout.tsx
│   ├── profile/
│   │   └── ProfileForm.tsx
│   ├── TransactionPreview/
│   │   └── TransactionPreview.tsx
│   ├── RuleExecutions/
│   │   └── RuleExecutionTracker.tsx
│   ├── CategoryMapping/
│   │   └── CategoryMapper.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
├── pages/
│   ├── Home.tsx
│   ├── RuleEditor.tsx
│   ├── Profile.tsx
│   ├── TransactionPreview.tsx
│   ├── RuleExecutions.tsx
│   ├── CategoryMapping.tsx
│   └── YnabSettings.tsx
└── hooks/
    ├── useAuth.ts
    ├── useTheme.ts
    └── useCategorization.ts
```

## Key Patterns

### 1. Composition over Inheritance

Components are built using composition rather than inheritance. For example, the `Layout` component composes multiple smaller components:

```tsx
// Layout.tsx
const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <MobileFooter />
    </div>
  );
};
```

### 2. Atomic Design

Components are organized following atomic design principles:

- **Atoms**: Basic UI components (Button, Input, etc.)
- **Molecules**: Combinations of atoms (Form controls, etc.)
- **Organisms**: Complex components (RuleForm, CategoryMapper)
- **Templates**: Page layouts
- **Pages**: Complete page components

### 3. State Management

State is managed using a combination of:

- React Context for global state
  - AuthContext for user authentication
  - ThemeContext for theme preferences
- TanStack Query for data fetching
- Use of custom hooks for complex state logic

```tsx
// Example of state management
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system');
  
  const updateTheme = async (newTheme: Theme) => {
    setTheme(newTheme);
    // Save to localStorage and database
    localStorage.setItem('theme', newTheme);
    await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        theme: newTheme,
        updated_at: new Date().toISOString()
      });
  };

  return { theme, updateTheme };
};
```

## Data Flow

### 1. Form Data Flow

1. User interacts with form components
2. Form state is managed using React Hook Form
3. Validation is handled by Zod schemas
4. On submission, data is processed and sent to the API

### 2. Rule Processing Flow

1. Rules are defined in the RuleEditor
2. Rules are stored in Supabase
3. Rules are executed against transactions
4. Results are tracked in the rule_executions table
5. Visualizations are generated from execution data

### 3. Theme Management Flow

1. Theme preference is loaded from localStorage
2. Theme is synchronized with database
3. Theme changes are reflected across all components
4. Theme updates are persisted between sessions

## Navigation Structure

The application uses a consistent navigation structure:

- Top navigation bar (desktop)
- Bottom navigation bar (mobile)
- Protected routes for authenticated content
- Consistent layout across all pages
- Responsive design for all screen sizes

## Component Responsibilities

### Layout Components
- Manages overall page structure
- Handles navigation
- Provides consistent styling
- Manages responsive behavior

### Form Components
- Handles user input
- Validates data
- Manages form state
- Submits data to backend

### Data Display Components
- Visualizes transaction data
- Shows rule execution history
- Displays category mappings
- Provides data insights

### Authentication Components
- Manages user sessions
- Handles login/logout
- Protects routes
- Manages API key storage

### Theme Components
- Manages theme preferences
- Applies theme changes
- Syncs theme across devices
- Provides theme switching UI
