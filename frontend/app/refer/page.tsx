'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, REFERRAL_REGISTRY_ABI } from '../../lib/contracts';

export default function Refer() {
  const { address } = useAccount();
  const [code, setCode] = useState('');
  const { writeContract } = useWriteContract();

  const generateCode = () => {
    const newCode = Math.random().toString(36).substring(2, 15);
    setCode(newCode);
  };

  const registerCode = () => {
    if (!code) return;
    writeContract({
      address: CONTRACT_ADDRESSES.ReferralRegistry,
      abi: REFERRAL_REGISTRY_ABI,
      functionName: 'register',
      args: [code as `0x${string}`], // bytes32
    });
  };

  // Read stats
  const { data: stats } = useReadContract({
    address: CONTRACT_ADDRESSES.ReferralRegistry,
    abi: REFERRAL_REGISTRY_ABI,
    functionName: 'stats',
    args: [address!],
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Refer & Earn</h1>
      {!address ? (
        <p>Connect wallet to refer</p>
      ) : (
        <>
          <button onClick={generateCode} className="bg-purple-500 px-4 py-2 rounded mr-4">Generate Code</button>
          {code && (
            <>
              <label htmlFor="code" className="block">Referral Code</label>
              <input id="code" value={code} onChange={(e) => setCode(e.target.value)} className="text-black px-2 py-1 rounded" />
              <button onClick={registerCode} className="bg-green-500 px-4 py-2 rounded ml-4">Register Code</button>
            </>
          )}
          <div className="mt-8">
            <h2>Your Stats</h2>
            <p>Volume: {stats ? stats[0].toString() : '0'}</p>
            <p>Commission: {stats ? stats[1].toString() : '0'}</p>
          </div>
        </>
      )}
    </div>
  );
}