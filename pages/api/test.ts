import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 允许所有请求方法
  console.log('Test API called');
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);
  
  return res.status(200).json({
    success: true,
    message: 'Test API is working',
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasDbUrl: !!process.env.DATABASE_URL,
    },
    request: {
      method: req.method,
      body: req.body,
      headers: {
        contentType: req.headers['content-type'],
      },
    },
  });
} 