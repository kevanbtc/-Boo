'use client';

import { useState } from 'react';

export default function Refer() {
  const [code, setCode] = useState('');

  const generateCode = () => {
    const newCode = Math.random().toString(36).substring(2, 15);
    setCode(newCode);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Refer & Earn</h1>
      <button onClick={generateCode} className="bg-purple-500 px-4 py-2 rounded">Generate Referral Code</button>
      {code && <p className="mt-4">Your code: {code}</p>}
    </div>
  );
}