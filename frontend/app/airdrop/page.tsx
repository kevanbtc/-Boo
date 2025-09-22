'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, AIRDROP_MERKLE_ABI } from '../../lib/contracts';

export default function Airdrop() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [proof, setProof] = useState('');
  const { writeContract } = useWriteContract();

  const { data: claimed } = useReadContract({
    address: CONTRACT_ADDRESSES.AirdropMerkle,
    abi: AIRDROP_MERKLE_ABI,
    functionName: 'claimed',
    args: [address!],
  });

  const claim = () => {
    if (!amount || !proof) return;
    const proofArray = proof.split(',').map(p => p.trim() as `0x${string}`);
    writeContract({
      address: CONTRACT_ADDRESSES.AirdropMerkle,
      abi: AIRDROP_MERKLE_ABI,
      functionName: 'claim',
      args: [address!, BigInt(amount), proofArray],
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Airdrop Claim</h1>
      {claimed ? (
        <p>You have already claimed your airdrop.</p>
      ) : (
        <>
          <label htmlFor="amount" className="block">Amount</label>
          <input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-black px-2 py-1 rounded mb-4" />
          <label htmlFor="proof" className="block">Merkle Proof (comma separated)</label>
          <textarea id="proof" value={proof} onChange={(e) => setProof(e.target.value)} className="text-black px-2 py-1 rounded w-full mb-4" />
          <button onClick={claim} className="bg-blue-500 px-4 py-2 rounded">Claim</button>
        </>
      )}
    </div>
  );
}