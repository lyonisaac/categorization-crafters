# Core Components API

## CategorizationForm

### Props

```typescript
interface CategorizationFormProps {
  onSubmit: (data: CategorizationRule) => void;
  onCancel?: () => void;
  initialValues?: Partial<CategorizationRule>;
  isLoading?: boolean;
  error?: string;
}
```

### Methods

```typescript
const form = useForm<CategorizationRule>({
  resolver: zodResolver(categorizationSchema),
  defaultValues: {
    name: '',
    conditions: [],
    actions: [],
    priority: 1,
    isActive: true
  }
});
```

### Usage

```tsx
<CategorizationForm
  onSubmit={handleFormSubmit}
  initialValues={existingRule}
  isLoading={isSubmitting}
  error={formError}
/>
```

## RuleEditor

### Props

```typescript
interface RuleEditorProps {
  rule: CategorizationRule;
  onUpdate: (updates: Partial<CategorizationRule>) => void;
  onDelete?: () => void;
  isEditable?: boolean;
}
```

### Methods

```typescript
const handleUpdate = (updates: Partial<CategorizationRule>) => {
  // Update rule state
  setRule(prev => ({ ...prev, ...updates }));
};
```

### Usage

```tsx
<RuleEditor
  rule={currentRule}
  onUpdate={handleRuleUpdate}
  onDelete={handleRuleDelete}
  isEditable={true}
/>
```

## ConditionBuilder

### Props

```typescript
interface ConditionBuilderProps {
  conditions: RuleCondition[];
  onAddCondition: () => void;
  onRemoveCondition: (index: number) => void;
  onUpdateCondition: (index: number, updates: Partial<RuleCondition>) => void;
}
```

### Methods

```typescript
const addCondition = () => {
  setConditions(prev => [...prev, {
    type: 'description',
    operator: 'contains',
    value: ''
  }]);
};
```

### Usage

```tsx
<ConditionBuilder
  conditions={rule.conditions}
  onAddCondition={addCondition}
  onRemoveCondition={removeCondition}
  onUpdateCondition={updateCondition}
/>
```

## ActionBuilder

### Props

```typescript
interface ActionBuilderProps {
  actions: RuleAction[];
  onAddAction: () => void;
  onRemoveAction: (index: number) => void;
  onUpdateAction: (index: number, updates: Partial<RuleAction>) => void;
}
```

### Methods

```typescript
const addAction = () => {
  setActions(prev => [...prev, {
    type: 'category',
    value: ''
  }]);
};
```

### Usage

```tsx
<ActionBuilder
  actions={rule.actions}
  onAddAction={addAction}
  onRemoveAction={removeAction}
  onUpdateAction={updateAction}
/>
```

## Types and Interfaces

### CategorizationRule

```typescript
interface CategorizationRule {
  id: string;
  name: string;
  description?: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### RuleCondition

```typescript
interface RuleCondition {
  id: string;
  type: 'amount' | 'description' | 'date' | 'category';
  operator: string;
  value: any;
  priority?: number;
}
```

### RuleAction

```typescript
interface RuleAction {
  id: string;
  type: 'category' | 'flag' | 'memo' | 'split';
  value: string | number;
  priority?: number;
}
```

## Utilities

### Validation

```typescript
const categorizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  conditions: z.array(
    z.object({
      type: z.enum(['amount', 'description', 'date', 'category']),
      operator: z.string(),
      value: z.any()
    })
  ),
  actions: z.array(
    z.object({
      type: z.enum(['category', 'flag', 'memo', 'split']),
      value: z.any()
    })
  )
});
```

### Helper Functions

```typescript
// Condition evaluation
export const evaluateCondition = (condition: RuleCondition, transaction: Transaction): boolean => {
  switch (condition.type) {
    case 'amount':
      return evaluateAmountCondition(condition, transaction);
    case 'description':
      return evaluateDescriptionCondition(condition, transaction);
    case 'date':
      return evaluateDateCondition(condition, transaction);
    case 'category':
      return evaluateCategoryCondition(condition, transaction);
  }
};

// Action execution
export const executeAction = (action: RuleAction, transaction: Transaction): Transaction => {
  switch (action.type) {
    case 'category':
      return assignCategory(transaction, action.value);
    case 'flag':
      return flagTransaction(transaction, action.value);
    case 'memo':
      return addMemo(transaction, action.value);
    case 'split':
      return splitTransaction(transaction, action.value);
  }
};
```

## Error Handling

### Common Errors

```typescript
enum CategorizationError {
  INVALID_RULE = 'Invalid rule configuration',
  DUPLICATE_RULE = 'Duplicate rule name',
  INVALID_CONDITION = 'Invalid condition configuration',
  INVALID_ACTION = 'Invalid action configuration',
  NO_MATCHING_TRANSACTIONS = 'No matching transactions found'
}
```

### Error Boundaries

```tsx
const CategorizationErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return <ErrorBoundary fallback={setError}>{children}</ErrorBoundary>;
};
```

## Best Practices

1. **Type Safety**
   - Always use TypeScript interfaces
   - Implement proper type guards
   - Use Zod for runtime validation

2. **Component Composition**
   - Keep components focused
   - Use props for customization
   - Document component usage

3. **State Management**
   - Keep local state minimal
   - Use context for global state
   - Implement proper error boundaries

4. **Performance**
   - Use memoization for expensive calculations
   - Implement proper cleanup in effects
   - Optimize rendering with keys and shouldComponentUpdate
