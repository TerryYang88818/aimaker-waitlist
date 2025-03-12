import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 一个简单的文件存储机制，不依赖数据库
const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist.json');

// 确保目录存在
const ensureDirectoryExists = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

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

// 保存waitlist数据
const saveWaitlistData = (emails: string[]) => {
  try {
    ensureDirectoryExists(DATA_FILE);
    fs.writeFileSync(DATA_FILE, JSON.stringify(emails, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving waitlist data:', error);
    return false;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  console.log('Simple join API called');
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid email is required' 
      });
    }

    console.log('Joining waitlist with email:', email);
    
    // 读取现有数据
    const waitlist = readWaitlistData();
    
    // 检查邮箱是否已存在
    if (waitlist.includes(email)) {
      return res.status(409).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }
    
    // 添加新邮箱
    waitlist.push(email);
    
    // 保存数据
    const saved = saveWaitlistData(waitlist);
    
    if (saved) {
      console.log('Successfully added email to waitlist:', email);
      return res.status(200).json({ 
        success: true,
        message: 'Successfully joined waitlist',
      });
    } else {
      throw new Error('Failed to save waitlist data');
    }
  } catch (error: any) {
    console.error('Error in simple-join:', error);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({ 
      success: false,
      message: 'Something went wrong',
      error: error.message,
    });
  }
} 