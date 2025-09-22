'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="halloween-bg min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Spooky Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl ghost-float">👻</div>
        <div className="absolute top-40 right-20 text-4xl ghost-float ghost-float-delay-1">🎃</div>
        <div className="absolute bottom-32 left-20 text-5xl ghost-float ghost-float-delay-2">🦇</div>
        <div className="absolute bottom-20 right-10 text-3xl ghost-float ghost-float-delay-05">🕷️</div>
        <div className="absolute top-1/2 left-1/4 text-4xl ghost-float ghost-float-delay-15">🕸️</div>
      </div>

      <motion.h1
        className="text-6xl md:text-8xl font-bold mb-4 halloween-text spooky-shadow relative z-10"
        style={{fontFamily: "'Creepster', cursive"}}
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1 }}
      >
        $BOO
      </motion.h1>

      <motion.div
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 halloween-text">Halloween Token</h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          The spookiest meme token on Polygon. 0.5% fees, 20% burned, tiered affiliates up to 3%, staking rewards, and NFT utilities. Join the Halloween revolution! 🦇
        </p>
      </motion.div>

      {/* Token Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="card-spooky p-4 rounded-lg">
          <div className="text-2xl font-bold halloween-text">1B</div>
          <div className="text-sm text-gray-300">Total Supply</div>
        </div>
        <div className="card-spooky p-4 rounded-lg">
          <div className="text-2xl font-bold halloween-text">20%</div>
          <div className="text-sm text-gray-300">Burn Rate</div>
        </div>
        <div className="card-spooky p-4 rounded-lg">
          <div className="text-2xl font-bold halloween-text">0.5%</div>
          <div className="text-sm text-gray-300">Trading Fee</div>
        </div>
        <div className="card-spooky p-4 rounded-lg">
          <div className="text-2xl font-bold halloween-text">3%</div>
          <div className="text-sm text-gray-300">Max Affiliate</div>
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
        <Link href="/early" className="boo-button px-6 py-3 rounded transition">Early Access</Link>
        <Link href="/refer" className="boo-button px-6 py-3 rounded transition">Refer & Earn</Link>
        <Link href="/quests" className="boo-button px-6 py-3 rounded transition">Quests</Link>
        <Link href="/stake" className="boo-button px-6 py-3 rounded transition">Stake</Link>
        <Link href="/airdrop" className="boo-button px-6 py-3 rounded transition">Airdrop</Link>
        <Link href="/leaderboard" className="boo-button px-6 py-3 rounded transition">Leaderboard</Link>
        <Link href="/transparency" className="boo-button px-6 py-3 rounded transition">Transparency</Link>
      </motion.div>

      {/* Features */}
      <motion.div
        className="max-w-4xl mx-auto text-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <h2 className="text-3xl font-bold mb-6 halloween-text">Why $BOO?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-spooky p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2 halloween-text">🔥 Deflationary Burns</h3>
            <p className="text-gray-300">20% of every trade is burned forever, increasing scarcity and value.</p>
          </div>
          <div className="card-spooky p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2 halloween-text">👻 Affiliate Program</h3>
            <p className="text-gray-300">Earn 1.5-3% commissions based on your referral volume. Higher tiers for bigger contributors.</p>
          </div>
          <div className="card-spooky p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2 halloween-text">🎁 Staking Rewards</h3>
            <p className="text-gray-300">Lock $BOO for 7-31 days to earn APR up to 25%, with Halloween NFT boosts.</p>
          </div>
        </div>
      </motion.div>

      {/* Spooky Footer */}
      <motion.div
        className="mt-16 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <p className="text-lg halloween-text spooky-shadow">
          🎃 Beware the BOO! The Halloween spirit lives on Polygon. 🎃
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Built with ❤️ for the crypto Halloween community
        </p>
      </motion.div>
    </div>
  );
}