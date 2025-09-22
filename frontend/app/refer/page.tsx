'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-purple-400">Refer & Earn</h1>
        <p className="mb-6 text-lg">
          Share $BOO with friends and earn commissions on their trades. Higher referral volume unlocks better commission rates!
        </p>

        {!address ? (
          <div className="text-center">
            <p className="mb-4">Connect your wallet to start referring</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Generate/Register Code */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Your Referral Code</h2>
              <button onClick={generateCode} className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded transition mb-4">
                Generate New Code
              </button>
              {code && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium mb-2">Referral Code</label>
                    <input
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full text-black px-3 py-2 rounded"
                      placeholder="Enter or generate a code"
                    />
                  </div>
                  <button onClick={registerCode} className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded transition">
                    Register Code
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Your Referral Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{stats ? Number(stats[0]) / 1e18 : '0'}</div>
                  <div className="text-sm">Total Volume (BOO)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{stats ? Number(stats[1]) / 1e18 : '0'}</div>
                  <div className="text-sm">Commission Earned (BOO)</div>
                </div>
              </div>
            </div>

            {/* Commission Tiers */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Commission Tiers</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span>0 - 10,000 BOO volume</span>
                  <span className="text-green-400 font-bold">1.5% commission</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span>10,000 - 50,000 BOO volume</span>
                  <span className="text-green-400 font-bold">2.0% commission</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span>50,000+ BOO volume</span>
                  <span className="text-green-400 font-bold">3.0% commission</span>
                </div>
              </div>
            </div>

            {/* Share Link */}
            {code && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Share Your Link</h2>
                <p className="mb-4">Share this link with friends to earn commissions:</p>
                <div className="bg-gray-700 p-3 rounded font-mono text-sm break-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/early?ref=${address}` : ''}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/early?ref=${address}`)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded transition"
                >
                  Copy Link
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}