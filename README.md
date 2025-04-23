# RoomSync - Roommate Coordination App

RoomSync is a web application designed to help roommates coordinate tasks, manage shared spaces, and communicate effectively. It provides features for task management, guest announcements, quiet time scheduling, and more.

## 🚀 Features

- **User Authentication**: Secure login and registration
- **Household Management**: Create, join, and manage households
- **Task Management**: Assign and track cleaning tasks
- **Guest Announcements**: Notify roommates about upcoming guests
- **Quiet Time Scheduling**: Coordinate study and quiet hours
- **Real-time Updates**: Stay informed about household activities

## 🛠️ Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL Database
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React
- TypeScript
- Create React App
- Tailwind CSS
- Framer Motion
- Axios
- React Router
- React Hot Toast

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v14 or higher)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/roommate-app.git
cd roommate-app
```

### 2. Start PostgreSQL

```bash
# Start PostgreSQL service
brew services start postgresql@14

# Create the database
createdb roomsync
```

### 3. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file
touch .env
```

Add the following to your `.env` file:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/roomsync?schema=public"
JWT_SECRET="your-secret-key"
PORT=8080
NODE_ENV=development
```

```bash
# Initialize the database
npx prisma generate
npx prisma migrate dev

# Start the backend server
npm run dev
```

### 4. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env file
touch .env
```

Add the following to your `.env` file:
```
REACT_APP_API_URL=http://localhost:8080/api
```

```bash
# Start the frontend development server
npm start
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
roommate-app/
├── backend/              # Backend server
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Custom middleware
│   │   ├── routes/      # API routes
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── .env             # Environment variables
│
├── frontend/             # Frontend application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   ├── api/         # API client
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   ├── public/          # Static assets
│   └── .env             # Environment variables
│
└── README.md             # Project documentation
```

## 🔒 Security

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Secure HTTP headers

## 📱 Responsive Design

The application is designed to work seamlessly across devices:
- Mobile-first approach
- Responsive breakpoints for all screen sizes
- Touch-friendly interface

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
```

## 📚 Additional Resources

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [API Documentation](./backend/README.md#-api-endpoints)


