import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [waitlist, setWaitlist] = useState<string[]>([]);

  // 从localStorage加载数据
  useEffect(() => {
    try {
      const savedWaitlist = localStorage.getItem('aimaker-waitlist');
      if (savedWaitlist) {
        setWaitlist(JSON.parse(savedWaitlist));
      }
    } catch (error) {
      console.error('Failed to load waitlist from localStorage:', error);
    }
  }, []);

  // 保存数据到localStorage
  const saveToLocalStorage = (emails: string[]) => {
    try {
      localStorage.setItem('aimaker-waitlist', JSON.stringify(emails));
      return true;
    } catch (error) {
      console.error('Failed to save waitlist to localStorage:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 重置状态
    setStatus('loading');
    setMessage('');
    setErrorDetails(null);
    
    console.log('Submitting form with email:', email);

    try {
      // 验证邮箱
      if (!email || !email.includes('@')) {
        throw new Error('Valid email is required');
      }

      // 检查是否已存在
      if (waitlist.includes(email)) {
        setStatus('error');
        setMessage('Email already registered');
        return;
      }

      // 添加到waitlist
      const newWaitlist = [...waitlist, email];
      const saved = saveToLocalStorage(newWaitlist);
      
      if (saved) {
        setWaitlist(newWaitlist);
        setStatus('success');
        setMessage('Thanks for joining our waitlist!');
        setEmail('');
      } else {
        throw new Error('Failed to save email');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to join waitlist');
      if (error instanceof Error) {
        setErrorDetails(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Head>
        <title>AImaker Waitlist</title>
        <meta name="description" content="Join the AImaker waitlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">AImaker</h1>
        <p className="text-xl mb-8">Join our waitlist to get early access</p>
        
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
            
            {status === 'success' && (
              <p className="text-green-500 text-sm mt-4">{message}</p>
            )}
            
            {status === 'error' && (
              <div className="text-red-500 text-sm mt-4">
                <p>{message}</p>
                {errorDetails && (
                  <details className="mt-2">
                    <summary>Error details</summary>
                    <pre className="text-xs text-left mt-1 p-2 bg-red-50 rounded overflow-auto">
                      {errorDetails}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </form>
        </div>

        {/* 添加一个查看按钮，显示当前的waitlist */}
        <button
          onClick={() => window.location.href = '/view-waitlist'}
          className="mt-4 text-blue-500 hover:text-blue-700"
        >
          View Waitlist
        </button>
      </main>
    </div>
  );
} 