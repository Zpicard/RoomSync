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
- SQLite Database
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

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/roommate-app.git
cd roommate-app
```

### 2. Backend Setup

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
DATABASE_URL="file:../dev.db"
JWT_SECRET="your-secret-key"
```

```bash
# Initialize the database
npx prisma generate
npx prisma migrate dev

# Start the backend server
npm run dev
```

### 3. Frontend Setup

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

### 4. Access the Application

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

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by the challenges of roommate coordination
