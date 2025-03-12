import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// 为了调试，让我们打印出环境变量
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 输出请求信息，用于调试
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Attempting to connect to database...');
    await prisma.$connect();
    console.log('Successfully connected to database');

    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    console.log('Attempting to create user with email:', email);
    
    const user = await prisma.waitlistUser.create({
      data: { email },
    });

    console.log('Successfully created user:', user);
    
    return res.status(200).json({ 
      success: true,
      message: 'Successfully joined waitlist',
      user 
    });
  } catch (error: any) {
    console.error('Error in join-waitlist:', error);
    // 打印完整的错误堆栈
    console.error('Error stack:', error.stack);
    
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    if (error.code === 'P1001') {
      return res.status(500).json({
        success: false,
        message: 'Database connection error',
        error: 'Could not connect to database'
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Something went wrong',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    try {
      await prisma.$disconnect();
      console.log('Disconnected from database');
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
} 