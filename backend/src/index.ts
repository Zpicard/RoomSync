import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/error';
import authRoutes from './routes/auth.routes';
import householdRoutes from './routes/household.routes';
import taskRoutes from './routes/task.routes';
import guestRoutes from './routes/guest.routes';
import profileRoutes from './routes/profile.routes';
import quietTimeRoutes from './routes/quiet-time.routes';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/quiet-times', quietTimeRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 