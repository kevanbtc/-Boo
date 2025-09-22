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
        className="text-xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Spooky fun on Polygon
      </motion.p>
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
        <Link href="/buy" className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded transition">Buy $BOO</Link>
        <Link href="/refer" className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded transition">Refer & Earn</Link>
        <Link href="/quests" className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded transition">Quests</Link>
        <Link href="/stake" className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded transition">Stake</Link>
        <Link href="/airdrop" className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded transition">Airdrop</Link>
        <Link href="/leaderboard" className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded transition">Leaderboard</Link>
        <Link href="/transparency" className="bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded transition">Transparency</Link>
      </motion.div>
    </div>
  );
}