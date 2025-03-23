# Categorization Crafters

A modern web application for creating and managing YNAB transaction categorization rules using React, TypeScript, and shadcn/ui.

## 📋 Project Overview

Categorization Crafters is a web-based tool designed to help users create and manage transaction categorization rules for YNAB (You Need A Budget). The application provides a user-friendly interface for defining complex categorization rules using a step-by-step form approach.

### Key Features

- 📝 Rule Creation: Create complex categorization rules using a guided form interface
- 🔄 Rule Management: Edit, delete, and organize categorization rules
- 🎨 Modern UI: Built with shadcn/ui components for a consistent and professional look
- 🔄 Real-time Validation: Immediate feedback on rule validity
- 📱 Responsive Design: Works seamlessly across all devices

## 🛠️ Tech Stack

- **Framework**: React 18
- **Type Safety**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Theme Management**: next-themes

## 🚀 Getting Started

### Prerequisites

- Node.js (Recommended: latest LTS version)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd categorization-crafters
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
categorization-crafters/
├── src/
│   ├── components/      # Reusable React components
│   │   ├── form/        # Form-related components
│   │   ├── ui/          # Basic UI components
│   │   └── layout/      # Layout components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── styles/         # Global styles and Tailwind configuration
├── public/             # Static assets
└── package.json        # Project dependencies and scripts
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Starts the development server with hot reload
- `npm run build` - Creates a production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code formatting and style checks

### Development Guidelines

1. **TypeScript First**: All components must use TypeScript
2. **Component Consistency**: Use shadcn/ui components for UI consistency
3. **React Best Practices**: Follow React documentation guidelines
4. **Commit Messages**: Use conventional commits format
5. **Code Quality**: Maintain clean and maintainable code

## 📚 API Documentation

### Core Components

- `CategorizationForm`: Main form component for creating rules
- `RuleEditor`: Interactive rule editing interface
- `CategoryManager`: Component for managing categories

### Types

```typescript
interface CategorizationRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  isActive: boolean;
}

interface RuleCondition {
  type: 'amount' | 'description' | 'date' | 'category';
  operator: string;
  value: any;
}

interface RuleAction {
  type: 'category' | 'flag' | 'memo';
  value: string;
}
```

## 📝 Usage Examples

### Creating a Basic Rule

```typescript
const basicRule: CategorizationRule = {
  id: '1',
  name: 'Grocery Expenses',
  conditions: [
    {
      type: 'description',
      operator: 'contains',
      value: 'grocery'
    }
  ],
  actions: [
    {
      type: 'category',
      value: 'Food & Dining'
    }
  ],
  priority: 1,
  isActive: true
};
```

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your-api-key
```

### Theme Configuration

The application supports light and dark themes. Theme preferences are stored in localStorage.

## 🐛 Troubleshooting

### Common Issues

1. **Form Validation Errors**
   - Ensure all required fields are filled
   - Check that conditions are logically valid
   - Verify that actions are properly configured

2. **Performance Issues**
   - Clear browser cache
   - Check for memory leaks
   - Monitor component re-renders

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📢 Support

For support, please:

- Open an issue in the GitHub repository
- Provide detailed error messages
- Include relevant code snippets
- Specify the version of the application

## 🔍 Technical Details

### Performance Optimization

- Code splitting with React.lazy()
- Memoization with React.memo()
- Virtual scrolling for large lists
- Lazy loading of images

### Security Features

- Input sanitization
- XSS protection
- CSRF protection
- Rate limiting

### Testing Strategy

- Unit tests for core components
- Integration tests for form flows
- E2E tests for critical paths
- Performance benchmarks
