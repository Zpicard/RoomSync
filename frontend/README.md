# RoomSync Frontend

This is the frontend application for RoomSync, built with React, TypeScript, and modern web technologies. It provides a beautiful, responsive, and intuitive user interface for managing roommate coordination.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   # Create a .env file in the frontend directory
   touch .env
   ```
   
   Add the following to your `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   ```

3. **Start Development Server**
   ```bash
   npm start
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
- Use Context API for global state (AuthContext)
- Use local state for component-specific state
- Implement proper loading and error states

## 🎨 Design System

### Colors
```css
--primary: #3B82F6;
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

## 📦 Project Structure
```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── context/       # Context providers
│   ├── api/           # API client
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── public/            # Static assets
├── .env              # Environment variables
└── package.json      # Dependencies
```

## 🛠️ Tech Stack
- React
- TypeScript
- Create React App
- Tailwind CSS
- Framer Motion
- Axios
- React Router
- React Hot Toast

## 📱 Features
- User Authentication
- Household Management
- Task Management
- Guest Announcements
- Quiet Time Scheduling
- Real-time Updates

## 🔄 API Integration

### API Client Setup
```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
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
npm start
```

### Production Build
```bash
npm run build
```

### Deployment
- Vercel
- Netlify
- AWS Amplify
- GitHub Pages

## 🔍 Debugging

- React Developer Tools
- Network monitoring
- Error tracking
- Performance profiling

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/) 