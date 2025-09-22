'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function BooLanding() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/70 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-400/30">🦇</span>
            <span className="font-black tracking-tight text-xl">$BOO</span>
            <span className="ml-3 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-300 ring-1 ring-inset ring-orange-500/30">Polygon</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm text-zinc-300">
            {[
              ["Early Access", "#early"],
              ["Refer & Earn", "#refer"],
              ["Quests", "#quests"],
              ["Stake", "#stake"],
              ["Airdrop", "#airdrop"],
              ["Leaderboard", "#leaderboard"],
              ["Transparency", "#transparency"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="hover:text-white transition-colors">{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-white/10 hover:bg-white/10">Docs</button>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent"/>
        <div className="mx-auto max-w-7xl px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                The <span className="text-orange-400">spookiest</span> meme token on Polygon
              </h1>
              <p className="mt-4 text-zinc-300 max-w-prose">
                0.5% fees, 20% burned, tiered affiliates up to 3%, staking rewards, and NFT utilities.
                Join the Halloween revolution! 🎃
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#early" className="rounded-2xl bg-orange-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-orange-400">Early Access</a>
                <a href="#refer" className="rounded-2xl bg-white/5 px-4 py-2 font-semibold ring-1 ring-inset ring-white/10 hover:bg-white/10">Refer & Earn</a>
                <a href="#stake" className="rounded-2xl bg-white/5 px-4 py-2 font-semibold ring-1 ring-inset ring-white/10 hover:bg-white/10">Stake</a>
              </div>
              <div className="mt-6 text-xs text-zinc-400">Built with ❤️ for the crypto Halloween community</div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 -z-10 bg-[conic-gradient(at_top,_#fb923c33,_#0000,_#fb923c22,_#0000)] blur-3xl"/>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {k: "1B", v: "Total Supply"},
                  {k: "20%", v: "Burn Rate"},
                  {k: "0.5%", v: "Trading Fee"},
                  {k: "3%", v: "Max Affiliate"},
                ].map((item) => (
                  <div key={item.v} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                    <div className="text-3xl font-extrabold">{item.k}</div>
                    <div className="mt-1 text-sm text-zinc-400">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why BOO */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-black">Why $BOO?</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
            <div className="text-lg font-semibold">🔥 Deflationary Burns</div>
            <p className="mt-2 text-zinc-300">20% of every trade is burned forever, increasing scarcity and value.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
            <div className="text-lg font-semibold">👻 Affiliate Program</div>
            <p className="mt-2 text-zinc-300">Earn 1.5–3% commissions based on your referral volume. Higher tiers for bigger contributors.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
            <div className="text-lg font-semibold">🎁 Staking Rewards</div>
            <p className="mt-2 text-zinc-300">Lock $BOO for 7–31 days to earn APR up to 25%, with Halloween NFT boosts.</p>
          </div>
        </div>
        <p className="mt-8 text-center text-zinc-300">🎃 Beware the BOO! The Halloween spirit lives on Polygon. 🎃</p>
      </section>

      {/* Sections grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { id: "early", title: "Early Access", desc: "Get whitelisted, onramp via card or crypto, and claim your personal link.", cta: "Start" },
            { id: "refer", title: "Refer & Earn", desc: "Tiered affiliates up to 3% with rolling 30‑day volume tiers.", cta: "Get Link" },
            { id: "quests", title: "Quests", desc: "Complete seasonal quests to earn points and redeem Halloween NFTs.", cta: "Play" },
            { id: "stake", title: "Stake", desc: "Lock BOO for 7/14/31 days and boost with Costume NFTs.", cta: "Stake Now" },
            { id: "airdrop", title: "Airdrop", desc: "Merkle claims for early community and affiliates.", cta: "Claim" },
            { id: "leaderboard", title: "Leaderboard", desc: "Top referrers and stakers win weekly prize drops.", cta: "View" },
          ].map((s) => (
            <a key={s.id} id={s.id} href={`/${s.id}`} className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-6 hover:bg-zinc-900 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
              <p className="mt-2 text-zinc-300">{s.desc}</p>
              <div className="mt-4 inline-flex rounded-xl bg-orange-500 px-3 py-1 text-sm font-semibold text-zinc-950">{s.cta}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Transparency */}
      <section id="transparency" className="border-t border-white/5 bg-black/40">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-black">Transparency</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <div className="text-sm text-zinc-400">Token Address</div>
              <div className="mt-1 font-mono text-sm break-all">0xYOUR_TOKEN_ADDRESS</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <div className="text-sm text-zinc-400">Referral Registry</div>
              <div className="mt-1 font-mono text-sm break-all">0xREFERRAL_REGISTRY</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <div className="text-sm text-zinc-400">Docs / GitHub</div>
              <div className="mt-1 text-sm"><a className="underline underline-offset-4" href="https://github.com/kevanbtc/-Boo" target="_blank" rel="noopener noreferrer">github.com/kevanbtc/-Boo</a></div>
            </div>
          </div>
          <p className="mt-6 text-zinc-400 text-sm">0.5% fee split: 40% LP / 20% Prize / 20% Affiliate / 20% Burn. Early‑unstake penalty burn: 5%.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-2 gap-4 items-center">
          <p className="text-sm text-zinc-400">© {new Date().getFullYear()} $BOO • Built on Polygon</p>
          <div className="flex md:justify-end gap-3 text-sm">
            <a href="#early" className="hover:text-white">Early Access</a>
            <a href="#refer" className="hover:text-white">Refer</a>
            <a href="#stake" className="hover:text-white">Stake</a>
            <a href="#airdrop" className="hover:text-white">Airdrop</a>
          </div>
        </div>
      </footer>
    </div>
  );
}