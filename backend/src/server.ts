import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple TypeScript interface
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Test route with TypeScript
app.get('/api/test', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'TypeScript MERN backend is working!',
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`🚀 TypeScript Server running on port ${PORT}`);
  console.log(`📁 Visit: http://localhost:${PORT}/api/test`);
});