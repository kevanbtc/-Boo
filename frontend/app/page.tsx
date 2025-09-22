import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-4">$BOO Halloween Token</h1>
      <p className="text-xl mb-8">Spooky fun on Polygon</p>
      <div className="space-x-4">
        <Link href="/buy" className="bg-orange-500 px-6 py-3 rounded">Buy $BOO</Link>
        <Link href="/refer" className="bg-purple-500 px-6 py-3 rounded">Refer & Earn</Link>
        <Link href="/quests" className="bg-green-500 px-6 py-3 rounded">Quests</Link>
        <Link href="/stake" className="bg-blue-500 px-6 py-3 rounded">Stake</Link>
      </div>
    </div>
  );
}