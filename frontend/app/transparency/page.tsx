'use client';

import { CONTRACT_ADDRESSES } from '../../lib/contracts';

export default function Transparency() {
  const contracts = Object.entries(CONTRACT_ADDRESSES);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Transparency</h1>
      <p>All contracts are verified on Polygonscan. View source code and transactions.</p>
      <div className="mt-8">
        {contracts.map(([name, address]) => (
          <div key={name} className="mb-4">
            <h2 className="text-xl">{name}</h2>
            <a
              href={`https://polygonscan.com/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              {address}
            </a>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2>GitHub Repo</h2>
        <a href="https://github.com/kevanbtc/-Boo" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
          https://github.com/kevanbtc/-Boo
        </a>
      </div>
    </div>
  );
}