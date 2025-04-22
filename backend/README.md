# RoomSync Backend

This is the backend service for RoomSync, built with Node.js, Express, and TypeScript. It provides a robust API for managing roommate coordination, authentication, and real-time updates.

## 🛠️ Technology Stack

### Core Technologies
- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: For type safety
- **PostgreSQL**: Primary database
- **Prisma**: ORM for database operations

### Authentication & Security
- **JWT**: For authentication
- **bcrypt**: For password hashing
- **express-validator**: For input validation
- **helmet**: For security headers
- **cors**: For CORS management

### Real-time Features
- **Socket.io**: For real-time communication
- **Redis**: For session management (optional)

### Development Tools
- **nodemon**: For development
- **ESLint**: For code linting
- **Prettier**: For code formatting
- **Jest**: For testing

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   └── config/            # Configuration
├── prisma/                # Database schema
├── tests/                 # Test files
└── uploads/               # File uploads
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
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret for JWT tokens
   - `PORT`: Server port
   - `NODE_ENV`: Environment (development/production)

3. **Set Up Database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
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
POST /api/auth/logout       # User logout
GET  /api/auth/me          # Get current user
```

### Household Management
```
POST   /api/households           # Create household
GET    /api/households/:id       # Get household
PUT    /api/households/:id       # Update household
DELETE /api/households/:id       # Delete household
POST   /api/households/:id/join  # Join household
```

### Chore Management
```
POST   /api/chores              # Create chore
GET    /api/chores/household/:id # Get household chores
PUT    /api/chores/:id          # Update chore
DELETE /api/chores/:id          # Delete chore
```

### Guest Management
```
POST   /api/guests              # Create guest event
GET    /api/guests/household/:id # Get household guests
PUT    /api/guests/:id          # Update guest event
DELETE /api/guests/:id          # Delete guest event
```

### Quiet Time Management
```
POST   /api/quiet-times         # Create quiet time
GET    /api/quiet-times/household/:id # Get household quiet times
PUT    /api/quiet-times/:id     # Update quiet time
DELETE /api/quiet-times/:id     # Delete quiet time
```

## 🔒 Security Implementation

### Authentication Flow
1. User registers/logs in
2. Server validates credentials
3. JWT token generated and sent
4. Token stored in HTTP-only cookie
5. Token validated on protected routes

### Password Security
```typescript
// Password hashing
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

## 📊 Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  username      String    @unique
  password      String
  householdId   String?
  household     Household? @relation(fields: [householdId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Household Model
```prisma
model Household {
  id        String   @id @default(uuid())
  name      String
  users     User[]
  chores    Chore[]
  guests    GuestEvent[]
  quietTimes QuietTime[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔄 Real-time Features

### WebSocket Events
```typescript
// Server-side
io.on('connection', (socket) => {
  socket.on('join-household', (householdId) => {
    socket.join(`household:${householdId}`);
  });

  socket.on('new-chore', (data) => {
    io.to(`household:${data.householdId}`).emit('chore-added', data);
  });
});
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### Test Coverage
```bash
npm run test:coverage
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

## 🔍 Monitoring & Logging

- Error tracking
- Performance monitoring
- Request logging
- Database query logging
- WebSocket event logging

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Documentation](https://jwt.io/introduction) 