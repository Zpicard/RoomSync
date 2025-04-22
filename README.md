# RoomSync - Modern Roommate Coordination Platform

RoomSync is a comprehensive web application designed to streamline roommate coordination and enhance living arrangements. It provides an intuitive platform for managing shared responsibilities, scheduling quiet hours, coordinating guest visits, and maintaining clear communication among roommates.

## 🌟 Key Features

- **Smart Dashboard**: Central hub for all household activities and upcoming events
- **Chore Management**: Automated chore rotation and tracking system
- **Guest Coordination**: Easy scheduling and management of guest visits
- **Quiet Time Scheduling**: Coordinate study sessions and quiet hours
- **Profile Management**: Individual profiles with preferences and statistics
- **Real-time Updates**: Instant notifications for household activities
- **Responsive Design**: Seamless experience across all devices

## 🚀 How It Works

RoomSync operates on a modern client-server architecture:
- Frontend: React-based SPA with real-time updates
- Backend: Node.js/Express API with PostgreSQL database
- Authentication: JWT-based secure authentication
- Real-time: WebSocket integration for live updates

## 💻 Technologies Used

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for data fetching
- Socket.io-client for real-time features

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Prisma ORM
- JWT Authentication
- Socket.io for real-time communication

## 🛠️ Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/roomsync.git
   cd roomsync
   ```

2. **Set Up Environment**
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Configure your environment variables

3. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

4. **Start Development Servers**
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server (in a new terminal)
   cd frontend
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Using RoomSync

1. **Create an Account**
   - Sign up with email or social login
   - Create or join a household

2. **Set Up Your Household**
   - Add roommate information
   - Configure household preferences
   - Set up chore rotation

3. **Start Managing**
   - Schedule chores
   - Plan guest visits
   - Coordinate quiet hours
   - Track household activities

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Secure password hashing
- HTTPS encryption
- Input validation and sanitization

## 🌐 Deployment

The application can be deployed using:
- Frontend: Vercel, Netlify, or any static hosting
- Backend: Heroku, DigitalOcean, or AWS
- Database: Managed PostgreSQL service

## 📚 Documentation

For detailed documentation, please refer to:
- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Heroicons](https://heroicons.com/)
- Avatars by [DiceBear](https://www.dicebear.com/)
- Design inspiration from modern web applications
