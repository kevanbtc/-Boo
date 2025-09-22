# $BOO Halloween Token

![BOO Logo](https://img.shields.io/badge/BOO-Halloween-orange?style=for-the-badge&logo=ghost&logoColor=white)

A deflationary meme token on Polygon featuring burns, tiered affiliates, staking rewards, and NFT utilities. Built for the Halloween season with spooky fun and serious DeFi mechanics.

## 🚀 Features

- **🔥 Deflationary Burns**: 20% of every trade is permanently burned
- **👻 Tiered Affiliates**: Earn 1.5-3% commissions based on referral volume
- **🎁 Staking Rewards**: Lock BOO for 7-31 days, earn up to 25% APR + NFT boosts
- **🎨 NFT Utilities**: Halloween-themed costumes with staking multipliers
- **📊 Full Transparency**: Live KPIs, on-chain stats, and contract verification
- **🌐 Multi-Platform**: Fiat onramps, DEX aggregators, and seamless wallet integration

## 🏗️ Architecture

### Smart Contracts (Solidity 0.8.24)
- **BooToken**: ERC20 with custom hooks for fees and referrals
- **FeeRouter**: Distributes fees (40% LP, 20% Prize, 20% Affiliate, 20% Burn)
- **ReferralRegistry**: EIP-712 signatures, tiered commission tracking
- **StakingManager**: Time-locked staking with early unstake penalties
- **BooCostumeNFT**: ERC1155 costumes for staking boosts
- **BooPoints**: On-chain points system for engagement rewards
- **AirdropMerkle**: Gas-efficient token claims via Merkle proofs
- **LaunchGuard**: Anti-bot protection with max transaction limits

### Frontend (Next.js 14 + TypeScript)
- **Wallet Integration**: RainbowKit + Wagmi for seamless Web3 UX
- **Responsive Design**: Tailwind CSS with Framer Motion animations
- **Real-time Data**: Live contract reads for stats and user data
- **Referral System**: Shareable links with commission tracking
- **Early Access**: Integrated fiat/crypto onramps and swap aggregators

## 📊 Tokenomics

- **Total Supply**: 1,000,000,000 BOO
- **Trading Fee**: 0.5% (40/20/20/20 split: LP/Prize/Affiliate/Burn)
- **Burn Mechanism**: 20% of fees + 5% early unstake penalty
- **Affiliate Tiers**:
  - 0-10K BOO volume: 1.5%
  - 10K-50K BOO volume: 2.0%
  - 50K+ BOO volume: 3.0%
- **Staking APR**: 7% (7d) → 12% (14d) → 25% (31d) + NFT boosts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Foundry (for contracts)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/kevanbtc/-Boo.git
cd -Boo

# Install frontend dependencies
cd frontend
npm install

# Install contract dependencies
cd ..
forge install
```

### Development

```bash
# Start frontend dev server
cd frontend
npm run dev

# Build contracts
forge build

# Run tests
forge test
```

### Deployment

```bash
# Set environment variables
export POLYGON_AMOY_RPC_URL="https://rpc-amoy.polygon.technology"
export PRIVATE_KEY="0xYOUR_PRIVATE_KEY"
export POLYGONSCAN_API_KEY="YOUR_API_KEY"

# Deploy to Amoy testnet
forge script script/00_DeployAll.s.sol --rpc-url $POLYGON_AMOY_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $POLYGONSCAN_API_KEY
```

## 🎃 Usage

1. **Connect Wallet**: Use the connect button to link your Web3 wallet
2. **Get Early Access**: Visit `/early` for fiat/crypto buying guides
3. **Refer Friends**: Generate referral codes at `/refer` to earn commissions
4. **Stake BOO**: Lock tokens at `/stake` for rewards and NFT boosts
5. **Claim Airdrops**: Use Merkle proofs at `/airdrop` for token claims
6. **View Stats**: Check live data at `/transparency`

## 🔒 Security

- **Audited Contracts**: OpenZeppelin battle-tested components
- **Time-Locked Admin**: Critical functions require timelock delays
- **Merkle Airdrops**: Gas-efficient and sybil-resistant distributions
- **Launch Protection**: Anti-bot measures with transaction limits

## 📈 Roadmap

- [ ] Amoy testnet deployment and testing
- [ ] Mainnet launch on Polygon
- [ ] DEX listings (QuickSwap, Uniswap V3)
- [ ] NFT marketplace integration
- [ ] Cross-chain expansion
- [ ] Governance token implementation

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 👻 Disclaimer

This is a meme token for entertainment purposes. DYOR and invest responsibly. Not financial advice.

---

Built with ❤️ for the Halloween spirit. Boo! 👻

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
