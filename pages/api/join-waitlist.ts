import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const user = await prisma.waitlistUser.create({
      data: { email },
    });

    return res.status(200).json({ message: 'Successfully joined waitlist' });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    return res.status(500).json({ message: 'Something went wrong' });
  }
} 