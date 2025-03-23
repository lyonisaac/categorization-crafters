# Categorization Crafters

A modern web application for creating and managing categorization rules using React, TypeScript, and shadcn/ui.

## Features

- Rule creation and management with a step-by-step form
- Interactive rule actions configuration
- Modern UI components built with shadcn/ui
- Real-time validation and feedback
- Responsive design for all devices

## Tech Stack

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

## Getting Started

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

## Project Structure

```
categorization-crafters/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── styles/         # Global styles and Tailwind configuration
├── public/             # Static assets
└── package.json        # Project dependencies and scripts
```

## Development

### Available Scripts

- `npm run dev` - Starts the development server with hot reload
- `npm run build` - Creates a production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code formatting and style checks

### Development Guidelines

1. All components should be TypeScript-first
2. Use shadcn/ui components for consistent UI
3. Follow React best practices
4. Write descriptive commit messages
5. Keep the codebase clean and maintainable

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
