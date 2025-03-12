import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';

// 服务器端获取数据
export async function getServerSideProps() {
  try {
    const dataFile = path.join(process.cwd(), 'data', 'waitlist.json');
    
    if (!fs.existsSync(dataFile)) {
      return { props: { emails: [] } };
    }
    
    const data = fs.readFileSync(dataFile, 'utf8');
    const emails = JSON.parse(data);
    
    return {
      props: {
        emails
      }
    };
  } catch (error) {
    console.error('Error reading waitlist data:', error);
    return {
      props: {
        emails: [],
        error: 'Failed to load waitlist data'
      }
    };
  }
}

interface ViewWaitlistProps {
  emails: string[];
  error?: string;
}

export default function ViewWaitlist({ emails, error }: ViewWaitlistProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Head>
        <title>AImaker Waitlist - Admin View</title>
        <meta name="description" content="View AImaker waitlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">AImaker Waitlist</h1>
        <p className="text-xl mb-8">Current waitlist members</p>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded mb-6 w-full">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded p-6 w-full">
          <h2 className="text-xl font-semibold mb-4">Total: {emails.length} emails</h2>
          
          <div className="overflow-auto max-h-96">
            {emails.length === 0 ? (
              <p className="text-gray-500">No emails in the waitlist yet.</p>
            ) : (
              <ul className="space-y-2">
                {emails.map((email, index) => (
                  <li key={index} className="p-2 bg-gray-50 rounded">
                    {email}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 