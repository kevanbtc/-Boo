'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { keccak256, encodeAbiParameters } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSearchParams } from 'next/navigation';
import { REFERRAL_REGISTRY_ABI, REFERRAL_REGISTRY_ADDRESS } from '../../lib/contracts';

export default function EarlyPage() {
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  const { writeContract: registerReferrer } = useWriteContract();

  useEffect(() => {
    if (isConnected && address && ref) {
      // Check if referrer is already set
      // If not, set it
      // But to simplify, assume set on button click or something
    }
  }, [isConnected, address, ref]);

  const handleSetReferrer = () => {
    if (ref && /^0x[a-fA-F0-9]{40}$/.test(ref)) {
      const code = keccak256(encodeAbiParameters([{ type: 'address' }], [ref as `0x${string}`]));
      registerReferrer({
        address: REFERRAL_REGISTRY_ADDRESS,
        abi: REFERRAL_REGISTRY_ABI,
        functionName: 'register',
        args: [code],
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-orange-400">Early Access to $BOO</h1>
        <p className="mb-6 text-lg">
          Get in early on the Halloween meme token. Buy with fiat or crypto, and if you have a referral link, register it to earn commissions on future trades.
        </p>

        {!isConnected ? (
          <div className="text-center mb-8">
            <p className="mb-4">Connect your wallet to get started</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-8">
            {ref && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Referral Detected</h2>
                <p className="mb-4">Referral Address: <span className="text-orange-400">{ref}</span></p>
                <p className="mb-4">Register this referrer to earn commissions on your future trades.</p>
                <button
                  onClick={handleSetReferrer}
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded transition"
                >
                  Register Referrer
                </button>
              </div>
            )}

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Buy with Fiat</h2>
              <p className="mb-4">Use these trusted onramps to buy crypto and then swap to $BOO.</p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => window.open('https://transak.com', '_blank')}
                  className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded transition"
                >
                  Buy with Transak
                </button>
                <button
                  onClick={() => window.open('https://wert.io', '_blank')}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded transition"
                >
                  Buy with Wert
                </button>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Swap Crypto to $BOO</h2>
              <p className="mb-4">If you already have crypto on Polygon, use these aggregators to swap to $BOO.</p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => window.open('https://0x.org', '_blank')}
                  className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded transition"
                >
                  Swap with 0x
                </button>
                <button
                  onClick={() => window.open('https://1inch.io', '_blank')}
                  className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded transition"
                >
                  Swap with 1inch
                </button>
                <button
                  onClick={() => window.open('https://quickswap.exchange', '_blank')}
                  className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded transition"
                >
                  QuickSwap (Polygon DEX)
                </button>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Buy crypto using fiat onramps above</li>
                <li>Bridge to Polygon network if needed</li>
                <li>Swap your crypto to $BOO using the aggregators</li>
                <li>If you have a referral link, register it above</li>
                <li>Start trading and earning from the deflationary mechanics!</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}