# RoomSync Frontend

This is the frontend application for RoomSync, built with React, TypeScript, and modern web technologies. It provides a beautiful, responsive, and intuitive user interface for managing roommate coordination.

## 🛠️ Technology Stack

### Core Technologies
- **React 18**: Latest version with concurrent features
- **TypeScript**: For type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: For smooth animations and transitions

### State Management & Data Fetching
- **React Query**: For server state management and data fetching
- **Context API**: For global state management
- **Socket.io-client**: For real-time updates

### UI Components & Styling
- **Heroicons**: For beautiful, consistent icons
- **Tailwind CSS**: Custom design system
- **CSS Modules**: For component-scoped styling
- **PostCSS**: For advanced CSS processing

### Development Tools
- **Vite**: For fast development and building
- **ESLint**: For code linting
- **Prettier**: For code formatting
- **TypeScript**: For static type checking

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── chores/         # Chore management
│   │   ├── guests/         # Guest scheduling
│   │   ├── quiet-time/     # Quiet time management
│   │   └── profiles/       # User profiles
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React Context providers
│   ├── api/                # API client and endpoints
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles
│   └── pages/              # Page components
├── public/                 # Static assets
└── tests/                  # Test files
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Configure the following variables:
   - `VITE_API_URL`: Backend API URL
   - `VITE_WS_URL`: WebSocket URL
   - `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 💻 Development Guidelines

### Component Structure
```typescript
// Example component structure
import React from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  // Props interface
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic

  return (
    // JSX
  );
};

export default Component;
```

### Styling Guidelines
- Use Tailwind CSS classes for styling
- Follow the design system color palette
- Maintain responsive design principles
- Use CSS modules for component-specific styles

### State Management
- Use React Query for server state
- Use Context API for global UI state
- Use local state for component-specific state
- Implement proper loading and error states

## 🎨 Design System

### Colors
```css
--primary: #10B981;
--secondary: #6366F1;
--accent: #F59E0B;
--background: #F9FAFB;
--text: #1F2937;
```

### Typography
- Headings: Inter
- Body: Inter
- Monospace: JetBrains Mono

### Spacing
- Base unit: 4px
- Spacing scale: 4, 8, 16, 24, 32, 48, 64

### Components
- Buttons
- Cards
- Forms
- Modals
- Navigation
- Tables

## 🔄 API Integration

### API Client Setup
```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

### API Endpoints
- Authentication
- User management
- Household management
- Chore management
- Guest scheduling
- Quiet time management

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 🔒 Security

- JWT token management
- Secure HTTP-only cookies
- XSS prevention
- CSRF protection
- Input sanitization

## 🚀 Performance Optimization

- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization

## 📦 Build & Deployment

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build:prod
```

### Deployment
- Vercel
- Netlify
- AWS Amplify
- GitHub Pages

## 🔍 Debugging

- React Developer Tools
- Redux DevTools
- Network monitoring
- Error tracking
- Performance profiling

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Query Documentation](https://react-query.tanstack.com/) 