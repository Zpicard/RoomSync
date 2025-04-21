# RoomSync Backend

This is the backend server for RoomSync, built with Express.js, TypeScript, and SQLite (using Prisma ORM).

## Features

- User authentication (register, login)
- Household management (create, invite members)
- Cleaning task management (create, assign, update status)
- Guest announcements (create, update, delete)
- User profile management (update profile, avatar)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- SQLite

## Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL="file:../dev.db"
   JWT_SECRET="your-secret-key"
   PORT=8080
   ```

4. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Running the Server

Development mode with hot reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Households
- `POST /api/households` - Create a new household
- `POST /api/households/:householdId/invite` - Invite member to household
- `POST /api/households/invite/:inviteId/respond` - Respond to household invite

### Tasks
- `POST /api/tasks` - Create a new cleaning task
- `GET /api/tasks/household/:householdId` - Get household tasks
- `PATCH /api/tasks/:taskId/status` - Update task status
- `DELETE /api/tasks/:taskId` - Delete task

### Guest Announcements
- `POST /api/guests` - Create guest announcement
- `GET /api/guests/household/:householdId` - Get household announcements
- `PATCH /api/guests/:announcementId` - Update announcement
- `DELETE /api/guests/:announcementId` - Delete announcement

### Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile
- `PATCH /api/profile/avatar` - Update avatar

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── routes/        # API routes
│   └── index.ts       # Entry point
├── prisma/
│   └── schema.prisma  # Database schema
├── uploads/
│   └── avatars/       # User avatar storage
└── package.json
```

## Error Handling

The API uses a centralized error handling mechanism. All errors are formatted as:
```json
{
  "error": "Error message"
}
```

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Development

To start Prisma Studio (database GUI):
```bash
npx prisma studio
```

The server will be running on http://localhost:3000 