'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white flex flex-col items-center justify-center">
      <motion.h1
        className="text-6xl font-bold mb-4 text-orange-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        $BOO Halloween Token
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        The spookiest meme token on Polygon. 0.5% fees, 20% burned, tiered affiliates up to 3%, staking rewards, and NFT utilities. Join the Halloween revolution!
      </motion.p>

      {/* Token Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-400">1B</div>
          <div className="text-sm">Total Supply</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400">20%</div>
          <div className="text-sm">Burn Rate</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">0.5%</div>
          <div className="text-sm">Trading Fee</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">3%</div>
          <div className="text-sm">Max Affiliate</div>
        </div>
      </motion.div>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <ConnectButton />
      </motion.div>
      <motion.div
        className="space-x-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <Link href="/early" className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded transition">Early Access</Link>
        <Link href="/refer" className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded transition">Refer & Earn</Link>
        <Link href="/quests" className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded transition">Quests</Link>
        <Link href="/stake" className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded transition">Stake</Link>
        <Link href="/airdrop" className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded transition">Airdrop</Link>
        <Link href="/leaderboard" className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded transition">Leaderboard</Link>
        <Link href="/transparency" className="bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded transition">Transparency</Link>
      </motion.div>

      {/* Features */}
      <motion.div
        className="max-w-4xl mx-auto text-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <h2 className="text-3xl font-bold mb-6">Why $BOO?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-orange-400">🔥 Deflationary Burns</h3>
            <p>20% of every trade is burned forever, increasing scarcity and value.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-purple-400">👻 Affiliate Program</h3>
            <p>Earn 1.5-3% commissions based on your referral volume. Higher tiers for bigger contributors.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-blue-400">🎁 Staking Rewards</h3>
            <p>Lock $BOO for 7-31 days to earn APR up to 25%, with Halloween NFT boosts.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}