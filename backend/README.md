# RoomSync Backend

This is the backend service for RoomSync, built with Node.js, Express, and TypeScript. It provides a robust API for managing roommate coordination, authentication, and real-time updates.

## 🛠️ Technology Stack

### Core Technologies
- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: For type safety
- **Prisma**: ORM for database operations
- **PostgreSQL**: Database

### Authentication & Security
- **JWT**: For authentication
- **bcrypt**: For password hashing
- **express-validator**: For input validation
- **cors**: For CORS management

### Development Tools
- **nodemon**: For development
- **TypeScript**: For type safety
- **Prisma**: For database operations

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── routes/            # API routes
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── prisma/                # Database schema
└── .env                   # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v14 or higher)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   # Create a .env file in the backend directory
   touch .env
   ```
   
   Add the following to your `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/roomsync?schema=public"
   JWT_SECRET="your-secret-key"
   PORT=8080
   NODE_ENV=development
   ```

3. **Initialize Database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations to create the PostgreSQL database
   npx prisma migrate dev
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 💻 API Endpoints

### Authentication
```
POST /api/auth/register     # Register new user
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user
```

### Household Management
```
POST   /api/households           # Create household
GET    /api/households           # Get all households
GET    /api/households/:id       # Get household details
POST   /api/households/join      # Join household
POST   /api/households/:id/leave # Leave household
POST   /api/households/:id/disband # Disband household
POST   /api/households/:id/transfer-ownership # Transfer ownership
POST   /api/households/:id/kick/:memberId # Kick member
POST   /api/households/:id/invite # Invite member
```

### Task Management
```
POST   /api/tasks              # Create task
GET    /api/tasks/household/:id # Get household tasks
PATCH  /api/tasks/:id/status   # Update task status
PATCH  /api/tasks/:id/assign   # Assign task
DELETE /api/tasks/:id          # Delete task
```

### Guest Management
```
POST   /api/guests              # Create guest announcement
GET    /api/guests/household/:id # Get household guest announcements
PATCH  /api/guests/:id          # Update guest announcement
DELETE /api/guests/:id          # Delete guest announcement
```

### Quiet Time Management
```
POST   /api/quiet-times         # Create quiet time
GET    /api/quiet-times/household/:id # Get household quiet times
DELETE /api/quiet-times/:id     # Delete quiet time
```

## 🔒 Security Implementation

### Authentication Flow
1. User registers/logs in
2. Server validates credentials
3. JWT token generated and sent
4. Token stored in localStorage
5. Token validated on protected routes

### Password Security
```typescript
// Password hashing using bcrypt
const hashedPassword = await bcrypt.hash(password, 10);

// Password verification
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Input Validation
```typescript
// Example validation middleware
const validateUser = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('username').isLength({ min: 3 })
];
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

## 📦 Deployment

### Production Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deployment Options
- Heroku
- DigitalOcean
- AWS
- Google Cloud Platform

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) 