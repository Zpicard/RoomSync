import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || authHeader !== 'password') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  next();
};

// Protected route example
app.get('/api/protected', authenticateRequest, (req, res) => {
  res.json({ message: 'You have access to protected data' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 