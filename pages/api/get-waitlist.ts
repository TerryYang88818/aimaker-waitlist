import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 一个简单的文件存储机制，不依赖数据库
const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist.json');

// 读取waitlist数据
const readWaitlistData = (): string[] => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading waitlist data:', error);
    return [];
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    console.log('Getting waitlist data');
    
    // 读取数据
    const waitlist = readWaitlistData();
    
    return res.status(200).json({ 
      success: true,
      data: waitlist,
      count: waitlist.length
    });
  } catch (error: any) {
    console.error('Error in get-waitlist:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'Something went wrong',
      error: error.message,
    });
  }
} 