# Component Architecture

## Overview

The Categorization Crafters application follows a modular component architecture that separates concerns and promotes maintainability. This document outlines the key architectural decisions and patterns used in the component structure.

## Component Hierarchy

```
src/
├── components/
│   ├── form/
│   │   ├── CategorizationForm.tsx
│   │   ├── RuleEditor.tsx
│   │   └── ConditionBuilder.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
├── pages/
│   ├── Home.tsx
│   └── Rules.tsx
└── hooks/
    ├── useCategorization.ts
    └── useFormState.ts
```

## Key Patterns

### 1. Composition over Inheritance

Components are built using composition rather than inheritance. For example, the `CategorizationForm` composes multiple smaller components:

```tsx
// CategorizationForm.tsx
const CategorizationForm = () => {
  return (
    <Card>
      <FormHeader />
      <RuleEditor />
      <ConditionBuilder />
      <ActionBuilder />
    </Card>
  );
};
```

### 2. Atomic Design

Components are organized following atomic design principles:

- **Atoms**: Basic UI components (Button, Input, etc.)
- **Molecules**: Combinations of atoms (Form controls, etc.)
- **Organisms**: Complex components (CategorizationForm, RuleEditor)
- **Templates**: Page layouts
- **Pages**: Complete page components

### 3. State Management

State is managed using a combination of:

- React Context for global state
- TanStack Query for data fetching
- Use of custom hooks for complex state logic

```tsx
// Example of state management
const useCategorization = () => {
  const [rules, setRules] = useState<CategorizationRule[]>([]);
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  return {
    rules,
    categories,
    addRule: (rule: CategorizationRule) => setRules([...rules, rule]),
    updateRule: (id: string, updates: Partial<CategorizationRule>) => {
      setRules(rules.map(rule => 
        rule.id === id ? { ...rule, ...updates } : rule
      ));
    }
  };
};
```

## Data Flow

### 1. Form Data Flow

1. User interacts with form components
2. Form state is managed using React Hook Form
3. Validation is handled by Zod schemas
4. On submission, data is processed and sent to the API

### 2. Rule Processing Flow

1. Rules are loaded from storage
2. Conditions are parsed and validated
3. Actions are prepared for execution
4. Results are displayed to the user

## Best Practices

1. **Component Reusability**
   - Keep components focused and single-purpose
   - Use props for customization
   - Document component usage

2. **State Management**
   - Keep local state minimal
   - Use context for global state
   - Implement proper error boundaries

3. **Performance**
   - Use memoization for expensive calculations
   - Implement proper cleanup in effects
   - Optimize rendering with keys and shouldComponentUpdate

## Future Considerations

1. **Component Library**
   - Consider extracting reusable components into a separate library
   - Standardize component props and styling

2. **State Management**
   - Evaluate centralized state management solutions
   - Implement state persistence strategies

3. **Testing**
   - Add component-level tests
   - Implement integration tests
   - Add performance benchmarks
